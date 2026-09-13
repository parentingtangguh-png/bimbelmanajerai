import { createClient } from '@supabase/supabase-js';
import { escapeHtml as h } from './domain.js';
import {
  ORG_NAME,
  initialState,
  state,
  icons,
  labels,
  reminderOfTheDay,
  schoolYearOf,
  ageText
} from './state.js';
// select diimpor karena scripts/check-imports.mjs mencocokkan kata, termasuk .select() milik Supabase.
import { field, select, notify, modal } from './ui.js';
import { curriculumView } from './views/curriculum.js';
import {
  sessionsView,
  scheduleForm,
  kidsSummary,
  meetingRows,
  scheduleValues,
  meetingSheet,
  finishState
} from './views/sessions.js';
import { studentsView, studentForm } from './views/students.js';
import { diagnosticForm } from './views/diagnostic.js';
import { diagnosticOutcome, diagnosticPayload } from './diagnostic.js';
import { dashboard } from './views/dashboard.js';
import { homeMenu, homeTop, homeDoa, homeNav, leafArt } from './views/home.js';
import { teamView } from './views/team.js';
import './style.css';
import './curriculum.css';
import './owner.css';
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
async function allRows(table, order) {
  const rows = [];
  for (let from = 0; ; from += 500) {
    const page = await result(
      db
        .from(table)
        .select('*')
        .order(order)
        .range(from, from + 499)
    );
    rows.push(...page);
    if (page.length < 500) return rows;
  }
}
// Semua data yang dipakai layar: siswa, kurikulum pilot, dan tes diagnostik. Pemilik juga memuat tim.
async function refresh() {
  const [
    students,
    curriculumPhases,
    curriculumLevels,
    curriculumIndicators,
    curriculumThemes,
    diagnosticTests,
    diagnosticResults,
    classSchedules,
    classScheduleStudents
  ] = await Promise.all([
    allRows('students', 'name'),
    result(db.from('curriculum_phases').select('*').order('sort_order')),
    result(db.from('curriculum_levels').select('*').order('level')),
    result(db.from('curriculum_level_indicators').select('*').order('level').order('number')),
    result(db.from('curriculum_themes').select('*').order('number')),
    allRows('diagnostic_tests', 'id'),
    allRows('diagnostic_results', 'test_id'),
    allRows('class_schedules', 'id'),
    allRows('class_schedule_students', 'schedule_id')
  ]);
  Object.assign(state, {
    classSchedules,
    classScheduleStudents,
    students,
    curriculumPhases,
    curriculumLevels,
    curriculumIndicators,
    curriculumThemes,
    diagnosticTests,
    diagnosticResults
  });
  if (state.role === 'owner') {
    [state.members, state.assignments, state.profiles] = await Promise.all([
      allRows('access_list', 'email'),
      allRows('assignments', 'student_id'),
      allRows('profiles', 'id')
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
// Tes diagnostik yang belum disimpan tinggal di perangkat guru, per akun dan per anak, supaya tes bisa
// dijeda, berpindah anak, lalu dilanjutkan. Browser yang menolak localStorage hanya kehilangan fitur jeda.
const draftKey = () => 'bimbel.diagnostic.' + (state.user?.id || 'tamu');
function readDrafts() {
  try {
    return JSON.parse(localStorage.getItem(draftKey()) || '{}') || {};
  } catch {
    return {};
  }
}
function writeDrafts(drafts) {
  state.diagnosticDrafts = drafts;
  try {
    localStorage.setItem(draftKey(), JSON.stringify(drafts));
  } catch {
    /* Simpanan sementara tidak tersedia; tes tetap berjalan selama modal terbuka. */
  }
}
function keepDraft(run = state.diagnostic) {
  if (run) writeDrafts({ ...readDrafts(), [run.student]: run });
}
function dropDraft(studentId) {
  const drafts = readDrafts();
  delete drafts[studentId];
  writeDrafts(drafts);
}
const hasAnswers = run => Boolean(run) && Object.keys(run.answers || {}).length > 0;

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
  // The name is wrapped so a phone can drop it and keep only the screen it names.
  const where = `<span class="org">${ORG_NAME}</span> <span class="slash">/</span> ${labels[state.view]}`;
  return `<header class="topbar"><span>${where}</span><span class="date">${today}</span>${actions}</header>`;
}

// The login screen is a story column beside the form. The story is fixed; only the form reacts to
// whether Supabase is reachable at all.
function loginStory() {
  const brand = `<div class="brand">b<span>·</span> ${ORG_NAME}</div>`;
  const pitch = `<h1>Langkah kecil.<br><em>Kemajuan berarti.</em></h1><p>Lebih dekat dengan setiap anak, lebih tenang menjalani hari mengajar.</p>`;
  const card = `<div class="story-card"><span class="sprout">✳</span><div><strong>Setiap anak punya jalannya.</strong><p>Materi personal · Evaluasi adaptif · Kabar baik untuk keluarga</p></div></div>`;
  // Di HP layar login memakai kepala yang sama dengan menu utama: logo daun menggantikan "b·", dan
  // daun besar samar jadi latar. Keduanya tersembunyi di layar lebar.
  const phoneBrand = `<div class="login-phone-brand"><span class="home-mark" aria-hidden="true">${leafArt()}</span><span><strong>${ORG_NAME}</strong><small>Ruang tumbuh bersama</small></span></div>`;
  const leaf = `<div class="login-leaf" aria-hidden="true">${leafArt()}</div>`;
  return `<section class="login-story">${leaf}${phoneBrand}${brand}<div>${pitch}${card}</div><small>Dibangun untuk guru yang peduli.</small></section>`;
}

function loginForm() {
  const warning = !configured
    ? '<div class="notice">Koneksi Supabase belum diatur, jadi belum ada yang bisa masuk. Periksa berkas config.json atau variabel VITE_SUPABASE_URL dan VITE_SUPABASE_PUBLISHABLE_KEY.</div>'
    : '';
  const inputs = `${field('Email terdaftar', 'email', 'email', '', 'required autocomplete="email"')}${field('Kata sandi', 'password', 'password', '', 'required minlength="8" autocomplete="current-password"')}`;
  const buttons = `<button class="primary full" ${configured ? '' : 'disabled'}>Masuk →</button><button type="button" class="text-btn full" data-action="register" ${configured ? '' : 'disabled'}>Guru baru? Aktifkan akun yang sudah didaftarkan pemilik</button>`;
  return `<section class="login-form"><div class="login-box"><h2>Assalamu’alaikum</h2><p class="muted">Masuk dengan akun guru atau pemilik.</p>${warning}<form id="login-form">${inputs}${buttons}</form><p class="fine">Akses hanya untuk pemilik dan guru terdaftar.</p></div></section>`;
}

function login() {
  root.innerHTML = `<main class="login">${loginStory()}${loginForm()}</main>`;
}
// Re-rendering replaces the whole page, so keep unsaved classroom inputs and the scroll position.

let lastView = '';
// Shared devices: never keep one account's data in memory for the next login.
function resetSession() {
  lastView = '';
  Object.assign(state, initialState());
}
function render() {
  if (!state.user) {
    login();
    return;
  }
  const y = state.view === lastView ? scrollY : 0;
  lastView = state.view;
  // Pemilik memantau dan mengurus tim; ruang kelas milik guru.
  if (state.role === 'owner' && state.view === 'sessions') state.view = 'dashboard';
  const nav =
    state.role === 'owner'
      ? ['dashboard', 'students', 'team', 'curriculum']
      : ['dashboard', 'students', 'sessions', 'curriculum'];
  // Di layar HP dasbor dibuka oleh menu utama, dan kepala serta doa menemani semua tab. CSS yang
  // memilih mana yang tampil.
  const home = state.view === 'dashboard' ? homeMenu() : '';
  const reminder =
    state.role === 'teacher'
      ? (() => {
          const [lead, rest] = reminderOfTheDay();
          return `<div class="onboarding reminder"><div><strong>${h(lead)}</strong><p>${h(rest)}</p></div></div>`;
        })()
      : '';
  const screens = {
    dashboard: dashboard,
    students: studentsView,
    sessions: sessionsView,
    team: teamView,
    curriculum: curriculumView
  };
  root.innerHTML = `<div class="shell${home ? ' at-home' : ''}">${sidebar(nav)}<main class="workspace">${topbar()}${homeTop(ORG_NAME)}${reminder}${home}<section class="content">${screens[state.view]()}</section>${homeDoa()}${homeNav()}<footer>${ORG_NAME} <span>Belajar bertumbuh, bersama.</span></footer></main></div><dialog id="modal"></dialog>`;
  scrollTo(0, y);
}

document.addEventListener('click', async e => {
  const b = e.target.closest('[data-action],[data-view]');
  if (!b) return;
  e.preventDefault();
  if (b.dataset.view) {
    document.querySelector('dialog[open]')?.close();
    state.view = b.dataset.view;
    render();
    return;
  }
  const { action, id } = b.dataset;
  try {
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
    if (action === 'diagnostic-test') {
      if (state.role !== 'teacher') return notify('Tes diagnostik dilakukan oleh guru.', true);
      state.diagnostic = null;
      state.diagnosticDrafts = readDrafts();
      return diagnosticForm();
    }
    if (action === 'diagnostic-resume') {
      const run = readDrafts()[id];
      // Simpanan dari versi tes lama tidak bisa dilanjutkan.
      if (!run?.level) {
        dropDraft(id);
        return notify('Tes sementara ini dari versi lama dan tidak bisa dilanjutkan. Mulai tes baru.', true);
      }
      state.diagnostic = run;
      return diagnosticForm();
    }
    if (action === 'diagnostic-discard') {
      if (!confirm('Buang tes yang belum selesai ini? Jawabannya akan dihapus.')) return;
      dropDraft(id);
      return diagnosticForm();
    }
    // Ulang dari awal menghapus jawaban, jadi guru diminta memastikan dulu.
    if (action === 'diagnostic-restart') {
      const run = state.diagnostic;
      if (hasAnswers(run) && !confirm('Ulang dari awal? Jawaban tes anak ini akan dihapus.')) return;
      if (run) dropDraft(run.student);
      state.diagnostic = null;
      return diagnosticForm();
    }
    // Dari halaman hasil kembali ke kartu tugas, dengan semua nilai tetap terisi.
    if (action === 'diagnostic-back') {
      if (!state.diagnostic) return diagnosticForm();
      state.diagnostic.reviewed = false;
      keepDraft();
      return diagnosticForm();
    }
    if (action === 'new-schedule') return modal('Buat jadwal', scheduleForm());
    // Tambah sesi ke hari yang sama: tanggal dan nomor pertemuan mengikuti sesi yang sudah ada.
    if (action === 'add-session')
      return modal('Tambah sesi', scheduleForm({ ...scheduleValues(id), time: '', fixedDate: true }));
    if (action === 'open-schedule') return modal('Sesi', meetingSheet(id));
    if (action === 'edit-schedule') return modal('Ubah jadwal', scheduleForm(scheduleValues(id), id));
    if (action === 'password') return modal('Ganti kata sandi', passwordForm());
    if (action === 'new-member')
      return modal(
        'Daftarkan guru',
        `<form data-form="member">${field('Nama guru', 'name', 'text', '', 'required maxlength="120"')}${field('Email guru', 'email', 'email', '', 'required')}<button class="primary full">Daftarkan email guru</button></form>`
      );
    b.disabled = true;
    if (action === 'delete-schedule') {
      if (!confirm('Hapus jadwal ini? Siswa dan tanggalnya ikut terhapus dari jadwal.')) return;
      await result(db.rpc('delete_schedule', { p_schedule: id }));
      await refresh();
      return notify('Jadwal dihapus.');
    }
    if (action === 'delete-student') {
      const s = state.students.find(x => x.id === id);
      if (
        !confirm(
          `Hapus ${s?.name || 'siswa ini'} secara permanen beserta hasil tes diagnostiknya? Data yang dihapus tidak bisa dikembalikan.`
        )
      )
        return;
      await result(db.rpc('delete_student', { p_student: id }));
      dropDraft(id);
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
            : `Nonaktifkan ${s?.name || 'siswa ini'}? Datanya tetap tersimpan.`
        )
      )
        return;
      await result(db.rpc('set_student_active', { p_student: id, p_active: activate }));
      document.querySelector('#modal').close();
      await refresh();
      return notify(activate ? 'Siswa diaktifkan kembali.' : 'Siswa dinonaktifkan.');
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
  } catch (err) {
    notify(err.message, true);
  } finally {
    b.disabled = false;
  }
});
document.addEventListener('change', e => {
  const form = e.target.form;
  // Memilih siswa memperbarui ringkasan dan dropdown indikator per siswa di tempat, tanpa menutup daftar.
  if (form?.dataset.form === 'meeting' && e.target.name === 'students') {
    const f = new FormData(form);
    const ids = f.getAll('students');
    form.querySelector('[data-kids-summary]').textContent = kidsSummary(ids);
    form.querySelector('[data-meeting-rows]').outerHTML = meetingRows(new Set(ids), Object.fromEntries(f));
    return updateFinish(form);
  }
  if (form?.dataset.form === 'meeting' && e.target.name.startsWith('r_')) return updateFinish(form);
  if (form?.dataset.form === 'diagnostic-start' && e.target.name === 'student')
    return diagnosticForm(e.target.value);
  // Setiap nilai yang dipilih langsung disimpan sementara, jadi tes yang terhenti tidak kehilangan jawaban.
  if (form?.dataset.form === 'diagnostic-level' && /^i\d$/.test(e.target.name) && state.diagnostic) {
    const run = state.diagnostic;
    run.answers = { ...run.answers, [e.target.name.slice(1)]: e.target.value };
    return keepDraft(run);
  }
  if (form?.dataset.form === 'diagnostic-start' && e.target.name === 'start') {
    for (const el of form.querySelectorAll('[data-level-desc]'))
      el.hidden = el.dataset.levelDesc !== e.target.value;
    return;
  }
  if (e.target.name === 'birth_date' && form?.dataset.form === 'student') {
    const age = ageText(e.target.value);
    form.querySelector('[data-age]').textContent = age ? 'Usia ' + age : 'Usia dihitung otomatis';
  }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target.matches('tr[data-action]')) e.target.click();
});
document.addEventListener('input', e => {
  if (e.target.id !== 'student-search') return;
  state.filter = e.target.value;
  const pos = e.target.selectionStart;
  render();
  const input = document.querySelector('#student-search');
  input.focus();
  try {
    input.setSelectionRange(pos, pos);
  } catch {}
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
        const before = state.students.find(x => x.id === id);
        const payload = {
          name: v.name.trim(),
          parent_name: v.parent_name.trim(),
          phone: v.phone,
          nickname: (v.nickname || '').trim(),
          birth_date: v.birth_date,
          school_grade: v.school_grade,
          // Tahun ajaran hanya diperbarui kalau kelasnya berubah; kalau tidak, tahun lamanya tetap berlaku.
          school_year:
            before && before.school_grade === v.school_grade && before.school_year
              ? before.school_year
              : schoolYearOf()
        };
        if (id) await result(db.rpc('update_student_profile', { p_student: id, p_payload: payload }));
        else await result(db.rpc('create_student', { p_payload: payload }));
        break;
      }
      // Tes Diagnostik berjalan bertahap di dalam modal; dua langkah pertama belum menyimpan apa pun.
      case 'diagnostic-start': {
        if (!state.students.some(x => x.id === v.student)) throw new Error('Pilih anak yang dites.');
        state.diagnostic = {
          student: v.student,
          level: Number(v.start),
          answers: {},
          reviewed: false,
          note: ''
        };
        keepDraft();
        return diagnosticForm();
      }
      case 'diagnostic-level': {
        const run = state.diagnostic;
        run.answers = Object.fromEntries(
          [1, 2, 3, 4, 5, 6, 7, 8].filter(n => v['i' + n]).map(n => [n, v['i' + n]])
        );
        run.reviewed = true;
        keepDraft(run);
        return diagnosticForm();
      }
      case 'diagnostic': {
        const run = state.diagnostic;
        const s = state.students.find(x => x.id === id);
        if (!run || !s || run.student !== s.id)
          throw new Error('Tes diagnostik tidak ditemukan. Mulai ulang tesnya.');
        if (!diagnosticOutcome(run.level, run.answers).complete)
          throw new Error('Indikator 1–6 belum semuanya dinilai.');
        // save_diagnostic menyimpan hasil per indikator dan level anak dalam satu transaksi, dan menghitung
        // ulang hasilnya sendiri dari nilai yang dikirim.
        await result(
          db.rpc('save_diagnostic', {
            p_student: s.id,
            p_level: run.level,
            p_results: diagnosticPayload(run.level, run.answers),
            p_note: v.note || ''
          })
        );
        dropDraft(s.id);
        state.diagnostic = null;
        break;
      }
      case 'schedule': {
        // Pertemuan dan tema ditentukan database; guru hanya mengisi tanggal dan jam.
        const payload = { scheduled_date: v.date, scheduled_time: v.time || '' };
        await result(db.rpc('save_schedule', { p_schedule: id || null, p_payload: payload }));
        break;
      }
      // Isi pertemuan: Simpan sementara (bisa diubah lagi) atau Tandai selesai (final).
      case 'meeting': {
        const finish = e.submitter?.value === '1';
        // Level dan indikator dihitung database; guru hanya memilih siswa hadir dan Lulus/Belum.
        const students = f.getAll('students').map(sid => ({ student_id: sid, result: v['r_' + sid] || '' }));
        if (finish) {
          if (!students.length) throw new Error('Pilih minimal satu siswa yang hadir.');
          if (students.some(s => !s.result))
            throw new Error('Beri setiap siswa yang hadir Lulus atau Belum.');
          if (!confirm('Tandai sesi selesai? Hasilnya tidak bisa diubah lagi.')) return;
        }
        await result(db.rpc('save_meeting', { p_schedule: id, p_students: students, p_finish: finish }));
        document.querySelector('#modal')?.close();
        await refresh();
        notify(finish ? 'Sesi ditandai selesai.' : 'Tersimpan sementara. Bisa diubah lagi sebelum selesai.');
        return;
      }
      case 'password': {
        if (v.password !== v.confirm) throw new Error('Kedua kata sandi belum sama.');
        if (String(v.password).length < 8) throw new Error('Kata sandi minimal 8 karakter.');
        await result(db.auth.updateUser({ password: v.password }));
        document.querySelector('#modal').close();
        notify('Kata sandi berhasil diganti.');
        return;
      }
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
    }
    document.querySelector('#modal')?.close();
    await refresh();
    notify('Perubahan berhasil disimpan.');
  } catch (err) {
    notify(err.message, true);
  } finally {
    buttons.forEach(b => (b.disabled = false));
    if (form.dataset.form === 'meeting' && form.isConnected) updateFinish(form);
  }
});

// Tombol "Tandai sesi selesai" mengikuti isi lembar: aktif bila setiap siswa yang dicentang sudah Lulus/Belum.
function updateFinish(form) {
  const f = new FormData(form);
  const ids = [...form.querySelectorAll('[data-meeting-rows] input[type="radio"]')]
    .map(r => r.name.slice(2))
    .filter((x, i, a) => a.indexOf(x) === i);
  const { done, hint } = finishState(ids, Object.fromEntries(f));
  form.querySelector('[data-finish]').disabled = !done;
  form.querySelector('[data-finish-hint]').textContent = hint;
}
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
