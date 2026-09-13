// Tab Kurikulum: CP fase, level beserta 8 indikatornya, lalu tema yang berjalan menurut nomor pertemuan.
import { state } from '../state.js';

import { escapeHtml as h } from '../domain.js';
import { empty, heading } from '../ui.js';

export function curriculumView() {
  const intro = heading(
    'KURIKULUM PILOT',
    'Fase Fondasi, empat level.',
    'Setiap anak punya level sendiri; tema berjalan menurut pertemuan dan sama untuk semua anak.'
  );
  if (!state.curriculumPhases.length)
    return (
      intro + empty('Kurikulum', 'Kurikulum sedang disiapkan. Isinya akan tampil di sini setelah dipasang.')
    );
  return intro + state.curriculumPhases.map(phaseSection).join('');
}

function phaseSection(p) {
  const levels = state.curriculumLevels
    .filter(l => l.phase_code === p.code)
    .sort((a, b) => a.level - b.level);
  const themes = state.curriculumThemes
    .filter(t => t.phase_code === p.code)
    .sort((a, b) => a.number - b.number);
  return `${cpPanel(p)}<div class="curriculum-grid">${levels.map(levelCard).join('')}</div>${themeTable(themes)}`;
}

export function cpPanel(p) {
  return `<article class="panel curriculum-cp"><span class="badge green">CP ${h(p.name).toUpperCase()}</span><p>${h(p.cp)}</p></article>`;
}

export function levelCard(l) {
  const items = state.curriculumIndicators
    .filter(i => i.level === l.level)
    .sort((a, b) => a.number - b.number)
    .map(i => `<li>${h(i.text)} <span class="badge">${h(i.domain)}</span></li>`)
    .join('');
  const list = items
    ? `<ol class="indicator-list">${items}</ol>`
    : '<p class="muted">Indikator belum disusun untuk level ini.</p>';
  return `<article class="panel curriculum-card"><span class="badge green">LEVEL ${l.level}</span><h2>${h(l.title)}</h2><p>${h(l.description)}</p><h4>Indikator</h4>${list}</article>`;
}

export function themeTable(themes) {
  if (!themes.length) return '';
  const rows = themes
    .map(
      t => `<tr><td>${t.number}</td><td>${h(t.name)}</td><td>${t.first_meeting}–${t.last_meeting}</td></tr>`
    )
    .join('');
  return `<article class="panel curriculum-themes"><h3>Tema</h3><p class="muted">Berjalan menurut nomor pertemuan, sama untuk semua siswa.</p><div class="table-scroll"><table><thead><tr><th>Tema</th><th>Nama</th><th>Pertemuan</th></tr></thead><tbody>${rows}</tbody></table></div></article>`;
}
