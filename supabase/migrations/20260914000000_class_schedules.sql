-- Alur kelas pilot, tahap 1: jadwal pertemuan per guru (keputusan pemilik 13 Sep 2026).
-- Satu jadwal = siswa terpilih + tema + nomor pertemuan + tanggal/jam. Setiap siswa membawa level saat
-- dijadwalkan dan satu indikator dari levelnya. Jadwal bisa diubah/dihapus selama belum selesai;
-- penandaan Lulus/Belum dan "pertemuan selesai" menyusul di tahap 2 (kolom completed_at sudah disiapkan).
create table public.class_schedules (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles(id),
  meeting_number integer not null check (meeting_number between 1 and 192),
  theme_number integer not null references public.curriculum_themes(number),
  scheduled_date date not null,
  scheduled_time time,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);
create index class_schedules_teacher on public.class_schedules(teacher_id, scheduled_date);

create table public.class_schedule_students (
  schedule_id uuid not null references public.class_schedules(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  level integer not null check (level between 1 and 4),
  indicator_number integer not null check (indicator_number between 1 and 8),
  primary key (schedule_id, student_id),
  foreign key (level, indicator_number) references public.curriculum_level_indicators(level, number)
);

alter table public.class_schedules enable row level security;
alter table public.class_schedule_students enable row level security;
grant select on public.class_schedules, public.class_schedule_students to authenticated;
-- Guru membaca jadwalnya sendiri; pemilik membaca semua. Tulis hanya lewat RPC.
create policy class_schedules_read on public.class_schedules for select to authenticated
  using (is_member() and (teacher_id = auth.uid() or is_owner()));
create policy class_schedule_students_read on public.class_schedule_students for select to authenticated
  using (exists (select 1 from public.class_schedules c where c.id = schedule_id
                 and is_member() and (c.teacher_id = auth.uid() or is_owner())));

-- Simpan jadwal baru (p_schedule kosong) atau ubah jadwal yang belum selesai.
-- p_payload: {meeting_number, theme_number, scheduled_date, scheduled_time, students:[{student_id, indicator_number}]}
create function public.save_schedule(p_schedule uuid, p_payload jsonb) returns uuid
language plpgsql security definer set search_path=public as $$
declare
  v_id uuid := p_schedule;
  v_row record;
begin
  if not is_member() or is_owner() then raise exception 'Jadwal dibuat oleh guru pengajar'; end if;
  if jsonb_typeof(p_payload) <> 'object' then raise exception 'Data jadwal tidak valid'; end if;
  if coalesce(p_payload->>'meeting_number', '') !~ '^[0-9]{1,3}$'
     or (p_payload->>'meeting_number')::int not between 1 and 192 then
    raise exception 'Nomor pertemuan harus 1–192';
  end if;
  if coalesce(p_payload->>'theme_number', '') !~ '^[0-9]{1,2}$'
     or not exists (select 1 from curriculum_themes where number = (p_payload->>'theme_number')::int) then
    raise exception 'Tema tidak dikenal';
  end if;
  if coalesce(p_payload->>'scheduled_date', '') !~ '^\d{4}-\d{2}-\d{2}$' then raise exception 'Tanggal wajib diisi'; end if;
  if coalesce(p_payload->>'scheduled_time', '') !~ '^(\d{2}:\d{2}(:\d{2})?)?$' then raise exception 'Jam tidak valid'; end if;
  if jsonb_typeof(p_payload->'students') <> 'array' or jsonb_array_length(p_payload->'students') = 0 then
    raise exception 'Pilih minimal satu siswa';
  end if;
  if (select count(*) from jsonb_array_elements(p_payload->'students')) <>
     (select count(distinct r->>'student_id') from jsonb_array_elements(p_payload->'students') r) then
    raise exception 'Satu siswa dipilih lebih dari sekali';
  end if;
  for v_row in select r->>'student_id' sid, r->>'indicator_number' ind from jsonb_array_elements(p_payload->'students') r loop
    if v_row.sid !~ '^[0-9a-fA-F-]{36}$' or not can_teach(v_row.sid::uuid) then raise exception 'Siswa tidak tersedia'; end if;
    if not exists (select 1 from students s join diagnostic_tests t on t.student_id = s.id
                   where s.id = v_row.sid::uuid and s.status = 'Aktif' and s.pilot_level is not null) then
      raise exception 'Siswa yang dijadwalkan harus aktif dan sudah dites diagnostik';
    end if;
    if coalesce(v_row.ind, '') !~ '^[0-9]$' or not exists (
         select 1 from students s join curriculum_level_indicators i on i.level = s.pilot_level
         where s.id = v_row.sid::uuid and i.number = v_row.ind::int) then
      raise exception 'Indikator harus berasal dari level siswa';
    end if;
  end loop;

  if v_id is null then
    insert into class_schedules(teacher_id, meeting_number, theme_number, scheduled_date, scheduled_time)
    values (auth.uid(), (p_payload->>'meeting_number')::int, (p_payload->>'theme_number')::int,
            (p_payload->>'scheduled_date')::date, nullif(p_payload->>'scheduled_time', '')::time)
    returning id into v_id;
  else
    perform 1 from class_schedules where id = v_id and teacher_id = auth.uid() for update;
    if not found then raise exception 'Jadwal tidak tersedia'; end if;
    if exists (select 1 from class_schedules where id = v_id and completed_at is not null) then
      raise exception 'Jadwal yang sudah selesai tidak bisa diubah';
    end if;
    update class_schedules set meeting_number = (p_payload->>'meeting_number')::int,
      theme_number = (p_payload->>'theme_number')::int, scheduled_date = (p_payload->>'scheduled_date')::date,
      scheduled_time = nullif(p_payload->>'scheduled_time', '')::time
    where id = v_id;
    delete from class_schedule_students where schedule_id = v_id;
  end if;
  insert into class_schedule_students(schedule_id, student_id, level, indicator_number)
  select v_id, s.id, s.pilot_level, (r->>'indicator_number')::int
  from jsonb_array_elements(p_payload->'students') r join students s on s.id = (r->>'student_id')::uuid;
  return v_id;
end $$;
revoke execute on function public.save_schedule(uuid, jsonb) from public, anon;
grant execute on function public.save_schedule(uuid, jsonb) to authenticated;

create function public.delete_schedule(p_schedule uuid) returns void
language plpgsql security definer set search_path=public as $$
begin
  if not is_member() or is_owner() then raise exception 'Jadwal dihapus oleh guru pengajar'; end if;
  perform 1 from class_schedules where id = p_schedule and teacher_id = auth.uid() for update;
  if not found then raise exception 'Jadwal tidak tersedia'; end if;
  if exists (select 1 from class_schedules where id = p_schedule and completed_at is not null) then
    raise exception 'Jadwal yang sudah selesai tidak bisa dihapus';
  end if;
  delete from class_schedules where id = p_schedule;
end $$;
revoke execute on function public.delete_schedule(uuid) from public, anon;
grant execute on function public.delete_schedule(uuid) to authenticated;
