-- Correcting a saved evaluation.
--
-- Finalising an evaluation moves a child's competencies: two "Tercapai" raise a level, a BT/MB
-- raises repeat_count and can trip the intervention alarm. Until now a misclick was permanent and
-- could only be undone with direct SQL.
--
-- Inverting that arithmetic afterwards is guesswork, because the same end state can be reached from
-- several starting points. So instead the rows are photographed just before they are changed, and
-- reopening restores the photograph exactly.
create table public.session_competency_snapshots(
  session_student_id uuid not null references public.session_students(id) on delete cascade,
  subject text not null,
  current_level integer not null,
  target integer not null,
  evidence_count integer not null,
  repeat_count integer not null,
  intervention boolean not null,
  primary key(session_student_id,subject)
);
alter table public.session_competency_snapshots enable row level security;
-- No policies and no grants: only the security-definer functions below ever touch this table.

-- Take the photograph. Called at the start of finalising, before anything moves. "on conflict do
-- nothing" keeps the earliest photograph when both the four-argument wrapper and the three-argument
-- worker run for the same evaluation.
create function public.snapshot_competencies(p_id uuid) returns void language plpgsql security definer set search_path=public as $$
begin
  insert into session_competency_snapshots(session_student_id,subject,current_level,target,evidence_count,repeat_count,intervention)
  select p_id,c.subject,c.current_level,c.target,c.evidence_count,c.repeat_count,c.intervention
    from student_competencies c
    join session_students r on r.id=p_id
   where c.student_id=r.student_id and c.active
  on conflict do nothing;
end $$;
revoke execute on function public.snapshot_competencies(uuid) from public,anon,authenticated;

create or replace function public.finalize_competency_evaluation(p_id uuid,p_assessments jsonb,p_anecdote text,p_observation jsonb) returns void language plpgsql security definer set search_path=public as $$
declare r session_students; english_value text; dimensions text[];
begin
  if not can_access_session(p_id) then raise exception 'Akses ditolak'; end if;
  select * into r from session_students where id=p_id for update;
  if r.finalized_at is not null then return; end if;
  perform snapshot_competencies(p_id);
  if r.attendance='Hadir' then
    english_value:=nullif(coalesce(p_observation->>'english_rating',''),'');
    if english_value is not null and english_value not in ('BT','MB','T') then raise exception 'Observasi Bahasa Inggris tidak valid'; end if;
    select coalesce(array_agg(value),array[]::text[]) into dimensions
      from jsonb_array_elements_text(coalesce(p_observation->'character_dimensions','[]'::jsonb));
    if not dimensions <@ array['kemandirian','tanggung_jawab','kerja_sama','kepedulian','komunikasi_santun']::text[] then raise exception 'Dimensi karakter tidak valid'; end if;
    insert into session_observations(session_student_id,english_rating,english_note,character_dimensions,character_note)
      values(p_id,english_value,left(coalesce(p_observation->>'english_note',''),1000),dimensions,left(coalesce(p_observation->>'character_note',''),1000))
    on conflict(session_student_id) do update set english_rating=excluded.english_rating,english_note=excluded.english_note,
      character_dimensions=excluded.character_dimensions,character_note=excluded.character_note;
    if english_value is not null then
      update student_competencies set
        current_level=case when english_value='T' and evidence_count+1>=2 then least(current_level+1,target) else current_level end,
        evidence_count=case when english_value='T' then case when evidence_count+1>=2 then 0 else evidence_count+1 end else evidence_count end,
        repeat_count=case when english_value='T' then 0 else repeat_count+1 end,
        intervention=false,updated_at=now()
      where student_id=r.student_id and subject='english' and active;
    end if;
  end if;
  perform public.finalize_competency_evaluation(p_id,p_assessments,p_anecdote);
end $$;

