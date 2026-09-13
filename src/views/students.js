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
  levelOptions,
  schoolGrades,
  schoolYearOf,
  ageText
} from '../state.js';
import { field, select, area, empty, heading, meter, modal } from '../ui.js';
import { escapeHtml as h, progress, minutesBetween, durationPattern } from '../domain.js';
// "Sudah dites" = diagnostic_status terisi ("Lulus Level X" / "Belum lulus Level X"). Kolom itu hanya
// diisi save_diagnostic, dan database menolak anak tanpa status masuk sesi kelas.
export const needsDiagnostic = s => s.status === 'Aktif' && !String(s.diagnostic_status || '').trim();
export function studentRow(s) {
  const bi = areaProgress(s, ['listening', 'speaking', 'reading', 'writing']) || {
    current: s.reading_level,
    target: s.reading_target
  };
  // Minat tidak lagi ditanyakan. Yang ditandai adalah anak aktif yang belum dites: level awalnya masih
  // Level 1 sementara, dan terkunci selamanya begitu anak ikut kelas pertama.
  const note = needsDiagnostic(s)
    ? '<small class="belum-tes">Belum tes diagnostik</small>'
    : s.diagnostic_status
      ? `<small class="status-tes">${h(s.diagnostic_status)}</small>`
      : '';
  const who = `<span class="avatar pastel">${h(s.name[0])}</span><div class="student-info"><strong>${h(s.name)}</strong>${note}</div>`;
  const bar = `<div class="mini-progress"><small><b>${h(levelName(bi.current))}</b></small><progress value="${phasePct(bi.current)}" max="100"></progress></div>`;
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
  const count = tally ? `<span>${tally}</span>` : '';
  return `<div class="toolbar"><input id="student-search" type="search" placeholder="Cari nama siswa…" aria-label="Cari siswa" value="${h(state.filter)}">${count}</div>`;
}
export function teacherStudentsView() {
  const list = state.students.filter(s => s.name.toLowerCase().includes(state.filter.toLowerCase()));
  // Tab Siswa hanya tentang anak, bukan jadwal: semua anak aktif berada dalam satu kelompok, dan
  // anak non-aktif serta lulus di kelompoknya sendiri. Pengaturan sesi jadwal tidak ada di sini.
  const active = list.filter(s => s.status === 'Aktif');
  const inactive = list.filter(s => s.status !== 'Aktif');
  const group = (title, meta, students, extra = '') => {
    const sub = meta ? `<p>${meta}</p>` : '';
    return `<section class="panel schedule-group ${extra}"><div class="panel-heading"><div><h2>${title}</h2>${sub}</div></div>${students.map(studentRow).join('')}</section>`;
  };
  const activeSection = active.length ? group('Profil siswa', '', active) : '';
  const inactiveSection = inactive.length
    ? group(
        'Siswa non-aktif &amp; lulus',
        `${inactive.length} anak · tidak ikut sesi kelas; riwayat belajarnya tetap tersimpan`,
        inactive,
        'unscheduled'
      )
    : '';
  // Tes Diagnostik baru berupa tombol: fungsinya belum ditentukan, jadi belum ada penangannya di main.js.
  const buttons =
    '<div class="button-row stack"><button class="primary" data-action="new-student">＋ Tambah siswa</button><button class="secondary" data-action="diagnostic-test">Tes Diagnostik</button></div>';
  const head = heading('SETIAP ANAK UNIK', 'Kenali, lalu dampingi.', '', buttons);
  const body = state.students.length
    ? activeSection + inactiveSection || empty('Tidak ditemukan', 'Tidak ada siswa dengan nama itu.')
    : empty('Belum ada siswa', 'Tambahkan siswa pertama Anda untuk mulai mendampingi belajarnya.');
  return `${head}${searchToolbar('')}${body}`;
}
export function studentsView() {
  return state.role === 'owner' ? ownerStudentsView() : teacherStudentsView();
}
// Nama level pilot dari kurikulum, misalnya "Level 2 — Aku Mulai Mengenal".
export function levelName(level) {
  const lv = state.curriculumLevels.find(x => x.level === Number(level));
  return `Level ${level}${lv ? ` — ${lv.title}` : ''}`;
}

// Level anak saat ini beserta deskriptornya, pengganti batang kompetensi per bidang selama pilot.
export function currentLevelSection(s) {
  const lv = state.curriculumLevels.find(x => x.level === Number(s.reading_level));
  const desc = lv ? `<p class="muted">${h(lv.description)}</p>` : '';
  return `<hr><h3>Level saat ini</h3><p><strong>${h(levelName(s.reading_level))}</strong></p>${desc}`;
}

