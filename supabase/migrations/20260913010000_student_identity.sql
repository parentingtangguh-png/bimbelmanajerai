-- Identitas anak saat didaftarkan: nama panggilan, tanggal lahir, dan kelas formal beserta tahun
-- ajarannya. Usia tidak disimpan: dihitung dari tanggal lahir supaya tidak pernah basi. Kelas formal
-- disimpan bersama tahun ajarannya karena naik setiap Juli, jadi guru tahu kelas itu berlaku kapan.
alter table public.students
  add column nickname text not null default '' check (length(nickname) <= 60),
  add column birth_date date,
  add column school_grade text not null default ''
    check (school_grade in ('', 'Belum sekolah', 'TK A', 'TK B', 'SD 1', 'SD 2', 'SD 3', 'SD 4', 'SD 5', 'SD 6')),
  add column school_year text not null default ''
    check (school_year = '' or school_year ~ '^[0-9]{4}/[0-9]{4}$');

-- Aturan yang sama dipakai saat membuat siswa dan saat mengubah profilnya.
create function public.check_student_identity(p_payload jsonb) returns date language plpgsql immutable set search_path=public as $$
declare born date; y text := coalesce(p_payload->>'school_year','');
begin
  if length(coalesce(p_payload->>'nickname','')) > 60 then raise exception 'Nama panggilan maksimal 60 karakter'; end if;
  if coalesce(p_payload->>'birth_date','') !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' then raise exception 'Tanggal lahir wajib diisi'; end if;
  born := (p_payload->>'birth_date')::date;
  if coalesce(p_payload->>'school_grade','') not in ('Belum sekolah','TK A','TK B','SD 1','SD 2','SD 3','SD 4','SD 5','SD 6') then
    raise exception 'Kelas formal wajib dipilih';
  end if;
  if y !~ '^[0-9]{4}/[0-9]{4}$' or split_part(y,'/',2)::int <> split_part(y,'/',1)::int + 1 then
    raise exception 'Tahun ajaran tidak valid';
  end if;
  return born;
end $$;
revoke execute on function public.check_student_identity(jsonb) from public,anon,authenticated;

create or replace function public.create_student(p_payload jsonb) returns uuid language plpgsql security definer set search_path=public as $$
declare sid uuid; born date;
begin
  if not is_member() then raise exception 'Akun tidak aktif'; end if;
  born := check_student_identity(p_payload);
  -- Tanggal lahir di masa depan atau lebih dari 20 tahun lalu hampir pasti salah ketik.
  if born > current_date or born < current_date - interval '20 years' then raise exception 'Tanggal lahir tidak masuk akal'; end if;
  insert into students(name,parent_name,phone,interest,diagnostic,learning_notes,reading_baseline,reading_level,reading_target,math_baseline,math_level,math_target,nickname,birth_date,school_grade,school_year)
  values (trim(p_payload->>'name'),trim(p_payload->>'parent_name'),coalesce(p_payload->>'phone',''),trim(coalesce(p_payload->>'interest','')),coalesce(p_payload->>'diagnostic',''),coalesce(p_payload->>'learning_notes',''),greatest(1,least(16,(p_payload->>'reading_baseline')::int)),greatest(1,least(16,(p_payload->>'reading_baseline')::int)),greatest(1,least(16,(p_payload->>'reading_target')::int)),greatest(1,least(16,(p_payload->>'math_baseline')::int)),greatest(1,least(16,(p_payload->>'math_baseline')::int)),greatest(1,least(16,(p_payload->>'math_target')::int)),trim(coalesce(p_payload->>'nickname','')),born,p_payload->>'school_grade',p_payload->>'school_year') returning id into sid;
  if not is_owner() then insert into assignments(student_id,teacher_id) values(sid,auth.uid()); end if;
  return sid;
end $$;
revoke execute on function public.create_student(jsonb) from public,anon;
grant execute on function public.create_student(jsonb) to authenticated;

create or replace function public.update_student_profile(p_student uuid,p_payload jsonb) returns void language plpgsql security definer set search_path=public as $$
declare current_status text; next_status text; born date;
begin
  if is_owner() then raise exception 'Pemilik hanya membaca data siswa. Perubahan dilakukan oleh guru pendamping.'; end if;
  if not can_teach(p_student) then raise exception 'Akses ditolak'; end if;
  if jsonb_typeof(p_payload)<>'object' then raise exception 'Data profil tidak valid'; end if;
  if length(trim(coalesce(p_payload->>'name',''))) not between 1 and 120 then raise exception 'Nama anak wajib diisi (maksimal 120 karakter)'; end if;
  if length(trim(coalesce(p_payload->>'parent_name',''))) not between 1 and 120 then raise exception 'Sapaan orang tua wajib diisi (maksimal 120 karakter)'; end if;
  if coalesce(p_payload->>'phone','') !~ '^[0-9+() -]{0,30}$' then raise exception 'Nomor WhatsApp hanya boleh berisi angka, spasi, +, -, dan tanda kurung'; end if;
  if length(coalesce(p_payload->>'interest',''))>300 then raise exception 'Minat maksimal 300 karakter'; end if;
  if length(coalesce(p_payload->>'diagnostic',''))>3000 or length(coalesce(p_payload->>'learning_notes',''))>3000 then raise exception 'Catatan maksimal 3000 karakter'; end if;
  born := check_student_identity(p_payload);
  if born > current_date or born < current_date - interval '20 years' then raise exception 'Tanggal lahir tidak masuk akal'; end if;
  select status into current_status from students where id=p_student;
  if not found then raise exception 'Siswa tidak tersedia'; end if;
  next_status:=coalesce(nullif(p_payload->>'status',''),current_status);
  if next_status not in ('Aktif','Non-Aktif','Lulus') or (next_status='Lulus' and current_status<>'Lulus') then
    raise exception 'Status hanya boleh Aktif atau Non-Aktif; kelulusan dicatat melalui ujian sumatif';
  end if;
  if next_status='Non-Aktif' and current_status<>'Non-Aktif' and exists(select 1 from session_students where student_id=p_student and finalized_at is null) then
    raise exception 'Selesaikan evaluasi sesi yang masih terbuka dulu sebelum menonaktifkan siswa';
  end if;
  update students set
    name=trim(p_payload->>'name'),
    parent_name=trim(p_payload->>'parent_name'),
    phone=trim(coalesce(p_payload->>'phone','')),
    interest=coalesce(p_payload->>'interest',''),
    diagnostic=coalesce(p_payload->>'diagnostic',''),
    learning_notes=coalesce(p_payload->>'learning_notes',''),
    nickname=trim(coalesce(p_payload->>'nickname','')),
    birth_date=born,
    school_grade=p_payload->>'school_grade',
    school_year=p_payload->>'school_year',
    status=next_status
  where id=p_student;
end $$;
