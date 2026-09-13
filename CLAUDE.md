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
**Sudah di produksi** (migrasi terakhir `20260913090000_diagnostic_no_revision.sql` — revisi tes dihapus; sebelumnya commit `c56153d` `20260913080000_pilot_only_architecture.sql`, Edge Function `generate-learning` sudah dihapus dari Supabase):
- Arsitektur pilot saja (lihat bagian berikut). Semua tes, build, dan Playwright hijau saat deploy.
- Data produksi (14 Sep 2026): 10 siswa milik Hafsah — 5 lama + 5 tambahan realistis yang dimasukkan Claude dengan izin pemilik beserta tes diagnostiknya (Nayla L1, Rizky L2, Alya L3, Hafiz L3, Zahra L4). Sebelumnya: 6 akun di `access_list` + 6 `profiles`; 5 siswa percobaan milik guru **Hafsah Isykarima**, semuanya sudah dites diagnostik (8 nilai per anak): Aisyah Putri Rahmawati L1, Muhammad Fathan Alfarizi L2, Khansa Nabila Azzahra L3, Doni Saputra L4, Rafa Arkana Pratama L4 (semua "Belum lulus" di level yang dites). Nomor WA kosong kecuali Doni.

**Uji jalur simpan sudah lulus (13 Sep 2026, sesi kedua):** tambah siswa, tes, revisi, simpan profil tanpa perubahan, dan hapus siswa dicoba lewat tombol di aplikasi (akun Hafsah) dan dicocokkan dengan query; data Hafsah tidak berubah. Catatan: `confirm()` di pane browser otomatis dianggap Batal — untuk menguji hapus, timpa `window.confirm` sekali lewat JS setelah memastikan `data-id` tombol.

**Berikutnya:**
1. **Alur kelas pilot sudah dirancang** (Aturan bisnis → Ruang kelas, butir 1–8). Belum ada kode. Tanyakan pengguna apakah mulai membangun, dan jangan membahas aktivitas kelas/rapor sebelum diminta.
2. Kandidat lain (jangan dikerjakan tanpa diminta):
   - Saran perbaikan tes diagnostik (lihat Catatan lain → Yang masih terbuka).
   - Bersihkan data percobaan sebelum peluncuran.

**Riwayat singkat hari ini** (supaya tidak mengulang diskusi): kurikulum lama dihapus → kurikulum pilot Fondasi dipasang (CP, 4 level, 32 indikator, 8 tema + deskriptor) → instrumen tes diagnostik disusun dan direvisi berkali-kali bersama pengguna (bahan tanpa cetak, aturan tanda ◐, tugas pengamatan di bawah) → aturan tes berubah dari jalur naik-turun beberapa level menjadi **satu level per tes** → tampilan lama disembunyikan dari profil → pengguna memutuskan **aplikasi belum diluncurkan, jadi arsitektur lama dihapus total** kecuali akun dan data siswa Hafsah.

## Arsitektur sekarang (13 Sep 2026: arsitektur lama dihapus total)
Migrasi `20260913080000_pilot_only_architecture.sql` menghapus semua struktur lama: kurikulum 7 bidang × 16 level, level per bidang (`reading_*`/`math_*`), `student_competencies`, alarm, sesi kelas, kehadiran, evaluasi, observasi, centang indikator, potret, sesi jadwal, tema bebas, ujian sumatif, pekerjaan AI, dan Edge Function `generate-learning` (kodenya dihapus dari repo). **Jangan menghidupkan kembali struktur itu**; alur kelas pilot dirancang dari nol.

