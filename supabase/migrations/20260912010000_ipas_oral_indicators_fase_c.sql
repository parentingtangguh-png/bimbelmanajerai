-- IPAS, Menyimak and Berbicara for Fase C (levels 13-16), drafted with the owner on 11 Sep 2026.
-- The last batch: with this the ladder is complete, 16 levels across all six required strands.
-- All three end where the core strands end -- a child who answers for their own thinking: knows
-- what it rests on, knows its limits, and knows what would change it.
update public.curriculum set
  ipas_indicators = '["Menjelaskan siklus air dengan menyebut tahapan dan penggeraknya, misalnya panas matahari — 4 dari 5.","Menghubungkan satu perubahan muka bumi atau cuaca ekstrem dengan dampaknya pada kegiatan masyarakat — 4 dari 5.","Menjelaskan proses yang berlangsung dalam waktu panjang atau skala luas, bukan hanya yang teramati sekali lihat — 3 dari 5."]'::jsonb,
  ipas_key = 3,
  ipas_spiral = 'Level 14 membaca peta Indonesia, yang menuntut membayangkan ruang jauh lebih besar daripada halaman sekolah. Anak yang hanya percaya pada apa yang dapat dilihat langsung tidak akan memahami apa pun yang berskala negara.',
  listening_indicators = '["Menyebutkan klaim utama presentasi dan alasan yang diberikan — 4 dari 5.","Menyebutkan mana alasan yang didukung bukti dan mana yang belum — 4 dari 5.","Memisahkan klaim, alasan, dan bukti dengan tepat, tidak menganggap alasan yang diulang sebagai bukti — 3 dari 5."]'::jsonb,
  listening_key = 3,
  listening_spiral = 'Level 14 merangkum dengan struktur yang runtut, dan itu hanya mungkin bila strukturnya terdengar. Anak yang menangkap paparan sebagai satu aliran kata akan merangkumnya menjadi potongan acak.',
  speaking_indicators = '["Menyajikan laporan pengamatan dengan urutan tujuan, cara, hasil, dan simpulan — 4 dari 5.","Menjawab pertanyaan pendengar dengan merujuk datanya — 4 dari 5.","Menjawab bahwa hal itu belum ia periksa ketika memang begitu keadaannya — 3 dari 5."]'::jsonb,
  speaking_key = 3,
  speaking_spiral = 'Level 14 berargumentasi dengan bukti yang dapat diperiksa, dan mengakui batas pengetahuan adalah syaratnya. Anak yang merasa harus selalu punya jawaban pada akhirnya akan mengarang bukti.'
where level = 13;

update public.curriculum set
  ipas_indicators = '["Membaca peta Indonesia meliputi arah, legenda, dan skala — 4 dari 5.","Menghubungkan kondisi geografis satu daerah dengan sumber daya dan mata pencaharian warganya — 4 dari 5.","Menjelaskan keberagaman budaya sebagai akibat keadaan yang berbeda, bukan sebagai lebih baik atau lebih buruk — 3 dari 5."]'::jsonb,
  ipas_key = 3,
  ipas_spiral = 'Level 15 merancang aksi bersama lewat musyawarah. Kesepakatan bersama hanya adil bila perbedaan keadaan diakui sebagai keadaan dan bukan sebagai kekurangan.',
  listening_indicators = '["Merangkum paparan dengan urutan yang mengikuti struktur aslinya — 4 dari 5.","Rangkumannya memuat gagasan pokok dan dua pendukung utama — 4 dari 5.","Rangkumannya tidak menambahkan hal yang tidak disampaikan pembicara — 3 dari 5."]'::jsonb,
  listening_key = 3,
  listening_spiral = 'Level 15 mengevaluasi bias. Mengenali tambahan yang datang dari kepalanya sendiri adalah latihan pertama melihat bias, dimulai dari bias sendiri sebelum menilai bias orang lain.',
  speaking_indicators = '["Menyampaikan argumen dengan klaim, alasan, dan bukti yang dapat diperiksa — 4 dari 5.","Menyebutkan dari mana buktinya berasal — 4 dari 5.","Melepaskan atau memperbaiki klaimnya ketika bukti lawan bicara lebih kuat — 3 dari 5."]'::jsonb,
  speaking_key = 3,
  speaking_spiral = 'Level 15 menyesuaikan penyampaian dengan pendengar. Anak yang tidak pernah melepaskan klaim akan memakai kemampuan itu untuk memenangkan alih-alih memahamkan; keterampilan yang sama bisa menjadi retorika atau menjadi pengajaran.'
