-- Perbaikan kartu tes diagnostik L9: hilangkan referensi "Teks sama dengan C1 L9" pada C2 L9.
-- Teks bacaan kini dicantumkan langsung di kolom bahan sehingga guru tidak perlu membuka kartu C1.

update k8_indicators
  set material = '**Rani membawa bekal. Ia makan roti saat istirahat. Setelah itu, Rani minum air.**'
  where level = 9 and number = 11 and slot = 'C2';
