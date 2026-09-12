// A fixed, synthetic classroom used to render screens outside the browser. The numbers are chosen to
// exercise the awkward cases: a child mid-phase, a child at the end of a phase, an absent child, an
// evaluation already saved, and indicators both ticked and seen in an earlier session.
import { state, initialState } from '../../src/state.js';

export const SESSION = 'sess-1';

export function loadSampleState() {
  Object.assign(state, initialState(), {
    role: 'teacher',
    name: 'Guru Contoh',
    view: 'sessions',
    active: SESSION,
    students: [
      {
        id: 'anak-1',
        name: 'Alya Contoh',
        parent_name: 'Bunda Contoh',
        phone: '081200000000',
        interest: 'Kupu-kupu',
        status: 'Aktif',
        diagnostic: 'Mengenali huruf vokal',
        learning_notes: 'Senang belajar lewat gambar',
        reading_baseline: 1,
        reading_level: 1,
        reading_target: 4,
        math_baseline: 1,
        math_level: 1,
        math_target: 4
      },
      {
        id: 'anak-2',
        name: 'Bima Contoh',
        parent_name: 'Ayah Contoh',
        phone: '',
        interest: '',
        status: 'Aktif',
        diagnostic: '',
        learning_notes: '',
        reading_baseline: 4,
        reading_level: 4,
        reading_target: 4,
        math_baseline: 3,
        math_level: 4,
        math_target: 4
      }
    ],
    // The three branches of the team screen: the owner (no button), an active teacher, and a
    // deactivated one.
    members: [
      { name: 'Pemilik Contoh', email: 'pemilik@contoh.test', role: 'owner', active: true },
      { name: 'Guru Contoh', email: 'guru@contoh.test', role: 'teacher', active: true },
      { name: 'Guru Cuti', email: 'cuti@contoh.test', role: 'teacher', active: false }
    ],
    classes: [
      {
        id: SESSION,
        date: '2026-09-12',
        theme: 'Pasar Sehat',
        duration_minutes: 75,
        start_time: '08:00:00',
        material: 'Panduan kelas contoh.',
        created_at: '2026-09-12T01:00:00Z'
      }
    ],
    records: [
      {
        id: 'rec-1',
        session_id: SESSION,
        student_id: 'anak-1',
        attendance: 'Hadir',
        group_no: 1,
        anecdote: '',
        report: '',
        finalized_at: null
      },
      {
        id: 'rec-2',
        session_id: SESSION,
        student_id: 'anak-2',
        attendance: 'Sakit',
        group_no: 2,
        anecdote: 'Izin dari orang tua.',
        report: 'Kabar contoh untuk orang tua.',
        finalized_at: '2026-09-12T03:00:00Z'
      },
      {
        id: 'rec-lama',
        session_id: 'sess-lama',
        student_id: 'anak-1',
        attendance: 'Hadir',
        group_no: 1,
        anecdote: '',
        report: '',
        finalized_at: '2026-09-11T03:00:00Z'
      }
    ],
    assessments: [
      { session_student_id: 'rec-1', subject: 'reading', level_snapshot: 1, rating: null, evidence_note: '' },
      {
        session_student_id: 'rec-1',
        subject: 'math',
        level_snapshot: 1,
        rating: 'MB',
        evidence_note: 'Catatan.'
      },
      {
        session_student_id: 'rec-2',
        subject: 'writing',
        level_snapshot: 4,
        rating: 'T',
        evidence_note: 'Sudah.'
      }
    ],
    observations: [
      {
        session_student_id: 'rec-1',
        english_rating: 'MB',
        english_note: 'Menirukan dua kata.',
        character_dimensions: ['kemandirian'],
        character_note: 'Merapikan alat sendiri.'
      }
    ],
    indicatorChecks: [
      {
        session_student_id: 'rec-1',
        subject: 'reading',
        indicator_index: 1,
        level_snapshot: 1,
        indicator_text: 'Menunjuk huruf yang benar.'
      },
      {
        session_student_id: 'rec-lama',
        subject: 'reading',
        indicator_index: 2,
        level_snapshot: 1,
        indicator_text: 'Menyebutkan bunyi huruf.'
      }
    ],
    competencies: [
      {
        student_id: 'anak-1',
        subject: 'reading',
        baseline: 1,
        current_level: 1,
        target: 4,
        evidence_count: 1,
        repeat_count: 0,
        intervention: false,
        required: true,
        active: true
      },
      {
        student_id: 'anak-1',
        subject: 'math',
        baseline: 1,
        current_level: 1,
        target: 4,
        evidence_count: 0,
        repeat_count: 0,
        intervention: false,
        required: true,
        active: true
      },
      {
        student_id: 'anak-2',
        subject: 'writing',
        baseline: 4,
        current_level: 4,
        target: 4,
        evidence_count: 2,
        repeat_count: 0,
        intervention: false,
        required: true,
        active: true
      }
    ],
    curriculum: [
      {
        level: 1,
        reading: 'Mengenali 8 huruf vokal dan konsonan.',
        reading_criteria: 'Terlihat dalam dua kegiatan berbeda.',
        reading_indicators: [
          'Menunjuk huruf yang benar.',
          'Menyebutkan bunyi huruf.',
          'Memilih benda berawal bunyi sama.'
        ],
        reading_key: 3,
        reading_spiral: 'Level 2 menggabungkan bunyi menjadi suku kata.',
        math: 'Menghitung benda 1-5.',
        math_criteria: 'Terlihat dalam dua kegiatan berbeda.',
        math_indicators: ['Menghitung 5 benda.', 'Menyebut bilangan terakhir.', 'Mencocokkan kartu angka.'],
        math_key: 2,
        math_spiral: 'Level 2 membandingkan kelompok benda.',
        writing: 'Meniru garis dan lingkaran.',
        writing_criteria: 'Dua kesempatan.',
        writing_indicators: [],
        writing_key: 0,
        writing_spiral: '',
        listening: 'Menyimak instruksi satu langkah.',
        listening_criteria: 'Dua kesempatan.',
        listening_indicators: [],
        listening_key: 0,
        listening_spiral: '',
        speaking: 'Menjawab dengan kata atau frasa.',
        speaking_criteria: 'Dua kesempatan.',
        speaking_indicators: [],
        speaking_key: 0,
        speaking_spiral: '',
        ipas: 'Mengamati benda hidup dan tak hidup.',
        ipas_criteria: 'Dua kesempatan.',
        ipas_indicators: [],
        ipas_key: 0,
        ipas_spiral: '',
        english: 'Mengenali 3 kosakata tema.',
        english_criteria: 'Dua kesempatan.',
        english_indicators: [],
        english_key: 0,
        english_spiral: ''
      },
      {
        level: 4,
        reading: 'Membaca kalimat pendek.',
        reading_criteria: 'Dua kesempatan.',
        reading_indicators: [],
        reading_key: 0,
        reading_spiral: '',
        math: 'Tambah-kurang sampai 20.',
        math_criteria: 'Dua kesempatan.',
        math_indicators: [],
        math_key: 0,
        math_spiral: '',
        writing: 'Menulis 2 kalimat sederhana.',
        writing_criteria: 'Dua kesempatan.',
        writing_indicators: [
          'Menulis dua kalimat.',
          'Memberi spasi antar kata.',
          'Menutup kalimat dengan titik.'
        ],
        writing_key: 3,
        writing_spiral: 'Level 5 menulis paragraf tiga kalimat.',
        listening: 'Menyimak cerita pendek.',
        listening_criteria: 'Dua kesempatan.',
        listening_indicators: [],
        listening_key: 0,
        listening_spiral: '',
        speaking: 'Menceritakan dua peristiwa.',
        speaking_criteria: 'Dua kesempatan.',
        speaking_indicators: [],
        speaking_key: 0,
        speaking_spiral: '',
        ipas: 'Membandingkan sifat bahan.',
        ipas_criteria: 'Dua kesempatan.',
        ipas_indicators: [],
        ipas_key: 0,
        ipas_spiral: '',
        english: 'Mengikuti satu instruksi kelas.',
        english_criteria: 'Dua kesempatan.',
        english_indicators: [],
        english_key: 0,
        english_spiral: ''
      }
    ],
    schedules: [{ id: 'jadwal-1', name: 'Sesi Pagi', start_time: '08:00:00', end_time: '09:30:00' }],
    scheduleStudents: [{ schedule_id: 'jadwal-1', student_id: 'anak-1' }],
    themes: [{ name: 'Pasar Sehat' }]
  });
  return state;
}
