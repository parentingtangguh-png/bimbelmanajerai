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
- **Guru** mengelola siswanya sendiri: tambah siswa (otomatis milik guru pembuat), profil, status (Nonaktifkan/Aktifkan kembali), hapus siswa (hanya bila belum pernah ikut kelas dan tidak dibagi guru lain), sesi jadwal rutin, kelas, evaluasi, rapor, dan ujian sumatif.
- **Pemilik** hanya membaca data umum, mendaftarkan guru (Tim pengajar), dan mengedit kurikulum. Pemilik tidak membuka kelas, tidak menambah siswa, tidak menugaskan guru. Database menolak semua jalur tulis pemilik ke data siswa/kelas.
- **Isolasi antar guru** wajib: RLS + RPC `security definer` yang memeriksa `can_teach` / `can_access_session`. Ada tes isolasi dua guru di `tests/database.test.mjs`.
- **Level**: 16 level (1–4 Fondasi, 5–8 Fase A/SD 1–2, 9–12 Fase B/SD 3–4, 13–16 Fase C/SD 5–6). Guru hanya mengisi **titik awal**; bisa dikoreksi (`correct_student_baseline`) hanya sebelum anak ikut kelas pertama.
- **Target mengalir per fase**: target = akhir fase level saat ini. Tidak ada input target manual. Lulus ujian sumatif fase memindahkan target ke akhir fase berikutnya; lulus di akhir Fase C = status Lulus.
- Naik level: dua bukti "Tercapai" pada kesempatan berbeda. Alarm setelah 3 kali BT/MB berturut-turut.
- **Indikator disusun per untaian, bukan per level.** Karena 16 level adalah satu spiral, indikator satu bidang ditulis menurun dari Level 1 sampai 16 agar kedalamannya bertambah konsisten. Jangan pernah mengarang indikator di kartu evaluasi: sumbernya selalu tabel `curriculum`.
- Tiap level punya satu **simpul spiral** (`<bidang>_key` = nomor indikator, `<bidang>_spiral` = alasan level berikutnya menuntut hal itu). Level 16 memakai `_spiral` sebagai penutup tangga/kelulusan. English Exposure sengaja `_key=0` di semua level: pengayaan, tidak pernah menahan kenaikan.
- Siswa dengan sesi yang belum dievaluasi tidak boleh dinonaktifkan (dijaga di UI dan DB).

## Keputusan final — jangan ditawarkan lagi
- **Tidak memasang SMTP sendiri.** Guru baru dibuat lewat Supabase Dashboard → Authentication → Add user dengan **Auto Confirm**, setelah emailnya didaftarkan di Tim pengajar. Itu alur tetap, bukan jalan darurat.
- **Tidak dibagikan ke bimbel lain.** Tidak perlu multi-tenant, halaman pemasangan, `install.sql`, atau nama bimbel yang bisa dikonfigurasi.
- **Mode pratinjau dihapus** (12 Sep 2026). Tidak ada lagi cara masuk tanpa akun. Jangan menghidupkannya kembali tanpa diminta.
- Penurunan jumlah siswa 24 → 8 pada 11 Sep 2026 **sengaja** dilakukan pengguna. Bukan insiden.
- Mockup lama `docs/mockups/indicator-*.png` **usang** — memakai kerangka per-level yang ditolak pengguna.

## Alur kerja yang diharapkan pengguna
1. Kerjakan perubahan, jalankan `npm test`, `npm run build`, `npx playwright test`. Bila ada perubahan tampilan, buktikan (lihat Resep di bawah).
2. Laporkan hasil, lalu **minta persetujuan** sebelum deploy. Pengguna selalu menyetujui deploy secara eksplisit.
3. Setelah disetujui: `npx --no-install supabase db push --dry-run` → pastikan hanya migrasi baru yang tertunda → `npx --no-install supabase db push --yes` → baru commit & push (migrasi **harus** masuk sebelum frontend yang memakainya).
4. Tunggu GitHub Actions selesai, lalu verifikasi berkas JS di situs live memuat kode baru.
- Untuk perubahan besar pada isi kurikulum: **tunjukkan draf teks lebih dulu**, tunggu persetujuan, baru tulis ke migrasi.
- Untuk pertanyaan data produksi gunakan query **baca saja**: `npx --no-install supabase db query --linked "<satu baris SQL>"`.

