-- Account membership is provisioned by the owner; never trust user metadata for roles.
create table public.access_list (
  email text primary key check (email = lower(email)),
  name text not null,
  role text not null check (role in ('owner','teacher')),
  active boolean not null default true
);
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  name text not null
);
create function public.is_owner() returns boolean language sql stable security definer set search_path = public
as $$ select exists(select 1 from profiles p join access_list a on a.email=p.email where p.id=auth.uid() and a.active and a.role='owner') $$;
create function public.is_member() returns boolean language sql stable security definer set search_path = public
as $$ select exists(select 1 from profiles p join access_list a on a.email=p.email where p.id=auth.uid() and a.active) $$;
create function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not exists(select 1 from access_list where email=lower(new.email) and active) then raise exception 'Email belum didaftarkan oleh pemilik.'; end if;
  insert into profiles(id,email,name) select new.id,lower(new.email),name from access_list where email=lower(new.email);
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();
create table public.students (
  id uuid primary key default gen_random_uuid(),
  name text not null check(length(trim(name)) between 1 and 120),
  parent_name text not null check(length(trim(parent_name)) between 1 and 120),
  phone text not null default '', interest text not null default '',
  diagnostic text not null default '', learning_notes text not null default '',
  reading_baseline integer not null check(reading_baseline between 1 and 10),
  reading_level integer not null check(reading_level between 1 and 10),
  reading_target integer not null check(reading_target between 1 and 10),
  math_baseline integer not null check(math_baseline between 1 and 10),
  math_level integer not null check(math_level between 1 and 10),
  math_target integer not null check(math_target between 1 and 10),
  status text not null default 'Aktif' check(status in ('Aktif','Lulus','Non-Aktif')),
  summative_score integer check(summative_score between 1 and 100),
  created_at timestamptz not null default now(),
  check(reading_baseline<=reading_level and reading_level<=reading_target),
  check(math_baseline<=math_level and math_level<=math_target),
  check(status<>'Lulus' or (summative_score is not null and reading_level=reading_target and math_level=math_target))
);
create table public.assignments (
  student_id uuid references students on delete cascade,
  teacher_id uuid references profiles on delete cascade,
  primary key(student_id,teacher_id)
);
create function public.can_teach(sid uuid) returns boolean language sql stable security definer set search_path = public
as $$ select is_member() and (is_owner() or exists(select 1 from assignments where student_id=sid and teacher_id=auth.uid())) $$;
create table public.themes(id uuid primary key default gen_random_uuid(), name text unique not null check(length(trim(name)) between 1 and 120));
insert into themes(name) values ('Pasar'),('Alam & Lingkungan'),('Kebersihan'),('Keluargaku');
create table public.curriculum (
  level integer primary key check(level between 1 and 10),
  reading text not null, writing text not null, math text not null, english text not null, character text not null
);
insert into curriculum values
(1,'Kenali vokal a, i, u. Tunjukkan dan sebutkan 3 huruf.','Tarik garis lurus dan lengkung.','Hitung 1–3 benda konkret.','Ucapkan satu kata: cat.','Menunggu giliran.'),
(2,'Kenali e, o dan konsonan b, m.','Tebalkan huruf vokal.','Hitung 1–5 benda dan cocokkan angka.','Ucapkan satu kata: ball.','Berbagi alat tulis.'),
(3,'Bedakan huruf p, b, d secara terpisah.','Tulis huruf tunggal dengan contoh.','Hitung 1–10 benda, pilih lebih banyak.','Ucapkan satu kata: red.','Mengucapkan terima kasih.'),
(4,'Baca suku kata ba, bi, bu, be, bo.','Salin 3 suku kata.','Jumlahkan 10+2 dan 11+3 tanpa menyimpan.','Ucapkan frasa: red ball.','Merawat barang bersama.'),
(5,'Baca kata dua suku kata: buku, bola.','Tulis 3 kata dari contoh.','Jumlahkan 12+3 dan 14+2 tanpa menyimpan.','Ucapkan frasa: my blue bag.','Jujur saat bermain.'),
(6,'Baca frasa dua sampai tiga kata.','Tulis frasa pendek dari dikte.','Jumlahkan 13+4 dan 15+3 tanpa menyimpan.','Ucapkan frasa: a big cat.','Membantu teman.'),
(7,'Baca cerita 3 kalimat dan sebut tokoh.','Tulis satu kalimat tentang tokoh.','Jumlahkan 17+5 dengan menyimpan.','Latih percakapan: What is this? This is a book.','Meminta tolong dengan sopan.'),
(8,'Baca cerita 4 kalimat dan urutkan kejadian.','Tulis dua kalimat runtut.','Jumlahkan 28+14 dengan menyimpan.','Latih percakapan: May I borrow a pencil? Yes, here you are.','Mengembalikan barang pinjaman.'),
(9,'Baca cerita dan jelaskan sebab akibat.','Tulis cerita mini tiga kalimat.','Peragakan perkalian 2x3 dan 3x4 dengan benda.','Latih percakapan: How much is it? It is five thousand rupiah.','Bersikap adil.'),
(10,'Baca cerita dan simpulkan pesan utamanya.','Tulis ringkasan dengan kata sendiri.','Latih perkalian 4x5 dan 5x6 dengan kelompok benda.','Latih percakapan: I would like two apples, please. Here you are.','Bertanggung jawab menyelesaikan tugas.');
create table public.class_sessions (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references profiles,
  date date not null default current_date,
  theme text not null check(length(trim(theme)) between 1 and 120),
  created_at timestamptz not null default now()
);
create table public.session_students (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references class_sessions,
  student_id uuid not null references students,
  attendance text not null default 'Hadir' check(attendance in ('Hadir','Sakit','Izin','Alfa')),
  reading_snapshot integer not null, math_snapshot integer not null,
  grade text check(grade in ('SB','BSH','MB')),
  anecdote text not null default '',
  material text not null default '', report text not null default '',
  finalized_at timestamptz,
  unique(session_id,student_id)
);
create table public.student_alerts (
  student_id uuid primary key references students,
  repeat_count integer not null default 0,
  reading_level integer not null, math_level integer not null,
  intervention boolean not null default false,
  updated_at timestamptz not null default now()
);
create table public.ai_jobs (
  id uuid primary key default gen_random_uuid(),
  session_student_id uuid not null references session_students,
  kind text not null check(kind in ('material','report')),
  status text not null default 'running' check(status in ('running','done','failed')),
  created_at timestamptz not null default now(),
  unique(session_student_id,kind)
);
create index on class_sessions(teacher_id,date desc);
create index on session_students(student_id);
create index on assignments(teacher_id);
alter table access_list enable row level security;
alter table profiles enable row level security;
alter table students enable row level security;
alter table assignments enable row level security;
alter table themes enable row level security;
alter table curriculum enable row level security;
alter table class_sessions enable row level security;
alter table session_students enable row level security;
alter table student_alerts enable row level security;
alter table ai_jobs enable row level security;
create policy access_owner on access_list for all to authenticated using(is_owner()) with check(is_owner());
create policy access_self on access_list for select to authenticated using(email=(select email from profiles where id=auth.uid()));
create policy profiles_read on profiles for select to authenticated using(is_member() and (id=auth.uid() or is_owner()));
create policy students_read on students for select to authenticated using(can_teach(id));
create policy students_insert on students for insert to authenticated with check(is_owner());
create policy students_update on students for update to authenticated using(is_owner()) with check(is_owner());
create policy assignments_owner on assignments for all to authenticated using(is_owner()) with check(is_owner());
create policy assignments_self on assignments for select to authenticated using(is_member() and teacher_id=auth.uid());
create policy themes_read on themes for select to authenticated using(is_member());
create policy themes_insert on themes for insert to authenticated with check(is_member());
create policy curriculum_read on curriculum for select to authenticated using(is_member());
create policy curriculum_owner on curriculum for update to authenticated using(is_owner()) with check(is_owner());
create policy sessions_read on class_sessions for select to authenticated using(is_member() and (teacher_id=auth.uid() or is_owner()));
create function public.can_access_session(rid uuid) returns boolean language sql stable security definer set search_path=public as $$
select exists(select 1 from session_students r join class_sessions c on c.id=r.session_id where r.id=rid and is_member() and (is_owner() or (c.teacher_id=auth.uid() and can_teach(r.student_id))))
$$;
create policy records_read on session_students for select to authenticated using(can_access_session(id));
create policy alerts_owner on student_alerts for select to authenticated using(is_owner());
-- All session mutations pass through transactional RPCs; no client direct writes.
grant select on all tables in schema public to authenticated;
grant insert,update on students,access_list,assignments,themes,curriculum to authenticated;
grant delete on assignments to authenticated;
revoke all on ai_jobs from authenticated,anon;
create function public.create_class(p_id uuid,p_date date,p_theme text,p_students uuid[]) returns uuid language plpgsql security definer set search_path=public as $$
declare sid uuid; s students; existing class_sessions;
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
    insert into session_students(session_id,student_id,reading_snapshot,math_snapshot) values(p_id,sid,s.reading_level,s.math_level);
  end loop;
  insert into themes(name) values(trim(p_theme)) on conflict(name) do nothing;
  return p_id;
