import test from 'node:test';
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
import { sessionsView, scheduleForm, kidsSummary, scheduleValues, meetingSheet, meetingRows, finishState } from '../src/views/sessions.js';
import { passedIndicators, suggestedIndicator, readyToLevelUp } from '../src/state.js';
import { passedSection } from '../src/views/students.js';
import { dashboard } from '../src/views/dashboard.js';
import { studentsView, studentForm, diagnosticResultSection } from '../src/views/students.js';
import { diagnosticForm } from '../src/views/diagnostic.js';
import {
  taskOrder,
  diagnosticOutcome,
  diagnosticPayload,
  focusIndicators,
  draftProgress,
  suggestedStart
} from '../src/diagnostic.js';
import { curriculumView } from '../src/views/curriculum.js';
import { teamView } from '../src/views/team.js';
import { homeMenu, homeTop, homeDoa, homeNav } from '../src/views/home.js';

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
  assert.match(html, /1 anak<\/span><h3>Level 2 — Aku Mulai Mengenal/);
  assert.match(html, /data-action="new-student"/);
  for (const lama of ['sumatif', 'sesi kelas', 'Perlu perhatian', 'alarm'])
    assert.ok(!html.includes(lama), lama);
  state.role = 'owner';
  assert.match(dashboard(), /Guru aktif/);
});

