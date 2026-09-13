-- Kurikulum pilot Fase Fondasi (13 Sep 2026), disetujui pemilik kata demi kata.
-- Susunannya pohon: CP fase -> level (judul + deskripsi) -> 8 indikator lintas area; tema berjalan
-- menurut nomor pertemuan dan sama untuk semua siswa. Level di sini milik anak secara utuh.
-- Tabel curriculum lama (per bidang, sudah dikosongkan) belum dibuang karena kartu evaluasi dan
-- rapor AI masih membacanya; itu ikut dirancang ulang bersama alur pertemuan.

create table public.curriculum_phases(
  code text primary key check (code in ('fondasi','fase_a','fase_b','fase_c')),
  name text not null check (length(trim(name)) between 1 and 80),
  cp text not null check (length(trim(cp)) between 1 and 3000),
  sort_order integer not null unique
);

create table public.curriculum_levels(
  level integer primary key check (level between 1 and 16),
  phase_code text not null references public.curriculum_phases(code),
  title text not null check (length(trim(title)) between 1 and 120),
  description text not null check (length(trim(description)) between 1 and 2000)
);

create table public.curriculum_level_indicators(
  level integer not null references public.curriculum_levels(level) on delete cascade,
  number integer not null check (number between 1 and 12),
  text text not null check (length(trim(text)) between 1 and 1000),
  domain text not null check (domain in ('Kesiapan belajar','Bahasa lisan','Literasi','Literasi (pramenulis)','Numerasi','English','Karakter')),
  primary key (level, number)
);

create table public.curriculum_themes(
  number integer primary key check (number between 1 and 64),
  phase_code text not null references public.curriculum_phases(code),
  name text not null check (length(trim(name)) between 1 and 120),
  first_meeting integer not null check (first_meeting >= 1),
  last_meeting integer not null,
  check (last_meeting >= first_meeting)
);

alter table public.curriculum_phases enable row level security;
alter table public.curriculum_levels enable row level security;
alter table public.curriculum_level_indicators enable row level security;
alter table public.curriculum_themes enable row level security;

-- Semua anggota membaca; hanya pemilik yang boleh menyunting teks. Menambah atau menghapus baris
-- lewat migrasi, supaya susunan level dan rentang pertemuan tidak berlubang.
create policy curriculum_phases_read on public.curriculum_phases for select to authenticated using (is_member());
create policy curriculum_levels_read on public.curriculum_levels for select to authenticated using (is_member());
create policy curriculum_level_indicators_read on public.curriculum_level_indicators for select to authenticated using (is_member());
create policy curriculum_themes_read on public.curriculum_themes for select to authenticated using (is_member());
create policy curriculum_phases_owner on public.curriculum_phases for update to authenticated using (is_owner()) with check (is_owner());
create policy curriculum_levels_owner on public.curriculum_levels for update to authenticated using (is_owner()) with check (is_owner());
create policy curriculum_level_indicators_owner on public.curriculum_level_indicators for update to authenticated using (is_owner()) with check (is_owner());
create policy curriculum_themes_owner on public.curriculum_themes for update to authenticated using (is_owner()) with check (is_owner());
grant select, update on public.curriculum_phases, public.curriculum_levels, public.curriculum_level_indicators, public.curriculum_themes to authenticated;

insert into public.curriculum_phases(code, name, cp, sort_order) values
('fondasi', 'Fase Fondasi', 'Pada akhir Fase Fondasi, anak mampu mengenali dan menggunakan simbol dasar bahasa dan angka dalam konteks kehidupan sehari-hari, dengan komunikasi aktif menggunakan kosakata dan ungkapan praktis dalam Bahasa Indonesia dan Bahasa Inggris, serta menunjukkan perilaku positif yang dapat diobservasi selama proses belajar berlangsung.', 1);

insert into public.curriculum_levels(level, phase_code, title, description) values
(1, 'fondasi', 'Aku Siap Belajar', 'Anak mulai nyaman di lingkungan belajar, merespons instruksi sederhana, dan menunjukkan kesiapan fisik dan sosial untuk belajar bersama.'),
(2, 'fondasi', 'Aku Mulai Mengenal', 'Anak mulai memahami bahwa huruf dan angka punya makna, dan mulai menghubungkannya dengan benda atau bunyi di sekitarnya.'),
(3, 'fondasi', 'Aku Mulai Bisa', 'Anak mulai aktif menggunakan kemampuan literasi dan matematika secara mandiri — membaca, menulis, dan menghitung dengan pemahaman, bukan sekadar hafalan.'),
(4, 'fondasi', 'Aku Siap ke SD', 'Anak siap mengikuti ritme kelas formal — membaca, menulis, dan memahami bilangan dengan cukup untuk melanjutkan ke jenjang berikutnya.');

