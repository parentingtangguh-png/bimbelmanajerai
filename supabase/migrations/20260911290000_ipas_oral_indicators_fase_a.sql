-- IPAS, Menyimak and Berbicara for Fase A (levels 5-8), drafted with the owner on 11 Sep 2026.
-- All three head for the same place: standing on what can be checked rather than on what is already
-- believed or liked -- IPAS through evidence, Menyimak through taking content as it is, Berbicara
-- through reasons open to inspection.
update public.curriculum set
  ipas_indicators = '["Menyebutkan bagian tumbuhan dan fungsinya, misalnya akar menyerap air dan daun membuat makanan — 4 dari 5.","Menjalankan percobaan tanaman disiram dan tidak disiram dengan perlakuan lain yang sama, lalu melaporkan hasilnya.","Menjelaskan apa yang terjadi bila satu kebutuhan dihilangkan berdasarkan hasil pengamatannya sendiri, bukan dugaan — 2 dari 3."]'::jsonb,
  ipas_key = 3,
  ipas_spiral = 'Level 6 menghubungkan tahap daur hidup dengan habitatnya: kecebong perlu air, katak dewasa tidak. Anak yang belum melihat kebutuhan sebagai syarat hidup akan menghafal urutan gambar tanpa tahu mengapa tempatnya berubah. Indikator ini juga memanen simpul Fondasi Level 4, yaitu perbandingan adil.',
  listening_indicators = '["Menjawab pertanyaan tentang informasi yang disebutkan jelas dalam teks lisan — 4 dari 5.","Meminta pengulangan atau bertanya ketika ada bagian yang tidak tertangkap, pada dua kesempatan.","Menjawab dari apa yang didengar hari itu, bukan dari pengetahuan umum yang sudah dimilikinya — 4 dari 5."]'::jsonb,
  listening_key = 3,
  listening_spiral = 'Level 6 mengurutkan peristiwa yang disimak. Anak yang mencampurkan pengetahuan lama akan mengikuti urutan cerita yang sudah ia kenal dan bukan yang baru didengarnya. Ini kembaran simpul Membaca Level 5.',
  speaking_indicators = '["Mengajukan pertanyaan yang berkaitan dengan yang sedang dibicarakan — 4 dari 5 percakapan.","Menunggu giliran dan tidak memotong pembicaraan orang lain, pada dua kesempatan.","Menjawab pertanyaan yang ditanyakan, bukan berpindah ke cerita yang ingin ia ceritakan — 4 dari 5."]'::jsonb,
  speaking_key = 3,
  speaking_spiral = 'Level 6 menceritakan pengalaman dengan awal, kejadian, dan akhir. Anak yang melompat ke cerita lain tidak akan mampu menjaga satu cerita tetap utuh dari awal sampai selesai.'
where level = 5;

update public.curriculum set
  ipas_indicators = '["Mengurutkan tahap daur hidup dua hewan berbeda — 4 dari 5.","Menjelaskan bahwa hewan yang berubah bentuk tetap hewan yang sama, dan menghubungkan tahapnya dengan tempat hidup.","Membedakan perubahan yang terjadi sendiri seiring waktu dari perubahan yang terjadi karena ada yang melakukannya — 3 dari 5."]'::jsonb,
  ipas_key = 3,
  ipas_spiral = 'Level 7 menyelidiki gaya dan gerak, yaitu perubahan yang disebabkan dorongan atau tarikan. Anak yang menganggap semua perubahan terjadi dengan sendirinya tidak akan mencari penyebabnya, dan penyelidikan gaya berhenti menjadi permainan mendorong benda.',
  listening_indicators = '["Mengurutkan dua sampai tiga peristiwa dari cerita yang disimak — 4 dari 5.","Menyebutkan peristiwa mana yang terjadi lebih dulu bila ditanya secara acak — 4 dari 5.","Menjaga urutan tetap benar pada cerita yang tidak sesuai dugaannya — 3 dari 5."]'::jsonb,
  listening_key = 3,
  listening_spiral = 'Level 7 membedakan fakta dan pendapat. Menerima isi apa adanya dan bukan yang diharapkan adalah sikap yang sama persis dengan yang dibutuhkan di sana.',
  speaking_indicators = '["Menceritakan pengalaman dengan awal, kejadian, dan akhir yang jelas — 4 dari 5.","Menyebutkan tempat dan waktu kejadian agar pendengar dapat mengikuti — 3 dari 5.","Memberi keterangan yang dibutuhkan pendengar, tidak mengandaikan pendengar sudah tahu — 3 dari 5."]'::jsonb,
  speaking_key = 3,
  speaking_spiral = 'Level 7 menjelaskan cara melakukan sesuatu. Petunjuk hanya berguna bila yang menjelaskan sadar apa yang belum diketahui orang lain.'
