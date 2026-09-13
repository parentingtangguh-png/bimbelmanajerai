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
npx --no-install supabase db push --dry-run
npx --no-install supabase db push --yes
```

Pastikan dry-run hanya menampilkan migrasi baru. Jangan menjalankan `db reset` di produksi, dan jangan menyunting migrasi yang sudah diterapkan: perubahan selalu lewat migrasi baru. Migrasi `20260913080000_pilot_only_architecture.sql` menghapus arsitektur lama; yang tersisa hanya akun, siswa, kurikulum pilot, dan tes diagnostik.

## 3. Pemilik pertama

Jalankan melalui SQL Editor dengan email pemilik yang benar dan huruf kecil:

```sql
insert into public.access_list(email,name,role,active)
values ('email-pemilik@example.com','Pemilik Bimbel','owner',true)
on conflict(email) do nothing;
```

Buka aplikasi, isi email dan kata sandi pilihan sendiri, pilih **Guru baru? Aktifkan akun yang sudah didaftarkan pemilik**, lalu konfirmasi email. Jangan memberikan kata sandi kepada pengembang.

## 4. Guru baru

1. Pemilik mendaftarkan nama dan email guru di **Tim pengajar**.
2. Akun guru dibuat lewat **Supabase Dashboard → Authentication → Add user** dengan **Auto Confirm** (tidak memakai SMTP sendiri).
3. Trigger menolak akun yang emailnya belum didaftarkan di Tim pengajar.

## 5. URL autentikasi

Di **Authentication → URL Configuration**:

- Site URL: `https://parentingtangguh-png.github.io/bimbelmanajerai/`
- Redirect URLs: URL di atas dan `http://127.0.0.1:5173/`

## 6. Konfigurasi browser

`public/config.json` hanya berisi URL proyek dan **publishable key**. Nilai ini boleh disimpan di GitHub. Variabel `VITE_SUPABASE_URL` dan `VITE_SUPABASE_PUBLISHABLE_KEY` dapat menimpa konfigurasi file. Jangan menaruh secret pada variabel berawalan `VITE_`.

Fitur AI lama (Edge Function `generate-learning`) sudah dihapus. Secret `ANTHROPIC_API_KEY` di **Edge Functions → Secrets**, bila masih ada, tidak dipakai lagi.

## 7. GitHub Pages

Repositori: `https://github.com/parentingtangguh-png/bimbelmanajerai`.

1. Di **Settings → Pages → Build and deployment**, pilih **GitHub Actions**.
2. Push ke `main` dan tunggu workflow **Publish Bimbel Manager** selesai.
3. Buka `https://parentingtangguh-png.github.io/bimbelmanajerai/`.

Kalau workflow tertahan lama di status *Queued*, buka tab **Actions**, pilih workflow itu, **Cancel workflow**, lalu **Re-run all jobs**.

Hanya build aplikasi yang dipublikasikan; data siswa berada di Supabase. Jangan commit CSV siswa, token, `.env`, atau `venv/`.

## 8. Alur operasional (pilot)

1. Pemilik mendaftarkan guru di **Tim pengajar**.
2. Guru menambah siswa di **Data siswa → ＋ Tambah siswa**: nama, panggilan, sapaan orang tua, WhatsApp, tanggal lahir, kelas formal. Level anak belum ditentukan.
3. Guru menjalankan **Tes Diagnostik**: pilih anak dan satu level (saran dari kelas formal), nilai delapan tugas, lihat hasil, simpan. Tes bisa dijeda dan dilanjutkan di perangkat yang sama, dan hasilnya final (tidak bisa direvisi; salah input diperbaiki dengan menghapus siswa lalu menambah ulang).
4. Hasil: "Lulus Level X" (mulai belajar Level X+1) atau "Belum lulus Level X" (mulai belajar Level X), dengan daftar indikator yang perlu dilatih.
5. **Ruang kelas** sedang disiapkan untuk kurikulum pilot.

## Pemecahan masalah

| Gejala | Langkah |
| --- | --- |
| Access token not provided | Login CLI kembali. |
| Cannot find project ref | Jalankan `supabase link`. |
| Email belum didaftarkan | Pemilik menambahkan email ke Tim pengajar. |
| Guru tidak melihat siswa | Periksa keaktifan akun guru; siswa hanya terlihat oleh guru yang menambahkannya. |
| Aplikasi keluar sendiri sesaat setelah migrasi | Tunggu beberapa detik sampai API mengenal skema baru, lalu login lagi. |
| Konfirmasi email salah alamat | Periksa Site URL dan Redirect URLs. |
| Perubahan belum terlihat | Muat ulang halaman; pastikan workflow GitHub Actions sudah selesai. |
