// Ringkasan: sapaan, angka ringkas, dan catatan untuk guru atau pemilik.
import { state, ready } from '../state.js';
import { empty, heading } from '../ui.js';
import { escapeHtml as h, localDate } from '../domain.js';
import { studentRow } from './students.js';
export function ownerDashboard() {
  const active = state.students.filter(s => s.status === 'Aktif');
  const today = state.classes.filter(c => c.date === localDate());
  const interventions = state.alerts.filter(a => a.intervention);
  const sum = active.filter(ready);
  const pending = state.records.filter(r => !r.finalized_at).length;
  const teachers = state.members.filter(m => m.role === 'teacher' && m.active).length;
  return (
    heading(
      'PETA RUMAH BELAJAR',
      'Halo, ' + h(state.name.split(' ')[0]) + ' <span class="wave">✳</span>',
      'Berikut hal penting yang membutuhkan perhatian Anda hari ini.',
      '<button class="secondary" data-action="new-member">Kelola tim</button>'
    ) +
    '<div class="stats"><div class="stat"><span>Siswa aktif <i>◉</i></span><strong>' +
    active.length.toString().padStart(2, '0') +
    '</strong><small>Total perjalanan belajar</small></div><div class="stat"><span>Guru aktif <i>♧</i></span><strong>' +
    teachers.toString().padStart(2, '0') +
    '</strong><small>Tim yang mendampingi</small></div><div class="stat"><span>Sesi hari ini <i>▤</i></span><strong>' +
    today.length.toString().padStart(2, '0') +
    '</strong><small>Kelas yang berlangsung</small></div><div class="stat warm"><span>Perlu perhatian <i>♡</i></span><strong>' +
    interventions.length.toString().padStart(2, '0') +
    '</strong><small>Alarm untuk ditinjau</small></div></div>' +
    '<div class="dashboard-grid"><section class="panel"><div class="panel-heading"><div><h2>Perlu keputusan</h2><p>Ringkasan pengecualian, bukan pekerjaan kelas.</p></div><span>✧</span></div>' +
    (interventions.length
      ? interventions
          .map(
            a =>
              '<article class="attention-item"><span class="badge amber">Pendampingan khusus</span><h3>' +
              h(state.students.find(s => s.id === a.student_id)?.name || 'Siswa') +
              '</h3><p>Tiga kali mengulang di level yang sama. Tinjau bersama guru pendamping.</p></article>'
          )
          .join('')
      : '<article class="attention-item"><span class="badge green">Semua terkendali</span><h3>Tidak ada alarm intervensi</h3><p>Belum ada siswa yang membutuhkan keputusan khusus.</p></article>') +
    (sum.length
      ? '<article class="attention-item"><span class="badge green">Siap sumatif</span><h3>' +
        sum.length +
        ' siswa mencapai target</h3><p>Ujian sumatif dan kelulusan dicatat oleh guru pendamping.</p></article>'
      : '') +
    '</section><section class="panel"><div class="panel-heading"><div><h2>Ketertiban operasional</h2><p>Pemilik memantau; guru menyelesaikan.</p></div><span>◌</span></div><article class="attention-item"><span class="badge ' +
    (pending ? 'amber' : 'green') +
    '">' +
    (pending ? 'Perlu ditinjau' : 'Rapi') +
    '</span><h3>' +
    (pending ? pending + ' sesi belum selesai dievaluasi' : 'Semua sesi sudah dievaluasi') +
    '</h3><p>Guru tetap menjadi pelaksana utama kegiatan kelas.</p></article></section></div>'
  );
}
export function dashboard() {
  if (state.role === 'owner') return ownerDashboard();
  const active = state.students.filter(s => s.status === 'Aktif');
  const today = state.classes.filter(c => c.date === localDate());
  const interventions = state.alerts.filter(a => a.intervention);
  const sum = active.filter(ready);
  return [
    greetingBand(state),
    welcomeBand(),
    statBand(active, today, sum, interventions),
    panelBand(active, interventions, sum)
  ].join('');
}

