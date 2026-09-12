// Data siswa: kartu dan baris siswa, profil, level awal, dan sesi jadwal.
import {
  state,
  subjectLabels,
  activeCompetenciesFor,
  ready,
  timeLabel,
  scheduleMembers,
  durationText,
  areaProgress,
  phaseOf,
  phaseShort,
  phasePct,
  levelOptions
} from '../state.js';
import { field, select, area, empty, heading, meter, modal } from '../ui.js';
import { escapeHtml as h, progress, minutesBetween, durationPattern } from '../domain.js';
export function studentRow(s) {
  const bi = areaProgress(s, ['listening', 'speaking', 'reading', 'writing']) || {
    current: s.reading_level,
    target: s.reading_target
  };
  const who = `<span class="avatar pastel">${h(s.name[0])}</span><div class="student-info"><strong>${h(s.name)}</strong><small>${h(s.interest || 'Minat belum diisi')}</small></div>`;
  const bar = `<div class="mini-progress"><small>Bahasa Indonesia <b>Level ${bi.current}</b> · ${phaseShort(bi.current)}</small><progress value="${phasePct(bi.current)}" max="100"></progress></div>`;
  return `<button class="student-row" data-action="student" data-id="${s.id}">${who}${bar}<span class="row-arrow">→</span></button>`;
}
export function ownerStudentsView() {
  const list = state.students.filter(s => s.name.toLowerCase().includes(state.filter.toLowerCase()));
  const flagged = id => state.alerts.some(a => a.student_id === id && a.intervention);
  const teachers = id =>
    state.assignments
      .filter(a => a.student_id === id)
      .map(a => state.profiles.find(p => p.id === a.teacher_id)?.name)
      .filter(Boolean)
      .join(', ') || '—';
  const cell = (current, target) => `<td class="num"><b>${current}</b><small> / ${target}</small></td>`;
  const active = state.students.filter(s => s.status === 'Aktif').length;
  const attention = state.students.filter(s => flagged(s.id)).length;
  const rows = list
    .map(s => {
      const bi = areaProgress(s, ['listening', 'speaking', 'reading', 'writing']) || {
        current: s.reading_level,
        target: s.reading_target
      };
      const ipas = activeCompetenciesFor(s.id).find(c => c.subject === 'ipas');
      const status = flagged(s.id)
        ? '<span class="badge amber">Perlu perhatian</span>'
        : ready(s) && s.status === 'Aktif'
          ? '<span class="badge amber">Siap sumatif</span>'
          : `<span class="badge green">${h(s.status)}</span>`;
      return `<tr data-action="student" data-id="${s.id}" tabindex="0"><td><strong>${h(s.name)}</strong><small>${h(s.parent_name || '')}</small></td>${cell(bi.current, bi.target)}${cell(s.math_level, s.math_target)}${ipas ? cell(ipas.current_level, ipas.target) : '<td class="num">—</td>'}<td class="teachers">${h(teachers(s.id))}</td><td>${status}</td></tr>`;
    })
    .join('');
  const head = heading(
    'DATA UMUM SISWA',
    'Ringkasan siswa.',
    `${state.students.length} siswa · ${active} aktif · ${attention} perlu perhatian. Klik baris untuk membuka profil.`
  );
  const table = rows
    ? `<div class="panel table-wrap"><table class="owner-students"><thead><tr><th>Siswa</th><th class="num">B. Indonesia</th><th class="num">Matematika</th><th class="num">IPAS</th><th>Guru pendamping</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table></div>`
    : empty('Belum ada siswa', 'Siswa baru ditambahkan oleh guru dan akan tampil di sini.');
  return `${head}${searchToolbar(`${list.length} ditampilkan`)}${table}`;
}

