// Ringkasan: sapaan, angka ringkas tentang siswa dan tes diagnostik, lalu daftar anak.
import { state, levelName } from '../state.js';
import { empty, heading } from '../ui.js';
import { escapeHtml as h } from '../domain.js';
import { studentRow, needsDiagnostic } from './students.js';

function statTile(label, icon, count, caption, tone = '') {
  return `<div class="stat${tone}"><span>${label} <i>${icon}</i></span><strong>${String(count).padStart(2, '0')}</strong><small>${caption}</small></div>`;
}

// Berapa anak aktif di tiap level kurikulum 8 level.
function levelPanel(active) {
  const rows = [1, 2, 3, 4, 5, 6, 7, 8]
    .map(l => {
      const n = active.filter(s => s.pilot_level === l).length;
      return `<article class="attention-item"><span class="badge ${n ? 'green' : ''}">${n} anak</span><h3>${h(levelName(l))}</h3></article>`;
    })
    .join('');
  return `<section class="panel attention"><div class="panel-heading"><h2>Sebaran level</h2><span>✧</span></div>${rows}</section>`;
}

function studentsPanel(active) {
  const untested = active.filter(needsDiagnostic);
  const list = [...untested, ...active.filter(s => !needsDiagnostic(s))].slice(0, 6);
  return `<section class="panel"><div class="panel-heading"><h2>Siswa</h2><button class="text-btn" data-view="students">Semua siswa →</button></div>${list.length ? list.map(studentRow).join('') : empty('Perjalanan dimulai di sini', 'Siswa baru ditambahkan oleh guru, lalu dites diagnostik.')}</section>`;
}

export function dashboard() {
  const owner = state.role === 'owner';
  const active = state.students.filter(s => s.status === 'Aktif');
  const untested = active.filter(needsDiagnostic).length;
  const button = owner
    ? '<button class="secondary" data-view="team">Kelola tim</button>'
    : '<button class="primary" data-action="new-student">＋ Tambah siswa</button>';
  const head = heading(
    owner ? 'PETA RUMAH BELAJAR' : 'HARI BARU, KESEMPATAN BARU',
    `Halo, ${h(state.name.split(' ')[0])} <span class="wave">✳</span>`,
    '',
    button
  );
  const teachers = state.members.filter(m => m.role === 'teacher' && m.active).length;
  const stats = `<div class="stats">${statTile('Siswa aktif', '◉', active.length, 'Perjalanan yang didampingi')}${statTile('Sudah dites', '✓', active.length - untested, 'Level awalnya sudah jelas')}${statTile('Belum dites', '◌', untested, 'Belum ada tes final', untested ? ' warm' : '')}${owner ? statTile('Guru aktif', '♧', teachers, 'Tim yang mendampingi') : ''}</div>`;
  return `${head}${stats}<div class="dashboard-grid">${studentsPanel(active)}${levelPanel(active)}</div>`;
}
