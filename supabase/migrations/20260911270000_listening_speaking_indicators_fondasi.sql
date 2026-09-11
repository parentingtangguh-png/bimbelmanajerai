-- Menyimak and Berbicara, levels 2-4: drafted with the owner on 11 Sep 2026.
-- Both strands grow from receiving one thing to holding several at once -- inbound for Menyimak,
-- outbound for Berbicara -- so a single activity can carry evidence for both.
update public.curriculum set
  listening_indicators = '["Menunjuk dua benda yang disebut dalam satu kalimat, misalnya ambil bola dan buku — 4 dari 5.","Menjawab pertanyaan tentang benda dan pemiliknya dari kalimat pendek, misalnya kucing Ali tidur lalu ditanya kucing siapa — 4 dari 5.","Menunggu kalimat selesai sebelum bergerak, bukan langsung berlari begitu kata pertama terdengar — 3 dari 5."]'::jsonb,
  listening_key = 3,
  listening_spiral = 'Level 3 mengikuti instruksi dua langkah. Anak yang bergerak pada kata pertama tidak pernah mendengar langkah kedua; ia bukan lupa, melainkan belum sempat menerima. Ini paling sering dibaca sebagai anak yang tidak patuh, padahal ini soal menahan dan bukan soal sikap.',
  speaking_indicators = '["Menyebutkan nama 10 benda tema dan 5 tindakan seperti lari, makan, dan tidur dengan ucapan yang dipahami guru.","Menyampaikan kebutuhannya dengan frasa dua kata seperti mau minum atau sakit perut, pada dua kesempatan.","Memakai kata kerja dan bukan hanya nama benda saat menyampaikan maksud, misalnya mau minum dan bukan minum sambil menunjuk — 4 dari 5."]'::jsonb,
  speaking_key = 3,
  speaking_spiral = 'Level 3 menyampaikan kalimat, dan kata kerja adalah tulang kalimat. Anak yang hanya menguasai nama benda akan menumpuk kata tanpa pernah sampai ke kalimat, meskipun kosakatanya banyak.'
where level = 2;

update public.curriculum set
  listening_indicators = '["Melakukan instruksi dua langkah dengan bantuan gambar atau gerak — 4 dari 5.","Mengulang kembali instruksinya dengan kata-katanya sendiri sebelum mengerjakan — 3 dari 5.","Melakukan kedua langkah dalam urutan yang benar, bukan mengerjakan yang paling diingat lebih dulu — 4 dari 5."]'::jsonb,
  listening_key = 3,
  listening_spiral = 'Level 4 menyimak cerita, dan cerita adalah rangkaian panjang. Tanpa pegangan pada urutan, yang tertangkap hanya kepingan yang berserak, dan anak akan menceritakan bagian akhir seolah itu awalnya.',
  speaking_indicators = '["Menyampaikan satu kalimat lengkap dengan pelaku dan tindakan tentang yang baru saja dilakukannya — 4 dari 5.","Menjawab pertanyaan apa yang kamu lihat dengan kalimat, bukan satu kata — 4 dari 5.","Berbicara tentang kejadian yang sudah lewat, bukan hanya yang ada di depan mata — 3 dari 5."]'::jsonb,
  speaking_key = 3,
  speaking_spiral = 'Level 4 menceritakan kembali, dan bercerita pada dasarnya adalah berbicara tentang yang tidak sedang terlihat. Anak yang hanya bisa melaporkan apa yang ada di depannya belum punya bahan untuk bercerita.'
where level = 3;

update public.curriculum set
  listening_indicators = '["Menyebutkan tokoh atau benda utama setelah menyimak cerita pendek — 4 dari 5 cerita.","Menjawab satu pertanyaan tentang apa yang terjadi, tanpa melihat gambar — 3 dari 5.","Membedakan tokoh utama dari tokoh yang hanya lewat, yaitu menyebut yang paling banyak berbuat dan bukan yang paling terakhir disebut — 3 dari 5."]'::jsonb,
  listening_key = 3,
  listening_spiral = 'Level 5 menemukan informasi tersurat, dan menemukan berarti memilih. Anak yang menyebut nama yang terakhir didengar belum memilih; ia hanya mengingat, dan ingatan akan kalah begitu teksnya memanjang. Level 4 adalah akhir Fase Fondasi, jadi kenaikan ke Level 5 melewati ujian sumatif.',
  speaking_indicators = '["Menceritakan kembali dua peristiwa dari cerita atau pengalaman dengan bantuan gambar — 4 dari 5.","Memakai kata penanda urutan seperti lalu dan setelah itu minimal sekali dalam satu cerita — 3 dari 5.","Menjaga urutan tetap benar ketika gambarnya diambil — 2 dari 3."]'::jsonb,
  speaking_key = 3,
  speaking_spiral = 'Level 5 bertanya dan menjawab secara bergiliran. Dalam percakapan tidak ada gambar yang bisa dipegang, sehingga anak harus membawa isinya sendiri; selama gambar masih menjadi tumpuan, gilirannya akan kosong. Level 4 adalah akhir Fase Fondasi, jadi kenaikan ke Level 5 melewati ujian sumatif.'
where level = 4;
