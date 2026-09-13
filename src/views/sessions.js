// Ruang kelas pilot. Pertemuan dihitung per hari mengajar: satu hari bisa punya beberapa sesi yang berbagi
// nomor pertemuan dan tema. Guru hanya mengisi tanggal/jam sesi, memilih siswa yang hadir (satu anak satu
// sesi per hari), dan Lulus/Belum. Nomor pertemuan, tema, level, dan indikator otomatis (dijaga
// save_schedule dan save_meeting). Hari berikutnya baru bisa dijadwalkan setelah semua sesi hari terakhir
// selesai. Tiap sesi bisa disimpan sementara, lalu ditandai selesai (final, tanpa koreksi).
import { state, testFor, suggestedIndicator, readyToLevelUp } from '../state.js';
import { heading, empty, field } from '../ui.js';
import { escapeHtml as h, localDate } from '../domain.js';

export const MEETINGS = 192;

const dateText = d =>
  new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date(`${d}T00:00:00`));

const rowsOf = id => state.classScheduleStudents.filter(x => x.schedule_id === id);
const timeText = c => (c.scheduled_time ? String(c.scheduled_time).slice(0, 5) : '');
const lastNumber = () => Math.max(0, ...state.classSchedules.map(c => c.meeting_number));

// Sesi dalam satu pertemuan, urut menurut jam (tanpa jam di akhir), lalu waktu dibuat.
export function sessionsOf(number) {
  return state.classSchedules
    .filter(c => c.meeting_number === number)
    .sort(
      (a, b) =>
        (timeText(a) || '99').localeCompare(timeText(b) || '99') ||
        String(a.created_at || '').localeCompare(String(b.created_at || ''))
    );
}
export const sessionIndex = c => sessionsOf(c.meeting_number).findIndex(x => x.id === c.id) + 1;

function themeLabel(number) {
  const t = state.curriculumThemes.find(x => x.number === number);
  return `Tema ${number}${t ? ` — ${h(t.name)}` : ''}`;
}

export function sessionsView() {
  const teacher = state.role === 'teacher';
  const open = state.classSchedules.some(c => !c.completed_at);
  const button =
    teacher && !open && lastNumber() < MEETINGS
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
  const numbers = [...new Set(state.classSchedules.map(c => c.meeting_number))].sort((a, b) => b - a);
  const [latest, ...older] = numbers;
  const note = open
    ? '<p class="muted">Pertemuan berikutnya bisa dijadwalkan setelah semua sesi ditandai selesai.</p>'
    : '';
  const done = older.length
    ? older.map(dayCard).join('')
    : '<p class="muted">Belum ada pertemuan sebelumnya.</p>';
  return `${intro}<section class="schedule-section"><h3>Pertemuan terakhir</h3>${dayCard(latest)}${note}</section><section class="schedule-section"><h3>Sebelumnya</h3>${done}</section>`;
}

// Satu hari mengajar: tanggal, nomor pertemuan, tema, lalu daftar sesinya.
export function dayCard(number) {
  const list = sessionsOf(number);
  const first = list[0];
  const latest = number === lastNumber();
  const teacher = state.role === 'teacher';
  const add =
    teacher && latest
      ? `<div class="button-row"><button type="button" class="secondary" data-action="add-session" data-id="${first.id}">＋ Tambah sesi</button></div>`
      : '';
  return `<article class="panel schedule-card"><strong>${h(dateText(first.scheduled_date))} · Pertemuan ${number}</strong><p>${themeLabel(first.theme_number)}</p>${list.map(sessionRow).join('')}${add}</article>`;
}

export function sessionRow(c) {
  const kids = rowsOf(c.id);
  const names = kids
    .map(k => state.students.find(s => s.id === k.student_id))
    .filter(Boolean)
    .map(s => h(s.nickname || s.name))
    .join(', ');
  const status = c.completed_at
    ? `${kids.length} siswa · selesai`
    : kids.length
      ? `${kids.length} siswa (sementara)`
      : 'belum dimulai';
  const time = timeText(c) ? ` · ${h(timeText(c))}` : '';
  const teacher = state.role === 'teacher';
  const latest = c.meeting_number === lastNumber();
  const actions = c.completed_at
    ? `<button type="button" class="secondary" data-action="open-schedule" data-id="${c.id}">Lihat</button>`
    : teacher
      ? `<button type="button" class="primary" data-action="open-schedule" data-id="${c.id}">Buka</button><button type="button" class="secondary" data-action="edit-schedule" data-id="${c.id}">Ubah</button>${latest ? `<button type="button" class="secondary" data-action="delete-schedule" data-id="${c.id}">Hapus</button>` : ''}`
      : '';
  return `<div class="schedule-session"><p><strong>Sesi ${sessionIndex(c)}</strong>${time} · ${status}</p>${names ? `<p class="muted">${names}</p>` : ''}${actions ? `<div class="button-row">${actions}</div>` : ''}</div>`;
}

export const RESULTS = [
  ['lulus', 'Lulus'],
  ['belum', 'Belum']
];

// Siswa yang bisa ikut kelas: aktif dan sudah punya level dari tes diagnostik.
const ready = s => s.status === 'Aktif' && !!testFor(s.id) && !!s.pilot_level;

// Sesi lain di tanggal yang sama yang sudah memuat siswa ini (satu anak satu sesi per hari).
function otherSessionOf(studentId, c) {
  const other = state.classSchedules.find(
    x =>
      x.id !== c.id &&
      x.scheduled_date === c.scheduled_date &&
      rowsOf(x.id).some(r => r.student_id === studentId)
  );
  return other ? sessionIndex(other) : 0;
}

