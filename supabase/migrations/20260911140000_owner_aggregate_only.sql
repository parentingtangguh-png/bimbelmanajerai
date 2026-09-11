-- Owners monitor aggregates and manage team/curriculum; teachers add students
-- and run classroom work. Reject owner writes at the database, not only in the UI.
create function public.reject_owner_classroom_write() returns trigger language plpgsql security definer set search_path=public as $$
begin
  if is_owner() then
    raise exception 'Pemilik hanya memantau data agregat. Siswa baru dan kegiatan kelas dikelola guru.';
  end if;
  return new;
end $$;
revoke execute on function public.reject_owner_classroom_write() from public,anon,authenticated;

-- Students are created by teachers through create_student(); no direct inserts.
drop policy if exists students_insert on public.students;
create trigger reject_owner_student_insert before insert on public.students
  for each row execute function public.reject_owner_classroom_write();

-- Opening a class and writing attendance/evaluations/AI output per child.
create trigger reject_owner_session_insert before insert on public.class_sessions
  for each row execute function public.reject_owner_classroom_write();
create trigger reject_owner_record_update before update on public.session_students
  for each row execute function public.reject_owner_classroom_write();
create trigger reject_owner_class_ai_job before insert on public.class_ai_jobs
  for each row execute function public.reject_owner_classroom_write();
create trigger reject_owner_ai_job before insert on public.ai_jobs
  for each row execute function public.reject_owner_classroom_write();
