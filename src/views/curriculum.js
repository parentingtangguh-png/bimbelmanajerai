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
  return `<article class="panel curriculum-themes"><h3>Tema</h3><p class="muted">Berjalan menurut nomor pertemuan, sama untuk semua siswa. Buka tema untuk melihat deskriptornya.</p>${themes.map(themeDetail).join('')}</article>`;
}

// One theme: the summary line stays short; the descriptor opens below it.
export function themeDetail(t) {
  const row = (label, value) => (value ? `<div><dt>${label}</dt><dd>${value}</dd></div>` : '');
  return `<details class="theme-detail"><summary><span class="theme-no">${t.number}</span><strong>${h(t.name)}</strong><small>Pertemuan ${t.first_meeting}–${t.last_meeting}</small></summary>${t.description ? `<p>${h(t.description)}</p>` : ''}<dl>${row('Indikator yang paling dilatih', focusList(t))}${row('Karakter yang ditonjolkan', h(t.character_focus || ''))}${row('English theme words', h(t.english_words || ''))}</dl></details>`;
}

// Focus indicators are stored as "L<level>-<number>"; the text is looked up so teachers need not.
function focusList(t) {
  const refs = (t.focus_indicators || [])
    .map(ref => {
      const [, lv, no] = String(ref).match(/^L(\d+)-(\d+)$/) || [];
      const ind = state.curriculumIndicators.find(i => i.level === Number(lv) && i.number === Number(no));
      return `<li><span class="badge">${h(ref)}</span> ${h(ind ? ind.text : 'indikator tidak ditemukan')}</li>`;
    })
    .join('');
  if (!t.focus_areas && !refs) return '';
  return `${h(t.focus_areas || '')}${refs ? `<ul class="theme-focus">${refs}</ul>` : ''}`;
}
