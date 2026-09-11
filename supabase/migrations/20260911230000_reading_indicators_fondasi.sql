-- Membaca, levels 2-4: the rest of the Fondasi strand, drafted with the owner on 11 Sep 2026.
-- Each knot is a change of unit (bunyi, suku kata, kata, kalimat), not simply more of the same.
update public.curriculum set
  reading_indicators = '["Menggabungkan dua bunyi menjadi suku kata terbuka saat guru menunjuk hurufnya (b–a menjadi ba) — 8 dari 10.","Membaca 10 kartu suku kata terbuka acak seperti ma, si, bu, ke, lo tanpa mengeja ulang lebih dari satu kali — 8 dari 10.","Membaca kata dua suku kata terbuka seperti ma-ma, bu-ku, sa-pi sebagai satu kata, bukan dua potongan yang terpisah — 4 dari 5."]'::jsonb,
  reading_key = 3,
  reading_spiral = 'Level 3 membaca 10 kata pola sederhana, dan menyatukan dua suku kata menjadi satu kata adalah pintunya. Anak yang lancar pada indikator 1 dan 2 tetapi masih membunyikan bu dan ku sebagai dua benda terpisah belum membaca kata, melainkan membaca suku kata, sehingga akan tertahan pada setiap kata baru.'
where level = 2;

update public.curriculum set
  reading_indicators = '["Membaca 10 kata berpola sederhana dengan benar dalam satu kesempatan — 8 dari 10.","Membedakan dua kata yang hanya berbeda bunyi awalnya, seperti buku dan kuku atau sapi dan tapi, dengan menunjuk kata yang disebut guru — 4 dari 5.","Mencocokkan kata yang baru dibacanya dengan benda atau gambarnya — 4 dari 5."]'::jsonb,
  reading_key = 3,
  reading_spiral = 'Level 4 membaca kalimat pendek dan menjawab pertanyaan siapa atau apa. Kalimat hanya bermakna bila tiap katanya membawa makna. Anak yang melafalkan dengan benar tetapi tidak tahu apa yang dibacanya akan sampai ke ujung kalimat tanpa dapat menjawab satu pun pertanyaan, dan itu sering disalahartikan sebagai masalah menyimak.'
where level = 3;

update public.curriculum set
  reading_indicators = '["Membaca kalimat 3–5 kata dengan berhenti di akhir kalimat, bukan di tengah-tengah — 4 dari 5 kalimat.","Menjawab pertanyaan siapa dan apa dari kalimat yang baru saja dibacanya sendiri — 4 dari 5.","Membaca kalimat maju terus tanpa mengulang dari awal atau mengeja ulang kata yang sudah dilewati — 3 dari 5 kalimat."]'::jsonb,
  reading_key = 3,
  reading_spiral = 'Level 5 menuntut kelancaran awal pada teks 3–4 kalimat. Anak yang masih mundur dan mengulang kehabisan daya ingat sebelum sampai ke kalimat kedua, sehingga isi teks tidak tertangkap meskipun setiap katanya terbaca benar. Level 4 adalah akhir Fase Fondasi, jadi kenaikan ke Level 5 melewati ujian sumatif, bukan dua bukti Tercapai biasa.'
where level = 4;
