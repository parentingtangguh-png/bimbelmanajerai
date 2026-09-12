-- Matematika: indikator dan simpul spiral level 6-14 dipasang ke tujuan levelnya sendiri.
--
-- Ditemukan saat smoke test 12 Sep 2026. Kartu evaluasi Level 6 menampilkan tujuan "tambah-kurang
-- sampai 100" tetapi indikator "menjumlah dan mengurang sampai 1.000" — isi Level 7. Pergeserannya
-- berjalan sampai Level 14 dengan jarak yang tidak seragam; Level 1-5, 15, dan 16 sudah benar, dan
-- bidang lain (Membaca, Menulis, IPAS, Menyimak, Berbicara) tidak terkena.
--
-- Akibatnya nyata: guru menilai anak dengan kriteria satu tingkat terlalu sulit, dan simpul spiral
-- berbintang menunjuk hal yang belum menjadi tujuan level itu, sehingga anak bisa tertahan naik.
--
-- Teks simpul spiral lama ikut meleset (simpul Level 6 menyebut "Level 7 memperkenalkan perkalian",
-- padahal perkalian adalah tujuan Level 8), jadi keduanya diganti bersamaan.

update public.curriculum set
  math_indicators='["Menyelesaikan tambah dan kurang sampai 100, termasuk yang menyimpan dan meminjam — 4 dari 5.","Menjelaskan strateginya dengan benda, gambar, atau simbol, bukan hanya menyebut hasilnya — 4 dari 5.","Menukar sepuluh satuan menjadi satu puluhan dan sebaliknya saat menyimpan atau meminjam, lalu menyebut penukaran itu — 4 dari 5."]'::jsonb,
  math_key=3,
  math_spiral='Level 7 memperluas nilai tempat sampai 1.000. Penukaran sepuluh satuan menjadi satu puluhan adalah aturan yang sama yang nanti berlaku antara puluhan dan ratusan; tanpa menyadarinya, ratusan hanya menjadi kolom baru yang dihafal.'
where level=6;

update public.curriculum set
  math_indicators='["Menyatakan bilangan tiga angka sebagai ratusan, puluhan, dan satuan, misalnya 465 sama dengan 4 ratusan, 6 puluhan, dan 5 satuan — 4 dari 5.","Mengukur panjang benda dengan penggaris dalam sentimeter dan membaca data pada diagram gambar — 4 dari 5.","Menghitung lompat sepuluh dan lima dari sebarang bilangan, misalnya 35, 45, 55 — 4 dari 5."]'::jsonb,
  math_key=3,
  math_spiral='Level 8 memperkenalkan perkalian sebagai penjumlahan berulang. Menghitung lompat adalah penjumlahan berulang yang belum diberi nama; anak yang sudah lancar melompat tinggal mengenali bahwa tiga lompatan empat adalah tiga kali empat.'
where level=7;

update public.curriculum set
  math_indicators='["Menyatakan perkalian sebagai kelompok yang sama besar, misalnya 3 kali 4 sebagai tiga kelompok berisi empat, dengan benda atau gambar — 4 dari 5.","Membagi benda ke dalam kelompok sama besar dan menyebutkan sisanya bila ada — 4 dari 5.","Menjawab perkalian kecil tanpa menghitung ulang satu per satu, minimal untuk 2, 5, dan 10 — 4 dari 5."]'::jsonb,
  math_key=3,
  math_spiral='Level 9 menuntut fakta perkalian dan pembagian yang siap pakai untuk soal uang dan pengukuran. Bila setiap perkalian masih dihitung dari awal, tenaga anak habis sebelum sampai ke pertanyaan yang sesungguhnya. Level 8 adalah akhir Fase A, jadi kenaikan ke Level 9 melewati ujian sumatif.'
where level=8;

update public.curriculum set
  math_indicators='["Menjawab fakta perkalian dan pembagian sampai 10 kali 10 tanpa menghitung ulang — 4 dari 5.","Menyelesaikan soal uang atau pengukuran satu langkah dan menuliskan operasi yang dipilihnya — 4 dari 5.","Membagi satu benda atau satu kumpulan menjadi bagian yang sama besar lalu menyebut satu bagiannya sebagai seperdua, sepertiga, atau seperempat — 4 dari 5."]'::jsonb,
  math_key=3,
  math_spiral='Level 10 membandingkan pecahan berpembilang satu. Perbandingan itu hanya masuk akal bila bagiannya benar-benar sama besar; tanpa gagasan bagian yang sama, seperempat dan sepertiga cuma dua angka yang diadu.'
