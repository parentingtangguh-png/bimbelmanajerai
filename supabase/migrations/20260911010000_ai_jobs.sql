alter table ai_jobs add column requested_by uuid references profiles;
alter table ai_jobs add column attempts integer not null default 1;
create function public.claim_ai_job(p_record uuid,p_kind text) returns uuid language plpgsql security definer set search_path=public as $$
declare r session_students; j ai_jobs; job_id uuid;
begin
  if not can_access_session(p_record) then raise exception 'Akses ditolak'; end if;
  if p_kind not in ('material','report') then raise exception 'Jenis keluaran tidak valid'; end if;
  -- Serialize requests per user to enforce the daily limit, then per record.
  perform 1 from profiles where id=auth.uid() for update;
  select * into r from session_students where id=p_record for update;
  if r.attendance<>'Hadir' then raise exception 'Siswa absen tidak memerlukan AI'; end if;
  if p_kind='report' and r.finalized_at is null then raise exception 'Selesaikan evaluasi terlebih dahulu'; end if;
  if (p_kind='material' and r.material<>'') or (p_kind='report' and r.report<>'') then return null; end if;
  select * into j from ai_jobs where session_student_id=p_record and kind=p_kind;
  if j.status='running' and j.created_at>now()-interval '3 minutes' then raise exception 'Pembuatan AI sedang berlangsung, tunggu sebentar'; end if;
  if j.attempts>=5 then raise exception 'Batas percobaan AI untuk keluaran ini tercapai. Hubungi pemilik.'; end if;
  if (select coalesce(sum(attempts),0) from ai_jobs where requested_by=auth.uid() and created_at>now()-interval '24 hours')>=100 then raise exception 'Batas 100 permintaan AI harian tercapai'; end if;
  job_id:=gen_random_uuid();
  insert into ai_jobs(id,session_student_id,kind,requested_by) values(job_id,p_record,p_kind,auth.uid())
  on conflict(session_student_id,kind) do update set id=excluded.id,status='running',created_at=now(),requested_by=auth.uid(),attempts=ai_jobs.attempts+1;
  return job_id;
end $$;
create function public.finish_ai_job(p_job uuid,p_output text,p_failed boolean default false) returns boolean language plpgsql security definer set search_path=public as $$
declare j ai_jobs;
begin
  select * into j from ai_jobs where id=p_job and status='running' for update;
  if not found then return false; end if;
  if p_failed then update ai_jobs set status='failed' where id=p_job; return true; end if;
  if p_output is null or length(trim(p_output))<10 or length(p_output)>20000 then raise exception 'Output AI tidak valid'; end if;
  if not exists(select 1 from session_students where id=j.session_student_id and attendance='Hadir') then update ai_jobs set status='failed' where id=p_job; return false; end if;
  if j.kind='material' then update session_students set material=p_output where id=j.session_student_id;
  else update session_students set report=p_output where id=j.session_student_id and finalized_at is not null; end if;
  update ai_jobs set status='done' where id=p_job;
  return true;
end $$;
revoke execute on function claim_ai_job(uuid,text),finish_ai_job(uuid,text,boolean) from public,anon,authenticated;
grant execute on function claim_ai_job(uuid,text) to authenticated;
grant execute on function finish_ai_job(uuid,text,boolean) to service_role;
