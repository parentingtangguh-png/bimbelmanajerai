-- Make the 16-level curriculum reachable. The prior migration searched the
-- rendered constraint definition for BETWEEN, but PostgreSQL renders it as
-- >= / <=, so the six original level-10 constraints remained active.
alter table public.students
  drop constraint if exists students_reading_baseline_check,
  drop constraint if exists students_reading_level_check,
  drop constraint if exists students_reading_target_check,
  drop constraint if exists students_math_baseline_check,
  drop constraint if exists students_math_level_check,
  drop constraint if exists students_math_target_check;

-- Observable success criteria stay in the curriculum bank instead of being
-- invented by the AI.
alter table public.curriculum
  add column if not exists reading_criteria text not null default '',
  add column if not exists writing_criteria text not null default '',
  add column if not exists math_criteria text not null default '',
  add column if not exists english_criteria text not null default '',
  add column if not exists character_criteria text not null default '',
  add column if not exists ipas_criteria text not null default '',
  add column if not exists pancasila_criteria text not null default '';

-- Repair the largest content jumps and make IPAS/Pancasila a real staircase.
update public.curriculum set math=case level
  when 1 then 'Menghitung benda 1–5 satu per satu dan mencocokkan jumlah.'
  when 2 then 'Menghitung, membandingkan, dan membuat kelompok benda 1–10.'
  when 3 then 'Mengenali, menulis, dan mengurutkan bilangan 0–20; melakukan tambah konkret sampai 10.'
  when 4 then 'Menyelesaikan tambah-kurang konkret sampai 20 serta mengenali pola dan bentuk dasar.'
  when 5 then 'Memahami puluhan dan satuan sampai 100 serta membandingkan bilangan.'
  when 6 then 'Menyelesaikan tambah-kurang sampai 100 dan menjelaskan strategi dengan benda, gambar, atau simbol.'
  when 7 then 'Memahami nilai tempat sampai 1.000, mengukur panjang dengan satuan baku awal, dan membaca data gambar.'
  when 8 then 'Memahami perkalian sebagai penjumlahan berulang dan pembagian sebagai pengelompokan konkret.'
  when 9 then 'Menguasai fakta perkalian-pembagian dasar serta menyelesaikan soal uang dan pengukuran satu langkah.'
  when 10 then 'Membandingkan pecahan berpembilang satu dan menyelesaikan soal cerita dua langkah.'
  when 11 then 'Menggunakan bilangan sampai 10.000 dan menyelesaikan tambah-kurang sampai 1.000 secara efisien.'
  when 12 then 'Menghubungkan pecahan senilai, desimal awal, persen, pengukuran, dan penyajian data sederhana.'
  when 13 then 'Melakukan operasi pecahan dan desimal dalam masalah sehari-hari serta mengenali pola bilangan.'
  when 14 then 'Menggunakan rasio dan skala sederhana serta menentukan keliling, luas, dan sifat bangun.'
  when 15 then 'Menganalisis data, peluang kejadian sederhana, dan kalimat matematika dengan nilai belum diketahui.'
  when 16 then 'Memodelkan masalah multi-langkah, memilih strategi, membuat estimasi, dan memeriksa kewajaran jawaban.'
end,
ipas=case level
  when 1 then 'Membedakan benda hidup dan tak hidup melalui pengamatan langsung.'
  when 2 then 'Mengenali fungsi pancaindra dan kebiasaan sederhana untuk merawat tubuh.'
  when 3 then 'Mengamati cuaca harian dan menceritakan pengaruhnya terhadap kegiatan.'
  when 4 then 'Membandingkan sifat bahan dan perubahan sederhana melalui kegiatan aman.'
  when 5 then 'Mengidentifikasi bagian tumbuhan dan kebutuhan dasarnya untuk tumbuh.'
  when 6 then 'Mengurutkan daur hidup hewan dan menghubungkannya dengan habitat.'
  when 7 then 'Menyelidiki pengaruh dorongan dan tarikan terhadap gerak benda.'
  when 8 then 'Mengenali bentuk, sumber, perubahan, dan cara menghemat energi.'
  when 9 then 'Menyelidiki wujud zat dan perubahan yang dapat atau tidak dapat balik.'
  when 10 then 'Menjelaskan hubungan makhluk hidup dalam rantai makanan dan ekosistem.'
  when 11 then 'Menghubungkan sistem organ tubuh dengan kebiasaan menjaga kesehatan.'
  when 12 then 'Menyelidiki sifat cahaya dan bunyi serta penerapannya sehari-hari.'
  when 13 then 'Menjelaskan siklus air, cuaca, dan perubahan permukaan bumi berdasarkan model.'
  when 14 then 'Membaca peta Indonesia dan menghubungkan kondisi geografis dengan sumber daya serta kehidupan masyarakat.'
  when 15 then 'Menganalisis penggunaan energi dan merancang tindakan sederhana untuk mengurangi dampak perubahan iklim.'
  when 16 then 'Merancang penyelidikan, mengolah data, mengevaluasi bukti, dan mengomunikasikan solusi masalah lingkungan.'
