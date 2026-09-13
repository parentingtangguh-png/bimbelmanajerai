// Tes Diagnostik pilot Fase Fondasi (disetujui pemilik 13 Sep 2026). Tanpa DOM dan tanpa jaringan:
// isinya hanya aturan yang memutuskan hasil tes, supaya bisa dites langsung.
// Tugas, bahan, dan ukuran tiap tugas tidak ada di sini: semuanya menempel pada indikatornya di tabel
// curriculum_level_indicators (kolom diagnostic_*), supaya indikator dan cara mengujinya berubah bersama.
//
// Satu tes menguji satu level. Lulus = indikator 1-6 semuanya Tercapai. Lulus Level X → level awal X+1
// (Level 4 tetap 4, melampaui Fondasi); belum lulus → level awal X. save_diagnostic menjaga aturan yang sama.

export const DIAGNOSTIC_LEVELS = [1, 2, 3, 4];
// Indikator 1-6 menentukan lulus; 7 (English) dan 8 (Karakter) dicatat tanpa memindahkan level.
export const DECIDING = [1, 2, 3, 4, 5, 6];
export const RATINGS = [
  ['T', '✓', 'Tercapai'],
  ['B', '◐', 'Dengan bantuan'],
  ['N', '✗', 'Belum']
];
// Aturan pemberian tanda, sama untuk semua tugas yang memakai hitungan ("4 dari 5").
export const RATING_RULE =
  '✓ memenuhi ukuran tanpa bantuan · ◐ memenuhi setelah dibantu, atau kurang satu dari ukuran · ✗ lebih rendah dari itu';
export const ratingMark = code => (RATINGS.find(r => r[0] === code) || [])[1] || '·';

// Tugas aktif dikerjakan lebih dulu; yang diamati sepanjang tes dinilai di bagian paling bawah.
export function taskOrder(indicators, level) {
  const own = indicators.filter(i => i.level === level).sort((a, b) => a.number - b.number);
  return {
    active: own.filter(i => !i.diagnostic_observe).map(i => i.number),
    observed: own.filter(i => i.diagnostic_observe).map(i => i.number)
  };
}

// Saran level yang dites, dari kelas formal. Guru bebas memilih level lain.
export function suggestedStart(grade) {
  if (grade === 'TK A') return 2;
  if (grade === 'TK B') return 3;
  if (/^SD /.test(grade || '')) return 4;
  return 1;
}

// Hasil satu level. complete=false selama indikator 1-6 belum semuanya dinilai.
export function diagnosticOutcome(level, answers = {}) {
  const complete = DECIDING.every(n => answers[n]);
  const passed = complete && DECIDING.every(n => answers[n] === 'T');
  return {
    complete,
    passed,
    final: passed ? Math.min(level + 1, 4) : level,
    beyond: passed && level === 4,
    status: complete ? `${passed ? 'Lulus' : 'Belum lulus'} Level ${level}` : ''
  };
}

// Indikator penentu yang belum Tercapai: yang perlu dilatih lebih dulu di kelas.
export const focusIndicators = (answers = {}) => DECIDING.filter(n => answers[n] !== 'T');

// Nilai yang dikirim ke save_diagnostic: satu baris per indikator yang dinilai.
export function diagnosticPayload(level, answers = {}) {
  return Object.entries(answers).map(([number, rating]) => ({ level, number: Number(number), rating }));
}

// Tes tersimpan dibuka lagi untuk direvisi. Tes lama yang menguji beberapa level dibuka pada level
// pertama yang dites.
export function runFromSaved(test, rows) {
  const level = test.tested_level || test.start_level;
  const answers = {};
  for (const r of rows.filter(x => x.test_id === test.id && x.level === level))
    answers[r.indicator_number] = r.rating;
  return { student: test.student_id, level, answers, reviewed: false, revision: true, note: test.note || '' };
}

// Berapa indikator yang sudah dinilai, untuk tombol "Lanjutkan".
export const draftProgress = run => Object.keys(run.answers || {}).length;

// Ringkasan yang disimpan ke kolom diagnostic. Tidak pernah kosong, karena kolom itulah penanda
// "sudah dites". save_diagnostic memeriksa baris "Level awal: N".
export function diagnosticSummary({ date, grade, level, answers = {}, note }) {
  const o = diagnosticOutcome(level, answers);
  const marks = DECIDING.map(n => ratingMark(answers[n])).join('');
  const lines = [
    `Tes diagnostik ${date}${grade ? ` · ${grade}` : ''} · Level ${level}`,
    `Level ${level}: ${marks} (English ${ratingMark(answers[7])}) → ${o.passed ? 'lulus' : 'belum lulus'}`,
    `Level awal: ${o.final}${o.beyond ? ' (melampaui Fondasi)' : ''}`
  ];
  if (answers[8]) lines.push(`Karakter: ${ratingMark(answers[8])}`);
  if (String(note || '').trim()) lines.push(`Catatan: ${String(note).trim()}`);
  return lines.join('\n');
}
