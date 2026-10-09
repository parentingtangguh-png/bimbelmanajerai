-- Ganti bahan F2 L1–L4 dari "Kerikil" → "Tutup botol"
update k8_indicators
set material = replace(material, 'Kerikil', 'Tutup botol')
where slot = 'F2' and level in (1, 2, 3, 4);
