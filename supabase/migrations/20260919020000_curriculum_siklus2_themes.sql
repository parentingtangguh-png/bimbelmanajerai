-- Konten tema siklus 2 (nomor 9–16) menggantikan placeholder.
-- UPDATE k8_themes: name, description, objects, vocabulary, character, illustration.
-- INSERT k8_theme_english: 5 noun + 4 phrase per tema (72 baris).
-- Nama subtema (k8_subthemes) tidak diubah.

UPDATE k8_themes SET
  name        = 'Manajemen Rumah Mandiri',
  description = 'Tema ini memakai pengaturan ruang dan jadwal harian sebagai konteks membaca instruksi, menulis catatan tugas, menghitung jumlah benda, dan membangun tanggung jawab pribadi. Benda nyata dipakai untuk latihan menata, mengurutkan, membandingkan, dan menjelaskan alasan pilihan.',
  objects     = 'map plastik, kotak arsip, gantungan kunci, jam meja, keranjang kain, sikat kecil, pengki mini, botol semprot kosong, alas gelas, penjepit pakaian, wadah alat.',
  vocabulary  = 'jadwal, prioritas, kebersihan, kerapian, tanggung jawab, ruangan, perlengkapan, urutan, selesai, tertunda, memeriksa, menata.',
  character   = 'menyelesaikan tugas beres-beres sampai tuntas, mengakui bila lupa mengembalikan barang, membantu teman menata alat tanpa diminta, memberi saran dengan sopan, menjaga benda kelas agar tidak rusak.',
  illustration = 'Anak L9 dapat membaca kata berimbuhan seperti menata dan membereskan serta menghitung 125 penjepit secara nilai tempat; anak L13 dapat membaca kata instruksi dan menghitung kebutuhan wadah dengan perkalian 2 digit; anak L17 dapat menjelaskan rujukan kata "alat itu" dalam teks aturan kelas dan menghitung operasi campuran jadwal tugas.'
WHERE number = 9;

UPDATE k8_themes SET
  name        = 'Perdagangan dan Pilihan Bijak',
  description = 'Tema ini memakai situasi pasar sebagai konteks membandingkan kualitas, jumlah, harga sederhana, dan keputusan membeli secara bijak. Benda nyata membantu anak membaca label buatan guru, mengelompokkan barang, menghitung, dan memberi alasan pilihan.',
  objects     = 'wortel, tomat, mentimun, jeruk, pisang, salak, mangkuk plastik, keranjang anyam, kantong kain, timbangan dapur, karet gelang, dompet kain.',
  vocabulary  = 'kualitas, harga, jumlah, timbang, pilihan, kebutuhan, persediaan, segar, layak, hemat, menawar, transaksi.',
  character   = 'jujur saat menghitung jumlah barang, antre ketika memilih benda, menghargai pilihan teman, tidak mengambil barang sebelum izin, menyampaikan alasan membeli dengan sopan.',
  illustration = 'Anak L9 dapat membaca kata membeli dan berjualan serta menentukan ratusan-puluhan-satuan pada 245; anak L13 dapat membaca kata transaksi dan menghitung 24 x 15 sebagai jumlah barang; anak L17 dapat menemukan kata rujukan dalam paragraf tentang pembeli dan menyelesaikan operasi campuran harga.'
WHERE number = 10;

UPDATE k8_themes SET
  name        = 'Ekologi Kebun Mini',
  description = 'Tema ini memakai tanaman, biji, dan perawatan kebun kecil sebagai konteks mengamati perubahan, membaca istilah sains sederhana, mengukur pertumbuhan, dan menulis hasil pengamatan. Benda nyata dipakai untuk membandingkan bentuk, ukuran, fungsi, dan urutan perawatan.',
  objects     = 'biji kacang hijau, biji jagung, tanah kering, sekop mini, sarung tangan, sprayer kosong, penggaris kayu, nampan semai, tali rafia, label kayu polos, daun kering, kerikil kecil.',
  vocabulary  = 'tunas, akar, batang, daun, tumbuh, lembap, subur, pengamatan, perubahan, ukuran, perawatan, lingkungan.',
  character   = 'teliti mencatat perubahan tanaman, sabar menunggu hasil pengamatan, berbagi alat berkebun, bertanggung jawab merawat giliran sendiri, tidak merusak hasil kerja teman.',
  illustration = 'Anak L9 dapat membaca kata menanam dan bertunas serta menentukan nilai tempat angka 318; anak L13 dapat membaca kata struktur dan menghitung 16 x 24 biji dalam nampan; anak L17 dapat mengenali kohesi kata tanaman-tunas-daun dan menghitung operasi campuran data pertumbuhan.'
