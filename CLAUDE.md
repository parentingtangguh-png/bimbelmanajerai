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
- `npx playwright test`: memakai mode **pratinjau** (selalu berperan guru, data contoh, tidak bisa membuka sesi/menyimpan). Tampilan pemilik dan layar kelas sungguhan perlu login asli — jangan memasukkan kata sandi.
- Skrip screenshot Playwright headless ke `http://localhost:5173` (dev server `npm run dev`, konfigurasi `.claude/launch.json`) atau render HTML statis dengan CSS asli (contoh: `docs/mockups/indicator-mockup.mjs`).

## Jebakan teknis yang sudah ditemui (Windows PowerShell 5.1)
- Pesan commit: jangan pakai tanda kutip ganda di here-string; gunakan `git commit -F <file>` bila perlu.
- `supabase db query` dengan SQL multi-baris sampai kosong → tulis SQL dalam **satu baris**. Multi-statement hanya mengembalikan hasil terakhir.
- Pernah muncul byte NUL di `main.js` akibat edit; setelah edit besar cek: `$b=[IO.File]::ReadAllBytes('src/main.js'); @($b | ? {$_ -eq 0}).Count` harus 0. Untuk mengganti baris sangat panjang, pakai skrip Node dengan penanda awal/akhir.
- CSS aplikasi memberi `display` ke `label`, jadi atribut `hidden` dipaksa lewat `[hidden]{display:none!important}` (`src/student-form.css`).
- `src/main.js` masih memuat fungsi versi lama (`studentsView`, `recordCard`, dll.) yang ditimpa oleh versi `V2` di bagian bawah — edit versi V2.
- Batas email Supabase bawaan kecil ("email rate limit exceeded"). Guru baru: daftarkan email di Tim pengajar dulu, lalu pemilik membuat user di Supabase Dashboard → Authentication → Add user dengan **Auto Confirm**. Pemasangan SMTP sendiri disarankan.

## Pekerjaan yang sedang menunggu keputusan pengguna (per 11 Sep 2026)
**Indikator pencapaian di kartu evaluasi.** Mockup sudah dikirim: `docs/mockups/indicator-desktop.png`, `docs/mockups/indicator-mobile.png` (dibuat oleh `docs/mockups/indicator-mockup.mjs`, jalankan dari root repo).
- **A (tampilan)**: panduan menilai (BT/MB/T), tujuan level, dan kotak indikator di setiap target pada kartu evaluasi (`recordCardV2`). Data tujuan/kriteria sudah ada di tabel `curriculum` (`<bidang>` dan `<bidang>_criteria`, lengkap 16 × 7).
- **B (isi)**: indikator konkret yang bisa dicentang (2–4 per level per bidang, 16 × 7) + saran penilaian otomatis ("4/4 → Tercapai", hanya saran). Draf contoh baru untuk Membaca L5 dan Matematika L5 (ada di skrip mockup). Usulan: mulai dari draf Fase A (level 5–8) untuk ditinjau pengguna, lalu simpan ke database (perlu kolom/struktur baru).
- Pertanyaan terbuka ke pengguna: tampilannya sudah sesuai? Kerjakan A saja atau A+B?

## Catatan lain
- File tidak dilacak yang **bukan** buatan Claude: `scripts/.tmp-inspect-hafsah.ps1`, `scripts/.tmp-run-hafsah-scenario.ps1` — jangan di-commit (kemungkinan berisi skenario siswa tertentu).
- Jumlah siswa di produksi turun dari 24 menjadi 8 pada 11 Sep 2026 (kemungkinan guru menghapus siswa uji); belum dikonfirmasi.
- Aplikasi belum punya fitur ganti kata sandi (ditawarkan, pengguna menunda).
