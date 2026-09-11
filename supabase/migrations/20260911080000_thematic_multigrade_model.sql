-- Thematic multigrade model: one class plan, differentiated groups, spiral
-- targets, English exposure in every theme, and character observations.

alter table public.class_sessions
  add column if not exists duration_minutes smallint not null default 60
    check(duration_minutes in (60,75,90)),
  add column if not exists material text not null default '';

alter table public.session_students
  add column if not exists group_no smallint not null default 1
    check(group_no between 1 and 3);

alter table public.curriculum
  add column if not exists listening text not null default '',
  add column if not exists speaking text not null default '',
  add column if not exists listening_criteria text not null default '',
  add column if not exists speaking_criteria text not null default '';

update public.curriculum set
  listening=case level
    when 1 then 'Menyimak bunyi, kata, atau instruksi satu langkah dan memberikan respons sederhana.'
    when 2 then 'Menyimak dua kata kunci dalam percakapan atau cerita sangat pendek.'
    when 3 then 'Mengikuti instruksi dua langkah dengan bantuan gerak atau gambar.'
    when 4 then 'Menyimak cerita pendek dan menyebutkan tokoh atau benda utama.'
    when 5 then 'Menemukan informasi tersurat dari percakapan atau teks lisan pendek.'
    when 6 then 'Mengurutkan dua sampai tiga peristiwa setelah menyimak cerita.'
    when 7 then 'Membedakan fakta sederhana dan pendapat dalam percakapan dekat anak.'
    when 8 then 'Mencatat kata kunci dan menjelaskan kembali isi teks lisan.'
    when 9 then 'Menemukan gagasan pokok dan informasi pendukung dari paparan singkat.'
    when 10 then 'Menyimpulkan pesan serta tujuan pembicara dari teks lisan.'
    when 11 then 'Membandingkan informasi dari dua paparan lisan bertema sama.'
    when 12 then 'Mencatat informasi penting dan pertanyaan lanjutan dari diskusi.'
    when 13 then 'Menilai kecukupan alasan dan bukti dalam presentasi sederhana.'
    when 14 then 'Merangkum paparan informatif dengan struktur yang runtut.'
    when 15 then 'Mengevaluasi sudut pandang dan informasi bias dalam teks lisan.'
    when 16 then 'Mensintesis informasi dari diskusi dan paparan untuk membuat keputusan beralasan.'
  end,
  speaking=case level
    when 1 then 'Menjawab pertanyaan dengan kata, gerak, atau frasa sederhana.'
    when 2 then 'Menyebutkan nama benda, tindakan, dan kebutuhan yang dekat dengan diri.'
    when 3 then 'Menyampaikan kalimat sederhana tentang pengalaman atau hasil pengamatan.'
    when 4 then 'Menceritakan kembali dua peristiwa secara berurutan dengan bantuan gambar.'
    when 5 then 'Bertanya dan menjawab secara bergiliran menggunakan kalimat yang jelas.'
    when 6 then 'Menceritakan pengalaman dengan awal, kejadian, dan akhir sederhana.'
    when 7 then 'Menjelaskan cara melakukan sesuatu menggunakan urutan yang tepat.'
    when 8 then 'Menyampaikan pendapat sederhana beserta satu alasan.'
    when 9 then 'Mempresentasikan informasi tema dengan kosakata yang sesuai.'
    when 10 then 'Menanggapi pendapat orang lain secara santun dan relevan.'
    when 11 then 'Menyampaikan pendapat dengan dua alasan atau bukti pendukung.'
    when 12 then 'Memimpin atau merangkum hasil diskusi kelompok kecil.'
    when 13 then 'Menyajikan laporan pengamatan secara runtut dan menjawab pertanyaan.'
    when 14 then 'Berargumentasi dengan klaim, alasan, dan bukti yang dapat diperiksa.'
    when 15 then 'Menyesuaikan gaya, kosakata, dan struktur presentasi dengan pendengar.'
    when 16 then 'Memfasilitasi diskusi, menimbang pandangan berbeda, dan menyampaikan kesimpulan bersama.'
  end,
  english=case level
    when 1 then 'Mengenali dan menirukan 3 kosakata konkret yang muncul dalam tema.'
    when 2 then 'Merespons 3–5 kosakata tema melalui gerak, benda, atau pilihan gambar.'
    when 3 then 'Menggunakan frasa dua kata yang berkaitan dengan tema.'
    when 4 then 'Mengikuti satu instruksi kelas dan mengucapkan satu ungkapan tematik.'
    when 5 then 'Bertanya atau menjawab dengan pola kalimat sangat sederhana dalam permainan tema.'
    when 6 then 'Menggunakan 5–7 kosakata dan dua ungkapan tematik dalam dialog terpandu.'
    when 7 then 'Menyampaikan deskripsi satu sampai dua kalimat tentang benda atau kegiatan tema.'
    when 8 then 'Melakukan dialog pendek tiga sampai empat giliran dalam konteks tema.'
    when 9 then 'Membaca atau menyimak teks tematik pendek dan menemukan informasi langsung.'
    when 10 then 'Menulis atau mengucapkan tiga kalimat terkait pengalaman dalam tema.'
    when 11 then 'Membandingkan dua objek atau keadaan menggunakan kosakata tema.'
    when 12 then 'Menceritakan urutan proses sederhana dengan bantuan kata penghubung.'
    when 13 then 'Menjelaskan hasil pengamatan tematik dalam paragraf atau paparan pendek.'
    when 14 then 'Bertukar pendapat dan memberi alasan sederhana dalam konteks tema.'
    when 15 then 'Menyimpulkan teks tematik dan mengajukan pertanyaan lanjutan.'
    when 16 then 'Mempresentasikan proyek tema serta menanggapi pertanyaan dengan bahasa yang komunikatif.'
  end,
  ipas=case level
    when 1 then 'Mengamati benda hidup, benda tak hidup, diri, dan keluarga dalam tema terdekat.'
    when 2 then 'Mengenali fungsi pancaindra, kebiasaan merawat tubuh, serta aturan aman bersama.'
    when 3 then 'Mengamati cuaca dan menjelaskan pengaruhnya terhadap kegiatan keluarga atau kelompok.'
    when 4 then 'Membandingkan sifat bahan serta mempraktikkan kerja sama dan tanggung jawab saat penyelidikan.'
    when 5 then 'Mengidentifikasi bagian dan kebutuhan tumbuhan serta peran manusia dalam merawat lingkungan.'
    when 6 then 'Mengurutkan daur hidup hewan, menghubungkannya dengan habitat, dan menghargai perbedaan makhluk hidup.'
    when 7 then 'Menyelidiki gaya dan gerak serta menyusun aturan penggunaan alat yang aman dan adil.'
    when 8 then 'Mengenali sumber dan perubahan energi serta merancang kebiasaan hemat energi bersama.'
    when 9 then 'Menyelidiki perubahan zat dan menghubungkannya dengan kegiatan produksi atau konsumsi setempat.'
    when 10 then 'Menjelaskan rantai makanan, keseimbangan ekosistem, dan tanggung jawab warga menjaganya.'
    when 11 then 'Menghubungkan sistem tubuh dengan kebiasaan sehat, hak memperoleh lingkungan sehat, dan tanggung jawab diri.'
    when 12 then 'Menyelidiki cahaya dan bunyi serta menjelaskan pemanfaatannya dalam kehidupan dan budaya masyarakat.'
    when 13 then 'Menjelaskan siklus air, cuaca, perubahan muka bumi, dan dampaknya pada kehidupan masyarakat.'
    when 14 then 'Membaca peta Indonesia dan menghubungkan kondisi geografis dengan sumber daya, budaya, serta keberagaman warga.'
    when 15 then 'Menganalisis penggunaan energi dan merancang aksi musyawarah untuk mengurangi dampak perubahan iklim.'
    when 16 then 'Merancang penyelidikan, mengolah bukti, dan mengomunikasikan solusi lingkungan yang adil serta dapat dilakukan bersama.'
  end,
  listening_criteria=case when level<=4 then 'Memberikan respons yang sesuai pada dua kesempatan dengan bantuan yang makin berkurang.' else 'Menangkap gagasan dan informasi penting dengan tepat pada minimal 4 dari 5 butir dalam dua kesempatan.' end,
  speaking_criteria=case when level<=4 then 'Menyampaikan respons yang dapat dipahami pada dua kesempatan dengan bantuan yang makin berkurang.' else 'Menyampaikan isi secara relevan, runtut, dan dapat dipahami pada dua kesempatan berbeda.' end,
  english_criteria='Menggunakan atau merespons kosakata dan ungkapan yang menyatu dengan tema pada sedikitnya dua kesempatan, dengan bantuan sesuai level.';

