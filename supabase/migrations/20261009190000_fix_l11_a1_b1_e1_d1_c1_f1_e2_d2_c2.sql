-- Perbaikan audit L11: A1 (hapus klausa redundant), B1 (format bahan + kunci),
-- E1 (penanda bahan + kunci), D1 (kalimat contoh + kunci tanda baca),
-- C1 (kunci kalimat rincian), F1 (kunci), E2 (kunci), D2 (operasionalkan kriteria),
-- C2 (teks inline, tidak cross-reference ke C1 L11).

-- A1 L11: hapus "maksimal 2 kata perlu diulang" (redundant dan ambigu)
update k8_indicators
  set success = 'Minimal 8 dari 10 kata dibaca benar.'
  where level = 11 and number = 1 and slot = 'A1';

-- B1 L11: perjelas format bahan (kata hubung dicetak tebal); pilih satu kunci per butir
update k8_indicators
  set method   = 'Guru menunjuk tiap kata hubung yang dicetak tebal lalu bertanya: "Kata ini dipakai untuk apa dalam kalimat ini?"',
      material = 'Rani membaca **dan** Bima menulis. / Raka ingin bermain, **tetapi** tugasnya belum selesai. / Siti membawa payung **karena** hujan. / **Jika** selesai belajar, Ali boleh istirahat.',
      success  = '3 dari 4 tepat. Kunci: **dan** = menggabungkan; **tetapi** = pertentangan; **karena** = sebab; **jika** = syarat.'
  where level = 11 and number = 2 and slot = 'B1';

-- E1 L11: tambahkan penanda angka target di bahan; tambahkan kunci nilai tempat dan urutan
update k8_indicators
  set method   = 'Guru menulis empat soal di papan — tiga nilai tempat dan satu urutan — lalu berkata: "Sebutkan nilai angka yang digarisbawahi, lalu urutkan bilangan dari yang terkecil."',
      material = 'Nilai tempat (garis bawahi angka target): **3**.482; 5.7**6**1; 8.0**9**5. Urutan dari terkecil: 2.314 · 2.413 · 2.134 · 2.431.',
      success  = '3 dari 4 tugas benar. Kunci: **3**.482 = 3.000 (ribuan); 5.**7**61 = 700 (ratusan); 8.0**9**5 = 90 (puluhan). Urutan: 2.134 · 2.314 · 2.413 · 2.431.'
  where level = 11 and number = 3 and slot = 'E1';

-- D1 L11: cantumkan kalimat contoh di bahan; tambahkan kunci tanda baca per kalimat
update k8_indicators
  set method   = 'Guru menulis 5 kalimat tanpa kapital awal dan tanda baca akhir beserta contoh satu kalimat yang sudah diperbaiki. Guru berkata: "Tulis ulang kalimat ini seperti contoh — huruf kapital di awal dan tanda baca yang tepat di akhir."',
      material = 'Contoh: **budi pergi ke sekolah → Budi pergi ke sekolah.** Kalimat yang diperbaiki: 1. ani membawa buku ke sekolah 2. siapa yang menaruh pensil di meja 3. ibu membeli beras telur dan gula 4. kami bermain di halaman saat istirahat 5. wah indah sekali gambar itu',
      success  = 'Minimal 4 dari 5 kalimat benar kapital awal dan tanda akhir; ≤3 kesalahan tanda baca total; ≤4 kesalahan ejaan dari seluruh tulisan. Kunci tanda akhir: (1) titik; (2) tanda tanya; (3) titik; (4) titik; (5) tanda seru.'
  where level = 11 and number = 4 and slot = 'D1';

-- C1 L11: tambahkan kunci mana yang dianggap "kalimat rincian"
update k8_indicators
  set success = 'Paling banyak 3 kesalahan kata, serta anak dapat menunjuk 2 dari 3 bagian: judul, kalimat pembuka, kalimat rincian. Kunci: judul = "Manfaat Air"; kalimat pembuka = kalimat pertama; kalimat rincian = kalimat kedua atau ketiga (bukan kalimat terakhir yang merupakan kalimat penutup).'
  where level = 11 and number = 5 and slot = 'C1';

-- F1 L11: tambahkan kunci untuk 5 butir
update k8_indicators
  set success = '4 dari 5 benar. Kunci: 1 kg = 1.000 gram; 1 jam = 60 menit; 1 hari = 24 jam; berat apel = gram; berat beras sekarung = kg.'
  where level = 11 and number = 6 and slot = 'F1';

-- E2 L11: tambahkan kunci untuk 6 soal
update k8_indicators
  set success = '5 dari 6 benar. Kunci: 24×3 = 72; 36×2 = 72; 47×4 = 188; 84÷4 = 21; 96÷3 = 32; 75÷5 = 15.'
  where level = 11 and number = 9 and slot = 'E2';

-- D2 L11: operasionalkan "gagasan pokok" dan "kalimat rincian"
update k8_indicators
  set success = '1 paragraf 4–5 kalimat; kalimat pertama menyatakan topik atau hal utama yang ditulis; minimal 2 kalimat berikutnya menambahkan detail, contoh, atau penjelasan tentang hal yang sama; ≤6 kesalahan ejaan per 60 kata; tanda akhir benar pada minimal 4 kalimat.'
  where level = 11 and number = 10 and slot = 'D2';

-- C2 L11: cantumkan teks langsung (tidak cross-reference ke C1 L11)
update k8_indicators
  set material = '**Manfaat Air** — Air dibutuhkan tubuh setiap hari. Kita minum air agar tubuh tidak lemas. Air juga membantu tubuh tetap segar. Karena itu, kita perlu minum cukup air.'
  where level = 11 and number = 11 and slot = 'C2';
