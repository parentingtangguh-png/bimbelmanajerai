-- L1 audit: perjelas tanda lulus D1/D2, cara uji E2, dan bahan C2

-- D1 L1: tanda lulus inline tanpa referensi "rubrik pramenulis"
update k8_indicators
set success = '**3 dari 4** sesuai jenis dan orientasi model. Tegak: arah utama atas–bawah. Mendatar: arah utama kiri–kanan. Miring: perpindahan diagonal jelas. Lengkung: satu busur terbuka, arah buka mengikuti model. Sedikit goyangan diterima. Arah gerak pensil bebas.'
where slot = 'D1' and level = 1;

-- D2 L1: tanda lulus inline tanpa referensi "rubrik pramenulis"
update k8_indicators
set success = '**3 dari 4** sesuai kategori. Tegak: arah utama atas–bawah. Mendatar: arah utama kiri–kanan. Miring: perpindahan diagonal jelas, boleh ke kedua arah. Lingkaran: putaran tanpa sudut, boleh oval. Sedikit goyangan diterima.'
where slot = 'D2' and level = 1;

-- E2 L1: ganti "sesuai ketentuan bersama" dengan kalimat langsung
update k8_indicators
set method = 'Tampilkan setiap kumpulan tanpa menyebut jumlahnya. Minta, "Hitung bendanya satu-satu," kemudian, "Semuanya ada berapa?" Anak wajib menunjuk, menyentuh, atau memindahkan setiap benda satu per satu sambil menghitung.'
where slot = 'E2' and level = 1;

-- C2 L1: tambah panduan cepat memilih pengecoh
update k8_indicators
set material = '**Enam nama:** sasaran; dua pengecoh berhuruf awal sama; tiga pengecoh berhuruf awal berbeda dari sasaran dan satu sama lain. Panjang seluruh pengecoh berselisih maksimal satu huruf dari sasaran. Contoh untuk **Rani** (4 huruf): **Dita / Rudi / Rani**, kemudian **Bima / Romi / Sela** — Rudi dan Romi berawal R (sama), Dita/Bima/Sela berawal beda, semua 4 huruf. Cara cepat: hitung huruf nama anak (n), pilih 5 nama pengecoh sepanjang n−1 hingga n+1 huruf, dua berawal huruf sama.'
where slot = 'C2' and level = 1;
