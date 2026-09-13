// Data siswa: daftar anak, profil, hasil tes diagnostik, level saat ini, status, dan hapus.
import { state, testFor, testStatus, levelName, schoolGrades, schoolYearOf, ageText } from '../state.js';
import { field, select, empty, heading, modal } from '../ui.js';
import { escapeHtml as h } from '../domain.js';

// Anak aktif yang belum punya tes diagnostik. "Sudah dites" = ada baris diagnostic_tests.
export const needsDiagnostic = s => s.status === 'Aktif' && !testFor(s.id);

// Tanda di bawah nama: belum dites (oranye) atau status tesnya.
function statusNote(s) {
  if (needsDiagnostic(s)) return '<small class="belum-tes">Belum tes diagnostik</small>';
  const status = testStatus(testFor(s.id));
  return status ? `<small class="status-tes">${h(status)}</small>` : '';
}

export function studentRow(s) {
  const who = `<span class="avatar pastel">${h(s.name[0])}</span><div class="student-info"><strong>${h(s.name)}</strong>${statusNote(s)}</div>`;
  const level = `<div class="mini-level"><small><b>${h(levelName(s.pilot_level))}</b></small></div>`;
  return `<button class="student-row" data-action="student" data-id="${s.id}">${who}${level}<span class="row-arrow">→</span></button>`;
}

// The same search box tops both versions of the screen; only the tally beside it differs.
function searchToolbar(tally) {
  const count = tally ? `<span>${tally}</span>` : '';
  return `<div class="toolbar"><input id="student-search" type="search" placeholder="Cari nama siswa…" aria-label="Cari siswa" value="${h(state.filter)}">${count}</div>`;
}
const filtered = () => state.students.filter(s => s.name.toLowerCase().includes(state.filter.toLowerCase()));

// Pemilik: satu baris per anak, hanya ringkasan.
function ownerRow(s) {
  const teachers =
    state.assignments
      .filter(a => a.student_id === s.id)
      .map(a => state.profiles.find(p => p.id === a.teacher_id)?.name)
      .filter(Boolean)
      .join(', ') || '—';
  const tes = testStatus(testFor(s.id)) || 'Belum tes diagnostik';
  return `<tr data-action="student" data-id="${s.id}" tabindex="0"><td><strong>${h(s.name)}</strong><small>${h(s.parent_name || '')}</small></td><td>${h(levelName(s.pilot_level))}</td><td>${h(tes)}</td><td class="teachers">${h(teachers)}</td><td><span class="badge ${s.status === 'Aktif' ? 'green' : ''}">${h(s.status)}</span></td></tr>`;
}
export function ownerStudentsView() {
  const list = filtered();
  const active = state.students.filter(s => s.status === 'Aktif').length;
  const untested = state.students.filter(needsDiagnostic).length;
  const head = heading(
    'DATA UMUM SISWA',
    'Ringkasan siswa.',
    `${state.students.length} siswa · ${active} aktif · ${untested} belum tes diagnostik. Klik baris untuk membuka profil.`
  );
  const table = list.length
    ? `<div class="panel table-wrap"><table class="owner-students"><thead><tr><th>Siswa</th><th>Level</th><th>Tes diagnostik</th><th>Guru pendamping</th><th>Status</th></tr></thead><tbody>${list.map(ownerRow).join('')}</tbody></table></div>`
    : empty('Belum ada siswa', 'Siswa baru ditambahkan oleh guru dan akan tampil di sini.');
  return `${head}${searchToolbar(`${list.length} ditampilkan`)}${table}`;
}

