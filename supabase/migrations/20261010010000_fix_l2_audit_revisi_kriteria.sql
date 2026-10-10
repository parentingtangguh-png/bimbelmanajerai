-- Audit ulang L2 dengan kriteria revisi K1–K7
-- 4 perbaikan teks: A2 method, A2 success, C2 method, F2 material

-- A2 L2: ganti "isyarat" dengan instruksi konkret
update k8_indicators
set method = replace(
  method,
  'Penataan dapat dibantu dengan isyarat.',
  'Guru boleh membantu memposisikan benda dengan gestur atau menunjuk — tanpa menyebut nama tindakan.'
)
where level = 2 and slot = 'A2';

-- A2 L2: ganti "klausa" dengan contoh lulus/tidak lulus
update k8_indicators
set success = '**3 dari 4 tuturan** menyebut tindakan dan benda secara bersamaan, sesuai kejadian. Contoh lulus: *"Aku pegang buku."* Contoh tidak lulus: *"Buku."* atau *"Pegang."* saja. Panjang kalimat tidak dinilai.'
where level = 2 and slot = 'A2';

-- C2 L2: hapus referensi "Ikuti Prosedur C2 L2"
update k8_indicators
set method = replace(method, 'Ikuti Prosedur C2 L2. ', '')
where level = 2 and slot = 'C2';

-- F2 L2: selaraskan bahan dengan cara uji
update k8_indicators
set material = replace(material, 'Tutup botol dan penutup.', 'Tutup botol; kain polos atau wadah plastik terbalik sebagai penutup.')
where level = 2 and slot = 'F2';
