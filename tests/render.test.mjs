import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSampleState, SESSION } from './fixtures/sample-state.mjs';
import { state } from '../src/state.js';
import { sessionsView, newSession as newSessionForm } from '../src/views/sessions.js';
import { dashboard } from '../src/views/dashboard.js';
import { studentsView, scheduleForm, studentForm, diagnosticResultSection } from '../src/views/students.js';
import { diagnosticForm } from '../src/views/diagnostic.js';
import {
  taskOrder,
  diagnosticOutcome,
  diagnosticPayload,
  focusIndicators,
  runFromSaved,
  draftProgress,
  diagnosticSummary,
  suggestedStart
} from '../src/diagnostic.js';
import { curriculumView } from '../src/views/curriculum.js';
import { teamView } from '../src/views/team.js';
import { homeMenu, homeTop, homeDoa, homeNav } from '../src/views/home.js';
import {
  slogans,
  doas,
  sloganOfTheMoment,
  doaOfTheDay,
  ageText,
  schoolYearOf,
  gradePhase
} from '../src/state.js';

// The screens are plain functions that return HTML, so they can be checked without a browser, a
// login, or the preview. These cover the evaluation card in particular, which no browser test can
// reach because the preview has no class sessions.

const count = (html, needle) => html.split(needle).length - 1;

// studentForm and scheduleForm write through modal(), which needs one DOM node. Faking that node
// is all it takes to bring those two under test as well.
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

test('kartu evaluasi menampilkan indikator, centang tersimpan, dan riwayat', () => {
  loadSampleState();
  const html = sessionsView();

  // Anak yang hadir: tiga indikator Membaca, satu tercentang, satu pernah terlihat di sesi lalu.
  assert.equal(count(html, 'class="indicator-check"'), 6, 'dua target x tiga indikator');
  // Dua yang tercentang: satu indikator yang tersimpan, satu dimensi karakter dari observasi.
  assert.equal(count(html, 'checked'), 2, 'hanya yang tersimpan yang tercentang');
  assert.match(html, /Pernah terlihat di sesi sebelumnya pada level ini: indikator 2/);
  assert.match(html, /sudah pernah/);

  // Saran penilaian dihitung dari centang yang tersimpan, bukan menunggu guru mengklik.
  assert.match(html, /1 dari 3 tercapai/);
  assert.match(html, /simpul menuju level berikutnya/);

  // Tujuan level ikut ditampilkan dari kurikulum.
  assert.match(html, /Tujuan level 1/);
  assert.match(html, /Mengenali 8 huruf vokal dan konsonan/);
});

test('anak tidak hadir memakai formulir pendek, tanpa penilaian', () => {
  loadSampleState();
  const html = sessionsView();
  assert.match(html, /tercatat Sakit/);
  assert.match(html, /Tidak ada penilaian dan level tidak berubah/);
});

test('evaluasi yang sudah disimpan terkunci', () => {
  loadSampleState();
  const html = sessionsView();
  assert.match(html, /Evaluasi tersimpan/);
  assert.match(html, /✓ Sudah diselesaikan/);
});

test('hanya evaluasi terakhir anak yang menawarkan koreksi', () => {
  loadSampleState();
  // rec-2 sudah final dan merupakan satu-satunya evaluasi anak-2, jadi boleh dikoreksi.
  assert.equal(count(sessionsView(), 'data-action="reopen-eval"'), 1);

  // Anak yang masih punya sesi terbuka tidak boleh mengoreksi yang lama dulu.
  state.records.push({
    id: 'rec-baru',
    session_id: SESSION,
    student_id: 'anak-2',
    attendance: 'Hadir',
    group_no: 1,
    anecdote: '',
    report: '',
    finalized_at: null
  });
  assert.equal(count(sessionsView(), 'data-action="reopen-eval"'), 0);

  // Anak yang sudah lulus juga tidak, karena koreksinya tidak lagi mengubah apa pun.
  loadSampleState();
  state.students.find(s => s.id === 'anak-2').status = 'Lulus';
  assert.equal(count(sessionsView(), 'data-action="reopen-eval"'), 0);
});