insert into public.curriculum_level_indicators(level, number, text, domain) values
(1, 1, 'Mengikuti sesi dari awal hingga selesai', 'Kesiapan belajar'),
(1, 2, 'Merespons ketika namanya dipanggil', 'Bahasa lisan'),
(1, 3, 'Menunjuk benda saat diminta', 'Bahasa lisan'),
(1, 4, 'Mengenali perbedaan bentuk dasar', 'Numerasi'),
(1, 5, 'Menirukan gerakan menulis di udara atau pasir', 'Literasi (pramenulis)'),
(1, 6, 'Menyebutkan angka 1–5 dengan bantuan', 'Numerasi'),
(1, 7, 'Merespons instruksi sederhana dalam Bahasa Inggris: sit down, stand up, clap your hands', 'English'),
(1, 8, 'Mau duduk bersama, mencoba meski ragu, tidak mengganggu teman (observasi guru)', 'Karakter'),
(2, 1, 'Menyebutkan nama huruf vokal A, I, U, E, O', 'Literasi'),
(2, 2, 'Mencocokkan huruf dengan gambar benda', 'Literasi'),
(2, 3, 'Menghitung benda konkret 1–10', 'Numerasi'),
(2, 4, 'Mengenali angka 1–10 secara visual', 'Numerasi'),
(2, 5, 'Meniru pola sederhana berdasarkan warna, bentuk, atau ukuran', 'Numerasi'),
(2, 6, 'Memegang pensil dengan benar', 'Literasi (pramenulis)'),
(2, 7, 'Menyebutkan nama benda sekitar dalam Bahasa Inggris: ball, book, bag', 'English'),
(2, 8, 'Mau bergantian, menyelesaikan tugas sederhana, merapikan alat belajar (observasi guru)', 'Karakter'),
(3, 1, 'Membaca suku kata KV: ba, bi, bu, be, bo', 'Literasi'),
(3, 2, 'Menulis huruf kapital dan kecil', 'Literasi'),
(3, 3, 'Menyusun suku kata menjadi kata sederhana', 'Literasi'),
(3, 4, 'Menghitung maju dan mundur 1–20', 'Numerasi'),
(3, 5, 'Memahami konsep lebih banyak dan lebih sedikit', 'Numerasi'),
(3, 6, 'Mengenal konsep penjumlahan dengan benda konkret', 'Numerasi'),
(3, 7, 'Menyebutkan ungkapan praktis dalam Bahasa Inggris: I want, I like, help me please', 'English'),
(3, 8, 'Mau membantu teman, berani menjawab, mendengarkan saat orang lain berbicara (observasi guru)', 'Karakter'),
(4, 1, 'Membaca kata sederhana 2–3 suku kata', 'Literasi'),
(4, 2, 'Membaca kalimat pendek dengan lancar', 'Literasi'),
(4, 3, 'Menulis namanya sendiri dengan terbaca', 'Literasi'),
(4, 4, 'Menulis kalimat pendek dengan bantuan', 'Literasi'),
(4, 5, 'Memahami bilangan 1–20 dan nilainya', 'Numerasi'),
(4, 6, 'Melakukan penjumlahan dan pengurangan sederhana dalam konteks nyata', 'Numerasi'),
(4, 7, 'Memperkenalkan diri dalam Bahasa Inggris: My name is..., I am ... years old', 'English'),
(4, 8, 'Menyelesaikan tugas mandiri, bersikap hormat, siap saat memulai sesi (observasi guru)', 'Karakter');

insert into public.curriculum_themes(number, phase_code, name, first_meeting, last_meeting) values
(1, 'fondasi', 'Aku Bisa Bercerita', 1, 24),
(2, 'fondasi', 'Aku Bisa Menghitung', 25, 48),
(3, 'fondasi', 'Aku Sang Penjelajah', 49, 72),
(4, 'fondasi', 'Aku Bisa Memimpin', 73, 96),
(5, 'fondasi', 'Dunia dalam Genggamanku', 97, 120),
(6, 'fondasi', 'Aku Bisa Bertanya', 121, 144),
(7, 'fondasi', 'Aku Si Pemecah Masalah', 145, 168),
(8, 'fondasi', 'Aku Siap ke SD', 169, 192);
