-- Perbaikan audit L10: E1 (kunci + definisi benar), D1 (paragraf konkret), C1 (hapus "jeda wajar"),
-- D2 (definisikan "urutan tampak" + "tidak berpindah topik"), C2 (teks inline).

-- E1 L10: tambahkan kunci per butir; tegaskan kedua komponen (bentuk + hasil); susunan terbalik diterima
update k8_indicators
  set success = '4 dari 5 butir memenuhi dua syarat: bentuk penjumlahan berulang tepat dan hasil tepat. Kunci: **3×2 = 2+2+2 = 6; 4×3 = 3+3+3+3 = 12; 5×2 = 2+2+2+2+2 = 10; 2×6 = 6+6 = 12; 3×4 = 4+4+4 = 12**. Susunan terbalik (mis. 3×2 = 3+3) juga diterima bila hasil tepat.'
  where level = 10 and number = 3 and slot = 'E1';

-- D1 L10: paragraf konkret 43 kata, 4 kalimat untuk papan berjarak ±2–3 m
update k8_indicators
  set material = '**Setiap pagi, Rani membantu ibu menyiapkan sarapan untuk seluruh keluarga. Ia menata piring, sendok, dan gelas di atas meja dengan rapi. Setelah sarapan selesai, Rani mencuci piring dan membereskan meja bersama kakak. Rani merasa senang bisa membantu pekerjaan rumah sebelum berangkat ke sekolah.** Model tetap terlihat dari jarak ±2–3 m.'
  where level = 10 and number = 4 and slot = 'D1';

-- C1 L10: ganti "jeda wajar" dengan deskripsi operasional
update k8_indicators
  set success = 'Paling banyak 2 kesalahan kata; jeda yang terlihat atau terdengar pada sedikitnya 2 dari 3 akhir kalimat (berhenti sebentar sebelum kalimat berikutnya).'
  where level = 10 and number = 5 and slot = 'C1';

-- D2 L10: definisikan "urutan tampak" dan "tidak berpindah topik" secara operasional; hapus rentang 25–40 kata
update k8_indicators
  set success = 'Minimal 3 kalimat; kalimat pertama menyatakan bagian awal kejadian, kalimat kedua bagian tengah (kejadian yang mengikuti), kalimat ketiga bagian akhir atau hasil; ketiga kalimat membahas kejadian atau pelaku yang sama; ≤5 kesalahan ejaan pada seluruh kalimat.'
  where level = 10 and number = 10 and slot = 'D2';

-- C2 L10: cantumkan teks langsung (tidak lagi merujuk ke C1 L10)
update k8_indicators
  set material = '**Bima merapikan tas. Ia memasukkan buku dan pensil. Tas Bima siap dibawa.**'
  where level = 10 and number = 11 and slot = 'C2';
