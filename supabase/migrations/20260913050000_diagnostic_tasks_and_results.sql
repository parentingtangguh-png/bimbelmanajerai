-- Tes Diagnostik pilot Fondasi (13 Sep 2026, disetujui pemilik).
-- B: tugas, bahan, dan ukuran tiap tugas menempel pada indikatornya, supaya indikator dan cara
--    mengujinya selalu berubah bersama. Isinya dipindahkan persis dari src/diagnostic.js.
-- C: hasil tes disimpan per indikator. Satu anak hanya dites sekali. Guru pendamping membaca hasilnya;
--    pemilik hanya melihat ringkasan level awal di tabel students.

alter table public.curriculum_level_indicators
  add column diagnostic_task text not null default '' check (length(diagnostic_task) <= 1000),
  add column diagnostic_material text not null default '' check (length(diagnostic_material) <= 1000),
  add column diagnostic_success text not null default '' check (length(diagnostic_success) <= 500),
  add column diagnostic_observe boolean not null default false;

update public.curriculum_level_indicators set diagnostic_task='Diamati sepanjang tes.', diagnostic_material='—', diagnostic_success='Bertahan sampai tugas terakhir; meninggalkan meja paling banyak 1 kali.', diagnostic_observe=true where level=1 and number=1;
update public.curriculum_level_indicators set diagnostic_task='Saat anak sibuk bermain, panggil namanya 3 kali dari samping atau belakang, di luar pandangan anak.', diagnostic_material='—', diagnostic_success='Menoleh atau menjawab 2 dari 3.', diagnostic_observe=false where level=1 and number=2;
update public.curriculum_level_indicators set diagnostic_task='5 benda di meja. Minta anak menunjuk satu per satu: "Tunjuk sendok", dan seterusnya.', diagnostic_material='Bola kecil, sendok, pensil, gelas plastik, buku.', diagnostic_success='4 dari 5 benar.', diagnostic_observe=false where level=1 and number=3;
update public.curriculum_level_indicators set diagnostic_task='Tunjukkan satu baris berisi 3 bentuk yang satu berbeda: "Mana yang tidak sama?" Ulangi untuk 4 baris.', diagnostic_material='Gambar besar di kertas, 4 baris: ● ● ▲ · ■ ■ ● · ▲ ▲ ■ · ● ■ ■', diagnostic_success='3 dari 4 benar.', diagnostic_observe=false where level=1 and number=4;
update public.curriculum_level_indicators set diagnostic_task='Contohkan garis tegak, garis datar, dan lingkaran; anak menirukan di udara dengan jari, lalu di kertas.', diagnostic_material='Kertas HVS dan krayon besar.', diagnostic_success='2 dari 3 bentuk dikenali.', diagnostic_observe=false where level=1 and number=5;
update public.curriculum_level_indicators set diagnostic_task='Mulai membilang "satu, dua…", anak melanjutkan.', diagnostic_material='—', diagnostic_success='Sampai lima berurutan. Bantuan awalan "satu, dua…" tetap ✓; ◐ bila guru harus membilang bersama sampai lima.', diagnostic_observe=false where level=1 and number=6;
update public.curriculum_level_indicators set diagnostic_task='Tanpa peragaan: "sit down", "stand up", "clap your hands".', diagnostic_material='—', diagnostic_success='2 dari 3 dilakukan tanpa contoh gerak.', diagnostic_observe=false where level=1 and number=7;
update public.curriculum_level_indicators set diagnostic_task='Diamati sepanjang tes: mau duduk bersama, mencoba meski ragu, tidak mengganggu.', diagnostic_material='—', diagnostic_success='Dicatat saja.', diagnostic_observe=true where level=1 and number=8;
update public.curriculum_level_indicators set diagnostic_task='Tunjuk huruf vokal secara acak dan minta anak menyebut namanya.', diagnostic_material='Tulis besar di kertas atau papan: A · I · U · E · O', diagnostic_success='4 dari 5 benar.', diagnostic_observe=false where level=2 and number=1;
update public.curriculum_level_indicators set diagnostic_task='Letakkan benda di meja; anak mencocokkan tiap huruf dengan benda yang berawal huruf itu.', diagnostic_material='Tulis besar: B · S · M. Benda nyata: bola · buku · sendok · sepatu · meja · mata (tunjuk mata sendiri).', diagnostic_success='4 dari 6 cocok.', diagnostic_observe=false where level=2 and number=2;
update public.curriculum_level_indicators set diagnostic_task='Hitung 7 kancing, lalu 10 kancing: "Ada berapa?"', diagnostic_material='Kancing atau balok kecil.', diagnostic_success='Keduanya benar.', diagnostic_observe=false where level=2 and number=3;
update public.curriculum_level_indicators set diagnostic_task='"Tunjuk angka …" dengan urutan 7 · 3 · 10 · 1 · 5 · 8 · 2 · 9 · 4 · 6.', diagnostic_material='Tulis besar dan acak di kertas atau papan: angka 1–10.', diagnostic_success='8 dari 10 benar.', diagnostic_observe=false where level=2 and number=4;
update public.curriculum_level_indicators set diagnostic_task='Anak melanjutkan pola merah-biru-merah-biru, lalu besar-kecil-besar-kecil.', diagnostic_material='Kancing atau balok dua warna dan dua ukuran.', diagnostic_success='Kedua pola benar.', diagnostic_observe=false where level=2 and number=5;
update public.curriculum_level_indicators set diagnostic_task='Amati cara anak memegang pensil saat menggambar bebas.', diagnostic_material='Kertas dan pensil 2B.', diagnostic_success='Pegangan jari (tiga jari), bukan kepalan.', diagnostic_observe=false where level=2 and number=6;
update public.curriculum_level_indicators set diagnostic_task='Tunjuk bola, buku, dan tas: "What is this?"', diagnostic_material='Bola, buku, tas.', diagnostic_success='2 dari 3 disebut dalam bahasa Inggris.', diagnostic_observe=false where level=2 and number=7;
update public.curriculum_level_indicators set diagnostic_task='Diamati sepanjang tes; di akhir minta anak merapikan alat tes.', diagnostic_material='—', diagnostic_success='Dicatat saja.', diagnostic_observe=true where level=2 and number=8;
update public.curriculum_level_indicators set diagnostic_task='Tunjuk suku kata secara acak; anak membacanya.', diagnostic_material='Tulis besar di kertas atau papan: ba · bi · bu · be · bo · ma · si · ku · te · lo', diagnostic_success='8 dari 10 terbaca.', diagnostic_observe=false where level=3 and number=1;
update public.curriculum_level_indicators set diagnostic_task='Sebut 5 huruf; anak menulis bentuk kapital dan kecilnya.', diagnostic_material='Kertas dan pensil. Huruf yang disebut: A, B, D, M, S — jangan ditulis atau diperlihatkan.', diagnostic_success='4 dari 5 pasang terbaca.', diagnostic_observe=false where level=3 and number=2;
update public.curriculum_level_indicators set diagnostic_task='Letakkan dua potongan kertas suku kata dalam urutan tertukar; anak menyusunnya menjadi kata lalu membacanya.', diagnostic_material='Tulis besar, satu suku kata per potongan kertas, disajikan tertukar: ku · bu → buku, ju · ba → baju, ta · ma → mata, pi · sa → sapi, ki · ka → kaki', diagnostic_success='4 dari 5 benar.', diagnostic_observe=false where level=3 and number=3;
update public.curriculum_level_indicators set diagnostic_task='Anak membilang maju 1–20, lalu mundur 20–1.', diagnostic_material='—', diagnostic_success='Maju tanpa salah; mundur salah paling banyak 2.', diagnostic_observe=false where level=3 and number=4;
update public.curriculum_level_indicators set diagnostic_task='Dua kelompok kancing: "Mana yang lebih banyak?" atau "lebih sedikit?"', diagnostic_material='Pasangan 6 & 9 · 4 & 3 · 8 & 5 · 2 & 7 · 10 & 6.', diagnostic_success='4 dari 5 benar.', diagnostic_observe=false where level=3 and number=5;
update public.curriculum_level_indicators set diagnostic_task='"Ada 3 apel, ditambah 2. Jadi berapa?" dikerjakan dengan benda.', diagnostic_material='3 + 2 · 4 + 1 · 5 + 3 · 2 + 6 · 4 + 4; kancing.', diagnostic_success='4 dari 5 benar.', diagnostic_observe=false where level=3 and number=6;
update public.curriculum_level_indicators set diagnostic_task='Ciptakan situasi: mainan dipegang guru (I want…), memilih benda kesukaan dari 3 benda (I like…), wadah yang tidak bisa dibuka anak (help me please).', diagnostic_material='Mainan; 3 benda (misalnya bola, buku, krayon); toples dengan tutup diputar kencang.', diagnostic_success='2 dari 3 diucapkan sendiri.', diagnostic_observe=false where level=3 and number=7;
update public.curriculum_level_indicators set diagnostic_task='Diamati sepanjang tes: mau membantu, berani menjawab, mendengarkan.', diagnostic_material='—', diagnostic_success='Dicatat saja.', diagnostic_observe=true where level=3 and number=8;
update public.curriculum_level_indicators set diagnostic_task='Tunjuk kata satu per satu; anak membacanya.', diagnostic_material='Tulis besar di kertas atau papan: buku · sapi · meja · topi · roda · kelapa · sepeda · kereta · sepatu · boneka', diagnostic_success='8 dari 10 terbaca.', diagnostic_observe=false where level=4 and number=1;
update public.curriculum_level_indicators set diagnostic_task='Tunjuk kalimat satu per satu; anak membacanya.', diagnostic_material='Tulis besar, satu kalimat per baris: Ibu beli roti. · Adik minum susu. · Bola itu merah. · Ayah baca buku. · Kita main di taman.', diagnostic_success='4 dari 5 terbaca utuh tanpa mengeja per suku kata.', diagnostic_observe=false where level=4 and number=2;
update public.curriculum_level_indicators set diagnostic_task='Anak menulis namanya sendiri tanpa contoh.', diagnostic_material='Kertas dan pensil.', diagnostic_success='Semua huruf lengkap dan terbaca guru.', diagnostic_observe=false where level=4 and number=3;
update public.curriculum_level_indicators set diagnostic_task='Anak menulis satu kalimat tentang benda di meja atau kegiatannya hari ini; guru boleh mengeja kata yang ditanya.', diagnostic_material='Kertas dan pensil.', diagnostic_success='1 kalimat minimal 3 kata terbaca.', diagnostic_observe=false where level=4 and number=4;
update public.curriculum_level_indicators set diagnostic_task='Anak mengurutkan 5 angka dengan menunjuk dari terkecil; lalu menunjuk yang lebih besar dari tiap pasangan.', diagnostic_material='Tulis besar dan acak. Urutkan 3 · 17 · 9 · 12 · 20; pasangan 12 & 15 · 19 & 11 · 8 & 18 · 14 & 13.', diagnostic_success='Urutan benar dan 3 dari 4 pasangan benar.', diagnostic_observe=false where level=4 and number=5;
update public.curriculum_level_indicators set diagnostic_task='Bermain toko dengan uang mainan.', diagnostic_material='Roti 3.000 + susu 5.000 · Punya 10.000, beli 4.000 · Permen 2.000 + 6.000 + 1.000 · Punya 20.000, beli 15.000 · Buku 7.000 + pensil 5.000', diagnostic_success='4 dari 5 benar.', diagnostic_observe=false where level=4 and number=6;
update public.curriculum_level_indicators set diagnostic_task='"What''s your name? How old are you?"', diagnostic_material='—', diagnostic_success='Menjawab "My name is…" dan "I am … years old".', diagnostic_observe=false where level=4 and number=7;
update public.curriculum_level_indicators set diagnostic_task='Diamati sepanjang tes: mengerjakan mandiri, bersikap hormat, siap memulai.', diagnostic_material='—', diagnostic_success='Dicatat saja.', diagnostic_observe=true where level=4 and number=8;