## Susunan kode
- `src/main.js` (~28 KB) hanya sambungan: klien Supabase, login, `refresh`, `render`, dan semua penangan klik/submit.
- Tiap layar punya berkasnya sendiri di `src/views/`: `dashboard.js`, `students.js`, `sessions.js`, `curriculum.js`, `team.js`.
- Dipakai bersama: `src/state.js` (state + konstanta + pembaca data, **tanpa DOM**) dan `src/ui.js` (`field`, `select`, `area`, `empty`, `heading`, `meter`, `modal`, `notify`).
- **Aturan yang menjaga semuanya tetap terpisah:** view hanya menyusun teks HTML. View tidak boleh memanggil `db`, `result`, `render`, atau `notify` — semua aksi lewat atribut `data-action`/`data-form` yang ditangani di `main.js`.
- View menyusun HTML lewat fungsi kecil bernama (`cardHeading`, `attendanceForm`, `evaluationSection`, `reportSection`, `classGuide`, `statBand`, `journeyPanel`, …). Kalau menambah bagian, **buat fungsi baru** — jangan menyambung ke template yang sudah panjang.
- Kode diformat **Prettier** (`.prettierrc.json`, lebar 110). Jalankan `npx prettier --write` setelah mengedit.

## Menguji
- `npm test` → `scripts/check-imports.mjs` lebih dulu, lalu 47 tes Node: domain, database (PGlite menjalankan semua migrasi), dan **render**.
- `tests/render.test.mjs` memanggil fungsi layar langsung dengan data contoh `tests/fixtures/sample-state.mjs` — tanpa browser, tanpa login. **Inilah satu-satunya tes yang menjangkau kartu evaluasi.** Kalau menambah fitur di layar mana pun, tambahkan tesnya di sini.
- `npx playwright test` hanya menguji layar login (aplikasi memuat, tanpa galat, tidak meluber di 390px). Lebih dari itu tidak mungkin tanpa akun.
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
- Pesan commit: jangan pakai tanda kutip ganda di here-string; pakai `git commit -F <file>`.
- Skrip bantu dengan tanda kutip/escape rumit sering gagal lewat heredoc bash — tulis berkas skripnya dengan tool Write, lalu jalankan dengan `node`.
- `supabase db query` dengan SQL multi-baris mengembalikan kosong → tulis SQL **satu baris**. Multi-statement hanya mengembalikan hasil terakhir.
- Setelah edit besar pada berkas JS, pastikan tidak ada byte NUL: `node -e "const b=require('fs').readFileSync('src/main.js');console.log(b.filter(x=>x===0).length)"` harus 0.
- CSS memberi `display` ke `label`, jadi atribut `hidden` dipaksa lewat `[hidden]{display:none!important}` (`src/student-form.css`).
- Berkas CSS pernah menyimpan tanda `—` sebagai satu byte CP1252 sehingga bukan UTF-8 valid. Sudah diperbaiki; jangan menulis ulang berkas CSS dengan pengodean lain.

## Keadaan kurikulum — sudah selesai
Indikator **lengkap**: 16 level × 6 bidang wajib (Menyimak, Berbicara, Membaca, Menulis, Matematika, IPAS), masing-masing 3 indikator + simpul spiral, plus English Exposure 16 level tanpa simpul. Tidak ada lubang; `tests/database.test.mjs` memakai peta cakupan yang menolak satu kotak kosong pun.
- Kolom di `curriculum`: `<bidang>`, `<bidang>_criteria`, `<bidang>_indicators` (jsonb, maks 6), `<bidang>_key`, `<bidang>_spiral`. Pemilik mengedit; guru membaca.
- Tab Kurikulum: **Per untaian** (default; satu bidang menurun 16 level dengan kotak simpul di antaranya) dan **Per level**.
- Kartu evaluasi menampilkan tujuan level, indikator yang bisa dicentang, saran penilaian otomatis ("2 dari 3 → MB", hanya saran), dan baris riwayat "pernah terlihat di sesi sebelumnya".
- Busur antar fase: Fondasi menirukan → memegang satuan lebih besar; Fase A mengerjakan → memilih dan memeriksa; Fase B satu sumber → beberapa sumber dan bersedia berubah oleh bukti; Fase C menimbang dan memutuskan sendiri lalu mempertanggungjawabkannya.