// The same search box tops both versions of the screen; only the tally beside it differs.
function searchToolbar(tally) {
  return `<div class="toolbar"><input id="student-search" type="search" placeholder="Cari nama siswa…" aria-label="Cari siswa" value="${h(state.filter)}"><span>${tally}</span></div>`;
}
export function teacherStudentsView() {
  const list = state.students.filter(s => s.name.toLowerCase().includes(state.filter.toLowerCase()));
  const searching = !!state.filter.trim();
  // Only active children belong to schedule groups; non-active and graduated ones get their own group.
  const active = list.filter(s => s.status === 'Aktif');
  const inactive = list.filter(s => s.status !== 'Aktif');
  const scheduled = new Set(
    state.scheduleStudents
      .filter(x => state.schedules.some(sc => sc.id === x.schedule_id))
      .map(x => x.student_id)
  );
  const group = (title, meta, action, students, extra = '') =>
    `<section class="panel schedule-group ${extra}"><div class="panel-heading"><div><h2>${title}</h2><p>${meta}</p></div>${action}</div>${students.length ? students.map(studentRow).join('') : '<p class="muted">Belum ada anak di sesi ini. Tekan Ubah untuk memilih anak.</p>'}</section>`;
  const sections = state.schedules
    .map(sc => {
      const members = scheduleMembers(sc.id);
      const kids = active.filter(s => members.has(s.id));
      const activeCount = state.students.filter(s => s.status === 'Aktif' && members.has(s.id)).length;
      if (searching && !kids.length) return '';
      const mins = minutesBetween(sc.start_time, sc.end_time);
      return group(
        h(sc.name),
        `${timeLabel(sc)} · ${mins} menit · pola ${durationPattern(mins)} menit · ${activeCount} anak`,
        `<button class="secondary" data-action="edit-schedule" data-id="${sc.id}">Ubah</button>`,
        kids
      );
    })
    .join('');
  const loose = active.filter(s => !scheduled.has(s.id));
  const inactiveSection = inactive.length
    ? group(
        'Siswa non-aktif &amp; lulus',
        `${inactive.length} anak · tidak ikut sesi kelas; riwayat belajarnya tetap tersimpan`,
        '',
        inactive,
        'unscheduled'
      )
    : '';
  const looseSection = loose.length
    ? group(
        'Belum masuk sesi',
        `${loose.length} anak · masukkan ke sesi jadwal agar mudah dipilih saat membuka kelas`,
        '',
        loose,
        'unscheduled'
      )
    : '';
  // Creating a schedule lives on Ruang kelas; this screen only assigns children to one.
  const buttons = '<button class="primary" data-action="new-student">＋ Tambah siswa</button>';
  const head = heading(
    'SETIAP ANAK UNIK',
    'Kenali, lalu dampingi.',
    'Siswa dikelompokkan menurut sesi jadwal rutin Anda.',
    buttons
  );
  const tally = `${state.students.length} siswa · ${state.schedules.length} sesi jadwal`;
  const body = state.students.length
    ? sections + looseSection + inactiveSection ||
      empty('Tidak ditemukan', 'Tidak ada siswa dengan nama itu.')
    : empty('Belum ada siswa', 'Tambahkan siswa pertama Anda untuk mulai mendampingi belajarnya.');
  return `${head}${searchToolbar(tally)}${body}`;
}
export function studentsView() {
  return state.role === 'owner' ? ownerStudentsView() : teacherStudentsView();
}
export function competencyMeters(s) {
  const rows = activeCompetenciesFor(s.id);
  if (!rows.length)
    return `${meter('Bahasa Indonesia', s.reading_level, s.reading_baseline, s.reading_target)}${meter('Matematika', s.math_level, s.math_baseline, s.math_target)}`;
  const order = ['listening', 'speaking', 'reading', 'writing', 'math', 'ipas', 'english'];
  const bars = order
    .map(code => rows.find(c => c.subject === code))
    .filter(Boolean)
    .map(c => competencyMeter(c))
    .join('');
  return `<div class="competency-list">${bars}</div>`;
}

