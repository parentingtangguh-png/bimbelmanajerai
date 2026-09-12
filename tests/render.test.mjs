import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSampleState, SESSION } from './fixtures/sample-state.mjs';
import { state } from '../src/state.js';
import { sessionsView } from '../src/views/sessions.js';
import { dashboard } from '../src/views/dashboard.js';
import { studentsView, scheduleForm } from '../src/views/students.js';
import { curriculumView } from '../src/views/curriculum.js';
import { teamView } from '../src/views/team.js';

// The screens are plain functions that return HTML, so they can be checked without a browser, a
// login, or the preview. These cover the evaluation card in particular, which no browser test can
// reach because the preview has no class sessions.

const count = (html, needle) => html.split(needle).length - 1;

// studentForm and scheduleForm write through modal(), which needs one DOM node. Faking that node
// is all it takes to bring those two under test as well.
let modalHtml = '';
globalThis.document = {
  querySelector: () => ({
    set innerHTML(v) {
      modalHtml = v;
    },
    showModal() {}
  })
};
const openModal = (fn, arg) => {
  modalHtml = '';
  fn(arg);
  return modalHtml;
};

test('kartu evaluasi menampilkan indikator, centang tersimpan, dan riwayat', () => {
  loadSampleState();
  const html = sessionsView();

  // Anak yang hadir: tiga indikator Membaca, satu tercentang, satu pernah terlihat di sesi lalu.
  assert.equal(count(html, 'class="indicator-check"'), 6, 'dua target x tiga indikator');
  // Dua yang tercentang: satu indikator yang tersimpan, satu dimensi karakter dari observasi.
  assert.equal(count(html, 'checked'), 2, 'hanya yang tersimpan yang tercentang');
  assert.match(html, /Pernah terlihat di sesi sebelumnya pada level ini: indikator 2/);
  assert.match(html, /sudah pernah/);

  // Saran penilaian dihitung dari centang yang tersimpan, bukan menunggu guru mengklik.
  assert.match(html, /1 dari 3 tercapai/);
  assert.match(html, /simpul menuju level berikutnya/);

  // Tujuan level ikut ditampilkan dari kurikulum.
  assert.match(html, /Tujuan level 1/);
  assert.match(html, /Mengenali 8 huruf vokal dan konsonan/);
});

test('anak tidak hadir memakai formulir pendek, tanpa penilaian', () => {
  loadSampleState();
  const html = sessionsView();
  assert.match(html, /tercatat Sakit/);
  assert.match(html, /Tidak ada penilaian dan level tidak berubah/);
});

test('evaluasi yang sudah disimpan terkunci', () => {
  loadSampleState();
  const html = sessionsView();
  assert.match(html, /Evaluasi tersimpan/);
  assert.match(html, /✓ Sudah diselesaikan/);
});

test('hanya evaluasi terakhir anak yang menawarkan koreksi', () => {
  loadSampleState();
  // rec-2 sudah final dan merupakan satu-satunya evaluasi anak-2, jadi boleh dikoreksi.
  assert.equal(count(sessionsView(), 'data-action="reopen-eval"'), 1);

  // Anak yang masih punya sesi terbuka tidak boleh mengoreksi yang lama dulu.
  state.records.push({
    id: 'rec-baru',
    session_id: SESSION,
    student_id: 'anak-2',
    attendance: 'Hadir',
    group_no: 1,
    anecdote: '',
    report: '',
    finalized_at: null
  });
  assert.equal(count(sessionsView(), 'data-action="reopen-eval"'), 0);

  // Anak yang sudah lulus juga tidak, karena koreksinya tidak lagi mengubah apa pun.
  loadSampleState();
  state.students.find(s => s.id === 'anak-2').status = 'Lulus';
  assert.equal(count(sessionsView(), 'data-action="reopen-eval"'), 0);
});

test('bagian rapor muncul; tautan WhatsApp hanya bila ada rapor dan nomor', () => {
  loadSampleState();
  const html = sessionsView();
  assert.match(html, /Kabar untuk orang tua/);
  // Anak yang sudah punya rapor pada contoh ini tidak punya nomor, jadi yang tampil ajakan melengkapi.
  assert.match(html, /Lengkapi nomor WhatsApp di profil siswa/);
  assert.ok(!html.includes('wa.me'), 'tanpa nomor tidak ada tautan');

  // Dengan nomor terisi, tautannya muncul.
  state.students.find(x => x.id === 'anak-2').phone = '081200000001';
  assert.match(sessionsView(), /Periksa & buka WhatsApp/);
});

