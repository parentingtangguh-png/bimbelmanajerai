// Tes Diagnostik kurikulum 8 level (aturan terkunci 15 Sep 2026, docs/curriculum/diagnostik.md). Tanpa DOM
// dan tanpa jaringan: hanya aturan untuk ditampilkan. Database (start_diagnostic, rate_diagnostic,
// finalize_diagnostic) menjaga aturan yang sama dan menghitung hasil finalnya sendiri.
//
// Nomor tugas = nomor indikator k8: 1–12 akademik (urutan slot), 13 English, 14 Karakter.

export const DIAGNOSTIC_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8];
// Urutan dikerjakan: enam akademik pertama, English, enam akademik berikutnya, Karakter.
export const TASK_ORDER = [1, 2, 3, 4, 5, 6, 13, 7, 8, 9, 10, 11, 12, 14];
export const ACADEMIC = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
export const ENGLISH = 13;
export const CHARACTER = 14;
// A1, B1, E1, D1: bila keempatnya Belum, tes berhenti (kecuali Level 1).
export const STOP_TASKS = [1, 2, 3, 4];
export const STATUSES = [
  ['lulus', 'Lulus'],
  ['belum', 'Belum'],
  ['', 'Belum dinilai']
];

// Saran level dari kelas formal. Guru bebas memilih level lain.
export function suggestedStart(grade) {
  if (grade === 'TK B') return 3;
  if (grade === 'SD 1') return 5;
  if (/^SD [2-6]$/.test(grade || '')) return 7;
  return 1;
}

// Awal pita sebelumnya untuk tes yang berhenti: L7/8→5, L5/6→3, L3/4→1, L2→1.
export const restartLevel = level => Math.max(1, Math.floor((level - 1) / 2) * 2 - 1);

// Jawaban satu tes dari baris diagnostic_results: { nomor: { status, package } }.
export function answersOf(results, testId) {
  return Object.fromEntries(
    results.filter(r => r.test_id === testId).map(r => [r.number, { status: r.status, package: r.package }])
  );
}
const statusOf = (answers, n) => answers[n]?.status || '';

export const isStopped = (level, answers = {}) =>
  level > 1 && STOP_TASKS.every(n => statusOf(answers, n) === 'belum');

// Tugas yang sudah dinilai dari 13 yang bisa dinilai (English tidak dinilai pada anak baru).
export const ratedCount = (answers = {}) => TASK_ORDER.filter(n => statusOf(answers, n)).length;

// Dampak bila tes disimpan final sekarang. Belum dinilai dihitung belum lulus.
export function diagnosticOutcome(level, answers = {}) {
  const passed = ACADEMIC.filter(n => statusOf(answers, n) === 'lulus');
  const first = ACADEMIC.find(n => statusOf(answers, n) !== 'lulus');
  const complete = !first && level === 8;
  return {
    passed,
    startLevel: first ? level : Math.min(level + 1, 8),
    startIndicator: first || (complete ? null : 1),
    complete,
    character: statusOf(answers, CHARACTER)
  };
}
