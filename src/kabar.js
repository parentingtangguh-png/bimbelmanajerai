// Kabar harian WhatsApp untuk orang tua, disusun dari satu sesi yang sudah ditandai selesai. Tanpa DOM dan
// jaringan. Kalimat berasal dari docs/curriculum/kabar-orang-tua.md (src/kabar-data.js); aturan pesan
// disetujui pemilik 16 Sep 2026: bahasa orang tua, hasil Belum tidak disebut, tanpa jenjang kelas, karakter
// dan English selalu satu baris, kemajuan berupa kotak 12, dan tahap yang dituju dari kelas formal.
import { ORG_NAME, state, passedIndicators, suggestedIndicator, k8ThemeFor, k8SubthemeFor } from './state.js';
import { KABAR } from './kabar-data.js';

const phraseOf = (level, number) =>
  KABAR.indicators.find(i => i.level === Number(level) && i.number === number);

// Tahap yang dituju menurut kelas formal (disetujui sementara sampai kurikulum kelas 2–6 ada).
export function targetLevel(grade) {
  if (grade === 'Belum sekolah' || grade === 'TK A') return 2;
  if (grade === 'TK B') return 4;
  if (/^SD /.test(grade || '')) return 8;
  return null;
}

// Variasi kalimat umum bergantian per anak dan pertemuan, tetap sama bila pesan dibuka ulang.
const pick = (list, seed) => list[seed % list.length];
const seedOf = (id, meeting) => [...String(id)].reduce((a, ch) => a + ch.charCodeAt(0), meeting);

export const progressBar = passed => '🟩'.repeat(passed) + '⬜'.repeat(12 - passed);

// Nomor WhatsApp untuk wa.me: 08… → 628…, +62… → 62…; kosong bila tidak masuk akal.
export function waNumber(phone) {
  let digits = String(phone || '').replace(/\D/g, '');
  if (digits.startsWith('0')) digits = '62' + digits.slice(1);
  else if (digits.startsWith('8')) digits = '62' + digits;
  return /^62\d{8,13}$/.test(digits) ? digits : '';
}

function companionLine(emoji, s, row, number, nama) {
  const level = row.level;
  const phrase = phraseOf(level, number);
  if (!phrase) return '';
  const today = (number === 13 ? row.english_result : row.character_result) === 'lulus';
  if (today) return `${emoji} Alhamdulillah, ${nama} berhasil ${phrase.berhasil}!`;
  if (passedIndicators(s.id, level).includes(number))
    return number === 13
      ? `${emoji} ${nama} sudah bisa ${phrase.berhasil}. Coba sapa dengan English di rumah ya!`
      : `${emoji} ${nama} sudah terbiasa ${phrase.berhasil}. Terus dijaga di rumah ya!`;
  return number === 13
    ? `${emoji} English yang sedang ${nama} kenal: ${phrase.berikutnya}.`
    : `${emoji} Kebiasaan baik yang sedang ${nama} latih: ${phrase.berikutnya}.`;
}

function progressLines(s, nama) {
  const level = Number(s.pilot_level);
  const passed = passedIndicators(s.id, level).filter(n => n <= 12).length;
  if (passed === 12 && level === 8)
    return [`🏆 ${nama} sudah menuntaskan kedelapan tahap belajar di ${ORG_NAME}!`];
  if (passed === 12)
    return [
      `🌟 ${nama} sudah menguasai semua 12 kemampuan di tahap ${level}! Guru akan segera mengajak ${nama} naik ke tahap berikutnya.`
    ];
  const target = targetLevel(s.school_grade);
  const left = 12 - passed;
  const head =
    target && level > target
      ? `🎉 ${nama} sudah melewati tahap yang kita tuju! Kemajuan di tahap ${level}:`
      : target === level
        ? `📈 Kemajuan ${nama} di tahap ${level}, tahap yang kita tuju bersama:`
        : `📈 Kemajuan ${nama} di tahap ${level}:`;
  const tail =
    target === level
      ? `Tinggal ${left} kemampuan lagi!`
      : target && level + 1 === target
        ? `Tinggal ${left} kemampuan lagi untuk naik ke tahap ${level + 1} — tahap yang kita tuju bersama!`
        : target && level < target
          ? `Tinggal ${left} kemampuan lagi untuk naik ke tahap ${level + 1}. Tahap yang kita tuju: tahap ${target}.`
          : `Tinggal ${left} kemampuan lagi untuk naik ke tahap ${level + 1}.`;
  return [head, progressBar(passed), tail];
}

export function parentMessage(scheduleId, studentId) {
  const c = state.classSchedules.find(x => x.id === scheduleId);
  const s = state.students.find(x => x.id === studentId);
  const row = state.classScheduleStudents.find(
    x => x.schedule_id === scheduleId && x.student_id === studentId
  );
  if (!c || !s || !row || !s.pilot_level) return '';
  const nama = s.nickname || s.name.split(' ')[0];
  const sapaan = s.parent_name || 'Ayah/Bunda';
  const seed = seedOf(s.id, c.meeting_number);
  const fill = t => t.split('{panggilan}').join(nama).split('{sapaan}').join(sapaan);
  const theme = k8ThemeFor(c.meeting_number);
  const lines = [`Assalamu'alaikum ${sapaan} 😊`, ''];
  lines.push(
    theme ? `Hari ini ${nama} belajar di tema "${theme.name}".` : `Kabar belajar ${nama} hari ini.`,
    ''
  );

  const today = row.indicator_number ? phraseOf(row.level, row.indicator_number) : null;
  if (today)
    lines.push(
      row.result === 'lulus'
        ? `✨ Alhamdulillah, ${nama} berhasil ${today.berhasil}!`
        : `✏️ ${nama} sedang berlatih ${today.berlatih}. ${fill(pick(KABAR.penyemangat, seed))}`
    );
  lines.push(companionLine('🤝', s, row, 14, nama), companionLine('🔤', s, row, 13, nama));

  const next = suggestedIndicator(s);
  const nextPhrase = next ? phraseOf(s.pilot_level, next) : null;
  if (nextPhrase) {
    const retry = Number(s.pilot_level) === row.level && next === row.indicator_number;
    const sub = k8SubthemeFor(c.meeting_number + 1);
    const kait = sub && KABAR.themes.find(t => t.subtema === sub.name)?.kait;
    lines.push(
      '',
      retry
        ? `🔜 Pertemuan berikutnya ${nama} mencoba lagi. ${fill(pick(KABAR.penyemangatUlang, seed))} Jangan sampai terlewat ya!`
        : `🔜 Pertemuan berikutnya ${nama} mulai ${nextPhrase.berikutnya}${kait ? `, ${kait}` : ''}. Jangan sampai terlewat ya!`
    );
    if (nextPhrase.rumah) lines.push('', `🏠 Latihan kecil di rumah: ${fill(nextPhrase.rumah)}`);
  }
  lines.push('', ...progressLines(s, nama), '', fill(pick(KABAR.penutup, seed)), ORG_NAME);
  return lines.filter((l, i, all) => l !== '' || (all[i - 1] !== '' && i > 0)).join('\n');
}

// Tautan wa.me berisi pesan; kosong bila nomor orang tua belum ada atau tidak sah.
export function parentWhatsappLink(scheduleId, studentId) {
  const s = state.students.find(x => x.id === studentId);
  const number = waNumber(s?.phone);
  const text = parentMessage(scheduleId, studentId);
  return number && text ? `https://wa.me/${number}?text=${encodeURIComponent(text)}` : '';
}
