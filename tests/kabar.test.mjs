import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { loadSampleState } from './fixtures/sample-state.mjs';
import { state } from '../src/state.js';
import { buildKabar, OUT } from '../scripts/build-kabar.mjs';
import { parentMessage, parentWhatsappLink, waNumber, targetLevel, progressBar } from '../src/kabar.js';
import { meetingSheet } from '../src/views/sessions.js';

const PROTECTED = ['buku', 'bola', 'susu', 'mata', 'kaki', 'sapi', 'lap', 'air', 'roti', 'pot', 'apel', 'pena'];

test('kabar orang tua: data sama dengan dokumen dan lengkap', async () => {
  const { data, js } = buildKabar();
  assert.equal((await readFile(new URL(`../${OUT}`, import.meta.url), 'utf8')).replace(/\r\n/g, '\n'), js, 'dokumen berubah: jalankan node scripts/build-kabar.mjs');
  assert.equal(data.indicators.length, 112);
  assert.equal(data.themes.length, 32);
  for (const list of ['penyemangat', 'penyemangatUlang', 'penutup']) assert.equal(data[list].length, 3, list);
  for (const i of data.indicators) {
    for (const k of ['berhasil', 'berlatih', 'berikutnya']) assert.ok(i[k] && i[k].split(/\s+/).length <= 10, `L${i.level}/${i.number} ${k}`);
    for (const w of PROTECTED) assert.ok(!new RegExp(`\\b${w}\\b`, 'i').test(i.rumah), `L${i.level}/${i.number} memakai ${w}`);
    assert.ok(!/kancing/i.test(i.rumah) || i.level >= 5, `L${i.level}/${i.number} kancing untuk anak kecil`);
  }
});

test('kabar orang tua: nomor WhatsApp, tahap tujuan, dan kotak kemajuan', () => {
  assert.equal(waNumber('0812-3456-7890'), '6281234567890');
  assert.equal(waNumber('+62 812 3456 789'), '628123456789');
  assert.equal(waNumber('812345678'), '62812345678');
  assert.equal(waNumber(''), '');
  assert.equal(waNumber('12345'), '');
  assert.equal(targetLevel('TK A'), 2);
  assert.equal(targetLevel('Belum sekolah'), 2);
  assert.equal(targetLevel('TK B'), 4);
  assert.equal(targetLevel('SD 3'), 8);
  assert.equal(targetLevel(''), null);
  assert.equal(progressBar(3), '🟩🟩🟩⬜⬜⬜⬜⬜⬜⬜⬜⬜');
});

function kelas(rows) {
  loadSampleState();
  Object.assign(state, {
    k8Themes: [{ number: 1, name: 'Rumah dan Kebiasaan Harian', first_meeting: 1, last_meeting: 24 }],
    k8Subthemes: [
      { theme: 1, position: 1, name: 'Ruang di rumah', first_meeting: 1, last_meeting: 6 },
      { theme: 1, position: 2, name: 'Alat kebersihan', first_meeting: 7, last_meeting: 12 }
    ],
    classSchedules: [{ id: 'j1', meeting_number: 6, theme_number: 1, scheduled_date: '2026-09-21', completed_at: 'x' }],
    classScheduleStudents: rows.map(r => ({ schedule_id: 'j1', english_result: null, character_result: null, ...r }))
  });
}

