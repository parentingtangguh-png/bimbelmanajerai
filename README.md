# Rumah Belajar Rainbow Kids Alfatih

Aplikasi web internal bimbel dengan **kurikulum 8 level** (TK A sampai akhir kelas I): pendaftaran siswa, Tes Diagnostik untuk menentukan titik mulai anak, Ruang kelas, dan halaman Kurikulum. Tampilan di GitHub Pages; database dan autentikasi di Supabase.

Catatan kerja lengkap untuk pengembang (dan Claude) ada di [CLAUDE.md](CLAUDE.md).

## Model pembelajaran

- **Kurikulum 8 level**: satu Capaian Pembelajaran, 8 level, masing-masing 12 indikator akademik (menyimak/berbicara, huruf/bunyi, membaca, menulis, bilangan, pola/ukuran/operasi hitung) ditambah English dan Karakter. Isi terkunci di [`docs/curriculum/`](docs/curriculum/) dan dibangkitkan ke database oleh `scripts/build-curriculum.mjs`.
- **Satu level per anak**, bukan per mata pelajaran. Indikator akademik berjalan berurutan 1–12.
- **Delapan tema × 4 subtema** berjalan menurut nomor pertemuan (24 pertemuan per tema) sebagai konteks bersama kelas multi-level; tema tidak menentukan indikator anak.
- **Tes Diagnostik satu level**: 14 tugas (Lulus / Belum / Belum dinilai), draf tersimpan di server dan bisa dilanjutkan, berhenti dini bila A1, B1, E1, D1 semuanya Belum, lalu Simpan final. Anak mulai kelas dari indikator akademik pertama yang belum Lulus.
- **Ruang kelas**: satu indikator akademik per anak per sesi (Lulus / Belum / Belum dinilai); English dan Karakter opsional; 12 Lulus → guru mengonfirmasi naik level.
- **Lembar sesi mengikuti urutan kerja guru**: siswa hadir → rencana kegiatan (Prompt kegiatan untuk ChatGPT/Gemini, kehadiran tersimpan otomatis) → penilaian → simpan.

## Fitur

- Login pemilik dan guru berdasarkan email yang didaftarkan pemilik, dengan Row Level Security dan isolasi antar guru.
- Guru menambah dan mengelola siswanya sendiri: identitas, Tes Diagnostik (hasil final tanpa revisi), kemajuan per level, naik level, status aktif/nonaktif, hapus (hanya bila belum pernah ikut kelas).
- Ruang kelas: jadwal per hari mengajar dengan beberapa sesi, siswa hadir, Prompt kegiatan, penilaian, tema hari ini.
- Kabar harian WhatsApp untuk orang tua dari sesi yang sudah selesai: guru membuka pesan yang sudah tersusun (keberhasilan hari ini, karakter, English, pertemuan berikutnya, latihan di rumah, kotak kemajuan) lalu mengirim sendiri. Kalimat di [`docs/curriculum/kabar-orang-tua.md`](docs/curriculum/kabar-orang-tua.md).
- Panduan singkat per tab (📖 Panduan) untuk guru dan pemilik.
- Pemilik membaca data umum siswa, ringkasan tes, dan jadwal; mendaftarkan guru; membaca kurikulum.
- Tampilan khusus HP: menu utama, navbar bawah, doa harian.

## Menjalankan dan menguji

```powershell
npm ci
npm run dev
npm test
npx playwright test
npm run build
```

Konfigurasi browser berada di `public/config.json` (URL proyek dan **publishable key**; login dan RLS membatasi data). Jangan menggantinya dengan secret key. Untuk pengembangan, `.env` berdasarkan `.env.example` dapat menimpanya.

`npm test` memeriksa impor antar modul, lalu menjalankan tes kesesuaian kurikulum dengan dokumen, tes database (PGlite menjalankan semua migrasi), tes tampilan, tes domain, tes pesan WhatsApp orang tua, dan tes pemulihan cadangan. `npx playwright test` menguji layar login.

## Struktur

| Lokasi | Fungsi |
| --- | --- |
| `src/` | Aplikasi web (`main.js`, `state.js`, `diagnostic.js`, `prompt.js`, `kabar.js`, `markdown.js`, layar di `views/`) |
| `docs/curriculum/` | Isi kurikulum terkunci (sumber tabel `k8_*`) |
| `scripts/build-curriculum.mjs` | Pembangkit migrasi kurikulum dari dokumen |
| `scripts/build-kabar.mjs` | Pembangkit `src/kabar-data.js` dari kalimat pesan orang tua |
| `scripts/backup-data.mjs` | Cadangan manual data aplikasi (hanya membaca) ke folder di luar repo |
| `public/config.json` | Konfigurasi Supabase untuk browser |
| `supabase/migrations/` | Skema, RLS, kurikulum, tes diagnostik, dan Ruang kelas (riwayat lengkap) |
| `tests/` | Tes kurikulum, database, tampilan, domain, pesan orang tua, cadangan, dan browser |
| `.github/workflows/pages.yml` | Uji dan publikasi otomatis saat `main` diperbarui |

Setup dan deploy: [PANDUAN_SETUP.md](PANDUAN_SETUP.md). `Cetak_Biru_Final_Bimbel_Manager.md` dan `docs/mockups/` adalah arsip rancangan awal dan tidak lagi berlaku.
