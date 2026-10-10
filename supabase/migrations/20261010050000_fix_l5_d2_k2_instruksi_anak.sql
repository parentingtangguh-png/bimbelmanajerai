-- Perbaikan D2 L5 K2: tambahkan instruksi untuk anak dan aturan mendiktekan —
-- sebelumnya method hanya "Diktekan dua kata bergantian; sediakan ruang jawaban terpisah"
-- tanpa menyebut apa yang diminta anak lakukan setelah mendengar.

update k8_indicators
  set method = 'Ucapkan tiap kata sekali lalu minta, "Tulis kata yang baru kamu dengar." Sediakan ruang jawaban terpisah untuk masing-masing kata.'
  where level = 5 and number = 10 and slot = 'D2';