test('ruang kelas: pertemuan per hari dengan sesi; guru hanya mengisi tanggal/jam, siswa hadir, dan Lulus/Belum', () => {
  loadSampleState();
  state.role = 'teacher';
  const html = sessionsView();
  assert.match(html, /data-action="new-schedule"/);
  assert.match(html, /Belum ada jadwal/);
  assert.ok(!/data-action="new-session"|evaluasi|kehadiran/i.test(html));
  const f = scheduleForm();
  assert.ok(!/<select|name="students"|name="theme"|name="meeting"/.test(f), 'tanpa pilihan pertemuan, tema, siswa');
  assert.match(f, /name="date" type="date"/);
  assert.match(f, /name="time"/);
  assert.match(f, /<strong>Pertemuan 1<\/strong> · Tema 1 — Aku Bisa Bercerita/);

  // Hari 25 selesai (satu sesi); hari 26 punya dua sesi, satu terbuka.
  state.classSchedules = [
    { id: 'j0', meeting_number: 25, theme_number: 2, scheduled_date: '2026-09-10', scheduled_time: null, completed_at: '2026-09-10T09:00:00Z' },
    { id: 's2', meeting_number: 26, theme_number: 2, scheduled_date: '2026-09-20', scheduled_time: '10:00:00', completed_at: null },
    { id: 's1', meeting_number: 26, theme_number: 2, scheduled_date: '2026-09-20', scheduled_time: '08:00:00', completed_at: '2026-09-20T02:00:00Z' }
  ];
  state.classScheduleStudents = [
    { schedule_id: 's1', student_id: 'anak-1', level: 2, indicator_number: 1, result: 'lulus' }
  ];
  let daftar = sessionsView();
  assert.ok(!daftar.includes('data-action="new-schedule"'), 'ada sesi terbuka: tanpa Buat jadwal');
  assert.match(daftar, /semua sesi ditandai selesai/);
  assert.ok(daftar.indexOf('Pertemuan terakhir') < daftar.indexOf('Pertemuan 26') && daftar.indexOf('Sebelumnya') < daftar.indexOf('Pertemuan 25'));
  assert.match(daftar, /Pertemuan 26<\/strong><p>Tema 2 — Aku Bisa Menghitung/);
  assert.ok(daftar.indexOf('Sesi 1</strong> · 08:00') < daftar.indexOf('Sesi 2</strong> · 10:00'), 'sesi urut menurut jam');
  assert.match(daftar, /Sesi 1<\/strong> · 08:00 · 1 siswa · selesai/);
  assert.match(daftar, /Sesi 2<\/strong> · 10:00 · belum dimulai/);
  assert.match(daftar, /data-action="add-session" data-id="s2"|data-action="add-session" data-id="s1"/);
  assert.match(daftar, /data-action="open-schedule" data-id="s2">Buka/);
  assert.match(daftar, /data-action="delete-schedule" data-id="s2"/);
  assert.match(daftar, /data-action="open-schedule" data-id="j0">Lihat/);
  assert.ok(!/data-action="(edit|delete)-schedule" data-id="(j0|s1)"/.test(daftar), 'sesi selesai dikunci');
  assert.equal(count(daftar, 'data-action="add-session"'), 1, 'tambah sesi hanya di pertemuan terakhir');
  // Tambah sesi: tanggal tetap; ubah sesi di hari bersesi banyak: tanggal tidak bisa diganti.
  const tambah = scheduleForm({ ...scheduleValues('s1'), time: '', fixedDate: true });
  assert.match(tambah, /<strong>Pertemuan 26<\/strong>/);
  assert.match(tambah, /type="hidden" name="date" value="2026-09-20"/);
  assert.match(tambah, />Tambah sesi</);
  const ubah = scheduleForm(scheduleValues('s2'), 's2');
  assert.match(ubah, /data-form="schedule" data-id="s2"/);
  assert.match(ubah, /type="hidden" name="date"/, 'hari punya dua sesi: tanggal terkunci');
  assert.match(ubah, /name="time" type="time" value="10:00"/);
  assert.match(scheduleForm(scheduleValues('j0'), 'j0'), /name="date" type="date"/, 'sesi tunggal: tanggal bisa diubah');

  // Lembar sesi 2: anak yang sudah ikut sesi 1 hari ini tidak bisa dipilih.
  let lembar = meetingSheet('s2');
  assert.match(lembar, /data-form="meeting" data-id="s2"/);
  assert.match(lembar, /Pertemuan 26 · Sesi 2 · 10:00 · Tema 2/);
  assert.match(lembar, /value="anak-1"[^>]*disabled><span>Alya Contoh <small class="muted">Level 2 · sudah di Sesi 1 hari ini/);
  assert.match(lembar, /value="anak-2"[^>]*disabled/, 'belum dites tidak bisa dipilih');
  assert.ok(!lembar.includes('value="anak-3"'), 'anak nonaktif tidak tampil');
  assert.match(lembar, /name="finish" value="0">Simpan sementara</);
  assert.match(lembar, /name="finish" value="1" data-finish disabled>Tandai sesi selesai</, 'tanpa siswa: nonaktif');
  assert.match(lembar, /Centang siswa yang hadir lebih dulu/);
  assert.deepEqual(finishState(['a', 'b'], { r_a: 'lulus' }), { done: false, hint: 'Beri Lulus/Belum untuk 1 siswa lagi.' });
  assert.equal(finishState(['a', 'b'], { r_a: 'lulus', r_b: 'belum' }).done, true);
  assert.equal(finishState([], {}).done, false);
  assert.ok(!/absen|Tidak hadir|<select/.test(lembar), 'tanpa Tidak hadir dan tanpa dropdown');
  const lihat = meetingSheet('s1');
  assert.ok(!lihat.includes('<form'), 'sesi selesai hanya dilihat');
  assert.match(lihat, /<strong>Lulus<\/strong>/);

  // Baris siswa: indikator otomatis dari pertemuan selesai; antrean 1–6; siap naik.
  const alya = state.students[0];
  const baris = meetingRows(new Set(['anak-1', 'anak-2']), { 'r_anak-1': 'belum' });
  assert.match(baris, /Alya Contoh · Level 2<\/legend><p class="muted">Indikator 2\. /, 'lulus indikator 1 → 2');
  assert.match(baris, /name="r_anak-1" value="belum" checked/);
  assert.ok(!baris.includes('r_anak-2'), 'anak belum dites tidak dinilai');
  assert.match(kidsSummary(['anak-1']), /^1 siswa: /);
  assert.deepEqual(passedIndicators('anak-1', 2), [1]);
  state.classScheduleStudents.push({ schedule_id: 's2', student_id: 'anak-1', level: 2, indicator_number: 2, result: 'lulus' });
  assert.equal(suggestedIndicator(alya), 2, 'sesi yang belum selesai tidak dihitung');
  for (const n of [2, 3, 4, 5, 6])
    state.classScheduleStudents.push({ schedule_id: 'j0', student_id: 'anak-1', level: 2, indicator_number: n, result: 'lulus' });
  assert.equal(suggestedIndicator(alya), 6, 'semua 1–6 lulus → tetap 6');
  assert.ok(readyToLevelUp(alya));
  assert.match(meetingRows(new Set(['anak-1'])), /siap naik/);
  assert.match(passedSection(alya), /Indikator yang sudah lulus[\s\S]*✓<\/span> 1\. Menyebutkan nama huruf vokal/);

  // Semua sesi selesai: Buat jadwal muncul lagi untuk hari berikutnya.
  state.classSchedules.find(c => c.id === 's2').completed_at = '2026-09-20T04:00:00Z';
  daftar = sessionsView();
  assert.match(daftar, /data-action="new-schedule"/);
  assert.match(scheduleForm(), /<strong>Pertemuan 27<\/strong>/);
  state.role = 'owner';
  assert.ok(!/new-schedule|add-session/.test(sessionsView()), 'pemilik tidak membuat jadwal');
});

