-- Perbaikan B2 L5 K2: ganti "kualitas vokal mengikuti stimulus" (tidak operasional)
-- dengan kalimat yang dapat dipahami guru tanpa latar linguistik.

update k8_indicators
  set success = '**3 dari 4** tepat. Kunci: **ro; neka; lepon; jemba**. Semua sisa bunyi dipertahankan dalam urutan semula; pengucapan vokal mengikuti cara guru menyebut stimulus. Hasil tidak harus kata bermakna. Selalu menghapus awal atau selalu akhir hanya menghasilkan dua jawaban tepat.'
  where level = 5 and number = 8 and slot = 'B2';