alter table public.student_competencies
  drop constraint if exists student_competencies_subject_check;
alter table public.student_competencies
  add constraint student_competencies_subject_check
    check(subject in ('listening','speaking','reading','writing','math','ipas','english','character','pancasila')),
  add column if not exists active boolean not null default true;

alter table public.session_assessments
  drop constraint if exists session_assessments_subject_check;
alter table public.session_assessments
  add constraint session_assessments_subject_check
    check(subject in ('listening','speaking','reading','writing','math','ipas','english','character','pancasila'));

-- Historical Pancasila and Character levels remain readable as an archive.
update public.student_competencies
set active=false,required=false,updated_at=now()
where subject in ('character','pancasila');

insert into public.student_competencies(student_id,subject,baseline,current_level,target,required,active)
select s.id,x.subject,s.reading_baseline,s.reading_level,s.reading_target,true,true
from public.students s cross join (values ('listening'),('speaking')) x(subject)
on conflict do nothing;

create or replace function public.initialize_student_competencies() returns trigger language plpgsql security definer set search_path=public as $$
begin
  insert into student_competencies(student_id,subject,baseline,current_level,target,required,active) values
    (new.id,'listening',new.reading_baseline,new.reading_level,new.reading_target,true,true),
    (new.id,'speaking',new.reading_baseline,new.reading_level,new.reading_target,true,true),
    (new.id,'reading',new.reading_baseline,new.reading_level,new.reading_target,true,true),
    (new.id,'writing',new.reading_baseline,new.reading_level,new.reading_target,true,true),
    (new.id,'math',new.math_baseline,new.math_level,new.math_target,true,true),
    (new.id,'ipas',new.reading_baseline,new.reading_level,new.reading_target,true,true),
    (new.id,'english',new.reading_baseline,new.reading_level,new.reading_target,false,true)
  on conflict do nothing;
  return new;
