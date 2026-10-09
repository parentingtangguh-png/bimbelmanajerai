-- Perbaikan audit L9: D1 (bahan konkret + tanda lulus legibilitas), F1 (cara uji + bahan + kunci),
-- A2 (hapus "lancar" subyektif), D2 (definisikan "saling berhubungan" dan "gagasan lengkap").

-- D1 L9: bahan kini paragraf konkret 42 kata; tanda lulus ganti "≥90% huruf terbaca" → "semua kata dapat dibaca guru tanpa menebak"
update k8_indicators
  set material = '**Pagi hari, Budi bangun dan langsung mencuci muka. Ia memakai seragam sekolah lalu sarapan bersama ibu. Setelah sarapan, Budi berpamitan kepada orang tua dan berangkat ke sekolah dengan tas di punggung. Di sekolah, Budi belajar membaca, menulis, dan berhitung bersama teman-teman sekelas.** Model tetap terlihat.',
      success  = 'Semua kalimat tersalin urut; tidak ada kalimat hilang; ≤3 kesalahan ejaan/salin; ≤2 kesalahan kapital atau tanda baca; semua kata dapat dibaca guru tanpa menebak.'
  where level = 9 and number = 4 and slot = 'D1';

-- F1 L9: cara uji diselaraskan dengan format bahan; bahan 5 pertanyaan → 4 pertanyaan satu jawaban jelas; kunci ditambahkan
update k8_indicators
  set method   = 'Guru berkata: "Tunjuk bangun yang saya maksud." Guru mengajukan satu pertanyaan per butir secara lisan.',
      material = 'Guru menggambar: persegi, persegi panjang, segitiga, lingkaran. Pertanyaan: (1) mana yang tidak memiliki sudut? (2) mana yang memiliki 3 sisi? (3) mana yang keempat sisinya sama panjang? (4) mana yang memiliki 4 sudut tetapi panjang dan lebarnya berbeda?',
      success  = '3 dari 4 respons benar. Kunci: (1) lingkaran; (2) segitiga; (3) persegi; (4) persegi panjang.'
  where level = 9 and number = 6 and slot = 'F1';

-- A2 L9: hapus "dibaca lancar" subyektif; ganti dengan "seluruh 3 kalimat dibaca dari awal sampai akhir"
update k8_indicators
  set success = 'Seluruh 3 kalimat dibaca dari awal sampai akhir; maksimal 3 kesalahan kata total; jeda titik benar pada minimal 2 kalimat.'
  where level = 9 and number = 7 and slot = 'A2';

-- D2 L9: definisikan "saling berhubungan" dan "gagasan lengkap" secara operasional; hapus rentang 15–30 kata
update k8_indicators
  set success = 'Minimal 2 kalimat; kalimat kedua melanjutkan, menjelaskan, atau terkait langsung dengan kalimat pertama (topik, pelaku, atau kejadian yang sama); masing-masing kalimat memiliki pelaku/subjek dan tindakan/keadaan yang dinyatakan; ≤4 kesalahan ejaan pada seluruh kalimat.'
  where level = 9 and number = 10 and slot = 'D2';
