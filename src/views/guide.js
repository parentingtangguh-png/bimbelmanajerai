// Panduan per tab untuk guru dan pemilik: tombol di atas doa (HP) atau kaki halaman (laptop) membuka
// panduan tab yang sedang dibuka saja. Nama tombol dan teks layar yang disebut di sini harus sama
// dengan yang tertulis di view lain; tes render menjaga sebagian.
import { state, labels, homeKeys } from '../state.js';

const b = t => `<b class="guide-btn">${t}</b>`;
const tip = t => `<p class="muted">${t}</p>`;
const list = items => `<ul class="guide-steps">${items.map(i => `<li>${i}</li>`).join('')}</ul>`;
const steps = items => `<ol class="guide-steps">${items.map(i => `<li>${i}</li>`).join('')}</ol>`;
const locked = items =>
  `<div class="guide-final"><strong>Tidak bisa dibatalkan</strong><ul>${items.map(i => `<li>${i}</li>`).join('')}</ul></div>`;
const part = (title, body) => `<h3>${title}</h3>${body}`;

// Dipakai di Data siswa dan Ruang kelas guru: dua tempat guru memberi nilai.
const ratingPart = () =>
  part(
    'Lulus, Belum, atau Belum dinilai?',
    list([
      '<b>Lulus</b>: prosedur berjalan sah dan anak menunjukkan tanda lulus.',
      '<b>Belum</b>: prosedur berjalan sah, tetapi tanda lulus belum terpenuhi.',
      '<b>Belum dinilai</b>: tidak ada bukti sah, misalnya anak belum bersedia, tugas terputus, atau bahan tidak layak.'
    ]) +
      tip(
        'Belum dan Belum dinilai sama-sama belum lulus: anak tetap di indikator itu. Tugas yang tidak sah cukup Belum dinilai, jangan diberi Belum.'
      )
  );

const curriculumPart = () =>
  part(
    'Isi tab ini',
    list([
      '<b>Capaian pembelajaran</b>.',
      '<b>Level 1–8</b>: ketuk level, lalu ketuk indikator untuk melihat <b>Cara uji</b>, <b>Bahan</b>, <b>Tanda lulus</b>.',
      '<b>Ketentuan dan bahan cadangan per alur</b>.',
      '<b>Tema</b>: subtema dan nomor pertemuan, benda nyata, kosakata, English, situasi Karakter.'
    ])
  );

