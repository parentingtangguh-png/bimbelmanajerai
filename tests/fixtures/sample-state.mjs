// Data contoh tetap untuk menyusun layar di luar browser: satu anak sudah dites final (Level 3, mulai
// indikator 2), satu anak belum dites, dan satu anak non-aktif.
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
        pilot_level: 3
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
    diagnosticTests: [
      {
        id: 'tes-1',
        student_id: 'anak-1',
        teacher_id: 'guru-1',
        tested_level: 3,
        started_on: '2026-09-15',
        finalized_at: '2026-09-16T08:00:00Z',
        start_level: 3,
        start_indicator: 2,
        curriculum_complete: false
      }
    ],
    diagnosticResults: [
      { test_id: 'tes-1', number: 2, status: 'belum', package: 'cadangan' },
      { test_id: 'tes-1', number: 1, status: 'lulus', package: 'utama' },
      { test_id: 'tes-1', number: 14, status: 'lulus', package: 'utama' }
    ],
    k8Levels: [
      { level: 1, title: 'Mulai Mengenali', description: 'Tugas sangat konkret.' },
      { level: 3, title: 'Merangkai Awal', description: 'Merangkai dua unsur.' },
      { level: 7, title: 'Mengolah Informasi', description: 'Menuju kelas I akhir.' }
    ],
    k8Indicators: [1, 3, 7].flatMap(level =>
      ['A1', 'B1', 'E1', 'D1', 'C1', 'F1', 'A2', 'B2', 'E2', 'D2', 'C2', 'F2', 'EN', 'KR'].map((slot, i) => ({
        level,
        number: i + 1,
        slot,
        competency: `Kompetensi ${slot} L${level} **<b>**`,
        method: 'Cara uji ' + slot,
        material: 'Bahan ' + slot,
        success: '**4 dari 5** tepat.'
      }))
    ),
    k8Notes: [{ doc: 'B', position: 1, title: 'Bahan Cadangan', markdown: '- Deret cadangan **k d s**' }]
  });
}
