-- Membaca, Menulis and Matematika for Fase A (levels 5-8), drafted with the owner on 11 Sep 2026.
-- Fondasi moved from imitating to holding a larger unit; Fase A moves from doing the work to
-- choosing and checking it, so most knots here take the shape of telling two things apart.
update public.curriculum set
  reading_indicators = '["Membaca teks 3–4 kalimat tanpa berhenti lama di tengah kalimat — 4 dari 5 kalimat terbaca utuh.","Menemukan jawaban yang tertulis jelas dalam teks, seperti siapa, kapan, dan di mana — 4 dari 5.","Menunjukkan bagian teks tempat jawabannya berada, bukan menjawab dari ingatan atau pengalaman sendiri — 4 dari 5."]'::jsonb,
  reading_key = 3,
  reading_spiral = 'Level 6 menceritakan kembali isi bacaan. Anak yang menjawab dari pengalaman akan menceritakan versinya sendiri dan bukan isi teksnya. Kebiasaan kembali ke teks inilah yang menopang seluruh fase sampai Fase C.',
  writing_indicators = '["Menulis tiga kalimat yang semuanya tentang satu hal yang sama — 4 dari 5 karangan.","Tiap kalimat berdiri lengkap dengan pelaku dan tindakan — 8 dari 10 kalimat.","Kalimat kedua dan ketiga menambah keterangan baru, bukan mengulang kalimat pertama dengan kata lain — 3 dari 5."]'::jsonb,
  writing_key = 3,
  writing_spiral = 'Level 6 menuntut paragraf yang runtut. Tulisan yang hanya mengulang isi tidak punya bahan untuk dirangkai, karena keruntutan mensyaratkan ada yang bergerak maju.',
  math_indicators = '["Menyatakan bilangan dua angka sebagai puluhan dan satuan, misalnya 47 sama dengan 4 puluhan dan 7 satuan — 4 dari 5.","Menjumlah dan mengurang sampai 100 tanpa menyimpan — 4 dari 5.","Menambah 10 pada sebarang bilangan tanpa menghitung satu per satu, misalnya 37 ditambah 10 menjadi 47 — 4 dari 5."]'::jsonb,
  math_key = 3,
  math_spiral = 'Level 6 masuk ke ribuan dan penyimpanan. Anak yang belum melihat puluhan sebagai satu bundel akan menghitung ulang setiap kali, dan tidak akan pernah memahami apa yang terjadi saat menyimpan.'
where level = 5;

update public.curriculum set
  reading_indicators = '["Menceritakan kembali isi paragraf dengan urutan awal, tengah, dan akhir yang benar — 4 dari 5.","Menyebut kata penanda waktu dalam teks seperti mula-mula, kemudian, dan akhirnya sebagai penunjuk urutan — 3 dari 5.","Menceritakan kembali dengan kalimatnya sendiri, bukan menghafal kalimat teks — 3 dari 5."]'::jsonb,
  reading_key = 3,
  reading_spiral = 'Level 7 menuntut merumuskan gagasan utama. Anak yang menghafal kalimat tidak dapat merangkum, karena yang dipegangnya adalah bunyi kalimat dan bukan maknanya.',
  writing_indicators = '["Kalimat-kalimatnya berurutan masuk akal dan tidak melompat — 4 dari 5 karangan.","Memakai huruf kapital di awal kalimat dan pada nama orang, serta titik di akhir kalimat — 8 dari 10 kalimat.","Memperbaiki sendiri kapital atau titik yang terlewat saat membaca ulang tulisannya — 3 dari 5 karangan."]'::jsonb,
  writing_key = 3,
  writing_spiral = 'Level 7 menuntut memilih detail yang relevan, yaitu menilai tulisan sendiri. Memeriksa ulang adalah pintu menuju menyunting, dan tanpa kebiasaan itu semua level di atasnya mustahil.',
  math_indicators = '["Menyatakan bilangan tiga angka sebagai ratusan, puluhan, dan satuan — 4 dari 5.","Menjumlah dan mengurang sampai 1.000, termasuk yang menyimpan — 4 dari 5.","Menjelaskan apa yang terjadi saat menyimpan, yaitu sepuluh satuan ditukar menjadi satu puluhan, bukan sekadar menulis angka kecil di atas — 3 dari 5."]'::jsonb,
  math_key = 3,
  math_spiral = 'Level 7 memperkenalkan perkalian sebagai kelompok yang sama besar. Penukaran sepuluh adalah pengelompokan yang pertama dikenal anak; tanpa memahaminya, perkalian menjadi hafalan tanpa dasar.'
