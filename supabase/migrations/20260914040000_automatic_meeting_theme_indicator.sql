-- Guru tidak memilih pertemuan, tema, level, atau indikator (keputusan pemilik 14 Sep 2026).
-- * Hanya satu jadwal terbuka per guru; jadwal berikutnya dibuat setelah pertemuan itu ditandai selesai.
-- * Nomor pertemuan = nomor terbesar milik guru + 1; tema = tema yang mencakup nomor itu.
-- * Indikator siswa = indikator akademik 1–6 terkecil di levelnya yang belum pernah Lulus di pertemuan
--   selesai; bila 1–6 sudah lulus, tetap indikator 6 sampai kenaikan level dikonfirmasi (dibangun nanti).
--   English (7) dan Karakter (8) tidak masuk antrean.
-- * Guru hanya memilih siswa yang hadir dan Lulus/Belum. Tidak ada koreksi setelah selesai.

create function public.current_indicator(p_student uuid) returns integer
language sql stable security definer set search_path=public as $$
  select coalesce(
    (select min(i.number) from students s
       join curriculum_level_indicators i on i.level = s.pilot_level and i.number between 1 and 6
      where s.id = p_student
        and not exists (select 1 from class_schedule_students x join class_schedules c on c.id = x.schedule_id
                        where x.student_id = s.id and x.level = s.pilot_level and x.indicator_number = i.number
                          and x.result = 'lulus' and c.completed_at is not null)),
    6)
$$;
revoke execute on function public.current_indicator(uuid) from public, anon, authenticated;

create or replace function public.save_schedule(p_schedule uuid, p_payload jsonb) returns uuid
language plpgsql security definer set search_path=public as $$
declare
  v_id uuid := p_schedule;
  v_next integer;
  v_open integer;
  v_theme integer;
begin
  if not is_member() or is_owner() then raise exception 'Jadwal dibuat oleh guru pengajar'; end if;
  if jsonb_typeof(p_payload) <> 'object' then raise exception 'Data jadwal tidak valid'; end if;
  if coalesce(p_payload->>'scheduled_date', '') !~ '^\d{4}-\d{2}-\d{2}$' then raise exception 'Tanggal wajib diisi'; end if;
  if coalesce(p_payload->>'scheduled_time', '') !~ '^(\d{2}:\d{2}(:\d{2})?)?$' then raise exception 'Jam tidak valid'; end if;

  perform pg_advisory_xact_lock(hashtext('class_schedules:' || auth.uid()::text));
  if v_id is null then
    select meeting_number into v_open from class_schedules where teacher_id = auth.uid() and completed_at is null;
    if v_open is not null then
      raise exception 'Selesaikan Pertemuan % lebih dulu sebelum membuat jadwal berikutnya', v_open;
    end if;
    select coalesce(max(meeting_number), 0) + 1 into v_next from class_schedules where teacher_id = auth.uid();
    if v_next > 192 then raise exception 'Semua 192 pertemuan sudah dijadwalkan'; end if;
    select number into v_theme from curriculum_themes where v_next between first_meeting and last_meeting;
    if v_theme is null then raise exception 'Tema untuk Pertemuan % belum tersedia', v_next; end if;
    insert into class_schedules(teacher_id, meeting_number, theme_number, scheduled_date, scheduled_time)
    values (auth.uid(), v_next, v_theme, (p_payload->>'scheduled_date')::date, nullif(p_payload->>'scheduled_time', '')::time)
    returning id into v_id;
  else
    perform 1 from class_schedules where id = v_id and teacher_id = auth.uid() for update;
    if not found then raise exception 'Jadwal tidak tersedia'; end if;
    if exists (select 1 from class_schedules where id = v_id and completed_at is not null) then
      raise exception 'Jadwal yang sudah selesai tidak bisa diubah';
    end if;
    update class_schedules set scheduled_date = (p_payload->>'scheduled_date')::date,
      scheduled_time = nullif(p_payload->>'scheduled_time', '')::time
    where id = v_id;
  end if;
  return v_id;
end $$;

-- Isi pertemuan: siswa yang hadir dan Lulus/Belum. Level dan indikator selalu dihitung di sini; isian
-- indikator dari aplikasi diabaikan.
create or replace function public.save_meeting(p_schedule uuid, p_students jsonb, p_finish boolean) returns void
language plpgsql security definer set search_path=public as $$
declare
  v_number integer;
  v_row record;
begin
  if not is_member() or is_owner() then raise exception 'Pertemuan diisi oleh guru pengajar'; end if;
  select meeting_number into v_number from class_schedules where id = p_schedule and teacher_id = auth.uid() for update;
  if not found then raise exception 'Jadwal tidak tersedia'; end if;
  if exists (select 1 from class_schedules where id = p_schedule and completed_at is not null) then
    raise exception 'Pertemuan ini sudah ditandai selesai';
  end if;
  if jsonb_typeof(p_students) <> 'array' then raise exception 'Data pertemuan tidak valid'; end if;
  if (select count(*) from jsonb_array_elements(p_students)) <>
     (select count(distinct r->>'student_id') from jsonb_array_elements(p_students) r) then
    raise exception 'Satu siswa dipilih lebih dari sekali';
  end if;
  for v_row in select r->>'student_id' sid, r->>'result' res from jsonb_array_elements(p_students) r loop
    if coalesce(v_row.sid, '') !~ '^[0-9a-fA-F-]{36}$' or not can_teach(v_row.sid::uuid) then
      raise exception 'Siswa tidak tersedia';
    end if;
    if not exists (select 1 from students s join diagnostic_tests t on t.student_id = s.id
                   where s.id = v_row.sid::uuid and s.status = 'Aktif' and s.pilot_level is not null) then
      raise exception 'Siswa yang ikut kelas harus aktif dan sudah dites diagnostik';
    end if;
    if coalesce(v_row.res, '') not in ('', 'lulus', 'belum') then raise exception 'Hasil hanya boleh Lulus atau Belum'; end if;
  end loop;

  if p_finish then
    if jsonb_array_length(p_students) = 0 then raise exception 'Pilih minimal satu siswa yang hadir'; end if;
    if exists (select 1 from jsonb_array_elements(p_students) r where coalesce(r->>'result', '') = '') then
      raise exception 'Beri setiap siswa yang hadir Lulus atau Belum';
    end if;
    if exists (select 1 from class_schedules where teacher_id = auth.uid() and meeting_number < v_number and completed_at is null) then
      raise exception 'Selesaikan Pertemuan % lebih dulu',
        (select min(meeting_number) from class_schedules where teacher_id = auth.uid() and completed_at is null);
    end if;
  end if;

  delete from class_schedule_students where schedule_id = p_schedule;
  insert into class_schedule_students(schedule_id, student_id, level, indicator_number, result)
  select p_schedule, s.id, s.pilot_level, current_indicator(s.id), nullif(r->>'result', '')
  from jsonb_array_elements(p_students) r join students s on s.id = (r->>'student_id')::uuid;
  if p_finish then update class_schedules set completed_at = now() where id = p_schedule; end if;
end $$;
