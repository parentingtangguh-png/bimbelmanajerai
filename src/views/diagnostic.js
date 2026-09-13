// Modal Tes Diagnostik pilot Fondasi: pilih anak dan satu level, nilai delapan tugas, lihat hasil, simpan.
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
  ratingMark,
  taskOrder,
  suggestedStart,
  diagnosticOutcome,
  focusIndicators,
  draftProgress
} from '../diagnostic.js';

export function diagnosticForm(studentId = '') {
  const run = state.diagnostic;
  if (!run) return modal('Tes Diagnostik', diagnosticStart(studentId));
  const s = state.students.find(x => x.id === run.student);
  if (!s) return modal('Tes Diagnostik', diagnosticStart());
  modal(
    run.revision ? 'Revisi Tes Diagnostik' : 'Tes Diagnostik',
    run.reviewed ? diagnosticResultStep(s, run) : diagnosticLevelStep(s, run)
  );
}

// Tes yang terhenti dan tersimpan sementara di perangkat ini, untuk anak yang masih menunggu dites.
export function draftList(waiting) {
  const items = waiting
    .map(s => ({ s, run: state.diagnosticDrafts[s.id] }))
    .filter(x => x.run && !x.run.revision)
    .map(
      ({ s, run }) =>
        `<li><div><strong>${h(s.name)}</strong><small>Level ${run.level} · ${draftProgress(run)} dari 8 dinilai</small></div><div class="button-row"><button type="button" class="primary" data-action="diagnostic-resume" data-id="${s.id}">Lanjutkan</button><button type="button" class="secondary" data-action="diagnostic-discard" data-id="${s.id}">Buang</button></div></li>`
    )
    .join('');
  return items
    ? `<div class="diagnostic-drafts"><h4>Tes belum selesai</h4><p class="muted">Tersimpan sementara di perangkat ini.</p><ul>${items}</ul></div>`
    : '';
}

// Langkah 1: anak dan level yang dites. Kelas formal hanya memberi saran; guru yang memutuskan.
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
  const mulai = select('Level yang dites', 'start', levels, String(saran), 'required');
  const age = ageText(chosen.birth_date);
  const info = `<p class="muted diagnostic-hint">${h(chosen.school_grade || 'Kelas formal belum diisi')}${age ? ` · ${age}` : ''}. Saran dari kelas formal: Level ${saran}. Guru bebas memilih level lain.</p>`;
  const replace = state.diagnosticDrafts[chosen.id]
    ? `<p class="muted">${h(chosen.name)} punya tes yang belum selesai. Memulai tes baru akan menggantinya.</p>`
    : '';
  return `${draftList(waiting)}<form data-form="diagnostic-start">${kids}${info}${mulai}${levelDescriptors(saran)}${diagnosticRules()}${replace}<button class="primary full">Mulai tes →</button></form>`;
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
    ['⏱', 'Satu level, 8 tugas, ±8–10 menit. Satu anak, sebagai permainan.'],
    ['✓', 'Tercapai: memenuhi ukuran tanpa bantuan.'],
    ['◐', 'Dengan bantuan: memenuhi setelah dibantu, atau kurang satu dari ukuran.'],
    ['✗', 'Belum: lebih rendah dari itu.'],
    ['✎', 'Huruf, angka, dan kata ditulis besar di kertas atau papan.'],
    ['★', '<strong>Lulus</strong> = nomor 1–6 semuanya ✓. English dan Karakter hanya dicatat.'],
    ['→', 'Lulus Level X → mulai belajar Level X+1. Belum lulus → mulai belajar Level X.'],
    ['✋', 'Jangan mengajari. Contoh sekali boleh, dicatat ◐.'],
    ['⏸', 'Anak lelah? Berhenti dulu. Jawaban tersimpan di perangkat ini dan bisa dilanjutkan.']
  ]
    .map(([icon, text]) => `<li><span aria-hidden="true">${icon}</span><span>${text}</span></li>`)
    .join('');
  return `<details class="diagnostic-rules"><summary>Cara tes</summary><ul>${items}</ul></details>`;
}

// Langkah 2: delapan kartu tugas untuk level yang dites.
export function diagnosticLevelStep(s, run) {
  const level = run.level;
  const lv = state.curriculumLevels.find(x => x.level === level);
  const legend = `<p class="muted diagnostic-legend">${RATING_RULE}</p>`;
  const head = `<p class="diagnostic-who"><strong>${h(s.name)}</strong> · Menguji Level ${level}${lv ? ` — ${h(lv.title)}` : ''}</p>${legend}`;
  const card = n => diagnosticTaskCard(level, n, run.answers?.[n]);
  const { active, observed } = taskOrder(state.curriculumIndicators, level);
  const watch = observed.length
    ? `<h4 class="diagnostic-observe">Diamati sepanjang tes — nilai di akhir</h4>${observed.map(card).join('')}`
    : '';
  const back = run.revision
    ? '<button type="button" class="secondary" data-action="diagnostic-restart">← Batal revisi</button>'
    : '<button type="button" class="secondary" data-action="diagnostic-restart">← Ulang dari awal</button>';
  return `<form data-form="diagnostic-level" data-id="${level}">${head}${active.map(card).join('')}${watch}<div class="button-row">${back}<button class="primary">Lihat hasil →</button></div></form>`;
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

// Langkah 3: hasil dan simpan.
export function diagnosticResultStep(s, run) {
  const o = diagnosticOutcome(run.level, run.answers);
  const next = state.curriculumLevels.find(x => x.level === o.final);
  const verdict = o.passed
    ? `<span class="badge green">LULUS LEVEL ${run.level}</span><h3>Mulai belajar Level ${o.final}${next ? ` — ${h(next.title)}` : ''}</h3>${o.beyond ? '<p>Level 4 sudah lulus: <strong>melampaui Fondasi</strong>. Anak tetap belajar di Level 4.</p>' : ''}`
    : `<span class="badge">BELUM LULUS LEVEL ${run.level}</span><h3>Mulai belajar Level ${o.final}${next ? ` — ${h(next.title)}` : ''}</h3>`;
  const focus = focusIndicators(run.answers)
    .map(n => {
      const ind = state.curriculumIndicators.find(i => i.level === run.level && i.number === n);
      return `<li>${n}. ${h(ind ? ind.text : 'Indikator ' + n)}</li>`;
    })
    .join('');
  const focusBlock = focus
    ? `<h4>Perlu dilatih lebih dulu</h4><ul class="diagnostic-focus">${focus}</ul>`
    : '';
  const revision = run.revision ? '<p class="muted">Revisi mengganti hasil tes sebelumnya.</p>' : '';
  const marks = DECIDING.map(n => `${n} ${ratingMark(run.answers[n])}`).join(' · ');
  const summary = `<p class="muted diagnostic-marks">Nilai 1–6: ${marks} · English ${ratingMark(run.answers[7])} · Karakter ${ratingMark(run.answers[8])}</p>`;
  const note = area(
    'Catatan tes (opsional)',
    'note',
    run.note || '',
    'maxlength="1500" placeholder="Misalnya: membaca kalimat masih mengeja."'
  );
  return `<form data-form="diagnostic" data-id="${s.id}"><div class="diagnostic-result">${verdict}${revision}</div>${summary}${focusBlock}${note}<div class="button-row"><button type="button" class="secondary" data-action="diagnostic-back">← Ubah nilai</button><button class="primary">${run.revision ? 'Simpan revisi' : 'Simpan hasil tes'}</button></div></form>`;
}
