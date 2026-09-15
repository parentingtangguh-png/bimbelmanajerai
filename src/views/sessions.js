// Ruang kelas kurikulum 8 level. Pertemuan dihitung per hari mengajar: satu hari bisa punya beberapa sesi yang
// berbagi nomor pertemuan dan tema. Guru hanya mengisi tanggal/jam sesi, memilih siswa yang hadir (satu anak
// satu sesi per hari), lalu menilai satu indikator akademik per anak (Lulus / Belum / Belum dinilai) serta
// English dan Karakter bila dinilai. Nomor pertemuan, tema, level, dan indikator otomatis (dijaga
// save_schedule dan save_meeting). Sesi bisa disimpan sementara, lalu ditandai selesai (final, tanpa koreksi).
import {
  state,
  finalTestFor,
  suggestedIndicator,
  passedIndicators,
  englishReady,
  k8ThemeFor,
  k8SubthemeFor
} from '../state.js';
import { heading, empty, field } from '../ui.js';
import { escapeHtml as h, localDate } from '../domain.js';
import { inlineMarkdown } from '../markdown.js';

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
const indicatorOf = (level, n) => state.k8Indicators.find(i => i.level === Number(level) && i.number === n);

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
  const t = state.k8Themes.find(x => x.number === number);
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

// Satu hari mengajar: tanggal, nomor pertemuan, tema dan subtema, lalu daftar sesinya.
export function dayCard(number) {
  const list = sessionsOf(number);
  const first = list[0];
  const latest = number === lastNumber();
  const teacher = state.role === 'teacher';
  const sub = k8SubthemeFor(number);
  const add =
    teacher && latest
      ? `<div class="button-row"><button type="button" class="secondary" data-action="add-session" data-id="${first.id}">＋ Tambah sesi</button></div>`
      : '';
  return `<article class="panel schedule-card"><strong>${h(dateText(first.scheduled_date))} · Pertemuan ${number}</strong><p>${themeLabel(first.theme_number)}${sub ? ` · ${h(sub.name)}` : ''}</p>${list.map(sessionRow).join('')}${add}</article>`;
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
  ['belum', 'Belum'],
  ['belum_dinilai', 'Belum dinilai']
];
const COMPANION = [
  ['', 'Tidak dinilai'],
  ['lulus', 'Lulus'],
  ['belum', 'Belum']
];

// Siswa yang bisa ikut kelas: aktif dan tes diagnostiknya sudah final.
const ready = s => s.status === 'Aktif' && !!finalTestFor(s.id) && !!s.pilot_level;

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
  for (const r of rows) {
    if (r.result) v[`r_${r.student_id}`] = r.result;
    if (r.english_result) v[`en_${r.student_id}`] = r.english_result;
    if (r.character_result) v[`kr_${r.student_id}`] = r.character_result;
  }
  return v;
}

const radios = (name, options, value) =>
  options
    .map(
      ([val, label]) =>
        `<label class="diagnostic-rating"><input type="radio" name="${name}" value="${val}" ${(value || '') === val ? 'checked' : ''}><span>${label}</span></label>`
    )
    .join('');

function indicatorDetails(ind) {
  if (!ind) return '';
  const row = (label, value) => `<div><dt>${label}</dt><dd>${inlineMarkdown(value || '—')}</dd></div>`;
  return `<details><summary>Cara uji, bahan, tanda lulus</summary><dl>${row('Cara uji', ind.method)}${row('Bahan', ind.material)}${row('Tanda lulus', ind.success)}</dl></details>`;
}

// English dan Karakter: opsional, lulus sekali per level, tidak memindahkan antrean akademik.
function companionBlock(s, c, n, prefix, v) {
  const level = s.pilot_level;
  const ind = indicatorOf(level, n);
  const label = n === 13 ? 'English' : 'Karakter';
  const title = `<p><span class="badge">${label}</span> ${inlineMarkdown(ind ? ind.competency : '')}</p>`;
  if (passedIndicators(s.id, level).includes(n))
    return `<div class="meeting-companion">${title}<p class="muted">${label} Level ${level} sudah Lulus.</p></div>`;
  if (n === 13 && !englishReady(s, c))
    return `<div class="meeting-companion">${title}<p class="muted">Belum bisa dinilai: anak belum hadir 3 pertemuan dalam satu tema.</p></div>`;
  return `<div class="meeting-companion">${title}${indicatorDetails(ind)}<div class="diagnostic-ratings">${radios(`${prefix}_${s.id}`, COMPANION, v[`${prefix}_${s.id}`])}</div></div>`;
}

