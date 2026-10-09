-- Perbaikan kartu tes diagnostik L1: hilangkan kode susunan R/M/S pada E2 L1 bahan.
-- Kode tidak dijelaskan inline; guru perlu membuka seksi Penyiapan Khusus untuk memahaminya.

update k8_indicators
  set material = 'Empat kumpulan: **2 benda baris renggang; 1 benda di tengah; 3 benda baris melengkung; 2 benda sebaran rapat tidak beraturan**.'
  where level = 1 and number = 9 and slot = 'E2';
