# Rumah Belajar Rainbow Kids Alfatih — catatan kerja untuk Claude

Baca file ini dulu sebelum mengubah apa pun. Pengguna (pemilik bimbel) berkomunikasi dalam **bahasa Indonesia**; jawab dalam bahasa Indonesia.

Berkas ini menggambarkan **keadaan sekarang**, bukan riwayat. Kalau sesuatu di sini bertentangan dengan kode, kodenya yang benar — perbarui berkas ini.

## Proyek
- Aplikasi web internal bimbel dengan **kurikulum 8 level** (TK A sampai akhir kelas I). Frontend vanilla JS + Vite, backend Supabase (Postgres + RLS + Auth).
- GitHub: `parentingtangguh-png/bimbelmanajerai` (repo **publik** — jangan commit data pribadi, email guru, atau secret).
- Supabase project ref: `ypofmienpffbpgrwpclm` (sudah ter-link di `supabase/.temp`).
- Situs live (GitHub Pages, deploy otomatis saat push ke `main`): https://parentingtangguh-png.github.io/bimbelmanajerai/
- **Satu bimbel, satu pemasangan.** Bukan multi-tenant dan tidak akan dibagikan ke bimbel lain.
- **Belum diluncurkan, tetapi siap dipakai guru.** Produksi berisi 6 akun tim; 0 siswa, tes, dan jadwal (data uji dihapus 15–16 Sep 2026 dengan izin pemilik).

## ▶ Mulai di sini: status terakhir (16 Sep 2026)
- **Rencana aplikasi** [`docs/rencana-aplikasi.md`](docs/rencana-aplikasi.md): Fase 1–5 **sudah di produksi** (commit terakhir `dbddcbc`). Rencana aplikasi selesai.
- **Uji menyeluruh oleh pemilik di HP (16 Sep 2026) lulus**: tambah siswa, tes diagnostik (jeda/lanjut, final), profil & kemajuan, jadwal + tema hari ini, Prompt kegiatan + Salin, simpan sementara, **tandai sesi selesai, antrean maju, English terbuka di pertemuan ke-3, naik level**. Data uji dihapus langsung di database dengan izin pemilik (sesi selesai tidak bisa dihapus lewat aplikasi).
- **Tulisan di bawah nama anak (Data siswa & Ringkasan)**: guru melihat posisi antrean (`Indikator N · slot`, `Siap naik ke Level X`, `Kurikulum 8 level selesai`); pemilik melihat `Sudah dites`; tes draf `Tes Level X belum final`. Ringkasan hasil diagnostik (`testStatus`) tetap di profil dan kolom tabel pemilik.
- **Saran kepada pemilik (16 Sep 2026)**: mulai kelas nyata dengan 1 guru dan beberapa anak selama 1–2 minggu; akun guru dibuat dulu (Tim pengajar + Supabase Add user); ingatkan guru bahwa Simpan final dan Tandai sesi selesai tidak bisa dikoreksi lewat aplikasi.
- **Pekerjaan berikutnya yang diusulkan, menunggu pilihan pemilik** (saran Claude urut): (1) ~~panduan~~ **selesai** (lihat Panduan per tab); (2) ~~uji Prompt kegiatan~~ **selesai** (lihat Prompt kegiatan); (3) ~~menu terpotong~~ diperiksa 16 Sep 2026 di situs live (guru, lebar 394/360/320px): tidak ada yang terpotong; tabel Kurikulum sengaja bisa digeser (.md-table). Opsional: rapor/laporan orang tua, periksa cadangan data Supabase.
- **Kurikulum SD kelas 2–6: disarankan DITUNDA** 4–8 minggu sampai ada data kelas nyata (arsitektur terkunci berhenti di akhir kelas I; perluasan ±5× pekerjaan L1–L8 dan akan mewarisi kelemahan yang belum terlihat). Bila pemilik tetap ingin mulai: hanya keputusan cakupan dalam teks (sampai kelas berapa, mapel, pola 12 slot atau tidak), isi tetap disusun Codex.
- **Panduan per tab** (disetujui pemilik): `src/views/guide.js`, isi berbeda untuk guru dan pemilik per tab; tombol `📖 Panduan <tab>` di atas doa (HP) / kaki halaman (laptop) membuka modal (`data-action="guide"`). Teks harus sesuai kode layar; tes render memeriksa setiap `<b class="guide-btn">` ada di sumber view/main. Mengubah perilaku layar → perbarui panduan.
- Belum dibangun (hanya bila pemilik meminta): rapor, catatan English & karakter di luar Lulus/Belum, aktivitas kelas.
- **Pemilik meminta setiap hal yang perlu disetujui ditampilkan di pane sebagai layar yang dilihat pengguna** (halaman pratinjau dengan data contoh, atau sebelum/sesudah untuk perubahan di balik layar) — bukan daftar teknis.

