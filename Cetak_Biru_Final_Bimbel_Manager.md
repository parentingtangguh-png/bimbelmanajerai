> ⚠ **Arsip rancangan awal — tidak berlaku.** Aplikasi sekarang memakai Supabase dan kurikulum pilot Fase Fondasi. Acuan terkini: CLAUDE.md dan README.md.

# 🎓 CETAK BIRU FINAL: BIMBEL MANAGER CLOUD-BASED
### Sistem Manajemen Pembelajaran Adaptif Massal Berbasis AI (*Adaptive Mass-Learning Management System*)

---

## 🖥️ I. INFRASTRUKTUR CLOUD & KEAMANAN SISTEM (ANTHROPIC API GRID)

1. **Arsitektur Cloud Abadi (Google Sheets Database):** Seluruh data disimpan secara permanen pada Google Sheets di Google Drive milik Pemilik. Sistem bebas dari risiko kehilangan data akibat komputer mati atau *restart* server.
2. **Konektivitas Anthropic API (Claude 3.5):** Otomatisasi AI menggunakan Anthropic API Key (bukan OpenAI). Menggunakan model *Claude 3.5 Sonnet* atau *Claude 3.5 Haiku* melalui Google Apps Script untuk menghasilkan penalaran bahasa Indonesia yang jauh lebih tulus, hangat, dan presisi secara akademis.
3. **Aplikasi HP Guru yang Ringan (Google AppSheet Front-End):** Guru murni mengoperasikan kelas harian lewat aplikasi HP yang vertikal dan responsif. Aplikasi ini terhubung secara *real-time* ke database cloud Pemilik.
4. **Pengamanan Sistem Berbasis Email Google:** Keamanan diatur lewat alamat Gmail guru yang terdaftar di AppSheet.
   - **Hak Akses Guru:** Hanya bisa menginput kehadiran, melihat panduan materi di HP, memilih nilai formatif, dan mengirim draf WA. Guru tidak bisa mengubah atau merusak target kelulusan anak.
   - **Hak Akses Pemilik (Anda):** Akses penuh dari rumah untuk mengontrol kurikulum, memantau riwayat performa guru, melihat alarm kendala belajar anak, dan menyembunyikan Anthropic API Key di dalam sistem agar aman dari kebocoran.

---

## 🌀 II. LOGIKA KURIKULUM SPIRAL & STRATEGI DIFERENSIASI OTOMATIS

5. **Prinsip "Start Berbeda, Finish Berbeda" (Target Lulus Adaptif):** Setiap profil anak mengunci kolom **Level Mulai** (*Baseline*) dan **Level Target Kelulusan** (*Finish*) yang berbeda sejak pendaftaran, disesuaikan dengan hasil tes penempatan awal mereka (*self-paced learning*).
6. **Kurikulum Spiral Otomatis Terpadu (Level 1–10):** Tingkat kesulitan anak dikunci oleh angka level untuk memastikan tangga kompetensi anak naik secara disiplin dari waktu ke waktu:
   - *Level 1–3 (Fokus TK):* Pengenalan huruf tunggal, menebalkan garis motorik, hitung konkret 1–10, kosakata Inggris tunggal (*single word*).
   - *Level 4–6 (Fokus SD 1):* Membaca suku kata lancar, matematika penjumlahan belasan tanpa menyimpan, frasa Inggris pendek (2–3 kata).
   - *Level 7–10 (Fokus SD 2-3):* Membaca pemahaman cerita, matematika menyimpan/perkalian dasar, kalimat bahasa Inggris utuh berbentuk percakapan transaksional.
7. **Paket Tematik Integratif & Prompt Bank (Hemat Token):** Menggabungkan aspek **Membaca, Menulis, Berhitung, Bahasa Inggris, dan Pendidikan Karakter** dalam satu kesatuan materi utuh. Agar hemat token API, sistem menggunakan rumus soal dasar dari database, sehingga Claude API hanya bertugas menyuntikkan hobi anak dan pesan moral harian secara instan.
8. **Sinkronisasi "Satu Tema Global" & "Multi-Interest Abadi":** Lembaga menentukan satu tema besar mingguan (misal: Tema *"Pasar"* atau *"Kebersihan"*). AI di latar belakang akan otomatis membungkus tema tersebut menggunakan **Minat/Hobi Abadi** si anak yang tersimpan di database sejak awal mendaftar. Guru juga dibebaskan menambah tema baru secara langsung dari HP kapan saja.

