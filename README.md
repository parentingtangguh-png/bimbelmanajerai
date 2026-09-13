# Rumah Belajar Rainbow Kids Alfatih

Aplikasi web internal bimbel. Saat ini berupa **pilot Fase Fondasi** (Level 1–4): pendaftaran siswa, kurikulum pilot, dan Tes Diagnostik untuk menentukan level awal anak. Ruang kelas pilot sedang dirancang. Tampilan di GitHub Pages; database dan autentikasi di Supabase.

Catatan kerja lengkap untuk pengembang (dan Claude) ada di [CLAUDE.md](CLAUDE.md).

## Model pembelajaran pilot

- **Kurikulum Fase Fondasi**: satu Capaian Pembelajaran (CP), empat level — Aku Siap Belajar, Aku Mulai Mengenal, Aku Mulai Bisa, Aku Siap ke SD — masing-masing delapan indikator (literasi, numerasi, bahasa lisan, English, dan karakter yang diamati guru).
- **Satu level per anak**, bukan per mata pelajaran.
- **Delapan tema** yang berjalan menurut nomor pertemuan (24 pertemuan per tema), sama untuk semua anak, masing-masing dengan deskriptor.
- **Tes Diagnostik satu level**: guru memilih level (dengan saran dari kelas formal), menilai delapan tugas (✓ Tercapai / ◐ Dengan bantuan / ✗ Belum), lalu menyimpan. Lulus bila indikator 1–6 semuanya ✓; lulus Level X berarti mulai belajar di Level X+1, belum lulus berarti mulai di Level X. Tugas, bahan, dan ukuran setiap tugas tersimpan bersama indikatornya di kurikulum.

## Fitur

- Login pemilik dan guru berdasarkan email yang didaftarkan pemilik, dengan Row Level Security dan isolasi antar guru.
- Guru menambah dan mengelola siswanya sendiri: identitas, Tes Diagnostik (bisa dijeda dan direvisi), status aktif/nonaktif, hapus.
- Pemilik membaca data umum siswa dan ringkasan tes, mendaftarkan guru, dan membaca kurikulum.
- Ringkasan: siswa aktif, sudah/belum dites, dan sebaran level.
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

`npm test` memeriksa impor antar modul, lalu menjalankan tes database (PGlite menjalankan semua migrasi), tes tampilan, dan tes domain. `npx playwright test` menguji layar login.

## Struktur

| Lokasi | Fungsi |
| --- | --- |
| `src/` | Aplikasi web (`main.js`, `state.js`, `diagnostic.js`, layar di `views/`) |
| `public/config.json` | Konfigurasi Supabase untuk browser |
| `supabase/migrations/` | Skema, RLS, kurikulum pilot, dan fungsi tes diagnostik (riwayat lengkap; migrasi terakhir menghapus arsitektur lama) |
| `tests/` | Tes database, tampilan, domain, dan browser |
| `.github/workflows/pages.yml` | Uji dan publikasi otomatis saat `main` diperbarui |

Setup dan deploy: [PANDUAN_SETUP.md](PANDUAN_SETUP.md). `Cetak_Biru_Final_Bimbel_Manager.md` dan `docs/mockups/` adalah arsip rancangan awal dan tidak lagi berlaku.
