-- IPAS, levels 2-4: the last core strand of Fondasi, drafted with the owner on 11 Sep 2026.
-- The strand moves from seeing to making sure: benda, indra, sebab-akibat, perbandingan adil.
update public.curriculum set
  ipas_indicators = '["Menyebutkan indra yang dipakainya untuk mengenali suatu benda, misalnya aku tahu ini kasar karena kupegang — 4 dari 5 benda.","Mempraktikkan satu kebiasaan merawat tubuh seperti cuci tangan sebelum makan sampai tuntas tanpa dituntun langkah demi langkah, pada dua kesempatan.","Mengenali benda dengan satu indra saja, misalnya meraba di dalam kantong atau mencium dengan mata tertutup — 3 dari 5."]'::jsonb,
  ipas_key = 3,
  ipas_spiral = 'Level 3 mengamati cuaca, dan cuaca tidak bisa dipegang; ia hanya dikenali lewat gabungan tanda seperti panas di kulit, mendung di mata, dan angin di telinga. Anak yang belum sadar indra mana memberi informasi apa tidak punya cara mengumpulkan tanda-tanda itu, sehingga ia menjawab dari ingatan dan bukan dari pengamatan hari itu.'
where level = 2;

update public.curriculum set
  ipas_indicators = '["Menyebutkan cuaca hari ini beserta dua tanda yang dipakainya untuk tahu, seperti langit mendung dan udara dingin — 4 dari 5 kesempatan.","Menyebutkan satu kegiatan yang berubah karena cuaca, misalnya hujan sehingga bermain di dalam.","Menjelaskannya dengan kata sebab-akibat seperti karena hujan maka, bukan hanya menyebut dua hal berdampingan — 3 dari 5."]'::jsonb,
  ipas_key = 3,
  ipas_spiral = 'Level 4 menyelidiki sifat bahan, dan penyelidikan baru berarti bila anak mencari sebab: kenapa yang ini basah dan yang itu tidak. Anak yang masih menempelkan dua kejadian tanpa menghubungkannya akan melaporkan hasil percobaan tanpa kesimpulan; kegiatannya jalan tetapi ilmunya tidak.'
where level = 3;

update public.curriculum set
  ipas_indicators = '["Membandingkan dua bahan berdasarkan satu sifat yang disepakati, seperti kasar dan halus atau menyerap air dan tidak, lalu menyampaikan hasilnya — 4 dari 5.","Menjalankan perannya dalam penyelidikan kelompok sampai selesai dan merapikan alat setelahnya, pada dua kesempatan.","Menguji dua bahan dengan perlakuan yang sama, misalnya jumlah air sama dan waktu sama, sebelum menyimpulkan mana yang lebih menyerap — 2 dari 3 penyelidikan."]'::jsonb,
  ipas_key = 3,
  ipas_spiral = 'Level 5 menyelidiki kebutuhan tumbuhan dan peran manusia merawatnya, yang menuntut perbandingan adil: tanaman disiram dan tidak disiram, selebihnya sama. Anak yang mengubah dua hal sekaligus tidak akan pernah tahu mana penyebabnya, dan kesimpulannya menjadi tebakan yang tampak ilmiah. Level 4 adalah akhir Fase Fondasi, jadi kenaikan ke Level 5 melewati ujian sumatif.'
where level = 4;
