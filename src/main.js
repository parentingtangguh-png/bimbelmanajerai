import { createClient } from '@supabase/supabase-js';
import {
  escapeHtml as h,
  progress,
  waLink,
  localDate,
  minutesBetween,
  durationPattern,
  formatTime
} from './domain.js';
import {
  ORG_NAME,
  initialState,
  state,
  icons,
  labels,
  subjects,
  subjectLabels,
  reminderOfTheDay,
  characterLabels,
  studentFor,
  assessmentsFor,
  checksFor,
  priorChecks,
  hintText,
  observationFor,
  activeCompetenciesFor,
  ready,
  timeLabel,
  scheduleMembers,
  durationText,
  areaProgress,
  indicatorsOf,
  phaseOf,
  phaseShort,
  phaseEnd,
  phasePct,
  startPresets,
  levelOptions
} from './state.js';
import { field, select, area, empty, notify, heading, meter, modal } from './ui.js';
import { curriculumView } from './views/curriculum.js';
import { sessionsView, newSession } from './views/sessions.js';
import { studentsView, levelMeaning, studentForm, scheduleForm } from './views/students.js';
import { dashboard } from './views/dashboard.js';
import { teamView } from './views/team.js';
import './style.css';
import './curriculum.css';
import './owner.css';
import './schedule.css';
import './student-form.css';

const root = document.querySelector('#app');
let publicConfig = {};
try {
  const response = await fetch(new URL('./config.json', location.href));
  if (response.ok) publicConfig = await response.json();
} catch {
  /* Local preview is available without configuration. */
}
const url = import.meta.env.VITE_SUPABASE_URL || publicConfig.supabaseUrl;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || publicConfig.supabasePublishableKey;
const configured = url?.startsWith('https://') && key && !url.includes('PROJECT_REF');
const db = configured ? createClient(url, key) : null;
async function result(query) {
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}
async function allRows(table, order = 'id') {
  const rows = [];
  for (let from = 0; ; from += 500) {
    let query = db.from(table).select('*').order(order);
    if (table === 'assignments') query = query.order('teacher_id');
    if (table === 'student_competencies' || table === 'session_assessments') query = query.order('subject');
    const page = await result(query.range(from, from + 499));
    rows.push(...page);
    if (page.length < 500) return rows;
  }
}
async function refresh() {
  const [
    students,
    classes,
    records,
    themes,
    curriculum,
    competencies,
    assessments,
    observations,
    indicatorChecks,
    schedules,
    scheduleStudents
  ] = await Promise.all([
    allRows('students'),
    allRows('class_sessions'),
    allRows('session_students'),
    result(db.from('themes').select('*').order('name')),
    result(db.from('curriculum').select('*').order('level')),
    allRows('student_competencies', 'student_id'),
    allRows('session_assessments', 'session_student_id'),
    allRows('session_observations', 'session_student_id'),
    allRows('session_indicator_checks', 'session_student_id'),
    allRows('schedules'),
    allRows('schedule_students', 'schedule_id')
  ]);
  students.sort((a, b) => a.name.localeCompare(b.name));
  classes.sort((a, b) => b.date.localeCompare(a.date) || b.created_at.localeCompare(a.created_at));
  schedules.sort((a, b) => a.start_time.localeCompare(b.start_time) || a.name.localeCompare(b.name));
  Object.assign(state, {
    students,
    classes,
    records,
    themes,
    curriculum,
    competencies,
    assessments,
    observations,
    indicatorChecks,
    schedules,
    scheduleStudents
  });
  if (state.role === 'owner') {
    [state.alerts, state.members, state.assignments, state.profiles] = await Promise.all([
      allRows('student_alerts', 'student_id'),
      allRows('access_list', 'email'),
      allRows('assignments', 'student_id'),
      allRows('profiles')
    ]);
  }
  render();
}
async function loadUser(user) {
  state.user = user;
  const profile = await result(db.from('profiles').select('*').eq('id', user.id).single());
  const member = await result(db.from('access_list').select('*').eq('email', profile.email).single());
  if (!member.active) throw new Error('Akses akun ini dinonaktifkan. Hubungi pemilik.');
  state.name = profile.name;
  state.role = member.role;
  await refresh();
}
function passwordForm() {
  const intro = `<p class="muted">Kata sandi baru minimal 8 karakter. Setelah diganti, sesi di perangkat lain tetap berjalan sampai Anda keluar dari sana.</p>`;
  const baru = field(
    'Kata sandi baru',
    'password',
    'password',
    '',
    'required minlength="8" autocomplete="new-password"'
  );
  const ulangi = field(
    'Ulangi kata sandi baru',
    'confirm',
    'password',
    '',
    'required minlength="8" autocomplete="new-password"'
  );
  return `<form data-form="password">${intro}${baru}${ulangi}<button class="primary full">Simpan kata sandi baru</button></form>`;
}

