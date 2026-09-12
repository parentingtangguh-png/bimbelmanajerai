# Rumah Belajar Rainbow Kids Alfatih — catatan kerja untuk Claude

Baca file ini dulu sebelum mengubah apa pun. Pengguna (pemilik bimbel) berkomunikasi dalam **bahasa Indonesia**; jawab dalam bahasa Indonesia.

## Proyek
- Aplikasi web internal bimbel tematik multigrade. Frontend vanilla JS + Vite (`src/main.js`), backend Supabase (Postgres + RLS + Auth + Edge Function `generate-learning` untuk panduan kelas/rapor AI via Anthropic).
- GitHub: `parentingtangguh-png/bimbelmanajerai` (repo **publik** — jangan commit data pribadi, email guru, atau secret).
- Supabase project ref: `ypofmienpffbpgrwpclm` (sudah ter-link di `supabase/.temp`).
- Situs live (GitHub Pages, deploy otomatis saat push ke `main`): https://parentingtangguh-png.github.io/bimbelmanajerai/

## Aturan bisnis yang sudah diputuskan pengguna
- **Guru** mengelola siswanya sendiri: tambah siswa (otomatis milik guru pembuat), profil, status (tombol Nonaktifkan/Aktifkan kembali), hapus siswa (hanya jika belum pernah ikut kelas dan tidak dibagi guru lain), sesi jadwal rutin, kelas, evaluasi, rapor, dan ujian sumatif.
- **Pemilik** hanya membaca data umum (tabel ringkas Data siswa, profil baca-saja), mendaftarkan guru (Tim pengajar), dan mengedit kurikulum. Pemilik tidak membuka kelas, tidak menambah siswa, tidak menugaskan guru. Database menolak semua jalur tulis pemilik ke data siswa/kelas.
- **Isolasi antar guru** wajib: RLS + RPC `security definer` yang memeriksa `can_teach` / `can_access_session`. Ada tes isolasi dua guru di `tests/database.test.mjs`.
- **Level**: 16 level (1–4 Fondasi, 5–8 Fase A/SD 1–2, 9–12 Fase B/SD 3–4, 13–16 Fase C/SD 5–6). Guru hanya mengisi **titik awal** (Bahasa Indonesia dipakai juga untuk Menyimak, Berbicara, IPAS, English; Matematika terpisah). Titik awal bisa dikoreksi (`correct_student_baseline`) hanya sebelum anak ikut kelas pertama.
- **Target mengalir per fase**: target = akhir fase level saat ini (`phase_end`). Tidak ada input target manual. Lulus ujian sumatif fase memindahkan target ke akhir fase berikutnya; lulus di akhir Fase C = status Lulus.
- Naik level: dua bukti "Tercapai" pada kesempatan berbeda. Alarm setelah 3 kali BT/MB berturut-turut.
- **Indikator disusun per untaian, bukan per level.** Karena 16 level adalah satu spiral, indikator satu bidang ditulis menurun dari Level 1 sampai 16 sekaligus agar kedalamannya bertambah konsisten. Jangan pernah mengarang indikator langsung di kartu evaluasi: sumbernya selalu tabel `curriculum`.
- Tiap level punya satu **simpul spiral** (`<bidang>_key` menunjuk nomor indikator, `<bidang>_spiral` menjelaskan mengapa level berikutnya menuntut hal itu). Level 16 memakai `_spiral` sebagai penutup tangga/kelulusan. English Exposure sengaja `_key=0` di semua level: pengayaan, tidak pernah menahan kenaikan level.
- Siswa dengan sesi yang belum dievaluasi tidak boleh dinonaktifkan (dijaga di UI dan DB).

## Alur kerja yang diharapkan pengguna
1. Kerjakan perubahan, jalankan `npm test`, `npm run build`, `npx playwright test`, dan periksa tampilan (screenshot) bila ada perubahan UI.
2. Laporkan hasil, lalu **minta persetujuan** sebelum deploy.
3. Setelah disetujui: `npx --no-install supabase db push --dry-run` → pastikan hanya migrasi baru yang tertunda → `npx --no-install supabase db push --yes` → baru commit & push (migrasi **harus** masuk sebelum frontend yang memakainya).
4. Tunggu run GitHub Actions selesai, lalu verifikasi file JS di situs live memuat kode baru.
- Pengguna suka melihat gambaran hasil akhir (mockup) sebelum fitur besar dibangun.
- Untuk pertanyaan data produksi gunakan query **baca saja** (`npx --no-install supabase db query --linked "<satu baris SQL>"`).

