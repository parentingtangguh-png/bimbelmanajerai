# Rumah Belajar Rainbow Kids Alfatih — catatan kerja untuk Claude

Baca file ini dulu sebelum mengubah apa pun. Pengguna (pemilik bimbel) berkomunikasi dalam **bahasa Indonesia**; jawab dalam bahasa Indonesia.

Berkas ini menggambarkan **keadaan sekarang**, bukan riwayat. Kalau sesuatu di sini bertentangan dengan kode, kodenya yang benar — perbarui berkas ini.

## Proyek
- Aplikasi web internal bimbel, **pilot Fase Fondasi** (Level 1–4). Frontend vanilla JS + Vite, backend Supabase (Postgres + RLS + Auth).
- GitHub: `parentingtangguh-png/bimbelmanajerai` (repo **publik** — jangan commit data pribadi, email guru, atau secret).
- Supabase project ref: `ypofmienpffbpgrwpclm` (sudah ter-link di `supabase/.temp`).
- Situs live (GitHub Pages, deploy otomatis saat push ke `main`): https://parentingtangguh-png.github.io/bimbelmanajerai/
- **Satu bimbel, satu pemasangan.** Bukan multi-tenant dan tidak akan dibagikan ke bimbel lain.
- **Belum diluncurkan.** Data yang ada adalah akun tim dan siswa percobaan milik guru Hafsah.

## ▶ Mulai di sini: status terakhir (13 Sep 2026, akhir sesi)
**Sudah di produksi** (commit `c56153d`, migrasi terakhir `20260913080000_pilot_only_architecture.sql`, Edge Function `generate-learning` sudah dihapus dari Supabase):
- Arsitektur pilot saja (lihat bagian berikut). Semua tes, build, dan Playwright hijau saat deploy.
- Data produksi: 6 akun di `access_list` + 6 `profiles`; 5 siswa percobaan milik guru **Hafsah Isykarima**, semuanya sudah dites diagnostik (8 nilai per anak): Aisyah Putri Rahmawati L1, Muhammad Fathan Alfarizi L2, Khansa Nabila Azzahra L3, Doni Saputra L4, Rafa Arkana Pratama L4 (semua "Belum lulus" di level yang dites). Nomor WA kosong kecuali Doni.

**Belum dilakukan — kerjakan ini lebih dulu di sesi baru:**
1. **Uji jalur simpan di aplikasi yang sudah login** (semua RPC siswa dan tes ditulis ulang di migrasi terakhir; tes otomatis tidak menjangkau tombol simpan). Minta pengguna login di pane browser (`preview_start` nama `bimbel-dev`, port 5173), lalu bersama pengguna:
   a. Tambah siswa percobaan → harus "Level belum ditentukan" + tanda "Belum tes diagnostik".
   b. Tes diagnostik siswa itu → simpan → status & level berubah.
   c. Revisi hasil tes → simpan → `revised_at` terisi.
   d. Simpan profil siswa lama tanpa mengubah apa pun → level & tes tetap.
   e. Hapus siswa percobaan → baris tesnya ikut hilang.
   Periksa tiap langkah dengan query baca saja. Kalau ada yang gagal, perbaiki dan minta izin deploy.
2. Setelah itu tanyakan pengguna mau lanjut ke mana. Kandidat yang sudah dibahas (jangan dikerjakan tanpa diminta):
   - **Alur kelas pilot** (terbesar; keputusan yang belum ada tercantum di Aturan bisnis → Ruang kelas).
   - Saran perbaikan tes diagnostik (lihat Catatan lain → Yang masih terbuka).
   - Bersihkan data percobaan sebelum peluncuran.

**Riwayat singkat hari ini** (supaya tidak mengulang diskusi): kurikulum lama dihapus → kurikulum pilot Fondasi dipasang (CP, 4 level, 32 indikator, 8 tema + deskriptor) → instrumen tes diagnostik disusun dan direvisi berkali-kali bersama pengguna (bahan tanpa cetak, aturan tanda ◐, tugas pengamatan di bawah) → aturan tes berubah dari jalur naik-turun beberapa level menjadi **satu level per tes** → tampilan lama disembunyikan dari profil → pengguna memutuskan **aplikasi belum diluncurkan, jadi arsitektur lama dihapus total** kecuali akun dan data siswa Hafsah.