where level = 14;

update public.curriculum set
  ipas_indicators = '["Memperkirakan pemakaian energi di rumah atau kelas dan menyajikan datanya — 4 dari 5.","Menyusun satu rencana aksi bersama lewat musyawarah dan mencatat kesepakatannya.","Menimbang siapa yang terbebani oleh sebuah usulan, bukan hanya apakah usulan itu efektif — 3 dari 5."]'::jsonb,
  ipas_key = 3,
  ipas_spiral = 'Level 16 menuntut solusi yang adil dan dapat dijalankan bersama. Efektif saja tidak cukup, karena usulan yang menimpakan bebannya kepada satu pihak akan berhenti dengan sendirinya.',
  listening_indicators = '["Menyebutkan sudut pandang pembicara dan kepentingan yang mungkin menyertainya — 4 dari 5.","Menunjukkan pilihan kata yang menandakan keberpihakan — 4 dari 5.","Mengenali bias pada pembicara yang sependapat dengannya, bukan hanya pada yang berseberangan — 3 dari 5."]'::jsonb,
  listening_key = 3,
  listening_spiral = 'Level 16 mengambil keputusan yang beralasan. Keputusan yang baik menuntut kewaspadaan yang sama ke segala arah; bila hanya pihak lawan yang dicurigai, yang tersisa bukan penilaian melainkan pembelaan.',
  speaking_indicators = '["Menyesuaikan kosakata dan contoh dengan siapa yang mendengarkan — 4 dari 5.","Mengubah struktur presentasi sesuai waktu dan kebutuhan pendengar — 4 dari 5.","Menyederhanakan tanpa mengubah kebenarannya — 3 dari 5."]'::jsonb,
  speaking_key = 3,
  speaking_spiral = 'Level 16 memimpin diskusi, yaitu membuat semua orang paham tanpa menyetir isi pembicaraan.'
where level = 15;

update public.curriculum set
  ipas_indicators = '["Merancang sendiri satu penyelidikan meliputi pertanyaan, cara, dan data yang dikumpulkan — 4 dari 5.","Mengolah bukti menjadi simpulan yang sesuai data, termasuk ketika hasilnya tidak sesuai dugaan — 4 dari 5.","Mengusulkan solusi yang benar-benar dapat dijalankan oleh orang yang akan menjalankannya — 3 dari 5."]'::jsonb,
  ipas_key = 3,
  ipas_spiral = 'Anak yang lulus ujian sumatif akhir Fase C berstatus Lulus dan siap ke SMP. Dalam IPAS, artinya ia merancang penyelidikan sendiri, mengikuti bukti termasuk ketika hasilnya tidak menyenangkan, dan mengusulkan tindakan yang adil serta dapat dijalankan bersama.',
  listening_indicators = '["Menyatukan informasi dari beberapa pembicara menjadi gambaran yang utuh — 4 dari 5.","Menyebutkan dasar dari keputusan yang ia ambil — 4 dari 5.","Menyebutkan apa yang akan mengubah keputusannya — 3 dari 5."]'::jsonb,
  listening_key = 3,
  listening_spiral = 'Anak yang lulus ujian sumatif akhir Fase C berstatus Lulus dan siap ke SMP. Dalam menyimak, artinya ia mendengar untuk memutuskan dan bukan untuk menang, serta tahu apa yang akan membuatnya berubah pikiran.',
  speaking_indicators = '["Memfasilitasi diskusi sehingga semua anggota mendapat giliran bicara — 4 dari 5.","Menimbang pandangan yang berbeda dan menyebutkan kekuatan masing-masing — 4 dari 5.","Menyampaikan kesimpulan bersama yang diakui benar oleh pihak yang tadinya berbeda pendapat — 3 dari 5."]'::jsonb,
  speaking_key = 3,
  speaking_spiral = 'Anak yang lulus ujian sumatif akhir Fase C berstatus Lulus dan siap ke SMP. Dalam berbicara, artinya ia berbicara agar orang lain paham dan dapat memutuskan bersama, bukan agar dirinya menang.'
where level = 16;
