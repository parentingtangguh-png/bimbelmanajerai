-- Audit ulang L3 dengan kriteria revisi K1–K7: 1 perbaikan K6
-- A2 L3 (level=3, number=7, slot='A2'):
--   K6: Tambah contoh lulus/belum agar "klausa + ciri fisik" operasional untuk guru

update k8_indicators
  set success = '**3 dari 4 tuturan** memuat klausa yang menyebut benda dan sedikitnya satu ciri fisik yang dapat diperiksa langsung. Sasaran panjang sekitar empat kata. Nama benda atau kata sifat yang berdiri sendiri belum mendapat poin. Contoh lulus: "Bolanya merah." atau "Sendoknya keras." — Contoh belum: "Bola." atau "Merah." saja.'
  where level = 3 and number = 7 and slot = 'A2';
