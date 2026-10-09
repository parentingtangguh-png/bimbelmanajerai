# Catatan Proyek — Rumah Belajar Rainbow Kids Alfatih

Dokumen ini mencatat keputusan, kriteria, dan pekerjaan yang sudah selesai agar audit dan perubahan berikutnya konsisten.

---

## Kriteria audit kartu tes diagnostik

Diputuskan pada sesi audit Level 1 (9 Oktober 2026). Berlaku untuk semua level.

Setiap kartu tes (cara uji + bahan + tanda lulus) diperiksa terhadap 7 kriteria berikut dari sudut pandang guru yang memegang kartu saat berhadapan langsung dengan anak:

| # | Kriteria | Yang diperhatikan |
|---|----------|-------------------|
| 1 | **Sederhana** | Prosedur tidak lebih dari 2–3 langkah; guru bisa membacanya sekali lalu langsung melakukan |
| 2 | **Tidak ambigu** | Hanya ada satu cara menafsirkan instruksi; tidak ada kata seperti "sesuai ketentuan", "seperti biasa", atau "lihat rubrik" tanpa penjelasan inline |
| 3 | **Bahan mudah didapat** | Bahan ada di rumah atau mudah dibuat dari kertas/benda sehari-hari; tidak butuh alat khusus |
| 4 | **Mudah dibuat/digambar/ditulis** | Guru bisa menyiapkan bahan dalam < 5 menit tanpa bantuan orang lain |
| 5 | **Aman untuk anak** | Tidak ada risiko tersedak, tertusuk, atau cedera; bahan tidak beracun |
| 6 | **Tanda lulus bisa dinilai dengan pasti** | Guru tahu langsung apakah anak lulus tanpa perlu menimbang atau menafsirkan; kriteria kelulusan numerik atau deskriptif yang cukup spesifik |
| 7 | **Mudah diilustrasikan dengan SVG** | Kalau perlu gambar, bisa dibuat dengan bentuk sederhana (kotak, garis, lingkaran) tanpa foto |

### Cara memakai kriteria ini

1. Baca kartu sebagai guru — bayangkan sedang duduk di depan anak.
2. Untuk setiap kriteria, tandai: ✓ (lulus) atau ✗ (ada masalah).
3. Kriteria yang ✗ → catat masalah spesifiknya dan usulkan perbaikan.
4. Perubahan cara uji/bahan/tanda lulus selalu lewat: edit dokumen sumber (`docs/curriculum/indikator/alur-*.md`) → `node scripts/build-curriculum.mjs` → migrasi SQL baru → pemilik jalankan di SQL Editor.

---

## Pekerjaan yang sudah selesai

### 9 Oktober 2026 — Audit dan perbaikan kartu tes diagnostik Level 1

**Audit 14 kartu L1** menggunakan 7 kriteria di atas. Ditemukan 4 masalah:

| Kartu | Masalah | Perbaikan |
|-------|---------|-----------|
| D1 L1 | Tanda lulus menyebut "rubrik pramenulis" tanpa menjelaskannya | Kriteria inline: Tegak arah atas–bawah, Mendatar kiri–kanan, Miring diagonal jelas, Lengkung satu busur — sedikit goyangan diterima |
| D2 L1 | Tanda lulus menyebut "rubrik pramenulis" tanpa menjelaskannya | Kriteria inline: Tegak, Mendatar, Miring diagonal (boleh dua arah), Lingkaran boleh oval |
| E2 L1 | Cara uji menyebut "penelusuran sesuai ketentuan bersama" tanpa menjelaskannya | Diganti: "Anak wajib menunjuk, menyentuh, atau memindahkan setiap benda satu per satu sambil menghitung" |
| C2 L1 | Aturan memilih pengecoh (3 syarat) sulit diterapkan di lapangan | Ditambah panduan cepat: hitung huruf nama anak (n), pilih 5 pengecoh panjang n±1, dua berawal huruf sama; contoh Rani diperjelaskan |

**Visual baru yang ditambahkan** (sebelumnya belum ada):
- `F1 L1` — dua set potongan kertas: Set 1 (2 merah + 2 biru, sama bentuk & ukuran) dan Set 2 (2 besar + 2 kecil, sama bentuk & warna)
- `D2 L1` — 4 bentuk yang diterima sebagai tanda lulus: tegak, mendatar, miring diagonal, lingkaran/oval

File yang diubah: `src/diagnostic-visuals.js`, `docs/curriculum/indikator/alur-d.md`, `alur-e.md`, `alur-c.md`, migrasi `20261009030000_fix_l1_cara_uji.sql`.

---

### 9 Oktober 2026 — Hapus pilihan paket utama/cadangan dari tes diagnostik

Pilihan "Paket utama" dan "Paket cadangan" dihapus dari tampilan kartu tes. Guru tidak perlu memilih paket — semua nilai tersimpan sebagai `utama`. Kolom `package` di database tetap ada (tidak ada migrasi), nilai lama tidak terpengaruh.

File yang diubah: `src/views/diagnostic.js`, `src/main.js`, `src/views/students.js`, `src/views/guide.js`, `tests/render.test.mjs`.

---

### 9 Oktober 2026 — Audit kartu tes diagnostik Level 2

**Audit 3 kartu L2** (C1, D1, F1) menggunakan 7 kriteria. Semua kartu lulus — tidak ada masalah pada cara uji, bahan, atau tanda lulus.

Ditemukan 2 masalah minor pada keterangan visual:

| Visual | Masalah | Perbaikan |
|--------|---------|-----------|
| C1 L2 | Catatan menyebut `★` yang tidak ada di visual; jawaban ditandai warna emas via CSS | Diubah: `★ = tulisan huruf (jawaban)` → `Emas = tulisan huruf (jawaban)` |
| F1 L2 | Catatan menyebut `★ (tebal)` yang tidak ada; jawaban ditandai emas saja | Diubah: `★ (tebal) = jawaban benar` → `Emas = jawaban benar` |

File yang diubah: `src/diagnostic-visuals.js`.
