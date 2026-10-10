-- Audit kartu diagnostik L13: 6 perbaikan (E1 K6, C1 K7-visual, F1 K6, E2 K6, C2 K2, F2 K6)

-- E1: tambah kunci nilai tempat dan FPB/KPK (K6)
update k8_indicators set
  success = '4 dari 5 benar. Kunci: 8.000; 500; FPB=6; KPK=12; KPK=10.'
where level = 13 and slot = 'E1';

-- F1: tambah kunci bangun ruang (K6)
update k8_indicators set
  success = '4 dari 5 benar. Kunci: 6 sisi; 12 rusuk; 5 sisi; 8 titik sudut; persegi panjang.'
where level = 13 and slot = 'F1';

-- E2: tambah kunci perkalian dan pembagian dengan sisa (K6)
update k8_indicators set
  success = '5 dari 6 benar. Kunci: 322; 900; 816; 31 sisa 1; 47 sisa 1; 53 sisa 1.'
where level = 13 and slot = 'E2';

-- C2: tampilkan teks lengkap, bukan referensial (K2)
update k8_indicators set
  material = 'Tanaman membutuhkan air. Akar tanaman menyerap air dari tanah. Air itu membantu batang dan daun tetap segar. Tanaman yang cukup air dapat tumbuh baik.'
where level = 13 and slot = 'C2';

-- F2: tambah kunci volume kubus dan balok (K6)
update k8_indicators set
  success = '4 dari 5 benar. Kunci: 64 cm³; 216 cm³; 30 cm³; 64 cm³; 150 cm³.'
where level = 13 and slot = 'F2';