where level=9;

update public.curriculum set
  math_indicators='["Membandingkan dua pecahan berpembilang satu, misalnya sepertiga dan seperlima, dengan gambar atau benda dan menjelaskan mana yang lebih besar — 4 dari 5.","Menyelesaikan soal cerita dua langkah dan menuliskan kedua langkahnya — 4 dari 5.","Menyebut bilangan sampai 10.000 menurut nilai tempatnya dan membandingkan dua di antaranya — 4 dari 5."]'::jsonb,
  math_key=3,
  math_spiral='Level 11 bekerja dengan bilangan sampai 10.000. Membandingkan pecahan melatih anak melihat nilai, bukan angka; kebiasaan yang sama dipakai saat menimbang 4.070 dan 4.700, yang berbeda jauh meski tersusun dari angka yang mirip.'
where level=10;

update public.curriculum set
  math_indicators='["Membaca, menulis, dan mengurutkan bilangan sampai 10.000 menurut nilai tempatnya — 4 dari 5.","Menyelesaikan tambah dan kurang sampai 1.000 dengan cara yang lebih singkat daripada menghitung satu per satu — 4 dari 5.","Memilih bentuk bilangan yang memudahkan, misalnya mengerjakan 398 ditambah 247 sebagai 400 ditambah 247 lalu dikurangi 2 — minimal 2 dari 5 soal."]'::jsonb,
  math_key=3,
  math_spiral='Level 12 menghubungkan pecahan senilai, desimal, dan persen sebagai satu nilai yang sama. Memilih bentuk bilangan yang paling memudahkan adalah latihan pertama melihat satu nilai dalam beberapa wajah.'
where level=11;

update public.curriculum set
  math_indicators='["Menunjukkan dua pecahan senilai dengan gambar atau pembagian yang sama besar — 4 dari 5.","Menyatakan satu nilai dalam bentuk pecahan, desimal, dan persen, misalnya seperdua, 0,5, dan 50 persen — 4 dari 5.","Menyajikan data sederhana dalam tabel atau diagram batang lalu menyebut satu hal yang terbaca darinya — 4 dari 5."]'::jsonb,
  math_key=3,
  math_spiral='Level 13 mengerjakan operasi pecahan dan desimal dalam masalah sehari-hari serta mengenali pola bilangan. Membaca apa yang dikatakan sebuah tabel melatih anak mencari keteraturan, dan pola bilangan adalah keteraturan yang sama pada barisan angka. Level 12 adalah akhir Fase B, jadi kenaikan ke Level 13 melewati ujian sumatif.'
where level=12;

update public.curriculum set
  math_indicators='["Menjumlah dan mengurang pecahan atau desimal dalam masalah sehari-hari, misalnya takaran dan harga — 4 dari 5.","Melanjutkan pola bilangan dan menyebutkan aturannya dengan kata-kata — 4 dari 5.","Menyatakan hubungan dua besaran sebagai perbandingan, misalnya dua gelas air untuk satu gelas sirup — 4 dari 5."]'::jsonb,
  math_key=3,
  math_spiral='Level 14 masuk ke rasio dan skala. Perbandingan dua besaran yang dinyatakan dengan kata adalah rasio yang belum diberi lambang; anak yang sudah terbiasa mengucapkannya tinggal menuliskannya.'
where level=13;

update public.curriculum set
  math_indicators='["Menyelesaikan masalah rasio dan skala dalam konteks nyata, misalnya denah atau resep — 4 dari 5.","Menentukan keliling dan luas bangun datar serta menyebut sifat bangun yang dipakainya — 4 dari 5.","Memeriksa kewajaran jawaban dengan perkiraan sebelum menerima hasil hitungan — minimal 2 dari 5 soal."]'::jsonb,
  math_key=3,
  math_spiral='Level 15 menganalisis data, peluang, dan kalimat matematika dengan nilai belum diketahui. Di wilayah itu jawaban yang keliru sering tetap terlihat rapi; perkiraan adalah penjaga yang membuat anak curiga sebelum menerima hasil.'
where level=14;
