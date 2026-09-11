-- Teachers deactivate or reactivate their own students with a dedicated action.
-- A student with an open (unevaluated) class session cannot be deactivated,
-- because finalizing that session requires an active student.
create function public.set_student_active(p_student uuid,p_active boolean) returns void language plpgsql security definer set search_path=public as $$
declare current_status text;
begin
  if is_owner() or not can_teach(p_student) then raise exception 'Akses ditolak'; end if;
  select status into current_status from students where id=p_student for update;
  if not found then raise exception 'Siswa tidak tersedia'; end if;
  if current_status='Lulus' then raise exception 'Siswa sudah lulus; statusnya tidak diubah dari sini'; end if;
  if not p_active and exists(select 1 from session_students where student_id=p_student and finalized_at is null) then
    raise exception 'Selesaikan evaluasi sesi yang masih terbuka dulu sebelum menonaktifkan siswa';
  end if;
  update students set status=case when p_active then 'Aktif' else 'Non-Aktif' end where id=p_student;
end $$;
revoke execute on function public.set_student_active(uuid,boolean) from public,anon;
grant execute on function public.set_student_active(uuid,boolean) to authenticated;

-- Same guard on the profile path so no route can strand an open session.
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
  if next_status='Non-Aktif' and current_status<>'Non-Aktif' and exists(select 1 from session_students where student_id=p_student and finalized_at is null) then
    raise exception 'Selesaikan evaluasi sesi yang masih terbuka dulu sebelum menonaktifkan siswa';
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
