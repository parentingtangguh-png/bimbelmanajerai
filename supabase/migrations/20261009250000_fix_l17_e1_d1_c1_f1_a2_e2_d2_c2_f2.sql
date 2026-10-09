-- Perbaikan audit L17: E1 (kunci barisan), D1 (kerangka konkret), C1 (kunci bukti),
-- F1 (kunci jarak), A2 (operasionalkan intonasi), E2 (kunci),
-- D2 (operasionalkan kriteria), C2 (teks inline), F2 (kunci).

-- E1 L17: tambahkan kunci lanjutan dua bilangan dan aturan per barisan
update k8_indicators
  set success = '3 dari 4 barisan benar lengkap dengan aturan. Kunci: (1) 15, 18 — aturan: +3; (2) 20, 15 — aturan: −5; (3) 32, 64 — aturan: ×2; (4) 25, 36 — aturan: bilangan kuadrat (n²).'
  where level = 17 and number = 3 and slot = 'E1';

-- D1 L17: cantumkan isi kerangka konkret di bahan
update k8_indicators
  set material = 'Kerangka di papan: Klaim → [topik yang didukung anak]. Alasan 1 → [alasan pertama]. Alasan 2 → [alasan kedua]. Penutup → [kesimpulan]. Contoh diisi guru sesuai topik yang dipilih anak; model tetap terlihat.'
  where level = 17 and number = 4 and slot = 'D1';

-- C1 L17: tambahkan kunci kalimat yang diterima sebagai bukti
update k8_indicators
  set success = 'Paling banyak 5 kesalahan kata, dan anak menyebut sudut pandang penulis: mendukung membawa botol minum sendiri, dengan satu bukti dari teks. Kunci bukti yang diterima: kalimat 1 ("kebiasaan yang baik"), kalimat 2 ("tidak perlu membeli minuman kemasan"), kalimat 3 ("sampah plastik berkurang"), atau kalimat 5 ("manfaatnya lebih besar").'
  where level = 17 and number = 5 and slot = 'C1';

-- F1 L17: tambahkan kunci jarak sebenarnya per rute
update k8_indicators
  set success = '3 dari 4 jarak sebenarnya benar. Kunci (skala 1 cm = 2 km): Rumah–Sekolah 3 cm = 6 km; Rumah–Pasar 4 cm = 8 km; Sekolah–Taman 2 cm = 4 km; Pasar–Taman 5 cm = 10 km.'
  where level = 17 and number = 6 and slot = 'F1';

-- A2 L17: operasionalkan intonasi tanya dan seru
update k8_indicators
  set success = 'Maksimal 6 kesalahan kata; berhenti sebentar atau menurunkan suara pada minimal 4 dari 5 tanda baca akhir kalimat; pada kalimat tanya (kalimat 4) suara naik di akhir; pada kalimat seru (kalimat 5) suara lebih tegas atau lebih keras.'
  where level = 17 and number = 7 and slot = 'A2';

-- E2 L17: tambahkan kunci untuk 6 soal operasi campuran
update k8_indicators
  set success = '5 dari 6 benar. Kunci: 6+4×3 = 18; 20−12:3 = 16; (8+4)×2 = 24; −5+3×4 = 7; 18:3−7 = −1; 10−(6+2) = 2.'
  where level = 17 and number = 9 and slot = 'E2';

-- D2 L17: operasionalkan "gagasan pokok jelas" dan "struktur penjelasan dapat diikuti"
update k8_indicators
  set success = '2 paragraf atau 1 paragraf panjang, 100–140 kata; kalimat pertama atau kedua menyatakan topik yang ditulis; minimal 2 kalimat lain menambahkan fakta, contoh, atau penjelasan tentang topik yang sama; tidak ada kalimat yang bertentangan dengan kalimat sebelumnya; ≤8 kesalahan ejaan per 130 kata.'
  where level = 17 and number = 10 and slot = 'D2';

-- C2 L17: cantumkan teks langsung (tidak cross-reference ke C1 L17)
update k8_indicators
  set material = 'Membawa botol minum sendiri adalah kebiasaan yang baik. Anak tidak perlu sering membeli minuman kemasan. Sampah plastik di kelas juga dapat berkurang. Kebiasaan ini memang perlu diingat setiap pagi. Namun, manfaatnya lebih besar daripada repotnya. Karena itu, siswa sebaiknya membawa botol minum sendiri.'
  where level = 17 and number = 11 and slot = 'C2';

-- F2 L17: tambahkan kunci untuk 5 soal luas trapesium, belah ketupat, gabungan
update k8_indicators
  set success = '4 dari 5 benar. Kunci: trapesium (8+12)×5÷2 = 50 cm²; trapesium (6+10)×4÷2 = 32 cm²; belah ketupat 10×8÷2 = 40 cm²; belah ketupat 12×9÷2 = 54 cm²; gabungan persegi panjang 8×4 (32 cm²) + segitiga alas 8 tinggi 3 (12 cm²) = 44 cm².'
  where level = 17 and number = 12 and slot = 'F2';
