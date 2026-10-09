-- Ganti bahan F2 L1–L4 dari "Balok polos" → "Kerikil" (lebih mudah didapatkan)
update k8_indicators
set material = replace(material, 'Balok polos', 'Kerikil')
where slot = 'F2' and level in (1, 2, 3, 4);
