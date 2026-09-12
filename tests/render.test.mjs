import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSampleState } from './fixtures/sample-state.mjs';
import { state } from '../src/state.js';
import { sessionsView } from '../src/views/sessions.js';
import { dashboard } from '../src/views/dashboard.js';
import { studentsView } from '../src/views/students.js';
import { curriculumView } from '../src/views/curriculum.js';
import { teamView } from '../src/views/team.js';

// The screens are plain functions that return HTML, so they can be checked without a browser, a
// login, or the preview. These cover the evaluation card in particular, which no browser test can
// reach because the preview has no class sessions.

const count = (html, needle) => html.split(needle).length - 1;

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
