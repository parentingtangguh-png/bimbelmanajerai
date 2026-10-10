-- Audit kartu diagnostik L12: 5 perbaikan (E1 K6, C1 K7-visual, C2 K2, E2 K6, F2 K6)

-- E1: tambah kunci jawaban (K6)
update k8_indicators set
  success = '4 dari 5 respons benar. Kunci: ½ = satu dari dua; ⅓ = satu dari tiga; ¼ = satu dari empat; 2/4 = dua dari empat; ¾ = tiga dari empat.'
where level = 12 and slot = 'E1';

-- C2: tampilkan teks lengkap, bukan referensial (K2)
update k8_indicators set
  material = 'Pagi itu, Siti lupa membawa pensil. Ia meminjam pensil kepada Dina. Setelah selesai menulis, Siti mengembalikan pensil itu. Dina senang karena barangnya dijaga.'
where level = 12 and slot = 'C2';

-- E2: tambah kunci jawaban (K6)
update k8_indicators set
  success = '4 dari 5 benar. Kunci: <; >; 1/6, 3/6, 5/6; 5/7; 6/9.'
where level = 12 and slot = 'E2';

-- F2: tambah kunci jawaban (K6)
update k8_indicators set
  success = '4 dari 5 benar. Kunci: 25 cm²; 49 cm²; 24 cm²; 40 cm²; 30 cm².'
where level = 12 and slot = 'F2';
