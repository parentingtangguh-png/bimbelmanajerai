// Application state and the small readers over it. No DOM, no network: anything here can be
// used by any screen without dragging the rest of the app along.
import { localDate, minutesBetween, durationPattern, formatTime } from './domain.js';
export const ORG_NAME = 'Rumah Belajar Rainbow Kids Alfatih';

export const initialState = () => ({
  user: null,
  role: 'teacher',
  name: '',
  view: 'dashboard',
  students: [],
  classes: [],
  records: [],
  competencies: [],
  assessments: [],
  observations: [],
  indicatorChecks: [],
  alerts: [],
  members: [],
  assignments: [],
  profiles: [],
  themes: [],
  curriculum: [],
  active: null,
  filter: '',
  schedules: [],
  scheduleStudents: [],
  curriculumTab: 'strand',
  curriculumSubject: 'reading',
  curriculumPhase: 'all',
  // The class list keeps every session ever taught. Only the latest are shown until asked.
  allSessions: false
});
export const RECENT_SESSIONS = 10;
export const state = initialState();
export const icons = { dashboard: '◫', students: '◉', sessions: '▤', team: '♧', curriculum: '▥' };
export const labels = {
  dashboard: 'Ringkasan',
  students: 'Data siswa',
  sessions: 'Ruang kelas',
  team: 'Tim pengajar',
  curriculum: 'Kurikulum'
};
export const subjects = ['listening', 'speaking', 'reading', 'writing', 'math', 'ipas', 'english'];
export const coreSubjects = ['listening', 'speaking', 'reading', 'writing', 'math', 'ipas'];
export const subjectLabels = {
  listening: 'Menyimak',
  speaking: 'Berbicara',
  reading: 'Membaca',
  writing: 'Menulis',
  math: 'Matematika',
  ipas: 'IPAS',
  english: 'English Exposure'
};
// Shown to teachers on every screen, every day. The old banner explained how to start, which stopped
// being true once teachers began adding their own students; its purpose now is empathy and
// responsibility. One line per day, picked by the date, so every teacher sees the same one and it
// never flickers between renders.
export const reminders = [
  [
    'Anak yang lambat hari ini bukan anak yang gagal.',
    'Ia sedang berada di anak tangga yang berbeda, bukan di tangga yang salah.'
  ],
  [
    'Catatan yang jujur lebih berharga daripada catatan yang indah.',
    'Yang kita tulis hari ini menjadi dasar keputusan esok hari.'
  ],
  [
    'Sebelum menilai anak, tanyakan dulu pada diri sendiri:',
    'apakah ia sudah pernah diajari dengan cara yang ia pahami?'
  ],
  ['Anak membaca wajah kita lebih dulu,', 'baru kemudian kata-kata kita.'],
  ['“Belum saya periksa” adalah jawaban yang terhormat', '— bagi anak, dan bagi kita.'],
  ['Satu anak yang merasa didampingi saat belajar', 'lebih berarti daripada sepuluh lembar latihan.'],
  [
    'Rapor yang kita kirim akan dibaca orang tuanya berkali-kali.',
    'Tulis yang benar, dengan cara yang menguatkan.'
  ],
  [
    'Kemajuan kecil tetap kemajuan.',
    'Tugas kita memastikan kemajuan itu benar-benar terjadi, bukan sekadar terlihat.'
  ]
];
export const reminderOfTheDay = () =>
  reminders[Math.floor(Date.parse(localDate()) / 86400000) % reminders.length];
export const characterLabels = {
  kemandirian: 'Kemandirian',
  tanggung_jawab: 'Tanggung jawab',
  kerja_sama: 'Kerja sama',
  kepedulian: 'Kepedulian',
  komunikasi_santun: 'Komunikasi santun'
};
export const studentFor = r => state.students.find(s => s.id === r.student_id);
export const competenciesFor = id => state.competencies.filter(c => c.student_id === id);
export const assessmentsFor = id => state.assessments.filter(a => a.session_student_id === id);
// Ticks saved for this record, and what the same child already showed at the same level before.
export const checksFor = id => state.indicatorChecks.filter(c => c.session_student_id === id);
export const priorChecks = (record, subject, level) => {
  const mine = new Set(
    state.records
      .filter(r => r.student_id === record.student_id && r.id !== record.id && r.finalized_at)
      .map(r => r.id)
  );
  return state.indicatorChecks.filter(
    c => mine.has(c.session_student_id) && c.subject === subject && c.level_snapshot === level
  );
};
// One wording for the suggestion, used both when the card is drawn and when a box is ticked.
export const hintText = (done, total, key, keyDone) =>
  done === 0
    ? 'Centang indikator yang terlihat hari ini untuk melihat saran penilaian. Saran, bukan keputusan.'
    : `<strong>${done} dari ${total} tercapai → saran: ${done === total ? 'T (Tercapai)' : 'MB (Mulai Berkembang)'}.</strong>` +
      (key && !keyDone
        ? ` ★ Indikator ${key} adalah simpul menuju level berikutnya, jadi anak belum dapat naik.`
        : '') +
      ' Saran, bukan keputusan. Penilaian tetap di tangan guru.';
