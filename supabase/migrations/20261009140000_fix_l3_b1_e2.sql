-- Perbaikan kartu tes diagnostik L3: B1 L3 tanpa instruksi untuk anak; E2 L3 kode R/M/S.

update k8_indicators
  set method = 'Katakan, "Tunjuk tulisan untuk bunyi yang kamu dengar." Ucapkan **/l/, /s/, /d/, /s/, /t/, /k/** satu per satu.'
  where level = 3 and number = 2 and slot = 'B1';

update k8_indicators
  set material = '**8 benda baris renggang; 6 benda sebaran rapat tidak beraturan; 10 benda baris melengkung renggang; 7 benda sebaran rapat tidak beraturan; 9 benda baris renggang.**'
  where level = 3 and number = 9 and slot = 'E2';
