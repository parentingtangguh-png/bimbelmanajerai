// Ruang kelas: daftar sesi, kartu evaluasi per anak, dan dialog sesi baru.
import {
  state,
  subjectLabels,
  characterLabels,
  studentFor,
  assessmentsFor,
  checksFor,
  priorChecks,
  hintText,
  observationFor,
  timeLabel,
  indicatorsOf
} from '../state.js';
import { field, select, area, empty, heading, modal } from '../ui.js';
import { escapeHtml as h, waLink, localDate } from '../domain.js';
export function sessionsView() {
  const c = state.classes.find(c => c.id === state.active);
  if (c) {
    const records = state.records.filter(r => r.session_id === c.id);
    const groups = [
      ...new Set(records.filter(r => r.attendance === 'Hadir').map(r => r.group_no || 1))
    ].sort();
    const done = records.filter(r => r.finalized_at).length;
    return [classHeading(c, groups, records, done), teachingSteps(), classGuide(c), childCards(records)].join(
      ''
    );
  }
  const buttons = `<div class="button-row"><button class="secondary" data-action="new-schedule">＋ Buat sesi jadwal</button><button class="primary" data-action="new-session">＋ Mulai sesi kelas</button></div>`;
  const head = heading(
    'RUANG KELAS',
    'Siap belajar bersama?',
    'Satu tema, satu panduan multigrade, dan bukti perkembangan individual.',
    buttons
  );
  return `${head}<div class="panel">${
    state.classes
      .map(x => {
        const rr = state.records.filter(r => r.session_id === x.id);
        return `<button class="class-row" data-action="open-session" data-id="${x.id}"><span class="calendar">${h(x.date.slice(8))}<small>${h(x.date.slice(0, 7))}</small></span><div><h3>${h(x.theme)}</h3><p>${x.start_time ? timeLabel(x) + ' · ' : ''}${x.duration_minutes || 60} menit · ${rr.length} siswa · ${rr.filter(r => r.finalized_at).length} evaluasi selesai</p></div><span>Masuk kelas →</span></button>`;
      })
      .join('') || empty('Ruang kelas menanti', 'Pilih durasi, tema, dan siswa untuk membuka sesi pertama.')
  }</div>`;
}
export function recordCard(r) {
  const s = studentFor(r);
  if (!s) return '';
  const targets = assessmentsFor(r.id);
  const observation = observationFor(r.id);
  const link = waLink(s.phone, r.report);
  const locked = !!r.finalized_at;
  const absent = r.attendance !== 'Hadir';
  const targetText = targets
    .map(a => `${subjectLabels[a.subject] || a.subject} ${a.level_snapshot}`)
    .join(' · ');
  const ratings = [
    ['', 'Pilih perkembangan'],
    ['BT', 'Belum tampak'],
    ['MB', 'Mulai berkembang'],
    ['T', 'Tercapai']
  ];
  const englishRatings = [
    ['', 'Tidak dicatat'],
    ['BT', 'Belum merespons'],
    ['MB', 'Mulai merespons'],
    ['T', 'Menggunakan/merespons']
  ];
  const evaluation = targets
    .map(a => {
      const c = state.curriculum.find(x => x.level === a.level_snapshot);
      const list = indicatorsOf(c, a.subject);
      const key = Number((c && c[`${a.subject}_key`]) || 0);
      const goal =
        c && c[a.subject]
          ? `<h4>Tujuan level ${a.level_snapshot}</h4><p class="target-goal">${h(c[a.subject])}</p>`
          : '';
      const saved = new Set(
        checksFor(r.id)
          .filter(c => c.subject === a.subject)
          .map(c => c.indicator_index)
      );
      const before = new Set(priorChecks(r, a.subject, a.level_snapshot).map(c => c.indicator_index));
      const done = [...saved].length;
      const keyDone = !key || saved.has(key);
      const history = before.size
        ? `<p class="indicator-history">Pernah terlihat di sesi sebelumnya pada level ini: indikator ${[...before].sort((x, y) => x - y).join(', ')}.</p>`
        : '';
      const boxes = list
        .map((t, i) => indicatorCheck(t, i + 1, key, saved, before, locked || absent))
        .join('');
      const checks = list.length
        ? `<h4>Indikator</h4><div class="indicator-checks" data-key="${key}" data-record="${r.id}" data-subject="${a.subject}">${boxes}<p class="indicator-hint">${hintText(done, list.length, key, keyDone)}</p>${history}</div>`
        : '<p class="muted">Indikator level ini belum disusun. Buka menu Kurikulum untuk melengkapinya.</p>';
      const badge = `<div><span class="badge green">${h(subjectLabels[a.subject] || a.subject)} · Level ${a.level_snapshot}</span><small>Dua bukti Tercapai dibutuhkan sebelum naik level.</small></div>`;
      const rating = select(
        'Perkembangan',
        `rating_${a.subject}`,
        ratings,
        a.rating || '',
        locked || absent ? 'disabled' : 'required'
      );
      const evidence = area(
        'Bukti singkat',
        `note_${a.subject}`,
        a.evidence_note || '',
        `maxlength="1000" ${locked || absent ? 'disabled' : ''}`
      );
      return `<div class="target-eval">${badge}${goal}${checks}${rating}${evidence}</div>`;
    })
    .join('');
  const absentForm = absentEvaluationForm(s, r, locked);
  const chars = Object.entries(characterLabels)
    .map(
      ([value, label]) =>
        `<label class="check"><input type="checkbox" name="character" value="${value}" ${(observation.character_dimensions || []).includes(value) ? 'checked' : ''} ${locked ? 'disabled' : ''}>${label}</label>`
    )
    .join('');
  return [
    cardHeading(s, r, targetText, locked),
    attendanceForm(r, locked),
    evaluationSection(absent, absentForm, r, evaluation, observation, englishRatings, chars, locked),
    reportSection(r, link, absent, locked),
    `</article>`
  ].join(``);
}
export function themeFields() {
  const names = state.themes.map(t => t.name);
  if (!names.length)
    return field(
      'Tema bersama',
      'theme_custom',
      'text',
      '',
      'required maxlength="120" placeholder="Contoh: Pasar"'
    );
  return `${select('Tema bersama', 'theme', [...names.map(n => [n, n]), ['__new', '＋ Tema lain…']], names[0], 'required')}<label class="theme-custom" hidden>Nama tema baru<input name="theme_custom" type="text" maxlength="120" placeholder="Contoh: Hewan di sekitar kita"></label>`;
}
export function newSession() {
  const available = state.students.filter(
    s => s.status === 'Aktif' && !state.records.some(r => r.student_id === s.id && !r.finalized_at)
  );
  const roster =
    available
      .map(
        s =>
          `<label class="check"><input type="checkbox" name="student" value="${s.id}">${h(s.name)} <small>Bahasa Indonesia ${s.reading_level} · Matematika ${s.math_level}</small></label>`
      )
      .join('') ||
    '<p>Belum ada siswa tersedia. Tambahkan siswa atau selesaikan sesi yang masih terbuka.</p>';
  modal(
    'Mulai sesi kelas',
    `<form data-form="session" data-id="${crypto.randomUUID()}">${sessionWhenFields()}${themeFields()}<div class="notice">Sistem memilih target spiral bersama dan membagi siswa menjadi maksimal tiga kelompok berdasarkan posisi kompetensi.</div><h3>Pilih anak yang mengikuti sesi</h3>${roster}<button class="primary full" ${available.length ? '' : 'disabled'}>Buka ruang kelas →</button></form>`
  );
}