create table public.diagnostic_tests(
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null unique references public.students(id) on delete cascade,
  teacher_id uuid not null references public.profiles(id),
  tested_on date not null default current_date,
  start_level integer not null check (start_level between 1 and 4),
  final_level integer not null check (final_level between 1 and 4),
  beyond boolean not null default false,
  level_locked boolean not null default false,
  note text not null default '' check (length(note) <= 1500),
  created_at timestamptz not null default now()
);

create table public.diagnostic_results(
  test_id uuid not null references public.diagnostic_tests(id) on delete cascade,
  level integer not null check (level between 1 and 4),
  indicator_number integer not null check (indicator_number between 1 and 12),
  rating text not null check (rating in ('T','B','N')),
  indicator_text text not null default '' check (length(indicator_text) <= 1000),
  primary key (test_id, level, indicator_number)
);

alter table public.diagnostic_tests enable row level security;
alter table public.diagnostic_results enable row level security;
-- can_teach() juga benar untuk pemilik, jadi pemilik dikecualikan secara tegas.
create policy diagnostic_tests_read on public.diagnostic_tests for select to authenticated
  using (can_teach(student_id) and not is_owner());
create policy diagnostic_results_read on public.diagnostic_results for select to authenticated
  using (exists (select 1 from public.diagnostic_tests t where t.id = test_id and can_teach(t.student_id) and not is_owner()));
