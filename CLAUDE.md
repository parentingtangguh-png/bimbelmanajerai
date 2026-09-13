# Rumah Belajar Rainbow Kids Alfatih — catatan kerja untuk Claude

Baca file ini dulu sebelum mengubah apa pun. Pengguna (pemilik bimbel) berkomunikasi dalam **bahasa Indonesia**; jawab dalam bahasa Indonesia.

Berkas ini menggambarkan **keadaan sekarang**, bukan riwayat. Kalau sesuatu di sini bertentangan dengan kode, kodenya yang benar — perbarui berkas ini.

## Proyek
- Aplikasi web internal bimbel tematik multigrade. Frontend vanilla JS + Vite, backend Supabase (Postgres + RLS + Auth + Edge Function `generate-learning` untuk panduan kelas/rapor AI via Anthropic).
- GitHub: `parentingtangguh-png/bimbelmanajerai` (repo **publik** — jangan commit data pribadi, email guru, atau secret).
- Supabase project ref: `ypofmienpffbpgrwpclm` (sudah ter-link di `supabase/.temp`).
- Situs live (GitHub Pages, deploy otomatis saat push ke `main`): https://parentingtangguh-png.github.io/bimbelmanajerai/
- **Satu bimbel, satu pemasangan.** Bukan multi-tenant dan tidak akan dibagikan ke bimbel lain.

## Aturan bisnis yang sudah diputuskan pengguna
- **Guru** mengelola siswanya sendiri: tambah siswa (otomatis milik guru pembuat), Tes Diagnostik, profil, status (Nonaktifkan/Aktifkan kembali), hapus siswa (hanya bila belum pernah ikut kelas dan tidak dibagi guru lain), sesi jadwal rutin, kelas, evaluasi, rapor, dan ujian sumatif.
- **Pemilik** hanya membaca data umum, mendaftarkan guru (Tim pengajar), dan mengedit kurikulum. Pemilik tidak membuka kelas, tidak menambah siswa, tidak menugaskan guru. Database menolak semua jalur tulis pemilik ke data siswa/kelas.
- **Isolasi antar guru** wajib: RLS + RPC `security definer` yang memeriksa `can_teach` / `can_access_session`. Ada tes isolasi dua guru di `tests/database.test.mjs`.
- **Level**: 16 level (1–4 Fondasi, 5–8 Fase A/SD 1–2, 9–12 Fase B/SD 3–4, 13–16 Fase C/SD 5–6). Guru hanya mengisi **titik awal**, lewat Tes Diagnostik; bisa dikoreksi (`correct_student_baseline`) hanya sebelum anak ikut kelas pertama. Aturan ini tetap berlaku walau Tes Diagnostik bisa dijalankan kapan saja (lihat bagian Siswa dan Tes Diagnostik).
- **Target mengalir per fase**: target = akhir fase level saat ini. Tidak ada input target manual. Lulus ujian sumatif fase memindahkan target ke akhir fase berikutnya; lulus di akhir Fase C = status Lulus.
- Naik level: dua bukti "Tercapai" pada kesempatan berbeda. Alarm setelah 3 kali BT/MB berturut-turut.
- **Indikator disusun per untaian, bukan per level.** Karena 16 level adalah satu spiral, indikator satu bidang ditulis menurun dari Level 1 sampai 16 agar kedalamannya bertambah konsisten. Jangan pernah mengarang indikator di kartu evaluasi: sumbernya selalu tabel `curriculum`.
- Tiap level punya satu **simpul spiral** (`<bidang>_key` = nomor indikator, `<bidang>_spiral` = alasan level berikutnya menuntut hal itu). Level 16 memakai `_spiral` sebagai penutup tangga/kelulusan. English Exposure sengaja `_key=0` di semua level: pengayaan, tidak pernah menahan kenaikan.
- Siswa dengan sesi yang belum dievaluasi tidak boleh dinonaktifkan (dijaga di UI dan DB).

## Keputusan final — jangan ditawarkan lagi
- **Tidak memasang SMTP sendiri.** Guru baru dibuat lewat Supabase Dashboard → Authentication → Add user dengan **Auto Confirm**, setelah emailnya didaftarkan di Tim pengajar. Itu alur tetap, bukan jalan darurat.
- **Tidak dibagikan ke bimbel lain.** Tidak perlu multi-tenant, halaman pemasangan, `install.sql`, atau nama bimbel yang bisa dikonfigurasi.
- **Mode pratinjau dihapus** (12 Sep 2026). Tidak ada lagi cara masuk tanpa akun. Jangan menghidupkannya kembali tanpa diminta.
- **13 Sep 2026 semua data dummy dihapus atas izin pengguna**: siswa, level per bidang, relasi siswa-guru, alarm, sesi kelas, kehadiran, evaluasi, observasi, pekerjaan AI, sesi jadwal beserta anggotanya, dan tema. `curriculum`, `profiles`, dan `access_list` utuh. Siswa yang ada sesudah itu adalah input pengguna sendiri. (Penurunan 24 → 8 pada 11 Sep juga sengaja.) Bukan insiden.
- Mockup lama `docs/mockups/indicator-*.png` **usang** — memakai kerangka per-level yang ditolak pengguna.

