-- Menulis and Matematika, levels 2-4: the rest of Fondasi, drafted with the owner on 11 Sep 2026.
-- Menulis moves coretan -> huruf -> kata -> kalimat; Matematika moves jumlah -> bilangan -> operasi -> strategi.
update public.curriculum set
  writing_indicators = '["Menyalin namanya sendiri dengan urutan huruf yang benar dan dapat dibaca orang lain, pada dua kesempatan.","Menyalin 5 kata pendek dari contoh; hurufnya dikenali guru tanpa perlu menebak — 4 dari 5.","Memulai tiap huruf dari titik yang sama dengan arah yang tetap, bukan menggambar bentuknya dari bawah atau terbalik — 8 dari 10 huruf."]'::jsonb,
  writing_key = 3,
  writing_spiral = 'Level 3 menuntut arah penulisan yang benar. Anak yang menggambar huruf dengan meniru bentuk jadinya bisa terlihat rapi di Level 2, tetapi tulisannya melambat dan berantakan begitu katanya memanjang, karena setiap huruf dibangun ulang dari nol.',
  math_indicators = '["Menghitung sampai 10 benda dengan tepat, tanpa terlewat atau terhitung dua kali — 4 dari 5.","Menyebutkan kelompok mana yang lebih banyak dari dua kumpulan yang selisihnya jelas — 4 dari 5.","Membandingkan dua kelompok yang jumlahnya berdekatan, seperti 7 dan 8, dengan menghitung dan bukan menebak dari besar tumpukannya — 4 dari 5."]'::jsonb,
  math_key = 3,
  math_spiral = 'Level 3 mulai menjumlah. Anak yang masih menilai banyak sedikitnya dari penampakan akan menebak hasil penjumlahan. Indikator ini menguji apakah bilangan sudah mengalahkan tampilan, dan itulah dasar seluruh berhitung sesudahnya.'
where level = 2;

update public.curriculum set
  writing_indicators = '["Menulis 10 huruf yang disebutkan guru tanpa contoh di depan mata, dengan bentuk yang dapat dibaca — 8 dari 10.","Menulis kata dua suku kata dari contoh dengan huruf lengkap, tidak ada huruf yang hilang — 4 dari 5.","Menulis kata sederhana yang didiktekan, tanpa melihat contoh — 3 dari 5."]'::jsonb,
  writing_key = 3,
  writing_spiral = 'Level 4 menulis dua kalimat sendiri. Selama anak masih perlu contoh untuk setiap kata, tidak ada sisa tenaga untuk memikirkan isi kalimat karena habis untuk mengingat bentuk kata.',
  math_indicators = '["Menulis angka 0–20 yang disebut guru dengan bentuk benar dan tidak terbalik — 8 dari 10.","Menyelesaikan penjumlahan konkret sampai 10 dengan benda — 4 dari 5.","Menjumlah dengan melanjutkan hitungan dari bilangan yang lebih besar, misalnya 5 + 3 menjadi enam, tujuh, delapan, bukan menghitung ulang semuanya dari satu — 3 dari 5."]'::jsonb,
  math_key = 3,
  math_spiral = 'Level 4 menambah sampai 20. Anak yang selalu mengulang hitungan dari satu kehabisan jari dan waktu begitu melewati 10; melanjutkan hitungan adalah pintunya.'
where level = 3;

update public.curriculum set
  writing_indicators = '["Menulis dua kalimat sendiri tentang satu gambar atau pengalaman, tiap kalimat minimal 3 kata.","Memberi spasi antar kata sehingga tiap kata terpisah jelas — 8 dari 10 kata.","Menutup tiap kalimat dengan titik dan memulainya dengan huruf kapital tanpa diingatkan, dua kalimat berturut-turut pada dua kesempatan."]'::jsonb,
  writing_key = 3,
  writing_spiral = 'Level 5 menulis paragraf tiga kalimat. Anak yang tidak menandai batas kalimat akan menulis paragraf sebagai satu untaian tanpa henti, dan gurunya tidak dapat menilai isinya. Level 4 adalah akhir Fase Fondasi, jadi kenaikan ke Level 5 melewati ujian sumatif.',
  math_indicators = '["Menyelesaikan tambah dan kurang sampai 20 dengan benda atau gambar — 4 dari 5.","Menjelaskan cara memperoleh jawabannya dengan kata atau peragaan, bukan hanya menyebut hasilnya — 4 dari 5.","Memakai strategi selain menghitung satu per satu, misalnya pasangan sepuluh ketika 8 + 5 dikerjakan sebagai 8 + 2 + 3 — minimal 2 dari 5 soal."]'::jsonb,
  math_key = 3,
  math_spiral = 'Level 5 masuk ke nilai tempat puluhan. Anak yang hanya menghitung satuan tidak punya dasar untuk melihat sepuluh sebagai satu bundel, dan tanpa itu nilai tempat hanya menjadi hafalan posisi. Level 4 adalah akhir Fase Fondasi, jadi kenaikan ke Level 5 melewati ujian sumatif.'
where level = 4;
