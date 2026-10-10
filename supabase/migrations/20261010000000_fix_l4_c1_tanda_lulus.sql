-- Perbaikan kartu tes diagnostik L4: C1 L4 tanda lulus menyebut "setiap struktur"
-- tanpa menjelaskan inline mana kata yang termasuk kelompok KV-KV dan V-KV.

update k8_indicators
  set success = '**3 dari 4** tepat sesuai tulisan. Sedikitnya satu tepat dari tiap kelompok: **paku/dasi** (diawali konsonan) dan **ibu/itu** (diawali vokal).'
  where level = 4 and number = 5 and slot = 'C1';