## Alur kerja yang diharapkan pengguna
1. Kerjakan perubahan, jalankan `npm test`, `npm run build`, `npx playwright test`. Bila ada perubahan tampilan, buktikan (lihat Resep di bawah).
2. Laporkan hasil, lalu **minta persetujuan** sebelum deploy. Pengguna selalu menyetujui deploy secara eksplisit.
3. Setelah disetujui: `npx --no-install supabase db push --dry-run` → pastikan hanya migrasi baru yang tertunda → `npx --no-install supabase db push --yes` → baru commit & push (migrasi **harus** masuk sebelum frontend yang memakainya).
4. Tunggu GitHub Actions selesai, lalu verifikasi berkas JS di situs live memuat kode baru.
- Untuk perubahan besar pada isi kurikulum: **tunjukkan draf teks lebih dulu**, tunggu persetujuan, baru tulis ke migrasi.
- Untuk pertanyaan data produksi gunakan query **baca saja**: `npx --no-install supabase db query --linked "<satu baris SQL>"`.

## Susunan kode
- `src/main.js` (~35 KB) hanya sambungan: klien Supabase, login, `refresh`, `render`, dan semua penangan klik/submit.
- Tiap layar punya berkasnya sendiri di `src/views/`: `dashboard.js`, `students.js`, `sessions.js`, `curriculum.js`, `team.js`, dan `home.js` (menu utama, kepala, doa, dan navbar khusus HP).
- Dipakai bersama: `src/state.js` (state + konstanta + pembaca data, **tanpa DOM**) dan `src/ui.js` (`field`, `select`, `area`, `empty`, `heading`, `meter`, `modal`, `notify`).
- **Aturan yang menjaga semuanya tetap terpisah:** view hanya menyusun teks HTML. View tidak boleh memanggil `db`, `result`, `render`, atau `notify` — semua aksi lewat atribut `data-action`/`data-form` yang ditangani di `main.js`.
- View menyusun HTML lewat fungsi kecil bernama (`cardHeading`, `attendanceForm`, `evaluationSection`, `reportSection`, `classGuide`, `statBand`, `journeyPanel`, …). Kalau menambah bagian, **buat fungsi baru** — jangan menyambung ke template yang sudah panjang.
- Kode diformat **Prettier** (`.prettierrc.json`, lebar 110). Jalankan `npx prettier --write` setelah mengedit.

## Menguji
- `npm test` → `scripts/check-imports.mjs` lebih dulu, lalu 56 tes Node: domain, database (PGlite menjalankan semua migrasi), dan **render**.
- `tests/render.test.mjs` memanggil fungsi layar langsung dengan data contoh `tests/fixtures/sample-state.mjs` — tanpa browser, tanpa login. **Inilah satu-satunya tes yang menjangkau kartu evaluasi.** Kalau menambah fitur di layar mana pun, tambahkan tesnya di sini.
- `npx playwright test` hanya menguji layar login (aplikasi memuat, tanpa galat, tidak meluber di 390px). Lebih dari itu tidak mungkin tanpa akun. Tesnya mencari teks login (`Assalamu’alaikum`, tombol `Masuk`, `Aktifkan akun`); kalau teks login diubah, perbarui tesnya.
- ⚠ **Jalur simpan di `main.js` tidak dijangkau tes mana pun.** Tes render hanya menyusun HTML, tidak menekan tombol simpan. 13 Sep 2026 simpan profil siswa selalu ditolak ("Tanggal lahir wajib diisi") karena `main.js` hanya meneruskan enam kolom lama ke `update_student_profile`, sementara 56 tes hijau. Setiap perubahan pada payload RPC harus dicoba di aplikasi yang sudah login: simpan sungguhan, lalu periksa hasilnya dengan query baca saja.
- **Playwright pernah rapuh pada server dingin** — sudah diperbaiki 12 Sep 2026 dengan menaikkan `timeout` ke 60 dtk dan `expect.timeout` ke 20 dtk di `playwright.config.js`. Vite dingin butuh ~10 dtk sampai layar login tampil, sedangkan `toBeVisible` bawaan menyerah di 5 dtk; halaman masih "Memuat…" lalu tes gagal padahal kodenya benar. Kalau gagal lagi: itu waktu, bukan kode — jalankan sekali lagi, atau hidupkan dev server dulu supaya Playwright memakainya (`reuseExistingServer:true`), lalu pastikan server itu memuat kode terbaru. Jangan turunkan lagi ambang batasnya.
- `admin()` di tes database = setup data tanpa peran pengguna.

## Resep perintah singkat
Pengguna cukup menyebut perintah pendek; ini yang harus dikerjakan.