// One subject inside the owner's curriculum editor: the goal, its indicators, which of them is the
// spiral node, why the next level needs it, and what counts as evidence.
function curriculumFieldset(k, c) {
  const goal = area('Tujuan kompetensi', k, c[k], 'required maxlength="2000"');
  const indicators = area(
    'Indikator (satu per baris, maksimal 6)',
    `${k}_indicators`,
    indicatorsOf(c, k).join('\n'),
    'maxlength="3000"'
  );
  const key = field(
    'Nomor indikator simpul spiral (0 bila tidak ada)',
    `${k}_key`,
    'number',
    String(Number(c[`${k}_key`] || 0)),
    'min="0" max="6"'
  );
  const spiral = area(
    'Simpul spiral menuju level berikutnya',
    `${k}_spiral`,
    c[`${k}_spiral`] || '',
    'maxlength="2000"'
  );
  const criteria = area(
    'Bukti keberhasilan',
    `${k}_criteria`,
    c[`${k}_criteria`],
    'required maxlength="2000"'
  );
  return `<fieldset class="curriculum-edit"><h3>${h(subjectLabels[k])}</h3>${goal}${indicators}${key}${spiral}${criteria}</fieldset>`;
}

// The chrome around every screen: the sidebar that switches screens and the bar that names the
// current one. Neither depends on which screen is showing, apart from the active nav item.
function navButtons(nav) {
  return nav
    .map(
      k =>
        `<button class="nav-item ${state.view === k ? 'active' : ''}" data-view="${k}"><span aria-hidden="true">${icons[k]}</span>${labels[k]}${k === 'sessions' ? '<i>→</i>' : ''}</button>`
    )
    .join('');
}

function accountCard() {
  const who = `<span class="avatar">${h(state.name.slice(0, 1))}</span><div><strong>${h(state.name)}</strong><small>${state.role === 'owner' ? 'Pemilik' : 'Guru pengajar'}</small></div>`;
  const actions = `<button title="Ganti kata sandi" aria-label="Ganti kata sandi" data-action="password">⚿</button><button title="Keluar" aria-label="Keluar" data-action="logout">↗</button>`;
  return `<div class="account">${who}${actions}</div>`;
}

function sidebar(nav) {
  const brand = `<a href="#" class="brand" data-view="dashboard">b<span>·</span><div>${ORG_NAME}<small>Ruang tumbuh bersama</small></div></a>`;
  const note = `<div class="sidebar-note"><span>✳</span><p>Setiap kemajuan<br>layak dirayakan.</p><small>Satu anak, satu perjalanan.</small></div>`;
  return `<aside class="sidebar">${brand}<div class="nav-label">RUANG KERJA</div><nav>${navButtons(nav)}</nav>${note}${accountCard()}</aside>`;
}

function topbar() {
  const today = new Intl.DateTimeFormat('id-ID', { dateStyle: 'long', timeZone: 'Asia/Jakarta' }).format(
    new Date()
  );
  const actions = `<div class="top-actions"><button data-action="refresh" title="Muat ulang data" aria-label="Muat ulang data">↻</button><button data-action="logout" aria-label="Keluar akun">Keluar ↗</button></div>`;
  return `<header class="topbar"><span>${ORG_NAME} <span class="slash">/</span> ${labels[state.view]}</span><span class="date">${today}</span>${actions}</header>`;
}