test('bagian rapor muncul; tautan WhatsApp hanya bila ada rapor dan nomor', () => {
  loadSampleState();
  const html = sessionsView();
  assert.match(html, /Kabar untuk orang tua/);
  // Anak yang sudah punya rapor pada contoh ini tidak punya nomor, jadi yang tampil ajakan melengkapi.
  assert.match(html, /Lengkapi nomor WhatsApp di profil siswa/);
  assert.ok(!html.includes('wa.me'), 'tanpa nomor tidak ada tautan');

  // Dengan nomor terisi, tautannya muncul.
  state.students.find(x => x.id === 'anak-2').phone = '081200000001';
  assert.match(sessionsView(), /Periksa & buka WhatsApp/);
});

test('ringkasan menghitung siswa aktif dan menampilkan barisnya', () => {
  loadSampleState();
  state.view = 'dashboard';
  const html = dashboard();
  assert.equal(count(html, 'class="student-row"'), 2);
  assert.match(html, /Alya Contoh/);
  // Bima belum punya hasil diagnostik, Alya sudah: hanya satu yang ditandai.
  assert.equal(count(html, 'Belum tes diagnostik'), 1, 'anak yang belum dites ditandai');
  assert.ok(!html.includes('Minat belum diisi'), 'minat tidak lagi ditanyakan');
});

