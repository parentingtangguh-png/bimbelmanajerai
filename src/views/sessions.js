// Ruang kelas pilot. Guru hanya menentukan tanggal/jam jadwal, siswa yang hadir, dan Lulus/Belum.
// Nomor pertemuan, tema, level, dan indikator otomatis (dijaga save_schedule dan save_meeting).
// Hanya satu jadwal terbuka; bisa disimpan sementara, lalu ditandai selesai (final, tanpa koreksi).
import { state, testFor, suggestedIndicator, readyToLevelUp } from '../state.js';
import { heading, empty, field } from '../ui.js';
import { escapeHtml as h, localDate } from '../domain.js';

export const MEETINGS = 192;

const openSchedule = () => state.classSchedules.find(c => !c.completed_at);

export function sessionsView() {
  const teacher = state.role === 'teacher';
  const open = openSchedule();
  const button =
    teacher && !open && nextMeeting() <= MEETINGS
      ? '<button class="primary" data-action="new-schedule">＋ Buat jadwal</button>'
      : '';
  const intro = heading('RUANG KELAS', 'Jadwal pertemuan.', '', button);
  if (!state.classSchedules.length)
    return (
      intro +
      empty(
        'Belum ada jadwal',
        teacher
          ? 'Buat jadwal cukup dengan tanggal dan jam. Pertemuan, tema, dan indikator siswa berjalan otomatis.'
          : 'Jadwal dibuat oleh guru pengajar.'
      )
    );
  const byDate = (a, b) =>
    `${a.scheduled_date} ${a.scheduled_time || ''}`.localeCompare(
      `${b.scheduled_date} ${b.scheduled_time || ''}`
    );
  const upcoming = state.classSchedules.filter(c => !c.completed_at).sort(byDate);
  const done = state.classSchedules.filter(c => c.completed_at).sort((a, b) => byDate(b, a));
  const section = (title, list, emptyText) =>
    `<section class="schedule-section"><h3>${title}</h3>${list.length ? list.map(scheduleCard).join('') : `<p class="muted">${emptyText}</p>`}</section>`;
  return `${intro}${section('Akan datang', upcoming, 'Tidak ada jadwal yang akan datang.')}${section('Selesai', done, 'Belum ada pertemuan yang selesai.')}`;
}

const dateText = d =>
  new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date(`${d}T00:00:00`));

const rowsOf = id => state.classScheduleStudents.filter(x => x.schedule_id === id);

function scheduleHead(c) {
  const theme = state.curriculumThemes.find(t => t.number === c.theme_number);
  const time = c.scheduled_time ? ` · ${h(String(c.scheduled_time).slice(0, 5))}` : '';
  return { time, theme: `Tema ${c.theme_number}${theme ? ` — ${h(theme.name)}` : ''}` };
}

export function scheduleCard(c) {
  const { time, theme } = scheduleHead(c);
  const kids = rowsOf(c.id);
  const names = kids
    .map(k => state.students.find(s => s.id === k.student_id))
    .filter(Boolean)
    .map(s => h(s.nickname || s.name))
    .join(', ');
  const who = kids.length
    ? `${kids.length} siswa${c.completed_at ? '' : ' (sementara)'}`
    : 'siswa dipilih saat kelas';
  const actions = c.completed_at
    ? `<div class="button-row"><button type="button" class="secondary" data-action="open-schedule" data-id="${c.id}">Lihat</button></div>`
    : state.role === 'teacher'
      ? `<div class="button-row"><button type="button" class="primary" data-action="open-schedule" data-id="${c.id}">Buka</button><button type="button" class="secondary" data-action="edit-schedule" data-id="${c.id}">Ubah</button><button type="button" class="secondary" data-action="delete-schedule" data-id="${c.id}">Hapus</button></div><p class="muted">Jadwal berikutnya bisa dibuat setelah pertemuan ini ditandai selesai.</p>`
      : '';
  return `<article class="panel schedule-card"><strong>${h(dateText(c.scheduled_date))}${time} · Pertemuan ${c.meeting_number}</strong><p>${theme} · ${who}</p>${names ? `<p class="muted">${names}</p>` : ''}${actions}</article>`;
}

export const RESULTS = [
  ['lulus', 'Lulus'],
  ['belum', 'Belum']
];

// Siswa yang bisa ikut kelas: aktif dan sudah punya level dari tes diagnostik.
const ready = s => s.status === 'Aktif' && !!testFor(s.id) && !!s.pilot_level;

// Teks ringkas dropdown siswa: nama siswa terpilih, atau ajakan memilih.
export function kidsSummary(ids) {
  const names = state.students.filter(s => new Set(ids).has(s.id)).map(s => s.nickname || s.name);
  return names.length ? `${names.length} siswa: ${names.join(', ')}` : 'Pilih siswa yang hadir…';
}

// Nilai lembar pertemuan dari yang tersimpan sementara.
export function meetingValues(id) {
  const rows = rowsOf(id);
  const v = { students: rows.map(r => r.student_id) };
  for (const r of rows) if (r.result) v[`r_${r.student_id}`] = r.result;
  return v;
}