end $$;
create function public.save_attendance(p_id uuid,p_attendance text) returns void language plpgsql security definer set search_path=public as $$
declare r session_students; s students;
begin
  if not can_access_session(p_id) then raise exception 'Akses ditolak'; end if;
  select * into r from session_students where id=p_id for update;
  if r.finalized_at is not null then raise exception 'Sesi sudah selesai'; end if;
  if p_attendance not in ('Hadir','Sakit','Izin','Alfa') then raise exception 'Kehadiran tidak valid'; end if;
  if exists(select 1 from ai_jobs where session_student_id=p_id and status='running' and created_at>now()-interval '3 minutes') then raise exception 'Tunggu pembuatan AI selesai'; end if;
  if r.attendance=p_attendance then return; end if;
  select * into s from students where id=r.student_id;
  update session_students set attendance=p_attendance,material='',report=case
    when p_attendance='Sakit' then 'Halo '||s.parent_name||' 😊 Semoga '||s.name||' lekas sembuh. Guru dan teman-teman merindukanmu! Sampai bertemu kembali dalam keadaan sehat. 🌷'
    when p_attendance='Izin' then 'Halo '||s.parent_name||' 😊 Terima kasih sudah memberi kabar. Kami menantikan '||s.name||' di pertemuan berikutnya. Semoga kegiatan keluarga berjalan lancar! 🌷'
    when p_attendance='Alfa' then 'Halo '||s.parent_name||' 😊 Hari ini '||s.name||' belum hadir. Apakah ada kabar yang ingin disampaikan? Kami siap membantu.' else '' end where id=p_id;
  delete from ai_jobs where session_student_id=p_id;
