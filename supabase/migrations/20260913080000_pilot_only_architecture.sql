-- Arsitektur pilot saja (13 Sep 2026, keputusan pemilik; aplikasi belum diluncurkan).
-- Semua struktur lama dihapus: kurikulum 7 bidang x 16 level, level per bidang, kompetensi, alarm,
-- sesi kelas, kehadiran, evaluasi, observasi, centang indikator, potret, sesi jadwal, tema bebas,
-- ujian sumatif, dan pekerjaan AI. Yang tersisa hanya struktur yang dipakai data baru:
--   akun (access_list, profiles), siswa + penugasan guru, kurikulum pilot, dan tes diagnostik.
-- Data yang dipertahankan: semua akun, dan siswa beserta hasil tes diagnostiknya.
-- Ruang kelas dibangun ulang kemudian dari rancangan pertemuan pilot.

-- 1. Pemicu lama pada students (dibuang lebih dulu supaya perubahan kolom tidak memicunya).
drop trigger if exists flow_student_targets on public.students;
drop trigger if exists guard_student_update on public.students;
drop trigger if exists initialize_student_competencies on public.students;
drop trigger if exists sync_core_competency_targets on public.students;

-- 2. Tabel lama. Semuanya kosong di produksi kecuali student_competencies (turunan level lama).
drop table if exists public.session_indicator_checks cascade;
drop table if exists public.session_observations cascade;
drop table if exists public.session_assessments cascade;
drop table if exists public.session_competency_snapshots cascade;
drop table if exists public.ai_jobs cascade;
drop table if exists public.class_ai_jobs cascade;
drop table if exists public.session_students cascade;
drop table if exists public.class_sessions cascade;
drop table if exists public.schedule_students cascade;
drop table if exists public.schedules cascade;
drop table if exists public.student_alerts cascade;
drop table if exists public.student_competencies cascade;
drop table if exists public.themes cascade;
drop table if exists public.curriculum cascade;

-- 3. Fungsi lama.
drop function if exists public.can_access_session(uuid);
drop function if exists public.claim_ai_job(uuid, text);
drop function if exists public.claim_class_ai_job(uuid);
drop function if exists public.complete_summative(uuid, integer, boolean);
drop function if exists public.correct_student_baseline(uuid, integer, integer);
drop function if exists public.create_class(uuid, date, text, uuid[]);
drop function if exists public.create_class(uuid, date, text, uuid[], integer);
drop function if exists public.delete_class(uuid);
drop function if exists public.diagnostic_level_complete(jsonb, integer);
drop function if exists public.finalize_competency_evaluation(uuid, jsonb, text);
drop function if exists public.finalize_competency_evaluation(uuid, jsonb, text, jsonb);
drop function if exists public.finalize_evaluation(uuid, text, text);
drop function if exists public.finish_ai_job(uuid, text, boolean);
drop function if exists public.finish_class_ai_job(uuid, text, boolean);
drop function if exists public.flow_student_targets();
drop function if exists public.guard_student_update();
drop function if exists public.initialize_student_competencies();
drop function if exists public.phase_end(integer);
drop function if exists public.reopen_evaluation(uuid);
drop function if exists public.require_diagnostic_before_class();
drop function if exists public.save_attendance(uuid, text);
drop function if exists public.set_class_schedule(uuid, uuid);
drop function if exists public.set_indicator_check(uuid, text, integer, boolean, text);
drop function if exists public.snapshot_competencies(uuid);
drop function if exists public.sync_core_competency_targets();
drop function if exists public.save_diagnostic(uuid, integer, jsonb, text, text, text);

-- 4. Siswa: identitas + satu level pilot. Level kosong sampai tes diagnostik disimpan; "sudah dites"
--    berarti ada baris diagnostic_tests, bukan kolom penanda.
alter table public.students add column pilot_level integer check (pilot_level between 1 and 4);
update public.students s set pilot_level = t.final_level from public.diagnostic_tests t where t.student_id = s.id;
update public.students set status = 'Non-Aktif' where status not in ('Aktif', 'Non-Aktif');
alter table public.students
  drop constraint if exists students_check,
  drop constraint if exists students_check1,
  drop constraint if exists students_check2,
  drop constraint if exists students_status_check,
  drop column if exists interest,
  drop column if exists diagnostic,
  drop column if exists learning_notes,
  drop column if exists reading_baseline,
  drop column if exists reading_level,
  drop column if exists reading_target,
  drop column if exists math_baseline,
  drop column if exists math_level,
  drop column if exists math_target,
  drop column if exists summative_score,
  drop column if exists diagnostic_status;
alter table public.students add constraint students_status_check check (status in ('Aktif', 'Non-Aktif'));

-- 5. Tes diagnostik: satu level, hasil lulus/belum, level awal, catatan, tanggal revisi.
update public.diagnostic_tests set tested_level = start_level where tested_level is null;
update public.diagnostic_tests set passed = final_level > tested_level where passed is null;
alter table public.diagnostic_tests
  drop column if exists start_level,
  drop column if exists beyond,
  drop column if exists level_locked,
  alter column tested_level set not null,
  alter column passed set not null;
