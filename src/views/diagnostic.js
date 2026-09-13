// Modal Tes Diagnostik pilot Fondasi: pilih anak dan titik mulai, uji level demi level, lalu simpan.
// Jawaban guru disimpan di state.diagnostic (dan simpanan sementara di perangkat) oleh main.js; layar ini
// hanya menyusun HTML.
import { state, ageText } from '../state.js';
import { select, area, empty, modal } from '../ui.js';
import { escapeHtml as h } from '../domain.js';
import { needsDiagnostic } from './students.js';
import {
  DIAGNOSTIC_LEVELS,
  DECIDING,
  RATINGS,
  RATING_RULE,
  taskOrder,
  suggestedStart,
  diagnosticPlan,
  diagnosticSummary,
  draftProgress,
  transitionNote
} from '../diagnostic.js';

const hasClass = id => state.records.some(r => r.student_id === id);

export function diagnosticForm(studentId = '') {
  const run = state.diagnostic;
  if (!run) return modal('Tes Diagnostik', diagnosticStart(studentId));
  const s = state.students.find(x => x.id === run.student);
  if (!s) return modal('Tes Diagnostik', diagnosticStart());
  const plan = diagnosticPlan(run.start, run.results);
  modal(
    run.revision ? 'Revisi Tes Diagnostik' : 'Tes Diagnostik',
    plan.test ? diagnosticLevelStep(s, run, plan.test) : diagnosticResultStep(s, run, plan)
  );
}

// Tes yang terhenti dan tersimpan sementara di perangkat ini, untuk anak yang masih menunggu dites.
export function draftList(waiting) {
  const items = waiting
    .map(s => ({ s, run: state.diagnosticDrafts[s.id] }))
    .filter(x => x.run && !x.run.revision)
    .map(({ s, run }) => {
      const p = draftProgress(run);
      const where = p.done ? 'siap disimpan' : `Level ${p.level}, ${p.rated} dari 8 dinilai`;
      return `<li><div><strong>${h(s.name)}</strong><small>Mulai Level ${run.start} · ${where}</small></div><div class="button-row"><button type="button" class="primary" data-action="diagnostic-resume" data-id="${s.id}">Lanjutkan</button><button type="button" class="secondary" data-action="diagnostic-discard" data-id="${s.id}">Buang</button></div></li>`;
    })
    .join('');
  return items
    ? `<div class="diagnostic-drafts"><h4>Tes belum selesai</h4><p class="muted">Tersimpan sementara di perangkat ini.</p><ul>${items}</ul></div>`
    : '';
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
  const replace = state.diagnosticDrafts[chosen.id]
    ? `<p class="muted">${h(chosen.name)} punya tes yang belum selesai. Memulai tes baru akan menggantinya.</p>`
    : '';
  return `${draftList(waiting)}<form data-form="diagnostic-start">${kids}${info}${mulai}${levelDescriptors(saran)}${diagnosticRules()}${lock}${replace}<button class="primary full">Mulai tes →</button></form>`;
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
    ['⏱', '±8 menit per level; biasanya 2–3 level. Satu anak, sebagai permainan.'],
    ['✓', 'Tercapai: memenuhi ukuran tanpa bantuan.'],
    ['◐', 'Dengan bantuan: memenuhi setelah dibantu, atau kurang satu dari ukuran.'],
    ['✗', 'Belum: lebih rendah dari itu.'],
    ['✎', 'Huruf, angka, dan kata ditulis besar di kertas atau papan.'],
    ['★', '<strong>Tuntas</strong> = nomor 1–6: minimal 5 ✓, tanpa ✗.'],
    ['↕', 'Tuntas → naik level. Belum → itulah level awal.'],
    ['✋', 'Jangan mengajari. Contoh sekali boleh, dicatat ◐.'],
    ['⏸', 'Anak lelah? Berhenti dulu. Jawaban tersimpan di perangkat ini dan bisa dilanjutkan.']
  ]
    .map(([icon, text]) => `<li><span aria-hidden="true">${icon}</span><span>${text}</span></li>`)
    .join('');
  return `<details class="diagnostic-rules"><summary>Cara tes</summary><ul>${items}</ul></details>`;
}

