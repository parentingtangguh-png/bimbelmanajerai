-- Teachers may permanently delete a student they entered by mistake (duplicate
-- or wrong input) only while the child has never joined a class. Students with
-- class history keep their records; teachers set them to Non-Aktif instead.
create function public.delete_student(p_student uuid) returns void language plpgsql security definer set search_path=public as $$
begin
  if is_owner() or not can_teach(p_student) then raise exception 'Akses ditolak'; end if;
  perform 1 from students where id=p_student for update;
  if not found then raise exception 'Siswa tidak tersedia'; end if;
  if exists(select 1 from session_students where student_id=p_student) then
    raise exception 'Siswa yang sudah pernah ikut kelas tidak bisa dihapus. Ubah status menjadi Non-Aktif bila anak berhenti.';
  end if;
  if exists(select 1 from assignments where student_id=p_student and teacher_id<>auth.uid()) then
    raise exception 'Siswa ini juga didampingi guru lain, jadi tidak bisa dihapus.';
  end if;
  delete from schedule_students where student_id=p_student;
  delete from student_alerts where student_id=p_student;
  delete from student_competencies where student_id=p_student;
  delete from assignments where student_id=p_student;
  delete from students where id=p_student;
end $$;
revoke execute on function public.delete_student(uuid) from public,anon;
grant execute on function public.delete_student(uuid) to authenticated;
