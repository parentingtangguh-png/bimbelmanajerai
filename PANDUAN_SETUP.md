# Setup Rumah Belajar Rainbow Kids Alfatih — GitHub + Supabase

## 1. Koneksi akun

```powershell
cd D:\ribuan_pengguna\CLAUDE\bimbel_app
npx.cmd --yes supabase@latest login --output-format text --agent no
npx.cmd --yes supabase@latest projects list
npx.cmd --yes supabase@latest link --project-ref ypofmienpffbpgrwpclm
```

Proyek: `bimbelmanajerai` / `ypofmienpffbpgrwpclm`. Pastikan akun benar. Untuk berganti akun, jalankan `supabase logout` dahulu. Login browser dan CLI merupakan sesi berbeda.

## 2. Database

```powershell
npx.cmd --yes supabase@latest db push --linked --dry-run
npx.cmd --yes supabase@latest db push --linked
```

Jangan menjalankan `db reset` di produksi. Migrasi membuat tabel, kebijakan akses, bank kurikulum, dan fungsi evaluasi. Pengunjung anonim tidak memiliki akses data siswa.

## 3. Pemilik pertama

Jalankan di SQL Editor dengan email pemilik yang benar, lowercase:

```sql
insert into public.access_list(email,name,role,active)
values ('email-pemilik@example.com','Pemilik Bimbel','owner',true)
on conflict(email) do nothing;
```

Buka aplikasi, isi email dan kata sandi pilihan sendiri, klik **Aktivasi akun yang sudah didaftarkan pemilik**, lalu konfirmasi email. Sesudahnya gunakan **Masuk ke ruang belajar**. Jangan memberikan password kepada pengembang.

Jika akun Auth sudah dibuat sebelum skema dipasang, tambahkan baris `profiles` untuk akun tersebut melalui SQL Editor dengan `id` dari `auth.users`. Akun baru setelah migrasi dibuatkan profil otomatis.

## 4. URL autentikasi

Di **Authentication → URL Configuration**:

- Site URL: `https://parentingtangguh-png.github.io/bimbelmanajerai/`
- Redirect URLs: URL di atas dan `http://127.0.0.1:5173/` untuk pengembangan.

Sign-up email/password harus aktif. Trigger menolak email di luar daftar akses. Gunakan SMTP sendiri bila kuota email bawaan tidak mencukupi.

## 5. Konfigurasi browser

`public/config.json` hanya berisi URL proyek dan **publishable key**. Boleh disimpan di GitHub. `scripts/configure-public.ps1` mengambil konfigurasi ini tanpa mencetak atau menyimpan secret key. Variabel `VITE_SUPABASE_URL` dan `VITE_SUPABASE_PUBLISHABLE_KEY` dapat menimpa konfigurasi file. Jangan menaruh secret pada variabel berawalan `VITE_`.

## 6. AI

Di **Edge Functions → Secrets**, simpan `ANTHROPIC_API_KEY` dengan API key Anthropic yang memiliki saldo. Opsional: `ANTHROPIC_MODEL`, default `claude-haiku-4-5-20251001`. Simpan langsung di dashboard, jangan dalam chat atau commit Git.

```powershell
npx.cmd --yes supabase@latest functions deploy generate-learning --project-ref ypofmienpffbpgrwpclm
```

`verify_jwt=false` disengaja untuk kompatibilitas signing key: setiap permintaan diverifikasi melalui `auth.getUser(token)`, lalu pemeriksaan RLS dan keanggotaan aktif sebelum AI. Secret Anthropic tidak masuk browser. Siswa absen tidak memerlukan AI.

## 7. GitHub Pages

Repositori: `https://github.com/parentingtangguh-png/bimbelmanajerai`.

1. **Settings → Pages → Build and deployment**: pilih **GitHub Actions**.
2. Push ke `main` dan tunggu workflow **Publish Bimbel Manager** selesai.
3. Buka `https://parentingtangguh-png.github.io/bimbelmanajerai/`.

Hanya `dist/` yang dipublikasikan; data siswa berada di Supabase. Jangan commit CSV siswa, token, `.env`, atau `venv/`. Evaluasi kembali ketentuan GitHub Pages jika aplikasi berkembang menjadi layanan SaaS komersial.

## 8. Operasional

1. Pemilik menambah siswa, diagnostik, baseline, dan target 1–10.
2. Pemilik mendaftarkan email guru pada **Tim pengajar**.
3. Guru mengaktifkan akun, lalu pemilik menugaskan siswa melalui profilnya.
4. Guru membuka **Ruang kelas** dan memilih tema serta siswa. Satu siswa hanya boleh memiliki satu sesi terbuka.
5. Simpan kehadiran sebelum membuat panduan. Sakit/Izin/Alfa mendapat draf tanpa AI.
6. Simpan evaluasi di akhir kelas. Nilai final tidak bisa diubah dari browser agar tidak terjadi kenaikan level ganda.
7. Buat dan periksa rapor, lalu buka WhatsApp. Guru yang mengirim pesan.
8. Pemilik memantau remedial dan mencatat hasil sumatif saat target tercapai.

CSV lama dapat menjadi referensi profil, tetapi tidak memiliki baseline. Tetapkan baseline melalui diagnostik; jangan menganggap nilai default sebagai hasil tes anak.

## Pemecahan masalah

| Gejala | Langkah |
| --- | --- |
| Access token not provided | Login CLI kembali. |
| Cannot find project ref | Jalankan `supabase link`. |
| Email belum didaftarkan | Pemilik menambahkan email di daftar akses. |
| Guru tidak melihat siswa | Periksa keaktifan akun dan penugasan siswa. |
| AI belum aktif | Atur secret Anthropic dan pastikan saldo tersedia. |
| AI sedang berlangsung | Tunggu; pekerjaan macet dapat dicoba lagi setelah 3 menit. |
| Konfirmasi email salah alamat | Periksa Site URL dan Redirect URLs. |
| Perubahan belum terlihat | Klik muat ulang data atau muat ulang halaman. |
