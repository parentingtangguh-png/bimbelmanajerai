-- Perbaikan B1 L5 K2: tambahkan keterangan "ki" = nama huruf q inline,
-- setara dengan keterangan "fe" = v yang sudah ada.

update k8_indicators
  set method = 'Katakan, "Tunjuk huruf yang namanya saya sebut." Ucapkan **ye, ef, eks, we, ef, fe, ki, zet**. "Fe" adalah pelafalan nama `v`; "ki" adalah pelafalan nama `q`.'
  where level = 5 and number = 2 and slot = 'B1';
