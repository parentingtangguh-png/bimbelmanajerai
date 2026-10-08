// Ilustrasi SVG per indikator diagnostik, ditambahkan per level.
// Kunci 'LEVEL:SLOT' → string HTML yang disisipkan di bawah baris Bahan pada kartu.
// Level yang belum ada entrinya mengembalikan string kosong (tidak tampil apa-apa).

const v = {};

// ── Level 1 ──────────────────────────────────────────────────────────────────

// D1 L1: empat garis dasar pramenulis
v['1:D1'] = `<div class="ind-visual">
  <div class="ind-row">
    <figure class="ind-fig">
      <svg viewBox="0 0 32 56" width="28" height="50" aria-hidden="true">
        <line x1="16" y1="6" x2="16" y2="50" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
      <figcaption>Tegak</figcaption>
    </figure>
    <figure class="ind-fig">
      <svg viewBox="0 0 56 32" width="50" height="28" aria-hidden="true">
        <line x1="6" y1="16" x2="50" y2="16" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
      <figcaption>Mendatar</figcaption>
    </figure>
    <figure class="ind-fig">
      <svg viewBox="0 0 40 56" width="34" height="50" aria-hidden="true">
        <line x1="6" y1="50" x2="34" y2="6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
      <figcaption>Miring naik<br>ke kanan</figcaption>
    </figure>
    <figure class="ind-fig">
      <svg viewBox="0 0 40 56" width="34" height="50" aria-hidden="true">
        <path d="M 32 6 Q 4 28 32 50" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
      <figcaption>Lengkung terbuka<br>ke kanan</figcaption>
    </figure>
  </div>
</div>`;

// C1 L1: empat kartu baris vokal untuk tes arah baca kiri→kanan
v['1:C1'] = `<div class="ind-visual">
  <div class="ind-row ind-row--wrap">
    <div class="ind-vowel">a i u</div>
    <div class="ind-vowel">e a o</div>
    <div class="ind-vowel">u e i</div>
    <div class="ind-vowel">o i a</div>
  </div>
  <p class="ind-note">Satu kartu per giliran, tiap kali di posisi berbeda.</p>
</div>`;

// E2 L1: empat kumpulan benda — susunan R (baris renggang), tengah, M (melengkung), S (sebaran rapat)
v['1:E2'] = `<div class="ind-visual">
  <div class="ind-grid">
    <figure class="ind-fig">
      <svg viewBox="0 0 80 36" width="76" height="34" aria-hidden="true">
        <circle cx="16" cy="18" r="7" fill="currentColor"/>
        <circle cx="64" cy="18" r="7" fill="currentColor"/>
      </svg>
      <figcaption>2 benda · baris renggang</figcaption>
    </figure>
    <figure class="ind-fig">
      <svg viewBox="0 0 80 36" width="76" height="34" aria-hidden="true">
        <circle cx="40" cy="18" r="7" fill="currentColor"/>
      </svg>
      <figcaption>1 benda · di tengah</figcaption>
    </figure>
    <figure class="ind-fig">
      <svg viewBox="0 0 80 46" width="76" height="44" aria-hidden="true">
        <circle cx="12" cy="36" r="7" fill="currentColor"/>
        <circle cx="40" cy="12" r="7" fill="currentColor"/>
        <circle cx="68" cy="36" r="7" fill="currentColor"/>
      </svg>
      <figcaption>3 benda · baris melengkung</figcaption>
    </figure>
    <figure class="ind-fig">
      <svg viewBox="0 0 80 36" width="76" height="34" aria-hidden="true">
        <circle cx="24" cy="12" r="7" fill="currentColor"/>
        <circle cx="54" cy="26" r="7" fill="currentColor"/>
      </svg>
      <figcaption>2 benda · sebaran rapat</figcaption>
    </figure>
  </div>
</div>`;

// C2 L1: susunan enam nama dua baris tiga kolom
v['1:C2'] = `<div class="ind-visual">
  <table class="ind-names">
    <tbody>
      <tr><td>Dita</td><td>Rudi</td><td class="ind-names-target">Rani ★</td></tr>
      <tr><td>Bima</td><td>Romi</td><td>Sela</td></tr>
    </tbody>
  </table>
  <p class="ind-note">Contoh sasaran "Rani" (★). Susunan dan pengecoh disesuaikan nama anak yang dites.</p>
</div>`;

export function indicatorVisual(level, slot) {
  return v[`${level}:${slot}`] || '';
}