## Kurikulum (isi terkunci)
- **Authority: [`CURRICULUM_ARCHITECTURE.md`](CURRICULUM_ARCHITECTURE.md)** dan dokumen di `docs/curriculum/`: matriks cakupan, milestone 12×8, indikator Alur A–F, English & Karakter, aturan diagnostik (`diagnostik.md`), CP–level–tema (`cp-level-tema.md`). **Jangan mengubah keputusan terkunci tanpa persetujuan eksplisit pemilik.** Perubahan isi: draf teks dulu, tunggu persetujuan.
- Peran: Codex (authority pedagogis) menyusun isi; Claude mengaudit terhadap arsitektur, batas antarslot, dan kebutuhan aplikasi. Prompt untuk Codex selalu berupa prompt lengkap dalam teks, bukan berkas.
- Struktur: 8 level × 14 indikator. Nomor 1–12 akademik menurut urutan slot A1 B1 E1 D1 C1 F1 A2 B2 E2 D2 C2 F2; 13 English; 14 Karakter. 8 tema × 4 subtema × 6 pertemuan (pertemuan 1–192).
- Database: tabel `k8_cp`, `k8_levels`, `k8_indicators(level, number, slot, competency, method, material, success)`, `k8_notes`, `k8_themes`, `k8_subthemes`, `k8_theme_english`; hanya dibaca. Dibangkitkan oleh `node scripts/build-curriculum.mjs` menjadi `supabase/migrations/20260915000000_curriculum_8_levels.sql` — **jangan disunting tangan**; `tests/curriculum-docs.test.mjs` menjaga kesamaannya. Perubahan dokumen setelah itu butuh migrasi baru (bukan menyunting yang sudah diterapkan).

## Arsitektur sekarang
Struktur lama (kurikulum 7 bidang × 16 level, evaluasi, AI, dll.) dihapus 13 Sep 2026; kurikulum pilot Fase Fondasi (4 level, tabel `curriculum_*`) dihapus 16 Sep 2026. **Jangan menghidupkan kembali struktur itu.**

Yang ada (dijaga tes `struktur lama sudah tidak ada`):
- **Tabel**: `access_list`, `profiles`, `assignments`, `students`, `diagnostic_tests`, `diagnostic_results`, `class_schedules`, `class_schedule_students`, `student_level_changes`, `k8_*`.
- **Fungsi RPC**: `create_student`, `update_student_profile`, `set_student_active`, `delete_student`, `start_diagnostic`, `rate_diagnostic`, `finalize_diagnostic`, `save_schedule`, `delete_schedule`, `save_meeting`, `confirm_level_up`. **Pembantu (bukan RPC)**: `is_member`, `is_owner`, `can_teach`, `handle_new_user`, `check_student_identity`, `reject_owner_student_insert`, `diagnostic_stopped`, `diagnostic_restart_level`, `passed_numbers`, `current_indicator`, `theme_attendance`.
- **students**: `id, name, parent_name, phone, status ('Aktif'|'Non-Aktif'), created_at, nickname, birth_date, school_grade, school_year, pilot_level (1–8)`. `pilot_level` kosong sampai tes diagnostik final, dan hanya diubah RPC (final, naik level).
- **diagnostic_tests** (unik per siswa): `tested_level, started_on, finalized_at (null = draf), start_level, start_indicator (null bila L8 selesai), curriculum_complete`. **"Sudah dites" = `finalized_at` terisi** (`finalTestFor` di `state.js`).
- **diagnostic_results**: satu baris per tugas yang dinilai `(test_id, number 1–14 kecuali 13, status lulus|belum, package utama|cadangan)`; tanpa baris = belum dinilai.
- **class_schedules**: satu baris = satu sesi `(teacher_id, meeting_number 1–192, theme_number → k8_themes, scheduled_date, scheduled_time, completed_at)`; sesi bertanggal sama berbagi nomor pertemuan dan tema (pertemuan = hari mengajar).
- **class_schedule_students**: `(schedule_id, student_id, level, indicator_number 1–12 | null bila 12 sudah Lulus, result lulus|belum|belum_dinilai|null, english_result, character_result)`.
- **student_level_changes**: riwayat naik level `(from_level, to_level, teacher_id, changed_at)`.
- Tulis langsung ke tabel ditolak (RLS tanpa kebijakan tulis); semua perubahan lewat RPC `security definer`.
- `diagnostic_tests` dibaca guru pendamping **dan pemilik** (ringkasan); `diagnostic_results` hanya guru pendamping. Guru membaca jadwalnya sendiri, pemilik membaca semua.

