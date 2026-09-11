-- IPAS, Menyimak and Berbicara for Fase B (levels 9-12), drafted with the owner on 11 Sep 2026.
-- Same breath as the core strands in this phase: moving from one angle to several, and being
-- willing to be corrected by reality -- IPAS through systems and mechanism, Menyimak through
-- holding judgement, Berbicara through being fair to an opinion that is not your own.
update public.curriculum set
  ipas_indicators = '["Menyelidiki perubahan wujud dan perubahan zat lewat percobaan sederhana — 4 dari 5.","Menghubungkan satu perubahan zat dengan kegiatan produksi atau konsumsi di sekitarnya, seperti memasak, membuat tempe, atau membakar sampah.","Membedakan perubahan yang dapat dikembalikan seperti es mencair dari yang tidak dapat dikembalikan seperti kayu terbakar, disertai alasan — 3 dari 5."]'::jsonb,
  ipas_key = 3,
  ipas_spiral = 'Level 10 masuk ke ekosistem dan tanggung jawab menjaganya. Anak yang mengira semua perubahan dapat dibalik tidak akan merasakan mendesaknya menjaga lingkungan, karena kerusakan baginya hanya soal dibereskan nanti.',
  listening_indicators = '["Menyebutkan gagasan pokok paparan singkat dalam satu kalimat — 4 dari 5.","Menyebutkan dua informasi pendukungnya — 4 dari 5.","Menangkap gagasan pokok sambil paparan terus berjalan, tidak kehilangan bagian berikutnya saat sedang memikirkan bagian sebelumnya — 3 dari 5."]'::jsonb,
  listening_key = 3,
  listening_spiral = 'Inilah yang membedakan menyimak dari membaca: teks dapat diulang, pembicara tidak. Level 10 menyimpulkan tujuan pembicara, yang sering baru jelas di bagian akhir, persis bagian yang hilang bila anak masih tertinggal di kalimat sebelumnya.',
  speaking_indicators = '["Menyampaikan presentasi pendek dengan pembuka, isi, dan penutup — 4 dari 5.","Memakai kosakata tema dengan tepat dan menjelaskan istilah yang mungkin asing bagi pendengar — 4 dari 5.","Menyampaikan informasi yang bisa ditunjukkan sumbernya, bukan yang ia kira-kira sendiri — 3 dari 5."]'::jsonb,
  speaking_key = 3,
  speaking_spiral = 'Level 10 menanggapi pendapat orang lain. Menanggapi membutuhkan pijakan; bila isinya karangan sendiri, tanggapan berubah menjadi adu keyakinan.'
where level = 9;

update public.curriculum set
  ipas_indicators = '["Menyusun rantai makanan dari satu ekosistem setempat — 4 dari 5.","Menyebutkan satu tindakan warga yang menjaga atau merusak keseimbangan ekosistem itu.","Meramalkan apa yang terjadi pada bagian lain rantai makanan bila satu bagian berkurang — 3 dari 5."]'::jsonb,
  ipas_key = 3,
  ipas_spiral = 'Level 11 memandang tubuh sebagai sistem, dengan gagasan yang sama persis: mengubah satu bagian menggoyang bagian lain. Anak yang melihat makhluk hidup satu per satu tidak akan menghubungkan kebiasaan dengan kesehatan.',
  listening_indicators = '["Menyebutkan pesan utama pembicara — 4 dari 5.","Menyebutkan tujuan pembicara, yaitu memberi tahu, mengajak, atau menghibur — 4 dari 5.","Menyimpulkan tujuan dari isi dan cara penyampaiannya, bukan dari siapa yang berbicara — 3 dari 5."]'::jsonb,
  listening_key = 3,
  listening_spiral = 'Level 11 membandingkan dua paparan. Membandingkan hanya jujur bila yang ditimbang adalah isinya dan bukan orangnya. Indikator ini akan terpakai seumur hidup.',
  speaking_indicators = '["Menanggapi dengan menyebut bagian mana dari pendapat orang lain yang ditanggapi — 4 dari 5.","Menyampaikan ketidaksetujuan tanpa merendahkan orangnya — 4 dari 5.","Menyebutkan ulang pendapat lawan bicara dengan benar sebelum menanggapinya — 3 dari 5."]'::jsonb,
  speaking_key = 3,
  speaking_spiral = 'Level 11 menyusun pendapat dengan dua alasan. Alasan sekuat apa pun sia-sia bila yang dijawab bukan pendapat orang itu, karena anak akan menang melawan pendapat yang tidak pernah ada.'