// When the session happens and how long it runs. The duration is what decides how many core
// targets the class can carry, so the options spell that out.
function sessionWhenFields() {
  const schedule = state.schedules.length
    ? select(
        'Sesi jadwal',
        'schedule',
        [['', 'Tanpa sesi jadwal'], ...state.schedules.map(sc => [sc.id, `${sc.name} · ${timeLabel(sc)}`])],
        ''
      )
    : '';
  const duration = select(
    'Durasi kelas',
    'duration',
    [
      ['60', '60 menit · 2 target inti'],
      ['75', '75 menit · 2 target + integrasi'],
      ['90', '90 menit · maksimal 3 target']
    ],
    '60',
    'required'
  );
  return `${field('Tanggal', 'date', 'date', localDate(), 'required')}${schedule}${duration}`;
}

// A child who was not there is still closed off, so the next session can include them. Nothing is
// rated and no level moves.
function absentEvaluationForm(s, r, locked) {
  const nudge = locked ? '' : 'Tekan tombol di bawah agar anak dapat ikut sesi berikutnya.';
  const note = area(
    'Catatan (opsional)',
    'anecdote',
    r.anecdote || '',
    `maxlength="3000" ${locked ? 'disabled' : ''}`
  );
  const button = `<button class="primary" ${locked ? 'disabled' : ''}>${locked ? '✓ Sudah diselesaikan' : 'Selesaikan untuk anak tidak hadir'}</button>`;
  return `<form data-form="evaluation" data-id="${r.id}" class="evaluation competency-evaluation"><h3>01 / Selesaikan catatan</h3><p class="muted">${h(s.name)} tercatat ${h(r.attendance)}. Tidak ada penilaian dan level tidak berubah. ${nudge}</p>${note}${button}</form>`;
}

