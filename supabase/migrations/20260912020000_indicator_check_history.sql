-- Ticks on the evaluation card used to live only in the page and vanished when it closed.
-- Teachers need them across sessions: two "Tercapai" on different occasions is what raises a level,
-- so which indicator was already seen, and when, is part of that decision.
-- The indicator text is copied in at tick time, so history stays readable after the owner edits the
-- curriculum wording.
create table public.session_indicator_checks (
  session_student_id uuid not null references public.session_students(id) on delete cascade,
  subject text not null check(subject in ('listening','speaking','reading','writing','math','ipas','english')),
  indicator_index integer not null check(indicator_index between 1 and 6),
  level_snapshot integer not null check(level_snapshot between 1 and 16),
  indicator_text text not null default '' check(length(indicator_text)<=500),
  checked_at timestamptz not null default now(),
  primary key(session_student_id,subject,indicator_index)
);

create index session_indicator_checks_record_idx on public.session_indicator_checks(session_student_id);

alter table public.session_indicator_checks enable row level security;
create policy indicator_checks_read on public.session_indicator_checks
  for select to authenticated using(can_access_session(session_student_id));
grant select on public.session_indicator_checks to authenticated;

-- Ticking is a teacher's own record of what they saw, so it is saved as it happens rather than only
-- at finalisation: a teacher may tick during the activity and finish the evaluation afterwards.
create or replace function public.set_indicator_check(p_id uuid, p_subject text, p_index integer, p_checked boolean, p_text text)
returns void language plpgsql security definer set search_path=public as $$
declare r session_students; v_level integer;
begin
  if not can_access_session(p_id) then raise exception 'Akses ditolak'; end if;
  select * into r from session_students where id=p_id for update;
  if r.finalized_at is not null then raise exception 'Evaluasi sudah disimpan'; end if;
  if r.attendance<>'Hadir' then raise exception 'Anak tidak hadir pada sesi ini'; end if;
  if p_index is null or p_index<1 or p_index>6 then raise exception 'Indikator tidak dikenal'; end if;
  select level_snapshot into v_level from session_assessments where session_student_id=p_id and subject=p_subject;
  if not found then raise exception 'Bidang bukan target sesi ini'; end if;
  if p_checked then
    insert into session_indicator_checks(session_student_id,subject,indicator_index,level_snapshot,indicator_text)
    values(p_id,p_subject,p_index,v_level,left(coalesce(p_text,''),500))
    on conflict(session_student_id,subject,indicator_index)
      do update set indicator_text=excluded.indicator_text, level_snapshot=excluded.level_snapshot, checked_at=now();
  else
    delete from session_indicator_checks
      where session_student_id=p_id and subject=p_subject and indicator_index=p_index;
  end if;
end $$;

revoke execute on function public.set_indicator_check(uuid,text,integer,boolean,text) from public,anon;
grant execute on function public.set_indicator_check(uuid,text,integer,boolean,text) to authenticated;