end $$;

create table public.session_observations (
  session_student_id uuid primary key references public.session_students(id) on delete cascade,
  english_rating text check(english_rating in ('BT','MB','T')),
  english_note text not null default '' check(length(english_note)<=1000),
  character_dimensions text[] not null default '{}',
  character_note text not null default '' check(length(character_note)<=1000),
  check(character_dimensions <@ array['kemandirian','tanggung_jawab','kerja_sama','kepedulian','komunikasi_santun']::text[])
);
alter table public.session_observations enable row level security;
create policy observations_read on public.session_observations for select to authenticated using(can_access_session(session_student_id));
grant select on public.session_observations to authenticated;

create table public.class_ai_jobs (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null unique references public.class_sessions(id) on delete cascade,
  requested_by uuid references public.profiles,
  status text not null default 'running' check(status in ('running','done','failed')),
  attempts integer not null default 1,
  created_at timestamptz not null default now()
);
alter table public.class_ai_jobs enable row level security;
revoke all on public.class_ai_jobs from authenticated,anon;

create or replace function public.create_class(p_id uuid,p_date date,p_theme text,p_students uuid[],p_duration integer) returns uuid language plpgsql security definer set search_path=public as $$
declare
  sid uuid; rid uuid; s students; existing class_sessions; session_index integer;
  target_count integer; rotation text[]:=array['reading','math','writing','ipas','listening','speaking'];
  focus text[]:='{}'; pos integer;