test('daftar siswa guru dan pemilik memakai status tes dan level pilot', () => {
  loadSampleState();
  const guru = studentsView();
  assert.match(guru, /Alya Contoh<\/strong><small class="status-tes">Belum lulus Level 2</);
  assert.match(guru, /Bima Contoh<\/strong><small class="belum-tes">Belum tes diagnostik</);
  assert.ok(guru.includes('<b>Level 2 — Aku Mulai Mengenal</b>'));
  assert.ok(guru.includes('<b>Level belum ditentukan</b>'), 'anak belum dites tidak diberi level sementara');
  assert.match(guru, /Siswa non-aktif/);
  assert.match(guru, /data-action="new-student"/);
  assert.match(guru, /data-action="diagnostic-test"/);
  assert.ok(
    !/Bahasa Indonesia|Matematika|IPAS|jadwal/i.test(guru),
    'tidak ada tampilan per bidang atau jadwal'
  );

  state.role = 'owner';
  const pemilik = studentsView();
  assert.match(pemilik, /<th>Level<\/th><th>Tes diagnostik<\/th><th>Guru pendamping<\/th>/);
  assert.match(
    pemilik,
    /Alya Contoh[\s\S]*?Level 2 — Aku Mulai Mengenal<\/td><td>Belum lulus Level 2<\/td><td class="teachers">Guru Contoh/
  );
  assert.match(pemilik, /3 siswa · 2 aktif · 1 belum tes diagnostik/);
  assert.ok(!/Siap sumatif|B\. Indonesia/.test(pemilik));
});