end,
pancasila=case level
  when 1 then 'Mengenali identitas diri dan menghargai persamaan serta perbedaan dalam keluarga.'
  when 2 then 'Mengikuti aturan bersama dan menjelaskan akibat sederhana ketika aturan tidak dijalankan.'
  when 3 then 'Mengenali bendera, lambang negara, dan perilaku menghormatinya.'
  when 4 then 'Bekerja sama, bergiliran, dan menyelesaikan perbedaan dengan bantuan.'
  when 5 then 'Mengenali lima simbol sila Pancasila dan memberi contoh perilaku sehari-hari.'
  when 6 then 'Membedakan hak dan kewajiban di rumah serta dalam kelompok belajar.'
  when 7 then 'Menghargai keberagaman bahasa, kebiasaan, agama, dan budaya di lingkungan sekitar.'
  when 8 then 'Mengenali lingkungan tempat tinggal sebagai bagian dari wilayah Indonesia dan mempraktikkan gotong royong.'
  when 9 then 'Menjelaskan makna sila Pancasila melalui masalah yang dekat dengan kehidupan anak.'
  when 10 then 'Menyusun dan menjalankan aturan bersama secara adil serta bertanggung jawab.'
  when 11 then 'Menjelaskan makna Bhinneka Tunggal Ika dan cara menjaga keberagaman budaya.'
  when 12 then 'Mengidentifikasi kabupaten/kota dan provinsi sebagai bagian NKRI serta bentuk kerja sama warganya.'
  when 13 then 'Menceritakan kronologi lahirnya Pancasila dan meneladani sikap para perumusnya.'
  when 14 then 'Menghubungkan norma, hak, kewajiban, dan Pembukaan UUD 1945 dengan kehidupan sehari-hari.'
  when 15 then 'Melaksanakan musyawarah, menyampaikan alasan, dan menerima keputusan bersama secara bertanggung jawab.'
  when 16 then 'Menganalisis persoalan kewargaan dan merancang aksi gotong royong yang adil bagi lingkungan.'
end;

update public.curriculum set
  reading_criteria=case when level<=4 then 'Terlihat dalam dua kegiatan berbeda; catat ketepatan dan bantuan yang masih dibutuhkan.' else 'Menunjukkan minimal 4 dari 5 respons tepat dalam dua sesi berbeda dan dapat menjelaskan jawaban bila diminta.' end,
  writing_criteria=case when level<=4 then 'Menghasilkan karya sesuai tujuan pada dua kesempatan dengan bantuan yang makin berkurang.' else 'Memenuhi minimal 3 dari 4 kriteria isi, keruntutan, kosakata, dan kaidah sesuai level pada dua karya berbeda.' end,
  math_criteria=case when level<=4 then 'Menunjukkan konsep melalui benda atau gambar pada minimal 4 dari 5 kesempatan dalam dua sesi.' else 'Menyelesaikan minimal 4 dari 5 tugas setara, menunjukkan strategi, dan memeriksa jawaban dalam dua sesi.' end,
  english_criteria='Merespons atau menghasilkan bahasa sesuai tujuan pada minimal 4 dari 5 kesempatan dengan bantuan sesuai level.',
  character_criteria='Perilaku terlihat pada sedikitnya dua situasi berbeda; guru mencatat konteks dan tingkat bantuan tanpa memberi label pada anak.',
  ipas_criteria='Melakukan pengamatan atau penyelidikan aman, mencatat hasil, dan menyampaikan kesimpulan yang sesuai bukti pada dua kesempatan.',
  pancasila_criteria='Memberi contoh dan mempraktikkan perilaku sesuai tujuan dalam sedikitnya dua situasi nyata atau simulasi.';