## Menguji
- `npm test`: tes domain + database (PGlite menjalankan semua migrasi). `admin()` di tes = setup data tanpa peran pengguna.
- **Mode pratinjau sudah dihapus** (12 Sep 2026, atas keputusan pengguna). Tidak ada lagi cara masuk tanpa akun.
- `npx playwright test`: kini hanya menguji **layar login** (aplikasi memuat, tidak ada galat, tidak meluber di 390px). Semua layar di balik login diuji oleh `tests/render.test.mjs`, yang memanggil fungsi view langsung dengan data contoh di `tests/fixtures/sample-state.mjs` — tanpa browser, tanpa login.
- `node scripts/render-screens.mjs keluaran.html` menulis HTML semua layar. Jalankan sebelum dan sesudah perombakan lalu bandingkan: HTML identik = perilaku tidak berubah. Cara inilah yang dipakai saat memecah template `recordCard` dan `dashboard`.
- Skrip screenshot Playwright headless ke `http://localhost:5173` (dev server `npm run dev`, konfigurasi `.claude/launch.json`) atau render HTML statis dengan CSS asli (contoh: `docs/mockups/indicator-mockup.mjs`).

## Jebakan teknis yang sudah ditemui (Windows PowerShell 5.1)
- **`npm run build` hijau tidak membuktikan impor benar.** Bundler menggabungkan semua modul jadi satu lingkup, jadi nama yang lupa diimpor tetap ketemu; dev server (modul terpisah) baru melemparkan galat. Karena itu `npm test` menjalankan `scripts/check-imports.mjs` lebih dulu.
- **Jangan tinggalkan dev server berjalan saat mengubah banyak berkas.** `playwright.config.js` memakai `reuseExistingServer:true`, jadi Playwright akan memakai server lama yang modulnya sudah basi — tesnya gagal karena server, bukan karena kode. Pernah membuang waktu lama pada 12 Sep 2026. Periksa dengan `netstat -ano | findstr :5173`.
- Kode diformat **Prettier** (`.prettierrc.json`, lebar 110). Jalankan `npx prettier --write` setelah mengedit. `src/demo-curriculum.js` sengaja dikecualikan (data, bukan kode).

- Pesan commit: jangan pakai tanda kutip ganda di here-string; gunakan `git commit -F <file>` bila perlu.
- `supabase db query` dengan SQL multi-baris sampai kosong → tulis SQL dalam **satu baris**. Multi-statement hanya mengembalikan hasil terakhir.
- Pernah muncul byte NUL di `main.js` akibat edit; setelah edit besar cek: `$b=[IO.File]::ReadAllBytes('src/main.js'); @($b | ? {$_ -eq 0}).Count` harus 0. Untuk mengganti baris sangat panjang, pakai skrip Node dengan penanda awal/akhir.
- CSS aplikasi memberi `display` ke `label`, jadi atribut `hidden` dipaksa lewat `[hidden]{display:none!important}` (`src/student-form.css`).
- Fungsi versi lama dan penimpaan `V2` sudah **dihapus** (12 Sep 2026). Kini satu nama = satu fungsi; tidak ada lagi versi bayangan yang harus diingat.
- View menyusun HTML lewat fungsi-fungsi kecil bernama (`cardHeading`, `attendanceForm`, `evaluationSection`, `reportSection`, `classGuide`, `statBand`, dan seterusnya). Kalau menambah bagian baru, buat fungsi baru — jangan menyambung ke template yang sudah panjang.
- **Susunan berkas (12 Sep 2026):** `src/main.js` (26 KB) hanya berisi sambungan — klien Supabase, login, `refresh`, `render`, dan semua penangan klik/submit. Tiap layar punya berkasnya sendiri di `src/views/`: `dashboard.js`, `students.js`, `sessions.js`, `curriculum.js`, `team.js`. Yang dipakai bersama: `src/state.js` (state + konstanta + pembaca data, tanpa DOM) dan `src/ui.js` (`field`, `select`, `area`, `empty`, `heading`, `meter`, `modal`, `notify`).
- **Aturan penting:** view hanya menyusun teks HTML. View tidak boleh memanggil `db`, `result`, `render`, atau `notify` — semua aksi lewat atribut `data-action`/`data-form` yang ditangani di `main.js`. Menjaga aturan ini yang membuat tiap layar bisa berdiri sendiri.
- `npm test` menjalankan `scripts/check-imports.mjs` lebih dulu: memeriksa tiap nama antar modul sudah diimpor. Ini menangkap kesalahan yang **lolos `npm run build`** tetapi membuat layar kosong saat dibuka (pernah terjadi pada alias `h`).
- Data kurikulum untuk mode pratinjau ada di `src/demo-curriculum.js`, dimuat **hanya saat pratinjau dibuka** (`import()` dinamis). Jangan pindahkan kembali ke `src/main.js`: isinya 77 KB dan akan ikut diunduh semua guru.
- Batas email Supabase bawaan kecil ("email rate limit exceeded"). Guru baru: daftarkan email di Tim pengajar dulu, lalu pemilik membuat user di Supabase Dashboard → Authentication → Add user dengan **Auto Confirm**. Ini alur tetap, bukan jalan darurat: pengguna memutuskan **tidak memasang SMTP sendiri** (12 Sep 2026). Jangan tawarkan lagi.

