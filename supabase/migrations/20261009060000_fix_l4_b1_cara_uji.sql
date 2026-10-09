-- Perbaikan kartu tes diagnostik L4: hilangkan referensi "ketentuan pelafalan" pada B1 L4.
-- Cara uji kini menyebut langsung aturan /c/ dan /h/ yang sebelumnya hanya ada di seksi Kalibrasi Pelafalan.

update k8_indicators
  set method = 'Ucapkan **/r/, /g/, /h/, /c/, /g/, /j/** satu per satu. `/c/` bunyi awal "cuci" (bukan "ce"); `/h/` embusan singkat "hhh" (bukan "ha"). Jangan menyebut nama huruf.'
  where level = 4 and number = 2 and slot = 'B1';
