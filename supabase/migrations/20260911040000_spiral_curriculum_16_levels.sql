-- Replace the starter bank with a 16-step spiral from TK A through SD 6.
do $$ declare c record; begin
  for c in select conname from pg_constraint where conrelid='public.students'::regclass and contype='c' and pg_get_constraintdef(oid) ilike '%between 1 and 10%' loop execute format('alter table public.students drop constraint %I',c.conname); end loop;
  for c in select conname from pg_constraint where conrelid='public.curriculum'::regclass and contype='c' loop execute format('alter table public.curriculum drop constraint %I',c.conname); end loop;
end $$;
alter table public.students add constraint students_reading_baseline_range check(reading_baseline between 1 and 16), add constraint students_reading_level_range check(reading_level between 1 and 16), add constraint students_reading_target_range check(reading_target between 1 and 16), add constraint students_math_baseline_range check(math_baseline between 1 and 16), add constraint students_math_level_range check(math_level between 1 and 16), add constraint students_math_target_range check(math_target between 1 and 16);
alter table public.curriculum add constraint curriculum_level_range check(level between 1 and 16);
truncate public.curriculum;
insert into public.curriculum(level,reading,writing,math,english,character) values
(1,'Mengenali 8 huruf vokal/konsonan dan bunyinya; menunjuk huruf sesuai bunyi pada 8 dari 10 percobaan.','Meniru garis, lingkaran, dan pola; memegang alat tulis dengan aman.','Menghitung benda 1–5 satu per satu dan mencocokkan jumlah.','Memahami dan menirukan 5 sapaan atau kata kelas.','Menunggu giliran selama satu aktivitas dengan pengingat.'),
(2,'Menggabungkan bunyi menjadi suku kata terbuka sederhana pada 8 dari 10 contoh.','Menyalin nama sendiri dan 5 kata pendek yang dapat dibaca.','Menghitung dan membandingkan kelompok benda 1–10.','Menyebutkan 10 kosakata tema dan merespons instruksi satu langkah.','Berbagi alat dan mengembalikannya setelah dipakai.'),
(3,'Membaca minimal 10 kata pola sederhana dan membedakan bunyi awal.','Menulis huruf dan kata sederhana dari contoh dengan arah yang benar.','Menulis angka 0–20 dan menyelesaikan tambah konkret sampai 10.','Mengucapkan frasa 2 kata dan menjawab pertanyaan pilihan sederhana.','Mengikuti dua aturan kelas dalam satu kegiatan.'),
(4,'Membaca kalimat pendek 3–5 kata dan menjawab pertanyaan siapa/apa.','Menulis 2 kalimat sederhana dengan spasi dan titik.','Menyelesaikan tambah-kurang konkret sampai 20 dan menjelaskan strategi.','Memahami instruksi dua langkah dan memperkenalkan diri.','Menyelesaikan tugas sederhana sampai tuntas.'),
(5,'Membaca teks 3–4 kalimat dengan kelancaran awal dan menemukan informasi tersurat.','Menulis paragraf 3 kalimat tentang pengalaman atau benda.','Memahami nilai tempat puluhan dan operasi sampai 100 tanpa menyimpan.','Membaca kata tema dan membuat kalimat pola sederhana.','Bekerja berpasangan dan meminta bantuan dengan sopan.'),
(6,'Membaca paragraf pendek dan menceritakan kembali urutan kejadian.','Menulis paragraf runtut dengan huruf kapital dan tanda titik.','Menyelesaikan tambah-kurang sampai 1.000 dan menjelaskan nilai tempat.','Memahami dialog pendek dan merespons pertanyaan sehari-hari.','Mengakui kesalahan dan mencoba memperbaikinya.'),
(7,'Menemukan gagasan utama dan dua informasi pendukung dalam teks pendek.','Menulis deskripsi satu paragraf dengan detail yang relevan.','Menguasai perkalian sebagai penjumlahan berulang dan pembagian konkret.','Menyampaikan informasi diri, benda, dan kegiatan dalam kalimat sederhana.','Mengatur waktu dan menyelesaikan tugas sesuai kesepakatan.'),
(8,'Menyimpulkan urutan, sebab, dan akibat dari bacaan beberapa paragraf.','Menulis narasi dua paragraf dengan awal, tengah, dan akhir.','Menyelesaikan operasi campuran dasar dan soal cerita dua langkah.','Membaca teks pendek dan menjawab pertanyaan dengan kalimat lengkap.','Menghargai perbedaan pendapat saat bekerja kelompok.'),
(9,'Membedakan fakta dan pendapat sederhana serta menjelaskan bukti dari teks.','Menulis ringkasan dengan gagasan utama dan kata sendiri.','Menggunakan pecahan sederhana, pengukuran, dan perkalian dua digit dalam konteks.','Melakukan percakapan transaksional sederhana dengan pelafalan dapat dipahami.','Bersikap adil dan menggunakan alasan saat mengambil keputusan.'),
(10,'Membandingkan dua teks bertema sama dan membuat simpulan berbasis bukti.','Menulis teks informatif terstruktur dengan judul dan paragraf.','Menyelesaikan pecahan senilai, desimal awal, dan soal multi-langkah.','Memahami bacaan pendek dan menyampaikan kembali informasi utama.','Bertanggung jawab terhadap peran dan hasil kelompok.'),
(11,'Menganalisis hubungan sebab-akibat dan makna kata berdasarkan konteks.','Menulis narasi dengan dialog, urutan logis, dan revisi sederhana.','Menggunakan pecahan, desimal, persen, dan pengukuran dalam masalah nyata.','Menjelaskan pengalaman dan alasan dengan beberapa kalimat terhubung.','Mengenali dampak pilihan terhadap orang lain.'),
(12,'Menilai informasi tersurat dan tersirat dari teks narasi maupun informasi.','Menulis eksposisi dengan klaim, alasan, dan contoh pendukung.','Menyelesaikan operasi bilangan dan geometri dasar dengan strategi efisien.','Mencatat ide utama dari audio pendek dan menanggapinya.','Menunjukkan integritas saat bekerja tanpa pengawasan langsung.'),
(13,'Membandingkan perspektif dan mengevaluasi kekuatan alasan dalam beberapa sumber.','Menulis argumen sederhana dengan bukti dan bahasa yang sesuai pembaca.','Menggunakan rasio, skala, persen, dan data untuk memecahkan masalah.','Melakukan presentasi singkat dengan struktur pembuka-isi-penutup.','Mendengarkan aktif dan menyelesaikan konflik secara konstruktif.'),
(14,'Menyusun simpulan lintas teks dan membedakan fakta, opini, serta bias sederhana.','Menulis laporan dengan struktur, data, dan penyuntingan mandiri.','Menyelesaikan masalah multi-langkah yang melibatkan pecahan, desimal, dan bangun.','Menulis dan menyampaikan pendapat dengan alasan yang runtut.','Menjadi teladan dalam tanggung jawab dan kerja sama.'),
(15,'Menganalisis tema, sudut pandang, dan bukti dari teks kompleks sesuai usia.','Menulis teks persuasif dengan tujuan, bukti, dan revisi terencana.','Menggunakan aljabar awal, data, peluang, dan geometri untuk pemodelan sederhana.','Berkomunikasi dalam situasi akademik dan sosial dengan percaya diri.','Memimpin tugas bersama secara adil dan dapat dipercaya.'),
(16,'Mengevaluasi, mensintesis, dan mempresentasikan pemahaman dari beragam bacaan.','Menulis karya lengkap yang jelas, koheren, dan disunting mandiri.','Memecahkan masalah kompleks dengan strategi, estimasi, dan pemeriksaan jawaban.','Menyampaikan presentasi dan tulisan fungsional untuk kesiapan SMP.','Menunjukkan kemandirian, refleksi diri, dan tanggung jawab sebagai pembelajar.');
create or replace function public.finalize_evaluation(p_id uuid,p_grade text,p_anecdote text) returns void language plpgsql security definer set search_path=public as $$
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
    if p_grade in ('SB','BSH') then update students set reading_level=least(reading_level+1,reading_target,16), math_level=least(math_level+1,math_target,16) where id=s.id; end if;
  end if;
  update session_students set grade=case when attendance='Hadir' then p_grade else null end,anecdote=coalesce(p_anecdote,''),finalized_at=now() where id=p_id;
end $$;