## Arsitektur sekarang (13 Sep 2026: arsitektur lama dihapus total)
Migrasi `20260913080000_pilot_only_architecture.sql` menghapus semua struktur lama: kurikulum 7 bidang × 16 level, level per bidang (`reading_*`/`math_*`), `student_competencies`, alarm, sesi kelas, kehadiran, evaluasi, observasi, centang indikator, potret, sesi jadwal, tema bebas, ujian sumatif, pekerjaan AI, dan Edge Function `generate-learning` (kodenya dihapus dari repo). **Jangan menghidupkan kembali struktur itu**; alur kelas pilot dirancang dari nol.

Yang tersisa (dan dijaga tes `struktur lama sudah tidak ada`):
- **Tabel**: `access_list`, `profiles`, `assignments`, `students`, `curriculum_phases`, `curriculum_levels`, `curriculum_level_indicators`, `curriculum_themes`, `diagnostic_tests`, `diagnostic_results`.
- **Fungsi**: `is_member`, `is_owner`, `can_teach`, `handle_new_user`, `check_student_identity`, `create_student`, `update_student_profile`, `set_student_active`, `delete_student`, `reject_owner_student_insert` (pemicu), `save_diagnostic`.
- **students**: `id, name, parent_name, phone, status ('Aktif'|'Non-Aktif'), created_at, nickname, birth_date, school_grade, school_year, pilot_level`. `pilot_level` **kosong sampai tes diagnostik disimpan**, dan hanya diubah RPC.
- **diagnostic_tests** (unik per siswa): `tested_level, passed, final_level, note, tested_on, revised_at, teacher_id`. Check `final_level` = lulus ? min(level+1, 4) : level. **"Sudah dites" = ada baris ini** — tidak ada kolom penanda lain, dan status "Lulus/Belum lulus Level X" diturunkan (`testStatus` di `state.js`).
- **diagnostic_results**: nilai T/B/N per indikator + salinan `indicator_text`.
- Tulis langsung ke tabel ditolak (RLS tanpa kebijakan tulis); semua perubahan lewat RPC `security definer`.
- `diagnostic_tests` dibaca guru pendamping **dan pemilik** (ringkasan); `diagnostic_results` hanya guru pendamping.

## Aturan bisnis yang sudah diputuskan pengguna
- **Guru** mengelola siswanya sendiri: tambah siswa (otomatis milik guru pembuat), Tes Diagnostik dan revisinya, profil, Nonaktifkan/Aktifkan kembali, hapus siswa (tidak bila dibagi guru lain).
- **Pemilik** hanya membaca data umum, mendaftarkan guru (Tim pengajar), dan membaca kurikulum. Database menolak pemilik menambah/mengubah siswa dan menyimpan tes.
- **Isolasi antar guru** wajib: RLS + RPC yang memeriksa `can_teach`. Ada tesnya di `tests/database.test.mjs`.
- **Kurikulum pilot** (disetujui pemilik kata demi kata): CP Fase Fondasi → 4 level (judul + deskripsi) → 8 indikator per level (area di kolom `domain`; nomor 7 English, nomor 8 Karakter "observasi guru") → 8 tema × 24 pertemuan dengan deskriptor. Level milik anak secara utuh, bukan per bidang. Perubahan isi kurikulum: **draf teks dulu**, tunggu persetujuan, lalu migrasi.
- **Tes Diagnostik — satu level per tes**:
  - Guru memilih anak aktif yang belum dites dan **satu level** (kelas formal hanya saran: Belum sekolah→1, TK A→2, TK B→3, SD→4; deskriptor level tampil di bawah pilihan), menilai 8 tugas (✓ Tercapai / ◐ Dengan bantuan atau kurang satu dari ukuran / ✗ Belum), lalu menyimpan.
  - **Lulus** = indikator 1–6 semuanya ✓. English (7) dan Karakter (8) hanya dicatat. Lulus Level X → mulai Level X+1 (Level 4 tetap 4, "melampaui Fondasi"); belum lulus → mulai Level X.
  - **Satu tes per anak.** Simpan ulang = **revisi** (hanya hasil terakhir, `revised_at`). Kunci "revisi hanya sebelum kelas pertama" ikut hilang bersama kelas lama; **pasang lagi di alur kelas pilot**.
  - Tugas, bahan, ukuran, dan penanda "diamati sepanjang tes" menempel pada indikator (`curriculum_level_indicators.diagnostic_*`). Tugas yang diamati sepanjang tes (L1-1 dan semua indikator 8) tampil paling bawah. **Tanpa berkas cetak**: huruf/angka/kata ditulis guru di kertas/papan, gambar diganti benda nyata. Kalimat indikator L2-2 tetap "gambar benda" meski tugasnya memakai benda nyata (keputusan pemilik).
  - Hasil dihitung ulang di `save_diagnostic`; aplikasi hanya menampilkan.
  - Jawaban yang belum disimpan tersimpan di localStorage `bimbel.diagnostic.<user id>` per anak (jeda, pindah anak, lanjutkan di perangkat yang sama).
