-- Audit L10: 7 perbaikan kartu diagnostik
-- D1 K2: material paragraf konkret + K6: success tanpa persentase spasi
-- F1 K7: visual jam diperbaiki (koordinat jarum 07.30 dan 10.00)
-- B2 K6: semua 4 kunci ditulis eksplisit, hapus kata "Contoh"
-- E2 K6: tambah kunci jawaban
-- D2 K6: success diperjelas (urutan kronologis antar kalimat)
-- C2 K2: material tampilkan teks lengkap
-- F2 K6: tambah kunci jawaban

update k8_indicators set
  material   = 'Budi menanam pohon di halaman rumah. Ia menggali tanah dengan sekop kecil. Setelah itu, Budi memasukkan bibit pohon ke dalam lubang. Ia menyiram pohon itu setiap pagi agar tumbuh subur.',
  success    = 'Semua kalimat tersalin urut; tidak ada kalimat hilang; ≤4 kesalahan salin/ejaan; ≤3 kesalahan kapital atau tanda baca; tidak ada kata yang menempel atau terputus di tengah.'
where level = 10 and slot = 'D1';

update k8_indicators set
  success    = '3 dari 4 kalimat bermakna tepat. Kunci: (1) Rani mencuci tangan; (2) Bima membaca buku; (3) tas ada di meja; (4) Ali minum karena haus. Urutan kata boleh berbeda selama makna tepat.'
where level = 10 and slot = 'B2';

update k8_indicators set
  success    = '4 dari 5 benar. Kunci: 4; 4; 4; 5; 5.'
where level = 10 and slot = 'E2';

update k8_indicators set
  success    = 'Minimal 3 kalimat; peristiwa di kalimat 1 terjadi sebelum kalimat 2, dan kalimat 2 sebelum kalimat 3; ketiga kalimat membicarakan topik atau pelaku yang sama; ≤5 kesalahan ejaan dalam 25–40 kata.'
where level = 10 and slot = 'D2';

update k8_indicators set
  method     = 'Tampilkan teks; setelah anak membaca, tanyakan: "Apa yang dirapikan Bima?" dan "Apa saja yang dimasukkan Bima?"',
  material   = 'Bima merapikan tas. Ia memasukkan buku dan pensil. Tas Bima siap dibawa.'
where level = 10 and slot = 'C2';

update k8_indicators set
  success    = '4 dari 5 benar. Kunci: 100 cm; 200 cm; 3 m; 150 cm; 2 m.'
where level = 10 and slot = 'F2';
