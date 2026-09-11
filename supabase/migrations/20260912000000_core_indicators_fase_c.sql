-- Membaca, Menulis and Matematika for Fase C (levels 13-16), drafted with the owner on 11 Sep 2026.
-- Fase C moves from being willing to change to weighing and deciding for yourself, then answering
-- for the decision: judge by evidence rather than tone, see what a source leaves out, meet an
-- objection, plan a revision, state your assumptions, name the part that is still weak.
-- Level 16 has no level above it, so its note closes the ladder: passing there means Lulus.
update public.curriculum set
  reading_indicators = '["Menyebutkan perspektif yang berbeda dari dua sumber atau lebih tentang satu hal — 4 dari 5.","Menilai alasan mana yang lebih kuat dan menyebutkan dasarnya — 4 dari 5.","Menilai kekuatan alasan dari bukti yang menyertainya, bukan dari seberapa yakin penulisnya terdengar — 3 dari 5."]'::jsonb,
  reading_key = 3,
  reading_spiral = 'Level 14 mengenali bias. Bila nada percaya diri dianggap bukti, bias tidak akan pernah terdeteksi, karena bias paling sering datang justru dengan nada yang paling yakin.',
  writing_indicators = '["Menulis argumen dengan klaim, minimal dua bukti, dan penutup — 4 dari 5.","Menyesuaikan pilihan kata dengan pembaca yang dituju — 4 dari 5.","Menyebutkan satu keberatan yang mungkin muncul dan menjawabnya — 3 dari 5."]'::jsonb,
  writing_key = 3,
  writing_spiral = 'Level 14 menulis laporan berbasis data. Menjawab keberatan melatih menulis untuk pembaca yang tidak otomatis setuju, dan sikap itulah yang membuat laporan diisi data alih-alih kesan.',
  math_indicators = '["Menyelesaikan masalah rasio dan skala dalam konteks nyata — 4 dari 5.","Membaca dan menafsirkan data dari tabel atau diagram — 4 dari 5.","Memeriksa apakah jawabannya masuk akal terhadap situasinya, misalnya jarak pada peta atau besaran persen — 3 dari 5."]'::jsonb,
  math_key = 3,
  math_spiral = 'Level 14 masuk ke masalah multi-langkah. Kesalahan pada langkah pertama terbawa sampai akhir tanpa ketahuan bila kewajaran jawabannya tidak pernah diuji.'
where level = 13;

update public.curriculum set
  reading_indicators = '["Menyusun satu simpulan yang memakai informasi dari minimal dua teks — 4 dari 5.","Memilah fakta, opini, dan bagian yang menunjukkan keberpihakan — 4 dari 5.","Menunjukkan apa yang tidak disebutkan sebuah sumber, bukan hanya menilai yang tertulis — 3 dari 5."]'::jsonb,
  reading_key = 3,
  reading_spiral = 'Level 15 menganalisis sudut pandang. Sudut pandang ditentukan juga oleh apa yang dipilih untuk tidak diceritakan, sehingga anak yang hanya menilai yang tertulis akan melewatkan separuh keputusan penulis.',
  writing_indicators = '["Menulis laporan dengan struktur yang jelas: tujuan, cara, hasil, dan simpulan — 4 dari 5.","Menyajikan data dalam tabel atau daftar dan merujuknya di dalam teks — 4 dari 5.","Menyunting sendiri sebelum menyerahkan, dan dapat menunjukkan apa yang ia ubah — 3 dari 5."]'::jsonb,
  writing_key = 3,
  writing_spiral = 'Level 15 menuntut revisi yang terencana, dan menyunting mandiri adalah bibitnya. Anak yang tidak dapat menyebutkan apa yang ia ubah sebenarnya belum menyunting, melainkan baru membaca ulang.',
  math_indicators = '["Menyelesaikan masalah multi-langkah dan menuliskan tiap langkahnya — 4 dari 5.","Memakai pecahan, desimal, dan bangun dalam satu penyelesaian yang sama — 4 dari 5.","Menemukan sendiri letak kesalahannya ketika hasilnya tidak masuk akal, bukan mengulang semuanya dari awal — 3 dari 5."]'::jsonb,
  math_key = 3,
  math_spiral = 'Level 15 memodelkan. Model selalu perlu diperbaiki, dan memperbaiki menuntut tahu bagian mana yang keliru alih-alih membuang seluruhnya lalu memulai lagi.'
