-- Perbaikan audit L16: E1 (kunci), D1 (kunci kalimat), C1 (kunci kalimat diterima),
-- F1 (kunci), A2 (operasionalkan "lancar" dan "jeda frasa"), B2 (kunci kata),
-- E2 (kunci), D2 (operasionalkan "logis"), C2 (teks inline), F2 (kunci).

-- E1 L16: tambahkan kunci penyederhanaan
update k8_indicators
  set success = '4 dari 5 disederhanakan benar. Kunci: 6:9 = 2:3; 8:12 = 2:3; 10:15 = 2:3; 12:16 = 3:4; 5:20 = 1:4.'
  where level = 16 and number = 3 and slot = 'E1';

-- D1 L16: tambahkan kunci kalimat per kelompok kata
update k8_indicators
  set success = 'Minimal 7 dari 8 kalimat tersusun gramatikal; kapital dan tanda akhir benar pada minimal 7 kalimat; ≤5 kesalahan ejaan total. Kunci urutan S–P–O–K: (1) Ayah menanam pohon mangga di halaman. (2) Dina membaca buku cerita di kamar. (3) Ibu membeli sayur segar di pasar. (4) Para siswa membersihkan halaman sekolah pagi tadi. (5) Rafi menulis cerita pendek di buku tugas. (6) Nenek menyiram tanaman bunga setiap sore. (7) Paman memperbaiki kursi kayu di ruang tamu. (8) Murid-murid mengumpulkan tugas kelompok setelah istirahat.'
  where level = 16 and number = 4 and slot = 'D1';

-- C1 L16: tambahkan kunci kalimat yang diterima
update k8_indicators
  set success = 'Anak menunjuk atau membaca kalimat kunci tentang air berubah menjadi uap, lalu membaca nyaring kalimat itu dengan paling banyak 1 kesalahan kata. Kunci: kalimat yang diterima = kalimat 2 ("Saat dipanaskan, sebagian air berubah menjadi uap.") atau kalimat 5 ("Perubahan ini sering terjadi saat air mendidih.").'
  where level = 16 and number = 5 and slot = 'C1';

-- F1 L16: tambahkan kunci jawaban per pertanyaan
update k8_indicators
  set success = '4 dari 5 benar. Kunci: (1) garis OA = jari-jari; (2) garis AB = diameter; (3) benar; (4) pi ≈ 3,14 atau 22/7; (5) jari-jari 7 → diameter = 14.'
  where level = 16 and number = 6 and slot = 'F1';

-- A2 L16: operasionalkan "dibaca lancar" dan "jeda frasa tidak berlebihan"
update k8_indicators
  set success = 'Maksimal 6 kesalahan kata; minimal 4 dari 5 kalimat dibaca dari awal sampai akhir tanpa berhenti di tengah kata; tidak berhenti setelah setiap kata tunggal (frasa minimal dibaca dua kata bersamaan).'
  where level = 16 and number = 7 and slot = 'A2';

-- B2 L16: tambahkan kunci kata yang tepat per konteks
update k8_indicators
  set success = '3 dari 4 kalimat memakai kata yang tepat sesuai konteks. Kunci: melihat benda dengan teliti → mengamati; air masuk ke akar → menyerap; air berubah jadi uap → menguap; catatan hasil pengamatan → data. Ejaan dan tulisan tangan tidak dinilai.'
  where level = 16 and number = 8 and slot = 'B2';

-- E2 L16: tambahkan kunci untuk 5 soal perbandingan
update k8_indicators
  set success = '4 dari 5 benar. Kunci: 2:3 = 10:15; 4:5 = 16:20; sirup untuk 12 gelas = 4 gelas; skala 4 cm = 20 km; permen 18 dibagi 1:2 = 6 dan 12.'
  where level = 16 and number = 9 and slot = 'E2';

-- D2 L16: operasionalkan "urutan logis" dan "tidak membingungkan"
update k8_indicators
  set success = '1–2 paragraf, 90–120 kata; untuk prosedur: langkah-langkah berurutan sehingga langkah pertama bisa dilakukan sebelum langkah berikutnya; untuk deskripsi: minimal 3 rincian tentang objek yang sama; tidak ada kalimat yang bertentangan dengan kalimat sebelumnya; ≤8 kesalahan ejaan per 120 kata.'
  where level = 16 and number = 10 and slot = 'D2';

-- C2 L16: cantumkan teks langsung (tidak cross-reference ke C1 L16)
update k8_indicators
  set material = 'Air dapat berubah bentuk karena panas. Saat dipanaskan, sebagian air berubah menjadi uap. Proses ini disebut menguap. Uap air dapat terlihat seperti asap tipis. Perubahan ini sering terjadi saat air mendidih.'
  where level = 16 and number = 11 and slot = 'C2';

-- F2 L16: tambahkan kunci untuk 5 soal keliling lingkaran
update k8_indicators
  set success = '4 dari 5 benar. Kunci (gunakan 22/7 untuk kelipatan 7, 3,14 untuk lainnya): diameter 14 cm = 44 cm; jari-jari 7 cm = 44 cm; diameter 10 cm = 31,4 cm; jari-jari 5 cm = 31,4 cm; roda diameter 28 cm = 88 cm.'
  where level = 16 and number = 12 and slot = 'F2';
