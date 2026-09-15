// Modal Tes Diagnostik kurikulum 8 level: pilih anak dan satu level, nilai 14 tugas (tersimpan di server
// setiap diketuk), lalu Simpan final. main.js memanggil RPC-nya; layar ini hanya menyusun HTML.
import { state, ageText, testFor } from '../state.js';
import { select, empty, modal } from '../ui.js';
import { escapeHtml as h } from '../domain.js';
import { inlineMarkdown, renderMarkdown } from '../markdown.js';
import { needsDiagnostic } from './students.js';
import {
  DIAGNOSTIC_LEVELS,
  TASK_ORDER,
  ENGLISH,
  CHARACTER,
  STATUSES,
  suggestedStart,
  restartLevel,
  answersOf,
  isStopped,
  ratedCount,
  diagnosticOutcome
} from '../diagnostic.js';

export function diagnosticForm(studentId = '') {
  const s = state.students.find(x => x.id === state.diagnostic);
  const test = s && testFor(s.id);
  if (s && test && !test.finalized_at) return modal('Tes Diagnostik', diagnosticSheet(s, test));
  modal('Tes Diagnostik', diagnosticStart(studentId));
}

const k8Level = l => state.k8Levels.find(x => x.level === l);
const levelLabel = l => `Level ${l}${k8Level(l) ? ` — ${k8Level(l).title}` : ''}`;

// Langkah 1: anak dan level. Anak dengan draf langsung dilanjutkan; level draf tidak bisa diganti.
export function diagnosticStart(studentId = '') {
  const waiting = state.students.filter(needsDiagnostic);
  if (!waiting.length)
    return state.students.some(x => x.status === 'Aktif')
      ? empty('Semua anak sudah dites', 'Tes diagnostik hanya untuk anak aktif yang belum punya tes final.')
      : empty(
          'Belum ada siswa aktif',
          'Tambahkan siswa lebih dulu, lalu jalankan tes diagnostiknya kapan saja.'
        );
  const chosen = waiting.find(s => s.id === studentId) || waiting[0];
  const kids = select(
    'Anak yang dites',
    'student',
    waiting.map(s => [
      s.id,
      `${s.name}${testFor(s.id) ? ` (tes Level ${testFor(s.id).tested_level} berjalan)` : ''}`
    ]),
    chosen.id,
    'required'
  );
  const draft = testFor(chosen.id);
  if (draft)
    return `<form data-form="diagnostic-start">${kids}<p class="muted diagnostic-hint">Tes Level ${draft.tested_level} dimulai ${h(draft.started_on)} · ${ratedCount(answersOf(state.diagnosticResults, draft.id))} dari 13 tugas dinilai.</p><button type="button" class="primary full" data-action="diagnostic-open" data-id="${chosen.id}">Lanjutkan tes →</button></form>`;
  const saran = suggestedStart(chosen.school_grade);
  const levels = DIAGNOSTIC_LEVELS.map(l => [String(l), `${levelLabel(l)}${l === saran ? ' (saran)' : ''}`]);
  const age = ageText(chosen.birth_date);
  const info = `<p class="muted diagnostic-hint">${h(chosen.school_grade || 'Kelas formal belum diisi')}${age ? ` · ${age}` : ''}. Saran dari kelas formal: Level ${saran}. Guru boleh memilih level lain; setelah tes dimulai, level hanya berganti bila tes berhenti.</p>`;
  const mulai = select('Level yang dites', 'start', levels, String(saran), 'required');
  return `<form data-form="diagnostic-start">${kids}${info}${mulai}${levelDescriptors(saran)}${diagnosticRules()}<button class="primary full">Mulai tes →</button></form>`;
}

// Deskriptor kedelapan level disusun sekaligus; main.js hanya menampilkan milik level yang dipilih.
export function levelDescriptors(chosen) {
  return DIAGNOSTIC_LEVELS.map(l => {
    const lv = k8Level(l);
    if (!lv) return '';
    return `<p class="diagnostic-level-desc" data-level-desc="${l}" ${l === chosen ? '' : 'hidden'}>${h(lv.description)}</p>`;
  }).join('');
}

function diagnosticRules() {
  const items = [
    ['⏱', 'Satu level, 14 tugas, kira-kira 25–45 menit. Boleh dilanjutkan di pertemuan berikutnya.'],
    ['✓', '<strong>Lulus / Belum</strong> hanya bila prosedur berjalan sah dan buktinya sesuai tanda lulus.'],
    ['·', '<strong>Belum dinilai</strong> bila anak belum bersedia, tugas terputus, atau bahan tidak layak.'],
    [
      '■',
      'Setiap nilai langsung tersimpan. Tugas yang belum dinilai boleh dicoba lagi sebelum Simpan final.'
    ],
    ['⛔', 'Bila A1, B1, E1, dan D1 semuanya Belum, tes berhenti dan tidak dihitung (kecuali Level 1).'],
    ['✦', 'English tidak dinilai pada anak baru. Karakter dicatat, tidak menentukan level.'],
    ['→', 'Setelah final, anak mulai kelas dari indikator akademik pertama yang belum Lulus.']
  ]
    .map(([icon, text]) => `<li><span aria-hidden="true">${icon}</span><span>${text}</span></li>`)
    .join('');
  return `<details class="diagnostic-rules"><summary>Cara tes</summary><ul>${items}</ul></details>`;
}