const teacher = {
  [homeKeys.ringkasan]: () =>
    part(
      'Angka di atas',
      list([
        '<b>Siswa aktif</b>: anak berstatus Aktif.',
        '<b>Sudah dites</b>: tes diagnostiknya sudah disimpan final.',
        '<b>Belum dites</b>: belum dites atau tesnya belum final. Anak ini belum bisa ikut kelas.'
      ])
    ) +
    part(
      'Tulisan di bawah nama anak',
      list([
        '<b>Belum tes diagnostik</b> / <b>Tes Level X belum final</b>: selesaikan tesnya di Data siswa.',
        '<b>Indikator N · slot</b>: indikator yang dilatih dan dinilai di sesi berikutnya.',
        '<b>Siap naik ke Level X</b>: 12 indikator akademik Lulus. Buka profil anak untuk menaikkan level.',
        '<b>Kurikulum 8 level selesai</b>.'
      ])
    ) +
    part('Sebaran level', tip('Jumlah anak aktif di tiap level. Ketuk nama anak untuk membuka profilnya.')),

  [homeKeys.siswa]: () =>
    part(
      'Menambah siswa',
      steps([
        `Ketuk ${b('＋ Tambah siswa')}.`,
        'Wajib diisi: <b>Nama anak</b>, <b>Sapaan orang tua</b>, <b>Tanggal lahir</b>, <b>Kelas formal</b>. Nama panggilan dan Nomor WhatsApp boleh kosong.',
        `Ketuk ${b('Simpan siswa')}. Anak otomatis menjadi siswa Anda.`
      ])
    ) +
    part(
      'Tes diagnostik',
      steps([
        `Ketuk ${b('Tes Diagnostik')}, pilih <b>Anak yang dites</b> dan <b>Level yang dites</b>. Level bertanda (saran) diambil dari kelas formal; boleh memilih level lain.`,
        `Ketuk ${b('Mulai tes →')}. Buka <b>Cara tes</b> bila perlu.`,
        'Di tiap kartu buka <b>Cara uji, bahan, tanda lulus</b>. Huruf, angka, dan kata ditulis guru sendiri; gambar diganti benda nyata.',
        'Ketuk <b>Lulus</b>, <b>Belum</b>, atau <b>Belum dinilai</b>, dan <b>Paket utama</b> atau <b>Paket cadangan</b>. Setiap ketukan langsung tersimpan dan masih boleh diubah.',
        `Anak lelah? ${b('Jeda, lanjutkan nanti')}. Lanjutkan lewat ${b('Tes Diagnostik')} atau ${b('Lanjutkan tes')} di profil anak.`,
        `Baca kotak <b>Bila disimpan final sekarang</b>, lalu ${b('Simpan final')}.`
      ]) +
        tip(
          'English tidak dinilai pada anak baru. Bila A1, B1, E1, dan D1 semuanya Belum (di atas Level 1), muncul <b>TES BERHENTI</b>: ketuk tombol <b>Mulai tes Level …</b> yang tersedia.'
        )
    ) +
    part(
      'Profil anak',
      tip(
        `Ketuk nama anak: ubah data lalu ${b('Simpan profil siswa')}, lihat <b>Kemajuan Level</b>, ${b('Naik ke Level …')} setelah 12 indikator Lulus, ${b('Nonaktifkan siswa ini')} untuk anak yang berhenti atau cuti.`
      )
    ) +
    locked([
      `${b('Simpan final')} tes diagnostik: hasil dan level awal terkunci.`,
      `${b('Naik ke Level …')}: tidak bisa dikembalikan ke level sebelumnya.`,
      `${b('Hapus siswa ini')}: data hilang permanen. Hanya untuk salah input atau data ganda, dan hanya bila anak belum pernah ikut kelas.`
    ]) +
    tip('Salah input pada tes final: hapus siswa lalu tambah ulang, selama anak belum pernah ikut kelas.') +
    ratingPart(),

  [homeKeys.kelas]: () =>
    part(
      'Membuat jadwal',
      steps([
        `Ketuk ${b('＋ Buat jadwal')}, isi <b>Tanggal</b> dan <b>Jam</b>, lalu ${b('Simpan jadwal')}. Pertemuan, tema, dan indikator siswa berjalan otomatis.`,
        `Sesi lain di hari yang sama: ${b('＋ Tambah sesi')} pada <b>Pertemuan terakhir</b>.`,
        `${b('＋ Buat jadwal')} baru muncul lagi setelah semua sesi ditandai selesai. ${b('Ubah')} dan ${b('Hapus')} hanya untuk sesi yang belum selesai.`
      ])
    ) +
    part(
      'Menjalankan sesi',
      steps([
        `Ketuk ${b('Buka')}. Buka <b>Tema hari ini</b>: benda nyata, kosakata, English, situasi Karakter.`,
        'Buka <b>Siswa yang hadir</b> dan centang anaknya. Anak dengan tes belum final tidak bisa dicentang; anak yang sudah masuk sesi lain hari itu tidak ditampilkan.',
        `Opsional: ${b('Prompt kegiatan')} → ${b('Salin prompt')} → tempel ke <b>obrolan baru</b> di ChatGPT atau Gemini (satu sesi, satu obrolan baru). Jawaban AI hanya ide kegiatan; saat menilai, ikuti <b>Cara uji, bahan, tanda lulus</b> di lembar sesi.`,
        'Tiap anak punya satu indikator. Buka <b>Cara uji, bahan, tanda lulus</b>, uji, lalu pilih <b>Lulus</b>, <b>Belum</b>, atau <b>Belum dinilai</b>.',
        'English dan Karakter boleh dibiarkan <b>Tidak dinilai</b>. English sebagian level baru bisa dinilai setelah anak hadir 3 pertemuan dalam satu tema.',
        `Selama kelas: ${b('Simpan sementara')}. Setelah semua anak dinilai: ${b('Tandai sesi selesai')}.`
      ])
    ) +
    locked([
      `${b('Tandai sesi selesai')}: sesi dikunci, nilai tidak bisa diubah, dan indikator anak yang Lulus berganti otomatis.`
    ]) +
    tip(
      'Sesi yang sudah selesai hanya bisa dilihat (tombol <b>Lihat</b>). Bila ada kesalahan, hubungi pemilik.'
    ) +
    part(
      'Kabar harian untuk orang tua',
      steps([
        `Setelah sesi ditandai selesai, ketuk ${b('Lihat')} pada sesi itu.`,
        `Di setiap anak ketuk ${b('WhatsApp ke')} … — WhatsApp terbuka dengan pesan yang sudah tersusun.`,
        'Baca pesannya, ubah bila perlu, lalu tekan Kirim. Aplikasi tidak mengirim sendiri dan tidak mencatat pesan yang terkirim.'
      ]) + tip('Tombol mati bila Nomor WhatsApp orang tua belum diisi di profil anak.')
    ) +
    ratingPart(),

  [homeKeys.kurikulum]: () =>
    curriculumPart() +
    tip(
      'Hanya untuk dibaca. Tes diagnostik dan Ruang kelas mengambil isinya dari sini, jadi guru tidak perlu memilih indikator sendiri.'
    )
};

