-- Perbaikan kartu tes diagnostik L2: tiga kartu menyebut "perintah yang sama" atau kode R/M/S.
-- Semua referensi kini dicantumkan langsung sehingga guru tidak perlu membuka kartu level lain.

update k8_indicators
  set method = 'Katakan, "Tunjuk tulisan untuk bunyi yang kamu dengar." Ucapkan **/n/, /b/, /p/, /n/, /m/, /b/**. Bukan nama huruf.'
  where level = 2 and number = 2 and slot = 'B1';

update k8_indicators
  set method = 'Tampilkan empat bentuk satu per satu. Katakan, "Buat seperti ini di tempat kosong." Bentuk yang sedang ditiru tetap terlihat; tidak meminta nama bentuk.'
  where level = 2 and number = 4 and slot = 'D1';

update k8_indicators
  set material = '**4 benda baris renggang; 5 benda sebaran rapat tidak beraturan; 5 benda baris melengkung renggang; 4 benda sebaran rapat tidak beraturan.** Bahan menekankan perluasan ke empat dan lima, bukan mengulang hanya 1–3.'
  where level = 2 and number = 9 and slot = 'E2';
