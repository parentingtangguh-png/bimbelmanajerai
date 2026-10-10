-- Perbaikan audit L18: E1 (kunci), D1 (kerangka konkret), C1 (kunci alasan),
-- F1 (kunci), B2 (operasionalkan "saling berkaitan"), E2 (kunci),
-- D2 (operasionalkan "simpulan berkaitan"), C2 (teks inline), F2 (kunci).

-- E1 L18: tambahkan kunci bacaan bilangan dan estimasi
update k8_indicators
  set success = '4 dari 5 benar. Kunci: 1.250.000 dibaca "satu juta dua ratus lima puluh ribu"; 3.600.000 dibaca "tiga juta enam ratus ribu"; 498+503 ≈ 1.000; 1.980−995 ≈ 1.000; 49×21 ≈ 1.000.'
  where level = 18 and number = 3 and slot = 'E1';

-- D1 L18: cantumkan isi kerangka konkret di bahan
update k8_indicators
  set material = 'Kerangka di papan: Paragraf 1 (Pembuka) → [kalimat pengantar topik]. Paragraf 2 (Isi) → [penjelasan atau alasan utama]. Paragraf 3 (Penutup) → [kesimpulan atau ajakan]. Contoh diisi guru sesuai topik yang dipilih anak; model tetap terlihat.'
  where level = 18 and number = 4 and slot = 'D1';

-- C1 L18: tambahkan kunci alasan yang diterima per sudut pandang
update k8_indicators
  set success = 'Paling banyak 6 kesalahan kata, dan anak dapat membedakan dua sudut pandang: mendukung belajar kelompok dan lebih suka belajar sendiri, masing-masing dengan satu alasan. Kunci alasan belajar kelompok yang diterima: dapat bertanya kepada teman / membagi tugas / tugas terasa lebih ringan. Kunci alasan belajar sendiri yang diterima: lebih fokus / dapat mengatur waktu sendiri / tidak mudah terganggu.'
  where level = 18 and number = 5 and slot = 'C1';

-- F1 L18: tambahkan kunci untuk 5 pertanyaan
update k8_indicators
  set success = '4 dari 5 benar. Kunci (data 6,7,7,8,10): (1) modus = 7; (2) median = 7; (3) jumlah semua data = 38; (4) banyak data = 5; (5) mean = 38÷5 = 7,6.'
  where level = 18 and number = 6 and slot = 'F1';

-- B2 L18: operasionalkan "ketiganya harus saling berkaitan"
update k8_indicators
  set success = 'Lulus bila teks memuat klaim, sedikitnya satu argumen pendukung, dan simpulan; argumen membahas hal yang sama dengan klaim; simpulan kembali menegaskan klaim atau argumen, bukan membahas hal baru.'
  where level = 18 and number = 8 and slot = 'B2';

-- E2 L18: tambahkan kunci untuk 5 soal terapan
update k8_indicators
  set success = '4 dari 5 benar. Kunci: sisa uang = 50.000−18.500−12.000 = 19.500; gula = 3/4+1/4 = 1 kg; suhu = 4−9 = −5°C; pita = 2,5−0,75 = 1,75 m; jumlah data = 12+15+13+10 = 50.'
  where level = 18 and number = 9 and slot = 'E2';

-- D2 L18: operasionalkan "simpulan berkaitan dengan klaim"
update k8_indicators
  set success = '2–3 paragraf, 120–160 kata; kalimat pertama atau kedua menyatakan pendapat atau posisi; minimal 2 kalimat lain memberikan alasan mengapa pendapat itu benar; kalimat simpulan kembali menegaskan pendapat atau argumen, bukan membahas hal baru; ≤9 kesalahan ejaan per 160 kata; paragraf terpisah jelas.'
  where level = 18 and number = 10 and slot = 'D2';

-- C2 L18: cantumkan teks langsung (tidak cross-reference ke C1 L18)
update k8_indicators
  set material = 'Paragraf 1: Sebagian siswa senang belajar kelompok. Mereka merasa dapat bertanya kepada teman dan membagi tugas. Belajar kelompok juga membuat tugas terasa lebih ringan. / Paragraf 2: Sebagian siswa lain lebih suka belajar sendiri. Mereka merasa lebih fokus dan dapat mengatur waktu sendiri. Belajar sendiri juga membuat mereka tidak mudah terganggu.'
  where level = 18 and number = 11 and slot = 'C2';

-- F2 L18: tambahkan kunci untuk 5 pertanyaan mean/median/modus
update k8_indicators
  set success = '4 dari 5 benar. Kunci: (1) mean Data 1 = (6+7+7+8+10)÷5 = 7,6; (2) median Data 1 = 7; (3) modus Data 1 = 7; (4) mean Data 2 = (12+14+15+15+19)÷5 = 15; (5) modus Data 2 = 15.'
  where level = 18 and number = 12 and slot = 'F2';
