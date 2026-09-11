-- Preserve the deployed 0800 migration and replace only the linted function.
create or replace function public.create_class(p_id uuid,p_date date,p_theme text,p_students uuid[],p_duration integer) returns uuid language plpgsql security definer set search_path=public as $$
declare
  sid uuid; rid uuid; s students; existing class_sessions; session_index integer;
  target_count integer; rotation text[]:=array['reading','math','writing','ipas','listening','speaking'];
  focus text[]:=array[]::text[];
begin
  if not is_member() then raise exception 'Akses ditolak'; end if;
  select * into existing from class_sessions where id=p_id;
  if found then
    if existing.teacher_id<>auth.uid() then raise exception 'Akses ditolak'; end if;
    return p_id;
  end if;
  if p_duration not in (60,75,90) then raise exception 'Durasi kelas harus 60, 75, atau 90 menit'; end if;
  if coalesce(array_length(p_students,1),0) not between 1 and 50 then raise exception 'Pilih 1–50 siswa'; end if;
  select count(*) into session_index from class_sessions where teacher_id=auth.uid();
  target_count:=case when p_duration=90 then 3 else 2 end;
  for focus_index in 0..target_count-1 loop
    focus:=array_append(focus,rotation[((session_index+focus_index) % array_length(rotation,1))+1]);
  end loop;
  insert into class_sessions(id,teacher_id,date,theme,duration_minutes) values(p_id,auth.uid(),p_date,trim(p_theme),p_duration);
  foreach sid in array p_students loop
    select * into s from students where id=sid for update;
    if not found or not can_teach(sid) or s.status<>'Aktif' then raise exception 'Siswa tidak tersedia'; end if;
    if exists(select 1 from session_students where student_id=sid and finalized_at is null) then raise exception 'Selesaikan sesi sebelumnya untuk %',s.name; end if;
    insert into session_students(session_id,student_id,reading_snapshot,math_snapshot)
      values(p_id,sid,s.reading_level,s.math_level) returning id into rid;
    insert into session_assessments(session_student_id,subject,level_snapshot)
      select rid,subject,current_level from student_competencies
      where student_id=sid and active and subject=any(focus);
    insert into session_observations(session_student_id) values(rid);
  end loop;
  with scores as (
    select r.id,avg(a.level_snapshot)::numeric as score
    from session_students r join session_assessments a on a.session_student_id=r.id
    where r.session_id=p_id group by r.id
  ), totals as (
    select count(*)::integer as n from scores
  ), grouped as (
    select scores.id,ntile(least(3,totals.n)) over(order by scores.score,scores.id) as group_no
    from scores cross join totals
  )
  update session_students r set group_no=grouped.group_no from grouped where r.id=grouped.id;
  insert into themes(name) values(trim(p_theme)) on conflict(name) do nothing;
  return p_id;
end $$;

revoke execute on function public.create_class(uuid,date,text,uuid[],integer) from public,anon;
grant execute on function public.create_class(uuid,date,text,uuid[],integer) to authenticated;