## Indikator harus menempel pada tujuan levelnya sendiri
- Ditemukan 12 Sep 2026 lewat smoke test: **indikator Matematika level 6–14 adalah milik level lain** — kartu Level 6 menampilkan tujuan "tambah-kurang sampai 100" bersama indikator "sampai 1.000". Guru menilai anak satu tingkat terlalu sulit, dan simpul spiral berbintang menahan kenaikan atas hal yang belum menjadi tujuan level itu. Level 1–5, 15, 16 dan semua bidang lain tidak terkena. Sudah diperbaiki di `20260912070000_math_indicators_realign.sql`.
- Peta cakupan lama **lolos meski bug-nya ada**, karena hanya menghitung jumlah indikator. Sekarang ada tes jangkar di `tests/database.test.mjs` yang mengunci kata kunci wajib pada indikator pertama tiap level Matematika 6–16, dan memastikan simpul spiral level N menyebut Level N+1. Terbukti gagal pada data lama.
- Aturannya: indikator 1–2 menguji **tujuan level itu**, indikator ke-3 adalah **simpul** yang menjembatani ke tujuan level berikutnya. Kalau menambah indikator bidang lain, ikuti pola ini dan tambahkan jangkarnya ke tes.

## Rapor AI (`supabase/functions/generate-learning`)
- Rapor **tidak lagi menerima `panduan_kelas`**. Dulu seluruh panduan (~10.000 karakter) dikirim untuk pesan 200 kata: boros, dan menjadi sumber karangan — panduan memuat aktivitas semua kelompok, jadi model mengklaim anak melakukan hal yang tidak pernah dicatat guru. Sumber kebenaran satu-satunya adalah `tujuan`, `kriteria`, dan `catatan_bukti` pada target. Masukan turun 12.534 → 2.274 karakter (**−82%**), `max_tokens` 1000 → 700.
- Draf ditempel ke WhatsApp, yang **tidak mengenal `**tebal**`** — bintangnya tampil apa adanya. Prompt meminta teks biasa, dan `stripMarkdown` membuang sisa markdown yang lolos. Panduan kelas **tetap** boleh markdown.
- `FOREIGN` membuang aksara di luar Latin/tanda baca/emoji. Model kecil sesekali menyisipkan karakter asing — sebuah "ย" Thai pernah lolos ke rapor orang tua pada 12 Sep 2026. Prompt saja tidak cukup; ini penyaring deterministik. Regex ditulis dengan escape `\uXXXX` **sebagai teks** karena memuat karakter tak terlihat (ZWJ, variation selector); jangan menulisnya sebagai karakter literal.
- Deploy terpisah dari frontend: `npx --no-install supabase functions deploy generate-learning`.
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
- Yang masih terbuka (hanya bila pengguna meminta): baris terpanjang tersisa ~691 di `views/curriculum.js`; baris siswa di dasbor menampilkan rata-rata Bahasa Indonesia sehingga ketimpangan antar bidang tersembunyi; layar Kurikulum belum diperiksa untuk kenyamanan di HP.
- Semua layar sudah dipecah jadi fungsi kecil 12 Sep 2026: `views/sessions.js` (max 434), `views/dashboard.js` (366), `views/students.js` (362), `src/main.js` (346), `views/team.js` (199). Rangka aplikasi di main.js sekarang `sidebar`/`navButtons`/`accountCard`/`topbar`/`loginStory`/`loginForm`/`passwordForm`/`curriculumFieldset`.
- Cara membuktikan perombakan tanpa perubahan tampilan, tiga lapis sesuai jangkauannya:
  1. Layar biasa → `node scripts/render-screens.mjs` sebelum/sesudah harus md5 sama.
  2. Layar login di `main.js` → skrip itu tidak menjangkau; bandingkan `document.querySelector('main.login').outerHTML` di pane browser sebelum dan sesudah.
  3. `studentForm`/`scheduleForm` → keduanya menulis lewat `modal()` yang butuh DOM. Jalankan skrip sekali pakai yang memalsukan `globalThis.document = { querySelector: () => ({ set innerHTML(v){...}, showModal(){} }) }`, impor versi lama (`git show HEAD:src/views/students.js`) dan versi baru berdampingan, lalu bandingkan hasilnya untuk peran guru dan pemilik.
