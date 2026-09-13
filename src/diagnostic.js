// Tes Diagnostik pilot Fase Fondasi (disetujui pemilik 13 Sep 2026). Tanpa DOM dan tanpa jaringan:
// isinya hanya instrumen tetap dan aturan yang memutuskan level awal, supaya bisa dites langsung.
// Teks indikator tidak disalin ke sini; layar mengambilnya dari tabel curriculum_level_indicators.

export const DIAGNOSTIC_LEVELS = [1, 2, 3, 4];
// Indikator 1-6 menentukan tuntas; 7 (English) dan 8 (Karakter) dicatat tanpa memindahkan level.
export const DECIDING = [1, 2, 3, 4, 5, 6];
export const RATINGS = [
  ['T', '✓', 'Tercapai'],
  ['B', '◐', 'Dengan bantuan'],
  ['N', '✗', 'Belum']
];
export const ratingMark = code => (RATINGS.find(r => r[0] === code) || [])[1] || '·';

// Tugas penentu per indikator: apa yang dilakukan, bahan yang dipakai, dan kapan disebut tercapai.
export const diagnosticTasks = {
  1: {
    1: {
      task: 'Diamati sepanjang tes.',
      material: '—',
      success: 'Bertahan sampai tugas terakhir; meninggalkan meja paling banyak 1 kali.'
    },
    2: {
      task: 'Saat anak sibuk bermain, panggil namanya 3 kali dari samping.',
      material: '—',
      success: 'Menoleh atau menjawab 2 dari 3.'
    },
    3: {
      task: '5 benda di meja. Minta anak menunjuk satu per satu: "Tunjuk sendok", dan seterusnya.',
      material: 'Bola kecil, sendok, pensil, gelas plastik, buku.',
      success: '4 dari 5 benar.'
    },
    4: {
      task: 'Tunjukkan 3 kartu bentuk yang satu berbeda: "Mana yang tidak sama?" Ulangi 4 kali.',
      material: 'Kartu bentuk: ● ● ▲ · ■ ■ ● · ▲ ▲ ■ · ● ■ ■',
      success: '3 dari 4 benar.'
    },
    5: {
      task: 'Contohkan garis tegak, garis datar, dan lingkaran; anak menirukan di pasir atau udara.',
      material: 'Nampan pasir atau kertas.',
      success: '2 dari 3 bentuk dikenali.'
    },
    6: {
      task: 'Mulai membilang "satu, dua…", anak melanjutkan.',
      material: '—',
      success: 'Sampai lima berurutan, hanya dengan bantuan awalan.'
    },
    7: {
      task: 'Tanpa peragaan: "sit down", "stand up", "clap your hands".',
      material: '—',
      success: '2 dari 3 dilakukan tanpa contoh gerak.'
    },
    8: {
      task: 'Diamati sepanjang tes: mau duduk bersama, mencoba meski ragu, tidak mengganggu.',
      material: '—',
      success: 'Dicatat saja.'
    }
  },
  2: {
    1: {
      task: 'Kartu vokal diacak; tunjuk satu per satu dan minta anak menyebut namanya.',
      material: 'Kartu A · I · U · E · O',
      success: '4 dari 5 benar.'
    },
    2: {
      task: 'Cocokkan kartu huruf dengan gambar yang berawal huruf itu.',
      material: 'Kartu B · S · M; gambar bola · buku · sapi · sepatu · mata · meja.',
      success: '4 dari 6 cocok.'
    },
    3: {
      task: 'Hitung 7 kancing, lalu 10 kancing: "Ada berapa?"',
      material: 'Kancing atau balok kecil.',
      success: 'Keduanya benar.'
    },
    4: {
      task: 'Kartu angka diacak: "Tunjuk angka …" dengan urutan 7 · 3 · 10 · 1 · 5 · 8 · 2 · 9 · 4 · 6.',
      material: 'Kartu angka 1–10.',
      success: '8 dari 10 benar.'
    },
    5: {
      task: 'Anak melanjutkan pola merah-biru-merah-biru, lalu besar-kecil-besar-kecil.',
      material: 'Kancing atau balok dua warna dan dua ukuran.',
      success: 'Kedua pola benar.'
    },
    6: {
      task: 'Amati cara anak memegang pensil saat menggambar bebas.',
      material: 'Kertas dan pensil 2B.',
      success: 'Pegangan jari (tiga jari), bukan kepalan.'
    },
    7: {
      task: 'Tunjuk bola, buku, dan tas: "What is this?"',
      material: 'Bola, buku, tas.',
      success: '2 dari 3 disebut dalam bahasa Inggris.'
    },
    8: {
      task: 'Diamati; di akhir minta anak merapikan kartu.',
      material: '—',
      success: 'Dicatat saja.'
    }
  },
  3: {
    1: {
      task: 'Anak membaca kartu suku kata yang diacak.',
      material: 'ba · bi · bu · be · bo · ma · si · ku · te · lo',
      success: '8 dari 10 terbaca.'
    },
    2: {
      task: 'Sebut 5 huruf; anak menulis bentuk kapital dan kecilnya.',
      material: 'A a · B b · D d · M m · S s; kertas dan pensil.',
      success: '4 dari 5 pasang terbaca.'
    },
    3: {
      task: 'Anak menyusun dua kartu suku kata menjadi kata, lalu membacanya.',
      material: 'bu + ku · ba + ju · ma + ta · sa + pi · ka + ki',
      success: '4 dari 5 benar.'
    },
    4: {
      task: 'Anak membilang maju 1–20, lalu mundur 20–1.',
      material: '—',
      success: 'Maju tanpa salah; mundur salah paling banyak 2.'
    },
    5: {
      task: 'Dua kelompok kancing: "Mana yang lebih banyak?" atau "lebih sedikit?"',
      material: 'Pasangan 6 & 9 · 4 & 3 · 8 & 5 · 2 & 7 · 10 & 6.',
      success: '4 dari 5 benar.'
    },
    6: {
      task: '"Ada 3 apel, ditambah 2. Jadi berapa?" dikerjakan dengan benda.',
      material: '3 + 2 · 4 + 1 · 5 + 3 · 2 + 6 · 4 + 4; kancing.',
      success: '4 dari 5 benar.'
    },
    7: {
      task: 'Ciptakan situasi: mainan dipegang guru (I want…), pilih gambar kesukaan (I like…), tutup botol sulit dibuka (help me please).',
      material: 'Mainan; gambar kucing · es krim · bola · bunga; botol bertutup rapat.',
      success: '2 dari 3 diucapkan sendiri.'
    },
    8: {
      task: 'Diamati sepanjang tes: mau membantu, berani menjawab, mendengarkan.',
      material: '—',
      success: 'Dicatat saja.'
    }
  },
  4: {
    1: {
      task: 'Anak membaca kartu kata.',
      material: 'buku · sapi · meja · topi · roda · kelapa · sepeda · kereta · sepatu · boneka',
      success: '8 dari 10 terbaca.'
    },
    2: {
      task: 'Anak membaca kartu kalimat.',
      material: 'Ibu beli roti. · Adik minum susu. · Bola itu merah. · Ayah baca buku. · Kita main di taman.',
      success: '4 dari 5 terbaca utuh tanpa mengeja per suku kata.'
    },
    3: {
      task: 'Anak menulis namanya sendiri tanpa contoh.',
      material: 'Kertas dan pensil.',
      success: 'Semua huruf lengkap dan terbaca guru.'
    },
    4: {
      task: 'Anak menulis satu kalimat tentang gambar; guru boleh mengeja kata yang ditanya.',
      material: 'Gambar anak memberi makan kucing.',
      success: '1 kalimat minimal 3 kata terbaca.'
    },
    5: {
      task: 'Urutkan 5 kartu angka; lalu tunjuk yang lebih besar dari tiap pasangan.',
      material: 'Urutkan 3 · 17 · 9 · 12 · 20; pasangan 12 & 15 · 19 & 11 · 8 & 18 · 14 & 13.',
      success: 'Urutan benar dan 3 dari 4 pasangan benar.'
    },
    6: {
      task: 'Bermain toko dengan uang mainan.',
      material:
        'Roti 3.000 + susu 5.000 · Punya 10.000, beli 4.000 · Permen 2.000 + 6.000 + 1.000 · Punya 20.000, beli 15.000 · Buku 7.000 + pensil 5.000',
      success: '4 dari 5 benar.'
    },
    7: {
      task: '"What\'s your name? How old are you?"',
      material: '—',
      success: 'Menjawab "My name is…" dan "I am … years old".'
    },
    8: {
      task: 'Diamati sepanjang tes: mengerjakan mandiri, bersikap hormat, siap memulai.',
      material: '—',
      success: 'Dicatat saja.'
    }
  }
};