// Only a child's newest saved evaluation can be corrected: reopening an older one would restore a
// snapshot taken before everything recorded since. The same rule is enforced in the database.
export const canReopen = record => {
  if (!record.finalized_at) return false;
  const s = state.students.find(x => x.id === record.student_id);
  if (s?.status === 'Lulus') return false;
  return !state.records.some(
    o =>
      o.student_id === record.student_id &&
      (o.finalized_at === null || (o.id !== record.id && o.finalized_at > record.finalized_at))
  );
};
export const observationFor = id =>
  state.observations.find(o => o.session_student_id === id) || {
    english_rating: null,
    english_note: '',
    character_dimensions: [],
    character_note: ''
  };
export const activeCompetenciesFor = id =>
  competenciesFor(id).filter(c => c.active !== false && subjects.includes(c.subject));
export const ready = s => {
  const rows = activeCompetenciesFor(s.id).filter(c => c.required);
  return rows.length
    ? rows.every(c => c.current_level >= c.target)
    : s.reading_level >= s.reading_target && s.math_level >= s.math_target;
};
export const timeLabel = x => (x?.start_time ? `${formatTime(x.start_time)}–${formatTime(x.end_time)}` : '');
export const scheduleMembers = id =>
  new Set(state.scheduleStudents.filter(x => x.schedule_id === id).map(x => x.student_id));
export function durationText(start, end) {
  if (!start || !end) return 'Isi jam mulai dan jam selesai.';
  const mins = minutesBetween(start, end);
  if (mins < 30 || mins > 180) return 'Durasi harus 30–180 menit.';
  return `${mins} menit · kelas memakai pola ${durationPattern(mins)} menit.`;
}
export function areaProgress(s, codes) {
  const rows = activeCompetenciesFor(s.id).filter(c => codes.includes(c.subject));
  if (!rows.length) return null;
  return {
    baseline: Math.round(rows.reduce((n, c) => n + c.baseline, 0) / rows.length),
    current: Math.round(rows.reduce((n, c) => n + c.current_level, 0) / rows.length),
    target: Math.round(rows.reduce((n, c) => n + c.target, 0) / rows.length)
  };
}
export function indicatorsOf(c, k) {
  const v = c && c[`${k}_indicators`];
  if (Array.isArray(v)) return v.filter(x => typeof x === 'string' && x.trim());
  if (typeof v === 'string' && v.trim()) {
    try {
      const parsed = JSON.parse(v);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}
export const phaseOf = level =>
  level <= 4
    ? 'Fondasi (belum SD)'
    : level <= 8
      ? 'Fase A · SD 1–2'
      : level <= 12
        ? 'Fase B · SD 3–4'
        : 'Fase C · SD 5–6';
export const phaseShort = level =>
  level <= 4 ? 'Fondasi' : level <= 8 ? 'Fase A' : level <= 12 ? 'Fase B' : 'Fase C';
// Targets flow per phase: each competency aims at the end of its current phase (4, 8, 12, 16).
export const phaseEnd = level => Math.min(16, Math.ceil(Math.max(1, Number(level) || 1) / 4) * 4);
export const phasePct = level => (((Math.max(1, Number(level) || 1) - 1) % 4) + 1) * 25;
// Suggested starting level per school grade; levels are competency positions, so teachers may adjust.
export const startPresets = { fondasi: 1, sd1: 5, sd2: 7, sd3: 9, sd4: 11, sd5: 13, sd6: 15 };
export const levelOptions = [...Array(16)].map((_, i) => [
  String(i + 1),
  `Level ${i + 1} · ${phaseOf(i + 1)}`
]);
