# Arsitektur Kurikulum — Rumah Belajar Rainbow Kids Alfatih

**Status: TERKUNCI (14 Sep 2026).** Dokumen ini adalah sumber keputusan kurikulum indikator baru.
Keputusan di sini **tidak boleh diubah tanpa keputusan eksplisit baru dari pemilik**.

Belum dipasang di aplikasi. Kurikulum yang berjalan di aplikasi masih 4 level × 6 indikator akademik.

## Urutan kerja
1. Arsitektur (dokumen ini) — **terkunci**.
2. **Matriks Cakupan Bahan L1–L8** — **dikunci 14 Sep 2026, dengan amendemen 14 Sep 2026**: [`docs/curriculum/matriks-cakupan-bahan.md`](docs/curriculum/matriks-cakupan-bahan.md).
3. **12 jalur × 8 milestone** — **dikunci 14 Sep 2026**: [`docs/curriculum/milestone-12x8.md`](docs/curriculum/milestone-12x8.md).
4. 96 indikator operasional (Kompetensi · Cara uji · Bahan · Tanda lulus) — disusun Codex, diaudit Claude, per alur. — **selesai: seluruh Alur A–F dikunci (A–E 14 Sep, F 15 Sep 2026)** ([`alur-a.md`](docs/curriculum/indikator/alur-a.md), [`alur-b.md`](docs/curriculum/indikator/alur-b.md), [`alur-c.md`](docs/curriculum/indikator/alur-c.md), [`alur-d.md`](docs/curriculum/indikator/alur-d.md), [`alur-e.md`](docs/curriculum/indikator/alur-e.md), [`alur-f.md`](docs/curriculum/indikator/alur-f.md)). Belum: English & Karakter, teks level/CP/tema, aturan diagnostik, lalu rencana perubahan aplikasi.
5. Baru kemudian perubahan aplikasi (database, antrean kelas, diagnostik) — direncanakan bersama pemilik.

Peran: Codex (penerus ChatGPT sebagai authority pedagogis) menyusun isi pedagogis; Claude mengaudit konsistensi terhadap arsitektur, batas antarslot, dan kebutuhan aplikasi. Setiap perubahan isi: draf teks dulu, disetujui pemilik kata demi kata.

Arsitektur, matriks, dan milestone yang sudah dikunci **hanya boleh diubah melalui keputusan eksplisit pemilik** (amendemen tercatat di dokumen yang bersangkutan). Diterimanya milestone belum berarti prosedur tes tervalidasi; kelayakan durasi ±1 menit dan ambang kelulusan dinilai pada redaksi indikator.

## 1. Level dan batas cakupan
8 level. Kesetaraan **internal bimbel**, bukan pembagian resmi CP.

| Level | Wilayah kemampuan |
|---|---|
| L1–L2 | TK A |
| L3–L4 | TK B |
| L5–L6 | Kelas I awal |
| L7–L8 | Kelas I akhir |

Tidak melampaui kelas I. Fase A resmi mencakup kelas I–II, jadi **Level 8 tidak dianggap menyelesaikan Fase A** dan seluruh CP Fase A tidak dijadikan syarat Level 8.

Nama/kata kerja level (mis. mengenali → … → mandiri) hanya untuk judul atau deskripsi level, bukan aturan redaksi indikator.

## 2. Enam alur
A. Menyimak & berbicara · B. Huruf & bunyi · C. Membaca · D. Menulis · E. Bilangan · F. Pola, bentuk, ukuran & operasi hitung.

## 3. Dua belas slot dan fungsinya
Setiap level memiliki 12 indikator akademik dengan urutan dan fungsi tetap:

| No. | Slot | Fungsi tetap |
|--:|---|---|
| 1 | A1 | Memahami bahasa lisan |
| 2 | B1 | Mengenali/membedakan bunyi dan grafem |
| 3 | E1 | Urutan, lambang, posisi, dan relasi simbol bilangan |
| 4 | D1 | Reproduksi tulisan dengan model visual |
| 5 | C1 | Pramembaca → dekoding → membaca |
| 6 | F1 | Matematika non-operasi (subdomain per level, lihat §7) |
| 7 | A2 | Menghasilkan bahasa lisan |
| 8 | B2 | Menghasilkan/menggabungkan/memisahkan/memanipulasi bunyi |
| 9 | E2 | Kuantitas, komposisi/dekomposisi, dan struktur bilangan |
| 10 | D2 | Produksi tulisan tanpa model visual |
| 11 | C2 | Kesadaran makna tulisan → pemahaman bacaan |
| 12 | F2 | Operasi hitung |

