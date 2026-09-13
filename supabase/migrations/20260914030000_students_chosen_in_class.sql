-- Siswa tidak terikat jadwal (keputusan pemilik 14 Sep 2026). Jadwal hanya berisi tema, nomor pertemuan,
-- tanggal, dan jam. Saat kelas guru memilih siswa yang datang (termasuk yang terlambat atau di luar
-- jadwalnya), indikator tiap siswa, dan Lulus/Belum; semuanya bisa disimpan sementara, lalu diputuskan
-- final dengan "Tandai pertemuan selesai". Tidak hadir dihapus: yang tidak dipilih memang tidak hadir.
-- Satu siswa boleh ikut beberapa pertemuan.
update public.class_schedule_students set result = null where result = 'absen';
alter table public.class_schedule_students drop constraint if exists class_schedule_students_result_check;
alter table public.class_schedule_students add constraint class_schedule_students_result_check
  check (result in ('lulus', 'belum'));

drop function if exists public.complete_schedule(uuid, jsonb);

create or replace function public.save_schedule(p_schedule uuid, p_payload jsonb) returns uuid
language plpgsql security definer set search_path=public as $$
declare
  v_id uuid := p_schedule;
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
  end if;
  return v_id;
end $$;

-- Simpan isi pertemuan: siswa yang hadir, indikator tiap siswa (dari levelnya), dan Lulus/Belum (boleh kosong
-- selama belum final). p_finish = true menandai selesai: minimal satu siswa, semua sudah Lulus/Belum,
-- dan pertemuan sebelumnya sudah selesai.
create function public.save_meeting(p_schedule uuid, p_students jsonb, p_finish boolean) returns void
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
  for v_row in select r->>'student_id' sid, r->>'indicator_number' ind, r->>'result' res
               from jsonb_array_elements(p_students) r loop
    if coalesce(v_row.sid, '') !~ '^[0-9a-fA-F-]{36}$' or not can_teach(v_row.sid::uuid) then
      raise exception 'Siswa tidak tersedia';
    end if;
    if not exists (select 1 from students s join diagnostic_tests t on t.student_id = s.id
                   where s.id = v_row.sid::uuid and s.status = 'Aktif' and s.pilot_level is not null) then
      raise exception 'Siswa yang ikut kelas harus aktif dan sudah dites diagnostik';
    end if;
    if coalesce(v_row.ind, '') !~ '^[0-9]$' or not exists (
         select 1 from students s join curriculum_level_indicators i on i.level = s.pilot_level
         where s.id = v_row.sid::uuid and i.number = v_row.ind::int) then
      raise exception 'Indikator harus berasal dari level siswa';
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
  select p_schedule, s.id, s.pilot_level, (r->>'indicator_number')::int, nullif(r->>'result', '')
  from jsonb_array_elements(p_students) r join students s on s.id = (r->>'student_id')::uuid;
  if p_finish then update class_schedules set completed_at = now() where id = p_schedule; end if;
end $$;
revoke execute on function public.save_meeting(uuid, jsonb, boolean) from public, anon;
grant execute on function public.save_meeting(uuid, jsonb, boolean) to authenticated;
