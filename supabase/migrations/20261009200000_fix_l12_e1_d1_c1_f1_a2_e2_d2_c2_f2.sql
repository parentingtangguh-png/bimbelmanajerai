-- Perbaikan audit L12: E1 (selaraskan cara uji + kunci), D1 (kerangka konkret),
-- C1 (kunci kalimat per unsur), F1 (kunci kotak), A2 (operasionalkan intonasi),
-- E2 (kunci), D2 (operasionalkan kriteria urutan), C2 (teks inline), F2 (kunci).

-- E1 L12: selaraskan cara uji dengan 5 pecahan di bahan; tambahkan kunci arti per pecahan
update k8_indicators
  set method   = 'Guru berkata: "Sebutkan nama dan arti masing-masing pecahan ini."',
      success  = '4 dari 5 respons benar. Kunci: 1/2 = setengah (1 bagian dari 2); 1/3 = sepertiga (1 bagian dari 3); 1/4 = seperempat (1 bagian dari 4); 2/4 = dua perempat atau setengah; 3/4 = tiga perempat.'
  where level = 12 and number = 3 and slot = 'E1';

-- D1 L12: cantumkan kerangka konkret di bahan (bukan hanya "3 poin")
update k8_indicators
  set material = 'Kerangka di papan: Awal → Rani lupa membawa pensil ke sekolah. Tengah → Rani meminjam pensil dari teman. Akhir → Rani berterima kasih dan mengembalikan pensil. Model tetap terlihat.'
  where level = 12 and number = 4 and slot = 'D1';

-- C1 L12: tambahkan kunci kalimat mana yang dianggap awal/tengah/akhir
update k8_indicators
  set success  = 'Paling banyak 3 kesalahan kata, serta anak menunjuk 3 dari 3 unsur urutan dengan benar: kejadian awal, kejadian tengah, dan kejadian akhir. Kunci: awal = kalimat 1 (Siti lupa membawa pensil); tengah = kalimat 2 (meminjam pensil kepada Dina); akhir = kalimat 3 atau 4 (mengembalikan pensil / Dina senang).'
  where level = 12 and number = 5 and slot = 'C1';

-- F1 L12: tambahkan kunci jumlah kotak per bangun
update k8_indicators
  set success  = '3 dari 4 bangun dihitung atau dibandingkan benar. Kunci: A = 6 kotak; B = 8 kotak; C = 9 kotak; D = 5 kotak.'
  where level = 12 and number = 6 and slot = 'F1';

-- A2 L12: operasionalkan "intonasi tanya dan seru sesuai"
update k8_indicators
  set success  = 'Maksimal 4 kesalahan kata; pada kalimat tanya suara naik di akhir atau intonasi berbeda dari kalimat pernyataan; pada kalimat seru suara lebih tegas atau lebih keras dibanding kalimat pernyataan; jeda akhir kalimat benar.'
  where level = 12 and number = 7 and slot = 'A2';

-- E2 L12: tambahkan kunci untuk 5 soal
update k8_indicators
  set success  = '4 dari 5 benar. Kunci: 2/5 < 4/5; 3/8 > 1/8; urutan: 1/6, 3/6, 5/6; 2/7+3/7 = 5/7; 4/9+2/9 = 6/9.'
  where level = 12 and number = 9 and slot = 'E2';

-- D2 L12: operasionalkan "memuat awal, tengah, akhir" dan "urutan waktu dapat diikuti"
update k8_indicators
  set success  = 'Minimal 6 kalimat; kalimat pertama atau kedua menceritakan bagian awal (sebelum kejadian utama); setidaknya dua kalimat berikutnya menceritakan kejadian utama; kalimat terakhir menceritakan bagian akhir atau hasil; ≤7 kesalahan ejaan per 80 kata; ≤4 kesalahan kapital/tanda baca.'
  where level = 12 and number = 10 and slot = 'D2';

-- C2 L12: cantumkan teks langsung (tidak cross-reference ke C1 L12)
update k8_indicators
  set material = 'Pagi itu, Siti lupa membawa pensil. Ia meminjam pensil kepada Dina. Setelah selesai menulis, Siti mengembalikan pensil itu. Dina senang karena barangnya dijaga.'
  where level = 12 and number = 11 and slot = 'C2';

-- F2 L12: tambahkan kunci untuk 5 soal
update k8_indicators
  set success  = '4 dari 5 benar. Kunci: persegi 5 cm = 25 cm²; persegi 7 cm = 49 cm²; persegi panjang 8×3 = 24 cm²; persegi panjang 10×4 = 40 cm²; meja 6×5 = 30 cm².'
  where level = 12 and number = 12 and slot = 'F2';