// One tickable indicator. The spiral node wears a star; anything seen in an earlier session on
// this level says so, because that is what the second piece of evidence is measured against.
function indicatorCheck(text, number, key, saved, before, disabled) {
  const star = number === key ? '<span class="star">★</span> ' : '';
  const seen = before.has(number) ? ' <em class="seen">sudah pernah</em>' : '';
  return `<label class="check"><input type="checkbox" class="indicator-check" data-index="${number}" data-text="${h(text)}" ${saved.has(number) ? 'checked' : ''} ${disabled ? 'disabled' : ''}>${star}${number}. ${h(text)}${seen}</label>`;
}

// The four pieces of a child card. Splitting them out is what lets one part be changed without
// rereading the whole screen; the HTML is exactly what the single template produced before.
function cardHeading(s, r, targetText, locked) {
  return `<article class="panel session-card"><div class="panel-heading"><div><h2>${h(s.name)} <small>· Kelompok ${r.group_no || 1}</small></h2><p>${h(s.interest || 'Minat belum diisi')} · ${h(targetText)}</p></div><span class="badge ${locked ? 'green' : 'amber'}">${locked ? 'Evaluasi tersimpan' : 'Sesi berlangsung'}</span></div>`;
}

function attendanceForm(r, locked) {
  return `<form data-form="attendance" data-id="${r.id}" class="inline-form">${select('Kehadiran', 'attendance', ['Hadir', 'Sakit', 'Izin', 'Alfa'], r.attendance, locked ? 'disabled' : '')}<button class="secondary" ${locked ? 'disabled' : ''}>Simpan kehadiran</button></form>`;
}

// The evaluation form is three numbered blocks and a footer. Splitting them out is what lets one
// block be reworded without rereading the rest; the HTML is what the single template produced.
function englishBlock(observation, englishRatings, locked) {
  return `<div class="observation-block"><h3>02 / English Exposure</h3><p class="muted">Dicatat sebagai pengayaan tematik dan tidak menentukan kelulusan.</p>${select('Respons Bahasa Inggris', 'english_rating', englishRatings, observation.english_rating || '', locked ? 'disabled' : '')}${area('Bukti English Exposure (opsional)', 'english_note', observation.english_note || '', `maxlength="1000" ${locked ? 'disabled' : ''}`)}</div>`;
}

function characterBlock(observation, chars, locked) {
  return `<div class="observation-block"><h3>03 / Observasi karakter</h3><p class="muted">Pilih perilaku yang terlihat dalam kegiatan; ini bukan nilai atau level anak.</p><div class="character-checks">${chars}</div>${area('Konteks observasi karakter (opsional)', 'character_note', observation.character_note || '', `maxlength="1000" ${locked ? 'disabled' : ''}`)}</div>`;
}

function evaluationFooter(r, locked) {
  return `${area('Catatan anekdot umum (opsional)', 'anecdote', r.anecdote || '', `maxlength="3000" ${locked ? 'disabled' : ''}`)}<button class="primary" ${locked ? 'disabled' : ''}>${locked ? '✓ Evaluasi sudah tersimpan' : 'Simpan & selesaikan evaluasi'}</button><small class="fine">Target inti dinilai mandiri. English Exposure dan karakter dicatat tanpa menjadi syarat kelulusan.</small>`;
}

