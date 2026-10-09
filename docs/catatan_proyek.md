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

### 9 Oktober 2026 — Audit kartu tes diagnostik L3–L18

**Audit L3: 2 masalah pada E1 dan E2** — cara uji merujuk prosedur level sebelumnya yang tidak terlihat guru ("Dengan prosedur sama", "Prosedur seperti L2"). Diperbaiki dengan menyalin instruksi langsung ke dalam kartu. Migrasi: `20261009050000_fix_l3_cara_uji.sql`.

| Kartu | Sebelum | Sesudah |
|-------|---------|---------|
| E1 L3 cara uji | `Dengan prosedur sama, ucapkan 8; 6; 10; 7; 8; 9.` | `Minta menunjuk angka yang disebut. Ucapkan 8; 6; 10; 7; 8; 9, satu per satu.` |
| E2 L3 cara uji | `Prosedur seperti L2, dengan lima kumpulan. Benda boleh ditata ulang…` | `Tampilkan kumpulan satu per satu tanpa menyebut jumlah. Tanyakan, "Semuanya ada berapa?" Benda boleh ditata ulang…` |

**Audit L4: 1 masalah pada B1** — cara uji menyebut "ketentuan pelafalan" tanpa menjelaskan isi aturan /c/ dan /h/ di dalam kartu (Kriteria 2: tidak ambigu). Diperbaiki dengan mencantumkan aturan pelafalan langsung. Migrasi: `20261009060000_fix_l4_b1_cara_uji.sql`.

| Kartu | Sebelum | Sesudah |
|-------|---------|---------|
| B1 L4 cara uji | `Gunakan ketentuan pelafalan, termasuk toleransi /c/ dan /h/` | `/c/ bunyi awal "cuci" (bukan "ce"); /h/ embusan singkat "hhh" (bukan "ha")` |

**Audit L5: 1 masalah pada E2** — cara uji menyebut "Prosedur sama dengan L4" tanpa mencantumkan instruksinya di dalam kartu (Kriteria 2: tidak ambigu). Diperbaiki dengan menyalin instruksi langsung. Migrasi: `20261009070000_fix_l5_e2_cara_uji.sql`.

| Kartu | Sebelum | Sesudah |
|-------|---------|---------|
| E2 L5 cara uji | `Prosedur sama dengan L4; pembagian tetap bebas dan konkret.` | `Guru menyebut total yang sudah disiapkan. Minta, "Pisahkan…" Setelah selesai, tanyakan banyak benda…` |

**Audit L6–L8: 4 masalah pada D1/D2 L6–L7 dan F2 L6**

Tanda lulus D1 L6, D1 L7, dan D2 L7 menyebut "rubrik spasi" tanpa menjelaskan standarnya di dalam kartu (Kriteria 2: tidak ambigu). Definisi ada di seksi Rubrik Tulisan alur-d.md tetapi tidak terlihat guru saat memegang kartu.

Tambahan: cara uji E2 L7 menyebut "perintah baku (Penyiapan Khusus)" tanpa mencantumkan kalimat instruksinya (Kriteria 2).

| Kartu | Sebelum | Sesudah |
|-------|---------|---------|
| D1 L6 tanda lulus | `...memenuhi rubrik spasi tanpa pemisahan palsu di dalam kata` | `...memiliki celah jelas (≈ selebar huruf 'o' tulisan anak) tanpa celah di dalam kata` |
| D1 L7 tanda lulus | `...dua batas kata memenuhi rubrik spasi` | `...dua batas kata memiliki celah jelas (≈ selebar huruf 'o' tulisan anak)` |
| D2 L7 tanda lulus | `...dua batas kata memenuhi rubrik spasi` | `...dua batas kata memiliki celah jelas (≈ selebar huruf 'o' tulisan anak)` |
| E2 L7 cara uji | `Gunakan hanya perintah baku (Penyiapan Khusus).` | `Instruksi: "Isi bagian yang kosong supaya kedua sisi sama."` |
| F2 L6 cara uji | `Prosedur sama dengan L5; guru menulis bentuk pengurangan.` | `Guru menulis satu kalimat angka setiap butir, menunjuk seluruhnya, dan bertanya, "Berapa hasilnya?" Tidak ada peristiwa mengambil benda oleh guru. Sepuluh benda penopang selalu tersedia.` |

Migrasi tambahan: `20261009080000_fix_l6_f2_cara_uji.sql`.

Audit ulang L7 (9 Okt 2026): ditemukan 1 masalah tambahan pada E1 L7 bahan yang menyebut "Garis sesuai Penyiapan Khusus" tanpa keterangan inline. Diperbaiki dengan mencantumkan spesifikasi garis langsung. Migrasi: `20261009090000_fix_l7_e1_bahan.sql`.

| Kartu | Sebelum | Sesudah |
|-------|---------|---------|
| E1 L7 bahan | `Garis sesuai Penyiapan Khusus; target 7; 16; 3; 12.` | `Garis mendatar dengan 21 takik dan 20 ruas berjarak sama; hanya takik 0, 10, dan 20 diberi label. Periksa semua takik sebelum tes. Target 7; 16; 3; 12.` |

**Audit L8: LULUS** — D1 L8 dan D2 L8 sudah memakai "batas kata tepat" dan rubrik inline; tidak ada referensi eksternal.

**Audit L9–L18: SEMUA LULUS** — 200 kartu (20 level × 14 indikator minus English/Karakter per alur). Semua kriteria inline lengkap, bahan ditulis guru di papan, tidak ada referensi rubrik eksternal, ambang kelulusan numerik.

File yang diubah: `docs/curriculum/indikator/alur-d.md`, `alur-e.md`, migrasi `20261009040000_fix_l6_l7_cara_uji.sql`.

---

### 9 Oktober 2026 — Audit kartu tes diagnostik Level 2

**Audit 3 kartu L2** (C1, D1, F1) menggunakan 7 kriteria. Semua kartu lulus — tidak ada masalah pada cara uji, bahan, atau tanda lulus.

Ditemukan 2 masalah minor pada keterangan visual:

| Visual | Masalah | Perbaikan |
|--------|---------|-----------|
| C1 L2 | Catatan menyebut `★` yang tidak ada di visual; jawaban ditandai warna emas via CSS | Diubah: `★ = tulisan huruf (jawaban)` → `Emas = tulisan huruf (jawaban)` |
| F1 L2 | Catatan menyebut `★ (tebal)` yang tidak ada; jawaban ditandai emas saja | Diubah: `★ (tebal) = jawaban benar` → `Emas = jawaban benar` |

File yang diubah: `src/diagnostic-visuals.js`.