grant select on public.diagnostic_tests, public.diagnostic_results to authenticated;

-- Tuntas bila indikator 1-6 lengkap, minimal 5 T, dan tanpa N. Null bila belum lengkap dinilai.
create function public.diagnostic_level_complete(p_results jsonb, p_level integer) returns boolean
language sql immutable set search_path=public as $$
  select case when count(*) filter (where (r->>'number')::int between 1 and 6) < 6 then null
    else count(*) filter (where (r->>'number')::int between 1 and 6 and r->>'rating'='T') >= 5
     and count(*) filter (where (r->>'number')::int between 1 and 6 and r->>'rating'='N') = 0 end
  from jsonb_array_elements(p_results) r where (r->>'level')::int = p_level
$$;
revoke execute on function public.diagnostic_level_complete(jsonb, integer) from public, anon, authenticated;

-- Menyimpan satu tes diagnostik utuh: hasil per indikator, level awal, dan ringkasan, dalam satu transaksi.
-- Level awal dihitung ulang di sini dari nilai yang dikirim; aplikasi tidak dipercaya begitu saja.
create function public.save_diagnostic(p_student uuid, p_start integer, p_results jsonb, p_summary text, p_note text, p_learning_notes text)
returns integer language plpgsql security definer set search_path=public as $$
declare
  s students;
  c boolean;
  l integer;
  visited integer[] := '{}';
  v_final integer;
  v_beyond boolean := false;
  v_locked boolean;
  v_test uuid;
