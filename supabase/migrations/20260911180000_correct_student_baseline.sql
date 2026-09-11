-- Teachers may correct a student's starting level until the child first joins a
-- class; after that the baseline is the fixed reference for measuring progress.
-- The Bahasa Indonesia level also seeds listening, speaking, writing, IPAS and
-- English Exposure, matching initialize_student_competencies().
create function public.correct_student_baseline(p_student uuid,p_reading integer,p_math integer) returns void language plpgsql security definer set search_path=public as $$
begin
  if is_owner() or not can_teach(p_student) then raise exception 'Akses ditolak'; end if;
  if p_reading is null or p_math is null or p_reading not between 1 and 16 or p_math not between 1 and 16 then raise exception 'Level awal harus 1–16'; end if;
  perform 1 from students where id=p_student for update;
  if exists(select 1 from session_students where student_id=p_student) then
    raise exception 'Level awal hanya bisa dikoreksi sebelum anak mengikuti kelas';
  end if;
  update student_competencies set baseline=p_reading,current_level=p_reading,target=greatest(target,p_reading),
    evidence_count=0,repeat_count=0,intervention=false,updated_at=now()
  where student_id=p_student and subject in ('listening','speaking','reading','writing','ipas','english');
  update student_competencies set baseline=p_math,current_level=p_math,target=greatest(target,p_math),
    evidence_count=0,repeat_count=0,intervention=false,updated_at=now()
  where student_id=p_student and subject='math';
  update students set
    reading_baseline=p_reading,reading_level=p_reading,reading_target=greatest(reading_target,p_reading),
    math_baseline=p_math,math_level=p_math,math_target=greatest(math_target,p_math)
  where id=p_student;
end $$;
revoke execute on function public.correct_student_baseline(uuid,integer,integer) from public,anon;
grant execute on function public.correct_student_baseline(uuid,integer,integer) to authenticated;
