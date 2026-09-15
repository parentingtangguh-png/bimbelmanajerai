// Tab Kurikulum: CP fase, level beserta 8 indikatornya, lalu tema yang berjalan menurut nomor pertemuan.
import { state } from '../state.js';

import { escapeHtml as h } from '../domain.js';
import { empty, heading } from '../ui.js';
import { inlineMarkdown, renderMarkdown } from '../markdown.js';

export function curriculumView() {
  if (state.k8Levels.length) return k8CurriculumView();
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
    .map(i => `<li>${h(i.text)} <span class="badge">${h(i.domain)}</span>${indicatorTest(i)}</li>`)
    .join('');
  const list = items
    ? `<ol class="indicator-list">${items}</ol>`
    : '<p class="muted">Indikator belum disusun untuk level ini.</p>';
  return `<article class="panel curriculum-card"><span class="badge green">LEVEL ${l.level}</span><h2>${h(l.title)}</h2><p>${h(l.description)}</p><h4>Indikator</h4>${list}</article>`;
}

// Cara indikator ini diuji di Tes Diagnostik, disimpan bersama indikatornya.
export function indicatorTest(i) {
  if (!i.diagnostic_task) return '';
  const when = i.diagnostic_observe ? ' <em>(diamati sepanjang tes)</em>' : '';
  return `<details class="indicator-test"><summary>Tes diagnostik${when}</summary><dl><div><dt>Tugas</dt><dd>${h(i.diagnostic_task)}</dd></div><div><dt>Bahan</dt><dd>${h(i.diagnostic_material)}</dd></div><div><dt>Tercapai bila</dt><dd>${h(i.diagnostic_success)}</dd></div></dl></details>`;
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

// ---- Kurikulum 8 level (tabel k8_*, dibangkitkan dari docs/curriculum/) ----

const K8_SLOT_NAMES = {
  A1: 'Menyimak',
  A2: 'Berbicara',
  B1: 'Huruf',
  B2: 'Bunyi',
  C1: 'Membaca',
  C2: 'Makna tulisan',
  D1: 'Menyalin',
  D2: 'Menulis',
  E1: 'Lambang bilangan',
  E2: 'Kuantitas',
  F1: 'Pola, bentuk, ukuran',
  F2: 'Operasi hitung',
  EN: 'English',
  KR: 'Karakter'
};
const K8_DOC_NAMES = {
  A: 'Alur A — Menyimak dan Berbicara',
  B: 'Alur B — Huruf dan Bunyi',
  C: 'Alur C — Membaca',
  D: 'Alur D — Menulis',
  E: 'Alur E — Bilangan',
  F: 'Alur F — Pola, Bentuk, Ukuran & Operasi Hitung',
  EK: 'English dan Karakter'
};

export function k8CurriculumView() {
  const intro = heading(
    'KURIKULUM 8 LEVEL',
    'Dari TK A sampai akhir kelas I.',
    'Isi terkunci dari dokumen kurikulum. Tes diagnostik dan Ruang kelas masih memakai kurikulum pilot sampai pembaruan berikutnya.'
  );
  const levels = [...state.k8Levels].sort((a, b) => a.level - b.level);
  const themes = [...state.k8Themes].sort((a, b) => a.number - b.number);
  return `${intro}<article class="panel curriculum-cp k8-cp"><span class="badge green">CAPAIAN PEMBELAJARAN</span>${renderMarkdown(state.k8Cp)}</article><section class="k8-levels">${levels.map(k8LevelCard).join('')}</section>${k8RulesPanel()}${k8ThemesPanel(themes)}`;
}

export function k8LevelCard(l) {
  const items = state.k8Indicators
    .filter(i => i.level === l.level)
    .sort((a, b) => a.number - b.number)
    .map(k8IndicatorItem)
    .join('');
  return `<details class="panel k8-level"><summary><span class="badge green">LEVEL ${l.level}</span><strong>${h(l.title)}</strong></summary><p>${h(l.description)}</p><ol class="k8-indicators">${items}</ol></details>`;
}

export function k8IndicatorItem(i) {
  const row = (label, value) => `<div><dt>${label}</dt><dd>${inlineMarkdown(value)}</dd></div>`;
  const tag = i.slot === 'EN' || i.slot === 'KR' ? 'badge' : 'badge green';
  return `<li class="k8-indicator"><details><summary><span class="k8-no">${i.number}</span><span class="${tag}">${h(i.slot)} · ${h(K8_SLOT_NAMES[i.slot] || '')}</span> ${inlineMarkdown(i.competency)}</summary><dl>${row('Cara uji', i.method)}${row('Bahan', i.material)}${row('Tanda lulus', i.success)}</dl></details></li>`;
}

// Ketentuan bersama, rubrik, bahan cadangan, dan catatan risiko setiap alur.
export function k8RulesPanel() {
  const docs = Object.keys(K8_DOC_NAMES).filter(d => state.k8Notes.some(n => n.doc === d));
  if (!docs.length) return '';
  const body = docs
    .map(d => {
      const notes = state.k8Notes
        .filter(n => n.doc === d)
        .sort((a, b) => a.position - b.position)
        .map(
          n =>
            `<details class="k8-note"><summary>${h(n.title)}</summary>${renderMarkdown(n.markdown)}</details>`
        )
        .join('');
      return `<details class="k8-doc"><summary>${h(K8_DOC_NAMES[d])}</summary>${notes}</details>`;
    })
    .join('');
  return `<article class="panel k8-rules"><h3>Ketentuan dan bahan cadangan per alur</h3><p class="muted">Aturan pelaksanaan, rubrik, bahan cadangan, dan catatan risiko yang berlaku untuk indikator di atas.</p>${body}</article>`;
}

export function k8ThemesPanel(themes) {
  if (!themes.length) return '';
  const general = state.k8Notes.find(n => n.doc === 'TEMA');
  return `<article class="panel curriculum-themes k8-themes"><h3>Tema</h3><p class="muted">Konteks bersama kelas multi-level. Berjalan menurut nomor pertemuan dan tidak menentukan indikator anak.</p>${themes.map(k8ThemeDetail).join('')}${general ? `<details class="k8-note"><summary>${h(general.title)}</summary>${renderMarkdown(general.markdown)}</details>` : ''}</article>`;
}

export function k8ThemeDetail(t) {
  const row = (label, value) => (value ? `<div><dt>${label}</dt><dd>${value}</dd></div>` : '');
  const subs = state.k8Subthemes
    .filter(s => s.theme === t.number)
    .sort((a, b) => a.position - b.position)
    .map(s => `<li>${h(s.name)} <small>Pertemuan ${s.first_meeting}–${s.last_meeting}</small></li>`)
    .join('');
  const words = kind =>
    state.k8English
      .filter(e => e.theme === t.number && e.kind === kind)
      .sort((a, b) => a.position - b.position)
      .map(e => `<span class="k8-word${e.requestable ? ' requestable' : ''}">${h(e.text)}</span>`)
      .join(' ');
  return `<details class="theme-detail"><summary><span class="theme-no">${t.number}</span><strong>${h(t.name)}</strong><small>Pertemuan ${t.first_meeting}–${t.last_meeting}</small></summary><p>${h(t.description)}</p><dl>${row('Subtema', `<ul class="k8-subthemes">${subs}</ul>`)}${row('Benda nyata bersama', h(t.objects))}${row('Kosakata bahasa Indonesia', h(t.vocabulary))}${row('English — kata benda', `${words('noun')}<small class="muted"> Bergaris bawah: wajar diminta (English L5).</small>`)}${row('English — frasa tindakan', words('phrase'))}${row('Situasi Karakter alami', h(t.character))}${row('Ilustrasi lintas level', h(t.illustration))}</dl></details>`;
}
