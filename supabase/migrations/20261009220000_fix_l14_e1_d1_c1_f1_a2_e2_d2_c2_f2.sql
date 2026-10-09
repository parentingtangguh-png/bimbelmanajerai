-- Perbaikan audit L14: E1 (format bahan jadi soal + kunci), D1 (bagan konkret),
-- C1 (operasionalkan "jeda wajar"), F1 (kunci), A2 (operasionalkan "lancar" per kalimat),
-- E2 (kunci), D2 (operasionalkan kriteria), C2 (teks inline), F2 (kunci).

-- E1 L14: ubah bahan menjadi soal (desimal saja); pindahkan pasangan ke kunci di success
update k8_indicators
  set method   = 'Guru berkata: "Bacalah desimal ini, lalu sebutkan pecahan yang nilainya sama."',
      material = '0,5; 0,25; 0,75; 0,3; 0,08',
      success  = '4 dari 5 pasangan benar. Kunci: 0,5 = 5/10; 0,25 = 25/100; 0,75 = 75/100; 0,3 = 3/10; 0,08 = 8/100.'
  where level = 14 and number = 3 and slot = 'E1';

-- D1 L14: cantumkan isi bagan konkret (kucing) di bahan
update k8_indicators
  set material = 'Bagan di papan — Topik: Kucing. Poin: (1) Kucing adalah hewan peliharaan berbulu. (2) Kucing makan ikan dan daging. (3) Kucing tidur banyak setiap hari. (4) Kucing membersihkan diri dengan menjilat. Model tetap terlihat.'
  where level = 14 and number = 4 and slot = 'D1';

-- C1 L14: ganti "jeda wajar" dengan deskripsi operasional
update k8_indicators
  set success  = 'Paling banyak 4 kesalahan kata, dan anak berhenti sebentar atau menurunkan suara pada sedikitnya 3 dari 5 tanda baca utama (titik atau koma).'
  where level = 14 and number = 5 and slot = 'C1';

-- F1 L14: tambahkan kunci untuk 5 pertanyaan tabel data
update k8_indicators
  set success  = '4 dari 5 benar. Kunci: (1) Cici; (2) Budi; (3) 6−4 = 2; (4) 4+5 = 9; (5) 4 orang.'
  where level = 14 and number = 6 and slot = 'F1';

-- A2 L14: operasionalkan "dibaca lancar" per kalimat
update k8_indicators
  set success  = 'Maksimal 5 kesalahan kata; tidak mengeja kata serapan; minimal 3 dari 4 kalimat dibaca dari awal sampai akhir tanpa berhenti di tengah kata.'
  where level = 14 and number = 7 and slot = 'A2';

-- E2 L14: tambahkan kunci untuk 6 soal desimal dan konversi pecahan
update k8_indicators
  set success  = '5 dari 6 benar. Kunci: 2,5+1,3 = 3,8; 4,75+2,10 = 6,85; 6,8−3,4 = 3,4; 9,50−2,25 = 7,25; 1/2 = 0,5; 1/4 = 0,25.'
  where level = 14 and number = 9 and slot = 'E2';

-- D2 L14: operasionalkan "ada gagasan utama" dan "informasi pendukung"
update k8_indicators
  set success  = '1–2 paragraf, 80–110 kata; kalimat pertama atau kedua menyatakan topik yang ditulis; minimal 2 kalimat lain menambahkan fakta, contoh, atau penjelasan tentang topik yang sama; ≤8 kesalahan ejaan per 110 kata; paragraf jelas bila lebih dari satu.'
  where level = 14 and number = 10 and slot = 'D2';

-- C2 L14: cantumkan teks langsung (tidak cross-reference ke C1 L14)
update k8_indicators
  set material = 'Ketika hujan turun, anak-anak tetap belajar di kelas. Mereka tidak bermain di halaman karena lantai menjadi licin. Walaupun begitu, suasana kelas tetap menyenangkan. Guru mengajak anak membaca cerita. Setelah hujan reda, mereka pulang dengan tertib.'
  where level = 14 and number = 11 and slot = 'C2';

-- F2 L14: tambahkan kunci untuk 4 data set mean
update k8_indicators
  set success  = '3 dari 4 mean benar. Kunci: mean(6,8,7,9) = 7,5; mean(4,5,6,5) = 5; mean(10,12,14) = 12; mean(3,7,5,5) = 5.'
  where level = 14 and number = 12 and slot = 'F2';