- **Catatan gaya belajar, minat, dan ringkasan teks diagnostik tidak lagi ada** (kolomnya sudah dihapus).
- **Ruang kelas** sementara hanya halaman "sedang disiapkan". Rancangan pemilik (belum dibangun): tema menurut nomor pertemuan; lembar aktivitas per pertemuan (pembuka + English phrase, aktivitas utama dengan tugas otomatis per level anak, penutup + checklist karakter); guru memilih yang hadir lalu menandai pertemuan selesai. Belum diputuskan: cara naik level, kapan indikator dinilai, apakah hasil ✓ tes langsung dihitung, sumber isi 192 lembar, cara menghitung nomor pertemuan, butir checklist karakter, rapor, dan penjaga "belum dites tidak bisa ikut kelas".

## Keputusan final — jangan ditawarkan lagi
- **Tidak memasang SMTP sendiri.** Guru baru dibuat lewat Supabase Dashboard → Authentication → Add user dengan **Auto Confirm**, setelah emailnya didaftarkan di Tim pengajar.
- **Tidak dibagikan ke bimbel lain.** Tidak perlu multi-tenant, halaman pemasangan, atau nama bimbel yang bisa dikonfigurasi.
- **Mode pratinjau dihapus.** Tidak ada cara masuk tanpa akun.
- **Arsitektur lama dihapus** (lihat di atas); jangan diusulkan dibangun ulang dalam bentuk lama.

## Alur kerja yang diharapkan pengguna
1. Kerjakan perubahan, jalankan `npm test`, `npm run build`, `npx playwright test`. Bila ada perubahan tampilan, buktikan (lihat Resep).
2. Laporkan hasil, lalu **minta persetujuan** sebelum deploy. Pengguna selalu menyetujui deploy secara eksplisit.
3. Setelah disetujui: `npx --no-install supabase db push --dry-run` → pastikan hanya migrasi baru yang tertunda → `npx --no-install supabase db push --yes` → baru commit & push (migrasi **harus** masuk sebelum frontend yang memakainya).
4. Verifikasi berkas JS di situs live memuat kode baru (bandingkan nama `assets/index-*.js`, lalu cari teks khas perubahan).
- Pertanyaan data produksi: query **baca saja** `npx --no-install supabase db query --linked "<satu baris SQL>"`.

