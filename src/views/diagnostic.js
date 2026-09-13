// Modal Tes Diagnostik pilot Fondasi: pilih anak dan titik mulai, uji level demi level, lalu simpan.
// Jawaban guru disimpan di state.diagnostic oleh main.js; layar ini hanya menyusun HTML.
import { state, ageText } from '../state.js';
import { select, area, empty, modal } from '../ui.js';
import { escapeHtml as h } from '../domain.js';
import { needsDiagnostic } from './students.js';
import {
  DIAGNOSTIC_LEVELS,
  DECIDING,
  RATINGS,
  diagnosticTasks,
  suggestedStart,
  levelComplete,
  diagnosticPlan,
  diagnosticSummary
} from '../diagnostic.js';

const hasClass = id => state.records.some(r => r.student_id === id);

export function diagnosticForm(studentId = '') {
  const run = state.diagnostic;
  if (!run) return modal('Tes Diagnostik', diagnosticStart(studentId));
  const s = state.students.find(x => x.id === run.student);
  if (!s) return modal('Tes Diagnostik', diagnosticStart());
  const plan = diagnosticPlan(run.start, run.results);
  modal(
    'Tes Diagnostik',
    plan.test ? diagnosticLevelStep(s, run, plan.test) : diagnosticResultStep(s, run, plan)
  );
}

// Langkah 1: anak dan titik mulai. Kelas formal hanya memberi saran; guru yang memutuskan.
export function diagnosticStart(studentId = '') {
  const waiting = state.students.filter(needsDiagnostic);
  if (!waiting.length)
    return state.students.some(x => x.status === 'Aktif')
      ? empty('Semua anak sudah dites', 'Tes diagnostik hanya untuk anak aktif yang belum pernah dites.')
      : empty(
          'Belum ada siswa aktif',
          'Tambahkan siswa lebih dulu, lalu jalankan tes diagnostiknya kapan saja.'
        );
  const chosen = waiting.find(s => s.id === studentId) || waiting[0];
  const saran = suggestedStart(chosen.school_grade);
  const kids = select(
    'Anak yang dites',
    'student',
    waiting.map(s => [s.id, s.name]),
    chosen.id,
    'required'
  );
  const levels = DIAGNOSTIC_LEVELS.map(l => {
    const lv = state.curriculumLevels.find(x => x.level === l);
    return [String(l), `Level ${l}${lv ? ` — ${lv.title}` : ''}${l === saran ? ' (saran)' : ''}`];
  });
  const mulai = select('Titik mulai tes', 'start', levels, String(saran), 'required');
  const age = ageText(chosen.birth_date);
  const info = `<p class="muted diagnostic-hint">${h(chosen.school_grade || 'Kelas formal belum diisi')}${age ? ` · ${age}` : ''}. Saran titik mulai dari kelas formal: Level ${saran}. Guru bebas memilih level lain.</p>`;
  const lock = hasClass(chosen.id)
    ? `<p class="muted">${h(chosen.name)} sudah pernah ikut kelas, jadi level awalnya terkunci. Hasil tes tetap tersimpan sebagai catatan.</p>`
    : '';
  return `<form data-form="diagnostic-start">${kids}${info}${mulai}${levelDescriptors(saran)}${diagnosticRules()}${lock}<button class="primary full">Mulai tes →</button></form>`;
}

// Deskriptor keempat level disusun sekaligus; main.js hanya menampilkan milik level yang dipilih.
export function levelDescriptors(chosen) {
  return DIAGNOSTIC_LEVELS.map(l => {
    const lv = state.curriculumLevels.find(x => x.level === l);
    if (!lv) return '';
    return `<p class="diagnostic-level-desc" data-level-desc="${l}" ${l === chosen ? '' : 'hidden'}>${h(lv.description)}</p>`;
  }).join('');
}

function diagnosticRules() {
  const items = [
    ['⏱', '±20–25 menit, satu anak, sebagai permainan.'],
    ['✓◐✗', 'Nilai tiap tugas: Tercapai, Dengan bantuan, Belum.'],
    ['✎', 'Huruf, angka, dan kata ditulis besar di kertas atau papan.'],
    ['★', '<strong>Tuntas</strong> = nomor 1–6: minimal 5 ✓, tanpa ✗.'],
    ['↕', 'Tuntas → naik level. Belum → itulah level awal.'],
    ['✋', 'Jangan mengajari. Contoh sekali boleh, dicatat ◐.'],
    ['⏸', 'Anak lelah atau menolak 2 kali? Berhenti dulu.']
  ]
    .map(([icon, text]) => `<li><span aria-hidden="true">${icon}</span><span>${text}</span></li>`)
    .join('');
  return `<details class="diagnostic-rules"><summary>Cara tes</summary><ul>${items}</ul></details>`;
}