## 4. Aturan progresi vertikal
- Progresi hanya diuji **di dalam slot yang sama dari L1 ke L8**. Tidak ada kewajiban indikator kedua suatu alur lebih sulit daripada indikator pertama (aturan itu dihapus).
- Milestone berikutnya tidak boleh lebih mudah, tidak boleh mengulang kemampuan yang sama, dan tidak boleh berpindah subkemampuan diam-diam.
- Milestone berikutnya harus **meningkatkan tuntutan secara nyata** melalui kompleksitas struktur, perluasan cakupan yang bermakna, atau keduanya. Perubahan angka/kata yang hanya kosmetik bukan kenaikan.
  - Sah: 1–5 → 1–10 (bila benar-benar memperluas penguasaan); 1–10 → 11–20 (puluhan dan satuan); KV → KV-KV.
  - Tidak cukup: 1–8 → 1–10; mengganti contoh kata KV dengan kata KV lain.
- Tingkat bahan (mis. pola KV-KV, rentang 11–20) adalah bagian kompetensi; contoh kata/benda bukan.
- Perpindahan subdomain atau tahap hanya sah bila ditetapkan di arsitektur ini (F1 §7, transisi §6).

## 5. Batas antarslot
**B–C**
- B = kemampuan subleksikal: bunyi/fonem dan grafem (termasuk grafem seperti `ng`, `ny`).
- B1 = mengenali atau membedakan bunyi/grafem.
- B2 = menghasilkan, menggabungkan, memisahkan, atau memanipulasi bunyi; utamanya lisan.
- B tidak menguji pembacaan kata atau teks.
- **B2 adalah asesmen lisan murni**: tulisan tidak menjadi dasar respons anak.
- Variasi huruf kapital/kecil adalah **bahan**, bukan milestone tersendiri.
- C = anak berhadapan dengan unit tulisan utuh: suku kata, kata, frasa, kalimat, atau teks.

**C1–C2**
- L1–L2: C1 = ciri, arah, dan bentuk visual tulisan; C2 = tulisan sebagai pembawa identitas atau makna. Kompetensi yang sama tidak boleh muncul di keduanya.
- L1–L3: C2 adalah fase kesadaran makna tulisan dan transisi menuju pemahaman bacaan, belum tunduk pada batas dekoding C1.
- **Mulai L4, kompleksitas bahan C2 tidak boleh melampaui kemampuan dekoding C1 pada level yang sama.** C2 naik melalui tuntutan memahami, bukan bacaan yang lebih panjang/sulit.

**D1–D2**
- D1 = reproduksi dengan model visual yang tersedia: pramenulis, meniru, menyalin.
- D2 = produksi tanpa model visual: dari ingatan, bunyi/dikte, kemudian gagasan sendiri.
- **Dikte selalu D2**, tidak pernah D1.

**Dependensi bahan B–C–D**
- C1 menggunakan bahan huruf/bunyi B yang telah diperkenalkan paling lambat pada level sebelumnya.
- D2 boleh menggunakan inventaris B1 sampai level yang sama sebagai bahan encoding bunyi-ke-tulisan.

**E1–E2–F2**
- E1 = urutan, lambang, posisi, relasi simbol bilangan.
- E2 = kuantitas, komposisi/dekomposisi, struktur bilangan. **Nilai tempat masuk E2.**
- Operasi penjumlahan/pengurangan masuk **F2**, bukan E2.
- **E2 = struktur bilangan dengan total tetap. F2 = operasi/peristiwa yang mengubah jumlah.** Komposisi/dekomposisi di E2 bukan operasi hitung meskipun dapat ditulis dengan tanda `+`.

