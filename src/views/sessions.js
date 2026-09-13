// Ruang kelas pilot, tahap 1: jadwal pertemuan per guru — siswa, tema, indikator per siswa (dari level
// masing-masing), pertemuan, tanggal. Penandaan Lulus/Belum dan "pertemuan selesai" menyusul di tahap 2.
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
          ? 'Buat jadwal: pilih siswa, tema, indikator tiap siswa, dan pertemuan.'
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

export function scheduleCard(c) {
  const theme = state.curriculumThemes.find(t => t.number === c.theme_number);
  const kids = state.classScheduleStudents.filter(x => x.schedule_id === c.id);
  const time = c.scheduled_time ? ` · ${h(String(c.scheduled_time).slice(0, 5))}` : '';
  const names = kids
    .map(k => state.students.find(s => s.id === k.student_id))
    .filter(Boolean)
    .map(s => h(s.nickname || s.name))
    .join(', ');
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
  return `<article class="panel schedule-card"><strong>${h(dateText(c.scheduled_date))}${time} · Pertemuan ${c.meeting_number}</strong><p>Tema ${c.theme_number}${theme ? ` — ${h(theme.name)}` : ''} · ${kids.length} siswa</p>${names ? `<p class="muted">${names}</p>` : ''}${actions}</article>`;
}

export const RESULTS = [
  ['lulus', 'Lulus'],
  ['belum', 'Belum'],
  ['absen', 'Tidak hadir']
];

// Lembar pertemuan: saat kelas guru memberi setiap siswa Lulus / Belum / Tidak hadir lalu menandai selesai;
// pertemuan yang sudah selesai hanya ditampilkan.
export function meetingSheet(id) {
  const c = state.classSchedules.find(x => x.id === id);
  if (!c) return '<p class="muted">Jadwal tidak ditemukan.</p>';
  const theme = state.curriculumThemes.find(t => t.number === c.theme_number);
  const time = c.scheduled_time ? ` · ${h(String(c.scheduled_time).slice(0, 5))}` : '';
  const head = `<p class="muted">${h(dateText(c.scheduled_date))}${time} · Pertemuan ${c.meeting_number} · Tema ${c.theme_number}${theme ? ` — ${h(theme.name)}` : ''}</p>`;
  const open = !c.completed_at && state.role === 'teacher';
  const rows = state.classScheduleStudents
    .filter(x => x.schedule_id === id)
    .map(x => {
      const s = state.students.find(y => y.id === x.student_id);
      const ind = state.curriculumIndicators.find(
        i => i.level === x.level && i.number === x.indicator_number
      );
      const who = `<legend>${h(s ? s.name : 'Siswa')} · Level ${x.level}</legend><p class="muted">${x.indicator_number}. ${h(ind ? ind.text : 'Indikator')}</p>`;
      if (!open) {
        const label = (RESULTS.find(r => r[0] === x.result) || [])[1] || '—';
        return `<fieldset class="diagnostic-task">${who}<p><strong>${label}</strong></p></fieldset>`;
      }
      const options = RESULTS.map(
        ([value, label]) =>
          `<label class="diagnostic-rating"><input type="radio" name="r_${x.student_id}" value="${value}" required><span>${label}</span></label>`
      ).join('');
      return `<fieldset class="diagnostic-task">${who}<div class="diagnostic-ratings">${options}</div></fieldset>`;
    })
    .join('');
  const list = rows || '<p class="muted">Tidak ada siswa di jadwal ini.</p>';
  if (!open) return `${head}${list}`;
  return `<form data-form="complete" data-id="${h(id)}">${head}${list}<p class="muted">Setelah ditandai selesai, jadwal dikunci dan hasilnya tidak bisa diubah.</p><button class="primary full">Tandai pertemuan selesai</button></form>`;
}

// Nomor pertemuan berikutnya untuk guru ini: satu setelah nomor terbesar di jadwalnya.
export function nextMeeting() {
  const max = Math.max(0, ...state.classSchedules.map(c => c.meeting_number));
  return Math.min(max + 1, MEETINGS);
}

