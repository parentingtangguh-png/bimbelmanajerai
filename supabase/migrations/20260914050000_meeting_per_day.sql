-- Pertemuan dihitung per hari mengajar (keputusan pemilik 14 Sep 2026). Satu guru bisa punya beberapa sesi
-- di tanggal yang sama; semua sesi di tanggal itu berbagi nomor pertemuan dan tema. Tanggal berikutnya baru
-- bisa dijadwalkan setelah semua sesi di hari terakhir ditandai selesai. Satu anak hanya ikut satu sesi per
-- hari. Setiap baris class_schedules sekarang adalah satu sesi.
alter table public.class_schedules drop constraint if exists class_schedules_teacher_meeting_unique;
create index if not exists class_schedules_teacher_meeting on public.class_schedules(teacher_id, meeting_number);

-- Simpan sesi. Sesi baru di tanggal hari terakhir guru = tambah sesi (nomor sama). Sesi di tanggal yang lebih
-- baru = hari baru (nomor + 1), hanya bila semua sesi sebelumnya selesai. Ubah: jam; tanggal hanya bila sesi
-- itu satu-satunya di harinya.
create or replace function public.save_schedule(p_schedule uuid, p_payload jsonb) returns uuid
language plpgsql security definer set search_path=public as $$
declare
  v_id uuid := p_schedule;
  v_date date;
  v_last_date date;
  v_last_number integer;
  v_number integer;
  v_theme integer;
  v_old record;
begin
  if not is_member() or is_owner() then raise exception 'Jadwal dibuat oleh guru pengajar'; end if;
  if jsonb_typeof(p_payload) <> 'object' then raise exception 'Data jadwal tidak valid'; end if;
  if coalesce(p_payload->>'scheduled_date', '') !~ '^\d{4}-\d{2}-\d{2}$' then raise exception 'Tanggal wajib diisi'; end if;
  if coalesce(p_payload->>'scheduled_time', '') !~ '^(\d{2}:\d{2}(:\d{2})?)?$' then raise exception 'Jam tidak valid'; end if;
  v_date := (p_payload->>'scheduled_date')::date;

  perform pg_advisory_xact_lock(hashtext('class_schedules:' || auth.uid()::text));
  select scheduled_date, meeting_number into v_last_date, v_last_number
  from class_schedules where teacher_id = auth.uid() order by meeting_number desc limit 1;

  if v_id is null then
    if v_last_date is not null and v_date = v_last_date then
      v_number := v_last_number;
    else
      if v_last_date is not null and v_date < v_last_date then
        raise exception 'Tanggal harus setelah pertemuan terakhir (%)', to_char(v_last_date, 'DD-MM-YYYY');
      end if;
      if exists (select 1 from class_schedules where teacher_id = auth.uid() and completed_at is null) then
        raise exception 'Selesaikan semua sesi Pertemuan % lebih dulu sebelum menjadwalkan hari berikutnya', v_last_number;
      end if;
      v_number := coalesce(v_last_number, 0) + 1;
      if v_number > 192 then raise exception 'Semua 192 pertemuan sudah dijadwalkan'; end if;
    end if;
    select number into v_theme from curriculum_themes where v_number between first_meeting and last_meeting;
    if v_theme is null then raise exception 'Tema untuk Pertemuan % belum tersedia', v_number; end if;
    insert into class_schedules(teacher_id, meeting_number, theme_number, scheduled_date, scheduled_time)
    values (auth.uid(), v_number, v_theme, v_date, nullif(p_payload->>'scheduled_time', '')::time)
    returning id into v_id;
  else
    select * into v_old from class_schedules where id = v_id and teacher_id = auth.uid() for update;
    if not found then raise exception 'Jadwal tidak tersedia'; end if;
    if v_old.completed_at is not null then raise exception 'Jadwal yang sudah selesai tidak bisa diubah'; end if;
    if v_date <> v_old.scheduled_date then
      if exists (select 1 from class_schedules where teacher_id = auth.uid() and meeting_number = v_old.meeting_number and id <> v_id) then
        raise exception 'Tanggal tidak bisa diubah karena hari ini punya sesi lain';
      end if;
      if exists (select 1 from class_schedules where teacher_id = auth.uid() and meeting_number < v_old.meeting_number and scheduled_date >= v_date) then
        raise exception 'Tanggal harus setelah pertemuan sebelumnya';
      end if;
    end if;
    update class_schedules set scheduled_date = v_date, scheduled_time = nullif(p_payload->>'scheduled_time', '')::time
    where id = v_id;
  end if;
  return v_id;
end $$;

-- Hapus sesi yang belum selesai, hanya di hari terakhir guru.
create or replace function public.delete_schedule(p_schedule uuid) returns void
language plpgsql security definer set search_path=public as $$
declare v_old record;
begin
  if not is_member() or is_owner() then raise exception 'Jadwal dihapus oleh guru pengajar'; end if;
  perform pg_advisory_xact_lock(hashtext('class_schedules:' || auth.uid()::text));
  select * into v_old from class_schedules where id = p_schedule and teacher_id = auth.uid() for update;
  if not found then raise exception 'Jadwal tidak tersedia'; end if;
  if v_old.completed_at is not null then raise exception 'Jadwal yang sudah selesai tidak bisa dihapus'; end if;
  if exists (select 1 from class_schedules where teacher_id = auth.uid() and meeting_number > v_old.meeting_number) then
    raise exception 'Hanya sesi di pertemuan terakhir yang bisa dihapus, supaya nomor pertemuan tetap berurutan';
  end if;
  delete from class_schedules where id = p_schedule;
end $$;

-- Isi sesi. Tambahan dari versi sebelumnya: anak yang sudah ada di sesi lain pada tanggal yang sama ditolak;
-- menandai selesai hanya menunggu pertemuan (hari) sebelumnya, bukan sesi lain di hari yang sama.
create or replace function public.save_meeting(p_schedule uuid, p_students jsonb, p_finish boolean) returns void
language plpgsql security definer set search_path=public as $$
declare
  v_sched record;
  v_row record;
  v_other text;
begin
  if not is_member() or is_owner() then raise exception 'Pertemuan diisi oleh guru pengajar'; end if;
  select * into v_sched from class_schedules where id = p_schedule and teacher_id = auth.uid() for update;
  if not found then raise exception 'Jadwal tidak tersedia'; end if;
  if v_sched.completed_at is not null then raise exception 'Pertemuan ini sudah ditandai selesai'; end if;
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
    select s.name into v_other from class_schedule_students x join class_schedules c on c.id = x.schedule_id
      join students s on s.id = x.student_id
      where x.student_id = v_row.sid::uuid and c.scheduled_date = v_sched.scheduled_date and c.id <> p_schedule limit 1;
    if v_other is not null then raise exception '% sudah ikut sesi lain di tanggal yang sama', v_other; end if;
    if coalesce(v_row.res, '') not in ('', 'lulus', 'belum') then raise exception 'Hasil hanya boleh Lulus atau Belum'; end if;
  end loop;

  if p_finish then
    if jsonb_array_length(p_students) = 0 then raise exception 'Pilih minimal satu siswa yang hadir'; end if;
    if exists (select 1 from jsonb_array_elements(p_students) r where coalesce(r->>'result', '') = '') then
      raise exception 'Beri setiap siswa yang hadir Lulus atau Belum';
    end if;
    if exists (select 1 from class_schedules where teacher_id = auth.uid() and meeting_number < v_sched.meeting_number and completed_at is null) then
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
