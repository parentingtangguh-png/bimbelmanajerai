-- Perbaikan kartu tes diagnostik L4: B1 L4 tidak menyertakan instruksi untuk anak.

update k8_indicators
  set method = 'Katakan, "Tunjuk tulisan untuk bunyi yang kamu dengar." Ucapkan **/r/, /g/, /h/, /c/, /g/, /j/** satu per satu. `/c/` bunyi awal "cuci" (bukan "ce"); `/h/` embusan singkat "hhh" (bukan "ha"). Jangan menyebut nama huruf.'
  where level = 4 and number = 2 and slot = 'B1';