// Untuk setiap siswa terpilih: indikator akademik aktif (otomatis) dengan tiga pilihan, lalu English dan Karakter.
export function meetingRows(picked, v = {}, c = {}) {
  const rows = state.students
    .filter(s => picked.has(s.id) && ready(s))
    .map(s => {
      const n = suggestedIndicator(s);
      const ind = n ? indicatorOf(s.pilot_level, n) : null;
      const academic = n
        ? `<p><span class="badge green">${h(ind?.slot || String(n))}</span> Indikator ${n}. ${inlineMarkdown(ind ? ind.competency : '')}</p>${indicatorDetails(ind)}<div class="diagnostic-ratings">${radios(`r_${s.id}`, RESULTS, v[`r_${s.id}`])}</div>`
        : `<p><span class="badge green">${Number(s.pilot_level) === 8 ? 'Kurikulum 8 level selesai' : `12 indikator Level ${s.pilot_level} Lulus — siap naik`}</span></p>`;
      return `<fieldset class="diagnostic-task"><legend>${h(s.name)} · Level ${s.pilot_level}</legend>${academic}${companionBlock(s, c, 13, 'en', v)}${companionBlock(s, c, 14, 'kr', v)}</fieldset>`;
    })
    .join('');
  const body = rows || '<p class="muted">Pilih siswa yang hadir untuk menilai indikatornya.</p>';
  return `<div class="schedule-field" data-meeting-rows>${body}</div>`;
}

// Konteks tema untuk semua level: subtema, benda nyata, dan kosakata English tema.
export function themeContext(c) {
  const t = k8ThemeFor(c.meeting_number);
  if (!t) return '';
  const sub = k8SubthemeFor(c.meeting_number);
  const words = kind =>
    state.k8English
      .filter(e => e.theme === t.number && e.kind === kind)
      .sort((a, b) => a.position - b.position)
      .map(e => h(e.text))
      .join(', ');
  const row = (label, value) => (value ? `<div><dt>${label}</dt><dd>${value}</dd></div>` : '');
  return `<details class="diagnostic-rules meeting-theme"><summary>Tema hari ini${sub ? `: ${h(sub.name)}` : ''}</summary><dl>${row('Benda nyata bersama', h(t.objects))}${row('Kosakata bahasa Indonesia', h(t.vocabulary))}${row('English — kata benda', words('noun'))}${row('English — frasa tindakan', words('phrase'))}${row('Situasi Karakter alami', h(t.character))}</dl></details>`;
}

const resultLabel = (list, value, fallback = '—') => (list.find(r => r[0] === value) || [])[1] || fallback;