// Saran titik mulai dari kelas formal. Guru bebas memilih level lain.
export function suggestedStart(grade) {
  if (grade === 'TK A') return 2;
  if (grade === 'TK B') return 3;
  if (/^SD /.test(grade || '')) return 4;
  return 1;
}

// Tuntas bila semua indikator penentu terisi, minimal 5 Tercapai, dan tidak ada yang Belum.
export function levelComplete(answers = {}) {
  if (!DECIDING.every(n => answers[n])) return undefined;
  const tercapai = DECIDING.filter(n => answers[n] === 'T').length;
  return tercapai >= 5 && !DECIDING.some(n => answers[n] === 'N');
}

// Level berikutnya yang harus diuji, atau keputusan akhirnya. Naik selama tuntas; bila titik mulai
// belum tuntas, turun sampai ditemukan level yang tuntas. Level awal = level terendah yang belum tuntas.
export function diagnosticPlan(start, results = {}) {
  const done = l => levelComplete(results[l]);
  if (done(start) === undefined) return { test: start };
  if (done(start)) {
    for (let l = start + 1; l <= 4; l++) {
      if (done(l) === undefined) return { test: l };
      if (!done(l)) return { final: l, beyond: false };
    }
    return { final: 4, beyond: true };
  }
  for (let l = start - 1; l >= 1; l--) {
    if (done(l) === undefined) return { test: l };
    if (done(l)) return { final: l + 1, beyond: false };
  }
  return { final: 1, beyond: false };
}

// Ringkasan yang disimpan ke kolom diagnostic. Tidak pernah kosong, karena kolom itulah penanda
// "sudah dites".
export function diagnosticSummary({ date, grade, start, order, results, plan, note }) {
  const lines = [`Tes diagnostik ${date}${grade ? ` · ${grade}` : ''} · mulai Level ${start}`];
  for (const l of order) {
    const r = results[l] || {};
    const marks = DECIDING.map(n => ratingMark(r[n])).join('');
    lines.push(
      `Level ${l}: ${marks} (English ${ratingMark(r[7])}) → ${levelComplete(r) ? 'tuntas' : 'belum tuntas'}`
    );
  }
  lines.push(`Level awal: ${plan.final}${plan.beyond ? ' (melampaui Fondasi)' : ''}`);
  const karakter = order.map(l => results[l]?.[8]).filter(Boolean);
  if (karakter.length) lines.push(`Karakter: ${karakter.map(ratingMark).join(' ')}`);
  if (String(note || '').trim()) lines.push(`Catatan: ${String(note).trim()}`);
  return lines.join('\n');
}