end $$;
create function public.finalize_evaluation(p_id uuid,p_grade text,p_anecdote text) returns void language plpgsql security definer set search_path=public as $$
declare r session_students; s students; a student_alerts; repeats integer;
begin
  if not can_access_session(p_id) then raise exception 'Akses ditolak'; end if;
  select * into r from session_students where id=p_id for update;
  if r.finalized_at is not null then return; end if;
  if length(p_anecdote)>3000 then raise exception 'Catatan maksimal 3000 karakter'; end if;
  if r.attendance='Hadir' and (p_grade is null or p_grade not in ('SB','BSH','MB')) then raise exception 'Pilih nilai formatif'; end if;
  select * into s from students where id=r.student_id for update;
  if s.status<>'Aktif' then raise exception 'Siswa tidak aktif'; end if;
  if r.attendance='Hadir' then
    if s.reading_level<>r.reading_snapshot or s.math_level<>r.math_snapshot then raise exception 'Level berubah sejak sesi dibuka. Hubungi pemilik.'; end if;
    select * into a from student_alerts where student_id=s.id;
    repeats:=case when p_grade='MB' then case when a.reading_level=s.reading_level and a.math_level=s.math_level then coalesce(a.repeat_count,0)+1 else 1 end else 0 end;
    insert into student_alerts(student_id,repeat_count,reading_level,math_level,intervention) values(s.id,repeats,s.reading_level,s.math_level,repeats>=3)
    on conflict(student_id) do update set repeat_count=excluded.repeat_count,reading_level=excluded.reading_level,math_level=excluded.math_level,intervention=excluded.intervention,updated_at=now();
    if p_grade in ('SB','BSH') then update students set reading_level=least(reading_level+1,reading_target,10), math_level=least(math_level+1,math_target,10) where id=s.id; end if;
  end if;
  update session_students set grade=case when attendance='Hadir' then p_grade else null end,anecdote=coalesce(p_anecdote,''),finalized_at=now() where id=p_id;
end $$;
create function public.complete_summative(p_student uuid,p_score integer,p_pass boolean) returns void language plpgsql security definer set search_path=public as $$
begin
  if not is_owner() then raise exception 'Hanya pemilik'; end if;
  if p_score not between 1 and 100 then raise exception 'Nilai harus 1–100'; end if;
  if exists(select 1 from session_students where student_id=p_student and finalized_at is null) then raise exception 'Selesaikan sesi terbuka terlebih dahulu'; end if;
  update students set summative_score=p_score,status=case when p_pass then 'Lulus' else 'Aktif' end where id=p_student and reading_level=reading_target and math_level=math_target;
  if not found then raise exception 'Target belajar belum tercapai'; end if;
end $$;
-- Lock baseline and prevent direct updates to progression/graduation via REST.
create function public.guard_student_update() returns trigger language plpgsql set search_path=public as $$
begin
  if current_user in ('authenticated','anon') and (new.reading_baseline<>old.reading_baseline or new.math_baseline<>old.math_baseline or new.reading_level<>old.reading_level or new.math_level<>old.math_level or new.summative_score is distinct from old.summative_score or new.status='Lulus' and old.status<>'Lulus') then raise exception 'Gunakan alur evaluasi untuk mengubah level dan kelulusan'; end if;
  return new;
end $$;
create trigger guard_student_update before update on students for each row execute function guard_student_update();
revoke execute on all functions in schema public from public,anon;
grant execute on function is_owner(),is_member(),can_teach(uuid),can_access_session(uuid),create_class(uuid,date,text,uuid[]),save_attendance(uuid,text),finalize_evaluation(uuid,text,text),complete_summative(uuid,integer,boolean) to authenticated;