create table public.student_competencies (
  student_id uuid not null references public.students(id) on delete cascade,
  subject text not null check(subject in ('reading','writing','math','english','character','ipas','pancasila')),
  baseline integer not null check(baseline between 1 and 16),
  current_level integer not null check(current_level between 1 and 16),
  target integer not null check(target between 1 and 16),
  evidence_count integer not null default 0 check(evidence_count between 0 and 1),
  repeat_count integer not null default 0 check(repeat_count>=0),
  intervention boolean not null default false,
  required boolean not null default true,
  updated_at timestamptz not null default now(),
  primary key(student_id,subject),
  check(baseline<=current_level and current_level<=target)
);

create table public.session_assessments (
  session_student_id uuid not null references public.session_students(id) on delete cascade,
  subject text not null check(subject in ('reading','writing','math','english','character','ipas','pancasila')),
  level_snapshot integer not null check(level_snapshot between 1 and 16),
  rating text check(rating in ('BT','MB','T')),
  evidence_note text not null default '' check(length(evidence_note)<=1000),
  primary key(session_student_id,subject)
);

create index student_competencies_attention_idx on public.student_competencies(student_id,intervention);
create index session_assessments_record_idx on public.session_assessments(session_student_id);

insert into public.student_competencies(student_id,subject,baseline,current_level,target,required)
select s.id,x.subject,
  case when x.subject='math' then s.math_baseline else s.reading_baseline end,
  case when x.subject='math' then s.math_level else s.reading_level end,
  case when x.subject='math' then s.math_target else s.reading_target end,
  x.subject<>'english'
from public.students s
cross join (values ('reading'),('writing'),('math'),('english'),('character'),('ipas'),('pancasila')) x(subject)
on conflict do nothing;

create or replace function public.initialize_student_competencies() returns trigger language plpgsql security definer set search_path=public as $$
begin
  insert into student_competencies(student_id,subject,baseline,current_level,target,required) values
    (new.id,'reading',new.reading_baseline,new.reading_level,new.reading_target,true),
    (new.id,'writing',new.reading_baseline,new.reading_level,new.reading_target,true),
    (new.id,'math',new.math_baseline,new.math_level,new.math_target,true),
    (new.id,'english',new.reading_baseline,new.reading_level,new.reading_target,false),
    (new.id,'character',new.reading_baseline,new.reading_level,new.reading_target,true),
    (new.id,'ipas',new.reading_baseline,new.reading_level,new.reading_target,true),
    (new.id,'pancasila',new.reading_baseline,new.reading_level,new.reading_target,true)
  on conflict do nothing;
  return new;
end $$;
create trigger initialize_student_competencies after insert on public.students for each row execute function public.initialize_student_competencies();

create or replace function public.sync_core_competency_targets() returns trigger language plpgsql security definer set search_path=public as $$
begin
  update student_competencies set target=new.reading_target,updated_at=now() where student_id=new.id and subject='reading';
  update student_competencies set target=new.math_target,updated_at=now() where student_id=new.id and subject='math';
  return new;
end $$;
create trigger sync_core_competency_targets after update of reading_target,math_target on public.students for each row execute function public.sync_core_competency_targets();

alter table public.student_competencies enable row level security;
alter table public.session_assessments enable row level security;
create policy competencies_read on public.student_competencies for select to authenticated using(can_teach(student_id));
create policy competencies_owner on public.student_competencies for update to authenticated using(is_owner()) with check(is_owner());
create policy assessments_read on public.session_assessments for select to authenticated using(can_access_session(session_student_id));
grant select on public.student_competencies,public.session_assessments to authenticated;
grant update on public.student_competencies to authenticated;

