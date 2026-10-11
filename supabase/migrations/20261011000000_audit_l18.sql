-- Audit kartu diagnostik L18: 6 perbaikan (K2 D1, K2 C2, K6 E1/F1/E2/F2)

update k8_indicators set
  success = '4 dari 5 benar. Kunci: satu juta dua ratus lima puluh ribu; tiga juta enam ratus ribu; ≈1.000; ≈1.000; ≈1.000.'
where level = 18 and slot = 'E1';

update k8_indicators set
  material = 'Topik pilihan guru (contoh: "Manfaat olahraga bagi kesehatan"). Kerangka 3 paragraf ditulis guru: (1) Pembuka: Olahraga baik untuk kesehatan. (2) Isi: Olahraga memperkuat tubuh dan menjaga berat badan. (3) Penutup: Oleh karena itu, biasakanlah berolahraga setiap hari. Model tetap terlihat saat anak menulis.'
where level = 18 and slot = 'D1';

update k8_indicators set
  success = '4 dari 5 benar. Kunci: (1) modus = 7; (2) median = 7; (3) jumlah = 38; (4) banyak data = 5; (5) mean = jumlah ÷ banyak data.'
where level = 18 and slot = 'F1';

update k8_indicators set
  success = '4 dari 5 benar. Kunci: Rp19.500; 1 kg; −5°C; 1,75 m; 50.'
where level = 18 and slot = 'E2';

update k8_indicators set
  material = 'Paragraf 1: Sebagian siswa senang belajar kelompok. Mereka merasa dapat bertanya kepada teman dan membagi tugas. Belajar kelompok juga membuat tugas terasa lebih ringan. / Paragraf 2: Sebagian siswa lain lebih suka belajar sendiri. Mereka merasa lebih fokus dan dapat mengatur waktu sendiri. Belajar sendiri juga membuat mereka tidak mudah terganggu.'
where level = 18 and slot = 'C2';

update k8_indicators set
  success = '4 dari 5 benar. Kunci: 7,6; 7; 7; 15; 15.'
where level = 18 and slot = 'F2';
