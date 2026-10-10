-- Audit L15: 6 perbaikan kartu diagnostik
-- K6: tambah kunci jawaban pada E1, F1, E2, F2
-- K2: tampilkan teks penuh C1 pada C2
-- K7: visual C1 dan F2 ditambahkan di diagnostic-visuals.js (tidak ada perubahan DB)

update public.k8_indicators set success =
  '4 dari 5 tugas benar. Kunci: pasangan → 2, −1, 0; urutan → −6 −2 0 1 4; berlawanan −4 → 4.'
where level = 15 and number = 3 and slot = 'E1';

update public.k8_indicators set success =
  '4 dari 5 identifikasi atau sifat benar. Kunci: (1) sama sisi — 3 sisi sama panjang; (2) sama kaki — 2 sisi sama panjang; (3) siku-siku — 1 sudut 90°; (4) sembarang — semua sisi panjang berbeda; (5) jajargenjang — 2 pasang sisi sejajar dan sama panjang.'
where level = 15 and number = 6 and slot = 'F1';

update public.k8_indicators set success =
  '5 dari 6 benar. Kunci: 4; −3; −10; 3; 5°C; −4 m.'
where level = 15 and number = 9 and slot = 'E2';

update public.k8_indicators set material =
  'Membaca Setiap Hari – Membaca setiap hari perlu dibiasakan. Kebiasaan ini menambah kosakata. Anak yang sering membaca juga lebih mudah memahami pelajaran. Membaca tidak harus lama, tetapi perlu dilakukan rutin. Karena itu, anak sebaiknya menyediakan waktu membaca setiap hari.'
where level = 15 and number = 11 and slot = 'C2';

update public.k8_indicators set success =
  '4 dari 5 benar. Kunci: 20 cm²; 30 cm²; 36 cm²; 60 cm²; 33 cm².'
where level = 15 and number = 12 and slot = 'F2';