**Perpindahan subkemampuan yang disengaja**
- **F2** berkembang dengan urutan terencana: tambah sederhana → kurang sederhana → gabung → ambil beberapa → penjumlahan dalam 10 → pengurangan dalam 10 → penjumlahan melewati 10 → pengurangan melewati 10.
- **E1 L7→L8**: dari garis bilangan ke hitung loncat adalah perpindahan subkemampuan yang disengaja di dalam fungsi E1 dan harus tetap disebut eksplisit di matriks dan milestone.
- **B1 L7→L8** (amendemen 14 Sep 2026, disetujui pemilik): B1 L7→L8 merupakan perpindahan subkemampuan yang disengaja. L8 berfungsi sebagai penguatan pemetaan bunyi ke grafem mirip, bukan kelanjutan tingkat kompleksitas diftong L7; transisi ini dikecualikan dari tuntutan kenaikan kesulitan yang ketat.
- **Urutan B2 L3–L7** (amendemen 14 Sep 2026, disetujui pemilik): gabung suku kata → pisah suku kata → hapus suku kata → gabung fonem KV → pisah fonem KV. Ini keputusan rancangan pedagogis, bukan norma kesulitan yang sudah terbukti; kelulusan B2 bukan prasyarat membaca C1.

## 6. Titik transisi tahap
| Slot | L1–L2 | L3 | L4 | L5–L8 |
|---|---|---|---|---|
| C1 | Pramembaca | Mulai dekoding | Membaca | Membaca meningkat |
| C2 | Kesadaran bahwa tulisan mewakili identitas/makna | Transisi: menghubungkan kata tertulis sangat sederhana/akrab dengan maknanya (bukan pemahaman teks) | Mulai pemahaman hasil bacaan yang dibaca sendiri | Dari informasi literal menuju pemaknaan lebih kompleks |
| D1 | Pramenulis dengan model visual | Mulai reproduksi tulisan konvensional | Unit sederhana menuju tulisan lebih panjang/kompleks dengan model | (lanjutan L4) |
| D2 | Produksi tanda/bentuk familiar tanpa model | Mulai encoding bunyi-ke-tulisan sistematis | Huruf/suku kata → kata → frasa/kalimat → tulisan berdasarkan gagasan | (lanjutan L4) |

## 7. F1 per level
F1 **bukan satu kemampuan tunggal** L1–L8, melainkan jalur matematika non-operasi dengan perpindahan subdomain yang direncanakan. Satu subdomain per level; tidak ada dua subdomain dalam satu indikator.

| Level | Fokus F1 |
|---|---|
| L1 | Mengelompokkan berdasarkan satu atribut |
| L2 | Mengenali bentuk datar dasar |
| L3 | Melanjutkan pola AB |
| L4 | Melanjutkan pola berulang tiga unsur |
| L5 | Membandingkan panjang secara langsung |
| L6 | Mengurutkan benda berdasarkan panjang |
| L7 | Mengukur panjang dengan satuan tidak baku |
| L8 | Mengestimasi panjang dengan satuan tidak baku |

F1 L8: tanda lulus **wajib memiliki toleransi numerik eksplisit** (bukan "cukup dekat"). Besarnya ditetapkan di tahap indikator sesuai benda, panjang target, dan satuan.

## 8. Format indikator
Setiap indikator memiliki tepat empat komponen:
- **Kompetensi** — kemampuan yang diuji.
- **Cara uji** — prosedur ±1 menit.
- **Bahan** — tulisan yang dibuat guru saat itu dan/atau benda nyata.
- **Tanda lulus** — keputusan objektif/numerik (mis. "4 dari 5").

Contoh: Kompetensi: membaca kata dua suku kata terbuka · Cara uji: guru menulis lima kata baru satu per satu · Bahan: kertas/papan dan alat tulis · Lulus: 4 dari 5 dibaca tepat.

## 9. Aturan bahan dan asesmen umum
- Tanpa bahan cetak; tulisan dibuat guru saat itu; benda nyata diperbolehkan.
- Satu indikator = satu kemampuan inti.
- Perilaku tidak masuk 12 indikator akademik (masuk Karakter).
- Tes indikator dirancang sekitar satu menit.
- Satu keputusan **Lulus** mengakhiri indikator; setelah Lulus pindah ke indikator berikutnya.

