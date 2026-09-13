-- Urutan pertemuan dijaga database (keputusan pemilik 14 Sep 2026): pertemuan bergerak linear.
-- * Nomor pertemuan ditentukan database: jadwal baru = nomor terbesar milik guru + 1; tidak bisa diganti.
-- * Tidak ada nomor ganda per guru.
-- * Pertemuan diselesaikan berurutan: semua nomor yang lebih kecil harus sudah selesai.
-- * Hanya jadwal terakhir (nomor terbesar, belum selesai) yang bisa dihapus, supaya nomor tidak berlubang.
alter table public.class_schedules
  add constraint class_schedules_teacher_meeting_unique unique (teacher_id, meeting_number);

create or replace function public.save_schedule(p_schedule uuid, p_payload jsonb) returns uuid
language plpgsql security definer set search_path=public as $$
declare
  v_id uuid := p_schedule;
  v_row record;
  v_next integer;
begin
  if not is_member() or is_owner() then raise exception 'Jadwal dibuat oleh guru pengajar'; end if;
  if jsonb_typeof(p_payload) <> 'object' then raise exception 'Data jadwal tidak valid'; end if;
  if coalesce(p_payload->>'theme_number', '') !~ '^[0-9]{1,2}$'
     or not exists (select 1 from curriculum_themes where number = (p_payload->>'theme_number')::int) then
    raise exception 'Tema tidak dikenal';
  end if;
  if coalesce(p_payload->>'scheduled_date', '') !~ '^\d{4}-\d{2}-\d{2}$' then raise exception 'Tanggal wajib diisi'; end if;
  if coalesce(p_payload->>'scheduled_time', '') !~ '^(\d{2}:\d{2}(:\d{2})?)?$' then raise exception 'Jam tidak valid'; end if;
  if jsonb_typeof(p_payload->'students') <> 'array' or jsonb_array_length(p_payload->'students') = 0 then
    raise exception 'Pilih minimal satu siswa';
  end if;
  if (select count(*) from jsonb_array_elements(p_payload->'students')) <>
     (select count(distinct r->>'student_id') from jsonb_array_elements(p_payload->'students') r) then
    raise exception 'Satu siswa dipilih lebih dari sekali';
  end if;
  for v_row in select r->>'student_id' sid, r->>'indicator_number' ind from jsonb_array_elements(p_payload->'students') r loop
    if v_row.sid !~ '^[0-9a-fA-F-]{36}$' or not can_teach(v_row.sid::uuid) then raise exception 'Siswa tidak tersedia'; end if;
    if not exists (select 1 from students s join diagnostic_tests t on t.student_id = s.id
                   where s.id = v_row.sid::uuid and s.status = 'Aktif' and s.pilot_level is not null) then
      raise exception 'Siswa yang dijadwalkan harus aktif dan sudah dites diagnostik';
    end if;
    if coalesce(v_row.ind, '') !~ '^[0-9]$' or not exists (
         select 1 from students s join curriculum_level_indicators i on i.level = s.pilot_level
         where s.id = v_row.sid::uuid and i.number = v_row.ind::int) then
      raise exception 'Indikator harus berasal dari level siswa';
    end if;
  end loop;

  -- Satu guru menulis jadwal satu per satu, supaya dua simpan bersamaan tidak berebut nomor.
  perform pg_advisory_xact_lock(hashtext('class_schedules:' || auth.uid()::text));
  if v_id is null then
    select coalesce(max(meeting_number), 0) + 1 into v_next from class_schedules where teacher_id = auth.uid();
    if v_next > 192 then raise exception 'Semua 192 pertemuan sudah dijadwalkan'; end if;
    insert into class_schedules(teacher_id, meeting_number, theme_number, scheduled_date, scheduled_time)
    values (auth.uid(), v_next, (p_payload->>'theme_number')::int,
            (p_payload->>'scheduled_date')::date, nullif(p_payload->>'scheduled_time', '')::time)
    returning id into v_id;
  else
    perform 1 from class_schedules where id = v_id and teacher_id = auth.uid() for update;
    if not found then raise exception 'Jadwal tidak tersedia'; end if;
    if exists (select 1 from class_schedules where id = v_id and completed_at is not null) then
      raise exception 'Jadwal yang sudah selesai tidak bisa diubah';
    end if;
    update class_schedules set theme_number = (p_payload->>'theme_number')::int,
      scheduled_date = (p_payload->>'scheduled_date')::date,
      scheduled_time = nullif(p_payload->>'scheduled_time', '')::time
    where id = v_id;
    delete from class_schedule_students where schedule_id = v_id;
  end if;
  insert into class_schedule_students(schedule_id, student_id, level, indicator_number)
  select v_id, s.id, s.pilot_level, (r->>'indicator_number')::int
  from jsonb_array_elements(p_payload->'students') r join students s on s.id = (r->>'student_id')::uuid;
  return v_id;
