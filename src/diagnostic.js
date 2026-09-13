// Tes Diagnostik pilot Fase Fondasi (disetujui pemilik 13 Sep 2026). Tanpa DOM dan tanpa jaringan:
// isinya hanya aturan yang memutuskan level awal, supaya bisa dites langsung.
// Tugas, bahan, dan ukuran tiap tugas tidak ada di sini: semuanya menempel pada indikatornya di tabel
// curriculum_level_indicators (kolom diagnostic_*), supaya indikator dan cara mengujinya berubah bersama.

export const DIAGNOSTIC_LEVELS = [1, 2, 3, 4];
// Indikator 1-6 menentukan tuntas; 7 (English) dan 8 (Karakter) dicatat tanpa memindahkan level.
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

// Nilai yang dikirim ke save_diagnostic: satu baris per indikator yang dinilai, hanya level yang diuji.
export function diagnosticPayload(order, results) {
  return order.flatMap(level =>
    Object.entries(results[level] || {}).map(([number, rating]) => ({
      level,
      number: Number(number),
      rating
    }))
  );
}

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

// Level yang benar-benar dilalui jalur tes, dengan jawaban lengkapnya. Jawaban level lain dibuang dari
// hasil (bukan dari isian awal), supaya perubahan nilai di level yang lebih awal tidak meninggalkan
// level di luar jalur, yang akan ditolak save_diagnostic.
export function diagnosticPath(start, results = {}) {
  const order = [];
  const kept = {};
  for (let p = diagnosticPlan(start, kept); p.test; p = diagnosticPlan(start, kept)) {
    if (levelComplete(results[p.test]) === undefined) break;
    kept[p.test] = results[p.test];
    order.push(p.test);
  }
  return { order, results: kept };
}

// Tes tersimpan dibuka lagi untuk direvisi: jawaban per indikator disusun kembali menjadi jalur tes.
export function runFromSaved(test, rows) {
  const results = {};
  for (const r of rows.filter(x => x.test_id === test.id))
    (results[r.level] ||= {})[r.indicator_number] = r.rating;
  const path = diagnosticPath(test.start_level, results);
  return {
    student: test.student_id,
    start: test.start_level,
    ...path,
    draft: results,
    revision: true,
    note: test.note || ''
  };
}

// Posisi tes yang belum selesai, untuk tombol "Lanjutkan".
export function draftProgress(run) {
  const plan = diagnosticPlan(run.start, run.results || {});
  if (!plan.test) return { level: null, rated: 0, done: true };
  const answers = { ...(run.draft?.[plan.test] || {}), ...(run.results?.[plan.test] || {}) };
  return { level: plan.test, rated: Object.keys(answers).length, done: false };
}

// Kalimat perpindahan level, supaya guru tahu kenapa level berikutnya muncul.
export function transitionNote(run, level) {
  const last = run.order[run.order.length - 1];
  if (!last) return '';
  return levelComplete(run.results[last])
    ? `✓ Level ${last} tuntas — lanjut menguji Level ${level}. Tes berhenti di level pertama yang belum tuntas.`
    : `Level ${last} belum tuntas — turun menguji Level ${level}, untuk memastikan level di bawahnya sudah tuntas.`;
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
