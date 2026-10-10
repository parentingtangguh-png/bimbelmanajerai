-- Perbaikan A2 L5 K6: ganti "tiga klausa berbeda" (istilah linguistik) dengan
-- "tiga bagian cerita berbeda" + contoh lulus/belum agar guru dapat menilai dalam 3 detik.

update k8_indicators
  set success = 'Satu tuturan dengan **sedikitnya tiga bagian cerita berbeda**. Unsur wajib: **mengambil buku; memasukkan buku ke tas; meletakkan tas di meja; urutan sesuai kejadian**. Contoh lulus: "Aku ambil buku, taruh di tas, terus taruh di meja." Contoh belum: hanya menyebut dua tindakan, atau tiga tindakan dengan urutan terbalik.'
  where level = 5 and number = 7 and slot = 'A2';
