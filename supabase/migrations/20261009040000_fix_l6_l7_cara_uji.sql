-- Perbaikan kartu tes diagnostik L6 dan L7: hilangkan referensi "rubrik spasi" dan
-- "perintah baku (Penyiapan Khusus)" yang tidak terlihat guru saat memegang kartu.
-- Semua kriteria kini inline dan bisa dibaca langsung.

-- D1 L6: ganti "rubrik spasi" dengan kriteria spasi inline
update k8_indicators
  set success = '**Paling banyak satu kesalahan huruf**, serta satu batas kata memiliki celah jelas (≈ selebar huruf ''o'' tulisan anak) tanpa celah di dalam kata. Kunci **topi / baru**.'
  where level = 6 and number = 4 and slot = 'D1';

-- D1 L7: ganti "rubrik spasi" dengan kriteria spasi inline
update k8_indicators
  set success = '**Paling banyak satu kesalahan gabungan huruf/kapital/titik**, serta dua batas kata memiliki celah jelas (≈ selebar huruf ''o'' tulisan anak). Kunci **Beni / buka / laci**.'
  where level = 7 and number = 4 and slot = 'D1';

-- D2 L7: ganti "rubrik spasi" dengan kriteria spasi inline
update k8_indicators
  set success = '**Paling banyak satu kesalahan huruf** keseluruhan, serta dua batas kata memiliki celah jelas (≈ selebar huruf ''o'' tulisan anak). Kunci **Dina / minum / teh**. Kapital awal dan titik tidak menentukan lulus.'
  where level = 7 and number = 10 and slot = 'D2';

-- E2 L7: ganti "Gunakan hanya perintah baku (Penyiapan Khusus)" dengan instruksi inline
update k8_indicators
  set method = 'Tampilkan satu bentuk setiap butir. Instruksi: **"Isi bagian yang kosong supaya kedua sisi sama."** Anak menyebut bilangan pengisi; guru mencatat tanpa membantu.'
  where level = 7 and number = 9 and slot = 'E2';
