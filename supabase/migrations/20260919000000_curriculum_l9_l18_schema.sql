-- Kurikulum L9–L18 (SD kelas 2–6): perubahan skema — batasan diperluas, fungsi diperbarui.
-- Data kurikulum (k8_levels, k8_indicators, k8_themes, k8_subthemes, k8_theme_english) di migrasi berikutnya.
-- Disetujui pemilik Sep 2026.

-- 1. Batasan level: 1–8 → 1–18. Tema: 1–8 → 1–16. Pertemuan: 1–192 → 1–384.

alter table public.k8_levels drop constraint if exists k8_levels_level_check;
alter table public.k8_levels add constraint k8_levels_level_check check (level between 1 and 18);

alter table public.k8_themes drop constraint if exists k8_themes_number_check;
alter table public.k8_themes add constraint k8_themes_number_check check (number between 1 and 16);
alter table public.k8_themes drop constraint if exists k8_themes_first_meeting_check;
alter table public.k8_themes add constraint k8_themes_first_meeting_check check (first_meeting between 1 and 384);
alter table public.k8_themes drop constraint if exists k8_themes_last_meeting_check;
alter table public.k8_themes add constraint k8_themes_last_meeting_check check (last_meeting between 1 and 384);

alter table public.k8_subthemes drop constraint if exists k8_subthemes_first_meeting_check;
alter table public.k8_subthemes add constraint k8_subthemes_first_meeting_check check (first_meeting between 1 and 384);
alter table public.k8_subthemes drop constraint if exists k8_subthemes_last_meeting_check;
alter table public.k8_subthemes add constraint k8_subthemes_last_meeting_check check (last_meeting between 1 and 384);

alter table public.students drop constraint if exists students_pilot_level_check;
alter table public.students add constraint students_pilot_level_check check (pilot_level between 1 and 18);

alter table public.diagnostic_tests drop constraint if exists diagnostic_tests_tested_level_check;
alter table public.diagnostic_tests add constraint diagnostic_tests_tested_level_check check (tested_level between 1 and 18);
alter table public.diagnostic_tests drop constraint if exists diagnostic_tests_start_level_check;
alter table public.diagnostic_tests add constraint diagnostic_tests_start_level_check check (start_level between 1 and 18);

alter table public.class_schedule_students drop constraint if exists class_schedule_students_level_check;
alter table public.class_schedule_students add constraint class_schedule_students_level_check check (level between 1 and 18);

alter table public.student_level_changes drop constraint if exists student_level_changes_from_level_check;
alter table public.student_level_changes add constraint student_level_changes_from_level_check check (from_level between 1 and 17);

-- 2. start_diagnostic: level 1–18.
create or replace function public.start_diagnostic(p_student uuid, p_level integer) returns uuid
language plpgsql security definer set search_path=public as $$
declare
  v_old record;
  v_id uuid;
begin
  if is_owner() or not can_teach(p_student) then raise exception 'Tes diagnostik dilakukan oleh guru pendamping'; end if;
  perform 1 from students where id = p_student and status = 'Aktif' for update;
  if not found then raise exception 'Hanya anak aktif yang bisa dites'; end if;
  if p_level is null or p_level not between 1 and 18 then raise exception 'Level yang dites harus Level 1–18'; end if;
  select * into v_old from diagnostic_tests where student_id = p_student;
  if found then
    if v_old.finalized_at is not null then raise exception 'Anak ini sudah dites diagnostik. Hasil tes tidak bisa diubah.'; end if;
    if not diagnostic_stopped(v_old.id) then
      raise exception 'Tes Level % sudah dimulai. Level hanya bisa diganti bila tes berhenti.', v_old.tested_level;
    end if;
    if p_level <> diagnostic_restart_level(v_old.tested_level) then
      raise exception 'Tes yang berhenti dilanjutkan dengan tes baru di Level %', diagnostic_restart_level(v_old.tested_level);
    end if;
    delete from diagnostic_tests where id = v_old.id;
  end if;
  insert into diagnostic_tests(student_id, teacher_id, tested_level) values (p_student, auth.uid(), p_level)
  returning id into v_id;
  return v_id;
end $$;
revoke execute on function public.start_diagnostic(uuid, integer) from public, anon;
grant execute on function public.start_diagnostic(uuid, integer) to authenticated;

-- 3. finalize_diagnostic: kurikulum selesai di L18 (bukan L8).
create or replace function public.finalize_diagnostic(p_student uuid) returns integer
language plpgsql security definer set search_path=public as $$
declare
  v_test record;
  v_first integer;
begin
  if is_owner() or not can_teach(p_student) then raise exception 'Tes diagnostik dilakukan oleh guru pendamping'; end if;
  perform 1 from students where id = p_student and status = 'Aktif' for update;
  if not found then raise exception 'Hanya anak aktif yang bisa dites'; end if;
  select * into v_test from diagnostic_tests where student_id = p_student for update;
  if not found then raise exception 'Tes diagnostik belum dimulai'; end if;
  if v_test.finalized_at is not null then raise exception 'Tes sudah disimpan final dan tidak bisa diubah'; end if;
  if diagnostic_stopped(v_test.id) then raise exception 'Tes berhenti dan tidak dihitung. Mulai tes baru di Level %', diagnostic_restart_level(v_test.tested_level); end if;
  select min(n) into v_first from generate_series(1, 12) n
  where not exists (select 1 from diagnostic_results r where r.test_id = v_test.id and r.number = n and r.status = 'lulus');
  update diagnostic_tests set
    finalized_at = now(),
    start_level = case when v_first is null then least(v_test.tested_level + 1, 18) else v_test.tested_level end,
    start_indicator = case when v_first is not null then v_first when v_test.tested_level < 18 then 1 end,
    curriculum_complete = v_first is null and v_test.tested_level = 18
  where id = v_test.id;
  update students set pilot_level = (select start_level from diagnostic_tests where id = v_test.id) where id = p_student;
  return (select start_level from diagnostic_tests where id = v_test.id);
end $$;
revoke execute on function public.finalize_diagnostic(uuid) from public, anon;
grant execute on function public.finalize_diagnostic(uuid) to authenticated;

-- 4. confirm_level_up: naik level sampai L18.
create or replace function public.confirm_level_up(p_student uuid) returns integer
language plpgsql security definer set search_path=public as $$
declare v_level integer;
begin
  if is_owner() or not can_teach(p_student) then raise exception 'Naik level dikonfirmasi guru pendamping'; end if;
  select pilot_level into v_level from students where id = p_student and status = 'Aktif' for update;
  if v_level is null then raise exception 'Hanya anak aktif yang sudah dites bisa naik level'; end if;
  if current_indicator(p_student) is not null then raise exception 'Indikator akademik Level % belum Lulus semua', v_level; end if;
  if v_level = 18 then raise exception 'Level 18 sudah selesai; tidak ada level berikutnya'; end if;
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

-- 5. save_schedule: pertemuan sampai 384.
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
      if v_number > 384 then raise exception 'Semua 384 pertemuan sudah dijadwalkan'; end if;
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

-- 6. save_meeting: English bebas (tanpa syarat 3 pertemuan) juga di L9, L12, L15.
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
    -- L1, L4, L7, L9, L12, L15 bebas dinilai kapan saja; level lain perlu ≥ 3 pertemuan dalam satu tema.
    if v_row.eng <> '' and v_level not in (1, 4, 7, 9, 12, 15) and not exists (
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