where level = 6;

update public.curriculum set
  reading_indicators = '["Menyebutkan gagasan utama teks pendek dalam satu kalimat — 4 dari 5.","Menunjukkan dua kalimat yang mendukung gagasan itu — 4 dari 5.","Membedakan gagasan utama dari rincian yang menarik perhatian, yaitu tidak memilih kalimat paling seru sebagai gagasan utama — 3 dari 5."]'::jsonb,
  reading_key = 3,
  reading_spiral = 'Level 8 menyimpulkan sebab dan akibat lintas paragraf. Anak yang tersedot oleh detail yang seru kehilangan rantai sebabnya dan menyimpulkan dari bagian yang paling berkesan, bukan dari yang paling menentukan.',
  writing_indicators = '["Menulis deskripsi satu paragraf dengan minimal tiga detail seperti bentuk, warna, ukuran, bunyi, atau rasa — 4 dari 5.","Detailnya khas benda itu, bukan detail umum yang cocok untuk benda apa saja — 4 dari 5.","Membuang satu detail yang tidak berhubungan ketika diminta memeriksa ulang — 3 dari 5."]'::jsonb,
  writing_key = 3,
  writing_spiral = 'Level 8 menyusun narasi dua paragraf. Memilih apa yang masuk dan apa yang dikeluarkan adalah inti bercerita; tanpa itu, narasi menjadi daftar kejadian.',
  math_indicators = '["Menyatakan perkalian sebagai kelompok yang sama besar, misalnya 3 kali 4 sebagai tiga kelompok berisi empat, dengan benda atau gambar — 4 dari 5.","Membagi benda ke dalam kelompok sama besar dan menyebutkan sisanya bila ada — 4 dari 5.","Menjawab perkalian kecil tanpa menghitung ulang satu per satu, minimal untuk 2, 5, dan 10 — 4 dari 5."]'::jsonb,
  math_key = 3,
  math_spiral = 'Level 8 mengerjakan soal cerita dua langkah. Bila setiap perkalian masih dihitung dari awal, tenaga anak habis di langkah pertama dan langkah kedua tidak terjangkau, persis seperti simpul melanjutkan hitungan di Level 3.'
where level = 7;

update public.curriculum set
  reading_indicators = '["Menyusun urutan kejadian dari teks beberapa paragraf — 4 dari 5.","Menyebutkan sebab dan akibat satu peristiwa dengan menunjuk bukti di dalam teks — 4 dari 5.","Membedakan peristiwa yang terjadi setelah dari peristiwa yang terjadi karena — 3 dari 5."]'::jsonb,
  reading_key = 3,
  reading_spiral = 'Level 9 membedakan fakta dan pendapat serta menjelaskan bukti. Anak yang menganggap urutan waktu sama dengan sebab akan menerima alasan yang keliru sepanjang hidupnya. Level 8 adalah akhir Fase A, jadi kenaikan ke Level 9 melewati ujian sumatif.',
  writing_indicators = '["Menulis narasi dua paragraf yang memiliki awal, tengah, dan akhir yang jelas — 4 dari 5.","Memakai kata penghubung antar paragraf seperti setelah itu atau keesokan harinya — 3 dari 5.","Paragraf kedua melanjutkan paragraf pertama, bukan mengulang ceritanya dari awal — 4 dari 5."]'::jsonb,
  writing_key = 3,
  writing_spiral = 'Level 9 menulis ringkasan dengan kata sendiri, yang menuntut memegang satu keseluruhan sekaligus. Anak yang mengulang cerita dari awal belum memegang keseluruhan itu, melainkan potongan-potongannya. Level 8 adalah akhir Fase A, jadi kenaikan ke Level 9 melewati ujian sumatif.',
  math_indicators = '["Menyelesaikan soal cerita dua langkah dan menuliskan kedua langkahnya — 4 dari 5.","Mengerjakan operasi campuran dengan urutan yang benar, yaitu kali dan bagi lebih dulu — 4 dari 5.","Menentukan sendiri operasi yang dipakai sebelum berhitung, bukan mencoba-coba sampai hasilnya kelihatan benar — 3 dari 5."]'::jsonb,
  math_key = 3,
  math_spiral = 'Level 9 memakai pecahan, pengukuran, dan perkalian dua digit dalam konteks nyata, yang semuanya menuntut memilih operasi pada situasi lebih rumit. Level 8 adalah akhir Fase A, jadi kenaikan ke Level 9 melewati ujian sumatif.'
where level = 8;
