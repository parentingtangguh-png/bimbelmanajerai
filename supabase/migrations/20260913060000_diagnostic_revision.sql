-- Revisi hasil tes diagnostik (13 Sep 2026, keputusan pemilik):
-- * Tetap satu tes per anak, tetapi guru pendamping boleh merevisi hasilnya selama anak BELUM ikut
--   kelas pertama. Level awal ikut dihitung ulang. Setelah anak ikut kelas, hasil tes terkunci.
-- * Hanya hasil terakhir yang disimpan, beserta tanggal revisinya.
-- * Pemilik tetap hanya melihat ringkasan level awal.

alter table public.diagnostic_tests add column revised_at timestamptz;

create or replace function public.save_diagnostic(p_student uuid, p_start integer, p_results jsonb, p_summary text, p_note text, p_learning_notes text)
returns integer language plpgsql security definer set search_path=public as $$
declare
  s students;
  c boolean;
  l integer;
  visited integer[] := '{}';
  v_final integer;
  v_beyond boolean := false;
  v_locked boolean;
  v_test uuid;
begin
  if is_owner() or not can_teach(p_student) then raise exception 'Tes diagnostik dilakukan oleh guru pendamping'; end if;
  select * into s from students where id = p_student for update;
  if not found then raise exception 'Siswa tidak tersedia'; end if;
  if s.status <> 'Aktif' then raise exception 'Hanya anak aktif yang bisa dites'; end if;
  select id into v_test from diagnostic_tests where student_id = p_student;
  v_locked := exists (select 1 from session_students where student_id = p_student);
  if v_test is not null then
    -- Revisi: hanya sebelum kelas pertama, karena level awal hanya bermakna sebelum anak mulai belajar.
    if v_locked then raise exception 'Hasil tes diagnostik tidak bisa direvisi setelah anak mengikuti kelas'; end if;
  elsif trim(coalesce(s.diagnostic, '')) <> '' then
    raise exception 'Anak ini sudah pernah dites diagnostik';
  end if;
  if p_start is null or p_start not between 1 and 4 then raise exception 'Titik mulai harus Level 1–4'; end if;
  if jsonb_typeof(p_results) <> 'array' then raise exception 'Hasil tes tidak valid'; end if;
  if exists (select 1 from jsonb_array_elements(p_results) r
             where coalesce(r->>'rating', '') not in ('T','B','N')
                or coalesce(r->>'level', '') !~ '^[1-4]$'
                or coalesce(r->>'number', '') !~ '^[0-9]{1,2}$'
                or not exists (select 1 from curriculum_level_indicators i
                               where i.level = (r->>'level')::int and i.number = (r->>'number')::int)) then
    raise exception 'Hasil tes memuat nilai atau indikator yang tidak dikenal';
  end if;
  if (select count(*) from jsonb_array_elements(p_results)) <>
     (select count(distinct (r->>'level', r->>'number')) from jsonb_array_elements(p_results) r) then
    raise exception 'Satu indikator dinilai lebih dari sekali';
  end if;

  -- Jalur tes yang sama dengan aplikasi: naik selama tuntas; bila titik mulai belum tuntas, turun.
  c := diagnostic_level_complete(p_results, p_start);
  if c is null then raise exception 'Level % belum selesai dinilai', p_start; end if;
  visited := array[p_start];
  if c then
    v_final := 4; v_beyond := true;
    for l in p_start + 1 .. 4 loop
      c := diagnostic_level_complete(p_results, l);
      if c is null then raise exception 'Level % belum selesai dinilai', l; end if;
      visited := visited || l;
      if not c then v_final := l; v_beyond := false; exit; end if;
    end loop;
  else
    v_final := 1;
    for l in reverse p_start - 1 .. 1 loop
      c := diagnostic_level_complete(p_results, l);
      if c is null then raise exception 'Level % belum selesai dinilai', l; end if;
      visited := visited || l;
      if c then v_final := l + 1; exit; end if;
    end loop;
  end if;
  if exists (select 1 from jsonb_array_elements(p_results) r where not ((r->>'level')::int = any (visited))) then
    raise exception 'Hasil tes memuat level di luar jalur tes';
  end if;
  if position(('Level awal: ' || v_final) in coalesce(p_summary, '')) = 0 then
    raise exception 'Ringkasan tidak sesuai dengan level awal hasil tes';
  end if;
  if length(p_summary) > 3000 or length(coalesce(p_learning_notes, '')) > 3000 then raise exception 'Catatan maksimal 3000 karakter'; end if;

  if not v_locked then perform correct_student_baseline(p_student, v_final, v_final); end if;

  if v_test is null then
    insert into diagnostic_tests(student_id, teacher_id, start_level, final_level, beyond, level_locked, note)
    values (p_student, auth.uid(), p_start, v_final, v_beyond, v_locked, left(trim(coalesce(p_note, '')), 1500))
    returning id into v_test;
  else
    -- Hanya hasil terakhir yang disimpan; guru pengetes pertama tetap tercatat.
    update diagnostic_tests set start_level = p_start, final_level = v_final, beyond = v_beyond,
      level_locked = v_locked, note = left(trim(coalesce(p_note, '')), 1500), revised_at = now()
    where id = v_test;
    delete from diagnostic_results where test_id = v_test;
  end if;
  insert into diagnostic_results(test_id, level, indicator_number, rating, indicator_text)
  select v_test, (r->>'level')::int, (r->>'number')::int, r->>'rating', i.text
  from jsonb_array_elements(p_results) r
  join curriculum_level_indicators i on i.level = (r->>'level')::int and i.number = (r->>'number')::int;

  update students set diagnostic = p_summary, learning_notes = coalesce(p_learning_notes, '') where id = p_student;
  return v_final;
end $$;
revoke execute on function public.save_diagnostic(uuid, integer, jsonb, text, text, text) from public, anon;
grant execute on function public.save_diagnostic(uuid, integer, jsonb, text, text, text) to authenticated;
