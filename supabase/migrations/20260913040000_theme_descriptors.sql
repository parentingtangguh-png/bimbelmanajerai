-- Deskriptor tema pilot Fondasi (13 Sep 2026), disetujui pemilik. Setiap tema punya gambaran, area dan
-- indikator yang paling dilatih, karakter yang ditonjolkan, serta kosakata English tema.
-- focus_indicators menunjuk indikator kurikulum sebagai 'L<level>-<nomor>'; tes memastikan semuanya ada.

alter table public.curriculum_themes
  add column description text not null default '' check (length(description) <= 2000),
  add column focus_areas text not null default '' check (length(focus_areas) <= 300),
  add column focus_indicators text[] not null default '{}'
    check (array_to_string(focus_indicators, ',') ~ '^(L[0-9]{1,2}-[0-9]{1,2}(,L[0-9]{1,2}-[0-9]{1,2})*)?$'),
  add column character_focus text not null default '' check (length(character_focus) <= 500),
  add column english_words text not null default '' check (length(english_words) <= 500);

update public.curriculum_themes set
  description = 'Anak mengenal lingkungan belajar barunya, lalu bercerita tentang diri, keluarga, dan kegiatan sehari-hari lewat gambar, benda, dan kata-kata sederhana.',
  focus_areas = 'Bahasa lisan dan Literasi',
  focus_indicators = array['L1-2','L1-3','L2-2','L3-3','L4-1','L4-4'],
  character_focus = 'mau duduk bersama, berani menjawab, mendengarkan saat orang lain berbicara',
  english_words = 'stand up, sit down · mother, father, family · I like… · My name is…'
where number = 1;

update public.curriculum_themes set
  description = 'Anak menemukan bilangan di sekitarnya: menghitung benda, membandingkan banyak dan sedikit, serta menjumlah dan mengurangi dalam kegiatan nyata seperti bermain toko dan membagi makanan.',
  focus_areas = 'Numerasi',
  focus_indicators = array['L1-6','L2-3','L2-4','L3-4','L3-5','L3-6','L4-5','L4-6'],
  character_focus = 'mau bergantian, menyelesaikan tugas sederhana',
  english_words = 'clap your hands (sambil berhitung) · one to ten · ball, book, bag · I want… · I am … years old'
where number = 2;

update public.curriculum_themes set
  description = 'Anak menjelajah alam dan lingkungan sekitar rumah dan bimbel: mengamati bentuk, warna, dan ukuran benda, lalu mengelompokkan dan menyusun polanya.',
  focus_areas = 'Numerasi (bentuk dan pola) dan Literasi',
  focus_indicators = array['L1-4','L2-5','L2-2','L3-1','L4-1'],
  character_focus = 'mencoba meski ragu, merapikan alat belajar',
  english_words = 'look, touch · tree, flower, stone · big, small · I like the…'
where number = 3;

update public.curriculum_themes set
  description = 'Anak belajar memimpin hal kecil: memimpin barisan, membagi alat, memberi instruksi sederhana kepada teman, dan bergiliran menjadi pemimpin serta anggota.',
  focus_areas = 'Bahasa lisan dan Kesiapan belajar',
  focus_indicators = array['L1-1','L1-2','L1-3','L3-3','L4-4'],
  character_focus = 'mau bergantian, mau membantu teman, bersikap hormat',
  english_words = 'line up, follow me · my turn, your turn · help me please · Thank you'
where number = 4;

update public.curriculum_themes set
  description = 'Anak mengenal benda-benda yang bisa ia pegang dan gunakan sendiri, seperti alat tulis, alat makan, dan mainan. Anak melatih tangannya untuk menulis, serta menamai, menghitung, dan merawat benda miliknya.',
  focus_areas = 'Literasi (pramenulis dan menulis) dan Numerasi',
  focus_indicators = array['L1-5','L2-6','L3-2','L4-3','L2-3','L4-5'],
  character_focus = 'merapikan alat belajar, menyelesaikan tugas mandiri',
  english_words = 'pencil, book, bag · hold, write · This is my…'
where number = 5;

update public.curriculum_themes set
  description = 'Anak belajar bertanya dan mencari jawaban: siapa, apa, di mana, berapa, lalu memeriksa jawabannya lewat benda, gambar, atau bacaan pendek.',
  focus_areas = 'Bahasa lisan dan Literasi',
  focus_indicators = array['L1-3','L2-1','L3-1','L3-3','L4-1','L4-2'],
  character_focus = 'berani menjawab, mendengarkan saat orang lain berbicara',
  english_words = 'what is this? · where? · how many? · I don''t know · Can I…?'
where number = 6;

update public.curriculum_themes set
  description = 'Anak menghadapi masalah kecil yang nyata, seperti benda yang kurang, pola yang rusak, atau teman yang butuh bantuan. Anak mencoba cara untuk menyelesaikannya dengan berhitung, menyusun ulang, dan bekerja sama.',
  focus_areas = 'Numerasi dan Literasi',
  focus_indicators = array['L2-5','L3-5','L3-6','L4-6','L3-3','L4-4'],
  character_focus = 'mencoba meski ragu, mau membantu teman, menyelesaikan tugas mandiri',
  english_words = 'help me please · try again · more, less · I can do it'
where number = 7;

update public.curriculum_themes set
  description = 'Anak berlatih ritme kelas formal, seperti siap di awal sesi, mengerjakan tugas sampai selesai, dan membaca serta menulis kalimat pendek. Tema ditutup dengan perayaan kecil atas kemajuan masing-masing anak.',
  focus_areas = 'Semua area, dengan penekanan Kesiapan belajar dan Literasi',
  focus_indicators = array['L1-1','L3-2','L4-2','L4-3','L4-4','L4-7'],
  character_focus = 'siap saat memulai sesi, menyelesaikan tugas mandiri, bersikap hormat',
  english_words = 'good morning, teacher · My name is…, I am … years old · school, friend · goodbye'
where number = 8;
