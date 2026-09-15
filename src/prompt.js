// Prompt kegiatan: teks siap salin ke ChatGPT/Gemini untuk satu sesi, disusun dari data kelas dan kurikulum
// 8 level. Tanpa DOM dan tanpa jaringan. Teks dasarnya disetujui pemilik setelah 5 kali uji (14 Sep 2026) lalu
// disesuaikan ke kurikulum 8 level.
import {
  state,
  ageText,
  levelName,
  finalTestFor,
  passedIndicators,
  suggestedIndicator,
  englishReady,
  k8ThemeFor,
  k8SubthemeFor
} from './state.js';

const dateText = d =>
  new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(`${d}T00:00:00`));
// Isi kurikulum memakai Markdown ringan; prompt memakai teks biasa.
const plain = s =>
  String(s || '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\\\*/g, '*')
    .replace(/\s+/g, ' ')
    .trim();
const RESULT_TEXT = { lulus: 'LULUS', belum: 'BELUM', belum_dinilai: 'BELUM DINILAI' };
// Kata yang dilindungi dari tulisan latihan tema (docs/curriculum/cp-level-tema.md).
export const PROTECTED_WORDS = 'buku, bola, susu, mata, kaki, sapi, lap, air, roti, pot, apel, pena';

const indicatorOf = (level, n) => state.k8Indicators.find(i => i.level === Number(level) && i.number === n);

// Baris sesi selesai milik anak, terbaru lebih dulu (sebelum sesi c).
function historyOf(studentId, c) {
  return state.classScheduleStudents
    .map(x => ({ x, s: state.classSchedules.find(y => y.id === x.schedule_id) }))
    .filter(
      ({ x, s }) =>
        x.student_id === studentId && s?.completed_at && s.id !== c.id && s.scheduled_date <= c.scheduled_date
    )
    .sort((a, b) => b.s.scheduled_date.localeCompare(a.s.scheduled_date));
}

export function previousCondition(student, c) {
  const history = historyOf(student.id, c);
  if (!history.length) {
    const test = finalTestFor(student.id);
    return `belum pernah ikut kelas; hasil tes diagnostik: mulai Level ${test?.start_level ?? student.pilot_level} indikator ${test?.start_indicator ?? '-'}`;
  }
  const { x, s } = history[0];
  const when = `${dateText(s.scheduled_date)} · Pertemuan ${s.meeting_number}`;
  if (x.level !== Number(student.pilot_level))
    return `(${when}): baru naik dari Level ${x.level} ke Level ${student.pilot_level}`;
  if (!x.indicator_number) return `(${when}): 12 indikator akademik Level ${x.level} sudah lulus`;
  const ind = indicatorOf(x.level, x.indicator_number);
  let text = `(${when}): melatih ${x.indicator_number}. ${plain(ind?.competency)} → ${RESULT_TEXT[x.result] || 'BELUM DINILAI'}`;
  if (x.result !== 'lulus') {
    const streak = history.findIndex(
      h => h.x.level !== x.level || h.x.indicator_number !== x.indicator_number || h.x.result === 'lulus'
    );
    const times = streak === -1 ? history.length : streak;
    if (times > 1) text += ` (sudah ${times} kali belum lulus)`;
  }
  return text;
}

function companionLine(student, c, n, label) {
  const level = student.pilot_level;
  const ind = indicatorOf(level, n);
  if (passedIndicators(student.id, level).includes(n))
    return `  - ${label}: sudah lulus di level ini; cukup mewarnai kegiatan`;
  if (n === 13 && !englishReady(student, c))
    return `  - ${label}: belum boleh dinilai (belum hadir 3 pertemuan dalam satu tema); cukup dikenalkan lewat kosakata tema`;
  return `  - ${label} (boleh dinilai): ${plain(ind?.competency)}\n    Cara uji: ${plain(ind?.method)}\n    Tanda lulus: ${plain(ind?.success)}`;
}

function studentBlock(student, c, index) {
  const level = Number(student.pilot_level);
  const lv = state.k8Levels.find(x => x.level === level);
  const age = ageText(student.birth_date) || 'usia belum diisi';
  const passed = passedIndicators(student.id, level).filter(n => n <= 12);
  const passedText = passed.length
    ? passed.map(n => `${n}. ${plain(indicatorOf(level, n)?.competency).replace(/\.$/, '')}`).join('; ')
    : 'belum ada';
  const current = suggestedIndicator(student);
  const today = current
    ? (() => {
        const ind = indicatorOf(level, current);
        return `  - Hari ini dilatih: ${current}. ${plain(ind?.competency)}\n  - Cara uji di kurikulum: ${plain(ind?.method)}\n  - Bahan uji di kurikulum: ${plain(ind?.material)}\n  - Tanda lulus (dari kurikulum): ${plain(ind?.success)}`;
      })()
    : `  - Hari ini dilatih: tidak ada indikator akademik baru (12 indikator Level ${level} sudah lulus, menunggu guru menaikkan level); ikut kegiatan bersama sebagai penguatan`;
  return [
    `Siswa ${index} · ${student.nickname || student.name} · ${age} · ${student.school_grade || 'kelas formal belum diisi'} · ${levelName(level)}`,
    lv ? `  - Gambaran level: ${plain(lv.description)}` : '',
    `  - Sudah lulus (${passed.length} dari 12 akademik): ${passedText}`,
    `  - Kondisi sebelumnya ${previousCondition(student, c)}`,
    today,
    companionLine(student, c, 13, 'Bahasa Inggris'),
    companionLine(student, c, 14, 'Karakter')
  ]
    .filter(Boolean)
    .join('\n');
}

export function activityPrompt(scheduleId, studentIds) {
  const c = state.classSchedules.find(x => x.id === scheduleId);
  if (!c) return '';
  const kids = state.students.filter(s => studentIds.includes(s.id) && s.pilot_level);
  const t = k8ThemeFor(c.meeting_number);
  const sub = k8SubthemeFor(c.meeting_number);
  const sessionNo =
    state.classSchedules
      .filter(x => x.meeting_number === c.meeting_number)
      .sort((a, b) => String(a.scheduled_time || '99').localeCompare(String(b.scheduled_time || '99')))
      .findIndex(x => x.id === c.id) + 1;
  const words = kind =>
    state.k8English
      .filter(e => e.theme === t?.number && e.kind === kind)
      .sort((a, b) => a.position - b.position)
      .map(e => e.text)
      .join(', ');
  const teacher = state.name || 'Guru';
  const names = kids.map(s => s.nickname || s.name);
  const slots = kids.length ? Math.round(40 / kids.length) : 40;
  return `Anda adalah perancang kegiatan belajar untuk bimbel anak usia dini dan awal SD.
Susun SATU rencana kegiatan untuk satu sesi kelas berdasarkan data berikut.

DATA KELAS
- Guru: ${teacher} (1 orang)
- Siswa hadir: ${kids.length} anak
- Lama sesi: 60 menit
- Jadwal: ${dateText(c.scheduled_date)} · Pertemuan ke-${c.meeting_number} · Sesi ${sessionNo}
- Tema: ${t ? `${t.number} — ${t.name}` : '-'}${sub ? ` · Subtema: ${sub.name}` : ''}
  ${plain(t?.description)}
- Benda nyata bersama: ${plain(t?.objects)}
- Kosakata bahasa Indonesia tema: ${plain(t?.vocabulary)}
- Kosakata Bahasa Inggris tema: kata benda ${words('noun')} · frasa ${words('phrase')}
- Situasi karakter alami dalam tema: ${plain(t?.character)}

DATA SISWA HADIR
${kids.map((s, i) => studentBlock(s, c, i + 1)).join('\n\n')}

ATURAN
1. Pembagian waktu dihitung dari awal sesi: Pembuka menit 0–10, Kegiatan inti menit 10–50,
   Penutup menit 50–60.
2. Satu kegiatan bertema yang dikerjakan bersama, dengan tugas berbeda untuk tiap siswa.
   Tugas tiap siswa HANYA melatih indikator "Hari ini dilatih" miliknya, memakai benda,
   kata, atau cerita yang sesuai tema dan subtema.
3. Guru hanya satu orang dan mendampingi siswa bergantian. Tuliskan urutan pendampingan
   beserta menitnya dalam rentang 10–50 dan pastikan seluruh 40 menit terbagi (untuk
   ${kids.length} siswa sekitar ${slots} menit per siswa). Saat guru di siswa lain, setiap siswa—termasuk
   Level 1—harus punya tugas konkret yang bisa dilakukan sendiri.
4. Tanpa bahan cetak: jangan menyebut kartu, lembar kerja, atau gambar cetak. Huruf, angka,
   dan kata ditulis guru saat itu di kertas atau papan; gunakan benda nyata di kelas atau rumah.
   Daftar Bahan wajib memuat semua benda yang disebut di bahan uji dan cara uji
   (akademik, Bahasa Inggris, karakter), termasuk yang bukan benda tema.
5. Bahasa Inggris dan karakter mewarnai kegiatan. Nilai hanya yang bertanda "boleh dinilai",
   memakai cara uji dan tanda lulusnya apa adanya. Keduanya tidak memengaruhi indikator
   "Hari ini dilatih". Untuk tiap yang boleh dinilai, tulis di bagian siswa itu pada menit
   berapa dan bagaimana guru menilainya. Jangan menulis perintah di pembuka, kegiatan, atau
   penutup yang dilarang oleh cara uji (misalnya menyuruh merapikan atau mengucapkan terima
   kasih bila yang dinilai justru tanpa disuruh).
6. Perhatikan "Kondisi sebelumnya": jika sebelumnya LULUS, mulai dari yang sudah bisa lalu
   masuk ke indikator hari ini; jika sebelumnya BELUM, latih indikator yang sama dengan cara
   yang berbeda dari sebelumnya; jika BELUM DINILAI, latih lalu nilai indikator yang sama;
   jika belum pernah ikut kelas atau baru naik level, mulai dengan pengenalan yang ringan.
7. Penilaian Lulus/Belum memakai "Cara uji", "Bahan uji", dan "Tanda lulus" dari kurikulum
   apa adanya; jangan membuat ukuran sendiri. Latihan boleh dikemas dalam permainan, tetapi
   saat menilai ikuti cara uji tersebut dan jangan menghitung respons yang dipancing sebelumnya.
   Bahan latihan harus berbeda dari bahan uji, supaya yang dinilai
   kemampuan, bukan hafalan: kata, suku kata, kalimat, dan soal bahan uji tidak boleh dipakai
   untuk latihan, juga sebagian atau dipotong; huruf atau angka tunggal boleh dilatih dengan
   urutan berbeda. Bila penilaian tidak bisa berjalan sah, tulis "belum dinilai".
8. Pastikan isi kegiatan benar secara materi. Jangan memakai kata ${PROTECTED_WORDS}
   sebagai tulisan latihan, karena kata-kata itu dipakai sebagai bahan uji.
9. Jawaban paling banyak sekitar ${250 + 120 * kids.length} kata (untuk ${kids.length} siswa), Bahasa Indonesia sederhana,
   berupa poin, tanpa mengulang penjelasan dan tanpa menyalin ulang data siswa yang tidak dipakai.

FORMAT JAWABAN
1. Judul kegiatan
2. Bahan
3. Pembuka (menit 0–10)
4. Kegiatan inti (menit 10–50)
   - Tugas bersama
   - Urutan pendampingan guru (menit)
${names
  .map(
    n => `   - ${n}: tugas · tugas mandiri saat guru di siswa lain · cara menilai
     · Bahasa Inggris/karakter yang boleh dinilai: menit dan cara menilai`
  )
  .join('\n')}
5. Penutup (menit 50–60)`;
}
