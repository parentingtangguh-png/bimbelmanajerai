-- Teachers may onboard a student into their own workspace; ownership is assigned atomically.
create or replace function public.create_student(p_payload jsonb) returns uuid language plpgsql security definer set search_path=public as $$
declare sid uuid;
begin
  if not is_member() then raise exception 'Akun tidak aktif'; end if;
  insert into students(name,parent_name,phone,interest,diagnostic,learning_notes,reading_baseline,reading_level,reading_target,math_baseline,math_level,math_target)
  values (trim(p_payload->>'name'),trim(p_payload->>'parent_name'),coalesce(p_payload->>'phone',''),trim(p_payload->>'interest'),coalesce(p_payload->>'diagnostic',''),coalesce(p_payload->>'learning_notes',''),greatest(1,least(10,(p_payload->>'reading_baseline')::int)),greatest(1,least(10,(p_payload->>'reading_baseline')::int)),greatest(1,least(10,(p_payload->>'reading_target')::int)),greatest(1,least(10,(p_payload->>'math_baseline')::int)),greatest(1,least(10,(p_payload->>'math_baseline')::int)),greatest(1,least(10,(p_payload->>'math_target')::int))) returning id into sid;
  if not is_owner() then insert into assignments(student_id,teacher_id) values(sid,auth.uid()); end if;
  return sid;
end $$;
grant execute on function public.create_student(jsonb) to authenticated;
