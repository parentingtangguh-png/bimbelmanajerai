-- Menulis levels 2 and 3 both said "from a model", which hid the step the indicators actually test:
-- level 2 copies what is in front of the child, level 3 writes from memory. The wording now says so.
update public.curriculum
  set writing = 'Menyalin nama sendiri dan 5 kata pendek dengan contoh di depan mata, hasilnya dapat dibaca orang lain.'
  where level = 2;

update public.curriculum
  set writing = 'Menulis huruf dan kata sederhana yang didiktekan, tanpa contoh, dengan arah penulisan yang benar.'
  where level = 3;