where level = 10;

update public.curriculum set
  ipas_indicators = '["Menghubungkan satu sistem tubuh dengan kebiasaan yang mempengaruhinya — 4 dari 5.","Menyebutkan satu hak atas lingkungan sehat dan satu tanggung jawab yang menyertainya.","Menjelaskan akibat yang tidak langsung terlihat, misalnya kebiasaan hari ini terhadap kesehatan bulan depan, disertai alasan dan bukan hanya akibat seketika — 3 dari 5."]'::jsonb,
  ipas_key = 3,
  ipas_spiral = 'Level 12 menyelidiki cahaya dan bunyi, yang bekerja lewat proses yang tidak terlihat mata. Anak yang hanya percaya pada akibat seketika akan menerima gejalanya begitu saja alih-alih menyelidiki cara kerjanya.',
  listening_indicators = '["Menyebutkan persamaan dan perbedaan isi dua paparan bertema sama — 4 dari 5.","Menyebutkan bagian mana yang saling bertentangan — 3 dari 5.","Menahan penilaian sampai kedua paparan selesai didengar — 3 dari 5."]'::jsonb,
  listening_key = 3,
  listening_spiral = 'Level 12 mengikuti diskusi, tempat banyak suara datang bergantian. Anak yang sudah memutuskan sejak pembicara pertama hanya akan mendengar sisanya sebagai gangguan.',
  speaking_indicators = '["Menyampaikan pendapat dengan dua alasan yang berbeda — 4 dari 5.","Menyebutkan bukti atau contoh untuk minimal satu alasannya — 4 dari 5.","Kedua alasannya berdiri sendiri, bukan satu alasan yang diulang dengan kata lain — 3 dari 5."]'::jsonb,
  speaking_key = 3,
  speaking_spiral = 'Level 12 merangkum diskusi, yang menuntut melihat mana alasan yang benar-benar berbeda dan mana yang sama tetapi berbaju lain.'
where level = 11;

update public.curriculum set
  ipas_indicators = '["Menunjukkan lewat percobaan bahwa cahaya merambat lurus dan dapat dipantulkan — 4 dari 5.","Menjelaskan satu pemanfaatan cahaya atau bunyi dalam kehidupan atau budaya setempat.","Menjelaskan bagaimana sesuatu terjadi dan bukan hanya bahwa itu terjadi, misalnya mengapa bayangan memanjang pada sore hari — 3 dari 5."]'::jsonb,
  ipas_key = 3,
  ipas_spiral = 'Level 13 menjelaskan siklus air, cuaca, dan perubahan muka bumi. Siklus hanya dapat dipahami oleh anak yang sudah terbiasa mencari mekanisme. Level 12 adalah akhir Fase B, jadi kenaikan ke Level 13 melewati ujian sumatif.',
  listening_indicators = '["Mencatat informasi penting dari diskusi — 4 dari 5.","Menuliskan minimal satu pertanyaan lanjutan yang belum terjawab dalam diskusi — 4 dari 5.","Pertanyaannya menyasar bagian yang belum jelas atau belum dibuktikan, bukan mengulang yang sudah dibahas — 3 dari 5."]'::jsonb,
  listening_key = 3,
  listening_spiral = 'Level 13 menilai kecukupan alasan dan bukti dalam presentasi. Mengenali apa yang belum dibuktikan adalah bentuk paling awal dari menakar bukti. Level 12 adalah akhir Fase B, jadi kenaikan ke Level 13 melewati ujian sumatif.',
  speaking_indicators = '["Merangkum hasil diskusi dengan menyebut pendapat-pendapat yang muncul — 4 dari 5.","Memberi kesempatan bicara kepada anggota yang belum berbicara, pada dua kesempatan.","Rangkumannya memuat pendapat yang berbeda dari pendapatnya sendiri dan disampaikan dengan adil — 3 dari 5."]'::jsonb,
  speaking_key = 3,
  speaking_spiral = 'Level 13 menyajikan laporan pengamatan dan menjawab pertanyaan. Anak yang merangkum hanya yang sepihak akan melaporkan pengamatan yang mendukung dugaannya saja, dan itu mematikan ilmu dan bukan hanya diskusi. Level 12 adalah akhir Fase B, jadi kenaikan ke Level 13 melewati ujian sumatif.'
where level = 12;