test('ringkasan menghitung siswa aktif dan menampilkan barisnya', () => {
  loadSampleState();
  state.view = 'dashboard';
  const html = dashboard();
  assert.equal(count(html, 'class="student-row"'), 2);
  assert.match(html, /Alya Contoh/);
  assert.match(html, /Minat belum diisi/, 'anak tanpa minat tetap terbaca');
});

test('daftar siswa dan kurikulum tersusun dari data yang sama', () => {
  loadSampleState();
  assert.match(studentsView(), /Alya Contoh/);
  const kur = curriculumView();
  assert.equal(count(kur, 'strand-rung'), 2, 'dua level pada contoh');
  assert.match(kur, /Simpul spiral/);
});

test('daftar sesi memisahkan yang belum selesai dan membatasi riwayat', () => {
  loadSampleState();
  state.active = null;
  // 14 sesi selesai + 1 belum, supaya batas 10 terlihat bekerja.
  state.classes = [];
  state.records = [];
  for (let i = 0; i < 15; i++) {
    const id = `kelas-${i}`;
    state.classes.push({
      id,
      date: `2026-09-${String(i + 1).padStart(2, '0')}`,
      theme: `Tema ${i}`,
      duration_minutes: 60,
      start_time: null,
      material: '',
      created_at: '2026-09-01T00:00:00Z'
    });
    state.records.push({
      id: `r-${i}`,
      session_id: id,
      student_id: 'anak-1',
      attendance: 'Hadir',
      group_no: 1,
      anecdote: '',
      report: '',
      finalized_at: i === 0 ? null : '2026-09-11T03:00:00Z'
    });
  }
  const html = sessionsView();
  assert.match(html, /Belum selesai dievaluasi/);
  // Satu yang terbuka selalu tampil, plus sepuluh terbaru dari empat belas yang selesai.
  assert.equal(count(html, 'data-action="open-session"'), 11);
  assert.match(html, /Tampilkan 4 sesi sebelumnya/);

  state.allSessions = true;
  assert.equal(count(sessionsView(), 'data-action="open-session"'), 15);
});

test('pembatalan sesi hanya ditawarkan selama belum ada evaluasi tersimpan', () => {
  loadSampleState();
  // Contoh bawaan punya satu evaluasi tersimpan (rec-2), jadi tawarannya tidak muncul.
  assert.equal(count(sessionsView(), 'data-action="delete-class"'), 0);

  loadSampleState();
  state.records.forEach(r => (r.finalized_at = null));
  const html = sessionsView();
  assert.equal(count(html, 'data-action="delete-class"'), 1);
  assert.match(html, /Batalkan sesi ini/);
});

test('sesi jadwal menampilkan anggota non-aktif, bukan menyembunyikannya', () => {
  loadSampleState();
  state.schedules = [{ id: 'jad-1', name: 'Pagi', start_time: '08:00:00', end_time: '09:15:00' }];
  state.scheduleStudents = [
    { schedule_id: 'jad-1', student_id: 'anak-1' },
    { schedule_id: 'jad-1', student_id: 'anak-2' }
  ];
  state.students.find(s => s.id === 'anak-2').status = 'Non-Aktif';

  const html = openModal(scheduleForm, state.schedules[0]);
  // Keduanya punya kotak centang: yang tidak dirender akan terhapus diam-diam saat disimpan.
  assert.equal(count(html, 'name="student"'), 2);
  assert.match(html, /value="anak-2" checked/);
  assert.match(html, /non-aktif/, 'anggota non-aktif ditandai, bukan disembunyikan');
});

test('tim pengajar: pemilik tanpa tombol, guru bisa dinonaktifkan dan diaktifkan', () => {
  loadSampleState();
  const html = teamView();
  assert.match(html, /Pemilik Contoh/);
  // Only the two teachers get a toggle; the owner must not be able to lock themselves out.
  assert.equal(count(html, 'data-action="toggle-member"'), 2);
  assert.equal(count(html, '>Nonaktifkan<'), 1, 'guru aktif bisa dinonaktifkan');
  assert.equal(count(html, '>Aktifkan<'), 1, 'guru nonaktif bisa diaktifkan');
  assert.ok(!html.includes('data-id="pemilik@contoh.test"'), 'pemilik tidak punya tombol');
});

test('tidak ada kebocoran undefined atau [object Object] di layar mana pun', () => {
  loadSampleState();
  for (const [name, html] of [
    ['sessions', sessionsView()],
    ['dashboard', dashboard()],
    ['students', studentsView()],
    ['curriculum', curriculumView()],
    ['team', teamView()]
  ]) {
    assert.ok(!html.includes('undefined'), name + ' memuat undefined');
    assert.ok(!html.includes('[object Object]'), name + ' memuat [object Object]');
    assert.ok(!html.includes('NaN'), name + ' memuat NaN');
  }
});
