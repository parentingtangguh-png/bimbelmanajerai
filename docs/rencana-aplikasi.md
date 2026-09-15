# Rencana Perubahan Aplikasi — Kurikulum 8 Level

**Status: DISETUJUI PEMILIK — 15 Sep 2026.** Sumber isi: dokumen terkunci di [`docs/curriculum/`](curriculum/) dan [`CURRICULUM_ARCHITECTURE.md`](../CURRICULUM_ARCHITECTURE.md). Setiap fase dites, dilaporkan, dan baru di-deploy setelah pemilik menyetujui.

## Keputusan pemilik

1. Isi 112 indikator, CP, level, dan tema **disimpan di database**, dibangkitkan otomatis dari dokumen kurikulum (satu sumber kebenaran).
2. Tes diagnostik yang belum final **disimpan di server**, sehingga dapat dilanjutkan dari perangkat lain.
3. Ruang kelas tetap **satu indikator akademik per anak per sesi** (dapat ditinjau setelah uji coba).
4. **"Belum dinilai"** menjadi pilihan ketiga di Ruang kelas; sesi tetap dapat ditandai selesai.
5. **English dan Karakter di kelas opsional per sesi** dan tidak menghalangi sesi selesai.
6. **Ruang kelas dikunci sementara** di antara Fase 2 dan Fase 3 (aplikasi belum diluncurkan).
7. Urutan fase seperti di bawah.

## Fase

1. **Isi kurikulum baru dan halaman Kurikulum.** Skrip pembangkit dari dokumen; tabel kurikulum 8 level dipasang berdampingan dengan tabel lama; halaman Kurikulum baru (CP → level → 14 indikator; tema, subtema, kosakata English); tes yang memastikan isi cocok dengan dokumen. Tidak mengubah tes diagnostik atau Ruang kelas.
2. **Pergantian dan tes diagnostik baru.** Hapus 10 siswa percobaan beserta tes dan kelasnya (query target ditunjukkan ke pemilik lebih dulu); level 1–8; aturan tes diagnostik baru dihitung di server; layar tes 14 tugas; profil siswa menampilkan hasil baru; Ruang kelas dikunci sementara.
3. **Ruang kelas baru.** Antrean 12 indikator yang memperhitungkan hasil diagnostik; "belum dinilai"; English dan Karakter terpisah dari antrean dengan aturan paparan tema English; subtema, benda nyata, dan kosakata English di lembar sesi; konfirmasi naik level dan "kurikulum selesai" di L8.
4. **Pembersihan.** Hapus tabel, kolom, fungsi, dan CSS kurikulum lama; perbarui CLAUDE.md, README.md, PANDUAN_SETUP.md.
5. **Tombol Prompt kegiatan.** Teks prompt disesuaikan dengan kurikulum baru dan diajukan sebagai draf kepada pemilik.

## Risiko

- Fase 2 dan 3 perubahan terbesar; jalur simpan di `main.js` tidak dijangkau tes otomatis, sehingga setiap fase dicoba di aplikasi yang sudah login dan diperiksa dengan query baca saja.
- Teks indikator panjang harus tetap terbaca di HP; tampilan dibuktikan sebelum deploy.
- Pembangkit bergantung pada format tabel dokumen; tes Fase 1 menangkap perubahan format.
- Durasi dan ambang belum diuji dengan anak; perubahan setelah uji coba cukup lewat amendemen dokumen lalu dibangkitkan ulang.
