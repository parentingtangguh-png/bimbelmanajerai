-- Tes diagnostik satu level (13 Sep 2026, keputusan pemilik), menggantikan jalur naik-turun otomatis:
-- * Guru menguji SATU level, lalu menyimpan. Satu tes per anak; revisi boleh sebelum kelas pertama.
-- * Lulus = indikator 1-6 semuanya Tercapai (T). English (7) dan Karakter (8) hanya dicatat.
-- * Lulus Level X  -> level awal X+1 (Level 4 lulus: tetap 4, melampaui Fondasi).
--   Belum lulus    -> level awal X.
-- * Status tampil di data siswa ("Lulus Level X" / "Belum lulus Level X"), juga untuk pemilik.
-- * Anak yang belum dites tidak bisa dimasukkan ke sesi kelas.

alter table public.students add column diagnostic_status text not null default ''
  check (diagnostic_status = '' or diagnostic_status ~ '^(Lulus|Belum lulus) Level [1-4]$' or diagnostic_status ~ '^Level awal [1-4]$');

alter table public.diagnostic_tests add column tested_level integer check (tested_level between 1 and 4);
alter table public.diagnostic_tests add column passed boolean;
-- Tes yang tersimpan sebelum aturan ini memakai jalur beberapa level; statusnya hanya menyebut level awal.
update public.students s set diagnostic_status = 'Level awal ' || t.final_level
from public.diagnostic_tests t where t.student_id = s.id and s.diagnostic_status = '';

create or replace function public.save_diagnostic(p_student uuid, p_start integer, p_results jsonb, p_summary text, p_note text, p_learning_notes text)
returns integer language plpgsql security definer set search_path=public as $$
declare
  s students;
  v_test uuid;
  v_locked boolean;
  v_passed boolean;
  v_final integer;
begin
  if is_owner() or not can_teach(p_student) then raise exception 'Tes diagnostik dilakukan oleh guru pendamping'; end if;
  select * into s from students where id = p_student for update;
  if not found then raise exception 'Siswa tidak tersedia'; end if;
  if s.status <> 'Aktif' then raise exception 'Hanya anak aktif yang bisa dites'; end if;
  select id into v_test from diagnostic_tests where student_id = p_student;
  v_locked := exists (select 1 from session_students where student_id = p_student);
  if v_test is not null then
    if v_locked then raise exception 'Hasil tes diagnostik tidak bisa direvisi setelah anak mengikuti kelas'; end if;
  elsif trim(coalesce(s.diagnostic, '')) <> '' then
    raise exception 'Anak ini sudah pernah dites diagnostik';
  end if;
  if p_start is null or p_start not between 1 and 4 then raise exception 'Level yang dites harus Level 1–4'; end if;
  if jsonb_typeof(p_results) <> 'array' then raise exception 'Hasil tes tidak valid'; end if;
  if exists (select 1 from jsonb_array_elements(p_results) r
             where coalesce(r->>'rating', '') not in ('T','B','N')
                or coalesce(r->>'level', '') <> p_start::text
                or coalesce(r->>'number', '') !~ '^[0-9]{1,2}$'
                or not exists (select 1 from curriculum_level_indicators i
                               where i.level = p_start and i.number = (r->>'number')::int)) then
    raise exception 'Hasil tes hanya boleh berisi indikator Level % dengan nilai yang dikenal', p_start;
  end if;
  if (select count(*) from jsonb_array_elements(p_results)) <>
     (select count(distinct r->>'number') from jsonb_array_elements(p_results) r) then
    raise exception 'Satu indikator dinilai lebih dari sekali';
  end if;
  if (select count(*) from jsonb_array_elements(p_results) r where (r->>'number')::int between 1 and 6) < 6 then
    raise exception 'Indikator 1–6 Level % belum selesai dinilai', p_start;
  end if;

  v_passed := (select count(*) from jsonb_array_elements(p_results) r
               where (r->>'number')::int between 1 and 6 and r->>'rating' = 'T') = 6;
  v_final := case when v_passed then least(p_start + 1, 4) else p_start end;
  if position(('Level awal: ' || v_final) in coalesce(p_summary, '')) = 0 then
    raise exception 'Ringkasan tidak sesuai dengan level awal hasil tes';
  end if;
  if length(p_summary) > 3000 or length(coalesce(p_learning_notes, '')) > 3000 then raise exception 'Catatan maksimal 3000 karakter'; end if;

  if not v_locked then perform correct_student_baseline(p_student, v_final, v_final); end if;

  if v_test is null then
    insert into diagnostic_tests(student_id, teacher_id, start_level, final_level, beyond, level_locked, note, tested_level, passed)
    values (p_student, auth.uid(), p_start, v_final, v_passed and p_start = 4, v_locked, left(trim(coalesce(p_note, '')), 1500), p_start, v_passed)
    returning id into v_test;
  else
    update diagnostic_tests set start_level = p_start, final_level = v_final, beyond = v_passed and p_start = 4,
      level_locked = v_locked, note = left(trim(coalesce(p_note, '')), 1500), tested_level = p_start, passed = v_passed,
      revised_at = now()
    where id = v_test;
    delete from diagnostic_results where test_id = v_test;
  end if;
  insert into diagnostic_results(test_id, level, indicator_number, rating, indicator_text)
  select v_test, p_start, (r->>'number')::int, r->>'rating', i.text
  from jsonb_array_elements(p_results) r
  join curriculum_level_indicators i on i.level = p_start and i.number = (r->>'number')::int;

  update students set diagnostic = p_summary, learning_notes = coalesce(p_learning_notes, ''),
    diagnostic_status = case when v_passed then 'Lulus' else 'Belum lulus' end || ' Level ' || p_start
  where id = p_student;
  return v_final;
end $$;
revoke execute on function public.save_diagnostic(uuid, integer, jsonb, text, text, text) from public, anon;
grant execute on function public.save_diagnostic(uuid, integer, jsonb, text, text, text) to authenticated;

-- Anak baru masuk kelas setelah satu kali tes diagnostik, apa pun hasilnya. Dijaga di sini supaya
-- berlaku untuk setiap jalan masuk ke sesi (create_class dan yang akan datang).
create function public.require_diagnostic_before_class() returns trigger language plpgsql set search_path=public as $$
declare v_name text; v_status text;
begin
  select name, diagnostic_status into v_name, v_status from students where id = new.student_id;
  if coalesce(v_status, '') = '' then
    raise exception 'Jalankan tes diagnostik untuk % sebelum ikut kelas', v_name;
  end if;
  return new;
end $$;
revoke execute on function public.require_diagnostic_before_class() from public, anon, authenticated;
create trigger require_diagnostic_before_class before insert on public.session_students
  for each row execute function public.require_diagnostic_before_class();
