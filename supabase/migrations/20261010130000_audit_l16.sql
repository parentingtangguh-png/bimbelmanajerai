-- Audit L16: 7 perbaikan kartu diagnostik
-- K6: tambah kunci jawaban pada E1, F1, E2, F2
-- K2: tampilkan teks penuh C1 pada C2
-- K7: visual C1 dan F2 ditambahkan di diagnostic-visuals.js (tidak ada perubahan DB)

update public.k8_indicators set success =
  '4 dari 5 disederhanakan benar. Kunci: 2:3; 2:3; 2:3; 3:4; 1:4.'
where level = 16 and number = 3 and slot = 'E1';

update public.k8_indicators set success =
  '4 dari 5 benar. Kunci: (1) garis OA; (2) garis AB; (3) benar; (4) ≈ 3,14 atau 22/7; (5) 14.'
where level = 16 and number = 6 and slot = 'F1';

update public.k8_indicators set success =
  '4 dari 5 benar. Kunci: 15; 16; 4 gelas; 20 km; 6 dan 12.'
where level = 16 and number = 9 and slot = 'E2';

update public.k8_indicators set material =
  'Air dapat berubah bentuk karena panas. Saat dipanaskan, sebagian air berubah menjadi uap. Proses ini disebut menguap. Uap air dapat terlihat seperti asap tipis. Perubahan ini sering terjadi saat air mendidih.'
where level = 16 and number = 11 and slot = 'C2';

update public.k8_indicators set success =
  '4 dari 5 benar. Kunci: 44 cm; 44 cm; 31,4 cm; 31,4 cm; 88 cm.'
where level = 16 and number = 12 and slot = 'F2';
