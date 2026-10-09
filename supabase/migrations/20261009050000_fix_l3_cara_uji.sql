-- Perbaikan kartu tes diagnostik L3: hilangkan referensi lintas-level pada cara uji.
-- E1 L3: "Dengan prosedur sama" → instruksi langsung (mengacu E1 L2 yang tidak terlihat guru)
-- E2 L3: "Prosedur seperti L2" → instruksi langsung (mengacu E2 L2 yang tidak terlihat guru)

update k8_indicators
  set method = 'Minta menunjuk angka yang disebut. Ucapkan 8; 6; 10; 7; 8; 9, satu per satu.'
  where level = 3 and number = 3 and slot = 'E1';

update k8_indicators
  set method = 'Tampilkan kumpulan satu per satu tanpa menyebut jumlah. Tanyakan, "Semuanya ada berapa?" Benda boleh ditata ulang sendiri untuk membantu menghitung, tanpa mengubah total.'
  where level = 3 and number = 9 and slot = 'E2';
