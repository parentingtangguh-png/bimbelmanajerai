import test from 'node:test';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { loadSampleState } from './fixtures/sample-state.mjs';
import {
  state,
  slogans,
  doas,
  sloganOfTheMoment,
  doaOfTheDay,
  ageText,
  schoolYearOf,
  testStatus,
  levelName
} from '../src/state.js';
import { sessionsView, meetingSheet, finishState, scheduleForm } from '../src/views/sessions.js';
import { passedIndicators, suggestedIndicator, englishReady } from '../src/state.js';
import { activityPrompt, previousCondition } from '../src/prompt.js';
import { dashboard } from '../src/views/dashboard.js';
import { studentsView, studentForm, diagnosticResultSection } from '../src/views/students.js';
import { diagnosticForm } from '../src/views/diagnostic.js';
import {
  TASK_ORDER,
  diagnosticOutcome,
  suggestedStart,
  restartLevel,
  isStopped,
  ratedCount,
  answersOf
} from '../src/diagnostic.js';
import { curriculumView } from '../src/views/curriculum.js';
import { teamView } from '../src/views/team.js';
import { homeMenu, homeTop, homeDoa, homeNav } from '../src/views/home.js';
import { guideButton, guideBody } from '../src/views/guide.js';

// The screens are plain functions that return HTML, so they can be checked without a browser or a login.
const count = (html, needle) => html.split(needle).length - 1;

// studentForm and diagnosticForm write through modal(), which needs one DOM node. Faking that node
// is all it takes to bring them under test as well.
let modalHtml = '';
globalThis.document = {
  querySelector: () => ({
    set innerHTML(v) {
      modalHtml = v;
    },
    showModal() {}
  })
};
const openModal = (fn, arg) => {
  modalHtml = '';
  fn(arg);
  return modalHtml;
};

test('ringkasan: siswa aktif, sudah dan belum dites, sebaran level', () => {
  loadSampleState();
  const html = dashboard();
  assert.match(html, /Siswa aktif <i>◉<\/i><\/span><strong>02</);
  assert.match(html, /Sudah dites <i>✓<\/i><\/span><strong>01</);
  assert.match(html, /Belum dites <i>◌<\/i><\/span><strong>01</);
  assert.ok(html.indexOf('Bima Contoh') < html.indexOf('Alya Contoh'), 'anak yang belum dites didahulukan');
  assert.ok(!html.includes('Citra Cuti'), 'anak non-aktif tidak di ringkasan');
  assert.match(html, /1 anak<\/span><h3>Level 3 — Merangkai Awal/);
  assert.equal(count(html, 'class="attention-item"'), 8, 'sebaran 8 level');
  assert.match(html, /data-action="new-student"/);
  for (const lama of ['sumatif', 'sesi kelas', 'Perlu perhatian', 'alarm'])
    assert.ok(!html.includes(lama), lama);
  state.role = 'owner';
  assert.match(dashboard(), /Guru aktif/);
});