const owner = {
  [homeKeys.ringkasan]: () =>
    part(
      'Angka di atas',
      list([
        '<b>Siswa aktif</b>: anak berstatus Aktif.',
        '<b>Sudah dites</b>: tes diagnostiknya sudah disimpan final oleh guru.',
        '<b>Belum dites</b>: belum dites atau tesnya belum final. Anak ini belum bisa ikut kelas.',
        '<b>Guru aktif</b>: guru yang aksesnya aktif di Tim pengajar.'
      ])
    ) +
    part(
      'Tulisan di bawah nama anak',
      list([
        '<b>Sudah dites</b>: tes final.',
        '<b>Belum tes diagnostik</b> / <b>Tes Level X belum final</b>: guru belum menyelesaikan tesnya.'
      ])
    ) +
    part('Sebaran level', tip(`Jumlah anak aktif di tiap level. ${b('Kelola tim')} membuka Tim pengajar.`)) +
    tip('Pemilik hanya membaca. Siswa, tes, dan kelas diurus oleh guru.'),

  [homeKeys.siswa]: () =>
    part(
      'Membaca tabel',
      list([
        '<b>Siswa</b>: nama anak dan sapaan orang tua.',
        '<b>Level</b>: level anak saat ini.',
        '<b>Tes diagnostik</b>: level yang dites dan titik mulai kelas, atau belum final.',
        '<b>Status</b>: Aktif / Non-Aktif.'
      ]) +
        tip(
          'Siswa dikelompokkan per guru pendamping. Ketuk nama guru untuk membuka atau menutup daftarnya; anak yang didampingi dua guru muncul di keduanya. Saat mencari nama, kelompok yang berisi hasil terbuka sendiri.'
        )
    ) +
    part(
      'Profil anak',
      tip(
        'Ketuk baris untuk membuka profil. Profil hanya bisa dibaca; perubahan dilakukan oleh guru pendamping. Hasil per tugas tes dan kemajuan level hanya terlihat oleh guru.'
      )
    ) +
    part('Mencari', tip('Ketik nama di kotak <b>Cari nama siswa…</b>.')),

  [homeKeys.tim]: () =>
    part(
      'Menambah guru baru',
      steps([
        `Ketuk ${b('＋ Daftarkan guru')}, isi <b>Nama guru</b> dan <b>Email guru</b>, lalu ${b('Daftarkan email guru')}.`,
        'Buat akunnya di <b>Supabase Dashboard → Authentication → Users → Add user → Create new user</b>: email yang sama, kata sandi <b>minimal 8 karakter</b>, dan <b>Auto Confirm User</b> dicentang. Akun ditolak bila emailnya belum didaftarkan di sini.',
        'Serahkan email dan kata sandi langsung ke guru (jangan lewat grup). Guru boleh menggantinya lewat <b>Ganti kata sandi</b>.'
      ])
    ) +
    part(
      'Guru lupa kata sandi atau muncul "Email not confirmed"',
      steps([
        'Buka <b>Supabase Dashboard → SQL Editor</b> dan jalankan perintah <b>B</b> dari dokumen <b>Prosedur akun guru</b> (docs/prosedur-akun-guru.md di GitHub).',
        'Ganti email guru dan kata sandi baru (minimal 8 karakter). Hasil yang benar: satu baris berisi email guru.',
        'Serahkan kata sandi baru langsung ke guru.'
      ]) +
        tip(
          'Kata sandi selalu ikut diganti, walau masalahnya hanya "Email not confirmed", supaya akun yang mungkin didaftarkan orang lain tidak bisa dipakai.'
        )
    ) +
    part(
      'Menonaktifkan guru',
      tip(
        `${b('Nonaktifkan')} mematikan akses guru ke data aplikasi; data siswanya tetap tersimpan. ${b('Aktifkan')} mengembalikan aksesnya. Jangan menghapus akun guru di Supabase: jadwal dan nilai kelas tercatat atas namanya.`
      )
    ) +
    part(
      'Guru ganti email',
      tip(
        'Jangan mengubah email guru yang sudah punya akun. Nonaktifkan email lama, lalu daftarkan email baru seperti guru baru. Siswa lama tidak ikut pindah.'
      )
    ),

  [homeKeys.kurikulum]: () =>
    curriculumPart() +
    tip('Hanya untuk dibaca. Isinya terkunci dan dipakai guru untuk tes diagnostik dan kelas.')
};

const guidesFor = () => (state.role === 'owner' ? owner : teacher);

export function guideButton() {
  return guidesFor()[state.view]
    ? `<button class="guide-open" data-action="guide">Panduan ${labels[state.view]}</button>`
    : '';
}

export function guideBody() {
  const guide = guidesFor()[state.view];
  return guide ? `<div class="guide">${guide()}</div>` : '';
}
