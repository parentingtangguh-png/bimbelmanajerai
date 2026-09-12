-- Cancelling a class opened by mistake.
--
-- Until now a session could never be removed, and that mattered more than it sounds: a child with an
-- unevaluated session cannot join another class, cannot be deactivated, and cannot be deleted. So one
-- wrong click locked every child in it until the teacher marked them all absent and closed the
-- session off, leaving a fake sitting in the history for good.
--
-- Only an untouched session can go. Once any child's evaluation is saved the session is part of that
-- child's record and of the competency movement it caused, so it stays.
create function public.delete_class(p_session uuid) returns void language plpgsql security definer set search_path=public as $$
declare c class_sessions;
begin
  if is_owner() then raise exception 'Pemilik tidak membuka atau membatalkan kelas'; end if;
  select * into c from class_sessions where id=p_session for update;
  if not found or not is_member() or c.teacher_id<>auth.uid() then raise exception 'Akses ditolak'; end if;
  if exists(select 1 from session_students where session_id=p_session and finalized_at is not null) then
    raise exception 'Sesi ini sudah punya evaluasi tersimpan, jadi tidak bisa dibatalkan. Buka kembali evaluasinya lebih dulu bila ingin mengoreksi.';
  end if;
  -- ai_jobs and session_students are the two links without on-delete-cascade, so they go by hand;
  -- assessments, observations, indicator ticks and snapshots follow session_students on their own.
  delete from ai_jobs where session_student_id in (select id from session_students where session_id=p_session);
  delete from session_students where session_id=p_session;
  delete from class_sessions where id=p_session;
end $$;
revoke execute on function public.delete_class(uuid) from public,anon;
grant execute on function public.delete_class(uuid) to authenticated;
