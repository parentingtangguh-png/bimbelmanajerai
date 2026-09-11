-- Changing one child's attendance during class must not discard the shared
-- class guide. Only that child's own AI output is reset.
create or replace function public.save_attendance(p_id uuid,p_attendance text) returns void language plpgsql security definer set search_path=public as $$
declare r session_students; s students;
begin
  if not can_access_session(p_id) then raise exception 'Akses ditolak'; end if;
  select * into r from session_students where id=p_id for update;
  if r.finalized_at is not null then raise exception 'Sesi sudah selesai'; end if;
  if p_attendance not in ('Hadir','Sakit','Izin','Alfa') then raise exception 'Kehadiran tidak valid'; end if;
  if exists(select 1 from ai_jobs where session_student_id=p_id and status='running' and created_at>now()-interval '3 minutes') then
    raise exception 'Tunggu pembuatan AI selesai';
  end if;
  if r.attendance=p_attendance then return; end if;
  select * into s from students where id=r.student_id;
  update session_students set attendance=p_attendance,material='',report=case
    when p_attendance='Sakit' then 'Halo '||s.parent_name||' 😊 Semoga '||s.name||' lekas sembuh. Guru dan teman-teman merindukanmu! Sampai bertemu kembali dalam keadaan sehat. 🌷'
    when p_attendance='Izin' then 'Halo '||s.parent_name||' 😊 Terima kasih sudah memberi kabar. Kami menantikan '||s.name||' di pertemuan berikutnya. Semoga kegiatan keluarga berjalan lancar! 🌷'
    when p_attendance='Alfa' then 'Halo '||s.parent_name||' 😊 Hari ini '||s.name||' belum hadir. Apakah ada kabar yang ingin disampaikan? Kami siap membantu.' else '' end where id=p_id;
  delete from ai_jobs where session_student_id=p_id;
end $$;