// The four bands of the teacher dashboard, so one can be changed without rereading the rest.
function greetingBand(state) {
  return heading(
    'HARI BARU, KESEMPATAN BARU',
    `Halo, ${h(state.name.split(' ')[0])} <span class="wave">✳</span>`,
    'Mari temani langkah kecil yang berarti hari ini.',
    '<button class="primary" data-action="new-session">＋ Mulai sesi kelas</button>'
  );
}

// The welcome band is a copy column beside a decorative one. The motif is purely ornamental, so
// it is kept apart from the words that a teacher actually reads.
function welcomeCopy() {
  return `<div><span class="pill light">BELAJAR SESUAI RITME ANAK</span><h2>Bukan siapa yang paling cepat.<br>Melainkan siapa yang terus bertumbuh.</h2><p>Kenali minatnya, dampingi prosesnya, rayakan kemajuannya.</p><button data-view="students">Lihat perjalanan siswa <span>↗</span></button></div>`;
}

function growthArt() {
  return `<div class="growth-art" aria-hidden="true"><div class="orbit"></div><span class="petal p1"></span><span class="petal p2"></span><span class="petal p3"></span><span class="stem"></span><span class="art-label">TUMBUH DENGAN CARANYA</span></div>`;
}

function welcomeBand() {
  return `<section class="welcome">${welcomeCopy()}${growthArt()}</section>`;
}

// Every tile in the band is the same shape, so it is written once and filled four times.
function statTile(label, icon, list, caption, tone = '') {
  const count = list.length.toString().padStart(2, '0');
  return `<div class="stat${tone}"><span>${label} <i>${icon}</i></span><strong>${count}</strong><small>${caption}</small></div>`;
}

function statBand(active, today, sum, interventions) {
  const warm = state.role === 'owner';
  return `<div class="stats">${statTile('Siswa aktif', '◉', active, 'Perjalanan yang kita dampingi')}${statTile('Sesi hari ini', '▤', today, 'Ruang untuk belajar bersama')}${statTile('Siap ujian sumatif', '✧', sum, 'Target belajar sudah tercapai')}${warm ? statTile('Butuh perhatian', '♡', interventions, 'Mari dampingi lebih dekat', ' warm') : ''}</div>`;
}

function panelBand(active, interventions, sum) {
  return [journeyPanel(active, interventions, sum), notesPanel(active, interventions, sum)].join('');
}

// Left: the children. Right: what needs the teacher's attention today.
function journeyPanel(active, interventions, sum) {
  return `<div class="dashboard-grid"><section class="panel"><div class="panel-heading"><h2>Perjalanan belajar</h2><button class="text-btn" data-view="students">Semua siswa →</button></div>${active.length ? active.slice(0, 5).map(studentRow).join('') : empty('Perjalanan dimulai di sini', 'Tambahkan siswa pertama untuk mulai mendampingi belajarnya.')}</section>`;
}

// Three kinds of note can land in the right column. Each builds its own article so one can be
// reworded without rereading the others; the HTML is what the single template produced before.
function interventionNote(a) {
  return `<article class="attention-item"><span class="badge amber">Pendampingan khusus</span><h3>${h(state.students.find(s => s.id === a.student_id)?.name)}</h3><p>Tiga kali mengulang di level yang sama. Tinjau pendekatan belajar dan diskusikan dengan guru.</p></article>`;
}

function encouragementNote() {
  return `<article class="attention-item"><span class="badge green">Langkah hari ini</span><h3>Mulai dari rasa ingin tahu</h3><p>Gunakan minat anak sebagai pintu masuk sebelum mengenalkan tantangan baru.</p></article>`;
}

function summativeNote(sum) {
  if (!sum.length) return '';
  return `<article class="attention-item"><span class="badge green">Siap sumatif</span><h3>${sum.length} siswa mencapai target</h3><p>Buka profil siswa untuk mencatat hasil ujian akhir.</p></article>`;
}

function notesPanel(active, interventions, sum) {
  const showIntervention = state.role === 'owner' && interventions.length;
  const notes = showIntervention ? interventions.map(a => interventionNote(a)).join('') : encouragementNote();
  return `<section class="panel attention"><div class="panel-heading"><h2>Catatan untuk Anda</h2><span>✧</span></div>${notes}${summativeNote(sum)}<div class="quote">“Kemajuan kecil tetaplah kemajuan.”<small>Pengingat untuk hari ini</small></div></section></div>`;
}