export function teacherStudentsView() {
  const list = filtered();
  const active = list.filter(s => s.status === 'Aktif');
  const inactive = list.filter(s => s.status !== 'Aktif');
  const group = (title, meta, students, extra = '') =>
    `<section class="panel student-group ${extra}"><div class="panel-heading"><div><h2>${title}</h2>${meta ? `<p>${meta}</p>` : ''}</div></div>${students.map(studentRow).join('')}</section>`;
  const activeSection = active.length ? group('Profil siswa', '', active) : '';
  const inactiveSection = inactive.length
    ? group(
        'Siswa non-aktif',
        `${inactive.length} anak · tidak bisa dites diagnostik; datanya tetap tersimpan`,
        inactive,
        'inactive'
      )
    : '';
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

export function studentForm(s = {}) {
  // Teachers own their students' data; the owner only reads profiles.
  const owner = state.role === 'owner';
  const edit = !!s.id;
  modal(
    edit ? h(s.name) : 'Siswa baru',
    `${profileForm(s, edit, owner)}${edit ? studentDetails(s, owner) : ''}`
  );
}

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
// The owner sees the same fields but cannot submit them, so the fieldset is disabled.
function profileForm(s, edit, owner) {
  const grid = `<div class="form-grid">${field('Nama anak', 'name', 'text', s.name, 'required maxlength="120"')}${field('Nama panggilan', 'nickname', 'text', s.nickname, 'maxlength="60" placeholder="Boleh dikosongkan"')}${field('Sapaan orang tua', 'parent_name', 'text', s.parent_name, 'required maxlength="120"')}${field('Nomor WhatsApp', 'phone', 'tel', s.phone)}${birthField(s)}${gradeField(s)}</div>`;
  const hint =
    edit && owner
      ? '<p class="muted">Profil ini hanya dapat dibaca. Perubahan dilakukan oleh guru pendamping.</p>'
      : '';
  const save = owner
    ? ''
    : `<button class="primary full">${edit ? 'Simpan profil siswa' : 'Simpan siswa'}</button>`;
  return `<form data-form="student" data-id="${s.id || ''}"><fieldset ${owner ? 'disabled' : ''}>${grid}${hint}</fieldset>${save}</form>`;
}

// Everything below the profile, shown only for a child who already exists.
function studentDetails(s, owner) {
  return `${diagnosticResultSection(s)}${currentLevelSection(s)}${owner ? '' : studentActionsSection(s)}`;
}

// Hasil Tes Diagnostik. Guru pendamping melihat nilai per indikator; pemilik hanya ringkasannya,
// karena database tidak mengirim baris diagnostic_results kepada pemilik.
export function diagnosticResultSection(s) {
  const test = testFor(s.id);
  if (!test) return '';
  const marks = { T: '✓', B: '◐', N: '✗' };
  const items = state.diagnosticResults
    .filter(r => r.test_id === test.id)
    .sort((a, b) => a.indicator_number - b.indicator_number)
    .map(
      r =>
        `<li><span class="diagnostic-mark">${marks[r.rating] || '·'}</span> ${r.indicator_number}. ${h(r.indicator_text)}</li>`
    )
    .join('');
  const list = items ? `<ul class="diagnostic-result-list">${items}</ul>` : '';
  const beyond = test.passed && test.tested_level === 4 ? ' (melampaui Fondasi)' : '';
  const head = `<p class="muted">${h(test.tested_on)} · <strong>${h(testStatus(test))}</strong> → mulai belajar <strong>Level ${test.final_level}</strong>${beyond}</p>`;
  const revised = test.revised_at
    ? `<p class="muted">Direvisi ${h(new Date(test.revised_at).toLocaleDateString('id-ID'))}</p>`
    : '';
  const note = test.note ? `<p><strong>Catatan:</strong> ${h(test.note)}</p>` : '';
  const button =
    state.role === 'teacher' && s.status === 'Aktif'
      ? `<button type="button" class="secondary" data-action="diagnostic-revise" data-id="${s.id}">Revisi hasil tes</button>`
      : '';
  return `<hr><h3>Hasil tes diagnostik</h3>${head}${revised}${list}${note}${button}`;
}

// Level anak saat ini beserta deskriptornya dari kurikulum pilot.
export function currentLevelSection(s) {
  const lv = state.curriculumLevels.find(x => x.level === Number(s.pilot_level));
  const desc = lv ? `<p class="muted">${h(lv.description)}</p>` : '';
  const pending = s.pilot_level ? '' : '<p class="muted">Level ditentukan oleh Tes Diagnostik.</p>';
  return `<hr><h3>Level saat ini</h3><p><strong>${h(levelName(s.pilot_level))}</strong></p>${desc}${pending}`;
}

export function studentActionsSection(s) {
  const status =
    s.status === 'Aktif'
      ? `<p class="muted">Untuk anak yang berhenti atau cuti. Anak nonaktif tidak bisa dites diagnostik; datanya tetap tersimpan dan bisa diaktifkan kembali kapan saja.</p><button type="button" class="secondary danger" data-action="toggle-student" data-active="false" data-id="${s.id}">Nonaktifkan siswa ini</button>`
      : `<p class="muted">Siswa ini non-aktif. Datanya tetap tersimpan.</p><button type="button" class="secondary" data-action="toggle-student" data-active="true" data-id="${s.id}">Aktifkan kembali</button>`;
  const remove = `<p class="muted">Hanya untuk data yang salah input atau ganda. Siswa dihapus permanen beserta hasil tes diagnostiknya.</p><button type="button" class="secondary danger" data-action="delete-student" data-id="${s.id}">Hapus siswa ini</button>`;
  return `<hr><h3>Status siswa</h3>${status}<hr><h3>Hapus siswa</h3>${remove}`;
}