WHERE number = 11;

UPDATE k8_themes SET
  name        = 'Gizi dan Sajian Seimbang',
  description = 'Tema ini memakai bahan makan, alat saji, rasa, dan pengaturan meja sebagai konteks membaca prosedur, mengukur jumlah, membandingkan data, dan menulis deskripsi. Benda nyata digunakan untuk mengelompokkan, menjelaskan fungsi, dan melatih kebiasaan tertib saat makan bersama.',
  objects     = 'piring plastik, sendok, garpu, mangkuk, serbet kertas, wortel, bayam, tahu, tempe, jagung, nampan, gelas kosong.',
  vocabulary  = 'gizi, sajian, porsi, bahan, tekstur, rasa, gurih, renyah, lembut, seimbang, menyiapkan, menyajikan.',
  character   = 'mencuci tangan sebelum kegiatan makan, menunggu giliran mengambil alat, menghargai makanan yang tersedia, berbagi tugas menyiapkan meja, membersihkan tempat setelah selesai.',
  illustration = 'Anak L9 dapat membaca kata menyiapkan dan berbagi serta menghitung 136 sendok menurut nilai tempat; anak L13 dapat membaca kata tekstur dan menghitung 18 x 12 porsi kecil; anak L17 dapat menautkan kata bahan-sajian-porsi dalam teks dan menghitung operasi campuran jumlah alat.'
WHERE number = 12;

UPDATE k8_themes SET
  name        = 'Transportasi dan Keselamatan Jalan',
  description = 'Tema ini memakai kendaraan, miniatur jalan, dan tanda buatan guru sebagai konteks membaca petunjuk, memahami arah, menghitung jarak, dan menulis urutan perjalanan. Benda nyata membantu anak mempraktikkan rute, giliran, dan keputusan aman.',
  objects     = 'mobil mainan, bus mainan, truk mainan, sepeda mini, rambu kayu polos, tali pembatas, balok jembatan, papan jalan polos, kerucut kecil, peluit, helm mainan, pita ukur.',
  vocabulary  = 'kendaraan, rute, jarak, arah, belok, berhenti, aman, jembatan, persimpangan, penumpang, petunjuk, perjalanan.',
  character   = 'menunggu giliran menjalankan kendaraan mainan, mengikuti aturan rute, mengingatkan teman dengan sopan, tidak berebut alat, mengakui bila melanggar tanda jalan.',
  illustration = 'Anak L9 dapat membaca kata berjalan dan berhenti serta menentukan nilai tempat 402; anak L13 dapat membaca kata transportasi dan menghitung 23 x 14 jarak satuan; anak L17 dapat mengenali rujukan "kendaraan tersebut" dalam teks dan menghitung operasi campuran rute.'
WHERE number = 13;

UPDATE k8_themes SET
  name        = 'Adab Ruang Bersama',
  description = 'Tema ini memakai situasi masuk ruangan, kebersihan, perlengkapan ibadah, dan berbagi alat sebagai konteks komunikasi sopan, tanggung jawab, dan pengambilan keputusan. Benda nyata dipakai untuk latihan aturan kelas, urutan tindakan, dan refleksi kebiasaan baik.',
  objects     = 'sajadah kecil, peci, mukena anak, tasbih kayu, sandal bersih, kotak amal tiruan, tempat tisu, sikat meja, keranjang alat, alas duduk, gantungan nama, jam meja.',
  vocabulary  = 'adab, izin, salam, tertib, giliran, hormat, perlengkapan, ibadah, bersama, sopan, peduli, tanggung jawab.',
  character   = 'mengucap salam saat masuk ruangan, meminta izin sebelum memakai barang teman, menjaga perlengkapan ibadah tetap rapi, memberi giliran kepada teman, menegur dengan bahasa sopan.',
  illustration = 'Anak L9 dapat membaca kata bersalaman dan menolong serta menghitung 256 benda menurut nilai tempat; anak L13 dapat membaca kata organisasi dan menghitung 15 x 16 giliran tugas; anak L17 dapat menganalisis pengulangan kata adab dalam teks dan menghitung operasi campuran jadwal piket.'