// Langkah 2: satu level, delapan kartu tugas.
export function diagnosticLevelStep(s, run, level) {
  const lv = state.curriculumLevels.find(x => x.level === level);
  const note = transitionNote(run, level);
  const banner = note ? `<p class="diagnostic-transition">${note}</p>` : '';
  const legend = `<p class="muted diagnostic-legend">${RATING_RULE}</p>`;
  const head = `${banner}<p class="diagnostic-who"><strong>${h(s.name)}</strong> · Menguji Level ${level}${lv ? ` — ${h(lv.title)}` : ''}</p>${legend}`;
  const card = n => diagnosticTaskCard(level, n, run.results[level]?.[n] || run.draft?.[level]?.[n]);
  const { active, observed } = taskOrder(state.curriculumIndicators, level);
  const watch = observed.length
    ? `<h4 class="diagnostic-observe">Diamati sepanjang tes — nilai di akhir</h4>${observed.map(card).join('')}`
    : '';
  const cards = active.map(card).join('') + watch;
  const back = run.order.length
    ? '<button type="button" class="secondary" data-action="diagnostic-back">← Kembali</button>'
    : run.revision
      ? '<button type="button" class="secondary" data-action="diagnostic-restart">← Batal revisi</button>'
      : '<button type="button" class="secondary" data-action="diagnostic-restart">← Ulang dari awal</button>';
  return `<form data-form="diagnostic-level" data-id="${level}">${head}${cards}<div class="button-row">${back}<button class="primary">Selesai Level ${level}, lanjut →</button></div></form>`;
}

export function diagnosticTaskCard(level, n, value = '') {
  const ind = state.curriculumIndicators.find(i => i.level === level && i.number === n);
  const deciding = DECIDING.includes(n);
  const options = RATINGS.map(
    ([code, mark, label]) =>
      `<label class="diagnostic-rating"><input type="radio" name="i${n}" value="${code}" ${value === code ? 'checked' : ''} ${deciding ? 'required' : ''}><span>${mark} ${label}</span></label>`
  ).join('');
  const tag = deciding ? '' : ' <span class="badge">dicatat, tidak menentukan level</span>';
  return `<fieldset class="diagnostic-task"><legend>${n}. ${h(ind ? ind.text : 'Indikator belum tersedia')}${tag}</legend><dl><div><dt>Tugas</dt><dd>${h(ind?.diagnostic_task || '—')}</dd></div><div><dt>Bahan</dt><dd>${h(ind?.diagnostic_material || '—')}</dd></div><div><dt>Tercapai bila</dt><dd>${h(ind?.diagnostic_success || '—')}</dd></div></dl><div class="diagnostic-ratings">${options}</div></fieldset>`;
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
  const revision = run.revision
    ? '<p class="muted">Revisi mengganti hasil tes sebelumnya. Level awal dihitung ulang dari nilai terbaru.</p>'
    : '';
  const decision = `<div class="diagnostic-result"><span class="badge green">LEVEL AWAL</span><h3>Level ${plan.final}${lv ? ` — ${h(lv.title)}` : ''}</h3>${plan.beyond ? '<p>Tuntas sampai Level 4: <strong>melampaui Fondasi</strong>.</p>' : ''}${locked ? `<p class="muted">${h(s.name)} sudah pernah ikut kelas, jadi level awal tidak diubah. Hasil tes disimpan sebagai catatan.</p>` : ''}${revision}</div>`;
  const edits = run.order
    .map(
      l =>
        `<button type="button" class="secondary" data-action="diagnostic-edit-level" data-id="${l}">Ubah Level ${l}</button>`
    )
    .join('');
  const notes = `${area('Catatan tes (opsional)', 'note', run.note || '', 'maxlength="1500" placeholder="Misalnya: membaca kalimat masih mengeja."')}${area('Catatan gaya belajar', 'learning_notes', s.learning_notes || '', 'maxlength="3000"')}`;
  return `<form data-form="diagnostic" data-id="${s.id}">${decision}<h4>Ringkasan yang disimpan</h4><pre class="diagnostic-summary">${h(preview)}</pre><div class="button-row diagnostic-edits">${edits}</div>${notes}<button class="primary full">${run.revision ? 'Simpan revisi' : 'Simpan hasil tes'}</button></form>`;
}