function evaluationForm(r, evaluation, observation, englishRatings, chars, locked) {
  return `<form data-form="evaluation" data-id="${r.id}" class="evaluation competency-evaluation"><h3>01 / Bukti target inti</h3>${evaluation}${englishBlock(observation, englishRatings, locked)}${characterBlock(observation, chars, locked)}${evaluationFooter(r, locked)}</form>`;
}

function evaluationSection(absent, absentForm, r, evaluation, observation, englishRatings, chars, locked) {
  return `${absent ? absentForm : evaluationForm(r, evaluation, observation, englishRatings, chars, locked)}`;
}

// The parent message: a button to draft it, then the draft with its two ways out.
function reportButton(r, locked) {
  if (r.attendance !== 'Hadir') return '';
  return `<button class="secondary" data-action="generate" data-kind="report" data-id="${r.id}" ${!locked ? 'disabled' : ''}>${r.report ? 'Lihat rapor tersimpan' : '✦ Buat draf rapor'}</button>`;
}

function reportDraft(r, link) {
  const out = link
    ? `<a class="primary" target="_blank" rel="noopener noreferrer" href="${h(link)}">Periksa & buka WhatsApp →</a>`
    : '<small>Lengkapi nomor WhatsApp di profil siswa untuk membuka percakapan.</small>';
  return `<pre>${h(r.report)}</pre><div class="button-row"><button class="secondary" data-action="copy" data-id="${r.id}">Salin pesan</button>${out}</div>`;
}

function reportSection(r, link, absent, locked) {
  const body = r.report
    ? reportDraft(r, link)
    : '<p class="muted">Rapor dibuat setelah evaluasi agar kabarnya sesuai kegiatan nyata.</p>';
  return `<section class="report"><div class="section-title"><h3>${absent ? '02' : '04'} / Kabar untuk orang tua</h3>${reportButton(r, locked)}</div>${body}</section>`;
}

// The four bands of the in-class screen.
function classHeading(c, groups, records, done) {
  const when = `${h(c.date)}${c.start_time ? ' · ' + timeLabel(c) : ''}`;
  const shape = `${c.duration_minutes || 60} menit · ${groups.length || 1} kelompok`;
  return heading(
    'SATU TEMA, BERAGAM TANTANGAN',
    h(c.theme),
    `${when} · ${shape} · ${done} dari ${records.length} anak selesai dievaluasi`,
    '<button class="secondary" data-action="back-sessions">← Semua sesi</button>'
  );
}

function teachingSteps() {
  return `<div class="notice"><strong>Langkah kelas</strong><br>① Tandai anak yang tidak datang. Kehadiran bisa diubah sampai evaluasinya disimpan, dan panduan kelas tetap aman.<br>② Buat panduan kelas sekali untuk semua kelompok.<br>③ Setelah kegiatan, simpan evaluasi setiap anak, termasuk yang tidak hadir.<br>④ Buat kabar orang tua, periksa, lalu kirim lewat WhatsApp.</div>`;
}

function classGuide(c) {
  const head = `<div><h2>Panduan kelas bersama</h2><p>Satu alur mengajar dengan kartu kegiatan untuk maksimal tiga kelompok.</p></div><button class="primary" data-action="generate-class" data-id="${c.id}">${c.material ? 'Lihat panduan tersimpan' : '✦ Buat panduan kelas AI'}</button>`;
  const body = c.material
    ? `<pre>${h(c.material)}</pre><button class="text-btn" data-action="print-class" data-id="${c.id}">Cetak panduan (opsional)</button>`
    : '<p class="muted">Panduan akan mengatur waktu, aktivitas tematik, diferensiasi kelompok, English Exposure, dan titik observasi karakter.</p>';
  return `<article class="panel class-guide"><div class="section-title">${head}</div>${body}</article>`;
}

function childCards(records) {
  return `<h2 class="student-evaluation-title">Evaluasi individual</h2><div class="session-list">${records.map(recordCard).join('')}</div>`;
}