alter table public.diagnostic_tests add constraint diagnostic_tests_final_level_rule
  check (final_level = case when passed then least(tested_level + 1, 4) else tested_level end);
-- Pemilik membaca ringkasan tes (level, lulus/belum, tanggal); hasil per indikator tetap hanya untuk guru.
drop policy if exists diagnostic_tests_read on public.diagnostic_tests;
create policy diagnostic_tests_read on public.diagnostic_tests for select to authenticated using (can_teach(student_id));

-- 6. Fungsi siswa, tanpa rujukan ke struktur lama.
create or replace function public.reject_owner_student_insert() returns trigger language plpgsql security definer set search_path=public as $$
begin
  if is_owner() then raise exception 'Pemilik hanya membaca data siswa. Siswa baru ditambahkan oleh guru.'; end if;
  return new;
end $$;
revoke execute on function public.reject_owner_student_insert() from public, anon, authenticated;
drop trigger if exists reject_owner_student_insert on public.students;
create trigger reject_owner_student_insert before insert on public.students
  for each row execute function public.reject_owner_student_insert();
drop function if exists public.reject_owner_classroom_write();

drop function if exists public.create_student(jsonb);
create function public.create_student(p_payload jsonb) returns uuid language plpgsql security definer set search_path=public as $$
declare sid uuid; born date;
begin
  if not is_member() then raise exception 'Akun tidak aktif'; end if;
  if length(trim(coalesce(p_payload->>'name',''))) not between 1 and 120 then raise exception 'Nama anak wajib diisi (maksimal 120 karakter)'; end if;
  if length(trim(coalesce(p_payload->>'parent_name',''))) not between 1 and 120 then raise exception 'Sapaan orang tua wajib diisi (maksimal 120 karakter)'; end if;
  if coalesce(p_payload->>'phone','') !~ '^[0-9+() -]{0,30}$' then raise exception 'Nomor WhatsApp hanya boleh berisi angka, spasi, +, -, dan tanda kurung'; end if;
  born := check_student_identity(p_payload);
  if born > current_date or born < current_date - interval '20 years' then raise exception 'Tanggal lahir tidak masuk akal'; end if;
  insert into students(name, parent_name, phone, nickname, birth_date, school_grade, school_year)
  values (trim(p_payload->>'name'), trim(p_payload->>'parent_name'), trim(coalesce(p_payload->>'phone','')),
          trim(coalesce(p_payload->>'nickname','')), born, p_payload->>'school_grade', p_payload->>'school_year')
  returning id into sid;
  insert into assignments(student_id, teacher_id) values (sid, auth.uid());
  return sid;
end $$;
revoke execute on function public.create_student(jsonb) from public, anon;
grant execute on function public.create_student(jsonb) to authenticated;

drop function if exists public.update_student_profile(uuid, jsonb);
create function public.update_student_profile(p_student uuid, p_payload jsonb) returns void language plpgsql security definer set search_path=public as $$
declare born date;
begin
  if is_owner() then raise exception 'Pemilik hanya membaca data siswa. Perubahan dilakukan oleh guru pendamping.'; end if;
  if not can_teach(p_student) then raise exception 'Akses ditolak'; end if;
  if jsonb_typeof(p_payload) <> 'object' then raise exception 'Data profil tidak valid'; end if;
  if length(trim(coalesce(p_payload->>'name',''))) not between 1 and 120 then raise exception 'Nama anak wajib diisi (maksimal 120 karakter)'; end if;
  if length(trim(coalesce(p_payload->>'parent_name',''))) not between 1 and 120 then raise exception 'Sapaan orang tua wajib diisi (maksimal 120 karakter)'; end if;
  if coalesce(p_payload->>'phone','') !~ '^[0-9+() -]{0,30}$' then raise exception 'Nomor WhatsApp hanya boleh berisi angka, spasi, +, -, dan tanda kurung'; end if;
  born := check_student_identity(p_payload);
  if born > current_date or born < current_date - interval '20 years' then raise exception 'Tanggal lahir tidak masuk akal'; end if;
  update students set
    name = trim(p_payload->>'name'),
    parent_name = trim(p_payload->>'parent_name'),
    phone = trim(coalesce(p_payload->>'phone','')),
    nickname = trim(coalesce(p_payload->>'nickname','')),
    birth_date = born,
    school_grade = p_payload->>'school_grade',
    school_year = p_payload->>'school_year'
  where id = p_student;
  if not found then raise exception 'Siswa tidak tersedia'; end if;
end $$;
revoke execute on function public.update_student_profile(uuid, jsonb) from public, anon;
grant execute on function public.update_student_profile(uuid, jsonb) to authenticated;

