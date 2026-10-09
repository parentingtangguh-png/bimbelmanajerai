-- Perbaikan audit L13: E1 (penanda bahan + kunci), D1 (kunci kata hubung),
-- F1 (kunci bangun ruang), A2 (operasionalkan intonasi), E2 (kunci),
-- C2 (teks inline), F2 (kunci).

-- E1 L13: tambahkan penanda angka target di bahan; tambahkan kunci nilai tempat + FPB/KPK
update k8_indicators
  set method   = 'Guru menulis lima soal di papan (dua nilai tempat, satu FPB, dua KPK) lalu berkata: "Sebutkan nilai angka yang digarisbawahi, lalu tentukan FPB atau KPK dari pasangan bilangan ini."',
      material = 'Nilai tempat (garis bawahi angka target): **8**.426; 9.**5**03. FPB dari 12 dan 18. KPK dari 4 dan 6. KPK dari 5 dan 10.',
      success  = '4 dari 5 benar. Kunci: **8**.426 = 8.000 (ribuan); 9.**5**03 = 500 (ratusan); FPB(12,18) = 6; KPK(4,6) = 12; KPK(5,10) = 10.'
  where level = 13 and number = 3 and slot = 'E1';

-- D1 L13: tambahkan kunci kata hubung yang diterima per pasangan kalimat
update k8_indicators
  set success  = 'Minimal 5 dari 6 kalimat majemuk tersusun benar dengan kata hubung yang sesuai; ≤4 kesalahan ejaan; tanda baca akhir benar pada minimal 5 kalimat. Kunci kata hubung: (1) dan/lalu; (2) tetapi; (3) karena; (4) sehingga/karena; (5) lalu/dan; (6) dan.'
  where level = 13 and number = 4 and slot = 'D1';

-- F1 L13: tambahkan kunci jumlah sisi/rusuk/titik sudut per bangun
update k8_indicators
  set success  = '4 dari 5 benar. Kunci: (1) kubus = 6 sisi; (2) balok = 12 rusuk; (3) prisma segitiga = 5 sisi; (4) kubus = 8 titik sudut; (5) sisi balok berbentuk persegi panjang.'
  where level = 13 and number = 6 and slot = 'F1';

-- A2 L13: operasionalkan "intonasi tanya dan seru sesuai"
update k8_indicators
  set success  = 'Maksimal 5 kesalahan kata; pada kalimat tanya suara naik di akhir atau intonasi berbeda dari kalimat pernyataan; pada kalimat seru suara lebih tegas atau lebih keras dibanding kalimat pernyataan; tidak mengeja kata panjang.'
  where level = 13 and number = 7 and slot = 'A2';

-- E2 L13: tambahkan kunci untuk 6 soal termasuk sisa pembagian
update k8_indicators
  set success  = '5 dari 6 benar. Kunci: 23×14 = 322; 36×25 = 900; 48×17 = 816; 125÷4 = 31 sisa 1; 236÷5 = 47 sisa 1; 319÷6 = 53 sisa 1.'
  where level = 13 and number = 9 and slot = 'E2';

-- C2 L13: cantumkan teks langsung (tidak cross-reference ke C1 L13)
update k8_indicators
  set material = 'Tanaman membutuhkan air. Akar tanaman **menyerap** air dari tanah. Air itu membantu batang dan daun tetap segar. Tanaman yang cukup air dapat tumbuh baik.'
  where level = 13 and number = 11 and slot = 'C2';

-- F2 L13: tambahkan kunci untuk 5 soal volume
update k8_indicators
  set success  = '4 dari 5 benar. Kunci: kubus sisi 4 cm = 64 cm³; kubus sisi 6 cm = 216 cm³; balok 5×3×2 = 30 cm³; balok 8×4×2 = 64 cm³; kotak 10×5×3 = 150 cm³.'
  where level = 13 and number = 12 and slot = 'F2';
