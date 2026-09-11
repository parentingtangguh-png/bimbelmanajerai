-- Indicators belong to the curriculum strand, not to the evaluation card.
-- Levels are a spiral, so each level also names the one indicator that carries a child into the next level.
alter table public.curriculum
  add column if not exists listening_indicators jsonb not null default '[]'::jsonb,
  add column if not exists speaking_indicators jsonb not null default '[]'::jsonb,
  add column if not exists reading_indicators jsonb not null default '[]'::jsonb,
  add column if not exists writing_indicators jsonb not null default '[]'::jsonb,
  add column if not exists math_indicators jsonb not null default '[]'::jsonb,
  add column if not exists ipas_indicators jsonb not null default '[]'::jsonb,
  add column if not exists english_indicators jsonb not null default '[]'::jsonb,
  add column if not exists listening_key integer not null default 0,
  add column if not exists speaking_key integer not null default 0,
  add column if not exists reading_key integer not null default 0,
  add column if not exists writing_key integer not null default 0,
  add column if not exists math_key integer not null default 0,
  add column if not exists ipas_key integer not null default 0,
  add column if not exists english_key integer not null default 0,
  add column if not exists listening_spiral text not null default '',
  add column if not exists speaking_spiral text not null default '',
  add column if not exists reading_spiral text not null default '',
  add column if not exists writing_spiral text not null default '',
  add column if not exists math_spiral text not null default '',
  add column if not exists ipas_spiral text not null default '',
  add column if not exists english_spiral text not null default '';

do $$ declare s text; begin
  foreach s in array array['listening','speaking','reading','writing','math','ipas','english'] loop
    execute format('alter table public.curriculum drop constraint if exists curriculum_%s_indicators_array', s);
    execute format('alter table public.curriculum add constraint curriculum_%1$s_indicators_array check (jsonb_typeof(%1$s_indicators)=''array'' and jsonb_array_length(%1$s_indicators)<=6)', s);
    execute format('alter table public.curriculum drop constraint if exists curriculum_%s_key_range', s);
    execute format('alter table public.curriculum add constraint curriculum_%1$s_key_range check (%1$s_key between 0 and jsonb_array_length(%1$s_indicators))', s);
  end loop;
end $$;

-- Level 1: the first rung of every strand, drafted with the owner on 11 Sep 2026.
update public.curriculum set
  reading_indicators = '["Menunjuk huruf yang benar saat guru menyebutkan bunyinya — 8 dari 10 kartu huruf acak.","Menyebutkan bunyi huruf saat guru menunjuknya — 8 dari 10 huruf yang sudah diperkenalkan.","Memilih benda atau gambar yang berawal bunyi sama dengan huruf yang ditunjuk (b menjadi bola) — 4 dari 5."]'::jsonb,
  reading_key = 3,
  reading_spiral = 'Level 2 menggabungkan bunyi menjadi suku kata terbuka. Kesadaran bunyi awal di dalam kata adalah bahan mentahnya. Anak yang lolos indikator 1 dan 2 tetapi gagal indikator 3 hafal nama huruf, belum mendengar bunyinya, dan akan macet pada b + a = ba.',
  writing_indicators = '["Memegang pensil dengan jari, bukan genggaman kepal, sepanjang satu kegiatan tanpa diingatkan berulang.","Meniru 4 dari 5 bentuk dasar: garis tegak, garis datar, lingkaran, silang, dan lengkung.","Menelusuri pola tetap di dalam garis batas, keluar jalur tidak lebih dari 2 kali dalam satu lembar."]'::jsonb,
  writing_key = 2,
  writing_spiral = 'Level 2 menyalin nama sendiri dan 5 kata pendek. Lengkung dan silang adalah bahan pembentuk semua huruf; tanpa keduanya, menyalin nama menjadi kegiatan menggambar, bukan menulis.',
  math_indicators = '["Menghitung 5 benda sambil menyentuh satu per satu, tanpa terlewat atau terhitung dua kali — 4 dari 5 percobaan.","Menjawab pertanyaan ada berapa dengan menyebut bilangan terakhir, tanpa mengulang hitungan dari awal.","Mencocokkan kartu angka 1–5 dengan kumpulan benda yang jumlahnya sesuai — 4 dari 5."]'::jsonb,
  math_key = 2,
  math_spiral = 'Level 2 menghitung dan membandingkan sampai 10. Anak yang harus menghitung ulang setiap kali ditanya belum memegang jumlah sebagai satu nilai, sehingga belum dapat membandingkan mana yang lebih banyak. Indikator ini paling sering dianggap lolos padahal belum dikuasai.',
  listening_indicators = '["Melakukan instruksi satu langkah yang sudah dikenal, seperti ambil bola atau duduk, tanpa contoh gerak dari guru — 4 dari 5.","Menoleh atau menunjuk benda yang disebut namanya di antara beberapa pilihan — 4 dari 5.","Merespons saat namanya dipanggil di tengah kegiatan kelompok."]'::jsonb,
  listening_key = 1,
  listening_spiral = 'Level 2 menangkap dua kata kunci dalam percakapan sangat pendek. Selama anak masih membaca isyarat tubuh guru, yang terjadi adalah menebak, bukan menyimak bahasa.',
  speaking_indicators = '["Menjawab pertanyaan pilihan, seperti bola atau buku, dengan kata dan bukan hanya anggukan — 4 dari 5.","Menyebut minimal 5 nama benda tema dengan ucapan yang dapat dipahami guru.","Menyampaikan kebutuhan seperti minum atau ke kamar mandi dengan kata atau frasa, bukan menarik tangan atau menangis, pada dua kesempatan."]'::jsonb,
  speaking_key = 3,
  speaking_spiral = 'Level 2 menyebutkan benda, tindakan, dan kebutuhan yang dekat dengan diri. Pada indikator kunci inilah bahasa mulai menggantikan isyarat; tanpa itu, kosakata bertambah tetapi tidak dipakai.',
  ipas_indicators = '["Memilah 5 benda ke kelompok hidup dan tak hidup disertai satu alasan sederhana, misalnya bisa bergerak sendiri — 4 dari 5.","Menyebutkan anggota keluarga inti dan satu kegiatan yang dilakukan bersama.","Menyampaikan satu hasil pengamatan benda tema berupa warna, bentuk, ukuran, atau permukaan, tanpa diberi pilihan jawaban."]'::jsonb,
  ipas_key = 3,
  ipas_spiral = 'Level 2 mengenali fungsi pancaindra dan kebiasaan merawat tubuh. Level 2 hanya memberi nama pada indra yang sudah dipakai, sehingga kebiasaan mengamati mandiri harus tumbuh lebih dulu.',
  english_indicators = '["Menunjuk gambar atau benda yang benar saat guru menyebut 3 kosakata tema — 3 dari 3 pada dua kesempatan.","Menirukan pengucapan 3 kosakata itu sehingga dikenali guru.","Merespons satu sapaan kelas seperti hello atau thank you dengan kata atau gerak."]'::jsonb,
  english_key = 0,
  english_spiral = 'English Exposure adalah pengayaan dan tidak menjadi syarat naik level. Level 2 memperluas respons ke 3–5 kosakata tema.'
where level = 1;
