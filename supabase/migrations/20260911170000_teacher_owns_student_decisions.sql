-- Teachers own their students: profile, status, competency targets, and the
-- summative/graduation decision. The owner only reads student data (plus
-- managing the team and curriculum), so every owner write path is removed.
drop policy if exists students_update on public.students;
drop policy if exists competencies_owner on public.student_competencies;
revoke update on public.student_competencies from authenticated;
drop policy if exists assignments_owner on public.assignments;
create policy assignments_owner_read on public.assignments for select to authenticated using(is_owner());

create or replace function public.update_student_profile(p_student uuid,p_payload jsonb) returns void language plpgsql security definer set search_path=public as $$
declare current_status text; next_status text;
begin
  if is_owner() then raise exception 'Pemilik hanya membaca data siswa. Perubahan dilakukan oleh guru pendamping.'; end if;
  if not can_teach(p_student) then raise exception 'Akses ditolak'; end if;
  if jsonb_typeof(p_payload)<>'object' then raise exception 'Data profil tidak valid'; end if;
  if length(trim(coalesce(p_payload->>'name',''))) not between 1 and 120 then raise exception 'Nama anak wajib diisi (maksimal 120 karakter)'; end if;
  if length(trim(coalesce(p_payload->>'parent_name',''))) not between 1 and 120 then raise exception 'Sapaan orang tua wajib diisi (maksimal 120 karakter)'; end if;
  if coalesce(p_payload->>'phone','') !~ '^[0-9+() -]{0,30}$' then raise exception 'Nomor WhatsApp hanya boleh berisi angka, spasi, +, -, dan tanda kurung'; end if;
  if length(coalesce(p_payload->>'interest',''))>300 then raise exception 'Minat maksimal 300 karakter'; end if;
  if length(coalesce(p_payload->>'diagnostic',''))>3000 or length(coalesce(p_payload->>'learning_notes',''))>3000 then raise exception 'Catatan maksimal 3000 karakter'; end if;
  select status into current_status from students where id=p_student;
  if not found then raise exception 'Siswa tidak tersedia'; end if;
  next_status:=coalesce(nullif(p_payload->>'status',''),current_status);
  if next_status not in ('Aktif','Non-Aktif','Lulus') or (next_status='Lulus' and current_status<>'Lulus') then
    raise exception 'Status hanya boleh Aktif atau Non-Aktif; kelulusan dicatat melalui ujian sumatif';
  end if;
  update students set
    name=trim(p_payload->>'name'),
    parent_name=trim(p_payload->>'parent_name'),
    phone=trim(coalesce(p_payload->>'phone','')),
    interest=coalesce(p_payload->>'interest',''),
    diagnostic=coalesce(p_payload->>'diagnostic',''),
    learning_notes=coalesce(p_payload->>'learning_notes',''),
    status=next_status
  where id=p_student;
end $$;

create function public.set_student_targets(p_student uuid,p_targets jsonb) returns void language plpgsql security definer set search_path=public as $$
declare item record; c student_competencies; target_level integer;
begin
  if is_owner() or not can_teach(p_student) then raise exception 'Akses ditolak'; end if;
  if jsonb_typeof(p_targets)<>'object' then raise exception 'Target tidak valid'; end if;
  for item in select key,value from jsonb_each(p_targets) loop
    select * into c from student_competencies where student_id=p_student and subject=item.key and active;
    if not found then raise exception 'Kompetensi % tidak tersedia',item.key; end if;
    if jsonb_typeof(item.value)<>'number' then raise exception 'Target % harus berupa angka',item.key; end if;
    target_level:=(item.value#>>'{}')::numeric::integer;
    if target_level<c.current_level or target_level>16 then
      raise exception 'Target % harus antara level saat ini (%) dan 16',item.key,c.current_level;
    end if;
    update student_competencies set target=target_level,updated_at=now() where student_id=p_student and subject=item.key;
    -- Keep the legacy core columns in sync for reading and math.
    if item.key='reading' then update students set reading_target=target_level where id=p_student;
    elsif item.key='math' then update students set math_target=target_level where id=p_student; end if;
  end loop;
end $$;
revoke execute on function public.set_student_targets(uuid,jsonb) from public,anon;
grant execute on function public.set_student_targets(uuid,jsonb) to authenticated;

create or replace function public.complete_summative(p_student uuid,p_score integer,p_pass boolean) returns void language plpgsql security definer set search_path=public as $$
begin
  if is_owner() or not can_teach(p_student) then raise exception 'Hanya guru pendamping yang mencatat ujian sumatif'; end if;
  if p_score not between 1 and 100 then raise exception 'Nilai harus 1–100'; end if;
  if exists(select 1 from session_students where student_id=p_student and finalized_at is null) then raise exception 'Selesaikan sesi terbuka terlebih dahulu'; end if;
  if exists(select 1 from student_competencies where student_id=p_student and active and required and current_level<target) then raise exception 'Target kompetensi wajib belum tercapai'; end if;
  update students set
    reading_level=(select current_level from student_competencies where student_id=p_student and subject='reading'),
    math_level=(select current_level from student_competencies where student_id=p_student and subject='math'),
    summative_score=p_score,status=case when p_pass then 'Lulus' else 'Aktif' end
  where id=p_student;
  if not found then raise exception 'Siswa tidak tersedia'; end if;
end $$;