## Aturan bisnis yang sudah diputuskan pemilik
- **Guru** mengelola siswanya sendiri: tambah siswa (otomatis milik guru pembuat), Tes Diagnostik, profil, Nonaktifkan/Aktifkan kembali, naik level, hapus siswa (tidak bila dibagi guru lain **atau anak sudah pernah ikut kelas**).
- **Pemilik** hanya membaca data umum, mendaftarkan guru (Tim pengajar), dan membaca kurikulum. Database menolak pemilik mengubah siswa, tes, dan kelas. Profil untuk pemilik tidak menampilkan hasil per tugas maupun "Kemajuan Level".
- **Isolasi antar guru** wajib: RLS + RPC yang memeriksa `can_teach`. Ada tesnya di `tests/database.test.mjs`.
- **Tes Diagnostik** (aturan terkunci `docs/curriculum/diagnostik.md`; aturan di `src/diagnostic.js` hanya untuk tampilan, database menghitung sendiri):
  - Guru memilih anak aktif tanpa tes final dan **satu level** 1–8. Saran dari kelas formal: Belum sekolah/TK A→1, TK B→3, SD 1→5, SD 2+→7.
  - 14 kartu dengan urutan 1–6, English (13), 7–12, Karakter (14). Tiap tugas: **Lulus / Belum / Belum dinilai** + bahan utama/cadangan. **Setiap ketukan langsung disimpan** (`rate_diagnostic`); nilai boleh diubah sebelum final. English tidak dinilai pada anak baru.
  - **Berhenti dini**: level > 1 dan A1, B1, E1, D1 (nomor 1–4) semuanya Belum → nilai terkunci, tes tidak dihitung, hanya bisa diganti tes baru di awal pita sebelumnya (L7/8→5, L5/6→3, L2–4→1). Selain itu level tidak bisa diganti.
  - **Simpan final**: mulai dari indikator akademik pertama yang belum Lulus (belum dinilai = belum lulus); 12 Lulus → level berikutnya indikator 1; 12 Lulus di L8 → kurikulum selesai. Tanpa revisi; salah input → hapus siswa lalu tambah ulang (selama belum ikut kelas).
  - Tanpa berkas cetak: huruf/angka/kata ditulis guru, gambar diganti benda nyata.
