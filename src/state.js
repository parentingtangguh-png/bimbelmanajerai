// Application state and the small readers over it. No DOM, no network: anything here can be
// used by any screen without dragging the rest of the app along.
import { localDate } from './domain.js';
export const ORG_NAME = 'Rumah Belajar Rainbow Kids Alfatih';

export const initialState = () => ({
  user: null,
  role: 'teacher',
  name: '',
  view: 'dashboard',
  filter: '',
  students: [],
  members: [],
  assignments: [],
  profiles: [],
  curriculumPhases: [],
  curriculumLevels: [],
  curriculumIndicators: [],
  curriculumThemes: [],
  // Kurikulum 8 level (tabel k8_*), dibangkitkan dari docs/curriculum/. Fase 1: hanya halaman Kurikulum.
  k8Cp: '',
  k8Levels: [],
  k8Indicators: [],
  k8Notes: [],
  k8Themes: [],
  k8Subthemes: [],
  k8English: [],
  diagnosticTests: [],
  diagnosticResults: [],
  // Jadwal kelas pilot dan siswa di tiap jadwal (level saat dijadwalkan + satu indikator).
  classSchedules: [],
  classScheduleStudents: [],
  // Anak yang lembar tes diagnostiknya sedang terbuka (id siswa); drafnya tersimpan di server.
  diagnostic: null
});
export const state = initialState();
export const icons = { dashboard: '◫', students: '◉', sessions: '▤', team: '♧', curriculum: '▥' };
export const labels = {
  dashboard: 'Ringkasan',
  students: 'Data siswa',
  sessions: 'Ruang kelas',
  team: 'Tim pengajar',
  curriculum: 'Kurikulum'
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
// Tes diagnostik anak (draf atau final), bila sudah dimulai. "Sudah dites" = tesnya sudah final.
export const testFor = id => state.diagnosticTests.find(t => t.student_id === id);
export const finalTestFor = id => {
  const t = testFor(id);
  return t?.finalized_at ? t : null;
};

// Nomor indikator (1–14) yang sudah Lulus pada satu level: dari sesi selesai dan tes diagnostik final level
// itu. passed_numbers di database menghitung hal yang sama; ini hanya untuk ditampilkan.
export function passedIndicators(studentId, level) {
  const done = new Set(state.classSchedules.filter(c => c.completed_at).map(c => c.id));
  const lv = Number(level);
  const passed = new Set();
  for (const x of state.classScheduleStudents) {
    if (x.student_id !== studentId || x.level !== lv || !done.has(x.schedule_id)) continue;
    if (x.result === 'lulus') passed.add(x.indicator_number);
    if (x.english_result === 'lulus') passed.add(13);
    if (x.character_result === 'lulus') passed.add(14);
  }
  const test = finalTestFor(studentId);
  if (test && test.tested_level === lv)
    for (const r of state.diagnosticResults)
      if (r.test_id === test.id && r.status === 'lulus') passed.add(r.number);
  return [...passed].sort((a, b) => a - b);
}

// Antrean akademik; English (13) dan Karakter (14) tidak termasuk.
export const QUEUE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

// Indikator akademik aktif: terkecil yang belum Lulus; null bila 12 sudah Lulus (siap naik / selesai).
export function suggestedIndicator(s) {
  if (!s.pilot_level) return null;
  const passed = new Set(passedIndicators(s.id, s.pilot_level));
  return QUEUE.find(n => !passed.has(n)) ?? null;
}
export const readyToLevelUp = s => !!s.pilot_level && suggestedIndicator(s) === null;

// Tema dan subtema kurikulum 8 level untuk nomor pertemuan.
export const k8ThemeFor = n => state.k8Themes.find(t => n >= t.first_meeting && n <= t.last_meeting);
export const k8SubthemeFor = n => state.k8Subthemes.find(t => n >= t.first_meeting && n <= t.last_meeting);

// English L1, L4, L7 memakai ungkapan/warna tetap; level lain butuh hadir 3 pertemuan (hari) dalam satu
// tema, termasuk pertemuan sesi ini. Sama dengan pemeriksaan di save_meeting.
export const FIXED_ENGLISH_LEVELS = [1, 4, 7];
export function englishReady(s, c) {
  if (FIXED_ENGLISH_LEVELS.includes(Number(s.pilot_level))) return true;
  const done = new Set(state.classSchedules.filter(x => x.completed_at).map(x => x.id));
  const days = {};
  for (const x of state.classScheduleStudents) {
    const sc = state.classSchedules.find(y => y.id === x.schedule_id);
    if (x.student_id !== s.id || !done.has(x.schedule_id) || sc.scheduled_date >= c.scheduled_date) continue;
    (days[sc.theme_number] ||= new Set()).add(sc.scheduled_date);
  }
  return state.k8Themes.some(
    t =>
      t.number <= c.theme_number && (days[t.number]?.size || 0) + (t.number === c.theme_number ? 1 : 0) >= 3
  );
}
// Ringkasan tes untuk daftar dan profil, diturunkan dari baris tes.
export function testStatus(test) {
  if (!test) return '';
  if (!test.finalized_at) return `Tes Level ${test.tested_level} belum final`;
  if (test.curriculum_complete) return `Dites Level ${test.tested_level} · kurikulum selesai`;
  return `Dites Level ${test.tested_level} · mulai Level ${test.start_level} indikator ${test.start_indicator}`;
}
// Nama level dari kurikulum 8 level, misalnya "Level 3 — Merangkai Awal".
export function levelName(level) {
  if (!level) return 'Level belum ditentukan';
  const lv = state.k8Levels.find(x => x.level === Number(level));
  return `Level ${level}${lv ? ` — ${lv.title}` : ''}`;
}
// Kelas formal anak di sekolahnya. Urutan dan ejaannya sama dengan check di database.
export const schoolGrades = ['Belum sekolah', 'TK A', 'TK B', 'SD 1', 'SD 2', 'SD 3', 'SD 4', 'SD 5', 'SD 6'];
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
