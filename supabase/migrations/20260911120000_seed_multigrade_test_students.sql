-- Synthetic students for the owner's real-browser multigrade review.
-- Names and family labels are intentionally fictional; no phone numbers or
-- other personal data are stored.
insert into public.students(
  id,name,parent_name,phone,interest,diagnostic,learning_notes,
  reading_baseline,reading_level,reading_target,
  math_baseline,math_level,math_target
) values
('20000000-0000-4000-8000-000000000001','Siswa Uji 01 — Fondasi A','Wali Uji 01','','Balok dan warna','Latar kelas: Fondasi; mengenali benda konkret dan beberapa bunyi awal.','Belajar melalui gerak, benda konkret, dan instruksi singkat.',1,1,4,1,1,4),
('20000000-0000-4000-8000-000000000002','Siswa Uji 02 — Fondasi B','Wali Uji 02','','Hewan dan lagu','Latar kelas: Fondasi; mulai mengikuti instruksi dan menyebutkan kosakata dekat diri.','Responsif terhadap lagu, gambar, dan pengulangan.',2,2,4,1,1,4),
('20000000-0000-4000-8000-000000000003','Siswa Uji 03 — Fondasi C','Wali Uji 03','','Menggambar dan kebun','Latar kelas: Fondasi; mulai menceritakan hasil pengamatan sederhana.','Suka membuat gambar sebelum menjawab secara lisan.',3,3,5,2,2,5),
('20000000-0000-4000-8000-000000000004','Siswa Uji 04 — SD 1 A','Wali Uji 04','','Kendaraan','Latar kelas sekolah: SD 1; membaca suku kata dengan bantuan.','Membutuhkan contoh visual dan latihan bertahap.',4,4,6,4,4,6),
('20000000-0000-4000-8000-000000000005','Siswa Uji 05 — SD 1 B','Wali Uji 05','','Pasar dan bermain peran','Latar kelas sekolah: SD 1; mulai membaca kata dan memahami jumlah konkret.','Aktif saat dialog dan permainan peran.',5,5,7,4,4,7),
('20000000-0000-4000-8000-000000000006','Siswa Uji 06 — SD 1 C','Wali Uji 06','','Dinosaurus','Latar kelas sekolah: SD 1; kemampuan matematika sedikit lebih maju daripada membaca.','Fokus lebih lama bila tema memakai fakta hewan.',4,4,7,5,5,7),
('20000000-0000-4000-8000-000000000007','Siswa Uji 07 — SD 2 A','Wali Uji 07','','Memasak','Latar kelas sekolah: SD 2; membaca frasa dan berhitung sampai ratusan awal.','Menyukai urutan langkah dan praktik langsung.',6,6,8,6,6,8),
('20000000-0000-4000-8000-000000000008','Siswa Uji 08 — SD 2 B','Wali Uji 08','','Sepak bola','Latar kelas sekolah: SD 2; mampu menemukan informasi sederhana dari cerita.','Mudah terlibat melalui tantangan berkelompok.',7,7,9,6,6,9),
('20000000-0000-4000-8000-000000000009','Siswa Uji 09 — SD 2 C','Wali Uji 09','','Kerajinan tangan','Latar kelas sekolah: SD 2; matematika konkret lebih kuat daripada kemampuan berbahasa.','Teliti ketika menggunakan bahan yang dapat disentuh.',6,6,9,7,7,9),
('20000000-0000-4000-8000-000000000010','Siswa Uji 10 — SD 3 A','Wali Uji 10','','Lingkungan','Latar kelas sekolah: SD 3; mulai menjelaskan urutan dan alasan sederhana.','Suka pengamatan di sekitar dan diskusi singkat.',8,8,10,8,8,10),
('20000000-0000-4000-8000-000000000011','Siswa Uji 11 — SD 3 B','Wali Uji 11','','Cerita rakyat','Latar kelas sekolah: SD 3; pemahaman bacaan lebih kuat daripada perhitungan.','Menyukai cerita dan kesempatan menceritakan kembali.',9,9,11,8,8,11),
('20000000-0000-4000-8000-000000000012','Siswa Uji 12 — SD 3 C','Wali Uji 12','','Eksperimen air','Latar kelas sekolah: SD 3; matematika dan penyelidikan lebih kuat daripada menulis.','Antusias melakukan percobaan dan mencatat dengan tabel.',8,8,11,9,9,11),
('20000000-0000-4000-8000-000000000013','Siswa Uji 13 — SD 4 A','Wali Uji 13','','Peta dan perjalanan','Latar kelas sekolah: SD 4; mampu merangkum informasi dan menyelesaikan masalah dua langkah.','Terbantu oleh peta konsep dan contoh kontekstual.',10,10,12,10,10,12),
('20000000-0000-4000-8000-000000000014','Siswa Uji 14 — SD 4 B','Wali Uji 14','','Komik','Latar kelas sekolah: SD 4; kuat dalam menyampaikan gagasan dan memahami bacaan.','Suka mengubah informasi menjadi komik atau dialog.',11,11,13,10,10,13),
('20000000-0000-4000-8000-000000000015','Siswa Uji 15 — SD 4 C','Wali Uji 15','','Bangun ruang','Latar kelas sekolah: SD 4; penalaran matematika lebih maju daripada presentasi lisan.','Memerlukan waktu persiapan sebelum berbicara di kelompok.',10,10,13,11,11,13),
('20000000-0000-4000-8000-000000000016','Siswa Uji 16 — SD 5 A','Wali Uji 16','','Energi','Latar kelas sekolah: SD 5; mampu menghubungkan informasi dengan bukti sederhana.','Suka proyek yang menghasilkan model atau prototipe.',12,12,14,12,12,14),
('20000000-0000-4000-8000-000000000017','Siswa Uji 17 — SD 5 B','Wali Uji 17','','Teknologi','Latar kelas sekolah: SD 5; kuat dalam membaca informasi dan mengajukan pertanyaan.','Menyukai pilihan tugas dan eksplorasi mandiri.',13,13,15,12,12,15),
('20000000-0000-4000-8000-000000000018','Siswa Uji 18 — SD 5 C','Wali Uji 18','','Data dan olahraga','Latar kelas sekolah: SD 5; lebih kuat mengolah data daripada menulis kesimpulan.','Terbantu oleh tabel, grafik, dan pembagian peran.',12,12,15,13,13,15),
('20000000-0000-4000-8000-000000000019','Siswa Uji 19 — SD 6 A','Wali Uji 19','','Iklim dan bumi','Latar kelas sekolah: SD 6; mampu menganalisis informasi dan menyusun solusi.','Menyukai diskusi berbasis bukti dan proyek lingkungan.',14,14,16,14,14,16),
('20000000-0000-4000-8000-000000000020','Siswa Uji 20 — SD 6 B','Wali Uji 20','','Wirausaha','Latar kelas sekolah: SD 6; komunikasi lebih maju daripada pemodelan matematika.','Aktif dalam presentasi, negosiasi, dan simulasi usaha.',15,15,16,14,14,16)
on conflict(id) do nothing;

-- Make the synthetic set visible to every currently active teacher so the
-- owner can choose any teacher account for the browser review.
insert into public.assignments(student_id,teacher_id)
select s.id,p.id
from public.students s
cross join public.profiles p
join public.access_list a on a.email=p.email and a.role='teacher' and a.active
where s.id::text like '20000000-0000-4000-8000-0000000000%'
on conflict do nothing;