create or replace function public.create_student(p_payload jsonb) returns uuid language plpgsql security definer set search_path=public as $$
declare sid uuid;
begin
  if not is_member() then raise exception 'Akun tidak aktif'; end if;
  insert into students(name,parent_name,phone,interest,diagnostic,learning_notes,reading_baseline,reading_level,reading_target,math_baseline,math_level,math_target)
  values (trim(p_payload->>'name'),trim(p_payload->>'parent_name'),coalesce(p_payload->>'phone',''),trim(p_payload->>'interest'),coalesce(p_payload->>'diagnostic',''),coalesce(p_payload->>'learning_notes',''),greatest(1,least(16,(p_payload->>'reading_baseline')::int)),greatest(1,least(16,(p_payload->>'reading_baseline')::int)),greatest(1,least(16,(p_payload->>'reading_target')::int)),greatest(1,least(16,(p_payload->>'math_baseline')::int)),greatest(1,least(16,(p_payload->>'math_baseline')::int)),greatest(1,least(16,(p_payload->>'math_target')::int))) returning id into sid;
  if not is_owner() then insert into assignments(student_id,teacher_id) values(sid,auth.uid()); end if;
  return sid;
end $$;

create or replace function public.create_class(p_id uuid,p_date date,p_theme text,p_students uuid[]) returns uuid language plpgsql security definer set search_path=public as $$
declare sid uuid; rid uuid; s students; existing class_sessions; cross_subject text; completed_count integer;
begin
  if not is_member() then raise exception 'Akses ditolak'; end if;
  select * into existing from class_sessions where id=p_id;
  if found then
    if existing.teacher_id<>auth.uid() then raise exception 'Akses ditolak'; end if;
    return p_id;
  end if;
  if coalesce(array_length(p_students,1),0) not between 1 and 50 then raise exception 'Pilih 1–50 siswa'; end if;
  insert into class_sessions(id,teacher_id,date,theme) values(p_id,auth.uid(),p_date,trim(p_theme));
  foreach sid in array p_students loop
    select * into s from students where id=sid for update;
    if not found or not can_teach(sid) or s.status<>'Aktif' then raise exception 'Siswa tidak tersedia'; end if;
    if exists(select 1 from session_students where student_id=sid and finalized_at is null) then raise exception 'Selesaikan sesi sebelumnya untuk %',s.name; end if;
    insert into session_students(session_id,student_id,reading_snapshot,math_snapshot) values(p_id,sid,s.reading_level,s.math_level) returning id into rid;
    select count(*) into completed_count from session_students where student_id=sid and finalized_at is not null and attendance='Hadir';
    cross_subject:=(array['writing','english','ipas','pancasila','character'])[(completed_count % 5)+1];
    insert into session_assessments(session_student_id,subject,level_snapshot)
      select rid,subject,current_level from student_competencies
      where student_id=sid and subject in ('reading','math',cross_subject);
  end loop;
  insert into themes(name) values(trim(p_theme)) on conflict(name) do nothing;
  return p_id;
end $$;

-- Give already-open sessions safe targets after deployment.
insert into public.session_assessments(session_student_id,subject,level_snapshot)
select r.id,c.subject,c.current_level
from public.session_students r join public.student_competencies c on c.student_id=r.student_id
where r.finalized_at is null and c.subject in ('reading','math','writing')
on conflict do nothing;

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
      where student_id=s.id and subject=item->>'subject';
    end loop;
    update students set
      reading_level=(select current_level from student_competencies where student_id=s.id and subject='reading'),
      math_level=(select current_level from student_competencies where student_id=s.id and subject='math')
    where id=s.id;
    select case when bool_and(rating='T') then 'SB' when bool_or(rating='BT') then 'MB' else 'BSH' end into derived_grade
      from session_assessments where session_student_id=p_id;
    select coalesce(max(repeat_count),0),coalesce(bool_or(intervention),false) into max_repeats,needs_help
      from student_competencies where student_id=s.id;
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
  if exists(select 1 from student_competencies where student_id=p_student and required and current_level<target) then raise exception 'Target kompetensi wajib belum tercapai'; end if;
  update students set summative_score=p_score,status=case when p_pass then 'Lulus' else 'Aktif' end where id=p_student;
  if not found then raise exception 'Siswa tidak tersedia'; end if;
end $$;

revoke execute on function public.initialize_student_competencies(),public.sync_core_competency_targets(),public.finalize_competency_evaluation(uuid,jsonb,text) from public,anon;
grant execute on function public.create_student(jsonb),public.create_class(uuid,date,text,uuid[]),public.finalize_competency_evaluation(uuid,jsonb,text),public.complete_summative(uuid,integer,boolean) to authenticated;