test('profil siswa: identitas, hasil tes, level saat ini, status, dan hapus', () => {
  loadSampleState();
  const baru = openModal(studentForm);
  for (const n of ['name', 'nickname', 'parent_name', 'phone', 'birth_date', 'school_grade'])
    assert.match(baru, new RegExp('name="' + n + '"'));
  assert.match(baru, /name="birth_date"[^>]*required/);
  assert.match(baru, /name="school_grade"[^>]*required/);
  assert.match(baru, />Simpan siswa</);
  assert.ok(
    !baru.includes('Hasil tes diagnostik') && !baru.includes('Hapus siswa'),
    'siswa baru hanya identitas'
  );

  const alya = state.students[0];
  const profil = openModal(studentForm, alya);
  for (const lama of [
    'name="diagnostic"',
    'learning_notes',
    'reading_baseline',
    'Arti level',
    'Perjalanan kompetensi',
    'Ujian sumatif',
    'Riwayat evaluasi'
  ])
    assert.ok(!profil.includes(lama), lama + ' sudah dihapus');
  assert.ok(profil.indexOf('Hasil tes diagnostik') < profil.indexOf('Level saat ini'));
  assert.ok(
    profil.includes(
      '<h3>Level saat ini</h3><p><strong>Level 2 — Aku Mulai Mengenal</strong></p><p class="muted">Huruf dan angka bermakna.</p>'
    )
  );
  assert.match(profil, /data-action="toggle-student" data-active="false"/);
  assert.match(profil, /data-action="delete-student"/);

  // Hasil tes: urut per indikator, kalimat dari salinan saat dites, catatan di-escape, tanpa revisi (hasil final).
  const bagian = diagnosticResultSection(alya);
  assert.match(bagian, /<strong>Belum lulus Level 2<\/strong> → mulai belajar <strong>Level 2<\/strong>/);
  assert.ok(bagian.indexOf('1. Vokal saat dites') < bagian.indexOf('2. Mencocokkan huruf'));
  assert.match(bagian, /✗<\/span> 2\. Mencocokkan huruf/);
  assert.ok(bagian.includes('Masih &lt;mengeja&gt;'));
  assert.ok(!/revis/i.test(profil), 'tidak ada revisi tes');
  assert.equal(diagnosticResultSection(state.students[1]), '', 'anak belum dites');

  const bima = openModal(studentForm, state.students[1]);
  assert.match(bima, /Level belum ditentukan[\s\S]*Level ditentukan oleh Tes Diagnostik/);
  assert.match(
    openModal(studentForm, state.students[2]),
    /data-active="true"/,
    'anak non-aktif bisa diaktifkan'
  );

  // Pemilik: hanya membaca; tanpa nilai per indikator, revisi, status, atau hapus.
  state.role = 'owner';
  state.diagnosticResults = [];
  const pemilik = openModal(studentForm, alya);
  assert.match(pemilik, /<fieldset disabled>/);
  assert.match(pemilik, /Belum lulus Level 2/);
  for (const x of ['diagnostic-revise', 'toggle-student', 'delete-student', 'Simpan profil'])
    assert.ok(!pemilik.includes(x), x);
});

