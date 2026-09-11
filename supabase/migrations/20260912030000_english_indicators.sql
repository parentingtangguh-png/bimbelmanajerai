-- English Exposure, levels 2-16. This strand is enrichment: it never gates a level and never carries
-- a starred knot (english_key stays 0), so the indicators stay observable inside themed activities
-- rather than becoming another hurdle. What is aimed at is not fluency but a child who is not afraid
-- to use another language to say something they understand.
update public.curriculum set
  english_indicators = '["Menunjuk atau mengambil benda yang benar untuk 3–5 kosakata tema — 4 dari 5.","Merespons dengan gerak saat mendengar kata yang sudah dikenal, tanpa perlu diterjemahkan.","Ikut serta sampai kegiatan selesai tanpa menarik diri, pada dua kesempatan."]'::jsonb,
  english_spiral = 'Level 3 mulai merangkai dua kata. Pada tahap ini yang dibangun lebih dulu adalah rasa aman, karena anak yang menolak kegiatan tidak akan mendengar apa pun.'
where level = 2;

update public.curriculum set
  english_indicators = '["Menggunakan frasa dua kata terkait tema, misalnya big ball atau my book — 4 dari 5.","Menirukan frasa baru dengan pelafalan yang dikenali guru.","Memakai frasa itu di luar saat diajarkan, misalnya ketika bermain."]'::jsonb,
  english_spiral = 'Level 4 menambahkan instruksi kelas dan ungkapan tematik. Frasa yang hanya muncul saat dilatih belum menjadi milik anak; yang dipakai sendiri itulah yang bertahan.'
where level = 3;

update public.curriculum set
  english_indicators = '["Mengikuti satu instruksi kelas seperti sit down atau line up tanpa contoh gerak — 4 dari 5.","Mengucapkan satu ungkapan tematik pada saat yang tepat.","Bertanya arti kata yang tidak dipahaminya."]'::jsonb,
  english_spiral = 'Level 5 masuk ke pola tanya jawab dalam permainan. Anak yang berani bertanya arti akan tumbuh jauh lebih cepat daripada yang diam lalu menebak.'
where level = 4;

update public.curriculum set
  english_indicators = '["Menjawab pertanyaan berpola tetap seperti what is this diikuti it is a — 4 dari 5.","Mengajukan pertanyaan berpola tetap kepada temannya dalam permainan.","Melanjutkan permainan meski salah, tanpa berhenti."]'::jsonb,
  english_spiral = 'Level 6 memperpanjangnya menjadi dialog terpandu. Kesediaan melanjutkan meski salah adalah syaratnya, sebab dialog berhenti bila setiap kekeliruan dianggap kegagalan.'
where level = 5;

update public.curriculum set
  english_indicators = '["Memakai 5–7 kosakata tema dalam satu dialog terpandu — 4 dari 5.","Memakai dua ungkapan tematik pada giliran yang tepat.","Menjaga percakapan tetap berjalan dengan isyarat sederhana seperti yes, okay, atau again."]'::jsonb,
  english_spiral = 'Level 7 meminta deskripsi satu sampai dua kalimat. Kosakata yang sudah dipakai dalam percakapan jauh lebih siap dipakai untuk menjelaskan daripada kosakata yang hanya dihafal.'
where level = 6;

update public.curriculum set
  english_indicators = '["Mendeskripsikan benda tema dalam satu sampai dua kalimat — 4 dari 5.","Memakai kata sifat sederhana seperti big, small, atau red dengan tepat.","Menyusun kalimat dengan urutan kata yang dapat dipahami, meski belum sempurna."]'::jsonb,
  english_spiral = 'Level 8 menuntut dialog tiga sampai empat giliran, dan kalimat yang sanggup berdiri sendiri adalah bahan bagi tiap giliran itu.'
where level = 7;

update public.curriculum set
  english_indicators = '["Melakukan dialog tema tiga sampai empat giliran — 4 dari 5.","Menanggapi jawaban lawan bicara, bukan mengulang pertanyaannya.","Memakai ungkapan penyambung sederhana seperti and you atau really."]'::jsonb,
  english_spiral = 'Level 9 berpindah ke teks. Anak yang sudah terbiasa menangkap giliran lawan bicara lebih siap menangkap isi bacaan.'
where level = 8;