create or replace function public.set_student_active(p_student uuid, p_active boolean) returns void language plpgsql security definer set search_path=public as $$
begin
  if is_owner() or not can_teach(p_student) then raise exception 'Akses ditolak'; end if;
  update students set status = case when p_active then 'Aktif' else 'Non-Aktif' end where id = p_student;
  if not found then raise exception 'Siswa tidak tersedia'; end if;
end $$;
revoke execute on function public.set_student_active(uuid, boolean) from public, anon;
grant execute on function public.set_student_active(uuid, boolean) to authenticated;

create or replace function public.delete_student(p_student uuid) returns void language plpgsql security definer set search_path=public as $$
begin
  if is_owner() or not can_teach(p_student) then raise exception 'Akses ditolak'; end if;
  perform 1 from students where id = p_student for update;
  if not found then raise exception 'Siswa tidak tersedia'; end if;
  if exists (select 1 from assignments where student_id = p_student and teacher_id <> auth.uid()) then
    raise exception 'Siswa ini juga didampingi guru lain, jadi tidak bisa dihapus.';
  end if;
  delete from diagnostic_tests where student_id = p_student;
  delete from assignments where student_id = p_student;
  delete from students where id = p_student;
end $$;
revoke execute on function public.delete_student(uuid) from public, anon;
grant execute on function public.delete_student(uuid) to authenticated;

-- 7. Tes diagnostik satu level. Lulus = indikator 1-6 semuanya T; lulus Level X -> level X+1 (Level 4
--    tetap 4), belum lulus -> X. Satu tes per anak; simpan ulang = revisi (hanya hasil terakhir).
--    Hasil dihitung di sini dari nilai yang dikirim. Kunci revisi setelah kelas pertama dipasang lagi
--    bersama alur kelas pilot.
create function public.save_diagnostic(p_student uuid, p_level integer, p_results jsonb, p_note text)
returns integer language plpgsql security definer set search_path=public as $$
declare
  v_test uuid;
  v_passed boolean;
  v_final integer;
begin
  if is_owner() or not can_teach(p_student) then raise exception 'Tes diagnostik dilakukan oleh guru pendamping'; end if;
  perform 1 from students where id = p_student and status = 'Aktif' for update;
  if not found then raise exception 'Hanya anak aktif yang bisa dites'; end if;
  if p_level is null or p_level not between 1 and 4 then raise exception 'Level yang dites harus Level 1–4'; end if;
  if jsonb_typeof(p_results) <> 'array' then raise exception 'Hasil tes tidak valid'; end if;
  if exists (select 1 from jsonb_array_elements(p_results) r
             where coalesce(r->>'rating', '') not in ('T','B','N')
                or coalesce(r->>'level', '') <> p_level::text
                or coalesce(r->>'number', '') !~ '^[0-9]{1,2}$'
                or not exists (select 1 from curriculum_level_indicators i
                               where i.level = p_level and i.number = (r->>'number')::int)) then
    raise exception 'Hasil tes hanya boleh berisi indikator Level % dengan nilai yang dikenal', p_level;
  end if;
  if (select count(*) from jsonb_array_elements(p_results)) <>
     (select count(distinct r->>'number') from jsonb_array_elements(p_results) r) then
    raise exception 'Satu indikator dinilai lebih dari sekali';
  end if;
  if (select count(*) from jsonb_array_elements(p_results) r where (r->>'number')::int between 1 and 6) < 6 then
    raise exception 'Indikator 1–6 Level % belum selesai dinilai', p_level;
  end if;
  if length(coalesce(p_note, '')) > 1500 then raise exception 'Catatan tes maksimal 1500 karakter'; end if;

  v_passed := (select count(*) from jsonb_array_elements(p_results) r
               where (r->>'number')::int between 1 and 6 and r->>'rating' = 'T') = 6;
  v_final := case when v_passed then least(p_level + 1, 4) else p_level end;

  select id into v_test from diagnostic_tests where student_id = p_student;
  if v_test is null then
    insert into diagnostic_tests(student_id, teacher_id, tested_level, passed, final_level, note)
    values (p_student, auth.uid(), p_level, v_passed, v_final, trim(coalesce(p_note, '')))
    returning id into v_test;
  else
    update diagnostic_tests set tested_level = p_level, passed = v_passed, final_level = v_final,
      note = trim(coalesce(p_note, '')), revised_at = now()
    where id = v_test;
    delete from diagnostic_results where test_id = v_test;
  end if;
  insert into diagnostic_results(test_id, level, indicator_number, rating, indicator_text)
  select v_test, p_level, (r->>'number')::int, r->>'rating', i.text
  from jsonb_array_elements(p_results) r
  join curriculum_level_indicators i on i.level = p_level and i.number = (r->>'number')::int;

  update students set pilot_level = v_final where id = p_student;
  return v_final;
end $$;
revoke execute on function public.save_diagnostic(uuid, integer, jsonb, text) from public, anon;
grant execute on function public.save_diagnostic(uuid, integer, jsonb, text) to authenticated;
