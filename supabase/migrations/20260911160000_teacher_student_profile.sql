-- Teachers may correct the general profile of their own students. Levels,
-- baselines, targets and status stay with the evaluation flow and the owner,
-- so only the listed fields are written and anything else in the payload is ignored.
create function public.update_student_profile(p_student uuid,p_payload jsonb) returns void language plpgsql security definer set search_path=public as $$
begin
  if not can_teach(p_student) then raise exception 'Akses ditolak'; end if;
  if jsonb_typeof(p_payload)<>'object' then raise exception 'Data profil tidak valid'; end if;
  if length(trim(coalesce(p_payload->>'name',''))) not between 1 and 120 then raise exception 'Nama anak wajib diisi (maksimal 120 karakter)'; end if;
  if length(trim(coalesce(p_payload->>'parent_name',''))) not between 1 and 120 then raise exception 'Sapaan orang tua wajib diisi (maksimal 120 karakter)'; end if;
  if coalesce(p_payload->>'phone','') !~ '^[0-9+() -]{0,30}$' then raise exception 'Nomor WhatsApp hanya boleh berisi angka, spasi, +, -, dan tanda kurung'; end if;
  if length(coalesce(p_payload->>'interest',''))>300 then raise exception 'Minat maksimal 300 karakter'; end if;
  if length(coalesce(p_payload->>'diagnostic',''))>3000 or length(coalesce(p_payload->>'learning_notes',''))>3000 then raise exception 'Catatan maksimal 3000 karakter'; end if;
  update students set
    name=trim(p_payload->>'name'),
    parent_name=trim(p_payload->>'parent_name'),
    phone=trim(coalesce(p_payload->>'phone','')),
    interest=coalesce(p_payload->>'interest',''),
    diagnostic=coalesce(p_payload->>'diagnostic',''),
    learning_notes=coalesce(p_payload->>'learning_notes','')
  where id=p_student;
  if not found then raise exception 'Siswa tidak tersedia'; end if;
end $$;
revoke execute on function public.update_student_profile(uuid,jsonb) from public,anon;
grant execute on function public.update_student_profile(uuid,jsonb) to authenticated;
