# Rumah Belajar Rainbow Kids Alfatih

Aplikasi web internal untuk mengelola pembelajaran tematik multigrade. GitHub Pages menyediakan tampilan, Supabase menyediakan database, autentikasi, dan fungsi server, sedangkan Anthropic membantu membuat panduan kelas serta draf kabar untuk orang tua.

## Model pembelajaran

- Tiga bidang inti: Bahasa Indonesia, Matematika, dan IPAS.
- Bahasa Indonesia dilacak melalui empat elemen mandiri: menyimak, berbicara, membaca, dan menulis.
- English Exposure wajib menyatu dalam setiap tema sebagai pengayaan, tetapi tidak menjadi syarat kelulusan.
- Karakter bukan mata pelajaran atau level. Guru mencatat perilaku yang terlihat dalam kegiatan: kemandirian, tanggung jawab, kerja sama, kepedulian, dan komunikasi santun.
- Materi Pendidikan Pancasila yang relevan terintegrasi dalam tema IPAS sosial, Bahasa Indonesia, dan observasi karakter. Riwayat jalur Pancasila dan Karakter lama tetap disimpan sebagai arsip nonaktif.
- Enam belas level menunjukkan posisi kompetensi, bukan kelas sekolah atau label kemampuan anak.

Setiap sesi memakai satu tema dan satu panduan kelas. Sistem memilih target secara spiral dan membagi siswa ke maksimal tiga kelompok berdasarkan posisi kompetensi, bukan kelas sekolah:

- 60 menit: dua target inti.
- 75 menit: dua target inti dan integrasi ringan.
- 90 menit: maksimal tiga target atau proyek tematik.

Panduan AI memuat alokasi waktu, pembukaan bersama, kartu kelompok terdiferensiasi, English Exposure, asesmen individual, titik observasi karakter, dan tindak lanjut spiral.

## Fitur utama

- Login pemilik/guru berdasarkan email terdaftar dan penugasan siswa, dengan Row Level Security.
- Profil siswa, minat, diagnostik, baseline terkunci, dan target kompetensi level 1–16.
- Satu panduan mengajar bersama per kelas dan satu rekaman evaluasi per siswa.
- Bank tujuan serta kriteria keberhasilan 16 level yang dapat dikelola pemilik.
- Dua bukti `Tercapai` pada kesempatan berbeda menaikkan kompetensi tersebut satu level.
- Alarm setelah tiga hasil `Belum tampak` atau `Mulai berkembang` pada kompetensi aktif yang sama.
- Guru menambahkan dan mengelola siswanya sendiri: profil, titik awal (dapat dikoreksi sampai anak ikut kelas), status, serta ujian sumatif per fase. Target tidak diisi guru: setiap kompetensi mengalir ke akhir fasenya (level 4, 8, 12, 16); lulus ujian sumatif fase memindahkan target ke fase berikutnya, dan lulus di akhir Fase C berarti lulus. Pemilik hanya membaca data siswa, mendaftarkan guru, dan mengelola kurikulum.
- Sakit, Izin, dan Alfa mendapatkan draf pesan tanpa AI dan tanpa kenaikan level.
- Panduan dan rapor disimpan; permintaan ulang memakai hasil tersimpan.
- Tautan WhatsApp membawa draf, tetapi guru tetap memeriksa dan mengirim pesan.

## Menjalankan dan menguji

```powershell
npm ci
npm run dev
npm test
npx playwright test
npm run build
```

Konfigurasi browser berada di `public/config.json`. URL dan **publishable key** boleh diketahui browser; login dan RLS membatasi data. Jangan menggantinya dengan secret key. Untuk pengembangan, `.env` berdasarkan `.env.example` dapat menimpa konfigurasi publik.

Pengujian database menggunakan PostgreSQL lokal berbasis PGlite. Pengujian browser memakai Chrome yang terpasang. Hasil build berada di `dist/`.

## Deploy dan struktur

Lihat [PANDUAN_SETUP.md](PANDUAN_SETUP.md). Workflow `.github/workflows/pages.yml` menguji dan memublikasikan build ketika `main` diperbarui.

| Lokasi | Fungsi |
| --- | --- |
| `src/` | Aplikasi web responsif |
| `public/config.json` | Konfigurasi Supabase untuk browser |
| `supabase/migrations/` | Skema, RLS, kurikulum, dan transaksi evaluasi |
| `supabase/functions/generate-learning/` | Pembuatan panduan kelas dan draf rapor |
| `tests/` | Pengujian domain, database, dan browser |

Versi aplikasi lama (`app.py`, `style.css`, `BimbelManager.gs`), `.streamlit/`, dan `requirements.txt` adalah arsip versi awal. CSV siswa, secret, dan lingkungan Python lokal tidak diunggah ke GitHub.

## Batas operasional

Aplikasi membutuhkan internet dan keluaran AI wajib diperiksa guru. Posisi awal menyimak, berbicara, menulis, IPAS, dan English Exposure diwarisi secara konservatif dari diagnostik Bahasa Indonesia, lalu berkembang mandiri. Guru pendamping perlu memastikan titik awal sesuai hasil diagnostik sebelum anak ikut kelas. Data dibaca dengan pagination, tetapi tampilan perlu dioptimalkan kembali bila riwayat sudah sangat besar. Pencadangan database disesuaikan dengan paket Supabase.