WHERE number = 14;

UPDATE k8_themes SET
  name        = 'Cuaca dan Lingkungan Sekitar',
  description = 'Tema ini memakai panas, teduh, hujan, angin, dan benda alam sebagai konteks mengamati gejala sekitar, membaca kosakata sains, mengukur sederhana, dan menafsirkan data. Benda nyata membantu anak membandingkan keadaan dan menjelaskan sebab-akibat.',
  objects     = 'payung kecil, kipas tangan, jas hujan anak, topi, termometer mainan, batu kecil, daun kering, pasir kering, kompas mainan, pita kain, botol kosong, wadah bening.',
  vocabulary  = 'cuaca, teduh, kering, lembap, angin, suhu, gerak, arah, berubah, pengamatan, perkiraan, lingkungan.',
  character   = 'peduli pada teman saat cuaca tidak nyaman, menjaga alat pengamatan, tidak mengejek jawaban perkiraan teman, melaporkan hasil dengan jujur, bekerja sama saat mengamati.',
  illustration = 'Anak L9 dapat membaca kata berteduh dan mengering serta menentukan nilai tempat 579; anak L13 dapat membaca kata ekspresi dalam laporan cuaca dan menghitung 32 x 11 data pengamatan; anak L17 dapat menautkan kata cuaca-suhu-angin dalam paragraf dan menghitung operasi campuran perubahan suhu.'
WHERE number = 15;

UPDATE k8_themes SET
  name        = 'Kesehatan dan Energi Tubuh',
  description = 'Tema ini memakai gerak tubuh, kebersihan diri, istirahat, dan rutinitas sehat sebagai konteks membaca prosedur, mengukur waktu, mengolah data kebiasaan, dan menulis refleksi. Benda nyata digunakan untuk mempraktikkan urutan tindakan dan pilihan sehat.',
  objects     = 'sikat gigi baru, sisir, handuk kecil, sabun batang, jam pasir, botol minum kosong, kotak bekal kosong, gelang olahraga, tali skipping, matras kecil, tisu, cermin kecil.',
  vocabulary  = 'kesehatan, energi, gerak, istirahat, kebiasaan, bersih, kuat, lentur, rutin, pulih, menjaga, seimbang.',
  character   = 'menjaga kebersihan diri tanpa disuruh, menghargai kemampuan gerak teman, beristirahat saat tubuh lelah, menyelesaikan rutinitas sehat, memberi contoh kebiasaan baik.',
  illustration = 'Anak L9 dapat membaca kata menjaga dan bergerak serta menentukan nilai tempat 684; anak L13 dapat membaca kata aktivitas dan menghitung 21 x 13 menit latihan; anak L17 dapat mengenali rujukan kebiasaan sehat dalam teks dan menghitung operasi campuran jadwal aktivitas.'
WHERE number = 16;

-- English tema 9: Manajemen Rumah Mandiri
-- (box/basket/cap sudah terpakai di T1/T2/T6 → folder/hanger/hook)
INSERT INTO k8_theme_english (theme, kind, position, text, requestable) VALUES
  (9, 'noun',   1, 'folder',      true),
  (9, 'noun',   2, 'hanger',      true),
  (9, 'noun',   3, 'clock',       true),
  (9, 'noun',   4, 'spray',       true),
  (9, 'noun',   5, 'hook',        true),
  (9, 'phrase', 1, 'open folder', false),
  (9, 'phrase', 2, 'hang hanger', false),
  (9, 'phrase', 3, 'check clock', false),
  (9, 'phrase', 4, 'fill spray',  false);

-- English tema 10: Perdagangan dan Pilihan Bijak
-- (tomato/basket sudah T2 → mango/coin/scale)
INSERT INTO k8_theme_english (theme, kind, position, text, requestable) VALUES
  (10, 'noun',   1, 'carrot',      true),
  (10, 'noun',   2, 'mango',       true),
  (10, 'noun',   3, 'scale',       true),
  (10, 'noun',   4, 'wallet',      true),
  (10, 'noun',   5, 'coin',        true),
  (10, 'phrase', 1, 'pick carrot', false),
  (10, 'phrase', 2, 'weigh mango', false),
  (10, 'phrase', 3, 'open wallet', false),
  (10, 'phrase', 4, 'count coin',  false);