// Langkah 2: satu level, delapan kartu tugas.
export function diagnosticLevelStep(s, run, level) {
  const lv = state.curriculumLevels.find(x => x.level === level);
  const trail = run.order.length
    ? `<p class="muted">Sudah diuji: ${run.order.map(l => `Level ${l} ${levelComplete(run.results[l]) ? 'tuntas' : 'belum tuntas'}`).join(' · ')}</p>`
    : '';
  const head = `<p class="diagnostic-who"><strong>${h(s.name)}</strong> · Menguji Level ${level}${lv ? ` — ${h(lv.title)}` : ''}</p>${trail}`;
  const cards = [1, 2, 3, 4, 5, 6, 7, 8]
    .map(n => diagnosticTaskCard(level, n, run.results[level]?.[n] || run.draft?.[level]?.[n]))
    .join('');
  const back = run.order.length
    ? '<button type="button" class="secondary" data-action="diagnostic-back">← Kembali</button>'
    : '<button type="button" class="secondary" data-action="diagnostic-restart">← Ganti anak / titik mulai</button>';
  return `<form data-form="diagnostic-level" data-id="${level}">${head}${cards}<div class="button-row">${back}<button class="primary">Nilai Level ${level} →</button></div></form>`;
}

export function diagnosticTaskCard(level, n, value = '') {
  const ind = state.curriculumIndicators.find(i => i.level === level && i.number === n);
  const t = diagnosticTasks[level]?.[n] || {};
  const deciding = DECIDING.includes(n);
  const options = RATINGS.map(
    ([code, mark, label]) =>
      `<label class="diagnostic-rating"><input type="radio" name="i${n}" value="${code}" ${value === code ? 'checked' : ''} ${deciding ? 'required' : ''}><span>${mark} ${label}</span></label>`
  ).join('');
  const tag = deciding ? '' : ' <span class="badge">dicatat, tidak menentukan level</span>';
  return `<fieldset class="diagnostic-task"><legend>${n}. ${h(ind ? ind.text : 'Indikator belum tersedia')}${tag}</legend><dl><div><dt>Tugas</dt><dd>${h(t.task || '—')}</dd></div><div><dt>Bahan</dt><dd>${h(t.material || '—')}</dd></div><div><dt>Tercapai bila</dt><dd>${h(t.success || '—')}</dd></div></dl><div class="diagnostic-ratings">${options}</div></fieldset>`;
}

// Langkah 3: keputusan dan simpan.
export function diagnosticResultStep(s, run, plan, date = new Date().toLocaleDateString('id-ID')) {
  const lv = state.curriculumLevels.find(x => x.level === plan.final);
  const locked = hasClass(s.id);
  const preview = diagnosticSummary({
    date,
    grade: s.school_grade,
    start: run.start,
    order: run.order,
    results: run.results,
    plan,
    note: ''
  });
  const decision = `<div class="diagnostic-result"><span class="badge green">LEVEL AWAL</span><h3>Level ${plan.final}${lv ? ` — ${h(lv.title)}` : ''}</h3>${plan.beyond ? '<p>Tuntas sampai Level 4: <strong>melampaui Fondasi</strong>.</p>' : ''}${locked ? `<p class="muted">${h(s.name)} sudah pernah ikut kelas, jadi level awal tidak diubah. Hasil tes disimpan sebagai catatan.</p>` : ''}</div>`;
  const notes = `${area('Catatan tes (opsional)', 'note', '', 'maxlength="1500" placeholder="Misalnya: membaca kalimat masih mengeja."')}${area('Catatan gaya belajar', 'learning_notes', s.learning_notes || '', 'maxlength="3000"')}`;
  return `<form data-form="diagnostic" data-id="${s.id}">${decision}<h4>Ringkasan yang disimpan</h4><pre class="diagnostic-summary">${h(preview)}</pre>${notes}<div class="button-row"><button type="button" class="secondary" data-action="diagnostic-back">← Kembali</button><button class="primary">Simpan hasil tes</button></div></form>`;
}