// One subject's bar. The line underneath says either that the phase is done and waiting on the
// summative, or how far along it is and how much evidence the next level still needs.
function competencyMeter(c) {
  const atTarget =
    c.target >= 16 ? 'Level tertinggi tercapai' : 'Akhir fase tercapai · menunggu ujian sumatif';
  const onTheWay = `${phasePct(c.current_level)}% fase · ${c.evidence_count}/2 bukti menuju kenaikan berikutnya`;
  const status = `${c.current_level >= c.target ? atTarget : onTheWay}${c.intervention ? ' · perlu ditinjau' : ''}`;
  const label = `<div><strong>${h(subjectLabels[c.subject])}</strong><span>Level ${c.current_level} · ${phaseOf(c.current_level)}${c.required ? '' : ' · pengayaan'}</span></div>`;
  return `<div class="competency-meter">${label}<progress value="${phasePct(c.current_level)}" max="100"></progress><small>${status}</small></div>`;
}
export function levelMeaning(kind, level) {
  const n = Number(level);
  const c = state.curriculum.find(x => x.level === n);
  const clip = t => (t && t.length > 170 ? t.slice(0, 167) + '…' : t || '—');
  if (!c) return `${phaseOf(n)}. Lihat menu Kurikulum untuk tujuan lengkap level ini.`;
  return kind === 'math'
    ? `${phaseOf(n)} · Matematika: ${clip(c.math)}`
    : `${phaseOf(n)} · Membaca: ${clip(c.reading)} · Menulis: ${clip(c.writing)}`;
}
export function levelFields(s, edit, owner) {
  const correctable = edit && !owner && !state.records.some(r => r.student_id === s.id);
  const lockBase = edit && !correctable;
  const pick = (label, name, value, kind) =>
    `<div>${select(label, name, levelOptions, String(value), lockBase ? 'disabled' : 'required')}<small class="level-meaning" data-meaning="${name}">${h(levelMeaning(kind, value))}</small></div>`;
  const baseLabel = label =>
    lockBase
      ? `${label} (terkunci)`
      : correctable
        ? `${label} (bisa dikoreksi sampai anak ikut kelas)`
        : label;
  const phases = [
    ['', 'Pilih untuk mengisi level otomatis…'],
    ['fondasi', 'Belum SD (Fondasi)'],
    ['sd1', 'SD kelas 1'],
    ['sd2', 'SD kelas 2'],
    ['sd3', 'SD kelas 3'],
    ['sd4', 'SD kelas 4'],
    ['sd5', 'SD kelas 5'],
    ['sd6', 'SD kelas 6']
  ];
  const phasePicker = edit ? '' : select('Perkiraan fase / kelas sekolah', 'phase', phases, '');
  const bi = pick(
    baseLabel('Level awal Bahasa Indonesia'),
    'reading_baseline',
    s.reading_baseline || 1,
    'bi'
  );
  const math = pick(baseLabel('Level awal Matematika'), 'math_baseline', s.math_baseline || 1, 'math');
  return `${phasePicker}${levelGuide()}<div class="form-grid">${bi}${math}</div>`;
}

