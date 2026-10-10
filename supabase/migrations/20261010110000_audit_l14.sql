-- Audit kartu diagnostik L14: 6 perbaikan (E1 K6, C1 K7-visual, F1 K6, E2 K6, C2 K2, F2 K6)

-- E1: tambah kunci desimal↔pecahan (K6)
update k8_indicators set
  success = '4 dari 5 pasangan benar. Kunci: 5/10; 25/100; 75/100; 3/10; 8/100.'
where level = 14 and slot = 'E1';

-- F1: tambah kunci tabel data (K6)
update k8_indicators set
  success = '4 dari 5 benar. Kunci: Cici; Budi; 2; 9; 4.'
where level = 14 and slot = 'F1';

-- E2: tambah kunci operasi desimal (K6)
update k8_indicators set
  success = '5 dari 6 benar. Kunci: 3,8; 6,85; 3,4; 7,25; 0,5; 0,25.'
where level = 14 and slot = 'E2';

-- C2: tampilkan teks lengkap, bukan referensial (K2)
update k8_indicators set
  material = 'Ketika hujan turun, anak-anak tetap belajar di kelas. Mereka tidak bermain di halaman karena lantai menjadi licin. Walaupun begitu, suasana kelas tetap menyenangkan. Guru mengajak anak membaca cerita. Setelah hujan reda, mereka pulang dengan tertib.'
where level = 14 and slot = 'C2';

-- F2: tambah kunci mean (K6)
update k8_indicators set
  success = '3 dari 4 mean benar. Kunci: 7,5; 5; 12; 5.'
where level = 14 and slot = 'F2';