begin
  if is_owner() or not can_teach(p_student) then raise exception 'Tes diagnostik dilakukan oleh guru pendamping'; end if;
  select * into s from students where id = p_student for update;
  if not found then raise exception 'Siswa tidak tersedia'; end if;
  if s.status <> 'Aktif' then raise exception 'Hanya anak aktif yang bisa dites'; end if;
  if exists (select 1 from diagnostic_tests where student_id = p_student) or trim(coalesce(s.diagnostic, '')) <> '' then
    raise exception 'Anak ini sudah pernah dites diagnostik';
  end if;
  if p_start is null or p_start not between 1 and 4 then raise exception 'Titik mulai harus Level 1–4'; end if;
  if jsonb_typeof(p_results) <> 'array' then raise exception 'Hasil tes tidak valid'; end if;
  if exists (select 1 from jsonb_array_elements(p_results) r
             where coalesce(r->>'rating', '') not in ('T','B','N')
                or coalesce(r->>'level', '') !~ '^[1-4]$'
                or coalesce(r->>'number', '') !~ '^[0-9]{1,2}$'
                or not exists (select 1 from curriculum_level_indicators i
                               where i.level = (r->>'level')::int and i.number = (r->>'number')::int)) then
    raise exception 'Hasil tes memuat nilai atau indikator yang tidak dikenal';
  end if;
  if (select count(*) from jsonb_array_elements(p_results)) <>
     (select count(distinct (r->>'level', r->>'number')) from jsonb_array_elements(p_results) r) then
    raise exception 'Satu indikator dinilai lebih dari sekali';
  end if;

  -- Jalur tes yang sama dengan aplikasi: naik selama tuntas; bila titik mulai belum tuntas, turun.
  c := diagnostic_level_complete(p_results, p_start);
  if c is null then raise exception 'Level % belum selesai dinilai', p_start; end if;
  visited := array[p_start];
  if c then
    v_final := 4; v_beyond := true;
    for l in p_start + 1 .. 4 loop
      c := diagnostic_level_complete(p_results, l);
      if c is null then raise exception 'Level % belum selesai dinilai', l; end if;
      visited := visited || l;
      if not c then v_final := l; v_beyond := false; exit; end if;
    end loop;
  else
    v_final := 1;
    for l in reverse p_start - 1 .. 1 loop
      c := diagnostic_level_complete(p_results, l);
      if c is null then raise exception 'Level % belum selesai dinilai', l; end if;
      visited := visited || l;
      if c then v_final := l + 1; exit; end if;
    end loop;
  end if;
  if exists (select 1 from jsonb_array_elements(p_results) r where not ((r->>'level')::int = any (visited))) then
    raise exception 'Hasil tes memuat level di luar jalur tes';
  end if;
  if position(('Level awal: ' || v_final) in coalesce(p_summary, '')) = 0 then
    raise exception 'Ringkasan tidak sesuai dengan level awal hasil tes';
  end if;
  if length(p_summary) > 3000 or length(coalesce(p_learning_notes, '')) > 3000 then raise exception 'Catatan maksimal 3000 karakter'; end if;

  v_locked := exists (select 1 from session_students where student_id = p_student);
  if not v_locked then perform correct_student_baseline(p_student, v_final, v_final); end if;

  insert into diagnostic_tests(student_id, teacher_id, start_level, final_level, beyond, level_locked, note)
  values (p_student, auth.uid(), p_start, v_final, v_beyond, v_locked, left(trim(coalesce(p_note, '')), 1500))
  returning id into v_test;
  insert into diagnostic_results(test_id, level, indicator_number, rating, indicator_text)
  select v_test, (r->>'level')::int, (r->>'number')::int, r->>'rating', i.text
  from jsonb_array_elements(p_results) r
  join curriculum_level_indicators i on i.level = (r->>'level')::int and i.number = (r->>'number')::int;

  update students set diagnostic = p_summary, learning_notes = coalesce(p_learning_notes, '') where id = p_student;
  return v_final;
end $$;
revoke execute on function public.save_diagnostic(uuid, integer, jsonb, text, text, text) from public, anon;
grant execute on function public.save_diagnostic(uuid, integer, jsonb, text, text, text) to authenticated;
