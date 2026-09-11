-- Membaca, Menulis and Matematika for Fase B (levels 9-12), drafted with the owner on 11 Sep 2026.
-- Fase B moves from one source to several, and from being sure to being willing to change in the
-- face of evidence. Hence knots shaped like changing, refusing, and separating whose voice is whose.
-- Matematika follows the same line through the idea that one value wears many forms.
update public.curriculum set
  reading_indicators = '["Memilah pernyataan fakta dan pendapat dalam satu teks — 4 dari 5.","Menyebutkan bukti dalam teks yang mendukung sebuah pernyataan — 4 dari 5.","Menyatakan pendapat penulis dengan kata penulis, terpisah dari pendapatnya sendiri — 3 dari 5."]'::jsonb,
  reading_key = 3,
  reading_spiral = 'Level 10 membandingkan dua teks, yang mensyaratkan tiap teks dipegang utuh sebagai pendapat siapa. Anak yang mencampurkan suaranya sendiri akan membandingkan dua versi dirinya dan bukan dua teks.',
  writing_indicators = '["Ringkasan memuat gagasan utama tanpa menyalin kalimat teks — 4 dari 5.","Ringkasannya lebih pendek dari aslinya dan maknanya tetap utuh — 4 dari 5.","Membuang contoh dan rincian sehingga tersisa yang pokok — 3 dari 5."]'::jsonb,
  writing_key = 3,
  writing_spiral = 'Level 10 menyusun teks informatif. Struktur pada dasarnya adalah yang pokok yang ditata; anak yang belum dapat memisahkan pokok dari rincian akan menata semuanya sekaligus. Ini lanjutan langsung dari simpul Fase A Level 7, yaitu membuang detail yang tidak perlu.',
  math_indicators = '["Menyatakan pecahan sederhana dengan gambar atau benda dan membandingkan dua pecahan berpenyebut sama — 4 dari 5.","Mengukur panjang atau berat dengan satuan baku dan menuliskan hasilnya — 4 dari 5.","Menjelaskan bahwa pecahan selalu terhadap satu keseluruhan tertentu, sehingga setengah kue besar tidak sama dengan setengah kue kecil — 3 dari 5."]'::jsonb,
  math_key = 3,
  math_spiral = 'Level 10 masuk ke pecahan senilai, dan senilai hanya masuk akal bila keseluruhannya sama. Tanpa gagasan ini, pecahan senilai menjadi aturan mengalikan atas dan bawah yang tidak berarti apa-apa.'
where level = 9;

update public.curriculum set
  reading_indicators = '["Menyebutkan satu persamaan dan satu perbedaan isi dari dua teks bertema sama — 4 dari 5.","Membuat simpulan dan menunjuk bukti dari kedua teks — 4 dari 5.","Menyimpulkan dari kedua teks, bukan hanya dari teks yang lebih mudah atau lebih ia sukai — 3 dari 5."]'::jsonb,
  reading_key = 3,
  reading_spiral = 'Level 11 menganalisis sebab-akibat dan makna kata berdasarkan konteks, yang menuntut membaca seluruh lingkungan kalimat dan bukan potongan yang nyaman.',
  writing_indicators = '["Menulis teks informatif dengan judul yang sesuai isi dan minimal dua paragraf — 4 dari 5.","Tiap paragraf membahas satu hal dan tidak bercampur — 4 dari 5.","Menyusun urutan paragraf menurut kebutuhan pembaca, bukan menurut urutan ia menemukan bahannya — 3 dari 5."]'::jsonb,
  writing_key = 3,
  writing_spiral = 'Level 11 menuntut revisi. Menata tulisan untuk pembaca adalah bentuk pertama dari menulis ulang demi orang lain.',
  math_indicators = '["Menunjukkan dua pecahan senilai dengan gambar atau pembagian yang sama — 4 dari 5.","Menuliskan pecahan sederhana sebagai desimal dan sebaliknya — 4 dari 5.","Menyatakan bahwa setengah, nol koma lima, dan gambar setengah adalah satu nilai yang sama dalam tiga bentuk — 3 dari 5."]'::jsonb,
  math_key = 3,
  math_spiral = 'Level 11 menambahkan persen sebagai bentuk keempat. Bila ketiga bentuk sebelumnya belum menyatu menjadi satu nilai, persen hanya akan menjadi hafalan aturan baru.'