where level = 14;

update public.curriculum set
  reading_indicators = '["Menyebutkan tema teks dan membedakannya dari topik — 4 dari 5.","Menyebutkan sudut pandang siapa yang dipakai dan bagaimana hal itu mempengaruhi isi — 4 dari 5.","Mendukung tiap penafsirannya dengan kutipan atau bagian teks tertentu — 3 dari 5."]'::jsonb,
  reading_key = 3,
  reading_spiral = 'Level 16 mensintesis banyak bacaan. Sintesis tanpa jangkar teks berubah menjadi kesan pribadi yang ditulis rapi.',
  writing_indicators = '["Menulis teks persuasif dengan tujuan yang dinyatakan jelas — 4 dari 5.","Menyertakan bukti yang dapat diperiksa, bukan hanya ajakan — 4 dari 5.","Merencanakan revisi sebelum menulis ulang, yaitu menandai apa yang akan diubah dan mengapa — 3 dari 5."]'::jsonb,
  writing_key = 3,
  writing_spiral = 'Level 16 menuntut karya yang utuh. Karya panjang hanya selesai bila revisinya direncanakan; menunggu ilham menghasilkan tumpukan draf yang tidak pernah jadi.',
  math_indicators = '["Menyatakan hubungan sederhana dengan lambang atau rumus sebagai aljabar awal — 4 dari 5.","Menafsirkan data dan menyatakan peluang kejadian sederhana — 4 dari 5.","Menyatakan asumsi yang dipakai modelnya dan mengakui batasnya — 3 dari 5."]'::jsonb,
  math_key = 3,
  math_spiral = 'Level 16 menghadapi masalah kompleks. Mengetahui batas sebuah model adalah yang memisahkan pemecah masalah dari penghitung.'
where level = 15;

update public.curriculum set
  reading_indicators = '["Menyatukan informasi dari tiga sumber atau lebih menjadi satu pemahaman yang runtut — 4 dari 5.","Menyebutkan sumber untuk tiap bagian penting pemahamannya — 4 dari 5.","Menyampaikan di mana sumber-sumber itu tidak sepakat, tidak meratakannya menjadi satu suara — 3 dari 5."]'::jsonb,
  reading_key = 3,
  reading_spiral = 'Anak yang lulus ujian sumatif akhir Fase C berstatus Lulus dan siap ke SMP. Dalam membaca, artinya ia sanggup menghadapi beberapa sumber sekaligus, menakar mana yang lebih kuat, dan menyampaikan pemahamannya tanpa meratakan perbedaan yang memang ada.',
  writing_indicators = '["Menyelesaikan satu karya utuh dari rencana sampai versi akhir — 4 dari 5.","Karyanya koheren, yaitu tiap bagian menopang tujuan yang sama — 4 dari 5.","Menilai karyanya sendiri dengan kriteria yang jelas dan menyebutkan bagian mana yang masih lemah — 3 dari 5."]'::jsonb,
  writing_key = 3,
  writing_spiral = 'Anak yang lulus ujian sumatif akhir Fase C berstatus Lulus dan siap ke SMP. Dalam menulis, artinya ia sanggup menyelesaikan karya utuh dari rencana sampai versi akhir dan menilai sendiri bagian mana yang masih lemah tanpa menunggu diberi tahu.',
  math_indicators = '["Memilih strategi yang sesuai untuk masalah yang belum pernah ia temui — 4 dari 5.","Memakai estimasi untuk memeriksa hasil akhirnya — 4 dari 5.","Menjelaskan mengapa strategi itu dipilih, dan mengganti strategi bila jalannya buntu — 3 dari 5."]'::jsonb,
  math_key = 3,
  math_spiral = 'Anak yang lulus ujian sumatif akhir Fase C berstatus Lulus dan siap ke SMP. Dalam matematika, artinya ia menghadapi masalah yang belum pernah ditemuinya dengan strategi yang dipilih secara sadar, estimasi sebagai penjaga, dan kesediaan mengganti jalan ketika buntu.'
where level = 16;