---

## 🛠️ III. SOLUSI OPERASIONAL KELAS NYATA & KERJA TANPA KERTAS (PAPERLESS)

9. **Logika Relasi Baris Individual (Anti-Crash Data):** Saat guru membuka sesi kelas dan mengabsen 5 anak yang hadir di HP, AppSheet di balik layar otomatis memecah data menjadi **5 baris berbeda di Google Sheets yang mengunci ID Sesi yang sama**. Hal ini memastikan data nilai, catatan anekdot, dan materi milik masing-masing anak tidak saling tabrakan di database.
10. **Navigasi Satu Halaman Kerja (Single Session Workspace):** Guru melakukan semua aktivitas mengajar di kelas murni lewat satu halaman vertikal di HP secara ringkas: mengisi status absen, melihat panduan materi, hingga mengirim draf laporan WA orang tua.
11. **Pilihan Digital Tanpa Kertas (Paperless Optional):** Mencetak kertas soal hanyalah pilihan opsional. Claude API menampilkan "Kartu Panduan Soal" yang sangat bersih dan ringkas di layar HP guru. Guru tinggal mengajar lintas level murni dengan mendiktekan/membaca instruksi dari HP, sementara anak-anak tetap aktif menulis jawaban mereka di buku tulis fisik masing-masing.

---

## 📊 IV. MANAJEMEN EVALUASI, REMEDIAL, & MITIGASI MASA DEPAN (FUTURE-PROOFING)

12. **Sistem Penilaian 3 Dimensi Praktis:** Mengakomodir penilaian **Diagnostik** di awal masuk, penilaian **Formatif harian** lewat tombol pilihan di HP (`SB` / `BSH` / `MB`), dan peringatan otomatis ujian **Sumatif** berkala ketika level anak sudah menyamai target kelulusannya.
13. **Manajemen Pengisian Nilai Pasca-Kelas:** Untuk kenyamanan guru, pengisian evaluasi formatif harian dan catatan anekdot (opsional) dilakukan **5 menit sebelum kelas selesai atau saat anak-anak bersiap pulang**, sehingga guru bisa fokus 100% mendampingi anak saat jam belajar.
14. **Mekanisme Otomatis Remedial vs Akselerasi:**
    - *Jika Guru Memilih Lulus Level (`SB`/`BSH`):* Database otomatis mendongkrak level kompetensi anak sebesar **+1 tingkat** untuk memberikan tantangan yang lebih tinggi minggu depan.
    - *Jika Guru Memilih Ulang Level (`MB`):* Database mengunci level anak (tidak naik) untuk minggu depan, namun memerintahkan Claude API membuat variasi cerita dan soal baru di level yang sama agar anak tidak merasa bosan atau dicap gagal (Remedial Adaptif).
15. **Algoritma Radar Stagnan Belajar (Learning Plateau Alert):** Jika seorang anak mendapatkan status "Ulang Level" sebanyak **3 kali berturut-turut** pada level yang sama, sistem otomatis memunculkan tanda peringatan khusus **"⚠️ BUTUH INTERVENSI"** yang hanya bisa dilihat di dashboard Pemilik (Anda) sebagai alarm peringatan dini sebelum orang tua murid komplain.
16. **Logika Kontrol Kehadiran Khusus:** Jika status kehadiran anak diisi **Sakit / Izin**, sistem otomatis melewati pembuatan soal (menghemat kuota API) dan langsung memicu teks WhatsApp empati otomatis: *"Semoga lekas sembuh, guru dan teman-teman merindukanmu!"*
17. **Psikologi Bahasa Rapor WhatsApp Claude API yang Hangat:** Claude API dikunci untuk menulis draf laporan WA dengan gaya bahasa yang sangat hangat, ramah, menyapa nama panggilan ortu (misal: *"Bunda Ani"*), menggunakan teknik *Sandwich* (pujian – evaluasi suportif – penutup ceria), menampilkan visualisasi progress berbentuk bar emoji (contoh: `[████░░░░] 50%`), dan memberikan 1 tips aktivitas bermain gratis bersama orang tua di rumah yang relevan dengan materi hari itu.