// Why a teacher only ever sets a starting point: the level is where the child is, not which school
// year they are in, and the target moves itself once a phase is passed.
function levelGuide() {
  const ladder = `1–4 Fondasi (belum SD) · 5–8 Fase A (SD 1–2) · 9–12 Fase B (SD 3–4) · 13–16 Fase C (SD 5–6).`;
  const how = `Guru cukup menentukan titik awal sesuai hasil diagnostik; level adalah posisi kemampuan anak, bukan kelas sekolah. Target mengalir otomatis: akhir fase anak saat ini, lalu pindah ke fase berikutnya setelah anak lulus ujian sumatif fase itu. Titik awal Bahasa Indonesia juga dipakai untuk Menyimak, Berbicara, IPAS, dan English Exposure.`;
  return `<div class="notice level-guide"><strong>Arti level</strong><br>${ladder}<br>${how}</div>`;
}
export function studentActionsSection(s) {
  const openSession = state.records.some(r => r.student_id === s.id && !r.finalized_at);
  const status =
    s.status === 'Lulus'
      ? '<p class="muted">Siswa ini sudah lulus melalui ujian sumatif.</p>'
      : s.status !== 'Aktif'
        ? `<p class="muted">Siswa ini non-aktif: tidak ikut sesi kelas, tetapi riwayat belajarnya tetap tersimpan.</p><button type="button" class="secondary" data-action="toggle-student" data-active="true" data-id="${s.id}">Aktifkan kembali</button>`
        : openSession
          ? '<p class="muted">Siswa ini masih punya sesi kelas yang belum dievaluasi. Selesaikan evaluasinya dulu sebelum menonaktifkan.</p><button type="button" class="secondary danger" disabled>Nonaktifkan siswa ini</button>'
          : `<p class="muted">Untuk anak yang berhenti atau cuti. Anak tidak ikut sesi kelas, riwayat belajarnya tetap tersimpan, dan bisa diaktifkan kembali kapan saja.</p><button type="button" class="secondary danger" data-action="toggle-student" data-active="false" data-id="${s.id}">Nonaktifkan siswa ini</button>`;
  const remove = state.records.some(r => r.student_id === s.id)
    ? '<p class="muted">Siswa ini sudah pernah ikut kelas, jadi tidak bisa dihapus agar riwayat belajarnya tetap tersimpan. Gunakan Nonaktifkan bila anak berhenti.</p>'
    : `<p class="muted">Hanya untuk data yang salah input atau ganda. Siswa yang belum pernah ikut kelas dihapus permanen beserta level dan keanggotaan sesi jadwalnya.</p><button type="button" class="secondary danger" data-action="delete-student" data-id="${s.id}">Hapus siswa ini</button>`;
  return `<h3>Status siswa</h3>${status}<hr><h3>Hapus siswa</h3>${remove}`;
}
export function studentForm(s = {}) {
  // Teachers own their students' data; the owner only reads profiles.
  const owner = state.role === 'owner';
  const canCreate = state.role === 'teacher';
  const edit = !!s.id;
  const lockTargets = edit;
  modal(
    edit ? h(s.name) : 'Siswa baru',
    `${profileForm(s, edit, owner, canCreate)}${edit ? studentDetails(s, owner) : ''}`
  );
}

// The profile itself. The owner sees the same fields but cannot submit them, so the whole fieldset
// is disabled rather than the screen being written twice.
function profileForm(s, edit, owner, canCreate) {
  const grid = `<div class="form-grid">${field('Nama anak', 'name', 'text', s.name, 'required maxlength="120"')}${field('Sapaan orang tua', 'parent_name', 'text', s.parent_name, 'required maxlength="120"')}${field('Nomor WhatsApp', 'phone', 'tel', s.phone)}${field('Minat / hobi', 'interest', 'text', s.interest, 'required maxlength="300"')}</div>`;
  const notes = `${area('Hasil diagnostik awal', 'diagnostic', s.diagnostic, 'maxlength="3000"')}${area('Catatan gaya belajar', 'learning_notes', s.learning_notes, 'maxlength="3000"')}`;
  const hint = edit
    ? `<p class="muted">${owner ? 'Profil ini hanya dapat dibaca. Perubahan dilakukan oleh guru pendamping.' : 'Target mengalir otomatis per fase. Lihat kemajuan tiap bidang di bawah.'}</p>`
    : '';
  const save = canCreate ? '<button class="primary full">Simpan profil siswa</button>' : '';
  return `<form data-form="student" data-id="${s.id || ''}"><fieldset ${canCreate ? '' : 'disabled'}>${grid}${notes}${levelFields(s, edit, owner)}${hint}</fieldset>${save}</form>`;
}

// Everything below the profile, shown only for a child who already exists.
function studentDetails(s, owner) {
  const meters = `<hr><h3>Perjalanan kompetensi</h3>${competencyMeters(s)}<div class="notice">Karakter tidak diberi level. Guru mencatat perilaku yang tampak dalam konteks kegiatan.</div>`;
  const actions = !owner ? `<hr>${studentActionsSection(s)}` : '';
  const summative = !owner && ready(s) && s.status === 'Aktif' ? summativeForm(s) : '';
  return `${meters}${actions}${summative}<hr><h3>Riwayat evaluasi</h3>${evaluationHistory(s)}`;
}

