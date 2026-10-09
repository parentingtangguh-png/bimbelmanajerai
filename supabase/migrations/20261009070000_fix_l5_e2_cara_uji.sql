-- Perbaikan kartu tes diagnostik L5: hilangkan referensi "Prosedur sama dengan L4" pada E2 L5.
-- Instruksi pembagian kini dicantumkan langsung sehingga guru tidak perlu membuka kartu L4.

update k8_indicators
  set method = 'Guru menyebut total yang sudah disiapkan. Minta, "Pisahkan semua benda menjadi dua kelompok. Kedua kelompok harus berisi benda. Banyaknya boleh kamu pilih." Setelah selesai, tanyakan banyak benda pada masing-masing kelompok. Tidak meminta persamaan atau menanyakan bagian yang hilang tanpa benda.'
  where level = 5 and number = 9 and slot = 'E2';
