# Setup Rumah Belajar Rainbow Kids Alfatih — GitHub + Supabase

## 1. Koneksi akun

```powershell
cd D:\ribuan_pengguna\CLAUDE\bimbel_app
npx.cmd --yes supabase@latest login --output-format text --agent no
npx.cmd --yes supabase@latest projects list
npx.cmd --yes supabase@latest link --project-ref ypofmienpffbpgrwpclm
```

Proyek: `bimbelmanajerai` / `ypofmienpffbpgrwpclm`. Login browser dan CLI merupakan sesi berbeda. Gunakan `supabase logout` sebelum berganti akun.

## 2. Database

```powershell
npx.cmd --yes supabase@latest db push --linked --dry-run
npx.cmd --yes supabase@latest db push --linked
```

Jangan menjalankan `db reset` di produksi. Migrasi bersifat bertambah: riwayat Karakter dan Pendidikan Pancasila lama diarsipkan sebagai jalur nonaktif, bukan dihapus.

## 3. Pemilik pertama

Jalankan melalui SQL Editor dengan email pemilik yang benar dan huruf kecil:

```sql
insert into public.access_list(email,name,role,active)
values ('email-pemilik@example.com','Pemilik Bimbel','owner',true)
on conflict(email) do nothing;
```

Buka aplikasi, isi email dan kata sandi pilihan sendiri, pilih **Aktivasi akun yang sudah didaftarkan pemilik**, lalu konfirmasi email. Setelah itu gunakan **Masuk ke ruang belajar**. Jangan memberikan kata sandi kepada pengembang.

Jika akun Auth sudah ada sebelum skema dipasang, tambahkan profil melalui SQL Editor menggunakan `id` dari `auth.users`. Akun baru setelah migrasi dibuatkan profil otomatis.

## 4. URL autentikasi

Di **Authentication → URL Configuration**:

- Site URL: `https://parentingtangguh-png.github.io/bimbelmanajerai/`
- Redirect URLs: URL di atas dan `http://127.0.0.1:5173/`

Sign-up email/password harus aktif. Trigger menolak email yang tidak terdaftar dalam daftar akses. Gunakan SMTP sendiri bila kuota email bawaan tidak mencukupi.

## 5. Konfigurasi browser

`public/config.json` hanya berisi URL proyek dan **publishable key**. Nilai ini boleh disimpan di GitHub. `scripts/configure-public.ps1` mengambil konfigurasi tanpa mencetak atau menyimpan secret key. Variabel `VITE_SUPABASE_URL` dan `VITE_SUPABASE_PUBLISHABLE_KEY` dapat menimpa konfigurasi file. Jangan menaruh secret pada variabel berawalan `VITE_`.

## 6. AI

Di **Edge Functions → Secrets**, simpan `ANTHROPIC_API_KEY` dengan API key Anthropic yang memiliki saldo. Opsional: `ANTHROPIC_MODEL`, dengan default `claude-haiku-4-5-20251001`. Simpan langsung melalui dashboard dan jangan masukkan ke chat atau commit Git.

```powershell
npx.cmd --yes supabase@latest functions deploy generate-learning --project-ref ypofmienpffbpgrwpclm
```

`verify_jwt=false` disengaja untuk kompatibilitas signing key. Setiap permintaan tetap diverifikasi melalui `auth.getUser(token)`, kemudian diperiksa kembali oleh RLS dan keanggotaan aktif. Secret Anthropic tidak masuk ke browser.

## 7. GitHub Pages

Repositori: `https://github.com/parentingtangguh-png/bimbelmanajerai`.

1. Di **Settings → Pages → Build and deployment**, pilih **GitHub Actions**.
2. Push ke `main` dan tunggu workflow **Publish Bimbel Manager** selesai.
3. Buka `https://parentingtangguh-png.github.io/bimbelmanajerai/`.

Hanya build aplikasi yang dipublikasikan; data siswa berada di Supabase. Jangan commit CSV siswa, token, `.env`, atau `venv/`.

## 8. Alur operasional guru

1. Pemilik menambah siswa, diagnostik, baseline, serta target level 1–16.
2. Pemilik mendaftarkan email guru dan menugaskan siswa.
3. Guru membuka **Ruang kelas**, lalu memilih tanggal, durasi 60/75/90 menit, tema, dan siswa.
4. Sistem memilih dua target untuk 60/75 menit atau tiga target untuk 90 menit. Targetnya sama bagi kelas, tetapi level dan tugasnya berbeda sesuai posisi siswa.
5. Sistem membentuk maksimal tiga kelompok kompetensi. Kelompok bukan kelas sekolah dan dapat berubah pada sesi berikutnya.
6. Guru memeriksa kehadiran, lalu membuat satu **Panduan kelas bersama**. Panduan berisi alur waktu, kartu kelompok, English Exposure yang menyatu dengan tema, asesmen, dan titik observasi karakter.
7. Di akhir kelas, guru menilai setiap target dengan **Belum tampak**, **Mulai berkembang**, atau **Tercapai**. Dua bukti Tercapai pada kesempatan berbeda menaikkan kompetensi satu level.
8. Guru boleh mencatat respons English Exposure. Perkembangannya tersimpan, tetapi tidak menghalangi kelulusan.
9. Guru memilih karakter yang terlihat dan menulis konteksnya. Karakter tidak diberi nilai atau level.
10. Setelah evaluasi disimpan, guru membuat, memeriksa, dan mengirim draf kabar orang tua melalui WhatsApp.
11. Pemilik mencatat hasil sumatif setelah menyimak, berbicara, membaca, menulis, Matematika, dan IPAS mencapai target.

Siswa Sakit, Izin, atau Alfa tidak memerlukan panduan AI dan tidak mendapatkan kenaikan level. Perubahan kehadiran akan mengosongkan panduan kelas agar dapat dibuat kembali berdasarkan siswa yang benar-benar hadir.

## Pemecahan masalah

| Gejala | Langkah |
| --- | --- |
| Access token not provided | Login CLI kembali. |
| Cannot find project ref | Jalankan `supabase link`. |
| Email belum didaftarkan | Pemilik menambahkan email ke daftar akses. |
| Guru tidak melihat siswa | Periksa keaktifan akun dan penugasan siswa. |
| AI belum aktif | Atur secret Anthropic dan pastikan saldo tersedia. |
| AI sedang berlangsung | Tunggu; pekerjaan macet dapat dicoba lagi setelah tiga menit. |
| Panduan tidak sesuai kehadiran | Simpan ulang kehadiran, lalu buat panduan kelas kembali. |
| Konfirmasi email salah alamat | Periksa Site URL dan Redirect URLs. |
| Perubahan belum terlihat | Muat ulang data atau halaman. |
