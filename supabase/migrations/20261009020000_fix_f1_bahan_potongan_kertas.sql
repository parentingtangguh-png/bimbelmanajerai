-- Ganti bahan F1 L1/L3/L4 dari "balok" → "potongan kertas"
update k8_indicators
set material = replace(material, 'balok', 'potongan kertas')
where slot = 'F1' and level in (1, 3, 4);
