// Tab Kurikulum: satu bidang dibaca menurun dengan simpul spiral di antara level.
import { state, subjects, subjectLabels, indicatorsOf, phaseOf, phaseShort } from '../state.js';

import { escapeHtml as h } from '../domain.js';
import { empty, heading } from '../ui.js';
export function curriculumView() {
  const tab = state.curriculumTab === 'level' ? 'level' : 'strand';
  const tabs = `<div class="curriculum-tabs">${[
    ['strand', 'Per untaian'],
    ['level', 'Per level']
  ]
    .map(
      ([v, t]) =>
        `<button class="${tab === v ? 'active' : ''}" data-action="curriculum-tab" data-id="${v}">${t}</button>`
    )
    .join('')}</div>`;
  return `${heading('TANGGA KOMPETENSI', '16 level yang saling berulang dan bertumbuh.', 'Tujuan tetap; aktivitas berubah mengikuti tema, kelompok, dan kebutuhan anak.')}${tabs}<div class="notice">Bahasa Indonesia terdiri dari menyimak, berbicara, membaca, dan menulis. English Exposure wajib hadir dalam tema, tetapi tidak menjadi syarat kelulusan. Karakter diamati pada semua kegiatan.</div>${tab === 'level' ? curriculumByLevel() : curriculumByStrand()}`;
}
// Levels are a spiral, so the strand view reads down one subject and names the knot between each pair of levels.
export function curriculumByStrand() {
  const subject = subjects.includes(state.curriculumSubject) ? state.curriculumSubject : 'reading';
  const band = state.curriculumPhase || 'all';
  const pick = (label, action, items, current) =>
    `<div class="strand-picker"><span>${label}</span>${items.map(([v, t]) => `<button class="${v === current ? 'active' : ''}" data-action="${action}" data-id="${v}">${h(t)}</button>`).join('')}</div>`;
  const pickers =
    pick(
      'Bidang',
      'curriculum-subject',
      subjects.map(k => [k, subjectLabels[k]]),
      subject
    ) +
    pick(
      'Fase',
      'curriculum-phase',
      [
        ['all', 'Semua'],
        ['1', 'Fondasi 1–4'],
        ['2', 'Fase A 5–8'],
        ['3', 'Fase B 9–12'],
        ['4', 'Fase C 13–16']
      ],
      band
    );
  const rows = state.curriculum
    .filter(c => band === 'all' || Math.ceil(c.level / 4) === Number(band))
    .sort((x, y) => x.level - y.level);
  if (!rows.length)
    return (
      pickers +
      empty('Bank kurikulum', 'Enam belas level kurikulum akan tersedia setelah database terhubung.')
    );
  const body = rows
    .map((c, i) => {
      const header =
        i === 0 || phaseShort(c.level) !== phaseShort(rows[i - 1].level)
          ? `<h2 class="strand-band">${phaseShort(c.level)}</h2>`
          : '';
      return header + strandRung(c, subject) + spiralNode(c, subject);
    })
    .join('');
  return `${pickers}<div class="strand">${body}</div>`;
}
export function strandRung(c, k) {
  const list = indicatorsOf(c, k);
  const key = Number(c[`${k}_key`] || 0);
  const items = list.length
    ? `<ol class="indicator-list">${list.map((t, i) => `<li class="${i + 1 === key ? 'key' : ''}">${i + 1 === key ? '<span class="star" title="Simpul spiral">★</span>' : ''}${h(t)}</li>`).join('')}</ol>`
    : '<p class="muted">Indikator belum disusun untuk level ini.</p>';
  return `<article class="panel strand-rung"><div class="rung-head"><span class="badge green">LEVEL ${c.level}</span><span class="badge">${phaseShort(c.level)}</span></div><h4>Tujuan</h4><p>${h(c[k] || '—')}</p><h4>Indikator</h4>${items}<h4>Bukti berhasil</h4><small>${h(c[`${k}_criteria`] || 'Kriteria belum tersedia.')}</small>${state.role === 'owner' ? `<button class="secondary" data-action="edit-curriculum" data-id="${c.level}">Edit level ${c.level}</button>` : ''}</article>`;
}
export function spiralNode(c, k) {
  const key = Number(c[`${k}_key`] || 0);
  const note = c[`${k}_spiral`] || '';
  // A knot that crosses a phase boundary matters most: that step goes through the summative exam.
  // Level 16 has nothing above it, so its note closes the ladder instead of pointing onwards.
  const top = c.level === 16;
  const crossing = c.level % 4 === 0;
  if (!note)
    return `<div class="spiral-node muted-node"><span aria-hidden="true">↓</span><p>${top ? 'Penutup tangga belum ditulis.' : 'Simpul spiral menuju level berikutnya belum ditulis.'}</p></div>`;
  const label = top
    ? `Menutup tangga${key ? ` → indikator ${key}` : ''} · kelulusan setelah ujian sumatif akhir`
    : `Simpul spiral${key ? ` → indikator ${key}` : ''}${crossing ? ` · menuju ${phaseShort(c.level + 1)} lewat ujian sumatif` : ''}`;
  return `<div class="spiral-node${crossing ? ' crossing' : ''}${top ? ' top' : ''}"><span class="star" aria-hidden="true">${crossing ? '⇅' : '★'}</span><div><strong>${label}</strong><p>${h(note)}</p></div></div>`;
}
export function curriculumByLevel() {
  const detail = (c, k) => {
    const list = indicatorsOf(c, k);
    const key = Number(c[`${k}_key`] || 0);
    return `<details><summary>${h(subjectLabels[k])} <em>(${list.length || '–'})</em></summary><p>${h(c[k])}</p>${list.length ? `<ol class="indicator-list">${list.map((t, i) => `<li class="${i + 1 === key ? 'key' : ''}">${h(t)}</li>`).join('')}</ol>` : '<p class="muted">Indikator belum disusun.</p>'}<small><strong>Bukti berhasil</strong><br>${h(c[`${k}_criteria`] || 'Kriteria belum tersedia.')}</small></details>`;
  };
  return `<div class="curriculum-grid">${state.curriculum.map(c => `<article class="panel curriculum-card"><span class="badge green">LEVEL ${c.level}</span><h2>${phaseOf(c.level)}</h2><h3>Bahasa Indonesia</h3>${['listening', 'speaking', 'reading', 'writing'].map(k => detail(c, k)).join('')}<h3>Matematika</h3>${detail(c, 'math')}<h3>IPAS tematik</h3>${detail(c, 'ipas')}<h3>English Exposure</h3>${detail(c, 'english')}${state.role === 'owner' ? `<button class="secondary" data-action="edit-curriculum" data-id="${c.level}">Edit tujuan & kriteria</button>` : ''}</article>`).join('') || empty('Bank kurikulum', 'Enam belas level kurikulum akan tersedia setelah database terhubung.')}</div>`;
}
// Indicators arrive as jsonb; tolerate a string payload so older rows keep rendering.
