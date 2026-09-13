-- Alur kelas pilot, tahap 2 (keputusan pemilik 14 Sep 2026): saat kelas guru memberi setiap siswa di jadwal
-- Lulus / Belum / Tidak hadir, lalu menandai pertemuan selesai. Semua siswa wajib diberi hasil; jadwal yang
-- selesai dikunci. Indikator yang pernah Lulus menjadi riwayat siswa, dan jadwal berikutnya menyarankan
-- indikator terkecil yang belum lulus (aplikasi yang menyarankan; guru tetap boleh mengganti).
alter table public.class_schedule_students
  add column result text check (result in ('lulus', 'belum', 'absen'));

create function public.complete_schedule(p_schedule uuid, p_results jsonb) returns void
language plpgsql security definer set search_path=public as $$
begin
  if not is_member() or is_owner() then raise exception 'Pertemuan ditandai selesai oleh guru pengajar'; end if;
  perform 1 from class_schedules where id = p_schedule and teacher_id = auth.uid() for update;
  if not found then raise exception 'Jadwal tidak tersedia'; end if;
  if exists (select 1 from class_schedules where id = p_schedule and completed_at is not null) then
    raise exception 'Pertemuan ini sudah ditandai selesai';
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
revoke execute on function public.complete_schedule(uuid, jsonb) from public, anon;
grant execute on function public.complete_schedule(uuid, jsonb) to authenticated;