where level = 10;

update public.curriculum set
  reading_indicators = '["Menjelaskan hubungan sebab dan akibat antar bagian teks dengan menunjuk penanda atau bukti — 4 dari 5.","Menebak makna kata baru dari kalimat sekitarnya, lalu memeriksanya — 4 dari 5.","Mengubah tebakan maknanya ketika kalimat berikutnya tidak cocok — 3 dari 5."]'::jsonb,
  reading_key = 3,
  reading_spiral = 'Level 12 membaca yang tersirat, yang mensyaratkan kesediaan merevisi tafsir sendiri. Membaca pada tingkat ini adalah menduga lalu bersedia salah.',
  writing_indicators = '["Menulis narasi dengan dialog yang memakai tanda petik dan baris yang benar — 4 dari 5.","Urutan kejadiannya logis dan tidak melompat — 4 dari 5.","Memperbaiki satu bagian yang membingungkan setelah mendapat tanggapan pembaca — 3 dari 5."]'::jsonb,
  writing_key = 3,
  writing_spiral = 'Level 12 menulis eksposisi. Merevisi karena tanggapan orang lain adalah latihan pertama menulis untuk meyakinkan, bukan sekadar untuk menyampaikan.',
  math_indicators = '["Menyelesaikan masalah sehari-hari yang memuat pecahan, desimal, atau persen — 4 dari 5.","Mengubah antar bentuk sesuai kebutuhan soal — 4 dari 5.","Memilih bentuk yang paling memudahkan soal itu, bukan selalu memakai satu bentuk yang dihafal — 3 dari 5."]'::jsonb,
  math_key = 3,
  math_spiral = 'Level 12 menuntut strategi yang efisien. Memilih bentuk bilangan adalah wujud paling awal dari memilih strategi.'
where level = 11;

update public.curriculum set
  reading_indicators = '["Membedakan informasi yang tertulis dari yang ia simpulkan sendiri — 4 dari 5.","Menyebutkan dasar teks untuk setiap simpulan tersiratnya — 4 dari 5.","Menolak simpulan yang tidak didukung teks meskipun masuk akal atau sesuai pengalamannya — 3 dari 5."]'::jsonb,
  reading_key = 3,
  reading_spiral = 'Level 13 membandingkan perspektif dan menakar kekuatan alasan dari beberapa sumber. Menakar alasan mensyaratkan sanggup menolak yang sekadar terdengar benar. Level 12 adalah akhir Fase B, jadi kenaikan ke Level 13 melewati ujian sumatif.',
  writing_indicators = '["Menulis eksposisi dengan satu klaim yang jelas di awal — 4 dari 5.","Menyertakan minimal dua alasan, masing-masing dengan satu contoh pendukung — 4 dari 5.","Alasannya mendukung klaim yang ia tulis, bukan berpindah ke topik yang lebih ia kuasai — 3 dari 5."]'::jsonb,
  writing_key = 3,
  writing_spiral = 'Level 13 menulis argumen dengan bukti dan bahasa yang sesuai pembaca. Alasan yang berpindah topik terasa meyakinkan bagi penulisnya tetapi tidak menjawab apa pun bagi pembacanya. Level 12 adalah akhir Fase B, jadi kenaikan ke Level 13 melewati ujian sumatif.',
  math_indicators = '["Menyelesaikan operasi bilangan dengan strategi yang sesuai dan memeriksa hasilnya — 4 dari 5.","Menghitung keliling dan luas bangun dasar dalam konteks nyata — 4 dari 5.","Memperkirakan hasil sebelum menghitung, lalu memakai perkiraan itu untuk memeriksa jawabannya — 3 dari 5."]'::jsonb,
  math_key = 3,
  math_spiral = 'Level 13 masuk ke rasio, skala, persen, dan data, yaitu wilayah tempat kesalahan dapat meleset jauh tanpa terasa. Perkiraan adalah penjaga terhadap jawaban yang mustahil. Level 12 adalah akhir Fase B, jadi kenaikan ke Level 13 melewati ujian sumatif.'
where level = 12;
