// Ruang kelas pilot. Jadwal hanya berisi tema, nomor pertemuan (otomatis), tanggal, dan jam. Siswa tidak
// terikat jadwal: saat kelas guru membuka jadwal, memilih siswa yang datang, indikator tiap siswa, dan
// Lulus/Belum; bisa disimpan sementara, lalu ditandai selesai (final dan terkunci).
import { state, testFor, suggestedIndicator } from '../state.js';
import { heading, empty, field, select } from '../ui.js';
import { escapeHtml as h, localDate } from '../domain.js';

export const MEETINGS = 192;

export function sessionsView() {
  const teacher = state.role === 'teacher';
  const button = teacher ? '<button class="primary" data-action="new-schedule">＋ Buat jadwal</button>' : '';
  const intro = heading('RUANG KELAS', 'Jadwal pertemuan.', '', button);
  if (!state.classSchedules.length)
    return (
      intro +
      empty(
        'Belum ada jadwal',
        teacher
          ? 'Buat jadwal: tema, tanggal, dan jam. Siswa dipilih saat kelas berlangsung.'
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
  const teacher = state.role === 'teacher';
  // Hanya jadwal terakhir yang bisa dihapus, supaya nomor pertemuan tidak berlubang.
  const last = c.meeting_number === Math.max(...state.classSchedules.map(x => x.meeting_number));
  const remove = last
    ? `<button type="button" class="secondary" data-action="delete-schedule" data-id="${c.id}">Hapus</button>`
    : '';
  const actions = c.completed_at
    ? `<div class="button-row"><button type="button" class="secondary" data-action="open-schedule" data-id="${c.id}">Lihat</button></div>`
    : teacher
      ? `<div class="button-row"><button type="button" class="primary" data-action="open-schedule" data-id="${c.id}">Buka</button><button type="button" class="secondary" data-action="edit-schedule" data-id="${c.id}">Ubah</button>${remove}</div>`
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

// Nilai lembar pertemuan dari yang tersimpan (sementara atau final).
export function meetingValues(id) {
  const rows = rowsOf(id);
  const v = { students: rows.map(r => r.student_id) };
  for (const r of rows) {
    v[`indicator_${r.student_id}`] = String(r.indicator_number);
    if (r.result) v[`r_${r.student_id}`] = r.result;
  }
  return v;
}

// Untuk setiap siswa terpilih: dropdown indikator dari levelnya (saran = terkecil yang belum lulus) dan Lulus/Belum.
export function meetingRows(picked, v = {}) {
  const rows = state.students
    .filter(s => picked.has(s.id) && ready(s))
    .map(s => {
      const items = state.curriculumIndicators
        .filter(i => i.level === Number(s.pilot_level))
        .sort((a, b) => a.number - b.number)
        .map(i => [String(i.number), `${i.number}. ${i.text}`]);
      const name = `indicator_${s.id}`;
      const chosen = items.some(([n]) => n === String(v[name]))
        ? String(v[name])
        : String(suggestedIndicator(s) ?? items[0]?.[0] ?? '');
      const options = RESULTS.map(
        ([value, label]) =>
          `<label class="diagnostic-rating"><input type="radio" name="r_${s.id}" value="${value}" ${v[`r_${s.id}`] === value ? 'checked' : ''}><span>${label}</span></label>`
      ).join('');
      return `<fieldset class="diagnostic-task"><legend>${h(s.name)} · Level ${s.pilot_level}</legend>${select('Indikator', name, items, chosen, 'required')}<div class="diagnostic-ratings">${options}</div></fieldset>`;
    })
    .join('');
  const body = rows || '<p class="muted">Pilih siswa yang hadir untuk menilai indikatornya.</p>';
  return `<div class="schedule-field" data-meeting-rows>${body}</div>`;
}

// Lembar pertemuan. Belum selesai: pilih siswa, indikator, Lulus/Belum; Simpan sementara atau Tandai selesai.
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
        return `<fieldset class="diagnostic-task"><legend>${h(s ? s.name : 'Siswa')} · Level ${x.level}</legend><p class="muted">${x.indicator_number}. ${h(ind ? ind.text : 'Indikator')}</p><p><strong>${label}</strong></p></fieldset>`;
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
  return `<form data-form="meeting" data-id="${h(id)}">${head}${kidBlock}${meetingRows(picked, values)}<p class="muted">Simpan sementara bisa diubah lagi. Setelah ditandai selesai, pertemuan dikunci.</p>${buttons}</form>`;
}

// Nomor pertemuan berikutnya untuk guru ini: satu setelah nomor terbesar di jadwalnya.
export function nextMeeting() {
  const max = Math.max(0, ...state.classSchedules.map(c => c.meeting_number));
  return Math.min(max + 1, MEETINGS);
}

// Nilai formulir jadwal tersimpan, untuk diubah.
export function scheduleValues(id) {
  const c = state.classSchedules.find(x => x.id === id);
  if (!c) return {};
  return {
    meeting: String(c.meeting_number),
    theme: String(c.theme_number),
    date: c.scheduled_date,
    time: c.scheduled_time ? String(c.scheduled_time).slice(0, 5) : ''
  };
}

// Tema yang berlaku untuk nomor pertemuan, sebagai pilihan awal dropdown tema.
export const themeForMeeting = n =>
  state.curriculumThemes.find(t => n >= t.first_meeting && n <= t.last_meeting);

// Formulir jadwal: tema, pertemuan (terkunci), tanggal, jam.
export function scheduleForm(v = {}, id = '') {
  const meeting = Number(v.meeting) || nextMeeting();
  const theme = v.theme ? String(v.theme) : String(themeForMeeting(meeting)?.number || '');
  const meetings = Array.from({ length: MEETINGS }, (_, i) => [String(i + 1), `Pertemuan ${i + 1}`]);
  const themes = [...state.curriculumThemes]
    .sort((a, b) => a.number - b.number)
    .map(t => [
      String(t.number),
      `Tema ${t.number} — ${t.name} (pertemuan ${t.first_meeting}–${t.last_meeting})`
    ]);
  return `<form data-form="schedule"${id ? ` data-id="${h(id)}"` : ''}>
${select('Tema', 'theme', themes, theme, 'required')}
${select('Pertemuan', 'meeting', meetings, String(meeting), 'disabled')}
<p class="muted schedule-cp">Nomor pertemuan otomatis dan berurutan.</p>
${field('Tanggal', 'date', 'date', v.date || localDate(), 'required')}
${field('Jam', 'time', 'time', v.time || '', '')}
<p class="muted">Siswa, indikator, dan hasil dipilih saat kelas lewat tombol Buka.</p>
<button class="primary full">Simpan jadwal</button></form>`;
}