end $$;

create or replace function public.delete_schedule(p_schedule uuid) returns void
language plpgsql security definer set search_path=public as $$
declare v_number integer;
begin
  if not is_member() or is_owner() then raise exception 'Jadwal dihapus oleh guru pengajar'; end if;
  perform pg_advisory_xact_lock(hashtext('class_schedules:' || auth.uid()::text));
  select meeting_number into v_number from class_schedules where id = p_schedule and teacher_id = auth.uid() for update;
  if not found then raise exception 'Jadwal tidak tersedia'; end if;
  if exists (select 1 from class_schedules where id = p_schedule and completed_at is not null) then
    raise exception 'Jadwal yang sudah selesai tidak bisa dihapus';
  end if;
  if exists (select 1 from class_schedules where teacher_id = auth.uid() and meeting_number > v_number) then
    raise exception 'Hanya jadwal terakhir yang bisa dihapus, supaya nomor pertemuan tetap berurutan';
  end if;
  delete from class_schedules where id = p_schedule;
end $$;

create or replace function public.complete_schedule(p_schedule uuid, p_results jsonb) returns void
language plpgsql security definer set search_path=public as $$
declare v_number integer;
begin
  if not is_member() or is_owner() then raise exception 'Pertemuan ditandai selesai oleh guru pengajar'; end if;
  select meeting_number into v_number from class_schedules where id = p_schedule and teacher_id = auth.uid() for update;
  if not found then raise exception 'Jadwal tidak tersedia'; end if;
  if exists (select 1 from class_schedules where id = p_schedule and completed_at is not null) then
    raise exception 'Pertemuan ini sudah ditandai selesai';
  end if;
  if exists (select 1 from class_schedules where teacher_id = auth.uid() and meeting_number < v_number and completed_at is null) then
    raise exception 'Selesaikan Pertemuan % lebih dulu',
      (select min(meeting_number) from class_schedules where teacher_id = auth.uid() and completed_at is null);
  end if;
  if jsonb_typeof(p_results) <> 'array' then raise exception 'Hasil pertemuan tidak valid'; end if;
  if exists (select 1 from jsonb_array_elements(p_results) r
             where coalesce(r->>'result', '') not in ('lulus', 'belum', 'absen')
                or not exists (select 1 from class_schedule_students x
                               where x.schedule_id = p_schedule and x.student_id::text = r->>'student_id')) then
    raise exception 'Hasil hanya boleh Lulus, Belum, atau Tidak hadir untuk siswa di jadwal ini';
  end if;
  if (select count(distinct r->>'student_id') from jsonb_array_elements(p_results) r) <>
       (select count(*) from jsonb_array_elements(p_results))
     or (select count(*) from jsonb_array_elements(p_results)) <>
       (select count(*) from class_schedule_students where schedule_id = p_schedule) then
    raise exception 'Setiap siswa di jadwal harus diberi satu hasil';
  end if;
  update class_schedule_students x set result = r->>'result'
  from jsonb_array_elements(p_results) r
  where x.schedule_id = p_schedule and x.student_id::text = r->>'student_id';
  update class_schedules set completed_at = now() where id = p_schedule;
end $$;