update public.curriculum set
  english_indicators = '["Menemukan informasi yang disebut langsung dalam teks tematik pendek — 4 dari 5.","Menebak makna kata baru dari gambar atau konteks.","Menandai bagian yang tidak dipahami untuk ditanyakan."]'::jsonb,
  english_spiral = 'Level 10 meminta tiga kalimat tentang pengalaman. Menerima teks lebih dulu memberi anak kalimat contoh yang dapat ia tiru lalu ubah.'
where level = 9;

update public.curriculum set
  english_indicators = '["Menyampaikan atau menulis tiga kalimat tentang pengalamannya dalam tema — 4 dari 5.","Memakai kata kerja bentuk sederhana dengan cukup tepat.","Ketiga kalimatnya berhubungan satu sama lain."]'::jsonb,
  english_spiral = 'Level 11 membandingkan dua hal, yang menuntut dua kalimat dijajarkan. Kemampuan menyusun beberapa kalimat yang saling berhubungan diperlukan lebih dulu.'
where level = 10;

update public.curriculum set
  english_indicators = '["Membandingkan dua benda atau keadaan dengan kosakata tema — 4 dari 5.","Memakai bentuk pembanding sederhana seperti bigger atau faster — 3 dari 5.","Menyebutkan dasar perbandingannya, misalnya ukuran, warna, atau jumlah."]'::jsonb,
  english_spiral = 'Level 12 menceritakan urutan proses. Menyebut dasar perbandingan melatih anak menjelaskan alasan dan bukan hanya menyebut hasil.'
where level = 11;

update public.curriculum set
  english_indicators = '["Menceritakan urutan proses sederhana dalam tema, misalnya cara membuat sesuatu — 4 dari 5.","Memakai kata penghubung urutan seperti first, then, dan finally — 4 dari 5.","Urutannya benar sehingga pendengar dapat mengikuti."]'::jsonb,
  english_spiral = 'Level 13 menjelaskan hasil pengamatan dalam paparan pendek. Urutan yang jelas adalah kerangka paling sederhana untuk menyampaikan sesuatu yang panjang.'
where level = 12;

update public.curriculum set
  english_indicators = '["Menjelaskan hasil pengamatan tema dalam satu paragraf atau paparan pendek — 4 dari 5.","Memakai kosakata tema dan istilah sederhana dengan tepat.","Menyampaikan dengan suara dan tempo yang dapat diikuti pendengar."]'::jsonb,
  english_spiral = 'Level 14 bertukar pendapat dan memberi alasan. Menyampaikan hasil pengamatan melatih berbicara berdasarkan sesuatu yang nyata, dan hal nyata itulah bahan sebuah alasan.'
where level = 13;

update public.curriculum set
  english_indicators = '["Menyampaikan pendapat sederhana dalam bahasa Inggris beserta satu alasan — 4 dari 5.","Menanggapi pendapat teman dengan setuju atau tidak setuju secara santun.","Memakai ungkapan pendapat seperti I think dan because dengan tepat."]'::jsonb,
  english_spiral = 'Level 15 menyimpulkan teks dan mengajukan pertanyaan lanjutan. Anak yang terbiasa memberi alasan akan bertanya tentang hal yang belum beralasan.'
where level = 14;

update public.curriculum set
  english_indicators = '["Menyimpulkan isi teks tematik dalam satu sampai dua kalimat — 4 dari 5.","Mengajukan satu pertanyaan lanjutan tentang isi teks — 4 dari 5.","Pertanyaannya mengarah pada hal yang belum dijelaskan teks."]'::jsonb,
  english_spiral = 'Level 16 mempresentasikan proyek dan menanggapi pertanyaan. Anak yang terbiasa menyusun pertanyaan jauh lebih siap menerima pertanyaan.'
where level = 15;

update public.curriculum set
  english_indicators = '["Mempresentasikan proyek tema dalam bahasa Inggris dengan pembuka, isi, dan penutup — 4 dari 5.","Menanggapi pertanyaan pendengar dengan jawaban yang nyambung — 4 dari 5.","Meneruskan penyampaian meski ada kata yang tidak diingat, dengan menjelaskannya memakai kata lain."]'::jsonb,
  english_spiral = 'English Exposure adalah pengayaan dan tidak pernah menahan kenaikan level maupun kelulusan. Yang dituju bukan kefasihan, melainkan anak yang tidak takut memakai bahasa lain untuk menyampaikan sesuatu yang ia pahami.'
where level = 16;
