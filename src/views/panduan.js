// Panduan langkah demi langkah untuk guru: dari tambah siswa sampai kabar WA ke orang tua.
import { heading } from '../ui.js';

const b = t => `<kbd class="guide-btn">${t}</kbd>`;
const tip = t => `<p class="muted">${t}</p>`;
const lock = items =>
  `<div class="guide-final"><strong>Tidak bisa dibatalkan</strong><ul>${items.map(i => `<li>${i}</li>`).join('')}</ul></div>`;
const note = t => `<div class="guide-note">${t}</div>`;
const steps = items => `<ol class="guide-steps">${items.map(i => `<li>${i}</li>`).join('')}</ol>`;
const phase = (num, title, sub, body) =>
  `<section class="panduan-phase"><div class="panduan-phase-head"><span class="panduan-num">${num}</span><div><strong>${title}</strong><p class="muted">${sub}</p></div></div><div class="panduan-phase-body">${body}</div></section>`;

export function panduanView() {
  const intro = heading('PANDUAN GURU', 'Langkah demi langkah dari data siswa hingga kabar WhatsApp ke orang tua.', '');

  const p1 = phase(
    '1', 'Tambah Siswa', 'Tab Data Siswa',
    steps([
      `Ketuk ${b('＋ Tambah siswa')}.`,
      'Isi data wajib: <b>Nama anak</b>, <b>Sapaan orang tua</b>, <b>Tanggal lahir</b>, <b>Kelas formal</b>. Nomor WhatsApp boleh kosong, tapi dibutuhkan untuk kirim kabar ke orang tua.',
      `Ketuk ${b('Simpan siswa')}. Anak otomatis menjadi siswa Anda.`
    ])
  );

  const p2 = phase(
    '2', 'Tes Diagnostik', 'Menemukan titik mulai anak — wajib sebelum bisa ikut kelas',
    steps([
      `Ketuk ${b('Tes Diagnostik')}, pilih anak, lalu pilih level. Level bertanda <em>(saran)</em> diambil dari kelas formal; boleh memilih level lain.`,
      `Ketuk ${b('Mulai tes →')}. Buka <b>Cara tes</b> bila perlu.`,
      'Di tiap kartu, buka <b>Cara uji, bahan, tanda lulus</b>. Huruf dan angka ditulis guru sendiri; gambar diganti benda nyata.',
      `Nilai tiap tugas: <b>Lulus</b>, <b>Belum</b>, atau <b>Belum dinilai</b>. Setiap ketukan langsung tersimpan dan masih boleh diubah.<br><b>Belum</b> = sudah diuji, belum lulus. <b>Belum dinilai</b> = tidak ada bukti sah (anak belum bersedia, tugas terputus) — jangan diberi Belum.`,
      `Anak lelah? Ketuk ${b('Jeda, lanjutkan nanti')}. Lanjutkan lewat ${b('Tes Diagnostik')} atau ${b('Lanjutkan tes')} di profil anak.`,
      `Baca kotak <b>Bila disimpan final sekarang</b>, lalu ketuk ${b('Simpan final')}. Tes boleh disimpan final apa adanya — tujuan tes adalah menemukan titik mulai anak, tidak harus semua indikator Lulus.`
    ]) +
    note('Bila A1, B1, E1, dan D1 semuanya Belum (di atas Level 1): muncul <b>TES BERHENTI</b>. Ketuk tombol ' + b('Mulai tes Level …') + ' untuk mengulang dari level lebih rendah.') +
    lock([
      `${b('Simpan final')}: hasil dan level awal terkunci.`,
      'Salah input setelah final: hapus siswa lalu tambah ulang, selama anak belum pernah ikut kelas.'
    ])
  );

  const p3 = phase(
    '3', 'Buat Jadwal', 'Tab Ruang Kelas',
    steps([
      `Ketuk ${b('＋ Buat jadwal')}. Tombol ini hanya muncul bila <b>semua sesi sebelumnya sudah ditandai selesai</b> dan tanggal yang dipilih <b>sama dengan atau lebih baru</b> dari jadwal terakhir. Tanggal yang lebih lama akan ditolak.`,
      `Isi <b>Tanggal</b> dan <b>Jam</b> (format 08:00 atau 08.00), lalu ${b('Simpan jadwal')}. Pertemuan, tema, dan indikator siswa berjalan otomatis.`,
      `Untuk sesi kedua di hari yang sama, ketuk ${b('＋ Tambah sesi')} pada Pertemuan terakhir.`
    ]) +
    `<div class="guide-final" style="background:var(--bg-offset,#f8f5ef)"><strong>Menyiapkan kelas malam sebelumnya</strong><ol class="guide-steps">${[
      'Tandai semua sesi hari ini selesai.',
      'Buat jadwal dengan tanggal besok.',
      'Buka lembar sesi, centang perkiraan siswa yang hadir.',
      `Ketuk ${b('Prompt kegiatan')} → ${b('Salin prompt')} → tempel ke obrolan baru di ChatGPT atau Gemini → pelajari rencana kegiatannya.`,
      'Besok saat kelas mulai, sesuaikan centang kehadiran dan salin prompt ulang bila perlu.'
    ].map(i => `<li>${i}</li>`).join('')}</ol></div>`
  );

  const p4 = phase(
    '4', 'Jalankan Sesi', 'Urutan kerja di dalam kelas',
    steps([
      `Ketuk ${b('Buka')} pada sesi hari ini. Baca <b>Tema hari ini</b>: benda nyata, kosakata, situasi Karakter.`,
      'Buka <b>Siswa yang hadir</b>, centang anak yang datang. Anak tanpa tes final tidak bisa dicentang.',
      `Ketuk ${b('Prompt kegiatan')} → ${b('Salin prompt')} → tempel ke <b>obrolan baru</b> di ChatGPT atau Gemini. Satu sesi = satu obrolan baru. Jawaban AI berisi ide kegiatan; saat menilai, ikuti <b>Cara uji, bahan, tanda lulus</b> di lembar sesi.`,
      `Tiap anak punya satu indikator. Buka <b>Cara uji, bahan, tanda lulus</b>, uji, lalu pilih nilainya.<br><b>Belum</b> atau <b>Belum dinilai</b>: anak tetap di indikator yang sama, muncul lagi di sesi berikutnya.`,
      'English dan Karakter boleh dibiarkan <b>Tidak dinilai</b>. Level 1, 4, 7, 9, 12, dan 15: English bebas dinilai kapan saja. Level lain: baru bisa dinilai setelah anak hadir 3 pertemuan dalam satu tema.',
      `Nilai tersimpan sendiri beberapa saat setelah diketuk — lihat tulisan <b>Tersimpan sendiri pukul …</b> di atas tombol. Ketuk ${b('Simpan sementara')} bila tulisan itu menyebut belum tersimpan.`,
      `Ketuk ${b('Tandai sesi selesai')} setelah semua anak selesai. Sesi boleh ditandai selesai apa adanya — anak yang Belum dinilai muncul lagi di sesi berikutnya.`
    ]) +
    note('Buka sesi di <b>satu tab saja</b>. Dua tab atau dua HP yang membuka sesi yang sama: yang tersimpan belakangan menimpa yang lain.') +
    lock([
      `${b('Tandai sesi selesai')}: sesi dikunci, nilai tidak bisa diubah, indikator yang Lulus berganti otomatis.`,
      'Sesi selesai hanya bisa dilihat (tombol Lihat). Bila ada kesalahan, hubungi pemilik.'
    ])
  );

  const p5 = phase(
    '5', 'Kirim Kabar ke Orang Tua', 'Setelah sesi selesai',
    steps([
      `Ketuk ${b('Lihat')} pada sesi yang sudah selesai.`,
      `Di setiap anak yang hadir, ketuk ${b('WhatsApp ke …')} — WhatsApp terbuka dengan pesan kemajuan belajar hari itu.`,
      `Di bagian <b>Tidak hadir</b> (bawah lembar), ketuk ${b('WhatsApp ke …')} untuk anak yang tidak datang — pesan berisi tema hari itu, kosakata English, dan subtema pertemuan berikutnya.`,
      'Baca pesan, ubah bila perlu, lalu tekan Kirim. Aplikasi tidak mengirim sendiri.'
    ]) +
    tip('Tombol mati bila Nomor WhatsApp orang tua belum diisi di profil anak.')
  );

  const pStar = phase(
    '★', 'Naik Level', '12 indikator akademik sudah Lulus',
    steps([
      'Di lembar sesi atau profil anak, muncul <b>Siap naik ke Level X</b>.',
      `Buka profil anak → ketuk ${b('Naik ke Level X')}. Anak tidak bisa naik level bila masih ada sesi yang belum selesai.`
    ]) +
    lock([`${b('Naik ke Level …')}: tidak bisa dikembalikan ke level sebelumnya.`])
  );

  return `${intro}<div class="panduan-list">${p1}${p2}${p3}${p4}${p5}${pStar}</div>`;
}