-- English tema 11: Ekologi Kebun Mini
-- (seed/tray sudah T3 → leaf/gravel/sprout)
INSERT INTO k8_theme_english (theme, kind, position, text, requestable) VALUES
  (11, 'noun',   1, 'glove',       true),
  (11, 'noun',   2, 'ruler',       true),
  (11, 'noun',   3, 'leaf',        true),
  (11, 'noun',   4, 'gravel',      true),
  (11, 'noun',   5, 'sprout',      true),
  (11, 'phrase', 1, 'wear glove',  false),
  (11, 'phrase', 2, 'use ruler',   false),
  (11, 'phrase', 3, 'touch leaf',  false),
  (11, 'phrase', 4, 'pick sprout', false);

-- English tema 12: Gizi dan Sajian Seimbang
-- (plate/spoon/bowl/tray sudah T3/T4 → fork/napkin/mug/lid/ladle)
INSERT INTO k8_theme_english (theme, kind, position, text, requestable) VALUES
  (12, 'noun',   1, 'fork',        true),
  (12, 'noun',   2, 'napkin',      true),
  (12, 'noun',   3, 'mug',         true),
  (12, 'noun',   4, 'lid',         true),
  (12, 'noun',   5, 'ladle',       true),
  (12, 'phrase', 1, 'lift fork',   false),
  (12, 'phrase', 2, 'fold napkin', false),
  (12, 'phrase', 3, 'fill mug',    false),
  (12, 'phrase', 4, 'close lid',   false);

-- English tema 13: Transportasi dan Keselamatan Jalan
-- (car/truck/bridge/helmet sudah T5 → bus/bike/cone/whistle/flag)
INSERT INTO k8_theme_english (theme, kind, position, text, requestable) VALUES
  (13, 'noun',   1, 'bus',        true),
  (13, 'noun',   2, 'bike',       true),
  (13, 'noun',   3, 'cone',       true),
  (13, 'noun',   4, 'whistle',    true),
  (13, 'noun',   5, 'flag',       true),
  (13, 'phrase', 1, 'stop bus',   false),
  (13, 'phrase', 2, 'ride bike',  false),
  (13, 'phrase', 3, 'move cone',  false),
  (13, 'phrase', 4, 'wave flag',  false);

-- English tema 14: Adab Ruang Bersama
-- (cap/basket sudah T2/T6 → mat/tissue/gown/slipper/badge)
INSERT INTO k8_theme_english (theme, kind, position, text, requestable) VALUES
  (14, 'noun',   1, 'mat',         true),
  (14, 'noun',   2, 'tissue',      true),
  (14, 'noun',   3, 'gown',        true),
  (14, 'noun',   4, 'slipper',     true),
  (14, 'noun',   5, 'badge',       true),
  (14, 'phrase', 1, 'fold mat',    false),
  (14, 'phrase', 2, 'take tissue', false),
  (14, 'phrase', 3, 'wear gown',   false),
  (14, 'phrase', 4, 'put slipper', false);

-- English tema 15: Cuaca dan Lingkungan Sekitar
-- (umbrella/fan sudah T7 → hat/compass/thermometer/stone/sand)
INSERT INTO k8_theme_english (theme, kind, position, text, requestable) VALUES
  (15, 'noun',   1, 'hat',               true),
  (15, 'noun',   2, 'compass',           true),
  (15, 'noun',   3, 'thermometer',       true),
  (15, 'noun',   4, 'stone',             true),
  (15, 'noun',   5, 'sand',              true),
  (15, 'phrase', 1, 'wear hat',          false),
  (15, 'phrase', 2, 'hold compass',      false),
  (15, 'phrase', 3, 'read thermometer',  false),
  (15, 'phrase', 4, 'touch stone',       false);

-- English tema 16: Kesehatan dan Energi Tubuh
-- (brush/comb/towel/soap sudah T8 → mirror/timer/lunchbox/bracelet/headband)
INSERT INTO k8_theme_english (theme, kind, position, text, requestable) VALUES
  (16, 'noun',   1, 'mirror',          true),
  (16, 'noun',   2, 'timer',           true),
  (16, 'noun',   3, 'lunchbox',        true),
  (16, 'noun',   4, 'bracelet',        true),
  (16, 'noun',   5, 'headband',        true),
  (16, 'phrase', 1, 'look mirror',     false),
  (16, 'phrase', 2, 'set timer',       false),
  (16, 'phrase', 3, 'open lunchbox',   false),
  (16, 'phrase', 4, 'wear headband',   false);
