-- Perbaikan audit L15: E1 (kunci), D1 (bagan konkret), F1 (kunci sifat bangun),
-- A2 (operasionalkan "lancar" per kalimat), E2 (kunci), D2 (operasionalkan kriteria),
-- C2 (teks inline), F2 (kunci).

-- E1 L15: tambahkan kunci untuk 5 tugas bilangan bulat
update k8_indicators
  set success  = '4 dari 5 tugas benar. Kunci: (1) 2 > −3; (2) −1 > −5; (3) 0 > −4; (4) urutan: −6, −2, 0, 1, 4; (5) bilangan berlawanan dari −4 = 4.'
  where level = 15 and number = 3 and slot = 'E1';

-- D1 L15: cantumkan isi bagan konkret (pensil) di bahan
update k8_indicators
  set material = 'Bagan di papan — Objek: Pensil. (1) Bentuk/warna: panjang, ramping, berwarna kuning. (2) Bagian penting: ujung grafit untuk menulis, penghapus di bagian atas. (3) Fungsi: menulis dan menggambar. (4) Kesan: ringan dan mudah dibawa ke mana saja. Model tetap terlihat.'
  where level = 15 and number = 4 and slot = 'D1';

-- F1 L15: tambahkan kunci sifat yang diterima per bangun
update k8_indicators
  set success  = '4 dari 5 identifikasi atau sifat benar. Kunci sifat yang diterima: segitiga sama sisi = ketiga sisinya sama panjang; segitiga sama kaki = dua sisinya sama panjang; segitiga siku-siku = memiliki satu sudut 90°; segitiga sembarang = ketiga sisinya berbeda panjang; jajargenjang = sisi-sisi yang berhadapan sejajar dan sama panjang.'
  where level = 15 and number = 6 and slot = 'F1';

-- A2 L15: operasionalkan "dibaca lancar" per kalimat
update k8_indicators
  set success  = 'Maksimal 5 kesalahan kata; pengulangan untuk menebak maksimal 2 kali total; minimal 3 dari 4 kalimat dibaca dari awal sampai akhir tanpa berhenti di tengah kata.'
  where level = 15 and number = 7 and slot = 'A2';

-- E2 L15: tambahkan kunci untuk 6 soal bilangan bulat termasuk konteks
update k8_indicators
  set success  = '5 dari 6 benar. Kunci: −3+7 = 4; 5+(−8) = −3; −6−4 = −10; −2−(−5) = 3; suhu −1°C naik 6° = 5°C; ketinggian 3 m turun 7 m = −4 m.'
  where level = 15 and number = 9 and slot = 'E2';

-- D2 L15: operasionalkan "klaim jelas" dan "alasan relevan"
update k8_indicators
  set success  = '1 paragraf 6–8 kalimat; kalimat pertama atau kedua menyatakan pendapat atau posisi tentang suatu hal; minimal 1 kalimat lain memberikan alasan mengapa pendapat itu benar atau penting; ≤8 kesalahan ejaan per 110 kata; tanda baca akhir benar pada ≥80% kalimat.'
  where level = 15 and number = 10 and slot = 'D2';

-- C2 L15: cantumkan teks langsung (tidak cross-reference ke C1 L15)
update k8_indicators
  set material = 'Membaca Setiap Hari — Membaca setiap hari perlu dibiasakan. Kebiasaan ini menambah kosakata. Anak yang sering membaca juga lebih mudah memahami pelajaran. Membaca tidak harus lama, tetapi perlu dilakukan rutin. Karena itu, anak sebaiknya menyediakan waktu membaca setiap hari.'
  where level = 15 and number = 11 and slot = 'C2';

-- F2 L15: tambahkan kunci untuk 5 soal luas segitiga, jajargenjang, dan gabungan
update k8_indicators
  set success  = '4 dari 5 benar. Kunci: segitiga 8×5 = 20 cm²; segitiga 10×6 = 30 cm²; jajargenjang 9×4 = 36 cm²; jajargenjang 12×5 = 60 cm²; gabungan = persegi panjang 6×4 (24 cm²) + segitiga 6×3 (9 cm²) = 33 cm².'
  where level = 15 and number = 12 and slot = 'F2';
