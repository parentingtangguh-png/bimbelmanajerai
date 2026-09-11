-- Recurring teaching slots (e.g. "Sesi Pagi 08.00–09.30") that teachers set up
-- and fill with their students. Class sessions can remember which slot and
-- which start/end time they were opened for.
create table public.schedules(
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  name text not null check(length(trim(name)) between 1 and 60),
  start_time time not null,
  end_time time not null,
  created_at timestamptz not null default now(),
  check(end_time>start_time and end_time-start_time between interval '30 minutes' and interval '180 minutes')
);
create table public.schedule_students(
  schedule_id uuid not null references public.schedules(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  primary key(schedule_id,student_id)
);
alter table public.schedules enable row level security;
alter table public.schedule_students enable row level security;

-- Teachers manage their own slots; owners may read them for aggregates only.
create policy schedules_read on public.schedules for select to authenticated
  using(is_member() and (teacher_id=auth.uid() or is_owner()));
create policy schedules_write on public.schedules for all to authenticated
  using(is_member() and not is_owner() and teacher_id=auth.uid())
  with check(is_member() and not is_owner() and teacher_id=auth.uid());
create policy schedule_students_read on public.schedule_students for select to authenticated
  using(is_owner() or exists(select 1 from public.schedules s where s.id=schedule_id and s.teacher_id=auth.uid() and is_member()));
create policy schedule_students_write on public.schedule_students for all to authenticated
  using(exists(select 1 from public.schedules s where s.id=schedule_id and s.teacher_id=auth.uid() and is_member() and not is_owner()))
  with check(can_teach(student_id) and exists(select 1 from public.schedules s where s.id=schedule_id and s.teacher_id=auth.uid() and is_member() and not is_owner()));
grant select,insert,update,delete on public.schedules,public.schedule_students to authenticated;

alter table public.class_sessions
  add column schedule_id uuid references public.schedules(id) on delete set null,
  add column start_time time,
  add column end_time time;

-- class_sessions has no client update path, so link the slot through a checked RPC.
create function public.set_class_schedule(p_session uuid,p_schedule uuid) returns void language plpgsql security definer set search_path=public as $$
declare sc schedules;
begin
  if not exists(select 1 from class_sessions where id=p_session and teacher_id=auth.uid() and is_member()) then raise exception 'Akses ditolak'; end if;
  select * into sc from schedules where id=p_schedule and teacher_id=auth.uid();
  if not found then raise exception 'Sesi jadwal tidak tersedia'; end if;
  update class_sessions set schedule_id=sc.id,start_time=sc.start_time,end_time=sc.end_time where id=p_session;
end $$;
revoke execute on function public.set_class_schedule(uuid,uuid) from public,anon;
grant execute on function public.set_class_schedule(uuid,uuid) to authenticated;
