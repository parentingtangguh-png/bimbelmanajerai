// Data contoh tetap untuk menyusun layar di luar browser: satu anak sudah dites (Belum lulus Level 2),
// satu anak belum dites, dan satu anak non-aktif.
import { state, initialState } from '../../src/state.js';

export function loadSampleState() {
  Object.assign(state, initialState(), {
    role: 'teacher',
    name: 'Guru Contoh',
    view: 'students',
    students: [
      {
        id: 'anak-1',
        name: 'Alya Contoh',
        parent_name: 'Bunda Contoh',
        phone: '081200000000',
        nickname: 'Alya',
        birth_date: '2020-05-10',
        school_grade: 'TK B',
        school_year: '2026/2027',
        status: 'Aktif',
        pilot_level: 2
      },
      {
        id: 'anak-2',
        name: 'Bima Contoh',
        parent_name: 'Ayah Contoh',
        phone: '',
        nickname: '',
        birth_date: '2018-01-20',
        school_grade: 'SD 2',
        school_year: '2026/2027',
        status: 'Aktif',
        pilot_level: null
      },
      {
        id: 'anak-3',
        name: 'Citra Cuti',
        parent_name: 'Umi Contoh',
        phone: '',
        nickname: '',
        birth_date: '2021-02-02',
        school_grade: 'TK A',
        school_year: '2026/2027',
        status: 'Non-Aktif',
        pilot_level: null
      }
    ],
    // The three branches of the team screen: the owner (no button), an active teacher, and a
    // deactivated one.
    members: [
      { name: 'Pemilik Contoh', email: 'pemilik@contoh.test', role: 'owner', active: true },
      { name: 'Guru Contoh', email: 'guru@contoh.test', role: 'teacher', active: true },
      { name: 'Guru Cuti', email: 'cuti@contoh.test', role: 'teacher', active: false }
    ],
    assignments: [{ student_id: 'anak-1', teacher_id: 'guru-1' }],
    profiles: [{ id: 'guru-1', name: 'Guru Contoh' }],
    curriculumPhases: [
      { code: 'fondasi', name: 'Fase Fondasi', cp: 'Pada akhir Fase Fondasi, anak mampu.', sort_order: 1 }
    ],
    curriculumLevels: [
      { level: 1, phase_code: 'fondasi', title: 'Aku Siap Belajar', description: 'Anak mulai nyaman.' },
      {
        level: 2,
        phase_code: 'fondasi',
        title: 'Aku Mulai Mengenal',
        description: 'Huruf dan angka bermakna.'
      }
    ],
    curriculumIndicators: [
      ...[3, 4, 5, 6, 7].map(number => ({
        level: 1,
        number,
        text: 'Indikator L1-' + number,
        domain: number === 7 ? 'English' : 'Numerasi',
        diagnostic_task: 'Tugas L1-' + number,
        diagnostic_material: 'Bahan L1-' + number,
        diagnostic_success: '4 dari 5 benar.',
        diagnostic_observe: false
      })),
      {
        level: 1,
        number: 2,
        text: 'Merespons ketika namanya dipanggil',
        domain: 'Bahasa lisan',
        diagnostic_task: 'Panggil nama 3 kali <di luar pandangan>.',
        diagnostic_material: '—',
        diagnostic_success: 'Menoleh 2 dari 3.',
        diagnostic_observe: false
      },
      {
        level: 1,
        number: 1,
        text: 'Mengikuti sesi dari awal hingga selesai',
        domain: 'Kesiapan belajar',
        diagnostic_task: 'Diamati sepanjang tes.',
        diagnostic_material: '—',
        diagnostic_success: 'Bertahan sampai tugas terakhir.',
        diagnostic_observe: true
      },
      {
        level: 1,
        number: 8,
        text: 'Mau duduk bersama (observasi guru)',
        domain: 'Karakter',
        diagnostic_task: 'Diamati sepanjang tes.',
        diagnostic_material: '—',
        diagnostic_success: 'Dicatat saja.',
        diagnostic_observe: true
      },
      { level: 2, number: 1, text: 'Menyebutkan nama huruf vokal <A>', domain: 'Literasi' }
    ],
    diagnosticTests: [
      {
        id: 'tes-1',
        student_id: 'anak-1',
        tested_on: '2026-09-13',
        tested_level: 2,
        passed: false,
        final_level: 2,
        note: 'Masih <mengeja>',
        revised_at: null
      }
    ],
    diagnosticResults: [
      { test_id: 'tes-1', level: 2, indicator_number: 2, rating: 'N', indicator_text: 'Mencocokkan huruf' },
      { test_id: 'tes-1', level: 2, indicator_number: 1, rating: 'T', indicator_text: 'Vokal saat dites' }
    ],
    curriculumThemes: [
      { number: 2, phase_code: 'fondasi', name: 'Aku Bisa Menghitung', first_meeting: 25, last_meeting: 48 },
      {
        number: 1,
        phase_code: 'fondasi',
        name: 'Aku Bisa Bercerita',
        first_meeting: 1,
        last_meeting: 24,
        description: 'Anak bercerita tentang diri & keluarga.',
        focus_areas: 'Bahasa lisan dan Literasi',
        focus_indicators: ['L1-2', 'L9-9'],
        character_focus: 'berani menjawab',
        english_words: "My name is… · I don't know"
      }
    ]
  });
}
