# Aturan Tes Diagnostik — Kurikulum 8 Level

**Status: DIKUNCI — 15 Sep 2026** · **Authority:** [`CURRICULUM_ARCHITECTURE.md`](../../CURRICULUM_ARCHITECTURE.md) §12 · indikator di [`docs/curriculum/indikator/`](indikator/)

Disusun Codex (authority pedagogis), diaudit Claude, disetujui pemilik. Aturan ini **menggantikan** aturan diagnostik yang sekarang berjalan di aplikasi (satu tes level 1–4, 8 tugas, hasil tidak dihitung ke kelas). Aplikasi belum diubah; perubahan menunggu tahap rencana aplikasi. Perubahan isi memerlukan keputusan eksplisit pemilik.

## Lima Aturan

1. **Guru memilih satu level untuk dites.** Aplikasi menampilkan saran dari kelas formal: belum sekolah/TK A → L1; TK B → L3; kelas 1 → L5; kelas 2 ke atas → L7. Guru boleh memilih level lain.
2. **Tes berisi 14 tugas:** 12 akademik sesuai urutan slot level itu, English setelah enam akademik pertama, dan Karakter diamati sesuai level. Tes boleh dilanjutkan pada pertemuan berikutnya sampai guru menekan **Simpan final**. Tugas yang sudah dinilai tidak diulang; **tugas yang belum dinilai boleh dicoba lagi pada pertemuan lanjutan sebelum Simpan final.** Anak belum mengikuti kelas sebelum tes disimpan final.
3. **Tes berhenti bila A1, B1, E1, dan D1 keempatnya sudah dinilai dan semuanya Belum.** Tes itu tidak dihitung. Aplikasi menyarankan level awal pita sebelumnya: L7/L8 → L5; L5/L6 → L3; L3/L4 → L1; L2 → L1. Guru memulai tes baru pada level itu. Ini satu-satunya cara mengganti level setelah tes dimulai. Pada L1 aturan berhenti tidak berlaku.
4. **Saat Simpan final,** indikator akademik yang Lulus langsung tercatat lulus di kelas. Tugas yang belum dinilai dianggap belum lulus untuk antrean, tanpa alasan terpisah. Tugas yang tidak sah cukup dibiarkan belum dinilai, bukan diberi Belum.
5. **Tidak ada revisi setelah final.** Jika salah input, penanganannya seperti aturan aplikasi sekarang: hapus siswa lalu tambah ulang, hanya bila anak belum mengikuti kelas.

## Urutan 14 Tugas

1. A1 · 2. B1 · 3. E1 · 4. D1 · 5. C1 · 6. F1 · 7. English · 8. A2 · 9. B2 · 10. E2 · 11. D2 · 12. C2 · 13. F2 · 14. Karakter dicatat dari pengamatan level terkait.

Karakter boleh terjadi sebelum nomor 14 bila konteksnya memang di awal atau sepanjang tes:

- L1 salam Islami: awal atau akhir.
- L2 doa sebelum belajar: awal.
- L3 terima kasih: saat guru memberi bantuan/benda.
- L4 maaf: main peran singkat, boleh setelah English atau akhir.
- L5 menunggu giliran: simulasi dengan guru, boleh setelah English.
- L6 merapikan alat: setelah tugas memakai alat.
- L7 jujur: tugas singkat dengan pertanyaan belum/sudah.
- L8 mandiri: rutinitas kelas yang sudah dikenal. Pada anak baru, boleh tidak dinilai.

## Kapan Tugas Dinilai

Tugas dinilai Lulus atau Belum hanya bila prosedur indikator berjalan sah dan guru punya bukti sesuai tanda lulus.

Tugas dibiarkan **belum dinilai** bila anak belum bersedia, tugas terputus, bahan tidak layak, stimulus tidak tersampaikan utuh, konteks Karakter tidak muncul, atau prosedur indikator tidak sah. Pada final, belum dinilai tidak dihitung lulus dan tidak perlu alasan.

## Hasil

- **Akademik:** anak mulai kelas dari indikator akademik pertama yang belum lulus pada level final. Indikator sesudahnya yang sudah Lulus tetap tercatat dan dilewati kelak. Jika 12 akademik Lulus pada L1–L7, anak mulai level berikutnya indikator 1. Jika 12 akademik L8 Lulus, kurikulum 8 level selesai; tidak ada level 9.
- **English dan Karakter:** dicatat pada diagnostik. Jika Lulus, statusnya juga tercatat lulus di kelas sebagai status pendamping. Keduanya tidak memengaruhi level awal, antrean akademik, atau kenaikan level.

## Kebutuhan Tampilan dan Penyimpanan (untuk rencana aplikasi)

Tampilan untuk guru:

- Nama anak, kelas formal, saran level, dan level pilihan guru.
- Daftar 14 tugas dengan urutan di atas.
- Isi indikator: kompetensi, cara uji, bahan, tanda lulus, dan bahan cadangan.
- Status per tugas: Lulus / Belum / belum dinilai.
- Pilihan paket: utama atau cadangan.
- Tombol Simpan final dengan ringkasan dampak ke kelas.
- English/Karakter ditampilkan jelas terpisah dari antrean akademik.

Disimpan sebagai kebutuhan data:

- Level yang dites.
- Status tiap tugas: Lulus, Belum, atau belum dinilai.
- Paket yang dipakai: utama/cadangan.
- Indikator akademik yang Lulus.
- Indikator mulai kelas.
- Status English dan Karakter sebagai pendamping.
- Penanda final.

Tidak perlu menyimpan alasan belum dinilai.

## Batas Tafsir

Tes diagnostik adalah sampel pada satu level, bukan gambaran lengkap kemampuan anak. Lulus pada diagnostik berarti indikator itu tidak diuji ulang di kelas. Belum berarti bukti belum memenuhi tanda lulus. Belum dinilai berarti belum ada bukti sah, tetapi tetap belum dihitung lulus.

English anak baru bisa Belum karena daftar English memang dikenalkan di bimbel. Karakter menilai perilaku pada konteks bimbel, bukan sifat anak, keimanan, atau praktik keluarga.

## Durasi

Setiap indikator dirancang sekitar satu menit, tetapi belum tervalidasi. Dengan 14 tugas, persiapan bahan, perpindahan alat, pengamatan Karakter, dan jeda kecil, satu tes kemungkinan memakan 25–45 menit. Pada level atas atau anak yang butuh waktu adaptasi, tes bisa lebih lama dan dilanjutkan pada pertemuan berikutnya sebelum final.

## Risiko

- Tes tanpa batas hari bisa tertunda lama sebelum final, sehingga anak belum bisa mengikuti kelas.
- Berhenti dini hanya berdasarkan A1, B1, E1, D1; anak mungkin sebenarnya punya kekuatan pada indikator lain di level itu.
- Tugas belum dinilai saat final diperlakukan belum lulus untuk antrean, sehingga anak bisa mulai dari indikator yang belum sempat diuji.
- Tidak ada revisi membuat salah input berdampak besar; solusi hapus siswa–tambah ulang sederhana tetapi kasar.
- English/Karakter yang Lulus sebagai status pendamping bisa terlihat seperti bagian kenaikan level bila tampilan aplikasi tidak membedakannya jelas.
