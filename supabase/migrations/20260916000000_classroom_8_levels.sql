-- Fase 3 rencana aplikasi (docs/rencana-aplikasi.md): Ruang kelas untuk kurikulum 8 level.
-- - Antrean 12 indikator akademik per level; Lulus di tes diagnostik final ikut dihitung.
-- - Satu indikator akademik per anak per sesi: Lulus / Belum / Belum dinilai.
-- - English (13) dan Karakter (14) opsional per sesi, lulus sekali per level, tidak memindahkan antrean.
--   English L2, L3, L5, L6, L8 butuh paparan: hadir di sedikitnya 3 pertemuan (hari) dalam satu tema,
--   termasuk pertemuan hari ini. L1, L4, L7 memakai ungkapan/warna tetap.
-- - 12 akademik Lulus → "siap naik"; guru mengonfirmasi naik level. 12 Lulus di L8 → kurikulum selesai.
-- Ruang kelas masih kosong (dikunci sejak Fase 2), jadi tabel siswa sesi dibuat ulang.

drop table public.class_schedule_students;
alter table public.class_schedules drop constraint if exists class_schedules_theme_number_fkey;
alter table public.class_schedules add constraint class_schedules_theme_number_fkey
  foreign key (theme_number) references public.k8_themes(number);

create table public.class_schedule_students (
  schedule_id uuid not null references public.class_schedules(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  level integer not null check (level between 1 and 8),
  -- Kosong bila 12 akademik level ini sudah Lulus (siap naik / kurikulum selesai).
  indicator_number integer check (indicator_number between 1 and 12),
  result text check (result in ('lulus', 'belum', 'belum_dinilai')),
  english_result text check (english_result in ('lulus', 'belum')),
  character_result text check (character_result in ('lulus', 'belum')),
  primary key (schedule_id, student_id),
  check (indicator_number is not null or result is null)
);
alter table public.class_schedule_students enable row level security;
grant select on public.class_schedule_students to authenticated;
create policy class_schedule_students_read on public.class_schedule_students for select to authenticated
  using (exists (select 1 from public.class_schedules c where c.id = schedule_id
                 and is_member() and (c.teacher_id = auth.uid() or is_owner())));

-- Riwayat naik level yang dikonfirmasi guru.
create table public.student_level_changes (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  from_level integer not null check (from_level between 1 and 7),
  to_level integer not null check (to_level = from_level + 1),
  teacher_id uuid not null references public.profiles(id),
  changed_at timestamptz not null default now()
);
alter table public.student_level_changes enable row level security;
grant select on public.student_level_changes to authenticated;
create policy student_level_changes_read on public.student_level_changes for select to authenticated
  using (can_teach(student_id));

drop function if exists public.current_indicator(uuid);

-- Nomor yang sudah Lulus pada satu level: dari sesi selesai dan dari tes diagnostik final level itu.
create function public.passed_numbers(p_student uuid, p_level integer) returns integer[]
language sql stable security definer set search_path=public as $$
  select coalesce(array_agg(distinct n order by n), '{}') from (
    select x.indicator_number n from class_schedule_students x join class_schedules c on c.id = x.schedule_id
      where x.student_id = p_student and x.level = p_level and x.result = 'lulus' and c.completed_at is not null
    union select 13 from class_schedule_students x join class_schedules c on c.id = x.schedule_id
      where x.student_id = p_student and x.level = p_level and x.english_result = 'lulus' and c.completed_at is not null
    union select 14 from class_schedule_students x join class_schedules c on c.id = x.schedule_id
      where x.student_id = p_student and x.level = p_level and x.character_result = 'lulus' and c.completed_at is not null
    union select r.number from diagnostic_results r join diagnostic_tests t on t.id = r.test_id
      where t.student_id = p_student and t.tested_level = p_level and t.finalized_at is not null and r.status = 'lulus'
  ) q
$$;
revoke execute on function public.passed_numbers(uuid, integer) from public, anon, authenticated;

-- Indikator akademik aktif: nomor 1–12 terkecil yang belum Lulus; kosong bila semuanya Lulus.
create function public.current_indicator(p_student uuid) returns integer
language sql stable security definer set search_path=public as $$
  select min(n) from students s, generate_series(1, 12) n
  where s.id = p_student and not (n = any (passed_numbers(s.id, s.pilot_level)))
$$;
revoke execute on function public.current_indicator(uuid) from public, anon, authenticated;

-- Jumlah pertemuan (hari) yang dihadiri anak dalam satu tema, dari sesi selesai sebelum tanggal p_before.
create function public.theme_attendance(p_student uuid, p_theme integer, p_before date) returns integer
language sql stable security definer set search_path=public as $$
  select count(distinct c.scheduled_date)::int from class_schedule_students x join class_schedules c on c.id = x.schedule_id
  where x.student_id = p_student and c.theme_number = p_theme and c.completed_at is not null and c.scheduled_date < p_before
$$;
revoke execute on function public.theme_attendance(uuid, integer, date) from public, anon, authenticated;

-- Simpan sesi: sama seperti Ruang kelas pilot, tema dari kurikulum 8 level.
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
    select number into v_theme from k8_themes where v_number between first_meeting and last_meeting;
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

-- Isi sesi. p_students: [{student_id, result, english, character}]. result: lulus|belum|belum_dinilai|''.
-- english/character: lulus|belum|'' (tidak dinilai). Level dan indikator dihitung di sini.
create or replace function public.save_meeting(p_schedule uuid, p_students jsonb, p_finish boolean) returns void
language plpgsql security definer set search_path=public as $$
declare
  v_sched record;
  v_row record;
  v_other text;
  v_level integer;
  v_passed integer[];
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
  for v_row in select r->>'student_id' sid, coalesce(r->>'result', '') res, coalesce(r->>'english', '') eng,
                      coalesce(r->>'character', '') chr from jsonb_array_elements(p_students) r loop
    if v_row.sid !~ '^[0-9a-fA-F-]{36}$' or not can_teach(v_row.sid::uuid) then raise exception 'Siswa tidak tersedia'; end if;
    select s.pilot_level into v_level from students s join diagnostic_tests t on t.student_id = s.id
      where s.id = v_row.sid::uuid and s.status = 'Aktif' and t.finalized_at is not null;
    if v_level is null then raise exception 'Siswa yang ikut kelas harus aktif dan sudah dites diagnostik final'; end if;
    select s.name into v_other from class_schedule_students x join class_schedules c on c.id = x.schedule_id
      join students s on s.id = x.student_id
      where x.student_id = v_row.sid::uuid and c.scheduled_date = v_sched.scheduled_date and c.id <> p_schedule limit 1;
    if v_other is not null then raise exception '% sudah ikut sesi lain di tanggal yang sama', v_other; end if;
    if v_row.res not in ('', 'lulus', 'belum', 'belum_dinilai') then raise exception 'Hasil hanya Lulus, Belum, atau Belum dinilai'; end if;
    if v_row.eng not in ('', 'lulus', 'belum') or v_row.chr not in ('', 'lulus', 'belum') then
      raise exception 'English dan Karakter hanya Lulus atau Belum';
    end if;
    v_passed := passed_numbers(v_row.sid::uuid, v_level);
    if current_indicator(v_row.sid::uuid) is null and v_row.res <> '' then
      raise exception 'Indikator akademik Level % sudah Lulus semua', v_level;
    end if;
    if v_row.eng <> '' and 13 = any (v_passed) then raise exception 'English Level % sudah Lulus', v_level; end if;
    if v_row.chr <> '' and 14 = any (v_passed) then raise exception 'Karakter Level % sudah Lulus', v_level; end if;
    if v_row.eng <> '' and v_level not in (1, 4, 7) and not exists (
         select 1 from k8_themes t where t.number <= v_sched.theme_number
           and theme_attendance(v_row.sid::uuid, t.number, v_sched.scheduled_date)
               + case when t.number = v_sched.theme_number then 1 else 0 end >= 3) then
      raise exception 'English belum bisa dinilai: anak belum hadir 3 pertemuan dalam satu tema';
    end if;
  end loop;

  if p_finish then
    if jsonb_array_length(p_students) = 0 then raise exception 'Pilih minimal satu siswa yang hadir'; end if;
    if exists (select 1 from jsonb_array_elements(p_students) r
               where coalesce(r->>'result', '') = '' and current_indicator((r->>'student_id')::uuid) is not null) then
      raise exception 'Beri setiap siswa yang hadir Lulus, Belum, atau Belum dinilai';
    end if;
    if exists (select 1 from class_schedules where teacher_id = auth.uid() and meeting_number < v_sched.meeting_number and completed_at is null) then
      raise exception 'Selesaikan Pertemuan % lebih dulu',
        (select min(meeting_number) from class_schedules where teacher_id = auth.uid() and completed_at is null);
    end if;
  end if;

  delete from class_schedule_students where schedule_id = p_schedule;
  insert into class_schedule_students(schedule_id, student_id, level, indicator_number, result, english_result, character_result)
  select p_schedule, s.id, s.pilot_level, current_indicator(s.id),
         case when current_indicator(s.id) is null then null else nullif(r->>'result', '') end,
         nullif(r->>'english', ''), nullif(r->>'character', '')
  from jsonb_array_elements(p_students) r join students s on s.id = (r->>'student_id')::uuid;
  if p_finish then update class_schedules set completed_at = now() where id = p_schedule; end if;
end $$;

-- Naik level: dikonfirmasi guru setelah 12 akademik Lulus. Tidak dari Level 8, dan tidak selama anak ada di
-- sesi yang belum selesai.
create function public.confirm_level_up(p_student uuid) returns integer
language plpgsql security definer set search_path=public as $$
declare v_level integer;
begin
  if is_owner() or not can_teach(p_student) then raise exception 'Naik level dikonfirmasi guru pendamping'; end if;
  select pilot_level into v_level from students where id = p_student and status = 'Aktif' for update;
  if v_level is null then raise exception 'Hanya anak aktif yang sudah dites bisa naik level'; end if;
  if current_indicator(p_student) is not null then raise exception 'Indikator akademik Level % belum Lulus semua', v_level; end if;
  if v_level = 8 then raise exception 'Level 8 sudah selesai; tidak ada level berikutnya'; end if;
  if exists (select 1 from class_schedule_students x join class_schedules c on c.id = x.schedule_id
             where x.student_id = p_student and c.completed_at is null) then
    raise exception 'Selesaikan dulu sesi yang memuat anak ini';
  end if;
  update students set pilot_level = v_level + 1 where id = p_student;
  insert into student_level_changes(student_id, from_level, to_level, teacher_id) values (p_student, v_level, v_level + 1, auth.uid());
  return v_level + 1;
end $$;
revoke execute on function public.confirm_level_up(uuid) from public, anon;
grant execute on function public.confirm_level_up(uuid) to authenticated;