begin
  if not is_member() then raise exception 'Akses ditolak'; end if;
  select * into existing from class_sessions where id=p_id;
  if found then
    if existing.teacher_id<>auth.uid() then raise exception 'Akses ditolak'; end if;
    return p_id;
  end if;
  if p_duration not in (60,75,90) then raise exception 'Durasi kelas harus 60, 75, atau 90 menit'; end if;
  if coalesce(array_length(p_students,1),0) not between 1 and 50 then raise exception 'Pilih 1–50 siswa'; end if;
  select count(*) into session_index from class_sessions where teacher_id=auth.uid();
  target_count:=case when p_duration=90 then 3 else 2 end;
  for pos in 0..target_count-1 loop
    focus:=array_append(focus,rotation[((session_index+pos) % array_length(rotation,1))+1]);
  end loop;
  insert into class_sessions(id,teacher_id,date,theme,duration_minutes) values(p_id,auth.uid(),p_date,trim(p_theme),p_duration);
  foreach sid in array p_students loop
    select * into s from students where id=sid for update;
    if not found or not can_teach(sid) or s.status<>'Aktif' then raise exception 'Siswa tidak tersedia'; end if;
    if exists(select 1 from session_students where student_id=sid and finalized_at is null) then raise exception 'Selesaikan sesi sebelumnya untuk %',s.name; end if;
    insert into session_students(session_id,student_id,reading_snapshot,math_snapshot)
      values(p_id,sid,s.reading_level,s.math_level) returning id into rid;
    insert into session_assessments(session_student_id,subject,level_snapshot)
      select rid,subject,current_level from student_competencies
      where student_id=sid and active and subject=any(focus);
    insert into session_observations(session_student_id) values(rid);
  end loop;
  with scores as (
    select r.id,avg(a.level_snapshot)::numeric as score
    from session_students r join session_assessments a on a.session_student_id=r.id
    where r.session_id=p_id group by r.id
  ), totals as (
    select count(*)::integer as n from scores
  ), grouped as (
    select scores.id,ntile(least(3,totals.n)) over(order by scores.score,scores.id) as group_no
    from scores cross join totals
  )
  update session_students r set group_no=grouped.group_no from grouped where r.id=grouped.id;
  insert into themes(name) values(trim(p_theme)) on conflict(name) do nothing;
  return p_id;
end $$;

create or replace function public.create_class(p_id uuid,p_date date,p_theme text,p_students uuid[]) returns uuid language sql security definer set search_path=public as $$
  select public.create_class(p_id,p_date,p_theme,p_students,60)
$$;

create or replace function public.save_attendance(p_id uuid,p_attendance text) returns void language plpgsql security definer set search_path=public as $$
declare r session_students; s students;
begin
  if not can_access_session(p_id) then raise exception 'Akses ditolak'; end if;
  select * into r from session_students where id=p_id for update;
  if r.finalized_at is not null then raise exception 'Sesi sudah selesai'; end if;
  if p_attendance not in ('Hadir','Sakit','Izin','Alfa') then raise exception 'Kehadiran tidak valid'; end if;
  if exists(select 1 from ai_jobs where session_student_id=p_id and status='running' and created_at>now()-interval '3 minutes')
    or exists(select 1 from class_ai_jobs where session_id=r.session_id and status='running' and created_at>now()-interval '3 minutes') then
    raise exception 'Tunggu pembuatan AI selesai';
  end if;
  if r.attendance=p_attendance then return; end if;
  select * into s from students where id=r.student_id;
  update session_students set attendance=p_attendance,material='',report=case
    when p_attendance='Sakit' then 'Halo '||s.parent_name||' 😊 Semoga '||s.name||' lekas sembuh. Guru dan teman-teman merindukanmu! Sampai bertemu kembali dalam keadaan sehat. 🌷'
    when p_attendance='Izin' then 'Halo '||s.parent_name||' 😊 Terima kasih sudah memberi kabar. Kami menantikan '||s.name||' di pertemuan berikutnya. Semoga kegiatan keluarga berjalan lancar! 🌷'
    when p_attendance='Alfa' then 'Halo '||s.parent_name||' 😊 Hari ini '||s.name||' belum hadir. Apakah ada kabar yang ingin disampaikan? Kami siap membantu.' else '' end where id=p_id;
  update class_sessions set material='' where id=r.session_id;
  delete from ai_jobs where session_student_id=p_id;
  delete from class_ai_jobs where session_id=r.session_id;
end $$;