// Langkah 2: lembar 14 tugas satu level.
export function diagnosticSheet(s, test) {
  const level = test.tested_level;
  const answers = answersOf(state.diagnosticResults, test.id);
  const head = `<p class="diagnostic-who"><strong>${h(s.name)}</strong> · Menguji ${h(levelLabel(level))}</p>`;
  if (isStopped(level, answers)) {
    const next = restartLevel(level);
    return `<div class="diagnostic-result">${head}<span class="badge">TES BERHENTI</span><h3>A1, B1, E1, dan D1 semuanya Belum</h3><p>Tes Level ${level} tidak dihitung. Mulai tes baru di <strong>${h(levelLabel(next))}</strong>.</p></div><div class="button-row"><button type="button" class="primary" data-action="diagnostic-restart" data-id="${s.id}" data-level="${next}">Mulai tes Level ${next} →</button></div>`;
  }
  const cards = TASK_ORDER.map(n => diagnosticTaskCard(level, n, answers[n])).join('');
  return `<form data-form="diagnostic" data-id="${s.id}">${head}${diagnosticRules()}${spareMaterials()}${cards}${diagnosticSummary(level, answers)}<div class="button-row"><button type="button" class="secondary" data-action="close">Jeda, lanjutkan nanti</button><button class="primary">Simpan final</button></div></form>`;
}

// Bahan cadangan tiap alur, dari catatan kurikulum.
export function spareMaterials() {
  const notes = state.k8Notes.filter(n => /cadangan/i.test(n.title));
  if (!notes.length) return '';
  const body = notes
    .map(
      n =>
        `<details class="k8-note"><summary>${h(n.doc)} · ${h(n.title)}</summary>${renderMarkdown(n.markdown)}</details>`
    )
    .join('');
  return `<details class="diagnostic-rules"><summary>Bahan cadangan</summary>${body}</details>`;
}

export function diagnosticTaskCard(level, n, answer) {
  const ind = state.k8Indicators.find(i => i.level === level && i.number === n);
  const slot = ind?.slot || String(n);
  const row = (label, value) => `<div><dt>${label}</dt><dd>${inlineMarkdown(value || '—')}</dd></div>`;
  const body = ind
    ? `<dl>${row('Cara uji', ind.method)}${row('Bahan', ind.material)}${row('Tanda lulus', ind.success)}</dl>`
    : '';
  const title = `<legend><span class="badge ${n === ENGLISH || n === CHARACTER ? '' : 'green'}">${h(slot)}</span> ${inlineMarkdown(ind ? ind.competency : 'Indikator belum tersedia')}</legend>`;
  if (n === ENGLISH)
    return `<fieldset class="diagnostic-task">${title}<p class="muted">Belum dinilai: English anak baru tidak diuji karena kosakatanya berasal dari tema kelas.</p></fieldset>`;
  const status = answer?.status || '';
  const options = STATUSES.map(
    ([value, label]) =>
      `<label class="diagnostic-rating"><input type="radio" name="s${n}" value="${value}" ${status === value ? 'checked' : ''}><span>${label}</span></label>`
  ).join('');
  const pkg = answer?.package || 'utama';
  const packages = ['utama', 'cadangan']
    .map(
      p =>
        `<label class="diagnostic-rating"><input type="radio" name="p${n}" value="${p}" ${pkg === p ? 'checked' : ''}><span>Paket ${p}</span></label>`
    )
    .join('');
  const tag = n === CHARACTER ? '<p class="muted">Dicatat, tidak menentukan level atau antrean.</p>' : '';
  return `<fieldset class="diagnostic-task">${title}${tag}<details><summary>Cara uji, bahan, tanda lulus</summary>${body}</details><div class="diagnostic-ratings">${options}</div><div class="diagnostic-ratings diagnostic-packages"><small class="muted">Bahan:</small>${packages}</div></fieldset>`;
}

// Dampak Simpan final saat ini; main.js memperbaruinya di tempat setiap nilai berubah.
export function diagnosticSummary(level, answers) {
  const o = diagnosticOutcome(level, answers);
  const start = o.complete
    ? '<strong>Kurikulum 8 level selesai.</strong>'
    : `Mulai kelas di <strong>${h(levelLabel(o.startLevel))}</strong>, indikator ${o.startIndicator}.`;
  const character = { lulus: 'Lulus', belum: 'Belum' }[o.character] || 'belum dinilai';
  return `<div class="diagnostic-result" data-diagnostic-summary><h4>Bila disimpan final sekarang</h4><p>${o.passed.length} dari 12 indikator akademik Lulus. ${start}</p><p class="muted">Dinilai ${ratedCount(answers)} dari 13 tugas; yang belum dinilai dihitung belum lulus. English: belum dinilai · Karakter: ${character}. Hasil final tidak bisa diubah.</p></div>`;
}