**"lanjutkan kurikulum <bidang> <level>"**
1. Baca tujuan level itu dan level sesudahnya dari tabel `curriculum`. 2. Susun 3 indikator + simpul spiral, **tampilkan sebagai teks** untuk disetujui. 3. Setelah disetujui: migrasi baru, perluas peta cakupan di `tests/database.test.mjs`, `npm test`, lalu minta izin deploy.

**"ubah tampilan X"**
1. `node scripts/render-screens.mjs sebelum.html`. 2. Ubah kode. 3. `node scripts/render-screens.mjs sesudah.html` lalu bandingkan — untuk perombakan yang tidak boleh mengubah tampilan, HTML wajib identik. 4. `npm test` + `npx playwright test`. 5. Perubahan tampilan yang perlu dilihat mata: minta pengguna login di pane browser (lihat catatan di bawah).

**"rapikan kode"**
`npx prettier --write "src/**/*.js" "src/*.css" "tests/**/*.js"`, lalu buktikan bundel hasil build tidak berubah: bandingkan `md5sum dist/assets/index-*.js` sebelum dan sesudah.
⚠ **Jangan memasukkan `tests/**/*.mjs` ke glob itu.** `tests/database.test.mjs` dan `tests/domain.test.mjs` sengaja bergaya padat; sekali diformat, diff-nya membengkak 1.600+ baris dan menenggelamkan perubahan asli. (`render.test.mjs` dan `fixtures/sample-state.mjs` sudah terformat, jadi keduanya aman.)

**"deploy"**
Ikuti Alur kerja langkah 3–4. Jangan pernah push tanpa persetujuan lebih dulu.

**"periksa data produksi"**
`npx --no-install supabase db query --linked "<SQL satu baris>"` — hanya SELECT.

## Jebakan teknis (Windows PowerShell 5.1)
- **`npm run build` hijau tidak membuktikan impor benar.** Bundler menggabungkan semua modul jadi satu lingkup, jadi nama yang lupa diimpor tetap ketemu; dev server (modul terpisah) baru melempar galat. Karena itu `npm test` menjalankan `scripts/check-imports.mjs` lebih dulu.
- **Jangan tinggalkan dev server berjalan saat mengubah banyak berkas.** `playwright.config.js` memakai `reuseExistingServer:true`, jadi Playwright memakai server lama yang modulnya basi — tes gagal karena server, bukan kode. Pernah membuang waktu lama pada 12 Sep 2026. Periksa: `netstat -ano | findstr :5173`.
- **Vite basi bisa menyajikan `style.css` kosong.** 13 Sep 2026, setelah belasan HMR beruntun, aplikasi tampil tanpa gaya sama sekali. Berkasnya sehat (UTF-8 valid, tanpa NUL), tapi `<style>` hasil suntikan Vite panjangnya 0. Obatnya: matikan server, hapus `node_modules/.vite`, lalu jalankan ulang. Jangan mengubah CSS untuk "memperbaikinya".
- **`check-imports.mjs` mencocokkan kata, bukan rujukan.** Kata `dashboard` di dalam string atau kunci objek pun dianggap fungsi `dashboard` yang lupa diimpor. Karena itu `home.js` mengambil kunci layar dari `homeKeys` di `state.js`. Jangan melemahkan pemeriksanya.
- **`<footer class="home-doa">` juga anak `.workspace`.** Aturan yang menyembunyikan kaki halaman aplikasi wajib `.workspace > footer:not(.home-doa)`. Tanpa `:not()`, doa hilang di semua tab; ini terjadi dua kali pada 13 Sep 2026. `footer` global juga memakai `display:flex` dan huruf 9px, jadi `.home-doa` menimpanya.
- **Modal yang terbuka (`<dialog>`) ada di lapisan paling atas layar.** Elemen yang ditempel ke `body` tertutup olehnya. `notify()` menempel pesan ke `dialog[open]` bila ada; ikuti pola ini untuk elemen melayang lain.
- **Skrip Python yang mengganti teks harus memakai `assert` untuk tiap penggantian.** Prettier memecah baris panjang, sehingga penanda yang disalin dari versi sebelum diformat tidak cocok lagi, dan `str.replace` gagal diam-diam. Blok CSS navbar pernah tidak terpasang karena hal ini.
- Keluaran `supabase db query` diakhiri pemberitahuan versi CLI baru, jadi tidak bisa langsung di-`JSON.parse`. Buang stderr dan ambil baris `"rows"`.
- Pesan commit: jangan pakai tanda kutip ganda di here-string; pakai `git commit -F <file>`.
- Skrip bantu dengan tanda kutip/escape rumit sering gagal lewat heredoc bash — tulis berkas skripnya dengan tool Write, lalu jalankan dengan `node`.
- `supabase db query` dengan SQL multi-baris mengembalikan kosong → tulis SQL **satu baris**. Multi-statement hanya mengembalikan hasil terakhir.
- Setelah edit besar pada berkas JS, pastikan tidak ada byte NUL: `node -e "const b=require('fs').readFileSync('src/main.js');console.log(b.filter(x=>x===0).length)"` harus 0.
- CSS memberi `display` ke `label`, jadi atribut `hidden` dipaksa lewat `[hidden]{display:none!important}` (`src/student-form.css`).
- Berkas CSS pernah menyimpan tanda `—` sebagai satu byte CP1252 sehingga bukan UTF-8 valid. Sudah diperbaiki; jangan menulis ulang berkas CSS dengan pengodean lain.