test('ruang kelas 8 level: antrean dengan hasil diagnostik, tiga pilihan, English/Karakter, dan siap naik', () => {
  loadSampleState();
  Object.assign(state, {
    k8Themes: [
      {
        number: 1,
        name: 'Aku dan Keluargaku',
        first_meeting: 1,
        last_meeting: 24,
        objects: 'Foto keluarga',
        vocabulary: 'ayah, ibu',
        character: 'salam'
      }
    ],
    k8Subthemes: [{ theme: 1, position: 1, name: 'Diriku', first_meeting: 1, last_meeting: 6 }],
    k8English: [{ theme: 1, kind: 'noun', position: 1, text: 'bag', requestable: true }],
    classSchedules: [
      {
        id: 'j1',
        meeting_number: 1,
        theme_number: 1,
        scheduled_date: '2026-09-21',
        scheduled_time: '08:00:00',
        completed_at: 'x'
      },
      {
        id: 'j2',
        meeting_number: 2,
        theme_number: 1,
        scheduled_date: '2026-09-22',
        scheduled_time: '08:00:00',
        completed_at: null
      }
    ],
    classScheduleStudents: [
      {
        schedule_id: 'j1',
        student_id: 'anak-1',
        level: 3,
        indicator_number: 2,
        result: 'lulus',
        english_result: null,
        character_result: null
      }
    ]
  });
  const alya = state.students[0];
  // Diagnostik: 1 dan 14 Lulus; kelas: 2 Lulus → aktif 3.
  assert.deepEqual(passedIndicators('anak-1', 3), [1, 2, 14]);
  assert.equal(suggestedIndicator(alya), 3);
  const daftar = sessionsView();
  assert.match(daftar, /Pertemuan 2<\/strong><p>Tema 1 — Aku dan Keluargaku · Diriku/);
  const lembar = meetingSheet('j2', { students: ['anak-1', 'anak-2'] });
  assert.match(lembar, /Tema hari ini: Diriku/);
  assert.match(lembar, /Foto keluarga[\s\S]*bag/);
  assert.match(
    lembar,
    /Alya Contoh · Level 3<\/legend><p><span class="badge green">E1<\/span> Indikator 3\./
  );
  assert.match(lembar, /name="r_anak-1" value="belum_dinilai"/);
  assert.match(lembar, /Karakter Level 3 sudah Lulus/);
  assert.match(lembar, /English[\s\S]*Belum bisa dinilai: anak belum hadir 3 pertemuan/);
  assert.ok(!lembar.includes('name="r_anak-2"'), 'anak tanpa tes final tidak dinilai');
  assert.match(lembar, /Tes diagnostik belum final/);
  assert.equal(
    englishReady({ id: 'anak-1', pilot_level: 7 }, state.classSchedules[1]),
    true,
    'L7 ungkapan tetap'
  );
  assert.equal(englishReady(alya, state.classSchedules[1]), false);
  assert.deepEqual(finishState(['anak-1'], {}).done, false);
  assert.deepEqual(finishState(['anak-1'], { 'r_anak-1': 'belum_dinilai' }).done, true);
  // Semua 12 Lulus → siap naik, tanpa pilihan akademik; profil menawarkan naik level.
  state.diagnosticResults.push(
    ...[3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(number => ({
      test_id: 'tes-1',
      number,
      status: 'lulus',
      package: 'utama'
    }))
  );
  assert.equal(suggestedIndicator(alya), null);
  const siap = meetingSheet('j2', { students: ['anak-1'] });
  assert.match(siap, /12 indikator Level 3 Lulus — siap naik/);
  assert.ok(!siap.includes('name="r_anak-1"'));
  assert.equal(finishState(['anak-1'], {}).done, true);
  assert.match(openModal(studentForm, alya), /data-action="level-up" data-id="anak-1">Naik ke Level 4/);
  // Sesi selesai hanya ditampilkan.
  assert.match(
    meetingSheet('j1'),
    /Indikator 2\.[\s\S]*<strong>Lulus<\/strong>[\s\S]*English: Tidak dinilai/
  );
  assert.match(scheduleForm(), /Pertemuan 3<\/strong> · Tema 1 — Aku dan Keluargaku · Diriku/);
});

test('prompt kegiatan: data kelas, kondisi sebelumnya, English/Karakter, dan aturan dari kurikulum 8 level', () => {
  loadSampleState();
  Object.assign(state, {
    name: 'Guru Contoh',
    k8Themes: [
      {
        number: 1,
        name: 'Rumah',
        first_meeting: 1,
        last_meeting: 24,
        description: 'Tema **rumah**.',
        objects: 'sapu',
        vocabulary: 'dapur',
        character: 'salam'
      }
    ],
    k8Subthemes: [{ theme: 1, position: 1, name: 'Ruang di rumah', first_meeting: 1, last_meeting: 6 }],
    k8English: [
      { theme: 1, kind: 'noun', position: 1, text: 'bag', requestable: true },
      { theme: 1, kind: 'phrase', position: 1, text: 'open bag', requestable: false }
    ],
    classSchedules: [
      {
        id: 'j1',
        meeting_number: 1,
        theme_number: 1,
        scheduled_date: '2026-09-21',
        scheduled_time: '08:00:00',
        completed_at: 'x'
      },
      {
        id: 'j2',
        meeting_number: 2,
        theme_number: 1,
        scheduled_date: '2026-09-22',
        scheduled_time: '08:00:00',
        completed_at: 'x'
      },
      {
        id: 'j3',
        meeting_number: 3,
        theme_number: 1,
        scheduled_date: '2026-09-23',
        scheduled_time: '08:00:00',
        completed_at: null
      }
    ],
    classScheduleStudents: [
      { schedule_id: 'j1', student_id: 'anak-1', level: 3, indicator_number: 2, result: 'belum' },
      { schedule_id: 'j2', student_id: 'anak-1', level: 3, indicator_number: 2, result: 'belum' }
    ]
  });
  const p = activityPrompt('j3', ['anak-1', 'anak-2']);
  assert.match(p, /Pertemuan ke-3 · Sesi 1/);
  assert.match(p, /Tema: 1 — Rumah · Subtema: Ruang di rumah\n  Tema rumah\./, 'Markdown dibersihkan');
  assert.match(p, /kata benda bag · frasa open bag/);
  assert.match(p, /Siswa hadir: 1 anak/, 'anak tanpa level tidak ikut');
  assert.match(p, /Siswa 1 · Alya · .* · TK B · Level 3 — Merangkai Awal/);
  assert.match(p, /Sudah lulus \(1 dari 12 akademik\): 1\. Kompetensi A1 L3 <b>/);
  assert.match(p, /melatih 2\. Kompetensi B1 L3 <b> → BELUM \(sudah 2 kali belum lulus\)/);
  assert.match(
    p,
    /Hari ini dilatih: 2\.[\s\S]*Bahan uji di kurikulum: Bahan B1[\s\S]*Tanda lulus \(dari kurikulum\): 4 dari 5 tepat\./
  );
  assert.match(p, /Bahasa Inggris \(boleh dinilai\)/, 'hadir 2 + hari ini = 3 pertemuan');
  assert.match(p, /Karakter: sudah lulus di level ini/);
  assert.match(p, /untuk\s+1 siswa sekitar 40 menit per siswa/);
  assert.match(p, /buku, bola, susu, mata, kaki, sapi, lap, air, roti, pot, apel, pena/);
  assert.match(p, /   - Alya: tugas · tugas mandiri/);
  assert.ok(!p.includes('undefined') && !p.includes('**'));
  state.classScheduleStudents = [];
  assert.match(
    previousCondition(state.students[0], state.classSchedules[2]),
    /belum pernah ikut kelas; hasil tes diagnostik: mulai Level 3 indikator 2/
  );
  assert.match(activityPrompt('j3', ['anak-1']), /Bahasa Inggris: belum boleh dinilai/);
  // Tombol di lembar sesi aktif setelah siswa dicentang.
  assert.match(
    meetingSheet('j3', { students: ['anak-1'] }),
    /data-action="activity-prompt" data-prompt-button >Prompt kegiatan/
  );
  assert.match(meetingSheet('j3', { students: [] }), /data-prompt-button disabled>/);
});

test('daftar siswa guru dan pemilik memakai status tes dan level 8 level', () => {
  loadSampleState();
  const guru = studentsView();
  assert.match(
    guru,
    /Alya Contoh<\/strong><small class="status-tes">Indikator 2 · B1</,
    'guru melihat posisi anak sekarang di antrean'
  );
  assert.match(guru, /Bima Contoh<\/strong><small class="belum-tes">Belum tes diagnostik</);
  assert.ok(guru.includes('<b>Level 3 — Merangkai Awal</b>'));
  assert.ok(guru.includes('<b>Level belum ditentukan</b>'), 'anak belum dites tidak diberi level sementara');
  assert.match(guru, /Siswa non-aktif/);
  assert.match(guru, /data-action="new-student"/);
  assert.match(guru, /data-action="diagnostic-test"/);
  // Draf tes: masih dihitung belum dites.
  state.diagnosticTests.push({
    id: 'tes-2',
    student_id: 'anak-2',
    tested_level: 7,
    started_on: '2026-09-16',
    finalized_at: null
  });
  assert.match(studentsView(), /Bima Contoh<\/strong><small class="belum-tes">Tes Level 7 belum final</);

  state.role = 'owner';
  const pemilik = studentsView();
  assert.match(pemilik, /<th>Level<\/th><th>Tes diagnostik<\/th><th>Guru pendamping<\/th>/);
  assert.match(
    pemilik,
    /Alya Contoh[\s\S]*?Level 3 — Merangkai Awal<\/td><td>Dites Level 3 · mulai Level 3 indikator 2<\/td><td class="teachers">Guru Contoh/
  );
  assert.match(pemilik, /3 siswa · 2 aktif · 1 belum tes diagnostik/);
  assert.match(
    dashboard(),
    /Alya Contoh<\/strong><small class="status-tes">Sudah dites</,
    'pemilik tanpa nomor indikator'
  );
  // Semua 12 Lulus: siap naik; di Level 8: kurikulum selesai.
  state.role = 'teacher';
  state.diagnosticResults = state.diagnosticResults.filter(r => r.number !== 2);
  state.diagnosticResults.push(
    ...[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(number => ({
      test_id: 'tes-1',
      number,
      status: 'lulus',
      package: 'utama'
    }))
  );
  assert.match(studentsView(), /Alya Contoh<\/strong><small class="status-tes">Siap naik ke Level 4</);
});

test('profil siswa: identitas, hasil tes 14 tugas, level saat ini, status, dan hapus', () => {
  loadSampleState();
  const baru = openModal(studentForm);
  for (const n of ['name', 'nickname', 'parent_name', 'phone', 'birth_date', 'school_grade'])
    assert.match(baru, new RegExp('name="' + n + '"'));
  assert.match(baru, />Simpan siswa</);
  assert.ok(
    !baru.includes('Hasil tes diagnostik') && !baru.includes('Hapus siswa'),
    'siswa baru hanya identitas'
  );

  const alya = state.students[0];
  const profil = openModal(studentForm, alya);
  assert.ok(profil.indexOf('Hasil tes diagnostik') < profil.indexOf('Level saat ini'));
  assert.ok(
    profil.includes(
      '<h3>Level saat ini</h3><p><strong>Level 3 — Merangkai Awal</strong></p><p class="muted">Merangkai dua unsur.</p>'
    )
  );
  assert.match(profil, /data-action="toggle-student" data-active="false"/);
  assert.match(profil, /data-action="delete-student"/);
  assert.match(profil, /belum pernah mengikuti kelas/);

  const bagian = diagnosticResultSection(alya);
  assert.match(bagian, /<strong>Dites Level 3 · mulai Level 3 indikator 2<\/strong>/);
  assert.equal(count(bagian, '<li>'), 14, '14 tugas');
  assert.ok(
    bagian.indexOf('>F1<') < bagian.indexOf('>EN<') && bagian.indexOf('>EN<') < bagian.indexOf('>A2<'),
    'English setelah enam akademik'
  );
  assert.match(
    bagian,
    /✗<\/span> <span class="badge">B1<\/span> Kompetensi B1 L3 <strong>&lt;b&gt;<\/strong> <small class="muted">Belum · paket cadangan/
  );
  assert.match(bagian, /EN<\/span>[^·]*<small class="muted">Belum dinilai \(anak baru\)/);
  assert.ok(!/revis/i.test(profil), 'tidak ada revisi tes');
  assert.equal(diagnosticResultSection(state.students[1]), '', 'anak belum dites');

  // Draf: tombol lanjutkan dan jumlah tugas dinilai.
  state.diagnosticTests.push({
    id: 'tes-2',
    student_id: 'anak-2',
    tested_level: 7,
    started_on: '2026-09-16',
    finalized_at: null
  });
  state.diagnosticResults.push({ test_id: 'tes-2', number: 3, status: 'lulus', package: 'utama' });
  const draf = diagnosticResultSection(state.students[1]);
  assert.match(draf, /Level 7, belum final<\/strong> · 1 dari 13 tugas dinilai/);
  assert.match(draf, /data-action="diagnostic-open" data-id="anak-2"/);

  // Pemilik: hanya membaca ringkasan; tanpa status per tugas, status siswa, atau hapus.
  state.role = 'owner';
  const pemilik = openModal(studentForm, alya);
  assert.match(pemilik, /<fieldset disabled>/);
  assert.match(pemilik, /Dites Level 3 · mulai Level 3 indikator 2/);
  assert.ok(!pemilik.includes('Kompetensi B1'));
  for (const x of ['diagnostic-open', 'toggle-student', 'delete-student', 'Simpan profil'])
    assert.ok(!pemilik.includes(x), x);
  assert.ok(!diagnosticResultSection(state.students[1]).includes('diagnostic-open'));
});

test('tim pengajar: pemilik tanpa tombol, guru bisa dinonaktifkan dan diaktifkan', () => {
  loadSampleState();
  const html = teamView();
  assert.match(html, /Pemilik Contoh/);
  // Only the two teachers get a toggle; the owner must not be able to lock themselves out.
  assert.equal(count(html, 'data-action="toggle-member"'), 2);
  assert.equal(count(html, '>Nonaktifkan<'), 1, 'guru aktif bisa dinonaktifkan');
  assert.equal(count(html, '>Aktifkan<'), 1, 'guru nonaktif bisa diaktifkan');
  assert.ok(!html.includes('data-id="pemilik@contoh.test"'), 'pemilik tidak punya tombol');
});

test('tidak ada kebocoran undefined atau [object Object] di layar mana pun', () => {
  loadSampleState();
  for (const [name, html] of [
    ['sessions', sessionsView()],
    ['dashboard', dashboard()],
    ['students', studentsView()],
    ['curriculum', curriculumView()],
    ['team', teamView()],
    ['home', homeMenu() + homeTop('Rumah Belajar Contoh') + homeDoa() + homeNav()]
  ]) {
    assert.ok(!html.includes('undefined'), name + ' memuat undefined');
    assert.ok(!html.includes('[object Object]'), name + ' memuat [object Object]');
    assert.ok(!html.includes('NaN'), name + ' memuat NaN');
  }
});

test('menu utama HP: kartu guru, kartu pemilik, dan tombol yang dikenali main.js', () => {
  loadSampleState();
  const guru = homeMenu();
  // Empat kartu, tidak lebih: Tim pengajar bukan milik guru.
  assert.equal(count(guru, 'class="home-card'), 4);
  for (const view of ['sessions', 'dashboard', 'students', 'curriculum'])
    assert.match(guru, new RegExp('data-view="' + view + '"'), view + ' punya kartunya sendiri');
  assert.ok(!guru.includes('data-view="team"'), 'guru tidak membuka Tim pengajar');
  // Kartu melintang adalah pekerjaan harian guru.
  assert.match(guru, /class="home-card wide" data-view="sessions"/);
  // Aksi memakai atribut yang sudah ditangani main.js, bukan penangan baru.
  const kepala = homeTop('Rumah Belajar Contoh');
  assert.match(kepala, /data-action="logout"/);
  assert.match(homeDoa(), /data-action="password"/);
  // Di HP tidak ada sidebar, jadi logo harus jadi jalan pulang ke menu.
  assert.match(kepala, /class="home-brand" data-view="dashboard"/);
  // Kepala dan doa milik semua tab, jadi tidak boleh ikut tercetak di dalam menu.
  assert.ok(!guru.includes('home-brand'), 'kepala dipasang main.js, bukan homeMenu');
  assert.ok(!guru.includes('home-doa'), 'doa dipasang main.js, bukan homeMenu');

  state.role = 'owner';
  const pemilik = homeMenu();
  assert.equal(count(pemilik, 'class="home-card'), 4);
  assert.match(pemilik, /class="home-card wide" data-view="team"/, 'pemilik mengurus tim');
  assert.ok(!pemilik.includes('data-view="sessions"'), 'pemilik tidak membuka kelas');
});

test('menu utama HP: slogan berganti tiap 30 menit, doa sekali sehari', () => {
  loadSampleState();
  // Potongan setengah jam yang sama selalu memberi slogan yang sama.
  const jam9 = Date.parse('2026-09-13T09:00:00Z');
  assert.equal(sloganOfTheMoment(jam9), sloganOfTheMoment(jam9 + 29 * 60000));
  // Sepanjang sehari harus ada lebih dari satu slogan, kalau tidak perputarannya percuma.
  const sehari = new Set();
  for (let i = 0; i < 48; i++) sehari.add(sloganOfTheMoment(jam9 + i * 1800000));
  assert.ok(sehari.size > 1, 'slogan tidak pernah berganti');
  for (const s of sehari) assert.ok(slogans.includes(s), 'slogan di luar daftar');

  const [arab, arti, sumber] = doaOfTheDay();
  assert.equal(doas.filter(d => d[0] === arab).length, 1, 'doa harus dari daftar');
  assert.ok(arti.length > 10 && sumber.length > 3);
  assert.match(homeDoa(), new RegExp('dir="rtl"'));
});

test('navbar HP: empat tujuan, menandai layar yang sedang dibuka, dan ikut peran', () => {
  loadSampleState();
  state.view = 'sessions';
  const guru = homeNav();
  assert.equal(count(guru, 'class="home-nav-item'), 4);
  for (const view of ['dashboard', 'sessions', 'students', 'curriculum'])
    assert.match(guru, new RegExp('data-view="' + view + '"'), view + ' ada di navbar');
  // Urutan yang diminta pemilik: Ringkasan, Siswa, Ruang kelas, Kurikulum.
  assert.deepEqual(
    [...guru.matchAll(/data-view="(\w+)"/g)].map(m => m[1]),
    ['dashboard', 'students', 'sessions', 'curriculum']
  );
  assert.match(guru, />Ringkasan<\/span>/, 'tujuan pertama bernama Ringkasan, bukan Menu');
  // Layar yang sedang dibuka ditandai, sekali saja.
  assert.equal(count(guru, 'aria-current="page"'), 1);
  assert.match(guru, /class="home-nav-item aktif" data-view="sessions"/);

  state.role = 'owner';
  state.view = 'team';
  const pemilik = homeNav();
  assert.match(pemilik, /data-view="team"/, 'pemilik mengurus tim');
  assert.ok(!pemilik.includes('data-view="sessions"'), 'pemilik tidak membuka kelas');
  assert.equal(count(pemilik, 'aria-current="page"'), 1);
});

test('tes diagnostik: pilih anak dan satu level 1–8, dengan saran dari kelas formal', () => {
  loadSampleState();
  const tes = openModal(diagnosticForm);
  assert.match(tes, /data-form="diagnostic-start"/);
  assert.match(tes, /value="anak-2"/);
  assert.ok(!tes.includes('value="anak-1"'), 'anak yang sudah dites final tidak ditawarkan lagi');
  assert.ok(!tes.includes('value="anak-3"'), 'anak non-aktif tidak dites');
  assert.match(
    tes,
    /<option value="7" selected>Level 7 — Mengolah Informasi \(saran\)/,
    'Bima SD 2 → saran Level 7'
  );
  for (let l = 1; l <= 8; l++) assert.match(tes, new RegExp('<option value="' + l + '"'));
  assert.ok(
    tes.indexOf('name="start"') < tes.indexOf('data-level-desc'),
    'deskriptor di bawah pilihan level'
  );
  assert.match(tes, /A1, B1, E1, dan D1 semuanya Belum/);
  assert.match(tes, />Mulai tes →</);

  // Anak dengan draf langsung dilanjutkan, tanpa pilihan level.
  state.diagnosticTests.push({
    id: 'tes-2',
    student_id: 'anak-2',
    tested_level: 7,
    started_on: '2026-09-16',
    finalized_at: null
  });
  const lanjut = openModal(diagnosticForm);
  assert.match(lanjut, /Bima Contoh \(tes Level 7 berjalan\)/);
  assert.match(lanjut, /data-action="diagnostic-open" data-id="anak-2"/);
  assert.ok(!lanjut.includes('name="start"'));

  state.students = state.students.filter(s => s.id !== 'anak-2');
  assert.match(openModal(diagnosticForm), /Semua anak sudah dites/);
  state.students = [];
  assert.match(openModal(diagnosticForm), /Belum ada siswa aktif/);
});

test('tes diagnostik: lembar 14 tugas, English tidak dinilai, ringkasan dampak, dan tes berhenti', () => {
  loadSampleState();
  state.diagnosticTests.push({
    id: 'tes-2',
    student_id: 'anak-2',
    tested_level: 3,
    started_on: '2026-09-16',
    finalized_at: null
  });
  state.diagnosticResults.push(
    { test_id: 'tes-2', number: 1, status: 'lulus', package: 'utama' },
    { test_id: 'tes-2', number: 2, status: 'belum', package: 'cadangan' }
  );
  state.diagnostic = 'anak-2';
  const lembar = openModal(diagnosticForm);
  assert.match(lembar, /data-form="diagnostic" data-id="anak-2"/);
  assert.match(lembar, /Menguji Level 3 — Merangkai Awal/);
  assert.equal(count(lembar, 'class="diagnostic-task"'), 14);
  assert.ok(
    lembar.indexOf('>F1<') < lembar.indexOf('>EN<') && lembar.indexOf('>EN<') < lembar.indexOf('>A2<')
  );
  assert.ok(lembar.indexOf('>F2<') < lembar.indexOf('>KR<'));
  assert.ok(!lembar.includes('name="s13"'), 'English tanpa pilihan nilai');
  assert.match(lembar, /English anak baru tidak diuji/);
  assert.match(lembar, /name="s1" value="lulus" checked/);
  assert.match(lembar, /name="s2" value="belum" checked/);
  assert.match(lembar, /name="p2" value="cadangan" checked/);
  assert.match(lembar, /name="s3" value="" checked/, 'belum dinilai sebagai pilihan ketiga');
  assert.match(lembar, /<strong>4 dari 5<\/strong> tepat/, 'tanda lulus dari Markdown');
  assert.ok(lembar.includes('&lt;b&gt;') && !lembar.includes('<b>'), 'isi di-escape');
  assert.match(lembar, /Bahan cadangan[\s\S]*Deret cadangan <strong>k d s<\/strong>/);
  assert.match(
    lembar,
    /1 dari 12 indikator akademik Lulus\. Mulai kelas di <strong>Level 3 — Merangkai Awal<\/strong>, indikator 2\./
  );
  assert.match(lembar, /Dinilai 2 dari 13 tugas/);
  assert.match(lembar, />Simpan final</);

  for (const n of [3, 4])
    state.diagnosticResults.push({ test_id: 'tes-2', number: n, status: 'belum', package: 'utama' });
  state.diagnosticResults[
    state.diagnosticResults.findIndex(r => r.test_id === 'tes-2' && r.number === 1)
  ].status = 'belum';
  const henti = openModal(diagnosticForm);
  assert.match(henti, /TES BERHENTI/);
  assert.match(henti, /data-action="diagnostic-restart" data-id="anak-2" data-level="1"/);
  assert.ok(!henti.includes('Simpan final'));
});

test('aturan tes diagnostik 8 level sesuai dokumen terkunci', () => {
  assert.deepEqual(TASK_ORDER, [1, 2, 3, 4, 5, 6, 13, 7, 8, 9, 10, 11, 12, 14]);
  assert.deepEqual(
    ['Belum sekolah', 'TK A', 'TK B', 'SD 1', 'SD 2', 'SD 6', ''].map(suggestedStart),
    [1, 1, 3, 5, 7, 7, 1]
  );
  assert.deepEqual([1, 2, 3, 4, 5, 6, 7, 8].map(restartLevel), [1, 1, 1, 1, 3, 3, 5, 5]);
  const semua = (status, extra = {}) => ({
    ...Object.fromEntries([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => [n, { status }])),
    ...extra
  });
  const empatBelum = {
    1: { status: 'belum' },
    2: { status: 'belum' },
    3: { status: 'belum' },
    4: { status: 'belum' }
  };
  assert.equal(isStopped(3, empatBelum), true);
  assert.equal(isStopped(1, empatBelum), false, 'Level 1 tidak berhenti');
  assert.equal(isStopped(3, { ...empatBelum, 4: undefined }), false);
  assert.deepEqual(diagnosticOutcome(4, { 1: { status: 'lulus' }, 3: { status: 'lulus' } }), {
    passed: [1, 3],
    startLevel: 4,
    startIndicator: 2,
    complete: false,
    character: ''
  });
  assert.deepEqual(diagnosticOutcome(7, semua('lulus')), {
    passed: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    startLevel: 8,
    startIndicator: 1,
    complete: false,
    character: ''
  });
  assert.deepEqual(diagnosticOutcome(8, semua('lulus', { 14: { status: 'belum' } })), {
    passed: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    startLevel: 8,
    startIndicator: null,
    complete: true,
    character: 'belum'
  });
  assert.equal(
    diagnosticOutcome(2, { ...semua('lulus'), 12: {} }).startIndicator,
    12,
    'belum dinilai dihitung belum lulus'
  );
  assert.equal(ratedCount({ 1: { status: 'lulus' }, 14: { status: 'belum' }, 5: {} }), 2);
  assert.deepEqual(
    answersOf(
      [
        { test_id: 'a', number: 2, status: 'belum', package: 'cadangan' },
        { test_id: 'b', number: 1, status: 'lulus' }
      ],
      'a'
    ),
    { 2: { status: 'belum', package: 'cadangan' } }
  );
  assert.equal(
    testStatus({ finalized_at: 'x', tested_level: 8, curriculum_complete: true }),
    'Dites Level 8 · kurikulum selesai'
  );
  assert.equal(testStatus(undefined), '');
  loadSampleState();
  assert.equal(levelName(null), 'Level belum ditentukan');
  assert.equal(levelName(7), 'Level 7 — Mengolah Informasi');
});

test('usia dihitung dari tanggal lahir dan tahun ajaran berganti Juli', () => {
  const hari = new Date(2026, 8, 13); // 13 September 2026
  assert.equal(ageText('2020-05-10', hari), '6 tahun 4 bulan');
  assert.equal(ageText('2020-09-14', hari), '5 tahun 11 bulan', 'belum ulang tahun bulan ini');
  assert.equal(ageText('2026-03-13', hari), '6 bulan');
  assert.equal(ageText('', hari), '');
  assert.equal(ageText('2027-01-01', hari), '', 'tanggal di masa depan tidak menghasilkan usia');
  assert.equal(schoolYearOf(new Date('2026-07-01T00:00:00+07:00')), '2026/2027');
  assert.equal(schoolYearOf(new Date('2026-06-30T12:00:00+07:00')), '2025/2026');
});

test('kurikulum 8 level: CP, level berurutan dengan 14 indikator, catatan alur, dan tema dari data k8', async () => {
  loadSampleState();
  const { buildCurriculum } = await import('../scripts/build-curriculum.mjs');
  const { data } = buildCurriculum();
  Object.assign(state, {
    k8Cp: data.cp,
    k8Levels: data.levels,
    k8Indicators: data.indicators,
    k8Notes: data.notes,
    k8Themes: data.themes,
    k8Subthemes: data.subthemes,
    k8English: data.english
  });
  const kur = curriculumView();
  assert.match(kur, /KURIKULUM 8 LEVEL/);
  assert.ok(!kur.includes('KURIKULUM PILOT'), 'kurikulum lama tidak tampil bila data 8 level ada');
  assert.equal(count(kur, 'class="panel k8-level"'), 8);
  assert.equal(count(kur, 'class="k8-indicator"'), 112);
  assert.ok(kur.indexOf('Mulai Mengenali') < kur.indexOf('Mandiri Awal'), 'level urut');
  assert.equal(count(kur, 'class="theme-detail"'), 8);
  assert.match(kur, /English — kata benda/);
  assert.equal(count(kur, 'k8-word requestable'), 39, '39 dari 40 kata benda wajar diminta');
  assert.match(kur, /Ketentuan dan bahan cadangan per alur/);
  assert.match(kur, /<div class="md-table"><table>/, 'tabel Markdown catatan alur ditampilkan sebagai tabel');
  assert.ok(!/\*\*[^*]+\*\*/.test(kur), 'tidak ada tanda tebal Markdown mentah');
  // Isi di-escape: teks berbahaya di dokumen tidak menjadi HTML.
  state.k8Indicators = [{ ...data.indicators[0], competency: '<script>x</script> **tebal**' }];
  const aman = curriculumView();
  assert.ok(aman.includes('&lt;script&gt;') && !aman.includes('<script>'));
  assert.match(aman, /<strong>tebal<\/strong>/);
});

test('panduan per tab: satu panduan untuk tab yang dibuka, dan tombol yang disebut benar-benar ada', () => {
  loadSampleState();
  const tombol = html => [...html.matchAll(/<b class="guide-btn">([^<]+)<\/b>/g)].map(m => m[1].replace(/ …$/, ''));
  const tabs = { teacher: ['dashboard', 'students', 'sessions', 'curriculum'], owner: ['dashboard', 'students', 'team', 'curriculum'] };
  const sources = [
    'src/views/students.js', 'src/views/diagnostic.js', 'src/views/sessions.js',
    'src/views/dashboard.js', 'src/views/team.js', 'src/main.js'
  ].map(p => fs.readFileSync(p, 'utf8')).join('\n');
  for (const [role, views] of Object.entries(tabs)) {
    state.role = role;
    const bodies = new Set();
    for (const view of views) {
      state.view = view;
      assert.match(guideButton(), /data-action="guide"/, `${role} ${view} punya tombol panduan`);
      const body = guideBody();
      assert.ok(body.length > 200, `${role} ${view} punya isi`);
      bodies.add(body);
      for (const t of tombol(body)) assert.ok(sources.includes(t), `${role} ${view}: tombol "${t}" ada di layar`);
    }
    assert.equal(bodies.size, views.length, 'isi panduan berbeda per tab');
  }
  state.role = 'owner';
  state.view = 'sessions';
  assert.equal(guideButton(), '', 'pemilik tidak punya panduan Ruang kelas');
});