// Teks ringkas dropdown siswa: nama siswa terpilih, atau ajakan memilih.
export function kidsSummary(ids) {
  const names = state.students.filter(s => new Set(ids).has(s.id)).map(s => s.nickname || s.name);
  return names.length ? `${names.length} siswa: ${names.join(', ')}` : 'Pilih siswa yang hadir…';
}

// Nilai lembar sesi dari yang tersimpan sementara.
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

// Lembar sesi. Belum selesai: pilih siswa hadir dan Lulus/Belum; Simpan sementara atau Tandai selesai.
// Sudah selesai: hanya ditampilkan.
export function meetingSheet(id, v = null) {
  const c = state.classSchedules.find(x => x.id === id);
  if (!c) return '<p class="muted">Jadwal tidak ditemukan.</p>';
  const time = timeText(c) ? ` · ${h(timeText(c))}` : '';
  const head = `<p class="muted">${h(dateText(c.scheduled_date))} · Pertemuan ${c.meeting_number} · Sesi ${sessionIndex(c)}${time} · ${themeLabel(c.theme_number)}</p>`;
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
    const status = c.completed_at ? '' : '<p class="muted">Sesi belum selesai.</p>';
    return `${head}${status}${list || '<p class="muted">Belum ada siswa.</p>'}`;
  }
  const values = v || meetingValues(id);
  const picked = new Set([].concat(values.students || []));
  // Siswa yang sudah masuk sesi lain di tanggal yang sama disembunyikan (satu anak satu sesi per hari).
  const available = state.students.filter(s => s.status === 'Aktif' && !otherSessionOf(s.id, c));
  const hidden = state.students.filter(s => s.status === 'Aktif').length - available.length;
  const kids = available
    .map(s => {
      const tag = ready(s) ? `Level ${s.pilot_level}` : 'Belum tes diagnostik';
      return `<label class="schedule-kid"><input type="checkbox" name="students" value="${s.id}" ${picked.has(s.id) && ready(s) ? 'checked' : ''} ${ready(s) ? '' : 'disabled'}><span>${h(s.name)} <small class="muted">${tag}</small></span></label>`;
    })
    .join('');
  const hiddenNote = hidden
    ? `<p class="muted">${hidden} siswa sudah masuk sesi lain hari ini dan tidak ditampilkan.</p>`
    : '';
  const kidBlock = kids
    ? `<div class="schedule-field"><span class="schedule-label">Siswa yang hadir</span><details class="schedule-kids"><summary data-kids-summary>${h(kidsSummary(picked))}</summary><div class="schedule-kids-list">${kids}${hiddenNote}</div></details></div>`
    : '<p class="muted">Belum ada siswa aktif.</p>';
  const ids = state.students.filter(s => picked.has(s.id) && ready(s)).map(s => s.id);
  const { done, hint } = finishState(ids, values);
  const buttons = `<div class="button-row"><button class="secondary" name="finish" value="0">Simpan sementara</button><button class="primary" name="finish" value="1" data-finish ${done ? '' : 'disabled'}>Tandai sesi selesai</button></div><p class="muted" data-finish-hint>${hint}</p>`;
  return `<form data-form="meeting" data-id="${h(id)}">${head}${kidBlock}${meetingRows(picked, values)}<p class="muted">Simpan sementara bisa diubah lagi. Setelah ditandai selesai, sesi dikunci dan indikator siswa yang lulus berganti otomatis.</p>${buttons}</form>`;
}

// "Tandai sesi selesai" aktif hanya bila ada siswa hadir dan setiap siswa yang dicentang sudah Lulus/Belum.
export function finishState(ids, values = {}) {
  const missing = ids.filter(id => !values[`r_${id}`]).length;
  if (!ids.length) return { done: false, hint: 'Centang siswa yang hadir lebih dulu.' };
  if (missing) return { done: false, hint: `Beri Lulus/Belum untuk ${missing} siswa lagi.` };
  return { done: true, hint: 'Semua siswa sudah dinilai.' };
}

// Nomor pertemuan berikutnya (hari baru).
export const nextMeeting = () => lastNumber() + 1;

// Nilai formulir sesi tersimpan, untuk diubah.
export function scheduleValues(id) {
  const c = state.classSchedules.find(x => x.id === id);
  if (!c) return {};
  return { meeting: c.meeting_number, date: c.scheduled_date, time: timeText(c) };
}

// Tema yang berlaku untuk nomor pertemuan.
export const themeForMeeting = n =>
  state.curriculumThemes.find(t => n >= t.first_meeting && n <= t.last_meeting);

// Formulir sesi. Hari baru: tanggal + jam. Tambah sesi (v.date tetap): jam saja. Ubah: jam; tanggal hanya
// bila sesi itu satu-satunya di harinya.
export function scheduleForm(v = {}, id = '') {
  const meeting = Number(v.meeting) || nextMeeting();
  const t = themeForMeeting(meeting);
  const fixedDate = v.fixedDate || (id && sessionsOf(meeting).length > 1);
  const info = `<p class="schedule-auto"><strong>Pertemuan ${meeting}</strong> · ${t ? `Tema ${t.number} — ${h(t.name)}` : 'Tema belum tersedia'}</p><p class="muted">Pertemuan, tema, dan indikator siswa berjalan otomatis.</p>`;
  const date = fixedDate
    ? `<input type="hidden" name="date" value="${h(v.date)}"><p><strong>${h(dateText(v.date))}</strong></p>`
    : field('Tanggal', 'date', 'date', v.date || localDate(), 'required');
  return `<form data-form="schedule"${id ? ` data-id="${h(id)}"` : ''}>
${info}
${date}
${field('Jam', 'time', 'time', v.time || '', '')}
<button class="primary full">${v.fixedDate && !id ? 'Tambah sesi' : 'Simpan jadwal'}</button></form>`;
}