- **Ruang kelas** (situasi acuan: 1 guru, ±10 siswa, 2 sesi/hari, 5 siswa/sesi). Guru **tidak memilih pertemuan, tema, level, atau indikator**.
  - Daftar: **Pertemuan terakhir** (tanggal · Pertemuan N · Tema · subtema; sesi urut jam dengan Buka · Ubah · Hapus / Lihat; **＋ Tambah sesi**) dan **Sebelumnya**. **Buat jadwal** (Tanggal + Jam) hanya bila semua sesi selesai. `save_schedule`: tanggal = hari terakhir → tambah sesi; tanggal lebih baru → hari baru (nomor + 1); lebih lama ditolak. `delete_schedule` hanya sesi belum selesai di pertemuan terakhir.
  - Lembar sesi disusun menurut urutan kerja (dikunci tes render): **1. Siswa yang hadir → 2. Rencana kegiatan** (Prompt kegiatan; dipakai sebelum kegiatan) **→ 3. Penilaian** (setelah anak diuji) → Simpan. Prompt dibentuk dari tes final + sesi yang sudah **selesai**; nilai hari ini baru masuk prompt pertemuan berikutnya. Simpan sementara menutup lembar (kotak prompt ikut hilang; disengaja). **Prompt kegiatan menyimpan sementara** kehadiran + nilai yang sudah diketuk lewat save_meeting (p_finish false) tanpa menutup lembar (hanya classScheduleStudents dimuat ulang; daftar dirender saat modal ditutup), menampilkan "Kehadiran tersimpan sementara"; gagal simpan → pesan merah, prompt tetap tampil; centang berubah → kotak prompt disembunyikan. Alasan: browser HP bisa memuat ulang tab saat guru pindah ke ChatGPT/Gemini. Diuji 16 Sep 2026 lewat build lokal (localhost:4173 memakai dist/config.json produksi) termasuk muat ulang halaman.
  - Isi lembar sesi: panel **Tema hari ini** (subtema, benda nyata, kosakata Indonesia dan English, situasi Karakter) → centang **siswa hadir** (hanya anak dengan tes final; yang sudah di sesi lain pada tanggal sama disembunyikan; **satu anak satu sesi per tanggal**) → tiap anak **satu indikator akademik aktif** + cara uji/bahan/tanda lulus + **Lulus / Belum / Belum dinilai**, lalu **English** dan **Karakter** (Tidak dinilai / Lulus / Belum).
  - Antrean: indikator aktif = nomor 1–12 terkecil yang belum Lulus di sesi selesai **atau di tes diagnostik final level itu**. Lulus → maju; Belum/Belum dinilai → tetap.
  - English & Karakter: opsional, **lulus sekali per level**, tidak memindahkan antrean dan **tidak menahan naik level**. English L2/L3/L5/L6/L8 hanya bisa dinilai bila anak hadir ≥3 pertemuan (hari) dalam satu tema **termasuk pertemuan hari ini**; L1/L4/L7 (ungkapan/warna tetap) bebas.
  - **Simpan sementara** (selalu) atau **Tandai sesi selesai** (final, tanpa koreksi; aktif bila setiap anak yang punya indikator aktif sudah dinilai — `finishState`). Final menunggu pertemuan (hari) sebelumnya selesai.
  - 12 akademik Lulus → "siap naik" (tanpa pilihan akademik di sesi). Profil guru: **Kemajuan Level X** dengan tombol **Naik ke Level X+1** (`confirm_level_up`; ditolak bila anak ada di sesi belum selesai). L8 → "Kurikulum 8 level selesai".
  - Sesi selesai tidak bisa dihapus lewat aplikasi — uji coba di produksi cukup sampai simpan sementara, lalu hapus. Bila pemilik ingin menguji sampai selesai: tunjukkan target, minta kata izin eksplisit ("hapus"), pastikan lewat SELECT bahwa target hanya siswa uji, lalu `delete from class_schedules where id in (...)` + `delete from students where id=...` (kaskade ke nilai sesi, tes, hasil, kaitan, riwayat naik level), buktikan dengan query hitung.
  - Uji di HP pemilik: pandu **satu langkah per pesan**, tunggu balasan/tangkapan layar sebelum langkah berikutnya. Jadwal hari berikutnya boleh memakai tanggal ke depan (untuk menguji syarat 3 pertemuan tanpa menunggu).
- Pane browser Claude menjawab `confirm()` otomatis "Batal"; di Chrome/HP berfungsi normal. Untuk uji di pane, timpa `window.confirm` lewat alat JS.
- **Indikator ≠ aktivitas kelas.** Belum diputuskan (jangan dibahas sebelum pemilik meminta): aktivitas kelas, rapor, catatan English & karakter.
- **Prompt kegiatan** (16 Sep 2026, teks disetujui pemilik): tombol di lembar sesi (aktif setelah siswa dicentang) membuka kotak teks + **Salin prompt**; tidak menyimpan data. Teks disusun `src/prompt.js` (`activityPrompt`): data kelas + tema/subtema/benda/kosakata/English/karakter; per siswa: panggilan, usia, kelas formal, level + gambaran, sudah lulus (x dari 12), kondisi sebelumnya (LULUS/BELUM/BELUM DINILAI + berapa kali, baru naik level, atau hasil diagnostik), hari ini dilatih + cara uji/bahan uji/tanda lulus, English/Karakter (sudah lulus / belum boleh dinilai / boleh dinilai + cara uji); 9 aturan (0–10/10–50/50–60, menit pendampingan per siswa, tanpa cetak + semua benda bahan uji di daftar Bahan, English/karakter boleh dinilai ditulis per siswa dengan menit + tanpa perintah yang membatalkan uji, bahan latihan ≠ bahan uji termasuk sebagian kata dan huruf/angka lain kecuali tidak ada pilihan (baris bahan uji tiap siswa ditandai "khusus untuk menilai, jangan dipakai untuk latihan"), "belum dinilai" bila tidak sah, 12 kata terlindungi, panjang ±250+120×siswa kata, tanpa tabel). **Mengubah teks prompt = draf ke pemilik dulu.** Uji 16 Sep 2026 (3/4/5 anak rekaan, kurikulum asli) di Claude, Gemini, ChatGPT: indikator akademik 36/36 tepat; sisa kesalahan acak per AI (kata uji dipakai latihan, English terlewat, urutan indeks). Satu sesi harus satu obrolan baru (obrolan tercampur membuat indikator salah); kotak prompt dan panduan mengatakannya, dan guru menilai dari lembar sesi, bukan teks AI. Tombol Salin prompt terbukti bisa dipakai berulang. Uji data nyata di produksi (16 Sep 2026, akun guru, siswa UJI Nara/Raka/Salwa + 1 jadwal belum disimpan, diuji pemilik di HP lalu dihapus lewat aplikasi; produksi kembali 0 siswa/tes/jadwal): lulus; panjang jawaban AI tetap melampaui batas di semua uji (diterima).

