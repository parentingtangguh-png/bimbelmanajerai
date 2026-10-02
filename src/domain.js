export function escapeHtml(value = '') {
  return String(value ?? '').replace(
    /[&<>"']/g,
    c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
  );
}
// Pesan galat dari Supabase/browser berbahasa Inggris teknis. Guru memakai HP di kelas, jadi galat
// jaringan diterjemahkan dan selalu menyebutkan bahwa isian di layar belum hilang.
const NETWORK_ERRORS =
  /failed to fetch|networkerror|load failed|fetch failed|network request failed|timeout|err_internet/i;
export function errorText(err) {
  const text = String(err?.message ?? err ?? '').trim();
  if (!text) return 'Gagal menyimpan. Coba ketuk tombol simpan sekali lagi.';
  if (NETWORK_ERRORS.test(text))
    return 'Gagal menyimpan: periksa koneksi internet, lalu ketuk Simpan lagi. Isian di layar ini belum hilang.';
  if (/jwt|token|session|unauthorized|401/i.test(text))
    return 'Sesi login berakhir. Buka ulang aplikasi dan masuk lagi, lalu isi kembali bagian yang belum tersimpan.';
  return text;
}
export function localDate() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date());
}