Yang tersisa (dan dijaga tes `struktur lama sudah tidak ada`):
- **Tabel**: `access_list`, `profiles`, `assignments`, `students`, `curriculum_phases`, `curriculum_levels`, `curriculum_level_indicators`, `curriculum_themes`, `diagnostic_tests`, `diagnostic_results`, `class_schedules`, `class_schedule_students`.
- **Fungsi**: `is_member`, `is_owner`, `can_teach`, `handle_new_user`, `check_student_identity`, `create_student`, `update_student_profile`, `set_student_active`, `delete_student`, `reject_owner_student_insert` (pemicu), `save_diagnostic`, `save_schedule`, `delete_schedule`, `save_meeting`.
- **Kelas pilot (migrasi `20260914000000`…`20260914050000`)**: setiap baris `class_schedules(teacher_id, meeting_number 1–192, theme_number, scheduled_date, scheduled_time, completed_at)` adalah **satu sesi**; sesi di tanggal yang sama berbagi `meeting_number` dan tema (pertemuan = hari mengajar). `class_schedule_students(schedule_id, student_id, level, indicator_number, result lulus|belum|null)`. RPC: `save_schedule(p_schedule, p_payload{scheduled_date, scheduled_time})` — tanggal = hari terakhir guru → tambah sesi (nomor sama); tanggal lebih baru → hari baru (nomor + 1, hanya bila semua sesi selesai); tanggal lebih lama ditolak; ubah = jam, tanggal hanya bila sesi tunggal di harinya. `delete_schedule` (sesi belum selesai di pertemuan terakhir). `save_meeting(p_schedule, p_students[{student_id, result}], p_finish)` — level & indikator dari `current_indicator`; **satu anak satu sesi per tanggal**; final menunggu pertemuan (hari) sebelumnya, bukan sesi lain di hari yang sama. `current_indicator(student)` = indikator 1–6 terkecil yang belum Lulus di sesi selesai, atau 6 (bukan RPC). Guru membaca jadwalnya sendiri, pemilik membaca semua.
- **students**: `id, name, parent_name, phone, status ('Aktif'|'Non-Aktif'), created_at, nickname, birth_date, school_grade, school_year, pilot_level`. `pilot_level` **kosong sampai tes diagnostik disimpan**, dan hanya diubah RPC.
- **diagnostic_tests** (unik per siswa, final): `tested_level, passed, final_level, note, tested_on, teacher_id`. Check `final_level` = lulus ? min(level+1, 4) : level. **"Sudah dites" = ada baris ini** — tidak ada kolom penanda lain, dan status "Lulus/Belum lulus Level X" diturunkan (`testStatus` di `state.js`).
- **diagnostic_results**: nilai T/B/N per indikator + salinan `indicator_text`.
- Tulis langsung ke tabel ditolak (RLS tanpa kebijakan tulis); semua perubahan lewat RPC `security definer`.
- `diagnostic_tests` dibaca guru pendamping **dan pemilik** (ringkasan); `diagnostic_results` hanya guru pendamping.

## Aturan bisnis yang sudah diputuskan pengguna
- **Guru** mengelola siswanya sendiri: tambah siswa (otomatis milik guru pembuat), Tes Diagnostik (sekali, final), profil, Nonaktifkan/Aktifkan kembali, hapus siswa (tidak bila dibagi guru lain).
- **Pemilik** hanya membaca data umum, mendaftarkan guru (Tim pengajar), dan membaca kurikulum. Database menolak pemilik menambah/mengubah siswa dan menyimpan tes.
- **Isolasi antar guru** wajib: RLS + RPC yang memeriksa `can_teach`. Ada tesnya di `tests/database.test.mjs`.
- **Kurikulum pilot** (disetujui pemilik kata demi kata): CP Fase Fondasi → 4 level (judul + deskripsi) → 8 indikator per level (area di kolom `domain`; nomor 7 English, nomor 8 Karakter "observasi guru") → 8 tema × 24 pertemuan dengan deskriptor. Level milik anak secara utuh, bukan per bidang. Perubahan isi kurikulum: **draf teks dulu**, tunggu persetujuan, lalu migrasi.
- **Tes Diagnostik — satu level per tes**:
  - Guru memilih anak aktif yang belum dites dan **satu level** (kelas formal hanya saran: Belum sekolah→1, TK A→2, TK B→3, SD→4; deskriptor level tampil di bawah pilihan), menilai 8 tugas (✓ Tercapai / ◐ Dengan bantuan atau kurang satu dari ukuran / ✗ Belum), lalu menyimpan.
  - **Lulus** = indikator 1–6 semuanya ✓. English (7) dan Karakter (8) hanya dicatat. Lulus Level X → mulai Level X+1 (Level 4 tetap 4, "melampaui Fondasi"); belum lulus → mulai Level X.
  - **Satu tes final per anak, tanpa revisi** (migrasi `20260913090000_diagnostic_no_revision.sql`): `save_diagnostic` menolak tes kedua, kolom `revised_at` dan tombol revisi sudah dihapus. Salah input → hapus siswa lalu tambah ulang.
  - Tugas, bahan, ukuran, dan penanda "diamati sepanjang tes" menempel pada indikator (`curriculum_level_indicators.diagnostic_*`). Tugas yang diamati sepanjang tes (L1-1 dan semua indikator 8) tampil paling bawah. **Tanpa berkas cetak**: huruf/angka/kata ditulis guru di kertas/papan, gambar diganti benda nyata. Kalimat indikator L2-2 tetap "gambar benda" meski tugasnya memakai benda nyata (keputusan pemilik).
  - Hasil dihitung ulang di `save_diagnostic`; aplikasi hanya menampilkan.
  - Jawaban yang belum disimpan tersimpan di localStorage `bimbel.diagnostic.<user id>` per anak (jeda, pindah anak, lanjutkan di perangkat yang sama).