// Untuk setiap siswa terpilih: level dan indikatornya saat ini (otomatis) serta Lulus/Belum.
export function meetingRows(picked, v = {}) {
  const rows = state.students
    .filter(s => picked.has(s.id) && ready(s))
    .map(s => {
      const n = suggestedIndicator(s);
      const ind = state.curriculumIndicators.find(i => i.level === Number(s.pilot_level) && i.number === n);
      const ripe = readyToLevelUp(s)
        ? '<p><span class="badge green">Indikator 1–6 sudah lulus — siap naik</span></p>'
        : '';
      const options = RESULTS.map(
        ([value, label]) =>
          `<label class="diagnostic-rating"><input type="radio" name="r_${s.id}" value="${value}" ${v[`r_${s.id}`] === value ? 'checked' : ''}><span>${label}</span></label>`
      ).join('');
      return `<fieldset class="diagnostic-task"><legend>${h(s.name)} · Level ${s.pilot_level}</legend><p class="muted">Indikator ${n}. ${h(ind ? ind.text : '')}</p>${ripe}<div class="diagnostic-ratings">${options}</div></fieldset>`;
    })
    .join('');
  const body = rows || '<p class="muted">Pilih siswa yang hadir untuk menilai indikatornya.</p>';
  return `<div class="schedule-field" data-meeting-rows>${body}</div>`;
}

// Lembar pertemuan. Belum selesai: pilih siswa hadir dan Lulus/Belum; Simpan sementara atau Tandai selesai.
// Sudah selesai: hanya ditampilkan.
export function meetingSheet(id, v = null) {
  const c = state.classSchedules.find(x => x.id === id);
  if (!c) return '<p class="muted">Jadwal tidak ditemukan.</p>';
  const { time, theme } = scheduleHead(c);
  const head = `<p class="muted">${h(dateText(c.scheduled_date))}${time} · Pertemuan ${c.meeting_number} · ${theme}</p>`;
  if (c.completed_at || state.role !== 'teacher') {
    const list = rowsOf(id)
      .map(x => {
        const s = state.students.find(y => y.id === x.student_id);
        const ind = state.curriculumIndicators.find(
          i => i.level === x.level && i.number === x.indicator_number
        );
        const label = (RESULTS.find(r => r[0] === x.result) || [])[1] || '—';
        return `<fieldset class="diagnostic-task"><legend>${h(s ? s.name : 'Siswa')} · Level ${x.level}</legend><p class="muted">Indikator ${x.indicator_number}. ${h(ind ? ind.text : '')}</p><p><strong>${label}</strong></p></fieldset>`;
      })
      .join('');
    const status = c.completed_at ? '' : '<p class="muted">Pertemuan belum selesai.</p>';
    return `${head}${status}${list || '<p class="muted">Belum ada siswa.</p>'}`;
  }
  const values = v || meetingValues(id);
  const picked = new Set([].concat(values.students || []));
  const kids = state.students
    .filter(s => s.status === 'Aktif')
    .map(s => {
      const tag = ready(s) ? `Level ${s.pilot_level}` : 'Belum tes diagnostik';
      return `<label class="schedule-kid"><input type="checkbox" name="students" value="${s.id}" ${picked.has(s.id) ? 'checked' : ''} ${ready(s) ? '' : 'disabled'}><span>${h(s.name)} <small class="muted">${tag}</small></span></label>`;
    })
    .join('');
  const kidBlock = kids
    ? `<div class="schedule-field"><span class="schedule-label">Siswa yang hadir</span><details class="schedule-kids"><summary data-kids-summary>${h(kidsSummary(picked))}</summary><div class="schedule-kids-list">${kids}</div></details></div>`
    : '<p class="muted">Belum ada siswa aktif.</p>';
  const buttons = `<div class="button-row"><button class="secondary" name="finish" value="0">Simpan sementara</button><button class="primary" name="finish" value="1">Tandai pertemuan selesai</button></div>`;
  return `<form data-form="meeting" data-id="${h(id)}">${head}${kidBlock}${meetingRows(picked, values)}<p class="muted">Simpan sementara bisa diubah lagi. Setelah ditandai selesai, pertemuan dikunci dan indikator siswa yang lulus berganti otomatis.</p>${buttons}</form>`;
}

// Nomor pertemuan berikutnya untuk guru ini: satu setelah nomor terbesar di jadwalnya.
export function nextMeeting() {
  return Math.max(0, ...state.classSchedules.map(c => c.meeting_number)) + 1;
}

// Nilai formulir jadwal tersimpan, untuk diubah.
export function scheduleValues(id) {
  const c = state.classSchedules.find(x => x.id === id);
  if (!c) return {};
  return {
    meeting: c.meeting_number,
    date: c.scheduled_date,
    time: c.scheduled_time ? String(c.scheduled_time).slice(0, 5) : ''
  };
}

// Tema yang berlaku untuk nomor pertemuan.
export const themeForMeeting = n =>
  state.curriculumThemes.find(t => n >= t.first_meeting && n <= t.last_meeting);

// Formulir jadwal: hanya tanggal dan jam; pertemuan dan tema ditampilkan sebagai keterangan.
export function scheduleForm(v = {}, id = '') {
  const meeting = Number(v.meeting) || nextMeeting();
  const t = themeForMeeting(meeting);
  const info = `<p class="schedule-auto"><strong>Pertemuan ${meeting}</strong> · ${t ? `Tema ${t.number} — ${h(t.name)}` : 'Tema belum tersedia'}</p><p class="muted">Pertemuan, tema, dan indikator siswa berjalan otomatis.</p>`;
  return `<form data-form="schedule"${id ? ` data-id="${h(id)}"` : ''}>
${info}
${field('Tanggal', 'date', 'date', v.date || localDate(), 'required')}
${field('Jam', 'time', 'time', v.time || '', '')}
<button class="primary full">Simpan jadwal</button></form>`;
}