create or replace function public.finalize_competency_evaluation(p_id uuid,p_assessments jsonb,p_anecdote text) returns void language plpgsql security definer set search_path=public as $$
declare r session_students; s students; item jsonb; expected_count integer; submitted_count integer; derived_grade text; max_repeats integer; needs_help boolean;
begin
  if not can_access_session(p_id) then raise exception 'Akses ditolak'; end if;
  select * into r from session_students where id=p_id for update;
  if r.finalized_at is not null then return; end if;
  if length(coalesce(p_anecdote,''))>3000 then raise exception 'Catatan maksimal 3000 karakter'; end if;
  select * into s from students where id=r.student_id for update;
  if s.status<>'Aktif' then raise exception 'Siswa tidak aktif'; end if;
  perform snapshot_competencies(p_id);
  if r.attendance='Hadir' then
    if jsonb_typeof(p_assessments)<>'array' then raise exception 'Asesmen tidak valid'; end if;
    select count(*) into expected_count from session_assessments where session_student_id=p_id;
    select count(distinct value->>'subject') into submitted_count from jsonb_array_elements(p_assessments);
    if expected_count=0 or submitted_count<>expected_count or jsonb_array_length(p_assessments)<>expected_count then raise exception 'Lengkapi semua target kompetensi'; end if;
    for item in select value from jsonb_array_elements(p_assessments) loop
      if coalesce(item->>'rating','') not in ('BT','MB','T') then raise exception 'Pilih perkembangan setiap kompetensi'; end if;
      update session_assessments set rating=item->>'rating',evidence_note=left(coalesce(item->>'note',''),1000)
        where session_student_id=p_id and subject=item->>'subject';
      if not found then raise exception 'Target kompetensi tidak tersedia'; end if;
      update student_competencies set
        current_level=case when item->>'rating'='T' and evidence_count+1>=2 then least(current_level+1,target) else current_level end,
        evidence_count=case when item->>'rating'='T' then case when evidence_count+1>=2 then 0 else evidence_count+1 end else evidence_count end,
        repeat_count=case when item->>'rating'='T' then 0 else repeat_count+1 end,
        intervention=case when item->>'rating'='T' then false else repeat_count+1>=3 end,
        updated_at=now()
      where student_id=s.id and subject=item->>'subject' and active;
    end loop;
    update students set
      reading_level=(select current_level from student_competencies where student_id=s.id and subject='reading'),
      math_level=(select current_level from student_competencies where student_id=s.id and subject='math')
    where id=s.id;
    select case when bool_and(rating='T') then 'SB' when bool_or(rating='BT') then 'MB' else 'BSH' end into derived_grade
      from session_assessments where session_student_id=p_id;
    select coalesce(max(repeat_count),0),coalesce(bool_or(intervention),false) into max_repeats,needs_help
      from student_competencies where student_id=s.id and active and required;
    insert into student_alerts(student_id,repeat_count,reading_level,math_level,intervention)
      values(s.id,max_repeats,(select reading_level from students where id=s.id),(select math_level from students where id=s.id),needs_help)
    on conflict(student_id) do update set repeat_count=excluded.repeat_count,reading_level=excluded.reading_level,math_level=excluded.math_level,intervention=excluded.intervention,updated_at=now();
  end if;
  update session_students set grade=case when attendance='Hadir' then derived_grade else null end,anecdote=coalesce(p_anecdote,''),finalized_at=now() where id=p_id;
end $$;

-- Put an evaluation back into editing and restore the competencies it moved.
--
-- Only the child's newest finalised evaluation can be reopened. Restoring an older photograph would
-- silently throw away everything recorded after it, so that is refused rather than guessed at.
create function public.reopen_evaluation(p_id uuid) returns void language plpgsql security definer set search_path=public as $$
declare r session_students; s students; max_repeats integer; needs_help boolean;
begin
  if not can_access_session(p_id) then raise exception 'Akses ditolak'; end if;
  if is_owner() then raise exception 'Pemilik hanya membaca. Koreksi dilakukan oleh guru pendamping.'; end if;
  select * into r from session_students where id=p_id for update;
  if r.finalized_at is null then raise exception 'Evaluasi ini belum disimpan'; end if;
  select * into s from students where id=r.student_id for update;
  if s.status='Lulus' then raise exception 'Siswa sudah lulus; koreksi evaluasi tidak lagi mengubah apa pun'; end if;
  if exists(select 1 from session_students o where o.student_id=r.student_id and o.id<>p_id and o.finalized_at>r.finalized_at) then
    raise exception 'Hanya evaluasi terakhir anak ini yang bisa dibuka kembali. Buka evaluasi yang lebih baru lebih dulu.';
  end if;
  if exists(select 1 from session_students o where o.student_id=r.student_id and o.finalized_at is null) then
    raise exception 'Selesaikan dulu evaluasi sesi yang masih terbuka untuk anak ini';
  end if;

  update student_competencies c set
    current_level=p.current_level,target=p.target,evidence_count=p.evidence_count,
    repeat_count=p.repeat_count,intervention=p.intervention,updated_at=now()
  from session_competency_snapshots p
  where p.session_student_id=p_id and c.student_id=r.student_id and c.subject=p.subject and c.active;

  update students set
    reading_level=coalesce((select current_level from student_competencies where student_id=s.id and subject='reading'),reading_level),
    math_level=coalesce((select current_level from student_competencies where student_id=s.id and subject='math'),math_level)
  where id=s.id;

  select coalesce(max(repeat_count),0),coalesce(bool_or(intervention),false) into max_repeats,needs_help
    from student_competencies where student_id=s.id and active and required;
  insert into student_alerts(student_id,repeat_count,reading_level,math_level,intervention)
    values(s.id,max_repeats,(select reading_level from students where id=s.id),(select math_level from students where id=s.id),needs_help)
  on conflict(student_id) do update set repeat_count=excluded.repeat_count,reading_level=excluded.reading_level,
    math_level=excluded.math_level,intervention=excluded.intervention,updated_at=now();

  delete from session_competency_snapshots where session_student_id=p_id;
  -- The ratings stay on session_assessments so the teacher reopens onto what they typed before.
  update session_students set finalized_at=null,grade=null where id=p_id;
end $$;
revoke execute on function public.reopen_evaluation(uuid) from public,anon;
grant execute on function public.reopen_evaluation(uuid) to authenticated;
