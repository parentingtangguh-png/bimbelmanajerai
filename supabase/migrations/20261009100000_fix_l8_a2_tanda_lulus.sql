-- Perbaikan kartu tes diagnostik L8: hilangkan referensi "rincian rubrik di bawah" pada A2 L8.
-- Kriteria hambatan, tindakan mengatasi, dan hasil akhir kini dicantumkan langsung di tanda lulus.

update k8_indicators
  set success = 'Satu cerita dengan **sedikitnya tiga klausa**, dalam urutan sesuai kejadian. **Hambatan:** anak menyatakan upaya memasukkan bola yang belum berhasil, atau keadaan penghalang yang dikaitkan dengan upaya tersebut. **Tindakan mengatasi:** kotak atau tutupnya dibuka. **Hasil akhir:** bola berhasil masuk atau sudah berada di dalam kotak.'
  where level = 8 and number = 7 and slot = 'A2';
