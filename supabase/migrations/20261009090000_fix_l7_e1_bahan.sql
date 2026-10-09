-- Perbaikan kartu tes diagnostik L7: hilangkan referensi "Penyiapan Khusus" pada E1 L7.
-- Keterangan garis bilangan kini dicantumkan langsung di kolom bahan sehingga guru tidak perlu membuka seksi lain.

update k8_indicators
  set material = 'Garis mendatar dengan 21 takik dan 20 ruas berjarak sama; hanya takik 0, 10, dan 20 diberi label. Periksa semua takik sebelum tes. Target **7; 16; 3; 12**. Hanya satu target terlihat setiap butir.'
  where level = 7 and number = 3 and slot = 'E1';
