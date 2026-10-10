-- Audit L11: 6 perbaikan kartu diagnostik
-- A1 K6: hapus klausa "perlu diulang" yang ambigu
-- C1 K7: visual kunci bagian-bagian teks (di diagnostic-visuals.js)
-- D1 K6: tambah kunci tanda baca per kalimat
-- E2 K6: tambah kunci jawaban
-- C2 K2: material tampilkan teks lengkap
-- F2 K6: tambah kunci jawaban

update k8_indicators set
  success    = 'Minimal 8 dari 10 kata dibaca benar tanpa mengeja huruf per huruf.'
where level = 11 and slot = 'A1';

update k8_indicators set
  success    = 'Paling banyak 3 kesalahan kata, serta anak dapat menunjuk 2 dari 3 bagian: judul, kalimat pembuka, kalimat rincian. Kunci: judul → "Manfaat Air"; kalimat pembuka → kalimat 1; kalimat rincian → kalimat 2 atau 3.'
where level = 11 and slot = 'C1';

update k8_indicators set
  success    = 'Minimal 4 dari 5 kalimat benar kapital awal dan tanda akhir; ≤3 kesalahan tanda baca total; ≤4 kesalahan ejaan dari seluruh tulisan. Kunci tanda akhir: (1) titik · (2) tanda tanya · (3) koma di antara rincian + titik · (4) titik · (5) koma setelah "Wah" + tanda seru.'
where level = 11 and slot = 'D1';

update k8_indicators set
  success    = '5 dari 6 benar. Kunci: 72; 72; 188; 21; 32; 15.'
where level = 11 and slot = 'E2';

update k8_indicators set
  method     = 'Tampilkan teks; setelah anak membaca, tanyakan: "Apa gagasan utama teks ini?"',
  material   = 'Manfaat Air — Air dibutuhkan tubuh setiap hari. Kita minum air agar tubuh tidak lemas. Air juga membantu tubuh tetap segar. Karena itu, kita perlu minum cukup air.'
where level = 11 and slot = 'C2';

update k8_indicators set
  success    = '4 dari 5 benar. Kunci: 18 cm; 22 cm; 2.000 gram; 3 kg; 1.500 gram.'
where level = 11 and slot = 'F2';
