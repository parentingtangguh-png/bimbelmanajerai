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
  finishState,
  promptBox
} from './views/sessions.js';
import { activityPrompt } from './prompt.js';
import { studentsView, studentForm } from './views/students.js';
import { diagnosticForm, diagnosticSummary } from './views/diagnostic.js';
import { answersOf, isStopped } from './diagnostic.js';
import { dashboard } from './views/dashboard.js';
import { homeMenu, homeTop, homeDoa, homeNav, leafArt } from './views/home.js';
import { guideButton, guideBody } from './views/guide.js';
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
// Semua data yang dipakai layar: siswa, tes diagnostik, kelas, dan kurikulum 8 level. Pemilik juga memuat tim.
async function refresh() {
  const [
    students,
    diagnosticTests,
    diagnosticResults,
    classSchedules,
    classScheduleStudents,
    k8Cp,
    k8Levels,
    k8Indicators,
    k8Notes,
    k8Themes,
    k8Subthemes,
    k8English
  ] = await Promise.all([
    allRows('students', 'name'),
    allRows('diagnostic_tests', 'id'),
    allRows('diagnostic_results', 'test_id'),
    allRows('class_schedules', 'id'),
    allRows('class_schedule_students', 'schedule_id'),
    result(db.from('k8_cp').select('text')),
    result(db.from('k8_levels').select('*').order('level')),
    result(db.from('k8_indicators').select('*').order('level').order('number')),
    result(db.from('k8_notes').select('*').order('doc').order('position')),
    result(db.from('k8_themes').select('*').order('number')),
    result(db.from('k8_subthemes').select('*').order('theme').order('position')),
    result(db.from('k8_theme_english').select('*').order('theme').order('kind').order('position'))
  ]);
  Object.assign(state, {
    k8Cp: k8Cp[0]?.text || '',
    k8Levels,
    k8Indicators,
    k8Notes,
    k8Themes,
    k8Subthemes,
    k8English,
    classSchedules,
    classScheduleStudents,
    students,
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
  root.innerHTML = `<div class="shell${home ? ' at-home' : ''}">${sidebar(nav)}<main class="workspace">${topbar()}${homeTop(ORG_NAME)}${reminder}${home}<section class="content">${screens[state.view]()}</section>${guideButton()}${homeDoa()}${homeNav()}<footer>${ORG_NAME} <span>Belajar bertumbuh, bersama.</span></footer></main></div><dialog id="modal"></dialog>`;
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
      return diagnosticForm();
    }
    if (action === 'diagnostic-open') {
      state.diagnostic = id;
      return diagnosticForm();
    }
    // Tes yang berhenti diganti tes baru di level saran; database menolak level lain.
    if (action === 'diagnostic-restart') {
      await result(db.rpc('start_diagnostic', { p_student: id, p_level: Number(b.dataset.level) }));
      await refresh();
      state.diagnostic = id;
      return diagnosticForm();
    }
    if (action === 'new-schedule') return modal('Buat jadwal', scheduleForm());
    // Tambah sesi ke hari yang sama: tanggal dan nomor pertemuan mengikuti sesi yang sudah ada.
    if (action === 'add-session')
      return modal('Tambah sesi', scheduleForm({ ...scheduleValues(id), time: '', fixedDate: true }));
    if (action === 'open-schedule') return modal('Sesi', meetingSheet(id));
    if (action === 'edit-schedule') return modal('Ubah jadwal', scheduleForm(scheduleValues(id), id));
    if (action === 'password') return modal('Ganti kata sandi', passwordForm());
    if (action === 'guide') return modal(`Panduan ${labels[state.view]}`, guideBody());
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
    // Guru meninggalkan aplikasi untuk menempel prompt, dan browser HP bisa memuat ulang tab yang ditinggal.
    // Karena itu kehadiran (dan nilai yang sudah diketuk) disimpan sementara lebih dulu, tanpa menutup lembar.
    // Bila gagal, prompt tetap ditampilkan supaya kelas tidak tertahan.
    if (action === 'activity-prompt') {
      const form = b.closest('form');
      const ids = new FormData(form).getAll('students');
      if (!ids.length) return notify('Centang siswa yang hadir lebih dulu.', true);
      let saved = false;
      try {
        await result(
          db.rpc('save_meeting', {
            p_schedule: form.dataset.id,
            p_students: meetingStudents(form),
            p_finish: false
          })
        );
        state.classScheduleStudents = await allRows('class_schedule_students', 'schedule_id');
        listStale = saved = true;
      } catch (err) {
        notify('Kehadiran belum tersimpan: ' + err.message, true);
      }
      const box = form.querySelector('[data-prompt-box]');
      box.innerHTML = promptBox(activityPrompt(form.dataset.id, ids), saved);
      box.hidden = false;
      return box.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
    if (action === 'copy-prompt') {
      const box = b.closest('form').querySelector('[data-prompt-text]');
      try {
        await navigator.clipboard.writeText(box.value);
      } catch {
        box.select();
        document.execCommand('copy');
      }
      return notify('Prompt tersalin. Tempel ke obrolan baru di ChatGPT atau Gemini.');
    }
    // Naik level setelah 12 indikator akademik Lulus; database memeriksa ulang syaratnya.
    if (action === 'level-up') {
      const s = state.students.find(x => x.id === id);
      if (
        !confirm(
          `Naikkan ${s?.name || 'anak ini'} ke Level ${Number(s?.pilot_level) + 1}? Tidak bisa dibatalkan.`
        )
      )
        return;
      await result(db.rpc('confirm_level_up', { p_student: id }));
      document.querySelector('#modal').close();
      await refresh();
      return notify('Level anak sudah dinaikkan.');
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
      notify(
        'Pendaftaran diterima. Minta pemilik bimbel mengaktifkan akun Anda, lalu masuk dengan email dan kata sandi ini.'
      );
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
    const c = state.classSchedules.find(x => x.id === form.dataset.id);
    form.querySelector('[data-meeting-rows]').outerHTML = meetingRows(new Set(ids), Object.fromEntries(f), c);
    // Prompt lama tidak sesuai lagi dan kehadiran baru belum tersimpan: guru mengetuk Prompt kegiatan lagi.
    form.querySelector('[data-prompt-box]').hidden = true;
    return updateFinish(form);
  }
  if (form?.dataset.form === 'meeting' && /^(r|en|kr)_/.test(e.target.name)) return updateFinish(form);
  if (form?.dataset.form === 'diagnostic-start' && e.target.name === 'student')
    return diagnosticForm(e.target.value);
  if (form?.dataset.form === 'diagnostic' && /^[sp]\d+$/.test(e.target.name)) return rateTask(form, e.target);
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
// Kelompok guru di Data siswa pemilik: yang dibuka tetap terbuka setelah render ulang.
document.addEventListener(
  'toggle',
  e => {
    const key = e.target.dataset?.teacher;
    if (key === undefined || state.filter) return;
    if (e.target.open) state.openTeachers.add(key);
    else state.openTeachers.delete(key);
  },
  true
);
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
      // Mulai tes: draf dibuat di server, lalu lembar 14 tugas dibuka.
      case 'diagnostic-start': {
        if (!state.students.some(x => x.id === v.student)) throw new Error('Pilih anak yang dites.');
        await result(db.rpc('start_diagnostic', { p_student: v.student, p_level: Number(v.start) }));
        await refresh();
        state.diagnostic = v.student;
        return diagnosticForm();
      }
      // Simpan final: database menghitung level dan indikator mulai kelas dari nilai yang tersimpan.
      case 'diagnostic': {
        if (!confirm('Simpan final tes ini? Hasilnya tidak bisa diubah lagi.')) return;
        await result(db.rpc('finalize_diagnostic', { p_student: id }));
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
        const students = meetingStudents(form);
        if (finish) {
          if (!students.length) throw new Error('Pilih minimal satu siswa yang hadir.');
          if (!finishState(f.getAll('students'), v).done)
            throw new Error('Beri setiap siswa yang hadir Lulus, Belum, atau Belum dinilai.');
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

// Setiap ketukan di lembar tes langsung disimpan. Status dan paket satu tugas dikirim bersama; state lokal
// diperbarui tanpa memuat ulang semua data, dan lembar dibuka ulang hanya bila tes berhenti.
async function rateTask(form, input) {
  const sid = form.dataset.id;
  const test = state.diagnosticTests.find(t => t.student_id === sid);
  const n = Number(input.name.slice(1));
  const f = new FormData(form);
  const status = f.get('s' + n) || null;
  const pkg = f.get('p' + n) || 'utama';
  try {
    await result(
      db.rpc('rate_diagnostic', { p_student: sid, p_number: n, p_status: status, p_package: pkg })
    );
    state.diagnosticResults = state.diagnosticResults.filter(r => !(r.test_id === test.id && r.number === n));
    if (status) state.diagnosticResults.push({ test_id: test.id, number: n, status, package: pkg });
    const answers = answersOf(state.diagnosticResults, test.id);
    if (isStopped(test.tested_level, answers)) return diagnosticForm();
    form.querySelector('[data-diagnostic-summary]').outerHTML = diagnosticSummary(test.tested_level, answers);
  } catch (err) {
    notify(err.message, true);
    diagnosticForm();
  }
}

// Isi lembar sesi untuk save_meeting. Level dan indikator dihitung database; guru hanya memilih siswa hadir
// dan nilainya.
function meetingStudents(form) {
  const f = new FormData(form);
  return f.getAll('students').map(sid => ({
    student_id: sid,
    result: f.get('r_' + sid) || '',
    english: f.get('en_' + sid) || '',
    character: f.get('kr_' + sid) || ''
  }));
}
// Prompt kegiatan menyimpan sementara tanpa render (render menutup lembar), jadi daftar jadwal di belakang
// lembar disusun ulang setelah lembar ditutup.
let listStale = false;
document.addEventListener(
  'close',
  e => {
    if (e.target.id !== 'modal' || !listStale) return;
    listStale = false;
    render();
  },
  true
);
// Tombol "Tandai sesi selesai" mengikuti isi lembar: aktif bila setiap siswa yang dicentang sudah dinilai.
function updateFinish(form) {
  const f = new FormData(form);
  const ids = f.getAll('students');
  const { done, hint } = finishState(ids, Object.fromEntries(f));
  form.querySelector('[data-finish]').disabled = !done;
  form.querySelector('[data-finish-hint]').textContent = hint;
  // Prompt kegiatan baru bisa diketuk setelah ada siswa yang dicentang.
  form.querySelector('[data-prompt-button]').disabled = !ids.length;
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