// Nilai formulir dari jadwal tersimpan, untuk diubah.
export function scheduleValues(id) {
  const c = state.classSchedules.find(x => x.id === id);
  if (!c) return {};
  const kids = state.classScheduleStudents.filter(x => x.schedule_id === id);
  const v = {
    meeting: String(c.meeting_number),
    theme: String(c.theme_number),
    date: c.scheduled_date,
    time: c.scheduled_time ? String(c.scheduled_time).slice(0, 5) : '',
    students: kids.map(k => k.student_id)
  };
  for (const k of kids) v[`indicator_${k.student_id}`] = String(k.indicator_number);
  return v;
}

// Tema yang berlaku untuk nomor pertemuan, sebagai pilihan awal dropdown tema.
export const themeForMeeting = n =>
  state.curriculumThemes.find(t => n >= t.first_meeting && n <= t.last_meeting);

// Siswa yang bisa dijadwalkan: aktif dan sudah punya level dari tes diagnostik.
const ready = s => s.status === 'Aktif' && !!testFor(s.id) && !!s.pilot_level;

// Teks ringkas dropdown siswa: nama siswa terpilih, atau ajakan memilih.
export function kidsSummary(ids) {
  const names = state.students.filter(s => new Set(ids).has(s.id)).map(s => s.nickname || s.name);
  return names.length ? `${names.length} siswa: ${names.join(', ')}` : 'Pilih siswa…';
}

// Satu dropdown indikator untuk setiap siswa terpilih, berisi indikator dari level siswa itu sendiri.
export function indicatorRows(picked, v = {}) {
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
      return select(`${h(s.name)} · Level ${s.pilot_level}`, name, items, chosen, 'required');
    })
    .join('');
  const body = rows || '<p class="muted">Indikator muncul setelah siswa dipilih.</p>';
  return `<div class="schedule-field" data-indicators><span class="schedule-label">Indikator</span>${body}</div>`;
}

// v: nilai formulir saat ini (dipakai ulang setiap pilihan berubah supaya bagian yang bergantung ikut diperbarui).
export function scheduleForm(v = {}, id = '') {
  const meeting = Number(v.meeting) || nextMeeting();
  const theme =
    v.changed === 'meeting' || !v.theme ? String(themeForMeeting(meeting)?.number || '') : String(v.theme);
  const picked = new Set([].concat(v.students || []));

  const meetings = Array.from({ length: MEETINGS }, (_, i) => [String(i + 1), `Pertemuan ${i + 1}`]);
  const themes = [...state.curriculumThemes]
    .sort((a, b) => a.number - b.number)
    .map(t => [
      String(t.number),
      `Tema ${t.number} — ${t.name} (pertemuan ${t.first_meeting}–${t.last_meeting})`
    ]);

  const kids = state.students
    .filter(s => s.status === 'Aktif')
    .map(s => {
      const tag = ready(s) ? `Level ${s.pilot_level}` : 'Belum tes diagnostik';
      return `<label class="schedule-kid"><input type="checkbox" name="students" value="${s.id}" ${picked.has(s.id) ? 'checked' : ''} ${ready(s) ? '' : 'disabled'}><span>${h(s.name)} <small class="muted">${tag}</small></span></label>`;
    })
    .join('');
  // Dropdown pilih banyak: ringkasan menyebut siswa terpilih, daftar centang terbuka di bawahnya.
  const kidBlock = kids
    ? `<div class="schedule-field"><span class="schedule-label">Siswa</span><details class="schedule-kids" ${v.kidsOpen ? 'open' : ''}><summary data-kids-summary>${h(kidsSummary(picked))}</summary><div class="schedule-kids-list">${kids}</div></details></div>`
    : '<p class="muted">Belum ada siswa aktif.</p>';

  return `<form data-form="schedule"${id ? ` data-id="${h(id)}"` : ''}>
${kidBlock}
${select('Tema', 'theme', themes, theme, 'required')}
${indicatorRows(picked, v)}
${select('Pertemuan', 'meeting', meetings, String(meeting), 'disabled')}
<p class="muted schedule-cp">Nomor pertemuan otomatis dan berurutan.</p>
${field('Tanggal', 'date', 'date', v.date || localDate(), 'required')}
${field('Jam', 'time', 'time', v.time || '', '')}
<button class="primary full">Simpan jadwal</button></form>`;
}