create function public.claim_class_ai_job(p_session uuid) returns uuid language plpgsql security definer set search_path=public as $$
declare c class_sessions; j class_ai_jobs; job_id uuid;
begin
  select * into c from class_sessions where id=p_session and is_member() and (is_owner() or teacher_id=auth.uid()) for update;
  if not found then raise exception 'Akses ditolak'; end if;
  if c.material<>'' then return null; end if;
  if not exists(select 1 from session_students where session_id=p_session and attendance='Hadir') then raise exception 'Tidak ada siswa hadir'; end if;
  select * into j from class_ai_jobs where session_id=p_session;
  if j.status='running' and j.created_at>now()-interval '3 minutes' then raise exception 'Pembuatan AI sedang berlangsung, tunggu sebentar'; end if;
  if j.attempts>=5 then raise exception 'Batas percobaan AI untuk kelas ini tercapai. Hubungi pemilik.'; end if;
  if (select coalesce(sum(attempts),0) from ai_jobs where requested_by=auth.uid() and created_at>now()-interval '24 hours')+
     (select coalesce(sum(attempts),0) from class_ai_jobs where requested_by=auth.uid() and created_at>now()-interval '24 hours')>=100 then
    raise exception 'Batas 100 permintaan AI harian tercapai';
  end if;
  job_id:=gen_random_uuid();
  insert into class_ai_jobs(id,session_id,requested_by) values(job_id,p_session,auth.uid())
  on conflict(session_id) do update set id=excluded.id,status='running',created_at=now(),requested_by=auth.uid(),attempts=class_ai_jobs.attempts+1;
  return job_id;
end $$;

create function public.finish_class_ai_job(p_job uuid,p_output text,p_failed boolean default false) returns boolean language plpgsql security definer set search_path=public as $$
declare j class_ai_jobs;
begin
  select * into j from class_ai_jobs where id=p_job and status='running' for update;
  if not found then return false; end if;
  if p_failed then update class_ai_jobs set status='failed' where id=p_job; return true; end if;
  if p_output is null or length(trim(p_output))<10 or length(p_output)>20000 then raise exception 'Output AI tidak valid'; end if;
  update class_sessions set material=p_output where id=j.session_id;
  update class_ai_jobs set status='done' where id=p_job;
  return true;
end $$;

create or replace function public.finalize_competency_evaluation(p_id uuid,p_assessments jsonb,p_anecdote text,p_observation jsonb) returns void language plpgsql security definer set search_path=public as $$
declare r session_students; english_value text; dimensions text[];
begin
  if not can_access_session(p_id) then raise exception 'Akses ditolak'; end if;
  select * into r from session_students where id=p_id for update;
  if r.finalized_at is not null then return; end if;
  if r.attendance='Hadir' then
    english_value:=nullif(coalesce(p_observation->>'english_rating',''),'');
    if english_value is not null and english_value not in ('BT','MB','T') then raise exception 'Observasi Bahasa Inggris tidak valid'; end if;
    select coalesce(array_agg(value),array[]::text[]) into dimensions
      from jsonb_array_elements_text(coalesce(p_observation->'character_dimensions','[]'::jsonb));
    if not dimensions <@ array['kemandirian','tanggung_jawab','kerja_sama','kepedulian','komunikasi_santun']::text[] then raise exception 'Dimensi karakter tidak valid'; end if;
    insert into session_observations(session_student_id,english_rating,english_note,character_dimensions,character_note)
      values(p_id,english_value,left(coalesce(p_observation->>'english_note',''),1000),dimensions,left(coalesce(p_observation->>'character_note',''),1000))
    on conflict(session_student_id) do update set english_rating=excluded.english_rating,english_note=excluded.english_note,
      character_dimensions=excluded.character_dimensions,character_note=excluded.character_note;
    if english_value is not null then
      update student_competencies set
        current_level=case when english_value='T' and evidence_count+1>=2 then least(current_level+1,target) else current_level end,
        evidence_count=case when english_value='T' then case when evidence_count+1>=2 then 0 else evidence_count+1 end else evidence_count end,
        repeat_count=case when english_value='T' then 0 else repeat_count+1 end,
        intervention=false,updated_at=now()
      where student_id=r.student_id and subject='english' and active;
    end if;
  end if;
  perform public.finalize_competency_evaluation(p_id,p_assessments,p_anecdote);
end $$;