## 10. English dan Karakter
- 1 indikator English dan 1 indikator Karakter per level.
- **Tidak menentukan** kenaikan indikator atau level.
- Matriks + milestone dikunci 15 Sep 2026: [`docs/curriculum/english-karakter.md`](docs/curriculum/english-karakter.md) (keputusan pemilik 15 Sep 2026). **16 indikator dikunci 15 Sep 2026:** [`docs/curriculum/indikator/english-karakter.md`](docs/curriculum/indikator/english-karakter.md).
- English dan Karakter masing-masing memiliki 1 indikator per level dan dicatat sebagai hasil pendamping. Keduanya dinilai Lulus/Belum pada tahap indikator operasional dan dicatat pada tes diagnostik, tetapi tidak menentukan perpindahan indikator akademik, kenaikan level, atau penentuan level awal diagnostik.
- English memakai daftar kata/ungkapan tetap per level yang dikenalkan dalam pembelajaran kelas, lisan dan tulisan bergantian sejak L1–L2. Karena English tulisan memakai pengenalan kata/frasa/kalimat utuh tanpa phonics bahasa Inggris, asesmen English dikecualikan dari aturan umum bahwa cara uji tidak bergantung pada pengajaran bimbel sebelumnya. Pada diagnostik anak baru, hasil Belum pada English wajar dan tidak ditafsirkan sebagai kelemahan akademik.
- Karakter memuat adab Islami dan karakter umum, dan merupakan jalur nilai per level yang terencana, bukan progresi akademik ketat (dikecualikan dari tuntutan kenaikan kesulitan). Urutan nilai: L1 salam Islami (hanya salam Islami yang diterima); L2 doa sebelum belajar; L3 berterima kasih; L4 meminta maaf; L5 menunggu giliran; L6 merapikan alat; L7 jujur; L8 mandiri. Karakter menilai perilaku teramati dalam konteks bimbel, bukan keimanan, sifat umum, atau praktik keluarga. Karakter L6 dan L8 bergantung pada rutinitas kelas; pada diagnostik anak baru, hasil Belum wajar dan tidak memengaruhi level awal.

## 11. Matriks Cakupan Bahan (dikunci — lihat `docs/curriculum/matriks-cakupan-bahan.md`)
Minimal mencakup, per level L1–L8:
- **Literasi:** grafem (vokal, konsonan, `ng`/`ny`), bunyi, struktur suku kata (V, KV, KV-KV, KVK, …), struktur kata, panjang kalimat, panjang teks.
- **Numerasi:** rentang bilangan, representasi konkret/simbolik, komposisi dan nilai tempat, operasi, pola, bentuk, ukuran.

## 12. Belum dikunci
- **Tes diagnostik**: konsep 12 tugas per level dipertahankan sementara; algoritme penentuan level awal (mis. pencarian floor/ceiling) dibahas setelah 96 indikator stabil. Aturan yang berjalan di aplikasi (satu tes satu level) tidak berubah sampai ada keputusan dan migrasi baru.
- Redaksi final indikator, jumlah soal (3/4 atau 4/5), contoh kata/benda, judul level, kosakata English.

## Rujukan resmi
- Keputusan Kepala BKPDM No. 020 Tahun 2026 hanya mengubah CP Pendidikan Agama dan Budi Pekerti.
- Bidang lain tetap mengacu Keputusan Kepala BSKAP No. 046/H/KR/2025.
- Fase A mencakup kelas I–II.

Rujukan resmi: diverifikasi oleh pemilik/authority pedagogis, belum diverifikasi independen oleh Claude.

- Buku resmi kelas I: Matematika memuat membilang, nilai tempat, serta penjumlahan dan pengurangan sampai 20 (dasar plafon bilangan L8 = 20); Bahasa Indonesia sudah memakai `ng`/`ny` dalam bacaan.

Diverifikasi oleh pemilik/authority pedagogis; belum diverifikasi independen oleh Claude.
