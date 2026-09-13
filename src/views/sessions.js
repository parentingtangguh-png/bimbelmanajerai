// Ruang kelas: dibangun ulang dari rancangan pertemuan pilot (tema, lembar aktivitas, tugas per level,
// checklist karakter). Sampai itu siap, layar ini hanya memberi tahu keadaannya.
import { heading, empty } from '../ui.js';

export function sessionsView() {
  return `${heading('RUANG KELAS', 'Sedang disiapkan.', '')}${empty(
    'Ruang kelas pilot sedang disiapkan',
    'Sesi kelas akan mengikuti tema, lembar aktivitas, dan tugas per level dari kurikulum pilot. Sementara itu, tambahkan siswa dan jalankan Tes Diagnostik di menu Data siswa.'
  )}<div class="button-row"><button class="secondary" data-view="students">Buka Data siswa →</button></div>`;
}