## Susunan kode
- `src/main.js` hanya sambungan: klien Supabase, login, `refresh`, `render`, penangan klik/submit, dan simpanan sementara tes diagnostik.
- Layar di `src/views/`: `dashboard.js` (Ringkasan: siswa aktif, sudah/belum dites, sebaran level), `students.js` (daftar, profil, hasil tes, level saat ini, status, hapus), `diagnostic.js` (modal tes: `diagnostic-start` → `diagnostic-level` → hasil `diagnostic`, dibedakan `run.reviewed`), `sessions.js` (placeholder Ruang kelas), `curriculum.js`, `team.js`, `home.js` (menu, kepala, doa, navbar HP).
- Dipakai bersama: `src/state.js` (state, konstanta, `testFor`/`testStatus`/`levelName`, **tanpa DOM**), `src/diagnostic.js` (aturan tes, murni), `src/ui.js`, `src/domain.js` (`escapeHtml`, `localDate`).
- **View hanya menyusun teks HTML**; tidak memanggil `db`, `result`, `render`, atau `notify`. Semua aksi lewat `data-action`/`data-form` yang ditangani `main.js`. Kalau menambah bagian, buat fungsi kecil baru.
- Kode diformat **Prettier** (`.prettierrc.json`, lebar 110).

## Menguji
- `npm test` → `scripts/check-imports.mjs`, lalu tes Node: `domain`, `database` (PGlite menjalankan **semua** migrasi, jadi yang diuji keadaan akhirnya), dan `render` (layar disusun dengan `tests/fixtures/sample-state.mjs`, tanpa browser).
- `npx playwright test` hanya menguji layar login.
- ⚠ **Jalur simpan di `main.js` tidak dijangkau tes mana pun.** Setiap perubahan pada payload RPC harus dicoba di aplikasi yang sudah login (minta pengguna login di pane browser), lalu diperiksa dengan query baca saja.
- Playwright pernah rapuh pada server dingin; `timeout` 60 dtk dan `expect.timeout` 20 dtk sengaja. Jangan diturunkan.
- `admin()` di tes database = setup data tanpa peran pengguna.

## Resep perintah singkat
**"ubah tampilan X"**: `node scripts/render-screens.mjs sebelum.html` → ubah → `sesudah.html` → bandingkan → `npm test` + `npx playwright test` → minta pengguna login di pane bila perlu dilihat mata.
**"rapikan kode"**: `npx prettier --write "src/**/*.js" "src/*.css"` lalu buktikan bundel tidak berubah (`md5sum dist/assets/index-*.js`). ⚠ Jangan memformat `tests/database.test.mjs` dan `tests/domain.test.mjs` (sengaja bergaya padat).
**"deploy"**: Alur kerja langkah 3–4. Jangan pernah push tanpa persetujuan.
**"periksa data produksi"**: query satu baris, hanya SELECT.

## Jebakan teknis (Windows)
- **`npm run build` hijau tidak membuktikan impor benar**; karena itu `check-imports.mjs` jalan lebih dulu. Pemeriksa itu **mencocokkan kata, bukan rujukan** (mis. `.select(` Supabase dianggap `select` dari ui.js, kelas CSS `mini-progress` dianggap `progress`). Solusinya impor namanya atau ganti nama kelas — **jangan melemahkan pemeriksanya**. Kolom indikator bernama `domain`, bukan `area`, karena alasan yang sama.
- **Dev server lama membuat Playwright memakai modul basi** (`reuseExistingServer:true`). Periksa `netstat -ano | findstr :5173`.
- **Vite basi bisa menyajikan `style.css` kosong**: matikan server, hapus `node_modules/.vite`, jalankan ulang. Jangan mengubah CSS untuk "memperbaikinya".
- **Tab localhost yang dimuat ulang sesaat setelah migrasi bisa keluar dari akun**: pemuatan data gagal karena cache skema API belum mengenal tabel baru, dan aplikasi mengeluarkan akun saat pemuatan gagal. Tunggu beberapa detik setelah `db push`.
- **Deploy GitHub Actions bisa tersangkut *Queued*** walau status GitHub normal. Obatnya: pemilik Cancel workflow lalu Re-run all jobs dari akun GitHub-nya (`gh` tidak terpasang).
- **`String.replace` memakan `$$` menjadi `$`** di teks pengganti. Untuk skrip penggantian, pakai `split(a).join(b)` dan periksa jumlah kecocokan. Heredoc bash juga bisa memakan backslash regex — tulis skrip bantu dengan tool Write.
- **`<footer class="home-doa">` juga anak `.workspace`**: aturan penyembunyi kaki halaman wajib `.workspace > footer:not(.home-doa)`.
- **Modal (`<dialog>`) ada di lapisan paling atas**; `notify()` menempel ke `dialog[open]` bila ada.
- **Pane browser kadang memotret bingkai lama** saat halaman digulir lewat JS; periksa lewat DOM (`innerText`) bila potretnya janggal.
- Keluaran `supabase db query` diakhiri pemberitahuan versi CLI; ambil bagian JSON-nya. SQL harus **satu baris**.
- Pesan commit: `git commit -F <file>`.
- Setelah edit besar, pastikan tidak ada byte NUL di `src/main.js` dan berkas CSS tetap UTF-8 valid.
- CSS memberi `display` ke `label`, jadi `hidden` dipaksa lewat `[hidden]{display:none!important}`.

