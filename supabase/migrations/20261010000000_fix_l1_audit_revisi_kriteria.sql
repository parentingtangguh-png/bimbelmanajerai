-- Audit ulang L1 dengan kriteria revisi K1–K7
-- 5 perbaikan: A2 success, C2 method, D1 success, E1 success, F2 material

-- A2 L1: tambah contoh padanan nama yang diterima
update k8_indicators
set success = '**3 dari 4 benda** disebut dengan nama yang sesuai. Padanan yang lazim diterima; contoh: cangkir/gelas diterima untuk gelas plastik, bola merah/bola kecil diterima untuk bola polos.'
where level = 1 and slot = 'A2';

-- C2 L1: ganti "satu susunan" dengan tata letak konkret
update k8_indicators
set method = replace(method, 'satu nama sasaran dan satu susunan sebelum tes', 'satu nama sasaran dan tata letak kartu sebelum tes: tata 6 kartu nama dalam **2 baris × 3 kolom**')
where level = 1 and slot = 'C2';

-- D1 L1: tambah arah miring mengikuti model
update k8_indicators
set success = replace(success, 'Miring: perpindahan diagonal jelas.', 'Miring: perpindahan diagonal jelas, arah mengikuti model (naik ke kanan).')
where level = 1 and slot = 'D1';

-- E1 L1: pisahkan keterangan koreksi diri
update k8_indicators
set success = 'Satu rangkaian **1, 2, 3, 4, 5** lengkap dan berurutan. Koreksi diri diperbolehkan; evaluasi dilakukan pada ucapan akhir setelah anak selesai mengoreksi. Jika anak melanjutkan sesudah lima, nilai hanya segmen 1–5.'
where level = 1 and slot = 'E1';

-- F2 L1: selaraskan bahan dengan cara uji
update k8_indicators
set material = replace(material, 'Tutup botol dan penutup.', 'Tutup botol; kain polos atau wadah plastik terbalik sebagai penutup.')
where level = 1 and slot = 'F2';