-- Keep the original three-argument endpoint for sessions opened before this
-- migration, but calculate operational alerts only from active competencies.
create or replace function public.finalize_competency_evaluation(p_id uuid,p_assessments jsonb,p_anecdote text) returns void language plpgsql security definer set search_path=public as $$
declare r session_students; s students; item jsonb; expected_count integer; submitted_count integer; derived_grade text; max_repeats integer; needs_help boolean;
begin
  if not can_access_session(p_id) then raise exception 'Akses ditolak'; end if;
  select * into r from session_students where id=p_id for update;
  if r.finalized_at is not null then return; end if;
  if length(coalesce(p_anecdote,''))>3000 then raise exception 'Catatan maksimal 3000 karakter'; end if;
  select * into s from students where id=r.student_id for update;
  if s.status<>'Aktif' then raise exception 'Siswa tidak aktif'; end if;
  if r.attendance='Hadir' then
    if jsonb_typeof(p_assessments)<>'array' then raise exception 'Asesmen tidak valid'; end if;
    select count(*) into expected_count from session_assessments where session_student_id=p_id;
    select count(distinct value->>'subject') into submitted_count from jsonb_array_elements(p_assessments);
    if expected_count=0 or submitted_count<>expected_count or jsonb_array_length(p_assessments)<>expected_count then raise exception 'Lengkapi semua target kompetensi'; end if;
    for item in select value from jsonb_array_elements(p_assessments) loop
      if coalesce(item->>'rating','') not in ('BT','MB','T') then raise exception 'Pilih perkembangan setiap kompetensi'; end if;
      update session_assessments set rating=item->>'rating',evidence_note=left(coalesce(item->>'note',''),1000)
        where session_student_id=p_id and subject=item->>'subject';
      if not found then raise exception 'Target kompetensi tidak tersedia'; end if;
      update student_competencies set
        current_level=case when item->>'rating'='T' and evidence_count+1>=2 then least(current_level+1,target) else current_level end,
        evidence_count=case when item->>'rating'='T' then case when evidence_count+1>=2 then 0 else evidence_count+1 end else evidence_count end,
        repeat_count=case when item->>'rating'='T' then 0 else repeat_count+1 end,
        intervention=case when item->>'rating'='T' then false else repeat_count+1>=3 end,
        updated_at=now()
      where student_id=s.id and subject=item->>'subject' and active;
    end loop;
    update students set
      reading_level=(select current_level from student_competencies where student_id=s.id and subject='reading'),
      math_level=(select current_level from student_competencies where student_id=s.id and subject='math')
    where id=s.id;
    select case when bool_and(rating='T') then 'SB' when bool_or(rating='BT') then 'MB' else 'BSH' end into derived_grade
      from session_assessments where session_student_id=p_id;
    select coalesce(max(repeat_count),0),coalesce(bool_or(intervention),false) into max_repeats,needs_help
      from student_competencies where student_id=s.id and active and required;
    insert into student_alerts(student_id,repeat_count,reading_level,math_level,intervention)
      values(s.id,max_repeats,(select reading_level from students where id=s.id),(select math_level from students where id=s.id),needs_help)
    on conflict(student_id) do update set repeat_count=excluded.repeat_count,reading_level=excluded.reading_level,math_level=excluded.math_level,intervention=excluded.intervention,updated_at=now();
  end if;
  update session_students set grade=case when attendance='Hadir' then derived_grade else null end,anecdote=coalesce(p_anecdote,''),finalized_at=now() where id=p_id;
end $$;

create or replace function public.complete_summative(p_student uuid,p_score integer,p_pass boolean) returns void language plpgsql security definer set search_path=public as $$
begin
  if not is_owner() then raise exception 'Hanya pemilik'; end if;
  if p_score not between 1 and 100 then raise exception 'Nilai harus 1–100'; end if;
  if exists(select 1 from session_students where student_id=p_student and finalized_at is null) then raise exception 'Selesaikan sesi terbuka terlebih dahulu'; end if;
  if exists(select 1 from student_competencies where student_id=p_student and active and required and current_level<target) then raise exception 'Target kompetensi wajib belum tercapai'; end if;
  update students set
    reading_level=(select current_level from student_competencies where student_id=p_student and subject='reading'),
    math_level=(select current_level from student_competencies where student_id=p_student and subject='math'),
    summative_score=p_score,status=case when p_pass then 'Lulus' else 'Aktif' end
  where id=p_student;
  if not found then raise exception 'Siswa tidak tersedia'; end if;
end $$;

revoke execute on function public.initialize_student_competencies(),public.claim_class_ai_job(uuid),public.finish_class_ai_job(uuid,text,boolean),public.finalize_competency_evaluation(uuid,jsonb,text,jsonb) from public,anon,authenticated;
grant execute on function public.create_class(uuid,date,text,uuid[],integer),public.finalize_competency_evaluation(uuid,jsonb,text,jsonb),public.claim_class_ai_job(uuid) to authenticated;
grant execute on function public.finish_class_ai_job(uuid,text,boolean) to service_role;
