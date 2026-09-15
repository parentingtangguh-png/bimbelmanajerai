-- Fase 2 rencana aplikasi (docs/rencana-aplikasi.md): pergantian ke kurikulum 8 level dan tes diagnostik baru
-- (aturan terkunci di docs/curriculum/diagnostik.md). Disetujui pemilik 15 Sep 2026.

-- 1. Hapus seluruh data siswa percobaan beserta tes dan kelasnya. Akun tim (access_list, profiles) tetap.
delete from public.class_schedule_students;
delete from public.class_schedules;
delete from public.diagnostic_results;
delete from public.diagnostic_tests;
delete from public.assignments;
delete from public.students;

-- 2. Level anak 1–8.
alter table public.students drop constraint if exists students_pilot_level_check;
alter table public.students add constraint students_pilot_level_check check (pilot_level between 1 and 8);

-- 3. Tes diagnostik baru. Satu tes per anak; draf tersimpan di server sampai Simpan final.
drop function if exists public.save_diagnostic(uuid, integer, jsonb, text);
drop table public.diagnostic_results;
drop table public.diagnostic_tests;

create table public.diagnostic_tests(
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null unique references public.students(id) on delete cascade,
  teacher_id uuid not null references public.profiles(id),
  tested_level integer not null check (tested_level between 1 and 8),
  started_on date not null default current_date,
  finalized_at timestamptz,
  -- Diisi saat final: level dan indikator akademik mulai kelas; indikator kosong bila L8 selesai.
  start_level integer check (start_level between 1 and 8),
  start_indicator integer check (start_indicator between 1 and 12),
  curriculum_complete boolean not null default false,
  created_at timestamptz not null default now(),
  check ((finalized_at is null) = (start_level is null)),
  check (finalized_at is null or curriculum_complete = (start_indicator is null))
);

-- Satu baris per tugas yang sudah dinilai; tugas tanpa baris = belum dinilai.
-- number mengikuti k8_indicators (1–12 akademik, 13 English, 14 Karakter).
create table public.diagnostic_results(
  test_id uuid not null references public.diagnostic_tests(id) on delete cascade,
  number integer not null check (number between 1 and 14 and number <> 13),
  status text not null check (status in ('lulus', 'belum')),
  package text not null default 'utama' check (package in ('utama', 'cadangan')),
  primary key (test_id, number)
);

alter table public.diagnostic_tests enable row level security;
alter table public.diagnostic_results enable row level security;
-- Pemilik membaca ringkasan tes; hasil per tugas hanya untuk guru pendamping.
create policy diagnostic_tests_read on public.diagnostic_tests for select to authenticated using (can_teach(student_id));
create policy diagnostic_results_read on public.diagnostic_results for select to authenticated
  using (exists (select 1 from public.diagnostic_tests t where t.id = test_id and can_teach(t.student_id) and not is_owner()));
grant select on public.diagnostic_tests, public.diagnostic_results to authenticated;

-- Tes berhenti: level di atas 1 dan A1, B1, E1, D1 (nomor 1–4) keempatnya Belum.
create function public.diagnostic_stopped(p_test uuid) returns boolean
language sql stable security definer set search_path=public as $$
  select t.tested_level > 1 and (select count(*) from diagnostic_results r
                                 where r.test_id = t.id and r.number between 1 and 4 and r.status = 'belum') = 4
  from diagnostic_tests t where t.id = p_test
$$;
revoke execute on function public.diagnostic_stopped(uuid) from public, anon, authenticated;

-- Awal pita sebelumnya untuk tes yang berhenti: L7/8→5, L5/6→3, L3/4→1, L2→1.
create function public.diagnostic_restart_level(p_level integer) returns integer
language sql immutable set search_path=public as $$
  select greatest(1, ((p_level - 1) / 2) * 2 - 1)
$$;
revoke execute on function public.diagnostic_restart_level(integer) from public, anon, authenticated;

-- Mulai tes. Anak tanpa tes: level bebas 1–8. Tes yang berhenti: hanya diganti tes baru di level saran.
create function public.start_diagnostic(p_student uuid, p_level integer) returns uuid
language plpgsql security definer set search_path=public as $$
declare
  v_old record;
  v_id uuid;
begin
  if is_owner() or not can_teach(p_student) then raise exception 'Tes diagnostik dilakukan oleh guru pendamping'; end if;
  perform 1 from students where id = p_student and status = 'Aktif' for update;
  if not found then raise exception 'Hanya anak aktif yang bisa dites'; end if;
  if p_level is null or p_level not between 1 and 8 then raise exception 'Level yang dites harus Level 1–8'; end if;
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

