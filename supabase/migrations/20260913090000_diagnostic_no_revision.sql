-- Tes diagnostik tanpa revisi (keputusan pemilik 13 Sep 2026): satu tes final per anak, hanya menentukan
-- level awal. Tes kedua ditolak; salah input diperbaiki dengan menghapus siswa lalu menambah ulang.
create or replace function public.save_diagnostic(p_student uuid, p_level integer, p_results jsonb, p_note text)
returns integer language plpgsql security definer set search_path=public as $$
declare
  v_test uuid;
  v_passed boolean;
  v_final integer;
begin
  if is_owner() or not can_teach(p_student) then raise exception 'Tes diagnostik dilakukan oleh guru pendamping'; end if;
  perform 1 from students where id = p_student and status = 'Aktif' for update;
  if not found then raise exception 'Hanya anak aktif yang bisa dites'; end if;
  if exists (select 1 from diagnostic_tests where student_id = p_student) then
    raise exception 'Anak ini sudah dites diagnostik. Hasil tes tidak bisa diubah.';
  end if;
  if p_level is null or p_level not between 1 and 4 then raise exception 'Level yang dites harus Level 1–4'; end if;
  if jsonb_typeof(p_results) <> 'array' then raise exception 'Hasil tes tidak valid'; end if;
  if exists (select 1 from jsonb_array_elements(p_results) r
             where coalesce(r->>'rating', '') not in ('T','B','N')
                or coalesce(r->>'level', '') <> p_level::text
                or coalesce(r->>'number', '') !~ '^[0-9]{1,2}$'
                or not exists (select 1 from curriculum_level_indicators i
                               where i.level = p_level and i.number = (r->>'number')::int)) then
    raise exception 'Hasil tes hanya boleh berisi indikator Level % dengan nilai yang dikenal', p_level;
  end if;
  if (select count(*) from jsonb_array_elements(p_results)) <>
     (select count(distinct r->>'number') from jsonb_array_elements(p_results) r) then
    raise exception 'Satu indikator dinilai lebih dari sekali';
  end if;
  if (select count(*) from jsonb_array_elements(p_results) r where (r->>'number')::int between 1 and 6) < 6 then
    raise exception 'Indikator 1–6 Level % belum selesai dinilai', p_level;
  end if;
  if length(coalesce(p_note, '')) > 1500 then raise exception 'Catatan tes maksimal 1500 karakter'; end if;

  v_passed := (select count(*) from jsonb_array_elements(p_results) r
               where (r->>'number')::int between 1 and 6 and r->>'rating' = 'T') = 6;
  v_final := case when v_passed then least(p_level + 1, 4) else p_level end;

  insert into diagnostic_tests(student_id, teacher_id, tested_level, passed, final_level, note)
  values (p_student, auth.uid(), p_level, v_passed, v_final, trim(coalesce(p_note, '')))
  returning id into v_test;
  insert into diagnostic_results(test_id, level, indicator_number, rating, indicator_text)
  select v_test, p_level, (r->>'number')::int, r->>'rating', i.text
  from jsonb_array_elements(p_results) r
  join curriculum_level_indicators i on i.level = p_level and i.number = (r->>'number')::int;

  update students set pilot_level = v_final where id = p_student;
  return v_final;
end $$;
revoke execute on function public.save_diagnostic(uuid, integer, jsonb, text) from public, anon;
grant execute on function public.save_diagnostic(uuid, integer, jsonb, text) to authenticated;

alter table public.diagnostic_tests drop column if exists revised_at;