## Keadaan kurikulum (per 12 Sep 2026) — sudah selesai
Indikator pencapaian **lengkap**: 16 level x 6 bidang wajib (Menyimak, Berbicara, Membaca, Menulis, Matematika, IPAS), masing-masing 3 indikator + simpul spiral, plus English Exposure 16 level tanpa simpul. Tidak ada lubang; `tests/database.test.mjs` memakai peta cakupan yang menolak satu kotak kosong pun.
- Kolom di `curriculum`: `<bidang>`, `<bidang>_criteria`, `<bidang>_indicators` (jsonb, maks 6), `<bidang>_key` (nomor indikator simpul, 0 = tidak ada), `<bidang>_spiral` (teks). Pemilik yang mengedit; guru membaca.
- Tab Kurikulum punya dua tab: **Per untaian** (default; satu bidang menurun 16 level dengan kotak simpul di antaranya) dan **Per level** (kartu lama + jumlah indikator).
- Kartu evaluasi (`recordCardV2`) menampilkan tujuan level, indikator yang bisa dicentang, saran penilaian otomatis ("2 dari 3 -> MB", hanya saran), dan baris riwayat "pernah terlihat di sesi sebelumnya".
- Busur antar fase: Fondasi menirukan -> memegang satuan lebih besar; Fase A mengerjakan -> memilih dan memeriksa; Fase B satu sumber -> beberapa sumber dan bersedia berubah oleh bukti; Fase C menimbang dan memutuskan sendiri lalu mempertanggungjawabkannya.
- Mockup lama `docs/mockups/indicator-*.png` sudah usang (memakai kerangka per-level yang ditolak pengguna).

## Centang indikator
- Tabel `session_indicator_checks` (session_student_id, subject, indicator_index, level_snapshot, indicator_text, checked_at). Teks indikator disalin saat dicentang supaya riwayat tetap terbaca kalau pemilik mengubah kurikulum.
- Disimpan lewat RPC `set_indicator_check(uuid,text,integer,boolean,text)` saat guru mencentang, bukan saat evaluasi disimpan, supaya guru bisa mencentang selama kegiatan berlangsung. Ditolak bila sesi sudah final, anak tidak hadir, atau bidang bukan target sesi itu.
- Centang **tidak** mengubah nilai formatif. Saran penilaian tetap saran; keputusan di tangan guru.

## Catatan lain
- File tidak dilacak yang **bukan** buatan Claude: `scripts/.tmp-inspect-hafsah.ps1`, `scripts/.tmp-run-hafsah-scenario.ps1` — jangan di-commit (kemungkinan berisi skenario siswa tertentu).
- Jumlah siswa di produksi turun dari 24 menjadi 8 pada 11 Sep 2026. **Sudah dikonfirmasi pengguna (12 Sep 2026): sebagian sengaja dihapus.** Bukan insiden; tidak perlu ditelusuri lagi.
- Ganti kata sandi: tombol ⚿ di kartu akun (sidebar) -> `db.auth.updateUser`. Minimal 8 karakter, harus diketik dua kali. **Claude tidak pernah mengetikkan kata sandi pengguna.**
