-- Pemilik merevisi kurikulum dari awal (13 Sep 2026). Isi lama dikosongkan atas permintaannya;
-- tabel, kolom, batasan, dan hak akses dibiarkan sampai susunan kurikulum baru diputuskan.
-- Teks lama tetap bisa dibaca kembali dari migrasi-migrasi sebelumnya di riwayat git.
-- Tidak ada foreign key maupun fungsi database yang membaca tabel ini.
delete from public.curriculum;
