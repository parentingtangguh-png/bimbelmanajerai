# Prosedur akun guru (untuk pemilik)

Aplikasi tidak mengirim email (tidak ada SMTP sendiri). Karena itu semua urusan akun guru dikerjakan pemilik di Supabase Dashboard. Guru tidak perlu melakukan apa pun selain masuk.

Aturan umum:
- Kata sandi **minimal 8 karakter** (kotak login menolak yang lebih pendek).
- Serahkan kata sandi langsung ke guru, jangan lewat grup.
- Jangan menulis email guru atau kata sandi di berkas repo ini (repo publik).

## A. Menambah guru baru

1. Aplikasi → **Tim pengajar** → **＋ Daftarkan guru**: isi nama dan email guru.
2. Supabase Dashboard → **Authentication → Users → Add user → Create new user**:
   email yang sama, kata sandi minimal 8 karakter, **Auto Confirm User** dicentang.
3. Serahkan email dan kata sandi ke guru.

Tombol "Guru baru? Aktifkan akun" di halaman login tidak perlu dipakai. Bila guru terlanjur memakainya, akunnya tertahan "Email not confirmed" → jalankan prosedur B.

## B. Guru lupa kata sandi, atau muncul "Email not confirmed"

Supabase Dashboard → **SQL Editor** → **New query**, tempel:

```sql
update auth.users
set email_confirmed_at = coalesce(email_confirmed_at, now()),
    encrypted_password = crypt('GANTI_KATA_SANDI', gen_salt('bf')),
    updated_at = now()
where email = lower('GANTI_EMAIL_GURU')
returning email, email_confirmed_at;
```

1. Ganti `GANTI_KATA_SANDI` dengan kata sandi baru (minimal 8 karakter) dan `GANTI_EMAIL_GURU` dengan email guru. Tanda kutip `'` tetap ada.
2. Klik **Run**.
3. Hasil benar: **satu baris berisi email guru**. "No rows returned" berarti email salah ketik (periksa di Authentication → Users) dan tidak ada yang berubah.
4. Serahkan kata sandi baru ke guru.

Kata sandi **selalu** ikut diganti, walau masalahnya hanya "Email not confirmed": siapa pun yang tahu email guru bisa mendaftar lebih dulu dengan kata sandinya sendiri, dan akun itu tidak boleh diaktifkan dengan kata sandi tersebut.

Setelah selesai, tutup tab SQL Editor tanpa menyimpan query (kata sandi tertulis di sana).

## C. Guru berhenti

1. Minta Claude "buat cadangan dan uji" lebih dulu.
2. Aplikasi → **Tim pengajar** → **Nonaktifkan** pada guru itu. Akses guru langsung mati; data siswanya tetap tersimpan.
3. **Jangan menghapus akun guru di Supabase**: jadwal dan nilai kelas tercatat atas namanya.

Siswa guru yang berhenti belum bisa dipindahkan ke guru lain lewat aplikasi. Bicarakan dengan Claude bila ini terjadi.

## D. Guru ganti email

Jangan mengubah email guru yang sudah punya akun (akun dicocokkan ke Tim pengajar lewat email; mengubahnya di satu tempat saja membuat guru terkunci).
Nonaktifkan email lama (C langkah 2), lalu jalankan A dengan email baru. Siswa lama tidak ikut pindah.