---

## 🗂️ V. SPESIFIKASI STRUKTUR TABEL DATABASE (GOOGLE SHEETS)

### 📋 Tabel 1: `Data_Siswa`
*Tempat Pemilik mengontrol pendaftaran siswa baru, mengunci profil hobi, menentukan target lulus (Finish), dan memantau radar intervensi belajar.*

| Nama Kolom (Headers) | Tipe Data / Fungsi |
| :--- | :--- |
| `ID_Siswa` | Teks / Kunci Unik Siswa (Contoh: SISWA-001) |
| `Nama_Siswa` | Teks / Nama Lengkap Anak |
| `Panggilan_Orang_Tua` | Teks / Sapaan Ortu (Misal: Bunda Ani, Papa Budi) |
| `No_WhatsApp` | Teks / Nomor WA Ortu untuk pengiriman rapor |
| `Minat_Utama` | Teks / Hobi Abadi Anak (Misal: Dinosaurus T-Rex, Frozen) |
| `Level_Membaca_Sekarang` | Angka / Posisi Spiral Membaca Saat Ini (1-10) |
| `Level_Membaca_Target` | Angka / Target Kelulusan Membaca (Finish) |
| `Level_Berhitung_Sekarang`| Angka / Posisi Spiral Berhitung Saat Ini (1-10) |
| `Level_Berhitung_Target` | Angka / Target Kelulusan Berhitung (Finish) |
| `Hasil_Diagnostik_Awal` | Teks / Catatan kemampuan awal saat masuk |
| `Catatan_Gaya_Belajar` | Teks / Karakter anak (Hiperaktif, Visual, Pemalu, dll) |
| `Nilai_Sumatif_Akhir` | Angka / Nilai ujian akhir kelulusan (1-100) |
| `Status_Siswa` | Dropdown / Pilihan: Aktif, Lulus, Non-Aktif |
| `Alarm_Stagnan` | Teks / Otomatis terisi "⚠️ BUTUH INTERVENSI" jika anak ulang level 3x berturut-turut |

### 📋 Tabel 2: `Sesi_Kelas_Harian`
*Tempat aplikasi AppSheet mencatat riwayat kelas harian per anak. Di sinilah output instruksi mengajar lisan dari Claude API dan draf WhatsApp rapor muncul.*

| Nama Kolom (Headers) | Tipe Data / Fungsi |
| :--- | :--- |
| `ID_Sesi_Anak` | Teks / Kunci Unik Gabungan ID Sesi + ID Siswa (Contoh: SESI10-SISWA001) |
| `Tanggal` | Tanggal / Waktu pelaksanaan kelas |
| `Email_Guru` | Teks / Email Gmail guru pengajar untuk validasi keamanan login |
| `ID_Siswa` | Teks / Menghubungkan otomatis ke data siswa di Tabel 1 |
| `Nama_Siswa` | Teks / Nama anak yang hadir hari itu |
| `Tema_Global` | Teks / Tema mingguan (Pilihan dropdown atau ketik bebas dari HP) |
| `Status_Kehadiran` | Dropdown / Pilihan per anak: Hadir, Sakit, Izin, Alfa |
| `Instrumen_Formatif` | Dropdown / Pilihan per anak di akhir kelas: SB, BSH, MB |
| `Status_Tindakan` | Dropdown / Pilihan per anak: Lulus Level, Ulang Level |
| `Catatan_Anekdot` | Teks / Kejadian unik anak di kelas hari itu (Opsional) |
| `Output_Materi_HP_Guru` | Teks Panjang / Hasil Claude API: Panduan mengajar lisan *paperless* di HP |
| `Output_Rapor_WA` | Teks Panjang / Hasil Claude API: Draf teks laporan WhatsApp super hangat |
