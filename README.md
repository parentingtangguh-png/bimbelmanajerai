# Bimbel Manager

Aplikasi web internal bimbel TK/SD. GitHub Pages menyediakan tampilan; Supabase menyediakan database, autentikasi, dan fungsi server. Anthropic membuat panduan mengajar personal dan draf rapor WhatsApp.

## Fitur

- Login pemilik/guru berdasarkan email terdaftar dan penugasan siswa, dengan Row Level Security.
- Profil siswa, minat, diagnostik, baseline terkunci, target membaca/berhitung.
- Satu rekaman per anak dalam setiap sesi: kehadiran, materi, evaluasi, rapor.
- Bank instruksi lima bidang pada 10 level yang dapat dikelola pemilik.
- SB/BSH menaikkan level sekali; MB mempertahankan level untuk remedial.
- Alarm tiga MB berturut-turut pada level sama, hanya terlihat pemilik.
- Keputusan kelulusan oleh pemilik setelah ujian sumatif, saat target tercapai.
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

`app.py`, `style.css`, `BimbelManager.gs`, `.streamlit/`, dan `requirements.txt` adalah arsip versi awal. Tidak digunakan oleh aplikasi web baru. CSV siswa, secret, dan lingkungan Python lokal tidak diunggah ke GitHub.

## Batas operasional

Aplikasi membutuhkan internet. Guru perlu memeriksa keluaran AI. Progres dihitung relatif terhadap baseline dan target. Kedua bidang naik bersama berdasarkan satu nilai formatif sesuai cetak biru; penilaian terpisah per bidang belum tersedia. Data dibaca dengan pagination agar tidak terpotong batas API, tetapi tampilan memuat seluruh riwayat yang diizinkan dan perlu dioptimalkan jika volumenya sangat besar. Pencadangan database perlu disesuaikan dengan paket Supabase.