test('daftar siswa dan kurikulum tersusun dari data yang sama', () => {
  loadSampleState();
  assert.match(studentsView(), /Alya Contoh/);
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

test('daftar sesi memisahkan yang belum selesai dan membatasi riwayat', () => {
  loadSampleState();
  state.active = null;
  // 14 sesi selesai + 1 belum, supaya batas 10 terlihat bekerja.
  state.classes = [];
  state.records = [];
  for (let i = 0; i < 15; i++) {
    const id = `kelas-${i}`;
    state.classes.push({
      id,
      date: `2026-09-${String(i + 1).padStart(2, '0')}`,
      theme: `Tema ${i}`,
      duration_minutes: 60,
      start_time: null,
      material: '',
      created_at: '2026-09-01T00:00:00Z'
    });
    state.records.push({
      id: `r-${i}`,
      session_id: id,
      student_id: 'anak-1',
      attendance: 'Hadir',
      group_no: 1,
      anecdote: '',
      report: '',
      finalized_at: i === 0 ? null : '2026-09-11T03:00:00Z'
    });
  }
  const html = sessionsView();
  assert.match(html, /Belum selesai dievaluasi/);
  // Satu yang terbuka selalu tampil, plus sepuluh terbaru dari empat belas yang selesai.
  assert.equal(count(html, 'data-action="open-session"'), 11);
  assert.match(html, /Tampilkan 4 sesi sebelumnya/);

  state.allSessions = true;
  assert.equal(count(sessionsView(), 'data-action="open-session"'), 15);
});

test('pembatalan sesi hanya ditawarkan selama belum ada evaluasi tersimpan', () => {
  loadSampleState();
  // Contoh bawaan punya satu evaluasi tersimpan (rec-2), jadi tawarannya tidak muncul.
  assert.equal(count(sessionsView(), 'data-action="delete-class"'), 0);

  loadSampleState();
  state.records.forEach(r => (r.finalized_at = null));
  const html = sessionsView();
  assert.equal(count(html, 'data-action="delete-class"'), 1);
  assert.match(html, /Batalkan sesi ini/);
});

test('sesi jadwal menampilkan anggota non-aktif, bukan menyembunyikannya', () => {
  loadSampleState();
  state.schedules = [{ id: 'jad-1', name: 'Pagi', start_time: '08:00:00', end_time: '09:15:00' }];
  state.scheduleStudents = [
    { schedule_id: 'jad-1', student_id: 'anak-1' },
    { schedule_id: 'jad-1', student_id: 'anak-2' }
  ];
  state.students.find(s => s.id === 'anak-2').status = 'Non-Aktif';

  const html = openModal(scheduleForm, state.schedules[0]);
  // Keduanya punya kotak centang: yang tidak dirender akan terhapus diam-diam saat disimpan.
  assert.equal(count(html, 'name="student"'), 2);
  assert.match(html, /value="anak-2" checked/);
  assert.match(html, /non-aktif/, 'anggota non-aktif ditandai, bukan disembunyikan');
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

test('tambah siswa hanya identitas; tes diagnostik memuat catatan dan level awal', () => {
  loadSampleState();
  const baru = openModal(studentForm);
  for (const n of ['name', 'nickname', 'parent_name', 'phone', 'birth_date', 'school_grade'])
    assert.match(baru, new RegExp('name="' + n + '"'));
  assert.match(baru, /name="birth_date"[^>]*required/, 'tanggal lahir wajib');
  assert.match(baru, /name="school_grade"[^>]*required/, 'kelas formal wajib');
  assert.ok(!/name="nickname"[^>]*required/.test(baru), 'nama panggilan tidak wajib');
  assert.ok(!baru.includes('name="age"'), 'usia tidak diketik, dihitung');
  for (const n of ['interest', 'diagnostic', 'learning_notes', 'phase', 'reading_baseline', 'math_baseline'])
    assert.ok(!baru.includes('name="' + n + '"'), n + ' pindah ke tes diagnostik');
  assert.match(baru, />Simpan siswa</, 'tambah siswa tidak lagi membuka tes diagnostik');

  // Minat hilang juga dari profil anak yang sudah ada, tapi catatan dan levelnya tetap bisa dibuka.
  const profil = openModal(studentForm, state.students[0]);
  assert.ok(!profil.includes('name="interest"'));
  // Ujian sumatif lama disembunyikan selama pilot, termasuk untuk anak yang levelnya sudah di akhir fase.
  {
    const records = state.records;
    state.records = [];
    state.competencies.forEach(c => (c.current_level = c.target));
    const akhir = openModal(studentForm, state.students[0]);
    assert.ok(
      !akhir.includes('data-form="summative"') && !akhir.includes('Ujian sumatif'),
      'tanpa formulir sumatif'
    );
    assert.ok(!akhir.includes('Riwayat evaluasi'), 'riwayat evaluasi lama disembunyikan');
    state.records = records;
  }
  // Profil pilot: hasil diagnostik, pilihan level awal, dan tampilan per bidang lama tidak ditampilkan.
  for (const n of ['diagnostic', 'reading_baseline', 'math_baseline', 'phase'])
    assert.ok(!profil.includes('name="' + n + '"'), n + ' tidak ada di profil');
  for (const lama of [
    'Arti level',
    'Perjalanan kompetensi',
    'Karakter tidak diberi level',
    'Target mengalir otomatis',
    'tidak ikut sesi kelas'
  ])
    assert.ok(!profil.includes(lama), lama + ' sudah dihapus');
  assert.ok(!profil.includes('name="learning_notes"'), 'catatan gaya belajar tidak ditanyakan');
  assert.ok(
    profil.includes(
      '<h3>Level saat ini</h3><p><strong>Level 1 — Aku Siap Belajar</strong></p><p class="muted">Anak mulai nyaman.</p>'
    )
  );
  // Alya punya sesi terbuka di contoh; tanpa sesi itu, kalimat status yang baru tampil.
  const records = state.records;
  state.records = [];
  assert.match(
    openModal(studentForm, state.students[0]),
    /Anak nonaktif tidak bisa dimasukkan ke sesi kelas/
  );
  state.records = records;
});

test('tes diagnostik: pilih anak dan satu level, dengan saran dari kelas formal', () => {
  loadSampleState();
  state.records = [];
  state.diagnostic = null;
  // Hanya anak yang belum punya status tes yang bisa dipilih: Alya sudah, Bima belum.
  const tes = openModal(diagnosticForm);
  assert.match(tes, /data-form="diagnostic-start"/);
  assert.match(tes, /value="anak-2"/);
  assert.ok(!tes.includes('value="anak-1"'), 'anak yang sudah dites tidak ditawarkan lagi');
  assert.match(tes, /Level yang dites/);
  assert.match(tes, /<option value="4" selected>Level 4[^<]*\(saran\)/, 'Bima SD 2 → saran Level 4');
  for (const l of [1, 2, 3, 4]) assert.match(tes, new RegExp('<option value="' + l + '"'));
  assert.ok(
    tes.indexOf('name="start"') < tes.indexOf('data-level-desc'),
    'deskriptor di bawah pilihan level'
  );
  assert.ok(tes.indexOf('data-level-desc') < tes.indexOf('diagnostic-rules'), 'deskriptor di atas Cara tes');
  assert.match(tes, /Lulus Level X → mulai belajar Level X\+1/);
  assert.ok(!/naik level|turun/i.test(tes), 'tidak ada lagi jalur naik-turun');

  // Tes yang terhenti di perangkat ini ditawarkan untuk dilanjutkan atau dibuang.
  state.diagnosticDrafts = {
    'anak-2': { student: 'anak-2', level: 3, answers: { 1: 'T', 2: 'B' }, reviewed: false },
    'anak-1': { student: 'anak-1', level: 1, answers: {}, revision: true }
  };
  const mulai = openModal(diagnosticForm);
  assert.match(mulai, /Tes belum selesai/);
  assert.match(mulai, /Level 3 · 2 dari 8 dinilai/);
  assert.match(mulai, /data-action="diagnostic-resume" data-id="anak-2"/);
  assert.match(mulai, /data-action="diagnostic-discard" data-id="anak-2"/);
  assert.ok(!mulai.includes('data-id="anak-1"'), 'revisi tidak ditawarkan di daftar tes baru');
  assert.match(mulai, /Memulai tes baru akan menggantinya/);

  state.students.forEach(x => (x.diagnostic_status = 'Lulus Level 1'));
  assert.match(openModal(diagnosticForm), /Semua anak sudah dites/);
  state.students = [];
  assert.match(
    openModal(diagnosticForm),
    /Belum ada siswa aktif/,
    'tanpa siswa bukan berarti semua sudah dites'
  );
});

test('tes diagnostik: delapan kartu satu level, lalu hasil lulus atau belum lulus', () => {
  loadSampleState();
  state.records = [];
  state.diagnostic = { student: 'anak-2', level: 1, answers: { 2: 'B' }, reviewed: false, note: '' };
  const langkah = openModal(diagnosticForm);
  assert.match(langkah, /data-form="diagnostic-level" data-id="1"/);
  assert.match(langkah, /Menguji Level 1 — Aku Siap Belajar/);
  assert.equal(count(langkah, 'class="diagnostic-task"'), 8);
  assert.match(langkah, /Bertahan sampai tugas terakhir/, 'ukuran dibaca dari indikator kurikulum');
  assert.ok(langkah.includes('&lt;di luar pandangan&gt;'), 'tugas dari database di-escape');
  assert.match(langkah, /name="i2" value="B" checked/, 'jawaban tersimpan terisi kembali');
  assert.match(langkah, /name="i6" value="T"\s+required/, 'indikator penentu wajib dinilai');
  assert.ok(!/name="i7" value="T"[^>]*required/.test(langkah), 'English tidak wajib');
  const bawah = langkah.indexOf('Diamati sepanjang tes — nilai di akhir');
  assert.ok(
    bawah > langkah.indexOf('name="i7"') && langkah.indexOf('name="i1"') > bawah,
    'pengamatan di bawah'
  );
  assert.match(langkah, /data-action="diagnostic-restart">← Ulang dari awal</);
  assert.match(langkah, />Lihat hasil →</);

  // Lulus: 1-6 semua ✓ (English ◐ tidak menentukan) → mulai belajar Level 2.
  const lulus = { 1: 'T', 2: 'T', 3: 'T', 4: 'T', 5: 'T', 6: 'T', 7: 'B', 8: 'T' };
  state.diagnostic = { student: 'anak-2', level: 1, answers: lulus, reviewed: true, note: '' };
  const hasil = openModal(diagnosticForm);
  assert.match(hasil, /LULUS LEVEL 1/);
  assert.match(hasil, /Mulai belajar Level 2 — Aku Mulai Mengenal/);
  assert.ok(!hasil.includes('Perlu dilatih lebih dulu'));
  assert.match(hasil, /Level 1: ✓✓✓✓✓✓ \(English ◐\) → lulus/);
  assert.match(hasil, /Level awal: 2/);
  assert.match(hasil, /Karakter: ✓/);
  assert.match(hasil, /bisa langsung dimasukkan ke sesi kelas/);
  assert.ok(!hasil.includes('learning_notes') && !hasil.includes('gaya belajar'), 'catatan gaya belajar tidak ditanyakan');
  assert.match(hasil, /data-action="diagnostic-back">← Ubah nilai</);
  assert.match(hasil, />Simpan hasil tes</);

  // Satu ◐ saja = belum lulus → tetap di Level 1, dan indikatornya disebut sebagai fokus latihan.
  state.diagnostic.answers = { ...lulus, 2: 'B' };
  const belum = openModal(diagnosticForm);
  assert.match(belum, /BELUM LULUS LEVEL 1/);
  assert.match(belum, /Mulai belajar Level 1 — Aku Siap Belajar/);
  assert.match(
    belum,
    /Perlu dilatih lebih dulu<\/h4><ul class="diagnostic-focus"><li>2\. Merespons ketika namanya dipanggil<\/li><\/ul>/
  );
  state.records = [{ student_id: 'anak-2' }];
  assert.match(openModal(diagnosticForm), /sudah pernah ikut kelas, jadi level tidak diubah/);
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
  assert.deepEqual(diagnosticOutcome(3, { 1: 'T' }).complete, false);
  assert.deepEqual(focusIndicators({ ...T6, 3: 'N', 5: 'B', 7: 'N' }), [3, 5]);
  assert.deepEqual(diagnosticPayload(3, { 2: 'N', 7: 'B' }), [
    { level: 3, number: 2, rating: 'N' },
    { level: 3, number: 7, rating: 'B' }
  ]);
  assert.equal(draftProgress({ answers: { 1: 'T', 8: 'B' } }), 2);
  assert.equal(suggestedStart('Belum sekolah'), 1);
  assert.equal(suggestedStart('TK A'), 2);
  assert.equal(suggestedStart('TK B'), 3);
  assert.equal(suggestedStart('SD 1'), 4);
  assert.equal(
    diagnosticSummary({
      date: '13/9/2026',
      grade: 'TK B',
      level: 3,
      answers: { ...T6, 1: 'N', 8: 'B' },
      note: '  masih mengeja '
    }),
    'Tes diagnostik 13/9/2026 · TK B · Level 3\nLevel 3: ✗✓✓✓✓✓ (English ·) → belum lulus\nLevel awal: 3\nKarakter: ◐\nCatatan: masih mengeja'
  );
  // Revisi membuka level yang dites dengan nilainya; tes lama beberapa level dibuka pada titik mulainya.
  const rows = [
    { test_id: 't', level: 2, indicator_number: 1, rating: 'N' },
    { test_id: 't', level: 1, indicator_number: 1, rating: 'T' },
    { test_id: 'lain', level: 2, indicator_number: 2, rating: 'T' }
  ];
  assert.deepEqual(
    runFromSaved({ id: 't', student_id: 's', tested_level: 2, start_level: 2, note: 'x' }, rows),
    {
      student: 's',
      level: 2,
      answers: { 1: 'N' },
      reviewed: false,
      revision: true,
      note: 'x'
    }
  );
  assert.equal(runFromSaved({ id: 't', student_id: 's', tested_level: null, start_level: 1 }, rows).level, 1);
  loadSampleState();
  assert.deepEqual(taskOrder(state.curriculumIndicators, 1), {
    active: [2, 3, 4, 5, 6, 7],
    observed: [1, 8]
  });
});

test('status tes di daftar siswa, profil, dan sesi kelas', () => {
  loadSampleState();
  state.records = [];
  const alya = state.students.find(s => s.id === 'anak-1');
  const bagian = diagnosticResultSection(alya);
  assert.match(bagian, /Hasil tes diagnostik/);
  assert.match(bagian, /<strong>Belum lulus Level 2<\/strong> → mulai belajar <strong>Level 2<\/strong>/);
  assert.match(bagian, /✗<\/span> 2\. Mencocokkan huruf/, 'kalimat indikator dari salinan saat dites');
  assert.ok(bagian.includes('Masih &lt;mengeja&gt;'));
  assert.match(bagian, /data-action="diagnostic-revise" data-id="anak-1"/);
  state.diagnosticTests[0].revised_at = '2026-09-14T02:00:00Z';
  assert.match(diagnosticResultSection(alya), /Direvisi 14\/9\/2026/);
  state.records = [{ student_id: 'anak-1' }];
  assert.match(diagnosticResultSection(alya), /terkunci karena anak sudah mengikuti kelas/);
  assert.equal(diagnosticResultSection(state.students.find(s => s.id === 'anak-2')), '', 'anak belum dites');
  // Profil: hasil diagnostik hanya dibaca, diisi oleh Tes Diagnostik.
  assert.ok(
    !openModal(studentForm, alya).includes('name="diagnostic"'),
    'ringkasan teks tidak ditampilkan di profil'
  );
  // Pemilik tidak menerima baris tes dari database, jadi bagiannya tidak muncul.
  state.diagnosticTests = [];
  assert.ok(!openModal(studentForm, alya).includes('Hasil tes diagnostik'));

  // Daftar siswa: status tes atau tanda belum tes.
  loadSampleState();
  state.view = 'students';
  const daftar = studentsView();
  assert.match(daftar, /class="status-tes">Belum lulus Level 2</);
  assert.ok(
    daftar.includes('<small><b>Level 1 — Aku Siap Belajar</b></small>'),
    'baris siswa memakai nama level pilot'
  );
  assert.ok(!daftar.includes('Bahasa Indonesia <b>Level'));
  assert.equal(count(daftar, 'Belum tes diagnostik'), 1);

  // Sesi kelas: anak yang belum dites tidak bisa dicentang.
  loadSampleState();
  state.records = [];
  state.active = null;
  openModal(() => sessionsView());
  const sesi = openModal(newSessionForm);
  assert.match(sesi, /value="anak-2" disabled>Bima Contoh <small>Tes diagnostik dulu/);
  assert.match(sesi, /value="anak-1">Alya Contoh/);

  loadSampleState();
  const kur = curriculumView();
  assert.match(kur, /<summary>Tes diagnostik <em>\(diamati sepanjang tes\)<\/em><\/summary>/);
  assert.equal(count(kur, 'class="indicator-test"'), 8, 'hanya indikator yang punya tugas');
});

test('usia dihitung dari tanggal lahir, tahun ajaran berganti Juli, kelas formal mengisi titik awal', () => {
  const hari = new Date(2026, 8, 13); // 13 September 2026
  assert.equal(ageText('2020-05-10', hari), '6 tahun 4 bulan');
  assert.equal(ageText('2020-09-14', hari), '5 tahun 11 bulan', 'belum ulang tahun bulan ini');
  assert.equal(ageText('2026-03-13', hari), '6 bulan');
  assert.equal(ageText('', hari), '');
  assert.equal(ageText('2027-01-01', hari), '', 'tanggal di masa depan tidak menghasilkan usia');
  assert.equal(schoolYearOf(new Date('2026-07-01T00:00:00+07:00')), '2026/2027');
  assert.equal(schoolYearOf(new Date('2026-06-30T12:00:00+07:00')), '2025/2026');
  assert.equal(gradePhase('SD 3'), 'sd3');
  assert.equal(gradePhase('TK A'), 'fondasi');
  assert.equal(gradePhase(''), '');
});
