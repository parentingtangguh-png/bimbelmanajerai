-- Audit L9: 7 perbaikan kartu diagnostik
-- D1 K2/K3: material konkret + K6: success tanpa persentase
-- F1 K1: kurangi dari 5→4 pertanyaan, hilangkan ambiguitas Q4
-- A2 K6: ambang lulus dari min-2 menjadi seluruh-3 kalimat
-- D2 K6: success diperjelas (subjek+tindakan, bukan "saling berhubungan")
-- C2 K2: material tampilkan teks lengkap; method instruksi eksplisit
-- E2 K6: tambah kunci jawaban
-- F2 K6: tambah kunci jawaban

update k8_indicators set
  material   = 'Budi bangun pagi. Ia mandi dan memakai baju seragam. Setelah sarapan, Budi berpamitan kepada ibu. Ia berangkat ke sekolah bersama teman.',
  success    = 'Semua kalimat tersalin urut; tidak ada kalimat hilang; ≤3 kesalahan ejaan/salin; ≤2 kesalahan kapital atau tanda baca; semua kata terbaca guru tanpa menebak.'
where level = 9 and slot = 'D1';

update k8_indicators set
  method     = 'Guru menggambar empat bangun, lalu berkata: "Tunjuk bangun yang saya sebutkan." Empat pertanyaan, masing-masing satu tunjukan.',
  material   = 'Guru menggambar: persegi, persegi panjang, segitiga, lingkaran. Pertanyaan: (1) mana yang sisinya semua sama panjang? (2) mana yang memiliki tepat 3 sisi? (3) mana yang tidak memiliki sudut? (4) mana yang memiliki tepat 4 sudut dan sisi-sisinya belum tentu sama panjang?',
  success    = '3 dari 4 tunjukan tepat. Kunci: (1) persegi; (2) segitiga; (3) lingkaran; (4) persegi panjang.'
where level = 9 and slot = 'F1';

update k8_indicators set
  competency = 'Membaca tiga kalimat 5–8 kata dengan tanda titik dan koma sederhana.',
  success    = 'Seluruh 3 kalimat dibaca dari awal sampai akhir; maksimal 3 kesalahan kata total; jeda titik benar pada minimal 2 kalimat.'
where level = 9 and slot = 'A2';

update k8_indicators set
  success    = 'Minimal 2 kalimat; kalimat kedua melanjutkan topik atau pelaku yang sama dengan kalimat pertama; masing-masing memiliki subjek dan tindakan yang dinyatakan; ≤4 kesalahan ejaan dalam 15–30 kata.'
where level = 9 and slot = 'D2';

update k8_indicators set
  method     = 'Tampilkan teks; setelah anak membaca, tanyakan: "Apa yang dimakan Rani saat istirahat?"',
  material   = 'Rani membawa bekal. Ia makan roti saat istirahat. Setelah itu, Rani minum air.'
where level = 9 and slot = 'C2';

update k8_indicators set
  success    = '4 dari 5 benar. Kunci: 385; 654; 436; 355; 226.'
where level = 9 and slot = 'E2';

update k8_indicators set
  success    = '3 dari 4 benar. Kunci: 16 cm; 24 cm; 16 cm; 20 cm.'
where level = 9 and slot = 'F2';