## ⚠ Kurikulum sedang direvisi (13 Sep 2026)
- Atas permintaan pemilik, isi tabel `curriculum` **dikosongkan** (`20260913020000_clear_curriculum.sql`); tabel dan kolom masih bentuk lama. Penjaga isi di `tests/database.test.mjs` (peta cakupan, jangkar Matematika, pencocokan indikator–tujuan) ikut dihapus. Teks lama tetap ada di migrasi sebelumnya.
- **Fase Fondasi jadi pilot.** Kurikulum barunya disetujui pemilik kata demi kata dan dipasang di `20260913030000_fondasi_pilot_curriculum.sql`:
  - Tabel `curriculum_phases` (CP), `curriculum_levels` (judul + deskripsi), `curriculum_level_indicators` (8 per level; kolom area bernama `domain`, karena kata `area` memicu `check-imports`), dan `curriculum_themes` (8 tema × 24 pertemuan).
  - Level milik anak secara utuh. Anggota membaca, pemilik hanya bisa UPDATE teks; baris ditambah lewat migrasi.
  - Deskriptor tema (`20260913040000_theme_descriptors.sql`): `description`, `focus_areas`, `focus_indicators` (`text[]` berisi `L<level>-<nomor>`; tes menolak kode yang tidak ada di kurikulum), `character_focus`, `english_words`.
  - Tab Kurikulum menampilkan CP → kartu level → daftar tema yang bisa dibuka (`themeDetail`, kode indikator fokus diterjemahkan ke teksnya).
  - Deploy GitHub Actions pernah tersangkut *Queued* ±40 menit (#72, 13 Sep 2026) padahal status GitHub normal. Obatnya: pemilik membatalkan (Cancel workflow) lalu Re-run all jobs dari akun GitHub-nya; `gh` tidak terpasang, jadi Claude tidak bisa melakukannya. Editor kurikulum lama dihapus dari `main.js`.
  - Tabel `curriculum` lama (kosong) masih dibaca kartu evaluasi, `levelMeaning`, dan rapor AI.
- Rancangan alur pilot dari pemilik (belum dibangun): tema menurut nomor pertemuan; lembar aktivitas per pertemuan (pembuka + English phrase, aktivitas utama dengan tugas otomatis per level anak, penutup + checklist karakter); guru memilih yang hadir lalu menandai pertemuan selesai. Belum diputuskan: cara naik level, sumber isi 192 lembar, cara menghitung nomor pertemuan, 5 butir checklist karakter, dan rapor.
- **Tes Diagnostik pilot Fondasi — kerangka disetujui pemilik 13 Sep 2026, belum dipasang di aplikasi:**
  - Tes perorangan ±20–25 menit. Tiap indikator 1–8 punya satu tugas + ukuran; hasil ✓ Tercapai / ◐ Dengan bantuan / ✗ Belum.
  - **Titik mulai dipilih bebas oleh guru** (L1–4); kelas formal hanya ditampilkan sebagai saran (Belum sekolah→1, TK A→2, TK B→3, SD→4).
  - **Tuntas** = indikator 1–6 minimal 5 ✓ dan tanpa ✗. English (7) dan Karakter (8) dicatat, **tidak menentukan level**.
  - Tuntas → naik; belum tuntas → level itu jadi level awal; bila titik mulai belum tuntas, turun sampai level terendah yang belum tuntas.
  - Tuntas Level 4 → level awal 4 dengan catatan "melampaui Fondasi".
  - Bahan tes: satu set tetap, disetujui pemilik, **tanpa berkas cetak**. Tugas, bahan, dan ukuran tampil di modal.
  - **Jeda dan revisi** (`20260913060000_diagnostic_revision.sql`):
    - Jawaban tes yang belum disimpan tersimpan di localStorage `bimbel.diagnostic.<user id>`, per anak, setiap kali nilai dipilih. Tes bisa dilanjutkan di perangkat yang sama.
    - Hasil tersimpan bisa **direvisi** oleh guru pendamping, hanya **sebelum anak ikut kelas pertama**; level awal dihitung ulang. Hanya hasil terakhir yang disimpan, dengan `revised_at`.
    - `save_diagnostic` menangani simpan pertama dan revisi. `diagnosticPath` memangkas level di luar jalur saat nilai berubah.
  - Keputusan tambahan: **satu tes per anak** (bisa direvisi, lihat di atas); pemilik hanya melihat ringkasan level awal (tanpa hasil per indikator); anak yang sudah ikut kelas tetap boleh dites, levelnya tidak berubah.
  - Tugas diamati sepanjang tes (L1-1 dan semua indikator 8) tampil di bagian paling bawah tiap level.
  - Migrasi `20260913050000_diagnostic_tasks_and_results.sql`:
    - **Tugas menempel pada indikator**: kolom `diagnostic_task`, `diagnostic_material`, `diagnostic_success`, `diagnostic_observe` di `curriculum_level_indicators`. Tidak ada lagi data tugas di kode.
    - **Hasil per indikator**: tabel `diagnostic_tests` (unik per siswa) dan `diagnostic_results` (menyalin `indicator_text`). Keduanya dibaca guru pendamping lewat RLS `can_teach(...) and not is_owner()`; tidak ada izin tulis langsung.
    - `save_diagnostic(uuid,int,jsonb,text,text,text)` menyimpan semuanya dalam satu transaksi dan **menghitung ulang jalur tes serta level awal** di database (`diagnostic_level_complete`). Ringkasan wajib memuat `Level awal: N` hasil hitungan database.
  - Kode:
    - `src/diagnostic.js` (murni): `taskOrder`, `diagnosticPayload`, `levelComplete`, `diagnosticPlan`, `diagnosticSummary`, `suggestedStart`. Aturan yang sama dijaga dua kali: di sini untuk tampilan, di `save_diagnostic` untuk menolak.
    - `src/views/diagnostic.js`: modal tiga langkah `diagnostic-start` → `diagnostic-level` → `diagnostic`. Jawaban disimpan di `state.diagnostic`; tombol Kembali memindahkan jawaban ke `draft` sebagai isian awal.
    - Hasil tes tampil di profil siswa (`diagnosticResultSection`); tugas tiap indikator tampil di tab Kurikulum (`indicatorTest`).
  - Level awal pilot memakai kolom level lama (`reading_baseline` = `math_baseline` = level Fondasi); kartu evaluasi per bidang belum dirancang ulang.
- Bagian di bawah menggambarkan kurikulum **lama** yang sudah dihapus; perbarui setelah kurikulum baru dipasang.

## Keadaan kurikulum lama (sudah dihapus)
Indikator **lengkap**: 16 level × 6 bidang wajib (Menyimak, Berbicara, Membaca, Menulis, Matematika, IPAS), masing-masing 3 indikator + simpul spiral, plus English Exposure 16 level tanpa simpul. Tidak ada lubang; `tests/database.test.mjs` memakai peta cakupan yang menolak satu kotak kosong pun.
- Kolom di `curriculum`: `<bidang>`, `<bidang>_criteria`, `<bidang>_indicators` (jsonb, maks 6), `<bidang>_key`, `<bidang>_spiral`. Pemilik mengedit; guru membaca.
- Tab Kurikulum: **Per untaian** (default; satu bidang menurun 16 level dengan kotak simpul di antaranya) dan **Per level**.
- Kartu evaluasi menampilkan tujuan level, indikator yang bisa dicentang, saran penilaian otomatis ("2 dari 3 → MB", hanya saran), dan baris riwayat "pernah terlihat di sesi sebelumnya".
- Busur antar fase: Fondasi menirukan → memegang satuan lebih besar; Fase A mengerjakan → memilih dan memeriksa; Fase B satu sumber → beberapa sumber dan bersedia berubah oleh bukti; Fase C menimbang dan memutuskan sendiri lalu mempertanggungjawabkannya.

## Indikator harus menempel pada tujuan levelnya sendiri
- Ditemukan 12 Sep 2026 lewat smoke test: **indikator Matematika level 6–14 adalah milik level lain** — kartu Level 6 menampilkan tujuan "tambah-kurang sampai 100" bersama indikator "sampai 1.000". Guru menilai anak satu tingkat terlalu sulit, dan simpul spiral berbintang menahan kenaikan atas hal yang belum menjadi tujuan level itu. Level 1–5, 15, 16 dan semua bidang lain tidak terkena. Sudah diperbaiki di `20260912070000_math_indicators_realign.sql`.
- Peta cakupan lama **lolos meski bug-nya ada**, karena hanya menghitung jumlah indikator. Sekarang ada dua penjaga di `tests/database.test.mjs`, keduanya terbukti gagal pada data lama:
  1. **Penjaga umum, semua bidang**: indikator 1–2 wajib berbagi kata dengan tujuan levelnya sendiri. Ambangnya tegas — nol kesamaan dengan tujuan sendiri padahal ada dengan tujuan berikutnya — supaya level bertetangga yang wajar memakai kata serupa tidak menyalakan alarm palsu. Indikator ke-3 dikecualikan karena simpul memang menunjuk ke depan.
  2. **Jangkar Matematika**: kata kunci wajib pada indikator pertama level 6–16, plus simpul level N menyebut Level N+1.
- Diperiksa menyeluruh 12 Sep 2026 setelah perbaikan: 16 level × 6 bidang inti + English, semua simpul menunjuk indikator yang ada, semua teks simpul menyebut level berikutnya, English `_key=0` di semua level, dan **tidak ada bidang lain yang bergeser**. Yang tidak bisa diperiksa mesin: mutu pedagogisnya — apakah indikatornya teramati, wajar untuk usianya, dan layak dinilai. Itu ranah pemilik.
- Aturannya: indikator 1–2 menguji **tujuan level itu**, indikator ke-3 adalah **simpul** yang menjembatani ke tujuan level berikutnya. Kalau menambah indikator bidang lain, ikuti pola ini dan tambahkan jangkarnya ke tes.

## Rapor AI (`supabase/functions/generate-learning`)
- Rapor **tidak lagi menerima `panduan_kelas`**. Dulu seluruh panduan (~10.000 karakter) dikirim untuk pesan 200 kata: boros, dan menjadi sumber karangan — panduan memuat aktivitas semua kelompok, jadi model mengklaim anak melakukan hal yang tidak pernah dicatat guru. Sumber kebenaran satu-satunya adalah `tujuan`, `kriteria`, dan `catatan_bukti` pada target. Masukan turun 12.534 → 2.274 karakter (**−82%**), `max_tokens` 1000 → 700.
- Draf ditempel ke WhatsApp, yang **tidak mengenal `**tebal**`** — bintangnya tampil apa adanya. Prompt meminta teks biasa, dan `stripMarkdown` membuang sisa markdown yang lolos. Panduan kelas **tetap** boleh markdown.
- `FOREIGN` membuang aksara di luar Latin/tanda baca/emoji. Model kecil sesekali menyisipkan karakter asing — sebuah "ย" Thai pernah lolos ke rapor orang tua pada 12 Sep 2026. Prompt saja tidak cukup; ini penyaring deterministik. Regex ditulis dengan escape `\uXXXX` **sebagai teks** karena memuat karakter tak terlihat (ZWJ, variation selector); jangan menulisnya sebagai karakter literal.
- Deploy terpisah dari frontend: `npx --no-install supabase functions deploy generate-learning`.
- Fungsi ini masih membaca `interest` (minat) sebagai `minat`. Sejak 13 Sep 2026 minat tidak lagi ditanyakan, jadi nilainya selalu kosong. Fungsi ini juga belum memakai `nickname`. Belum diubah.
- ⚠ **Edge Function tidak punya tes otomatis.** `npm test` tidak menyentuhnya sama sekali; Deno juga tidak terpasang lokal, jadi galat sintaks baru ketahuan saat deploy. Setelah mengubahnya, buat satu rapor sungguhan dan baca hasilnya.

## Mengoreksi dan membatalkan (12 Sep 2026)
- **Koreksi evaluasi** — `reopen_evaluation(uuid)`. Menyelesaikan evaluasi memindahkan level, `evidence_count`, `repeat_count`, dan alarm; membalik aritmetikanya mustahil karena satu keadaan akhir bisa berasal dari beberapa keadaan awal. Jadi `finalize_competency_evaluation` **memotret** baris `student_competencies` ke `session_competency_snapshots` sebelum mengubah apa pun, dan membuka kembali mengembalikan potret itu persis. Kalau menambah efek baru pada finalisasi, pastikan efeknya ikut terpotret.
- Hanya evaluasi **terakhir** anak yang bisa dibuka (potret lama akan menghapus kemajuan sesudahnya), bukan milik anak yang sudah Lulus, dan tidak saat anak punya sesi terbuka. Aturan sama dijaga dua kali: `canReopen` di `state.js` untuk menampilkan tombol, dan RPC-nya untuk menolak.
- Jawaban guru sengaja **tidak** dihapus saat dibuka kembali, supaya ia mengoreksi di atas yang sudah diketik.
- **Batalkan sesi** — `delete_class(uuid)`. Hanya sesi yang **belum** punya satu pun evaluasi tersimpan. Ini menutup jebakan lama: anak dengan sesi belum dievaluasi tidak bisa ikut kelas lain, tidak bisa dinonaktifkan, dan tidak bisa dihapus, jadi satu sesi salah buka mengunci semua anak di dalamnya. `ai_jobs` dan `session_students` tidak punya `on delete cascade`, jadi RPC menghapusnya berurutan.
- Daftar Ruang kelas terbagi "Belum selesai dievaluasi" (selalu tampil, itu antrean kerja guru) dan "Sudah selesai" (10 terbaru, sisanya lewat tombol; `state.allSessions`).

## Centang indikator
- Tabel `session_indicator_checks` (session_student_id, subject, indicator_index, level_snapshot, indicator_text, checked_at). Teks indikator disalin saat dicentang supaya riwayat tetap terbaca kalau pemilik mengubah kurikulum.
- Disimpan lewat RPC `set_indicator_check(uuid,text,integer,boolean,text)` **saat guru mencentang**, bukan saat evaluasi disimpan, supaya guru bisa mencentang selama kegiatan berlangsung. Ditolak bila sesi sudah final, anak tidak hadir, atau bidang bukan target sesi itu.
- Centang **tidak** mengubah nilai formatif. Saran tetap saran; keputusan di tangan guru.

## Catatan lain
- Ganti kata sandi: tombol ⚿ di kartu akun (sidebar) → `db.auth.updateUser`. Minimal 8 karakter, diketik dua kali. **Claude tidak pernah mengetikkan kata sandi pengguna.**
- Karena pratinjau dihapus, Claude **tidak bisa memeriksa tampilan di balik login sendirian**. Bila perlu, minta pengguna login di pane browser, lalu periksa lewat `mcp__Claude_Browser__*`. Jangan mengubah data produksi; bila terpaksa mencoba (mis. mencentang indikator), **kembalikan seperti semula** dan buktikan dengan query.
- Berkas tidak dilacak yang **bukan** buatan Claude: `scripts/.tmp-inspect-hafsah.ps1`, `scripts/.tmp-run-hafsah-scenario.ps1`. Sejak 12 Sep 2026 `.gitignore` mengabaikan `scripts/.tmp-*` dan `.claude/`, jadi skrip coba-coba sekali pakai aman diberi awalan `.tmp-` — repo ini publik.
- Yang masih terbuka (hanya bila pengguna meminta):
  - **Pengaturan anggota sesi jadwal tidak bisa dibuka dari mana pun.** Tombol Ubah dihapus dari tab Siswa atas permintaan pengguna. `scheduleForm` dan penangan `edit-schedule` masih ada. Usulan: pindahkan ke Ruang kelas, di dekat "＋ Buat sesi jadwal".
  - Kolom "Hasil diagnostik awal" di **profil** siswa masih bisa diisi. Kalau diisi dari sana, tanda "Belum tes diagnostik" hilang tanpa Tes Diagnostik pernah dijalankan.
  - Keterangan kelompok non-aktif masih menyebut "tidak ikut sesi kelas".
  - Rapor AI: lihat bagian Rapor AI.
  - Baris terpanjang tersisa ~691 karakter di `views/curriculum.js`.
  - Baris siswa menampilkan rata-rata Bahasa Indonesia, sehingga ketimpangan antar bidang tersembunyi.
  - Layar Kurikulum belum diperiksa untuk kenyamanan di HP.
- Semua layar sudah dipecah jadi fungsi kecil 12 Sep 2026: `views/sessions.js` (max 434), `views/dashboard.js` (366), `views/students.js` (362), `src/main.js` (346), `views/team.js` (199). Rangka aplikasi di main.js sekarang `sidebar`/`navButtons`/`accountCard`/`topbar`/`loginStory`/`loginForm`/`passwordForm`/`curriculumFieldset`.
- Cara membuktikan perombakan tanpa perubahan tampilan, tiga lapis sesuai jangkauannya:
  1. Layar biasa → `node scripts/render-screens.mjs` sebelum/sesudah harus md5 sama.
  2. Layar login di `main.js` → skrip itu tidak menjangkau; bandingkan `document.querySelector('main.login').outerHTML` di pane browser sebelum dan sesudah.
  3. `studentForm`/`scheduleForm` → keduanya menulis lewat `modal()` yang butuh DOM. Jalankan skrip sekali pakai yang memalsukan `globalThis.document = { querySelector: () => ({ set innerHTML(v){...}, showModal(){} }) }`, impor versi lama (`git show HEAD:src/views/students.js`) dan versi baru berdampingan, lalu bandingkan hasilnya untuk peran guru dan pemilik.

## Tampilan HP (≤620px), 13 Sep 2026
- **Aplikasi sudah bertema gelap emas.** `:root` pertama di `style.css` bertema terang, tapi blok "dark gold theme" di sekitar baris 1580 menimpanya: latar `#0d0f0d`, `--green` sebenarnya emas `#c79a3b`. Jangan menilai tema dari `:root` pertama; kesalahan ini pernah membuat Claude menawarkan pilihan terang/gelap yang tidak perlu.
- Di bawah 620px sidebar dan topbar disembunyikan. Semua tab memakai `homeTop` (logo daun, nama bimbel, ilustrasi guru, tombol keluar merah) dan `homeDoa` (doa harian + ganti kata sandi). Logo di kepala adalah jalan pulang ke menu. Di atas 620px semua ini `display:none`; layar lebar tidak berubah (dibuktikan md5 `render-screens.mjs`).
- **Menu utama** (`homeMenu`, hanya di view `dashboard`): sapaan Assalamu'alaikum, tanggal, slogan, daun samar sebagai latar, dan empat kartu. Guru: Ruang kelas (melintang), Ringkasan, Data siswa, Kurikulum (melintang). Pemilik: Tim pengajar menggantikan Ruang kelas.
- **Navbar bawah** (`homeNav`): Ringkasan · Siswa · Ruang kelas · Kurikulum, dengan urutan dan nama sesuai permintaan pengguna. Untuk pemilik, posisi ketiga diisi Tim pengajar. Ikon Ringkasan sengaja rumah karena tujuannya menu. Tes render mengunci urutan ini.
- **Slogan**: 8 kalimat amanah → nilai → kepercayaan, berganti per potongan 30 menit dari nomor potongannya (bukan `Math.random()`); timer belum ada, jadi slogan berganti saat layar digambar ulang. **Doa**: 7 doa `[arab, arti, sumber]`, berganti sekali sehari dengan rumus `reminderOfTheDay`. Teks doa sudah diperiksa dan diterima pengguna; jangan disunting tanpa diminta.
- Pita pengingat harian (`.reminder`) disembunyikan di HP; di layar lebar tetap tampil.
- Label kecil di atas judul tab (`.page-heading .eyebrow`) di HP 10,5px emas; sebelumnya 8px abu-abu dan hampir tak terbaca.
- **Layar login di HP**: logo daun + nama bimbel, daun besar samar di belakang judul, satu permukaan gelap tanpa panel hijau, "Kemajuan berarti." dalam serif emas. Teks login (berlaku juga di layar lebar): judul form "Assalamu'alaikum", "Masuk dengan akun guru atau pemilik.", tombol "Masuk →", tautan "Guru baru? Aktifkan akun yang sudah didaftarkan pemilik". Label "RUANG TUMBUH BERSAMA" dan "RUMAH BELAJAR / 02" dihapus. Daun login dipotong di `.login` (sumbu x saja); kalau `.login-story` yang memotong, daun terpenggal.
- Memeriksa tampilan HP tanpa login: skrip sekali pakai `scripts/.tmp-*.mjs` menyusun `homeMenu`/`homeTop`/`homeDoa`/`homeNav` dengan `style.css` sungguhan ke `public/.tmp-*.html`, lalu dibuka lewat dev server (halaman `file://` tidak bisa diubah lebar viewport-nya di pane). Layar login bisa dipotret Playwright dari konteks yang belum login tanpa memutus sesi pengguna di pane. Hapus berkas sementaranya sesudah dipakai.

## Siswa dan Tes Diagnostik, 13 Sep 2026
- **Tab Siswa hanya tentang anak**, tanpa jadwal atau kelas: satu kelompok "Profil siswa" untuk semua anak aktif, ditambah kelompok non-aktif & lulus. Subjudul, hitungan "N siswa · N sesi jadwal", pengelompokan per sesi, dan tombol Ubah dihapus.
- **＋ Tambah siswa** (modal "Siswa baru", tombol "Simpan siswa"): nama anak*, nama panggilan, sapaan orang tua*, nomor WhatsApp, tanggal lahir*, kelas formal*. Siswa baru tersimpan di **Level 1 sementara**, karena level awal NOT NULL dan trigger langsung membuat baris `student_competencies`. **Minat / hobi tidak lagi ditanyakan** di form mana pun; kolomnya tetap ada dan dikirim sebagai `''`.
- **Usia tidak disimpan**, dihitung dari tanggal lahir (`ageText` di `state.js`) supaya tidak basi. **Kelas formal disimpan bersama tahun ajarannya** (`school_year`, berganti 1 Juli WIB, `schoolYearOf`). Saat profil disimpan dengan kelas yang sama, tahun ajaran lama dipertahankan.
- **Tes Diagnostik** adalah modal terpisah dengan tombolnya sendiri, dan bisa dibuka kapan saja. Modal ini hanya menawarkan anak **aktif yang belum dites**. Isinya: hasil diagnostik awal (wajib), catatan gaya belajar, perkiraan fase, dan level awal BI & Matematika, yang terisi dari kelas formal (`gradePhase` → `startPresets`). Anak yang telanjur ikut kelas tetap bisa dites, tapi levelnya terkunci dan hanya catatan yang disimpan.
- **"Sudah dites" = `diagnostic` tidak kosong.** Tidak ada kolom penanda; karena itu hasil diagnostik wajib di modal tes. Anak aktif yang belum dites diberi tanda oranye "Belum tes diagnostik" (`needsDiagnostic`).
- Migrasi `20260913010000_student_identity.sql`:
  - Menambah `nickname`, `birth_date`, `school_grade` (daftar tetap: Belum sekolah, TK A, TK B, SD 1–6), dan `school_year` (`YYYY/YYYY` berurutan).
  - Aturannya dipusatkan di `check_student_identity(jsonb)` dan dipakai `create_student` serta `update_student_profile`.
  - Keduanya **mewajibkan** tanggal lahir (tidak di masa depan, tidak lebih dari 20 tahun lalu) dan kelas formal.
  - Setiap pemanggil `update_student_profile` harus mengirim identitas lengkap.
- Pemilik ditolak `create_student` oleh trigger `reject_owner_student_insert`, meski fungsinya `security definer`; ada tesnya. Jangan menambah pemeriksaan ganda di fungsi.