test('kabar orang tua: anak Lulus hari ini, karakter dan English selalu ada, tanpa jenjang kelas', () => {
  // Alya (TK B, Level 3): diagnostik 1 dan 14 Lulus; hari ini indikator 2 Lulus.
  kelas([{ student_id: 'anak-1', level: 3, indicator_number: 2, result: 'lulus' }]);
  const m = parentMessage('j1', 'anak-1');
  assert.match(m, /^Assalamu'alaikum Bunda Contoh 😊/);
  assert.match(m, /Hari ini Alya belajar di tema "Rumah dan Kebiasaan Harian"\./);
  assert.match(m, /✨ Alhamdulillah, Alya berhasil mengenali huruf s, t, l, k, d!/);
  assert.match(m, /🤝 Alya sudah terbiasa mengucapkan terima kasih setelah dibantu\. Terus dijaga di rumah ya!/, 'Karakter sudah Lulus di diagnostik');
  assert.match(m, /🔤 English yang sedang Alya kenal: menyebut nama benda English\./);
  assert.match(m, /🔜 Pertemuan berikutnya Alya mulai mengenali angka enam sampai sepuluh, sambil mengenal alat untuk menjaga sekitar tetap rapi\. Jangan sampai terlewat ya!/, 'kait subtema pertemuan berikutnya');
  assert.match(m, /🏠 Latihan kecil di rumah: Tulis dua angka, lalu minta Alya menunjuk angka yang disebut\./);
  assert.match(m, /📈 Kemajuan Alya di tahap 3:\n🟩🟩⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜\nTinggal 10 kemampuan lagi untuk naik ke tahap 4 — tahap yang kita tuju bersama!/);
  assert.match(m, /Rumah Belajar Rainbow Kids Alfatih$/);
  for (const kata of ['TK', 'kelas', 'Level', 'Belum', 'gagal', 'tertinggal', '{']) assert.ok(!m.includes(kata), `pesan memuat "${kata}"`);
  assert.ok(!/\n\n\n/.test(m), 'tanpa baris kosong ganda');
});

test('kabar orang tua: anak belum Lulus tidak disebut Belum dan mencoba lagi; tombol hanya di sesi selesai', () => {
  kelas([{ student_id: 'anak-1', level: 3, indicator_number: 2, result: 'belum', character_result: 'belum', english_result: 'lulus' }]);
  const m = parentMessage('j1', 'anak-1');
  assert.match(m, /✏️ Alya sedang berlatih mengenali huruf s, t, l, k, d\. /);
  assert.match(m, /🔜 Pertemuan berikutnya Alya mencoba lagi\. .+ Jangan sampai terlewat ya!/);
  assert.match(m, /🔤 Alhamdulillah, Alya berhasil menyebut nama benda dalam English!/);
  assert.ok(!m.includes('Belum'));
  assert.equal(parentMessage('j1', 'anak-1'), m, 'pesan sama bila dibuka ulang');
  // Alya punya nomor 081200000000.
  assert.match(parentWhatsappLink('j1', 'anak-1'), /^https:\/\/wa\.me\/6281200000000\?text=Assalamu/);
  const sheet = meetingSheet('j1');
  assert.match(sheet, /class="wa-button" href="https:\/\/wa\.me\/6281200000000\?text=[^"]+" target="_blank" rel="noopener">WhatsApp ke Bunda Contoh<\/a>/);
  state.role = 'owner';
  assert.ok(!meetingSheet('j1').includes('wa-button'), 'pemilik tidak mengirim kabar');
  state.role = 'teacher';
  state.classSchedules[0].completed_at = null;
  assert.ok(!meetingSheet('j1').includes('wa-button'), 'sesi belum selesai');
  state.classSchedules[0].completed_at = 'x';
  state.students[0].phone = '';
  assert.match(meetingSheet('j1'), /wa-button off">Nomor WhatsApp orang tua belum diisi/);
});

test('kabar orang tua: siap naik, melewati tujuan, dan tahap 8 tuntas', () => {
  kelas([{ student_id: 'anak-1', level: 3, indicator_number: 12, result: 'lulus' }]);
  state.diagnosticResults.push(...[2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(number => ({ test_id: 'tes-1', number, status: 'lulus', package: 'utama' })));
  const siap = parentMessage('j1', 'anak-1');
  assert.match(siap, /🌟 Alya sudah menguasai semua 12 kemampuan di tahap 3! Guru akan segera mengajak Alya naik ke tahap berikutnya\./);
  assert.ok(!siap.includes('🔜') && !siap.includes('🏠'), 'tanpa indikator berikutnya');
  state.students[0].school_grade = 'TK A';
  state.students[0].pilot_level = 3;
  state.diagnosticResults = state.diagnosticResults.filter(r => r.number <= 4);
  assert.match(parentMessage('j1', 'anak-1'), /🎉 Alya sudah melewati tahap yang kita tuju! Kemajuan di tahap 3:/);
  state.students[0].pilot_level = 8;
  state.classScheduleStudents[0].level = 8;
  state.diagnosticTests[0].tested_level = 8;
  state.diagnosticResults.push(...[5, 6, 7, 8, 9, 10, 11].map(number => ({ test_id: 'tes-1', number, status: 'lulus', package: 'utama' })));
  assert.match(parentMessage('j1', 'anak-1'), /🏆 Alya sudah menuntaskan kedelapan tahap belajar di Rumah Belajar Rainbow Kids Alfatih!/);
});