- **Catatan gaya belajar, minat, dan ringkasan teks diagnostik tidak lagi ada** (kolomnya sudah dihapus).
- **Ruang kelas (dibangun 14 Sep 2026, keputusan pemilik).** Situasi acuan: 1 guru, ±10 siswa, 2 sesi/hari, 5 siswa/sesi. Guru **tidak memilih pertemuan, tema, level, atau indikator**. Daftar: **Pertemuan terakhir** (hari: tanggal · Pertemuan N · Tema; sesi-sesinya urut jam dengan Buka · Ubah · Hapus / Lihat; **＋ Tambah sesi**) dan **Sebelumnya**. **Buat jadwal** (hari baru: Tanggal + Jam) hanya muncul bila semua sesi selesai. Saat kelas guru **Buka** sesi → centang **siswa yang hadir** (siswa tidak terikat jadwal; yang sudah masuk sesi lain di **tanggal yang sama disembunyikan** dengan keterangan jumlahnya, dan tampil lagi di tanggal berikutnya; belum dites tampil tetapi terkunci) → tiap siswa "Level X · Indikator N. …" (teks) + **Lulus / Belum** → **Simpan sementara** (selalu aktif) atau **Tandai sesi selesai** (final, **tanpa koreksi**; tombol nonaktif sampai ada siswa dan setiap siswa yang dicentang sudah Lulus/Belum, dengan keterangan sisa yang belum dinilai — `finishState`). Lulus → indikator berikutnya; Belum → tetap. **Antrean hanya 1–6**; English (7) & Karakter (8) mewarnai. Setelah 1–6 lulus tetap indikator 6 + tanda "siap naik" (konfirmasi belum dibangun).
- Pane browser Claude menjawab `confirm()` otomatis "Batal"; tombol yang meminta konfirmasi (Hapus, Tandai selesai, dll.) tampak tidak berfungsi di pane tetapi berfungsi di Chrome/HP (sudah dicek pemilik).
- **Indikator yang sudah lulus** tampil di profil siswa (level saat ini; `passedIndicators` di `state.js`, hanya dari pertemuan selesai). Pertemuan selesai tidak bisa dihapus lewat aplikasi. Data produksi 14 Sep 2026: 0 jadwal (jadwal percobaan sudah dihapus dengan izin pemilik). **Belum**: "siap naik" + konfirmasi guru (butir 5), rapor, aktivitas kelas, catatan English & karakter.
- **Rancangan alur kelas pilot (diputuskan pemilik 13 Sep 2026, belum dibangun)** — situasi acuan: 1 guru, ±5 anak beda level, satu tema, sesi 60 menit. Frekuensi pertemuan urusan guru; aplikasi tidak boleh berasumsi jadwal.
  1. **Pertemuan** dihitung **per guru**, maju 1 saat guru **menandai pertemuan selesai** (bukan kalender), tidak pernah mundur.
  2. **Tema** independen: hanya ditentukan nomor pertemuan (1–24 Tema 1, dst.) dan mewarnai pertemuan. Kolom `curriculum_themes.focus_indicators` **tidak dipakai** untuk memilih indikator anak (jangan dihapus tanpa draf + persetujuan).
  3. **English (7) dan Karakter (8)** seperti tema: mewarnai setiap pertemuan, **dicatat** (usulan: satu catatan opsional per anak per pertemuan, bentuk belum dikonfirmasi), **tidak menentukan** perpindahan indikator atau kenaikan level.
  4. **Indikator akademik 1–6**: tiap anak punya **satu indikator aktif** = nomor terkecil yang belum lulus di levelnya (**berurutan**, ditetapkan kurikulum). Di akhir kelas guru mengetuk **Lulus / Belum** untuk anak yang hadir (satu ketukan per anak, tanpa ◐). Lulus → indikator berikutnya; Belum → tetap. Anak selevel bisa berada di indikator berbeda.
  5. **Naik level**: 1–6 lulus → aplikasi menandai **"siap naik"** → **guru mengonfirmasi** → indikator aktif mulai dari 1 di level baru; riwayat level lama disimpan.
  6. **Tes diagnostik hanya menentukan level awal**, tidak terhubung ke kelas (nilai ✓ tes tidak dihitung). **Siswa baru wajib dites dulu**; yang belum dites tidak bisa dipilih hadir.
  7. **Revisi tes diagnostik dihapus** (sudah di produksi, lihat Tes Diagnostik).
  8. **Indikator ≠ aktivitas kelas.** Jangan menempelkan tugas/panduan latihan ke indikator. Layar tutup pertemuan hanya menampilkan kalimat indikator.
  - Belum diputuskan (**jangan dibahas sebelum pengguna meminta**): aktivitas kelas (bentuk, sumber isi), rapor, bentuk pasti catatan English & karakter.

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