where level = 6;

update public.curriculum set
  ipas_indicators = '["Menunjukkan bahwa dorongan atau tarikan mengubah arah, kecepatan, atau bentuk benda — 4 dari 5 percobaan.","Menyusun bersama kelompok satu aturan pemakaian alat yang aman dan berlaku untuk semua orang.","Meramalkan apa yang akan terjadi sebelum mencoba, lalu membandingkan ramalannya dengan hasilnya — 3 dari 5."]'::jsonb,
  ipas_key = 3,
  ipas_spiral = 'Level 8 menelusuri perubahan energi. Anak yang hanya mencoba lalu melihat belum berpikir; meramalkan memaksanya punya penjelasan lebih dulu, dan itulah yang membuat hasil yang meleset menjadi berharga alih-alih memalukan.',
  listening_indicators = '["Menyebutkan mana pernyataan yang dapat diperiksa benar salahnya dan mana yang merupakan pendapat — 4 dari 5.","Menyebutkan kata penanda pendapat seperti menurutku, sebaiknya, dan paling enak — 3 dari 5.","Menilai pernyataan berdasarkan bisa tidaknya diperiksa, bukan berdasarkan setuju atau tidak setuju — 3 dari 5."]'::jsonb,
  listening_key = 3,
  listening_spiral = 'Level 8 mencatat kata kunci dan menjelaskan kembali isi teks lisan. Memilih yang penting harus jujur dan bukan memilih yang disukai.',
  speaking_indicators = '["Menjelaskan cara melakukan sesuatu dalam urutan langkah yang benar — 4 dari 5.","Memakai kata urutan seperti pertama, lalu, dan terakhir — 4 dari 5.","Tidak melewatkan langkah yang dianggapnya sudah jelas, diuji dengan pendengar yang mengikuti persis seperti yang dikatakan — 3 dari 5."]'::jsonb,
  speaking_key = 3,
  speaking_spiral = 'Level 8 menyampaikan pendapat beserta alasan. Anak yang melewatkan langkah juga akan melewatkan alasan, karena keduanya sama-sama dianggap sudah jelas bagi semua orang.'
where level = 7;

update public.curriculum set
  ipas_indicators = '["Menyebutkan sumber energi pada alat sehari-hari dan bentuk energi yang dihasilkannya — 4 dari 5.","Merancang satu kebiasaan hemat energi untuk kelas dan menjalankannya minimal seminggu.","Menelusuri perubahan bentuk energi pada satu alat, misalnya listrik menjadi cahaya dan panas, serta menyatakan energinya berubah bentuk dan bukan hilang — 3 dari 5."]'::jsonb,
  ipas_key = 3,
  ipas_spiral = 'Level 9 menyelidiki perubahan zat dan menghubungkannya dengan kegiatan sehari-hari. Gagasan bahwa sesuatu berubah bentuk tanpa lenyap adalah dasarnya. Level 8 adalah akhir Fase A, jadi kenaikan ke Level 9 melewati ujian sumatif.',
  listening_indicators = '["Mencatat minimal tiga kata kunci saat menyimak paparan pendek — 4 dari 5.","Menjelaskan kembali isi teks lisan memakai catatannya — 4 dari 5.","Mencatat sambil tetap menyimak, tidak berhenti mendengar saat menulis — 3 dari 5."]'::jsonb,
  listening_key = 3,
  listening_spiral = 'Level 9 menangkap gagasan pokok dan informasi pendukung dari paparan singkat. Bila menulis memutus menyimak, bagian penting justru hilang pada saat ia mencatatnya. Level 8 adalah akhir Fase A, jadi kenaikan ke Level 9 melewati ujian sumatif.',
  speaking_indicators = '["Menyampaikan pendapat dengan kalimat yang jelas beserta satu alasan — 4 dari 5.","Alasannya berhubungan dengan pendapatnya dan tidak berpindah topik — 4 dari 5.","Alasannya bisa diperiksa atau dilihat orang lain, bukan sekadar karena ia menyukainya — 3 dari 5."]'::jsonb,
  speaking_key = 3,
  speaking_spiral = 'Level 9 mempresentasikan informasi tema dengan kosakata yang sesuai. Anak yang alasannya masih sebatas selera belum berbicara berdasarkan informasi. Level 8 adalah akhir Fase A, jadi kenaikan ke Level 9 melewati ujian sumatif.'
where level = 8;