## Tampilan HP (≤620px)
- **Tema gelap emas**: blok "dark gold theme" di `style.css` menimpa `:root` pertama; `--green` sebenarnya emas `#c79a3b`.
- Di bawah 620px sidebar dan topbar disembunyikan; semua tab memakai `homeTop` dan `homeDoa`. Menu utama (`homeMenu`) empat kartu: guru Ruang kelas · Ringkasan · Data siswa · Kurikulum; pemilik Tim pengajar menggantikan Ruang kelas. Navbar bawah (`homeNav`) Ringkasan · Siswa · Ruang kelas/Tim pengajar · Kurikulum; urutannya dikunci tes render.
- Slogan berganti per 30 menit, doa sekali sehari. Teks doa sudah diterima pengguna; jangan disunting tanpa diminta.
- Teks layar login dikunci tes Playwright (`Assalamu’alaikum`, `Masuk`, `Aktifkan akun`).

## Catatan lain
- Ganti kata sandi: tombol ⚿ di kartu akun / tombol di doa HP. **Claude tidak pernah mengetikkan kata sandi pengguna.**
- Claude **tidak bisa memeriksa tampilan di balik login sendirian**; minta pengguna login di pane browser. Jangan mengubah data produksi tanpa izin; kalau terpaksa mencoba, kembalikan dan buktikan dengan query.
- Berkas lokal tidak dilacak git (bukan acuan): `scripts/.tmp-inspect-hafsah.ps1`, `scripts/.tmp-run-hafsah-scenario.ps1` (bukan buatan Claude), `scripts/run-smoke-ai.local.ps1` dan `scripts/bootstrap-owner.sql` (lama). Ketiganya yang `.ps1` merujuk arsitektur/AI lama dan tidak lagi berfungsi. `.gitignore` mengabaikan `scripts/.tmp-*` dan `.claude/`.
- Rahasia Anthropic untuk Edge Function lama mungkin masih tersimpan di Supabase (Project Settings → Edge Functions → Secrets); tidak dipakai lagi.
- Dokumen lain: `README.md` dan `PANDUAN_SETUP.md` sudah disesuaikan dengan arsitektur pilot. `Cetak_Biru_Final_Bimbel_Manager.md` dan `docs/mockups/` adalah **arsip rancangan awal** (Google Sheets/AppSheet, level 1–10, mockup per-level) — tidak berlaku, jangan dijadikan acuan.
- Migrasi lama di `supabase/migrations/` tetap disimpan sebagai riwayat (Supabase mencatatnya); isinya membangun lalu dihapus oleh migrasi terakhir. Jangan menyunting atau menghapus migrasi yang sudah diterapkan; perubahan selalu lewat migrasi baru.
- Yang masih terbuka (hanya bila pengguna meminta):
  - Saran penilaian terhadap tes diagnostik (13 Sep 2026): pilihan "uji Level X+1 dulu" setelah lulus; ukuran L1-1 tidak cocok untuk tes ±8 menit; ◐ untuk ukuran yang bukan hitungan; uji coba dengan anak sungguhan; tombol "Tes diagnostik sekarang" setelah menambah siswa.
  - Alur kelas pilot (lihat Aturan bisnis).
  - CSS sisa arsitektur lama (kartu evaluasi, jadwal, dll.) masih ada di `style.css`/`curriculum.css`.
