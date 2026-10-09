-- Perbaikan F1 L7 dan F1 L8: ganti "balok kecil/penjepit" dan "sama jenis dengan L7" menjadi "koin yang sama jenis dan ukuran" (benda mudah didapat, ukuran seragam).

update k8_indicators
  set material = 'Satuan berupa koin yang sama jenis dan ukuran. Target utama berupa tiga pita kertas polos sepanjang **4 satuan; 6 satuan; 5 satuan**.'
  where level = 7 and number = 6 and slot = 'F1';

update k8_indicators
  set material = 'Satuan berupa koin yang sama jenis dan ukuran; target utama bukan benda target L7: tiga tali rafia polos yang ditegangkan lurus sepanjang **5 satuan; 8 satuan; 11 satuan**. Satuan contoh berada di samping, tidak menempel target dan tidak boleh dipegang anak.'
  where level = 8 and number = 6 and slot = 'F1';
