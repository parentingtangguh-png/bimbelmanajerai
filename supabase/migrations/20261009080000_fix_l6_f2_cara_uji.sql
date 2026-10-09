-- Perbaikan kartu tes diagnostik L6: hilangkan referensi "Prosedur sama dengan L5" pada F2 L6.
-- Cara uji kini mencantumkan langsung instruksi guru sehingga tidak perlu membuka kartu L5.

update k8_indicators
  set method = 'Guru menulis satu kalimat angka setiap butir, menunjuk seluruhnya, dan bertanya, "Berapa hasilnya?" Tidak ada peristiwa mengambil benda oleh guru. Sepuluh benda penopang selalu tersedia.'
  where level = 6 and number = 12 and slot = 'F2';
