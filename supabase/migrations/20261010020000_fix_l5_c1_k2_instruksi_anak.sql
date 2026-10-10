-- Perbaikan C1 L5 K2: tambahkan instruksi untuk anak — sebelumnya method
-- hanya "Tampilkan empat kata satu per satu" tanpa menyebut apa yang diminta anak lakukan.

update k8_indicators
  set method = 'Tampilkan empat kata satu per satu dan minta anak membaca setiap kata nyaring.'
  where level = 5 and number = 5 and slot = 'C1';