## Keputusan final — jangan ditawarkan lagi
- **Tidak memasang SMTP sendiri.** Guru baru dibuat lewat Supabase Dashboard → Authentication → Add user dengan **Auto Confirm**, setelah emailnya didaftarkan di Tim pengajar.
- **Tidak dibagikan ke bimbel lain.** Tidak perlu multi-tenant, halaman pemasangan, atau nama bimbel yang bisa dikonfigurasi.
- **Mode pratinjau dihapus.** Tidak ada cara masuk tanpa akun.
- **Arsitektur lama dihapus** (lihat di atas); jangan diusulkan dibangun ulang dalam bentuk lama.

## Alur kerja yang diharapkan pengguna
1. Kerjakan perubahan, jalankan `npm test`, `npm run build`, `npx playwright test`. Bila ada perubahan tampilan, buktikan (lihat Resep).
2. **Tampilkan di pane layar yang dilihat pengguna** (pratinjau data contoh, atau sebelum/sesudah bila perubahan di balik layar), laporkan hasil, lalu **minta persetujuan** sebelum deploy. Pengguna selalu menyetujui deploy secara eksplisit.
3. Setelah disetujui: `npx --no-install supabase db push --dry-run` → pastikan hanya migrasi baru yang tertunda → `npx --no-install supabase db push --yes` → baru commit & push (migrasi **harus** masuk sebelum frontend yang memakainya).
4. Verifikasi berkas JS di situs live memuat kode baru (bandingkan nama `assets/index-*.js`, lalu cari teks khas perubahan).
- **Menguji jalur simpan sebelum deploy**: `npm run build` lalu buka http://localhost:4173 (konfigurasi bimbel-dist; dist/config.json menunjuk Supabase produksi), minta pemilik login di tab itu, pakai data uji berawalan UJI lalu hapus lewat aplikasi dan buktikan dengan query hitung.
- Pertanyaan data produksi: query **baca saja** `npx --no-install supabase db query --linked "<satu baris SQL>"`.

## Susunan kode
- `src/main.js` hanya sambungan: klien Supabase, login, `refresh`, `render`, penangan klik/submit (termasuk `rateTask`: setiap ketukan tes diagnostik langsung ke `rate_diagnostic`).
- Layar di `src/views/`: `dashboard.js` (Ringkasan: siswa aktif, sudah/belum dites, sebaran level), `students.js` (daftar, profil, hasil tes, level saat ini, kemajuan & naik level, status, hapus), `diagnostic.js` (modal tes: `diagnostic-start` → lembar 14 tugas `diagnostic` / tes berhenti; `state.diagnostic` = id anak yang lembarnya terbuka), `sessions.js` (Ruang kelas: hari/sesi, lembar sesi, tema hari ini, `finishState`), `curriculum.js`, `team.js`, `guide.js` (panduan per tab), `home.js` (menu, kepala, doa, navbar HP).
- Dipakai bersama: `src/state.js` (state, konstanta, `testFor`/`finalTestFor`/`testStatus`/`levelName`, antrean `passedIndicators`/`suggestedIndicator`/`englishReady`, **tanpa DOM**), `src/diagnostic.js` (aturan tes, murni), `src/markdown.js` (isi dokumen kurikulum), `src/ui.js`, `src/domain.js` (`escapeHtml`, `localDate`).
- **View hanya menyusun teks HTML**; tidak memanggil `db`, `result`, `render`, atau `notify`. Semua aksi lewat `data-action`/`data-form` yang ditangani `main.js`. Kalau menambah bagian, buat fungsi kecil baru.
- Kode diformat **Prettier** (`.prettierrc.json`, lebar 110).

