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
  curriculumPhases: [],
  curriculumLevels: [],
  curriculumIndicators: [],
  curriculumThemes: [],
  active: null,
  filter: '',
  schedules: [],
  scheduleStudents: [],
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
// Menu utama di layar HP membawa dua teks berganti. Keduanya konstanta di sini, bukan di view,
// karena view hanya menyusun HTML.
export const slogans = [
  'Amanah yang dijaga melahirkan nilai,<br>nilai yang nyata menumbuhkan kepercayaan.',
  'Dipercaya satu keluarga hari ini,<br>karena amanah kemarin ditunaikan.',
  'Nilai anak bukan angka semata,<br>itu amanah yang sedang kita jawab.',
  'Kepercayaan datang perlahan,<br>dari amanah yang ditepati berulang kali.',
  'Mengajar dengan amanah,<br>menilai dengan jujur, dipercaya selamanya.',
  'Yang orang tua titipkan adalah anaknya,<br>yang mereka nilai adalah kesungguhan kita.',
  'Amanah kecil hari ini<br>adalah kepercayaan besar tahun depan.',
  'Jaga amanahnya, rawat nilainya,<br>kepercayaan akan menemukan jalannya.'
];
// Satu slogan per potongan 30 menit, dipilih dari nomor potongannya, bukan Math.random(): layar
// yang dibuka berkali-kali dalam setengah jam yang sama menampilkan kalimat yang sama.
export const sloganOfTheMoment = (now = Date.now()) =>
  slogans[Math.abs((Math.sin(Math.floor(now / 1800000)) * 10000) | 0) % slogans.length];
// [arab, arti, sumber]
export const doas = [
  [
    'رَبِّ زِدْنِي عِلْمًا وَارْزُقْنِي فَهْمًا',
    'Ya Tuhanku, tambahkanlah ilmu kepadaku dan karuniakanlah aku pemahaman.',
    'Doa sebelum mengajar'
  ],
  [
    'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي',
    'Ya Tuhanku, lapangkanlah dadaku dan mudahkanlah urusanku.',
    'QS. Thaha: 25–26'
  ],
  [
    'وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي يَفْقَهُوا قَوْلِي',
    'Lepaskanlah kekakuan lidahku, supaya mereka mengerti perkataanku.',
    'QS. Thaha: 27–28'
  ],
  [
    'اللَّهُمَّ انْفَعْنِي بِمَا عَلَّمْتَنِي وَعَلِّمْنِي مَا يَنْفَعُنِي',
    'Ya Allah, berilah manfaat atas apa yang Engkau ajarkan kepadaku, dan ajarkanlah aku apa yang bermanfaat bagiku.',
    'HR. Tirmidzi'
  ],
  [
    'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ',
    'Ya Tuhan kami, jadikanlah anak keturunan kami penyejuk mata.',
    'QS. Al-Furqan: 74'
  ],
  [
    'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
    'Ya Allah, tolonglah aku untuk mengingat-Mu, bersyukur kepada-Mu, dan beribadah dengan baik kepada-Mu.',
    'HR. Abu Dawud'
  ],
  [
    'اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا',
    'Ya Allah, berkahilah kami pada apa yang Engkau rezekikan kepada kami.',
    'Doa keberkahan rezeki'
  ]
];
// Doa berganti sekali sehari, seperti reminderOfTheDay: satu doa layak ditemani sepanjang hari.
export const doaOfTheDay = () => doas[Math.floor(Date.parse(localDate()) / 86400000) % doas.length];
// Kunci layar untuk kartu menu utama. Namanya diambil dari sini, bukan ditulis ulang di view,
// supaya scripts/check-imports.mjs tidak salah mengira 'dashboard' adalah fungsi yang lupa diimpor.
export const homeKeys = {
  kelas: 'sessions',
  ringkasan: 'dashboard',
  siswa: 'students',
  kurikulum: 'curriculum',
  tim: 'team'
};
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
// Kelas formal anak di sekolahnya. Urutan dan ejaannya sama dengan check di database.
export const schoolGrades = ['Belum sekolah', 'TK A', 'TK B', 'SD 1', 'SD 2', 'SD 3', 'SD 4', 'SD 5', 'SD 6'];
// Kelas formal menunjuk perkiraan titik awal di Tes Diagnostik, supaya guru tidak memilih dua kali.
export const gradePhase = grade =>
  /^SD [1-6]$/.test(grade)
    ? 'sd' + grade.slice(3)
    : schoolGrades.slice(0, 3).includes(grade)
      ? 'fondasi'
      : '';
// Tahun ajaran berganti setiap Juli, dihitung di zona waktu bimbel.
export function schoolYearOf(now = new Date()) {
  const [y, m] = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: 'numeric'
  })
    .formatToParts(now)
    .filter(x => x.type !== 'literal')
    .map(x => Number(x.value));
  return m >= 7 ? `${y}/${y + 1}` : `${y - 1}/${y}`;
}
// Usia tidak disimpan: dihitung dari tanggal lahir supaya tidak pernah basi.
export function ageText(birth, now = new Date()) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(birth || ''));
  if (!m) return '';
  const [by, bm, bd] = m.slice(1).map(Number);
  let months = (now.getFullYear() - by) * 12 + (now.getMonth() + 1 - bm);
  if (now.getDate() < bd) months--;
  if (months < 0) return '';
  const years = Math.floor(months / 12);
  const rest = months % 12;
  return years ? `${years} tahun${rest ? ` ${rest} bulan` : ''}` : `${rest} bulan`;
}
export const levelOptions = [...Array(16)].map((_, i) => [
  String(i + 1),
  `Level ${i + 1} · ${phaseOf(i + 1)}`
]);