// The login screen is a story column beside the form. The story is fixed; only the form reacts to
// whether Supabase is reachable at all.
function loginStory() {
  const brand = `<div class="brand">b<span>·</span> ${ORG_NAME}</div>`;
  const pitch = `<div class="eyebrow">RUANG TUMBUH BERSAMA</div><h1>Langkah kecil.<br><em>Kemajuan berarti.</em></h1><p>Lebih dekat dengan setiap anak.<br>Lebih tenang menjalani hari mengajar.</p>`;
  const card = `<div class="story-card"><span class="sprout">✳</span><div><strong>Setiap anak punya jalannya.</strong><p>Materi personal · Evaluasi adaptif · Kabar baik untuk keluarga</p></div></div>`;
  return `<section class="login-story">${brand}<div>${pitch}${card}</div><small>Dibangun untuk guru yang peduli.</small></section>`;
}

function loginForm() {
  const warning = !configured
    ? '<div class="notice">Koneksi Supabase belum diatur. Pratinjau tampilan tersedia dengan data contoh.</div>'
    : '';
  const inputs = `${field('Email terdaftar', 'email', 'email', '', 'required autocomplete="email"')}${field('Kata sandi', 'password', 'password', '', 'required minlength="8" autocomplete="current-password"')}`;
  const buttons = `<button class="primary full" ${configured ? '' : 'disabled'}>Masuk ke ruang belajar →</button><button type="button" class="text-btn full" data-action="register" ${configured ? '' : 'disabled'}>Aktivasi akun yang sudah didaftarkan pemilik</button>`;
  return `<section class="login-form"><div class="login-box"><span class="pill">RUMAH BELAJAR / 02</span><h2>Selamat datang kembali</h2><p class="muted">Masuk untuk melanjutkan perjalanan belajar anak.</p>${warning}<form id="login-form">${inputs}${buttons}</form><p class="fine">Akses hanya untuk pemilik dan guru terdaftar.</p></div></section>`;
}

function login() {
  root.innerHTML = `<main class="login">${loginStory()}${loginForm()}</main>`;
}
// Re-rendering replaces the whole page, so keep unsaved classroom inputs and the scroll position.
const drafts = new Map();
let lastScreen = '';
// Shared devices: never keep one account's data or unsaved inputs in memory for the next login.
function resetSession() {
  drafts.clear();
  lastScreen = '';
  Object.assign(state, initialState());
}
function saveDrafts() {
  document.querySelectorAll('.session-card form[data-id]').forEach(form => {
    const values = {};
    form.querySelectorAll('input,select,textarea').forEach(el => {
      if (!el.name || el.disabled) return;
      if (el.type === 'checkbox') {
        values[el.name] ??= [];
        if (el.checked) values[el.name].push(el.value);
      } else values[el.name] = el.value;
    });
    drafts.set(form.dataset.form + ':' + form.dataset.id, values);
  });
}
function restoreDrafts() {
  document.querySelectorAll('.session-card form[data-id]').forEach(form => {
    const values = drafts.get(form.dataset.form + ':' + form.dataset.id);
    if (!values) return;
    form.querySelectorAll('input,select,textarea').forEach(el => {
      if (!el.name || el.disabled || !(el.name in values)) return;
      if (el.type === 'checkbox') el.checked = values[el.name].includes(el.value);
      else el.value = values[el.name];
    });
  });
}
function render() {
  if (!state.user) {
    login();
    return;
  }
  saveDrafts();
  const screen = state.view + ':' + state.active;
  const y = screen === lastScreen ? scrollY : 0;
  lastScreen = screen;
  // Owners see aggregates and manage team/curriculum; classroom work belongs to teachers.
  if (state.role === 'owner' && state.view === 'sessions') {
    state.view = 'dashboard';
    state.active = null;
  }
  const nav =
    state.role === 'owner'
      ? ['dashboard', 'students', 'team', 'curriculum']
      : ['dashboard', 'students', 'sessions', 'curriculum'];
  root.innerHTML = `<div class="shell">${sidebar(nav)}<main class="workspace">${topbar()}${
    state.role === 'teacher'
      ? (() => {
          const [lead, rest] = reminderOfTheDay();
          return `<div class="onboarding reminder"><div><strong>${h(lead)}</strong><p>${h(rest)}</p></div></div>`;
        })()
      : ''
  }<section class="content">${{ dashboard: dashboard, students: studentsView, sessions: sessionsView, team: teamView, curriculum: curriculumView }[state.view]()}</section><footer>${ORG_NAME} <span>Belajar bertumbuh, bersama.</span></footer></main></div><dialog id="modal"></dialog>`;
  restoreDrafts();
  scrollTo(0, y);
}
document.addEventListener('change', async e => {
  const box = e.target.closest('.indicator-check');
  if (!box) return;
  const wrap = box.closest('.indicator-checks');
  const all = [...wrap.querySelectorAll('.indicator-check')];
  const done = all.filter(x => x.checked).length;
  const key = Number(wrap.dataset.key || 0);
  const keyDone = !key || !all[key - 1] || all[key - 1].checked;
  wrap.querySelector('.indicator-hint').innerHTML = hintText(done, all.length, key, keyDone);
  const { record, subject } = wrap.dataset;
  const index = Number(box.dataset.index);
  const checked = box.checked;
  try {
    await result(
      db.rpc('set_indicator_check', {
        p_id: record,
        p_subject: subject,
        p_index: index,
        p_checked: checked,
        p_text: box.dataset.text || ''
      })
    );
    const rest = state.indicatorChecks.filter(
      c => !(c.session_student_id === record && c.subject === subject && c.indicator_index === index)
    );
    state.indicatorChecks = checked
      ? [
          ...rest,
          {
            session_student_id: record,
            subject,
            indicator_index: index,
            level_snapshot: 0,
            indicator_text: box.dataset.text || ''
          }
        ]
      : rest;
  } catch (error) {
    // The tick is the teacher's record of what they saw; if it did not save, say so rather than let it look saved.
    box.checked = !checked;
    const back = all.filter(x => x.checked).length;
    wrap.querySelector('.indicator-hint').innerHTML = hintText(
      back,
      all.length,
      key,
      !key || !all[key - 1] || all[key - 1].checked
    );
    notify(error.message || 'Centang gagal disimpan.', true);
  }
});