// Offered only once every core subject has reached the end of its phase. Passing at the end of
// Phase C is graduation, so the wording of the choice changes there.
function summativeForm(s) {
  const graduating = activeCompetenciesFor(s.id)
    .filter(c => c.required)
    .every(c => c.target >= 16);
  const decision = select(
    'Keputusan guru',
    'pass',
    [
      ['false', 'Perlu pendampingan lanjutan'],
      ['true', graduating ? 'Lulus (akhir Fase C)' : 'Lulus fase — lanjut ke fase berikutnya']
    ],
    'false'
  );
  const intro = `<h3>Ujian sumatif akhir fase</h3><p class="muted">Semua bidang inti sudah mencapai akhir fasenya. Lulus fase membuka fase berikutnya; lulus di akhir Fase C berarti lulus dari rumah belajar.</p>`;
  const score = field('Nilai sumatif (1–100)', 'score', 'number', '', 'required min="1" max="100"');
  return `<hr><form data-form="summative" data-id="${s.id}">${intro}${score}${decision}<button class="primary">Simpan hasil sumatif</button></form>`;
}

function historyLine(r) {
  const when = h(state.classes.find(c => c.id === r.session_id)?.date || r.finalized_at.slice(0, 10));
  return `<p class="history">${when} · ${h(r.attendance)} · <strong>${h(r.grade || 'Tanpa nilai')}</strong><br><small>${h(r.anecdote)}</small></p>`;
}

function evaluationHistory(s) {
  return (
    state.records
      .filter(r => r.student_id === s.id && r.finalized_at)
      .sort((a, b) => b.finalized_at.localeCompare(a.finalized_at))
      .map(r => historyLine(r))
      .join('') || '<p class="muted">Belum ada evaluasi tersimpan.</p>'
  );
}
export function scheduleForm(sc = {}) {
  const members = scheduleMembers(sc.id);
  // A child who was deactivated while in this slot stays a member. Listing only active children
  // hid them, and saving then dropped them silently, so they are shown and marked instead.
  const active = state.students.filter(s => s.status === 'Aktif' || members.has(s.id));
  modal(
    sc.id ? 'Ubah sesi jadwal' : 'Sesi jadwal baru',
    `<form data-form="schedule" data-id="${sc.id || ''}">${scheduleTimeFields(sc)}<h3>Anak di sesi ini</h3>${scheduleRoster(active, members)}<button class="primary full">Simpan sesi jadwal</button>${scheduleDeleteButton(sc)}</form>`
  );
}

// Name and hours. The duration line is rewritten by main.js as the teacher edits the two times.
function scheduleTimeFields(sc) {
  const name = field(
    'Nama sesi',
    'name',
    'text',
    sc.name || '',
    'required maxlength="60" placeholder="Sesi Pagi"'
  );
  const start = field('Jam mulai', 'start_time', 'time', sc.start_time?.slice(0, 5) || '', 'required');
  const end = field('Jam selesai', 'end_time', 'time', sc.end_time?.slice(0, 5) || '', 'required');
  const hint = `<p class="muted schedule-hint" id="schedule-duration">${durationText(sc.start_time, sc.end_time)}</p>`;
  return `${name}<div class="form-grid">${start}${end}</div>${hint}`;
}

function scheduleRoster(active, members) {
  return (
    active
      .map(s => {
        const tanda = s.status === 'Aktif' ? '' : ` <small>· ${h(s.status).toLowerCase()}</small>`;
        return `<label class="check"><input type="checkbox" name="student" value="${s.id}" ${members.has(s.id) ? 'checked' : ''}>${h(s.name)}${tanda}</label>`;
      })
      .join('') || '<p>Belum ada siswa aktif.</p>'
  );
}

function scheduleDeleteButton(sc) {
  if (!sc.id) return '';
  return `<button type="button" class="text-btn full" data-action="delete-schedule" data-id="${sc.id}">Hapus sesi jadwal</button>`;
}