test('kurikulum pilot menampilkan CP, level berurutan dengan indikatornya, dan tema', () => {
  loadSampleState();
  const kur = curriculumView();
  assert.match(kur, /CP FASE FONDASI/);
  assert.equal(count(kur, 'class="panel curriculum-card"'), 2, 'dua level pada contoh');
  assert.ok(kur.indexOf('Mengikuti sesi') < kur.indexOf('Merespons ketika'), 'indikator urut menurut nomor');
  assert.ok(kur.indexOf('Aku Siap Belajar') < kur.indexOf('Mengikuti sesi'), 'indikator di dalam levelnya');
  assert.ok(kur.indexOf('Mengikuti sesi') < kur.indexOf('Aku Mulai Mengenal'));
  assert.match(kur, /Kesiapan belajar/);
  assert.ok(kur.includes('&lt;A&gt;') && !kur.includes('<A>'), 'teks indikator di-escape');
  assert.ok(kur.indexOf('Aku Bisa Bercerita') < kur.indexOf('Aku Bisa Menghitung'), 'tema urut');
  assert.match(kur, /Pertemuan 1–24/);
  // Deskriptor tema: gambaran di-escape, indikator fokus diterjemahkan ke teks kurikulum.
  assert.equal(count(kur, 'class="theme-detail"'), 2);
  assert.ok(kur.includes('diri &amp; keluarga'), 'gambaran tema di-escape');
  assert.match(kur, /L1-2<\/span> Merespons ketika namanya dipanggil/);
  assert.match(kur, /L9-9<\/span> indikator tidak ditemukan/);
  assert.match(kur, /Karakter yang ditonjolkan<\/dt><dd>berani menjawab/);
  assert.ok(kur.includes('I don&#39;t know') || kur.includes("I don't know"));
  // Tema tanpa deskriptor tetap tampil, tanpa baris kosong.
  assert.ok(!/<dt>English theme words<\/dt><dd><\/dd>/.test(kur));
  assert.ok(!kur.includes('data-action="edit-curriculum"'), 'editor kurikulum lama sudah tidak ada');
  state.curriculumPhases = [];
  assert.match(curriculumView(), /sedang disiapkan/);
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

test('tes diagnostik: pilih anak dan satu level, dengan saran dari kelas formal', () => {
  loadSampleState();
  const tes = openModal(diagnosticForm);
  assert.match(tes, /data-form="diagnostic-start"/);
  assert.match(tes, /value="anak-2"/);
  assert.ok(!tes.includes('value="anak-1"'), 'anak yang sudah dites tidak ditawarkan lagi');
  assert.ok(!tes.includes('value="anak-3"'), 'anak non-aktif tidak dites');
  assert.match(tes, /<option value="4" selected>Level 4[^<]*\(saran\)/, 'Bima SD 2 → saran Level 4');
  for (const l of [1, 2, 3, 4]) assert.match(tes, new RegExp('<option value="' + l + '"'));
  assert.ok(
    tes.indexOf('name="start"') < tes.indexOf('data-level-desc'),
    'deskriptor di bawah pilihan level'
  );
  assert.ok(tes.indexOf('data-level-desc') < tes.indexOf('diagnostic-rules'), 'deskriptor di atas Cara tes');
  assert.match(tes, /Lulus Level X → mulai belajar Level X\+1/);

  state.diagnosticDrafts = {
    'anak-2': { student: 'anak-2', level: 3, answers: { 1: 'T', 2: 'B' }, reviewed: false },
    'anak-1': { student: 'anak-1', level: 1, answers: {} }
  };
  const mulai = openModal(diagnosticForm);
  assert.match(mulai, /Tes belum selesai/);
  assert.match(mulai, /Level 3 · 2 dari 8 dinilai/);
  assert.match(mulai, /data-action="diagnostic-resume" data-id="anak-2"/);
  assert.ok(!mulai.includes('data-id="anak-1"'), 'anak yang sudah dites tidak ditawarkan');

  state.students = state.students.filter(s => s.id !== 'anak-2');
  assert.match(openModal(diagnosticForm), /Semua anak sudah dites/);
  state.students = [];
  assert.match(openModal(diagnosticForm), /Belum ada siswa aktif/);
});

test('tes diagnostik: delapan kartu satu level, lalu hasil lulus atau belum lulus', () => {
  loadSampleState();
  state.diagnostic = { student: 'anak-2', level: 1, answers: { 2: 'B' }, reviewed: false, note: '' };
  const langkah = openModal(diagnosticForm);
  assert.match(langkah, /Menguji Level 1 — Aku Siap Belajar/);
  assert.equal(count(langkah, 'class="diagnostic-task"'), 8);
  assert.match(langkah, /Bertahan sampai tugas terakhir/, 'ukuran dibaca dari indikator kurikulum');
  assert.ok(langkah.includes('&lt;di luar pandangan&gt;'), 'tugas dari database di-escape');
  assert.match(langkah, /name="i2" value="B" checked/);
  assert.match(langkah, /name="i6" value="T"\s+required/);
  assert.ok(!/name="i7" value="T"[^>]*required/.test(langkah), 'English tidak wajib');
  const bawah = langkah.indexOf('Diamati sepanjang tes — nilai di akhir');
  assert.ok(
    bawah > langkah.indexOf('name="i7"') && langkah.indexOf('name="i1"') > bawah,
    'pengamatan di bawah'
  );
  assert.match(langkah, /◐ memenuhi setelah dibantu, atau kurang satu dari ukuran/);
  assert.match(langkah, />Lihat hasil →</);

  const lulus = { 1: 'T', 2: 'T', 3: 'T', 4: 'T', 5: 'T', 6: 'T', 7: 'B', 8: 'T' };
  state.diagnostic = { student: 'anak-2', level: 1, answers: lulus, reviewed: true, note: '' };
  const hasil = openModal(diagnosticForm);
  assert.match(hasil, /LULUS LEVEL 1/);
  assert.match(hasil, /Mulai belajar Level 2 — Aku Mulai Mengenal/);
  assert.match(hasil, /Nilai 1–6: 1 ✓ · 2 ✓ · 3 ✓ · 4 ✓ · 5 ✓ · 6 ✓ · English ◐ · Karakter ✓/);
  assert.ok(!hasil.includes('Perlu dilatih lebih dulu'));
  assert.ok(!/learning_notes|gaya belajar|sesi kelas/.test(hasil));
  assert.match(hasil, /name="note"/);
  assert.match(hasil, />Simpan hasil tes</);

  state.diagnostic.answers = { ...lulus, 2: 'B' };
  const belum = openModal(diagnosticForm);
  assert.match(belum, /BELUM LULUS LEVEL 1/);
  assert.match(belum, /Mulai belajar Level 1 — Aku Siap Belajar/);
  assert.match(belum, /<li>2\. Merespons ketika namanya dipanggil<\/li>/);
  assert.match(belum, /Hasil tes final dan tidak bisa diubah/);
  assert.ok(!/revis/i.test(belum + langkah), 'tanpa revisi');
});

test('aturan hasil tes diagnostik satu level sesuai keputusan pemilik', () => {
  const T6 = { 1: 'T', 2: 'T', 3: 'T', 4: 'T', 5: 'T', 6: 'T' };
  assert.deepEqual(diagnosticOutcome(2, T6), {
    complete: true,
    passed: true,
    final: 3,
    beyond: false,
    status: 'Lulus Level 2'
  });
  assert.deepEqual(diagnosticOutcome(2, { ...T6, 4: 'B' }), {
    complete: true,
    passed: false,
    final: 2,
    beyond: false,
    status: 'Belum lulus Level 2'
  });
  assert.deepEqual(diagnosticOutcome(4, T6), {
    complete: true,
    passed: true,
    final: 4,
    beyond: true,
    status: 'Lulus Level 4'
  });
  assert.equal(
    diagnosticOutcome(2, { ...T6, 7: 'N', 8: 'N' }).passed,
    true,
    'English dan Karakter tidak menentukan'
  );
  assert.equal(diagnosticOutcome(3, { 1: 'T' }).complete, false);
  assert.deepEqual(focusIndicators({ ...T6, 3: 'N', 5: 'B', 7: 'N' }), [3, 5]);
  assert.deepEqual(diagnosticPayload(3, { 2: 'N', 7: 'B' }), [
    { level: 3, number: 2, rating: 'N' },
    { level: 3, number: 7, rating: 'B' }
  ]);
  assert.equal(draftProgress({ answers: { 1: 'T', 8: 'B' } }), 2);
  assert.deepEqual(['Belum sekolah', 'TK A', 'TK B', 'SD 1'].map(suggestedStart), [1, 2, 3, 4]);
  assert.equal(testStatus({ passed: true, tested_level: 3 }), 'Lulus Level 3');
  assert.equal(testStatus(undefined), '');
  loadSampleState();
  assert.equal(levelName(null), 'Level belum ditentukan');
  assert.deepEqual(taskOrder(state.curriculumIndicators, 1), {
    active: [2, 3, 4, 5, 6, 7],
    observed: [1, 8]
  });
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