export function studentActionsSection(s) {
  const openSession = state.records.some(r => r.student_id === s.id && !r.finalized_at);
  const status =
    s.status === 'Lulus'
      ? '<p class="muted">Siswa ini sudah lulus melalui ujian sumatif.</p>'
      : s.status !== 'Aktif'
        ? `<p class="muted">Siswa ini non-aktif: tidak bisa dimasukkan ke sesi kelas, tetapi riwayat belajarnya tetap tersimpan.</p><button type="button" class="secondary" data-action="toggle-student" data-active="true" data-id="${s.id}">Aktifkan kembali</button>`
        : openSession
          ? '<p class="muted">Siswa ini masih punya sesi kelas yang belum dievaluasi. Selesaikan evaluasinya dulu sebelum menonaktifkan.</p><button type="button" class="secondary danger" disabled>Nonaktifkan siswa ini</button>'
          : `<p class="muted">Untuk anak yang berhenti atau cuti. Anak nonaktif tidak bisa dimasukkan ke sesi kelas; riwayatnya tetap tersimpan dan bisa diaktifkan kembali kapan saja.</p><button type="button" class="secondary danger" data-action="toggle-student" data-active="false" data-id="${s.id}">Nonaktifkan siswa ini</button>`;
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
// Usia ditampilkan di bawah tanggal lahir dan diperbarui main.js saat tanggalnya diubah.
function birthField(s) {
  const today = new Date().toISOString().slice(0, 10);
  const age = ageText(s.birth_date);
  return `<div>${field('Tanggal lahir', 'birth_date', 'date', s.birth_date || '', `required max="${today}"`)}<small class="field-hint" data-age>${age ? 'Usia ' + age : 'Usia dihitung otomatis'}</small></div>`;
}
// Kelas formal disimpan bersama tahun ajarannya; anak baru memakai tahun ajaran yang sedang berjalan.
function gradeField(s) {
  const options = [['', 'Pilih kelas…'], ...schoolGrades.map(g => [g, g])];
  const year = s.school_year || schoolYearOf();
  return `<div>${select('Kelas formal', 'school_grade', options, s.school_grade || '', 'required')}<small class="field-hint">Tahun ajaran ${h(year)}</small></div>`;
}
function profileForm(s, edit, owner, canCreate) {
  const grid = `<div class="form-grid">${field('Nama anak', 'name', 'text', s.name, 'required maxlength="120"')}${field('Nama panggilan', 'nickname', 'text', s.nickname, 'maxlength="60" placeholder="Boleh dikosongkan"')}${field('Sapaan orang tua', 'parent_name', 'text', s.parent_name, 'required maxlength="120"')}${field('Nomor WhatsApp', 'phone', 'tel', s.phone)}${birthField(s)}${gradeField(s)}</div>`;
  // Catatan gaya belajar tidak lagi ditanyakan (keputusan pemilik 13 Sep 2026); isinya tetap tersimpan.
  const notes = '';
  const hint =
    edit && owner
      ? '<p class="muted">Profil ini hanya dapat dibaca. Perubahan dilakukan oleh guru pendamping.</p>'
      : '';
  // Siswa baru cukup identitasnya; catatan dan level awal diisi lewat Tes Diagnostik, kapan saja.
  const save = canCreate
    ? `<button class="primary full">${edit ? 'Simpan profil siswa' : 'Simpan siswa'}</button>`
    : '';
  const rest = edit ? `${notes}${hint}` : '';
  return `<form data-form="student" data-id="${s.id || ''}"><fieldset ${canCreate ? '' : 'disabled'}>${grid}${rest}</fieldset>${save}</form>`;
}

// Everything below the profile, shown only for a child who already exists.
function studentDetails(s, owner) {
  const meters = currentLevelSection(s);
  const actions = !owner ? `<hr>${studentActionsSection(s)}` : '';
  // Ujian sumatif disembunyikan selama pilot Fondasi (keputusan pemilik 13 Sep 2026): aturan lama
  // menganggap anak yang MULAI di Level 4 sudah menyelesaikan fase. summativeForm dan RPC
  // complete_summative sengaja dibiarkan untuk dipakai lagi di tempat lain.
  // Riwayat evaluasi per bidang (sistem lama) juga disembunyikan selama pilot; evaluationHistory
  // dibiarkan untuk dipakai lagi setelah evaluasi kelas pilot dirancang.
  return `${diagnosticResultSection(s)}${meters}${actions}`;
}

// Hasil Tes Diagnostik per indikator. Pemilik tidak menerima baris ini dari database, jadi bagian ini
// hanya muncul untuk guru pendamping.
export function diagnosticResultSection(s) {
  const test = state.diagnosticTests.find(t => t.student_id === s.id);
  if (!test) return '';
  const marks = { T: '✓', B: '◐', N: '✗' };
  const rows = state.diagnosticResults.filter(r => r.test_id === test.id);
  const levels = [...new Set(rows.map(r => r.level))].sort((a, b) => a - b);
  const tables = levels
    .map(l => {
      const items = rows
        .filter(r => r.level === l)
        .sort((a, b) => a.indicator_number - b.indicator_number)
        .map(
          r =>
            `<li><span class="diagnostic-mark">${marks[r.rating] || '·'}</span> ${r.indicator_number}. ${h(r.indicator_text)}</li>`
        )
        .join('');
      return `<h4>Level ${l}</h4><ul class="diagnostic-result-list">${items}</ul>`;
    })
    .join('');
  const locked = test.level_locked ? ' · level tidak diubah (sudah ikut kelas)' : '';
  const verdict =
    test.passed === null || test.passed === undefined
      ? `mulai Level ${test.start_level}`
      : `<strong>${test.passed ? 'Lulus' : 'Belum lulus'} Level ${test.tested_level}</strong>`;
  const head = `<p class="muted">${h(test.tested_on)} · ${verdict} → mulai belajar <strong>Level ${test.final_level}</strong>${test.beyond ? ' (melampaui Fondasi)' : ''}${locked}</p>`;
  const note = test.note ? `<p><strong>Catatan:</strong> ${h(test.note)}</p>` : '';
  const revised = test.revised_at
    ? `<p class="muted">Direvisi ${h(new Date(test.revised_at).toLocaleDateString('id-ID'))}</p>`
    : '';
  // Revisi hanya sebelum anak ikut kelas pertama, sama dengan aturan di save_diagnostic.
  const canRevise = state.role === 'teacher' && !state.records.some(r => r.student_id === s.id);
  const button = canRevise
    ? `<button type="button" class="secondary" data-action="diagnostic-revise" data-id="${s.id}">Revisi hasil tes</button>`
    : `<p class="muted">Hasil tes terkunci karena anak sudah mengikuti kelas.</p>`;
  return `<hr><h3>Hasil tes diagnostik</h3>${head}${revised}${tables}${note}${button}`;
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