## Menguji
- `npm test` → `scripts/check-imports.mjs`, lalu tes Node: `curriculum-docs` (migrasi kurikulum = hasil pembangkit dari docs), `domain`, `database` (PGlite menjalankan **semua** migrasi, jadi yang diuji keadaan akhirnya), dan `render` (layar disusun dengan `tests/fixtures/sample-state.mjs`, tanpa browser).
- `npx playwright test` hanya menguji layar login.
- ⚠ **Jalur simpan di `main.js` tidak dijangkau tes mana pun.** Setiap perubahan pada payload RPC harus dicoba di aplikasi yang sudah login (minta pengguna login di pane browser), lalu diperiksa dengan query baca saja.
- Playwright pernah rapuh pada server dingin; `timeout` 60 dtk dan `expect.timeout` 20 dtk sengaja. Jangan diturunkan.
- `admin()` di tes database = setup data tanpa peran pengguna.

## Resep perintah singkat
**"ubah tampilan X"**: susun layar dengan data contoh (lihat `scripts/render-screens.mjs`) sebelum dan sesudah, sajikan bersama CSS hasil build lewat konfigurasi `bimbel-dist` (`.claude/launch.json`, `vite preview` port 4173; berkas di `dist/` terbaca di `http://localhost:4173/<nama>.html`) → tampilkan di pane → `npm test` + `npx playwright test`. Hapus berkas pratinjau dari `dist/` sesudahnya.
**"rapikan kode"**: `npx prettier --write "src/**/*.js" "src/*.css"` lalu buktikan bundel tidak berubah (`md5sum dist/assets/index-*.js`). ⚠ Jangan memformat `tests/database.test.mjs` dan `tests/domain.test.mjs` (sengaja bergaya padat).
**"deploy"**: Alur kerja langkah 3–4. Jangan pernah push tanpa persetujuan.
**"periksa data produksi"**: query satu baris, hanya SELECT.

## Jebakan teknis (Windows)
- **`npm run build` hijau tidak membuktikan impor benar**; karena itu `check-imports.mjs` jalan lebih dulu. Pemeriksa itu **mencocokkan kata, bukan rujukan** (mis. `.select(` Supabase dianggap `select` dari ui.js, kelas CSS `mini-progress` dianggap `progress`). Solusinya impor namanya atau ganti nama kelas — **jangan melemahkan pemeriksanya**. Nama variabel `progress` juga tertangkap (dianggap dari domain.js).
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
- Claude **tidak bisa memeriksa tampilan di balik login sendirian**; minta pengguna login di pane browser **pada situs live** (dev server lokal tidak punya konfigurasi Supabase). Jangan mengubah data produksi tanpa izin; kalau terpaksa mencoba, kembalikan dan buktikan dengan query.
- Berkas lokal tidak dilacak git (bukan acuan): dua skrip `scripts/.tmp-*.ps1` (bukan buatan Claude), `scripts/run-smoke-ai.local.ps1` dan `scripts/bootstrap-owner.sql` (lama). Ketiganya yang `.ps1` merujuk arsitektur/AI lama dan tidak lagi berfungsi. `.gitignore` mengabaikan `scripts/.tmp-*` dan `.claude/`.
- Rahasia Anthropic untuk Edge Function lama mungkin masih tersimpan di Supabase (Project Settings → Edge Functions → Secrets); tidak dipakai lagi.
- Dokumen lain: `README.md` dan `PANDUAN_SETUP.md` sudah disesuaikan dengan kurikulum 8 level. `Cetak_Biru_Final_Bimbel_Manager.md` dan `docs/mockups/` adalah **arsip rancangan awal** (Google Sheets/AppSheet, level 1–10, mockup per-level) — tidak berlaku, jangan dijadikan acuan.
- Migrasi lama di `supabase/migrations/` tetap disimpan sebagai riwayat (Supabase mencatatnya); isinya membangun lalu dihapus oleh migrasi terakhir. Jangan menyunting atau menghapus migrasi yang sudah diterapkan; perubahan selalu lewat migrasi baru.
- Yang masih terbuka (hanya bila pengguna meminta): tombol "Tes diagnostik sekarang" setelah menambah siswa; di HP pemilik kotak konfirmasi `confirm()` saat Simpan final sempat tidak terlihat walau tersimpan benar.