-- Nilai satu tugas di draf: p_status 'lulus' | 'belum' | null (belum dinilai), paket utama/cadangan.
-- English (13) tidak dinilai pada diagnostik anak baru. Tes yang berhenti tidak bisa diisi lagi.
create function public.rate_diagnostic(p_student uuid, p_number integer, p_status text, p_package text)
returns void language plpgsql security definer set search_path=public as $$
declare v_test record;
begin
  if is_owner() or not can_teach(p_student) then raise exception 'Tes diagnostik dilakukan oleh guru pendamping'; end if;
  select * into v_test from diagnostic_tests where student_id = p_student for update;
  if not found then raise exception 'Tes diagnostik belum dimulai'; end if;
  if v_test.finalized_at is not null then raise exception 'Tes sudah disimpan final dan tidak bisa diubah'; end if;
  if diagnostic_stopped(v_test.id) then raise exception 'Tes berhenti. Mulai tes baru di Level %', diagnostic_restart_level(v_test.tested_level); end if;
  if p_number = 13 then raise exception 'English tidak dinilai pada tes diagnostik anak baru'; end if;
  if p_number is null or p_number not between 1 and 14 then raise exception 'Tugas tidak dikenal'; end if;
  if p_status is not null and p_status not in ('lulus', 'belum') then raise exception 'Nilai hanya Lulus, Belum, atau belum dinilai'; end if;
  if coalesce(p_package, 'utama') not in ('utama', 'cadangan') then raise exception 'Paket hanya utama atau cadangan'; end if;
  delete from diagnostic_results where test_id = v_test.id and number = p_number;
  if p_status is not null then
    insert into diagnostic_results(test_id, number, status, package)
    values (v_test.id, p_number, p_status, coalesce(p_package, 'utama'));
  end if;
end $$;
revoke execute on function public.rate_diagnostic(uuid, integer, text, text) from public, anon;
grant execute on function public.rate_diagnostic(uuid, integer, text, text) to authenticated;

-- Simpan final. Mulai kelas dari indikator akademik pertama yang belum Lulus; 12 Lulus → level berikutnya
-- indikator 1; 12 Lulus di L8 → kurikulum selesai. Belum dinilai dihitung belum lulus.
create function public.finalize_diagnostic(p_student uuid) returns integer
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
    start_level = case when v_first is null then least(v_test.tested_level + 1, 8) else v_test.tested_level end,
    start_indicator = case when v_first is not null then v_first when v_test.tested_level < 8 then 1 end,
    curriculum_complete = v_first is null and v_test.tested_level = 8
  where id = v_test.id;
  update students set pilot_level = (select start_level from diagnostic_tests where id = v_test.id) where id = p_student;
  return (select start_level from diagnostic_tests where id = v_test.id);
end $$;
revoke execute on function public.finalize_diagnostic(uuid) from public, anon;
grant execute on function public.finalize_diagnostic(uuid) to authenticated;

-- 4. Hapus siswa: hanya bila belum pernah ikut kelas (aturan 5 tes diagnostik).
create or replace function public.delete_student(p_student uuid) returns void language plpgsql security definer set search_path=public as $$
begin
  if is_owner() or not can_teach(p_student) then raise exception 'Akses ditolak'; end if;
  perform 1 from students where id = p_student for update;
  if not found then raise exception 'Siswa tidak tersedia'; end if;
  if exists (select 1 from assignments where student_id = p_student and teacher_id <> auth.uid()) then
    raise exception 'Siswa ini juga didampingi guru lain, jadi tidak bisa dihapus.';
  end if;
  if exists (select 1 from class_schedule_students where student_id = p_student) then
    raise exception 'Siswa yang sudah mengikuti kelas tidak bisa dihapus.';
  end if;
  delete from diagnostic_tests where student_id = p_student;
  delete from assignments where student_id = p_student;
  delete from students where id = p_student;
end $$;

-- 5. Ruang kelas dikunci sampai Fase 3 (kelas baru dengan antrean 12 indikator).
create or replace function public.save_schedule(p_schedule uuid, p_payload jsonb) returns uuid
language plpgsql security definer set search_path=public as $$
begin
  raise exception 'Ruang kelas sedang diperbarui untuk kurikulum 8 level';
end $$;
create or replace function public.delete_schedule(p_schedule uuid) returns void
language plpgsql security definer set search_path=public as $$
begin
  raise exception 'Ruang kelas sedang diperbarui untuk kurikulum 8 level';
end $$;
create or replace function public.save_meeting(p_schedule uuid, p_students jsonb, p_finish boolean) returns void
language plpgsql security definer set search_path=public as $$
begin
  raise exception 'Ruang kelas sedang diperbarui untuk kurikulum 8 level';
end $$;
