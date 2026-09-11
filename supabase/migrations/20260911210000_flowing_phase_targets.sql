-- Teachers only set a starting point. Targets are no longer entered by hand:
-- every competency aims at the end of the phase its current level is in
-- (Fondasi 4, Fase A 8, Fase B 12, Fase C 16). Passing the phase summative moves
-- the target to the next phase end; passing at the end of Fase C graduates.
create function public.phase_end(p_level integer) returns integer language sql immutable set search_path=public as $$
  select least(16,((greatest(coalesce(p_level,1),1)-1)/4+1)*4)
$$;
revoke execute on function public.phase_end(integer) from public,anon;
grant execute on function public.phase_end(integer) to authenticated;

create function public.flow_student_targets() returns trigger language plpgsql set search_path=public as $$
begin
  new.reading_target:=phase_end(new.reading_level);
  new.math_target:=phase_end(new.math_level);
  return new;
end $$;
revoke execute on function public.flow_student_targets() from public,anon,authenticated;
create trigger flow_student_targets before insert on public.students
  for each row execute function public.flow_student_targets();

-- Recompute existing targets under the new rule.
update public.student_competencies set target=phase_end(current_level),updated_at=now() where active;
update public.students set reading_target=phase_end(reading_level),math_target=phase_end(math_level) where status<>'Lulus';

drop function if exists public.set_student_targets(uuid,jsonb);

create or replace function public.correct_student_baseline(p_student uuid,p_reading integer,p_math integer) returns void language plpgsql security definer set search_path=public as $$
begin
  if is_owner() or not can_teach(p_student) then raise exception 'Akses ditolak'; end if;
  if p_reading is null or p_math is null or p_reading not between 1 and 16 or p_math not between 1 and 16 then raise exception 'Level awal harus 1–16'; end if;
  perform 1 from students where id=p_student for update;
  if exists(select 1 from session_students where student_id=p_student) then
    raise exception 'Level awal hanya bisa dikoreksi sebelum anak mengikuti kelas';
  end if;
  update student_competencies set baseline=p_reading,current_level=p_reading,target=phase_end(p_reading),
    evidence_count=0,repeat_count=0,intervention=false,updated_at=now()
  where student_id=p_student and subject in ('listening','speaking','reading','writing','ipas','english');
  update student_competencies set baseline=p_math,current_level=p_math,target=phase_end(p_math),
    evidence_count=0,repeat_count=0,intervention=false,updated_at=now()
  where student_id=p_student and subject='math';
  update students set
    reading_baseline=p_reading,reading_level=p_reading,reading_target=phase_end(p_reading),
    math_baseline=p_math,math_level=p_math,math_target=phase_end(p_math)
  where id=p_student;
end $$;

create or replace function public.complete_summative(p_student uuid,p_score integer,p_pass boolean) returns void language plpgsql security definer set search_path=public as $$
declare final_phase boolean;
begin
  if is_owner() or not can_teach(p_student) then raise exception 'Hanya guru pendamping yang mencatat ujian sumatif'; end if;
  if p_score not between 1 and 100 then raise exception 'Nilai harus 1–100'; end if;
  if exists(select 1 from session_students where student_id=p_student and finalized_at is null) then raise exception 'Selesaikan sesi terbuka terlebih dahulu'; end if;
  if exists(select 1 from student_competencies where student_id=p_student and active and required and current_level<target) then raise exception 'Target kompetensi wajib belum tercapai'; end if;
  select not exists(select 1 from student_competencies where student_id=p_student and active and required and target<16) into final_phase;
  -- Passing a phase summative opens the next phase for every competency that reached its phase end.
  if p_pass and not final_phase then
    update student_competencies set target=phase_end(current_level+1),evidence_count=0,repeat_count=0,intervention=false,updated_at=now()
    where student_id=p_student and active and current_level>=target and target<16;
  end if;
  update students set
    reading_level=(select current_level from student_competencies where student_id=p_student and subject='reading'),
    math_level=(select current_level from student_competencies where student_id=p_student and subject='math'),
    reading_target=(select target from student_competencies where student_id=p_student and subject='reading'),
    math_target=(select target from student_competencies where student_id=p_student and subject='math'),
    summative_score=p_score,
    status=case when p_pass and final_phase then 'Lulus' else 'Aktif' end
  where id=p_student;
  if not found then raise exception 'Siswa tidak tersedia'; end if;
end $$;