// Lembar sesi. Belum selesai: pilih siswa hadir dan nilai; Simpan sementara atau Tandai selesai.
// Sudah selesai (atau pemilik): hanya ditampilkan.
export function meetingSheet(id, v = null) {
  const c = state.classSchedules.find(x => x.id === id);
  if (!c) return '<p class="muted">Jadwal tidak ditemukan.</p>';
  const time = timeText(c) ? ` · ${h(timeText(c))}` : '';
  const head = `<p class="muted">${h(dateText(c.scheduled_date))} · Pertemuan ${c.meeting_number} · Sesi ${sessionIndex(c)}${time} · ${themeLabel(c.theme_number)}</p>${themeContext(c)}`;
  if (c.completed_at || state.role !== 'teacher') {
    const list = rowsOf(id)
      .map(x => {
        const s = state.students.find(y => y.id === x.student_id);
        const ind = x.indicator_number ? indicatorOf(x.level, x.indicator_number) : null;
        const academic = x.indicator_number
          ? `<p class="muted">Indikator ${x.indicator_number}. ${inlineMarkdown(ind ? ind.competency : '')}</p><p><strong>${resultLabel(RESULTS, x.result)}</strong></p>`
          : '<p class="muted">12 indikator akademik sudah Lulus.</p>';
        const extra = `<p class="muted">English: ${resultLabel(COMPANION, x.english_result || '')} · Karakter: ${resultLabel(COMPANION, x.character_result || '')}</p>`;
        return `<fieldset class="diagnostic-task"><legend>${h(s ? s.name : 'Siswa')} · Level ${x.level}</legend>${academic}${extra}</fieldset>`;
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
      const tag = ready(s) ? `Level ${s.pilot_level}` : 'Tes diagnostik belum final';
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
  const prompt = `<div class="button-row"><button type="button" class="secondary" data-action="activity-prompt" data-prompt-button ${ids.length ? '' : 'disabled'}>Prompt kegiatan</button></div><div data-prompt-box hidden></div>`;
  const buttons = `${prompt}<div class="button-row"><button class="secondary" name="finish" value="0">Simpan sementara</button><button class="primary" name="finish" value="1" data-finish ${done ? '' : 'disabled'}>Tandai sesi selesai</button></div><p class="muted" data-finish-hint>${hint}</p>`;
  return `<form data-form="meeting" data-id="${h(id)}">${head}${kidBlock}${meetingRows(picked, values, c)}<p class="muted">Simpan sementara bisa diubah lagi. Setelah ditandai selesai, sesi dikunci dan indikator siswa yang Lulus berganti otomatis.</p>${buttons}</form>`;
}

// Kotak Prompt kegiatan di lembar sesi: teks siap salin untuk ChatGPT/Gemini.
export function promptBox(text) {
  return `<label class="prompt-box">Prompt kegiatan<textarea readonly rows="14" data-prompt-text>${h(text)}</textarea></label><div class="button-row"><button type="button" class="primary" data-action="copy-prompt">Salin prompt</button></div><p class="muted">Tempel ke obrolan baru di ChatGPT atau Gemini (satu sesi, satu obrolan baru). Jawaban AI hanya ide kegiatan; saat menilai, ikuti Cara uji, bahan, tanda lulus di lembar sesi. Tidak ada data yang disimpan.</p>`;
}

// "Tandai sesi selesai" aktif hanya bila ada siswa hadir dan setiap siswa yang punya indikator akademik aktif
// sudah diberi Lulus, Belum, atau Belum dinilai.
export function finishState(ids, values = {}) {
  if (!ids.length) return { done: false, hint: 'Centang siswa yang hadir lebih dulu.' };
  const missing = ids.filter(id => {
    const s = state.students.find(x => x.id === id);
    return s && suggestedIndicator(s) && !values[`r_${id}`];
  }).length;
  if (missing) return { done: false, hint: `Beri nilai indikator akademik untuk ${missing} siswa lagi.` };
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

// Formulir sesi. Hari baru: tanggal + jam. Tambah sesi (v.date tetap): jam saja. Ubah: jam; tanggal hanya
// bila sesi itu satu-satunya di harinya.
export function scheduleForm(v = {}, id = '') {
  const meeting = Number(v.meeting) || nextMeeting();
  const t = k8ThemeFor(meeting);
  const sub = k8SubthemeFor(meeting);
  const fixedDate = v.fixedDate || (id && sessionsOf(meeting).length > 1);
  const info = `<p class="schedule-auto"><strong>Pertemuan ${meeting}</strong> · ${t ? `Tema ${t.number} — ${h(t.name)}${sub ? ` · ${h(sub.name)}` : ''}` : 'Tema belum tersedia'}</p><p class="muted">Pertemuan, tema, dan indikator siswa berjalan otomatis.</p>`;
  const date = fixedDate
    ? `<input type="hidden" name="date" value="${h(v.date)}"><p><strong>${h(dateText(v.date))}</strong></p>`
    : field('Tanggal', 'date', 'date', v.date || localDate(), 'required');
  return `<form data-form="schedule"${id ? ` data-id="${h(id)}"` : ''}>
${info}
${date}
${field('Jam', 'time', 'time', v.time || '', '')}
<button class="primary full">${v.fixedDate && !id ? 'Tambah sesi' : 'Simpan jadwal'}</button></form>`;
}