document.addEventListener('click', async e => {
  const b = e.target.closest('[data-action],[data-view]');
  if (!b) return;
  e.preventDefault();
  if (b.dataset.view) {
    state.view = b.dataset.view;
    state.active = null;
    render();
    return;
  }
  const { action, id, kind } = b.dataset;
  try {
    if (action === 'curriculum-tab') {
      state.curriculumTab = id;
      return render();
    }
    if (action === 'curriculum-subject') {
      state.curriculumSubject = id;
      return render();
    }
    if (action === 'curriculum-phase') {
      state.curriculumPhase = id;
      return render();
    }
    if (action === 'refresh') {
      await refresh();
      return notify('Data terbaru sudah dimuat.');
    }
    if (action === 'logout') {
      if (db) await db.auth.signOut();
      resetSession();
      return login();
    }
    if (action === 'close') return document.querySelector('#modal').close();
    if (action === 'student') return studentForm(state.students.find(s => s.id === id));
    if (action === 'new-student') {
      if (state.role !== 'teacher') return notify('Siswa baru ditambahkan oleh guru.', true);
      return studentForm();
    }
    if (action === 'new-session') return newSession();
    if (action === 'new-schedule') return scheduleForm();
    if (action === 'edit-schedule') return scheduleForm(state.schedules.find(x => x.id === id));
    if (action === 'open-session') {
      state.active = id;
      return render();
    }
    if (action === 'back-sessions') {
      state.active = null;
      return render();
    }
    if (action === 'password') return modal('Ganti kata sandi', passwordForm());
    if (action === 'new-member')
      return modal(
        'Daftarkan guru',
        `<form data-form="member">${field('Nama guru', 'name', 'text', '', 'required maxlength="120"')}${field('Email guru', 'email', 'email', '', 'required')}<button class="primary full">Daftarkan email guru</button></form>`
      );
    if (action === 'edit-curriculum') {
      const c = state.curriculum.find(c => c.level === Number(id));
      return modal(
        `Kurikulum level ${id}`,
        `<form data-form="curriculum" data-id="${id}">${subjects.map(k => curriculumFieldset(k, c)).join('')}<button class="primary">Simpan kurikulum</button></form>`
      );
    }
    if (action === 'copy') {
      await navigator.clipboard.writeText(state.records.find(r => r.id === id).report);
      return notify('Pesan berhasil disalin.');
    }
    if (action === 'print') {
      document
        .querySelectorAll('.session-card')
        .forEach(el => el.classList.toggle('print-target', !!el.querySelector(`[data-id="${id}"]`)));
      return window.print();
    }
    b.disabled = true;
    if (action === 'delete-student') {
      const s = state.students.find(x => x.id === id);
      if (
        !confirm(
          `Hapus ${s?.name || 'siswa ini'} secara permanen? Data yang sudah dihapus tidak bisa dikembalikan.`
        )
      )
        return;
      await result(db.rpc('delete_student', { p_student: id }));
      document.querySelector('#modal').close();
      await refresh();
      return notify('Siswa dihapus.');
    }
    if (action === 'toggle-student') {
      const s = state.students.find(x => x.id === id);
      const activate = b.dataset.active === 'true';
      if (
        !confirm(
          activate
            ? `Aktifkan kembali ${s?.name || 'siswa ini'}?`
            : `Nonaktifkan ${s?.name || 'siswa ini'}? Anak tidak ikut sesi kelas, tetapi riwayat belajarnya tetap tersimpan.`
        )
      )
        return;
      await result(db.rpc('set_student_active', { p_student: id, p_active: activate }));
      document.querySelector('#modal').close();
      await refresh();
      return notify(activate ? 'Siswa diaktifkan kembali.' : 'Siswa dinonaktifkan.');
    }
    if (action === 'delete-schedule') {
      if (!confirm('Hapus sesi jadwal ini? Data siswa tidak ikut terhapus.')) return;
      await result(db.from('schedules').delete().eq('id', id));
      document.querySelector('#modal').close();
      await refresh();
      return notify('Sesi jadwal dihapus.');
    }
    if (action === 'generate-class') {
      const c = state.classes.find(c => c.id === id);
      if (c?.material) return notify('Panduan kelas tersimpan sudah tampil.');
      b.textContent = 'Sedang menyusun…';
      const { data, error } = await db.functions.invoke('generate-learning', {
        body: { session_id: id, kind: 'class_material' }
      });
      if (error) {
        let detail;
        try {
          detail = await error.context?.json();
        } catch {}
        throw new Error(detail?.error || error.message);
      }
      if (data?.error) throw new Error(data.error);
      await refresh();
      return notify('Panduan kelas tersimpan. Periksa sebelum digunakan.');
    }
    if (action === 'print-class') {
      document.querySelector('.class-guide')?.classList.add('print-target');
      return window.print();
    }
    if (action === 'register') {
      const form = document.querySelector('#login-form');
      if (!form.reportValidity()) return;
      const f = new FormData(form);
      await result(
        db.auth.signUp({
          email: f.get('email'),
          password: f.get('password'),
          options: { emailRedirectTo: location.origin + location.pathname }
        })
      );
      notify('Aktivasi diterima. Periksa email konfirmasi, lalu masuk.');
    }
    if (action === 'toggle-member') {
      const m = state.members.find(m => m.email === id);
      await result(db.from('access_list').update({ active: !m.active }).eq('email', id));
      await refresh();
    }
    if (action === 'generate') {
      const r = state.records.find(r => r.id === id);
      if (r[kind === 'material' ? 'material' : 'report'])
        return notify('Hasil tersimpan sudah tampil di kartu ini.');
      b.textContent = 'Sedang menyusun…';
      const { data, error } = await db.functions.invoke('generate-learning', {
        body: { record_id: id, kind }
      });
      if (error) {
        let detail;
        try {
          detail = await error.context?.json();
        } catch {}
        throw new Error(detail?.error || error.message);
      }
      if (data?.error) throw new Error(data.error);
      await refresh();
      notify('Hasil AI tersimpan. Periksa isinya sebelum digunakan.');
    }
  } catch (err) {
    notify(err.message, true);
  } finally {
    b.disabled = false;
  }
});
// Student form: a grade preset fills the starting levels, and the meaning text follows the choice.
document.addEventListener('change', e => {
  const form = e.target.form;
  if (form?.dataset.form !== 'student' || !form.elements.reading_baseline) return;
  const els = form.elements;
  const levels = ['reading_baseline', 'math_baseline'];
  if (e.target.name === 'phase' && startPresets[e.target.value])
    for (const n of levels) if (!els[n].disabled) els[n].value = String(startPresets[e.target.value]);
  for (const n of levels)
    form.querySelector(`[data-meaning="${n}"]`).textContent = levelMeaning(
      n.startsWith('math') ? 'math' : 'bi',
      els[n].value
    );
});
// "＋ Tema lain…" reveals a free-text theme name; any listed theme hides it again.
document.addEventListener('change', e => {
  if (e.target.name !== 'theme' || e.target.form?.dataset.form !== 'session') return;
  const custom = e.target.form.querySelector('.theme-custom');
  const input = custom.querySelector('input');
  custom.hidden = e.target.value !== '__new';
  input.required = !custom.hidden;
  if (!custom.hidden) input.focus();
});
// Picking a schedule slot when opening a class pre-selects its children and duration pattern.
document.addEventListener('change', e => {
  if (e.target.name !== 'schedule' || e.target.form?.dataset.form !== 'session') return;
  const sc = state.schedules.find(x => x.id === e.target.value);
  if (!sc) return;
  const members = scheduleMembers(sc.id);
  const form = e.target.form;
  form.querySelectorAll('input[name="student"]').forEach(box => {
    box.checked = members.has(box.value);
  });
  form.elements.duration.value = String(durationPattern(minutesBetween(sc.start_time, sc.end_time)));
});
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target.matches('tr[data-action]')) e.target.click();
});
document.addEventListener('input', e => {
  if (e.target.form?.dataset.form === 'schedule' && ['start_time', 'end_time'].includes(e.target.name)) {
    const els = e.target.form.elements;
    document.querySelector('#schedule-duration').textContent = durationText(
      els.start_time.value,
      els.end_time.value
    );
    return;
  }
  if (e.target.id === 'student-search') {
    state.filter = e.target.value;
    const pos = e.target.selectionStart;
    render();
    const input = document.querySelector('#student-search');
    input.focus();
    try {
      input.setSelectionRange(pos, pos);
    } catch {}
  }
});
document.addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;
  const buttons = [...form.querySelectorAll('button')];
  buttons.forEach(b => (b.disabled = true));
  try {
    const f = new FormData(form);
    const v = Object.fromEntries(f);
    const id = form.dataset.id;
    if (form.id === 'login-form') {
      const data = await result(db.auth.signInWithPassword({ email: v.email, password: v.password }));
      await loadUser(data.user);
      return;
    }
    switch (form.dataset.form) {
      case 'student': {
        const payload = {
          name: v.name.trim(),
          parent_name: v.parent_name.trim(),
          phone: v.phone,
          interest: v.interest,
          diagnostic: v.diagnostic,
          learning_notes: v.learning_notes,
          reading_target: phaseEnd(v.reading_baseline),
          math_target: phaseEnd(v.math_baseline)
        };
        if (id) {
          const { name, parent_name, phone, interest, diagnostic, learning_notes } = payload;
          await result(
            db.rpc('update_student_profile', {
              p_student: id,
              p_payload: { name, parent_name, phone, interest, diagnostic, learning_notes, status: v.status }
            })
          );
          const before = state.students.find(x => x.id === id);
          if (
            v.reading_baseline &&
            (Number(v.reading_baseline) !== before?.reading_baseline ||
              Number(v.math_baseline) !== before?.math_baseline)
          )
            await result(
              db.rpc('correct_student_baseline', {
                p_student: id,
                p_reading: Number(v.reading_baseline),
                p_math: Number(v.math_baseline)
              })
            );
        } else {
          Object.assign(payload, {
            reading_baseline: Number(v.reading_baseline),
            math_baseline: Number(v.math_baseline)
          });
          await result(db.rpc('create_student', { p_payload: payload }));
        }
        break;
      }
      case 'session': {
        const ids = f.getAll('student');
        if (!ids.length) throw new Error('Pilih minimal satu siswa.');
        const theme = (v.theme && v.theme !== '__new' ? v.theme : v.theme_custom || '').trim();
        if (!theme) throw new Error('Isi tema bersama.');
        if (!state.themes.some(t => t.name === theme))
          await result(
            db.from('themes').upsert({ name: theme }, { onConflict: 'name', ignoreDuplicates: true })
          );
        const sc = state.schedules.find(x => x.id === v.schedule);
        const duration = sc
          ? durationPattern(minutesBetween(sc.start_time, sc.end_time))
          : Number(v.duration);
        state.active = await result(
          db.rpc('create_class', {
            p_id: id,
            p_date: v.date,
            p_theme: theme,
            p_students: ids,
            p_duration: duration
          })
        );
        if (sc) await result(db.rpc('set_class_schedule', { p_session: state.active, p_schedule: sc.id }));
        state.view = 'sessions';
        break;
      }
      case 'schedule': {
        const mins = minutesBetween(v.start_time, v.end_time);
        if (!(mins >= 30 && mins <= 180)) throw new Error('Durasi sesi harus 30–180 menit.');
        const payload = { name: v.name.trim(), start_time: v.start_time, end_time: v.end_time };
        let sid = id;
        if (sid) await result(db.from('schedules').update(payload).eq('id', sid));
        else sid = (await result(db.from('schedules').insert(payload).select('id').single())).id;
        const chosen = f.getAll('student');
        const old = [...scheduleMembers(sid)];
        const removed = old.filter(x => !chosen.includes(x));
        if (removed.length)
          await result(
            db.from('schedule_students').delete().eq('schedule_id', sid).in('student_id', removed)
          );
        const added = chosen.filter(x => !old.includes(x));
        if (added.length)
          await result(
            db.from('schedule_students').insert(added.map(student_id => ({ schedule_id: sid, student_id })))
          );
        break;
      }
      case 'attendance':
        await result(db.rpc('save_attendance', { p_id: id, p_attendance: v.attendance }));
        break;
      case 'evaluation': {
        const targets = assessmentsFor(id);
        if (targets.length) {
          const payload = targets.map(a => ({
            subject: a.subject,
            rating: v[`rating_${a.subject}`],
            note: v[`note_${a.subject}`] || ''
          }));
          const observation = {
            english_rating: v.english_rating || '',
            english_note: v.english_note || '',
            character_dimensions: f.getAll('character'),
            character_note: v.character_note || ''
          };
          await result(
            db.rpc('finalize_competency_evaluation', {
              p_id: id,
              p_assessments: payload,
              p_anecdote: v.anecdote || '',
              p_observation: observation
            })
          );
        } else
          await result(
            db.rpc('finalize_evaluation', {
              p_id: id,
              p_grade: v.grade || null,
              p_anecdote: v.anecdote || ''
            })
          );
        break;
      }
      case 'password': {
        if (v.password !== v.confirm) throw new Error('Kedua kata sandi belum sama.');
        if (String(v.password).length < 8) throw new Error('Kata sandi minimal 8 karakter.');
        await result(db.auth.updateUser({ password: v.password }));
        document.querySelector('#modal').close();
        notify('Kata sandi berhasil diganti.');
        return;
      }
      case 'summative':
        await result(
          db.rpc('complete_summative', { p_student: id, p_score: Number(v.score), p_pass: v.pass === 'true' })
        );
        break;
      case 'member':
        await result(
          db
            .from('access_list')
            .upsert(
              { email: v.email.trim().toLowerCase(), name: v.name.trim(), role: 'teacher', active: true },
              { onConflict: 'email', ignoreDuplicates: true }
            )
        );
        break;
      case 'curriculum': {
        const payload = {};
        for (const subject of subjects) {
          payload[subject] = v[subject];
          payload[`${subject}_criteria`] = v[`${subject}_criteria`];
          const lines = String(v[`${subject}_indicators`] || '')
            .split('\n')
            .map(x => x.trim())
            .filter(Boolean)
            .slice(0, 6);
          payload[`${subject}_indicators`] = lines;
          payload[`${subject}_key`] = Math.min(Math.max(0, Number(v[`${subject}_key`]) || 0), lines.length);
          payload[`${subject}_spiral`] = String(v[`${subject}_spiral`] || '');
        }
        await result(db.from('curriculum').update(payload).eq('level', Number(id)));
        break;
      }
    }
    document.querySelector('#modal')?.close();
    await refresh();
    notify('Perubahan berhasil disimpan.');
  } catch (err) {
    notify(err.message, true);
  } finally {
    buttons.forEach(b => (b.disabled = false));
  }
});
login();
if (db) {
  db.auth.getSession().then(async ({ data }) => {
    if (data.session)
      try {
        await loadUser(data.session.user);
      } catch (err) {
        notify(err.message, true);
        await db.auth.signOut();
        resetSession();
        login();
      }
  });
  db.auth.onAuthStateChange(event => {
    if (event === 'SIGNED_OUT') {
      resetSession();
      login();
    }
  });
}
