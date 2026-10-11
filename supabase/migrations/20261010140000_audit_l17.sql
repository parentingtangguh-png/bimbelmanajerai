-- Audit kartu diagnostik L17: 6 perbaikan (K2 D1, K2 C2, K6 E1/F1/E2/F2)

update k8_indicators set
  success = '3 dari 4 barisan benar lengkap dengan aturan. Kunci: 15, 18 (aturan +3); 20, 15 (aturan −5); 32, 64 (aturan ×2); 25, 36 (aturan n²).'
where level = 17 and slot = 'E1';

update k8_indicators set
  material = 'Topik pilihan guru (contoh: "Anak harus rajin membaca buku"). Kerangka 4 bagian ditulis guru: (1) Klaim: Anak harus rajin membaca buku. (2) Alasan 1: Membaca menambah pengetahuan. (3) Alasan 2: Membaca melatih daya pikir. (4) Penutup: Karena itu, biasakan membaca setiap hari. Model tetap terlihat saat anak menulis.'
where level = 17 and slot = 'D1';

update k8_indicators set
  success = '3 dari 4 jarak sebenarnya benar. Kunci: Rumah–Sekolah 6 km; Rumah–Pasar 8 km; Sekolah–Taman 4 km; Pasar–Taman 10 km.'
where level = 17 and slot = 'F1';

update k8_indicators set
  success = '5 dari 6 benar. Kunci: 18; 16; 24; 7; −1; 2.'
where level = 17 and slot = 'E2';

update k8_indicators set
  material = 'Membawa botol minum sendiri adalah kebiasaan yang baik. Anak tidak perlu sering membeli minuman kemasan. Sampah plastik di kelas juga dapat berkurang. Kebiasaan ini memang perlu diingat setiap pagi. Namun, manfaatnya lebih besar daripada repotnya. Karena itu, siswa sebaiknya membawa botol minum sendiri.'
where level = 17 and slot = 'C2';

update k8_indicators set
  success = '4 dari 5 benar. Kunci: 50 cm²; 32 cm²; 40 cm²; 54 cm²; 44 cm².'
where level = 17 and slot = 'F2';
