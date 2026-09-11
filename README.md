# Rumah Belajar Rainbow Kids Alfatih

Aplikasi web internal untuk Rumah Belajar Rainbow Kids Alfatih. GitHub Pages menyediakan tampilan; Supabase menyediakan database, autentikasi, dan fungsi server. Anthropic membuat panduan mengajar personal dan draf rapor WhatsApp.

## Fitur

- Login pemilik/guru berdasarkan email terdaftar dan penugasan siswa, dengan Row Level Security.
- Profil siswa, minat, diagnostik, baseline terkunci, dan target kompetensi 1–16.
- Tujuh jalur kompetensi mandiri: Membaca, Menulis, Matematika, Bahasa Inggris, Karakter, IPAS, dan Pendidikan Pancasila.
- Satu rekaman per anak dalam setiap sesi: kehadiran, tiga target prioritas, materi, bukti perkembangan, dan rapor.
- Bank tujuan dan kriteria keberhasilan pada 16 level yang dapat dikelola pemilik.
- Dua bukti `Tercapai` pada kesempatan berbeda menaikkan bidang tersebut satu level; bidang lain tidak ikut berubah.
- Alarm tiga hasil `Belum tampak`/`Mulai berkembang` pada bidang yang sama, hanya terlihat pemilik.
- Keputusan kelulusan oleh pemilik setelah seluruh kompetensi wajib mencapai target dan ujian sumatif selesai. Bahasa Inggris bersifat pengayaan.
- Sakit/Izin/Alfa mendapatkan draf tanpa AI dan tanpa kenaikan level.
- Materi/rapor disimpan. Permintaan ulang menggunakan hasil tersimpan.
- Batas 100 percobaan AI per pengguna dalam 24 jam; 5 percobaan per keluaran.
- Tautan WhatsApp membawa draf; guru tetap memeriksa dan mengirim pesannya.

## Menjalankan dan menguji

```powershell
npm ci
npm run dev
npm test
npx playwright test
npm run build
```

Konfigurasi browser berada di `public/config.json`. URL dan **publishable key** boleh diketahui browser; login dan RLS membatasi data. Jangan menggantinya dengan secret key. Untuk pengembangan, `.env` berdasarkan `.env.example` dapat menimpa konfigurasi publik.

Pengujian database menggunakan PostgreSQL lokal berbasis PGlite, bukan produksi. Pengujian browser memakai Chrome yang terpasang. Hasil build berada di `dist/`.

## Deploy dan struktur

Lihat [PANDUAN_SETUP.md](PANDUAN_SETUP.md). Workflow `.github/workflows/pages.yml` menguji dan memublikasikan build ketika `main` diperbarui.

| Lokasi | Fungsi |
| --- | --- |
| `src/` | Aplikasi web responsif |
| `public/config.json` | Konfigurasi Supabase untuk browser |
| `supabase/migrations/` | Skema, RLS, transaksi evaluasi, penguncian AI |
| `supabase/functions/generate-learning/` | Pemanggilan Anthropic dari server |
| `tests/` | Pengujian domain, database, browser |

Versi aplikasi lama (`app.py`, `style.css`, `BimbelManager.gs`), `.streamlit/`, dan `requirements.txt` adalah arsip versi awal. Tidak digunakan oleh aplikasi web baru. CSV siswa, secret, dan lingkungan Python lokal tidak diunggah ke GitHub.

## Batas operasional

Aplikasi membutuhkan internet. Guru perlu memeriksa keluaran AI. Progres dihitung relatif terhadap baseline dan target masing-masing kompetensi. Penempatan awal bidang selain Membaca dan Matematika diwarisi dari baseline Membaca, lalu berkembang secara mandiri; tinjau hasil diagnostik sebelum digunakan. Data dibaca dengan pagination agar tidak terpotong batas API, tetapi tampilan memuat seluruh riwayat yang diizinkan dan perlu dioptimalkan jika volumenya sangat besar. Pencadangan database perlu disesuaikan dengan paket Supabase.
