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

// B1 L1: deret lima grafem vokal — guru tunjukkan ke anak, anak menunjuk per bunyi yang disebut
v['1:B1'] = `<div class="ind-visual">
  <div class="ind-col">
    <figure class="ind-fig">
      <div class="ind-grafem-row">
        <span class="ind-grafem-card ind-grafem-card--target">o</span>
        <span class="ind-grafem-card ind-grafem-card--target">a</span>
        <span class="ind-grafem-card ind-grafem-card--target">u</span>
        <span class="ind-grafem-card ind-grafem-card--target">e</span>
        <span class="ind-grafem-card ind-grafem-card--target">i</span>
      </div>
      <figcaption>Deret 5 vokal · semua adalah sasaran · anak menunjuk satu per bunyi yang disebut guru</figcaption>
    </figure>
  </div>
</div>`;

// F2 L1: prosedur empat langkah — penjumlahan tersembunyi di balik penutup
v['1:F2'] = `<div class="ind-visual">
  <div class="ind-row">
    <figure class="ind-fig">
      <svg viewBox="0 0 56 56" width="52" height="52" aria-hidden="true">
        <circle cx="28" cy="36" r="12" fill="currentColor"/>
      </svg>
      <figcaption>① Perlihatkan<br>&amp; sebut jumlah</figcaption>
    </figure>
    <figure class="ind-fig">
      <svg viewBox="0 0 56 56" width="52" height="52" aria-hidden="true">
        <circle cx="28" cy="38" r="12" fill="currentColor" opacity="0.2"/>
        <rect x="4" y="18" width="48" height="26" rx="4" fill="none" stroke="currentColor" stroke-width="2.5"/>
      </svg>
      <figcaption>② Tutup<br>dengan penutup</figcaption>
    </figure>
    <figure class="ind-fig">
      <svg viewBox="0 0 56 66" width="52" height="60" aria-hidden="true">
        <rect x="4" y="8" width="48" height="26" rx="4" fill="none" stroke="currentColor" stroke-width="2.5"/>
        <circle cx="28" cy="52" r="9" fill="currentColor"/>
        <polyline points="22,46 28,38 34,46" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <figcaption>③ Masukkan 1<br>dari bawah penutup</figcaption>
    </figure>
    <figure class="ind-fig">
      <svg viewBox="0 0 56 56" width="52" height="52" aria-hidden="true">
        <rect x="4" y="10" width="48" height="32" rx="4" fill="none" stroke="currentColor" stroke-width="2.5"/>
        <text x="28" y="34" text-anchor="middle" font-size="22" fill="currentColor">?</text>
      </svg>
      <figcaption>④ Tanya —<br>jangan buka penutup</figcaption>
    </figure>
  </div>
  <p class="ind-note">Buka penutup hanya setelah jawaban anak dicatat.</p>
</div>`;

// F1 L1: dua set bahan — Set 1 warna (2 merah + 2 biru), Set 2 ukuran (2 besar + 2 kecil)
v['1:F1'] = `<div class="ind-visual">
  <div class="ind-row">
    <figure class="ind-fig">
      <svg viewBox="0 0 86 64" width="82" height="60" aria-hidden="true">
        <rect x="2" y="4" width="30" height="18" rx="2" fill="#c0392b"/>
        <rect x="54" y="4" width="30" height="18" rx="2" fill="#2980b9"/>
        <rect x="20" y="38" width="30" height="18" rx="2" fill="#2980b9"/>
        <rect x="54" y="38" width="30" height="18" rx="2" fill="#c0392b"/>
      </svg>
      <figcaption>Set 1 · 2 merah + 2 biru<br>sama bentuk &amp; ukuran</figcaption>
    </figure>
    <figure class="ind-fig">
      <svg viewBox="0 0 86 64" width="82" height="60" aria-hidden="true">
        <rect x="2" y="6" width="36" height="22" rx="2" fill="currentColor"/>
        <rect x="48" y="14" width="20" height="12" rx="2" fill="currentColor"/>
        <rect x="2" y="38" width="20" height="12" rx="2" fill="currentColor"/>
        <rect x="36" y="34" width="36" height="22" rx="2" fill="currentColor"/>
      </svg>
      <figcaption>Set 2 · 2 besar + 2 kecil<br>sama bentuk &amp; warna</figcaption>
    </figure>
  </div>
  <p class="ind-note">Berikan semua 4 potongan sekaligus — anak menyusun sendiri menjadi dua kelompok.</p>
</div>`;

// D2 L1: empat bentuk yang diterima sebagai tanda lulus — tanpa model, dari instruksi lisan
v['1:D2'] = `<div class="ind-visual">
  <div class="ind-row">
    <figure class="ind-fig">
      <svg viewBox="0 0 32 56" width="28" height="50" aria-hidden="true">
        <line x1="16" y1="6" x2="16" y2="50" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
      <figcaption>Tegak<br>atas–bawah</figcaption>
    </figure>
    <figure class="ind-fig">
      <svg viewBox="0 0 56 32" width="50" height="28" aria-hidden="true">
        <line x1="6" y1="16" x2="50" y2="16" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
      <figcaption>Mendatar<br>kiri–kanan</figcaption>
    </figure>
    <figure class="ind-fig">
      <svg viewBox="0 0 40 56" width="34" height="50" aria-hidden="true">
        <line x1="6" y1="50" x2="34" y2="6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
      <figcaption>Miring<br>diagonal jelas</figcaption>
    </figure>
    <figure class="ind-fig">
      <svg viewBox="0 0 48 48" width="44" height="44" aria-hidden="true">
        <ellipse cx="24" cy="24" rx="20" ry="15" fill="none" stroke="currentColor" stroke-width="2.5"/>
      </svg>
      <figcaption>Lingkaran<br>boleh oval</figcaption>
    </figure>
  </div>
  <p class="ind-note">Tanpa model — instruksi lisan saja. Sedikit goyangan diterima.</p>
</div>`;

// ── Level 2 ──────────────────────────────────────────────────────────────────

// D1 L2: empat bentuk pramenulis — silang, lingkaran, siku, segi empat
v['2:D1'] = `<div class="ind-visual">
  <div class="ind-row">
    <figure class="ind-fig">
      <svg viewBox="0 0 40 40" width="36" height="36" aria-hidden="true">
        <line x1="8" y1="8" x2="32" y2="32" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="32" y1="8" x2="8" y2="32" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
      <figcaption>Silang</figcaption>
    </figure>
    <figure class="ind-fig">
      <svg viewBox="0 0 40 40" width="36" height="36" aria-hidden="true">
        <circle cx="20" cy="20" r="14" fill="none" stroke="currentColor" stroke-width="2.5"/>
      </svg>
      <figcaption>Lingkaran</figcaption>
    </figure>
    <figure class="ind-fig">
      <svg viewBox="0 0 40 40" width="36" height="36" aria-hidden="true">
        <polyline points="8,32 8,8 32,8" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <figcaption>Siku</figcaption>
    </figure>
    <figure class="ind-fig">
      <svg viewBox="0 0 40 40" width="36" height="36" aria-hidden="true">
        <rect x="8" y="8" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>
      </svg>
      <figcaption>Segi empat</figcaption>
    </figure>
  </div>
</div>`;

// C1 L2: empat susunan huruf/angka/gambar — tunjuk yang berupa tulisan huruf
v['2:C1'] = `<div class="ind-visual">
  <div class="ind-grid">
    <figure class="ind-fig">
      <div class="ind-trio"><span class="ind-trio-target">aoi</span><span>314</span><span class="ind-trio-shape">△</span></div>
      <figcaption>Kunci: <strong>aoi</strong> (posisi 1)</figcaption>
    </figure>
    <figure class="ind-fig">
      <div class="ind-trio"><span class="ind-trio-shape">□</span><span class="ind-trio-target">uie</span><span>527</span></div>
      <figcaption>Kunci: <strong>uie</strong> (posisi 2)</figcaption>
    </figure>
    <figure class="ind-fig">
      <div class="ind-trio"><span>682</span><span class="ind-trio-shape">△</span><span class="ind-trio-target">oau</span></div>
      <figcaption>Kunci: <strong>oau</strong> (posisi 3)</figcaption>
    </figure>
    <figure class="ind-fig">
      <div class="ind-trio"><span class="ind-trio-shape">□</span><span class="ind-trio-target">ioa</span><span>935</span></div>
      <figcaption>Kunci: <strong>ioa</strong> (posisi 2)</figcaption>
    </figure>
  </div>
  <p class="ind-note">Emas = tulisan huruf (jawaban). Bentuk geometri diganti goresan nyata saat tes.</p>
</div>`;

// F1 L2: enam butir geometri 4 pilihan — tunjuk bentuk yang disebut
v['2:F1'] = `<div class="ind-visual">
  <div class="ind-grid">
    <figure class="ind-fig">
      <div class="ind-shapes">
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><polygon points="8,1 15,15 1,15" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><rect x="1" y="1" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" class="ind-shape-target"><circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="2"/></svg>
        <svg viewBox="0 0 22 14" width="20" height="12" aria-hidden="true"><rect x="1" y="1" width="20" height="12" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
      </div>
      <figcaption>B1: tanya <strong>lingkaran</strong></figcaption>
    </figure>
    <figure class="ind-fig">
      <div class="ind-shapes">
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
        <svg viewBox="0 0 22 14" width="20" height="12" aria-hidden="true"><rect x="1" y="1" width="20" height="12" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><polygon points="8,1 15,15 1,15" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" class="ind-shape-target"><rect x="1" y="1" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" transform="rotate(20,8,8)"/></svg>
      </div>
      <figcaption>B2: tanya <strong>persegi</strong></figcaption>
    </figure>
    <figure class="ind-fig">
      <div class="ind-shapes">
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><rect x="1" y="1" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
        <svg viewBox="0 0 22 14" width="20" height="12" aria-hidden="true" class="ind-shape-target"><rect x="1" y="1" width="20" height="12" fill="none" stroke="currentColor" stroke-width="2"/></svg>
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><polygon points="8,1 15,15 1,15" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
      </div>
      <figcaption>B3: tanya <strong>persegi panjang</strong></figcaption>
    </figure>
    <figure class="ind-fig">
      <div class="ind-shapes">
        <svg viewBox="0 0 22 14" width="20" height="12" aria-hidden="true"><rect x="1" y="1" width="20" height="12" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" class="ind-shape-target"><polygon points="8,1 15,15 1,15" fill="none" stroke="currentColor" stroke-width="2"/></svg>
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><rect x="1" y="1" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
      </div>
      <figcaption>B4: tanya <strong>segitiga</strong></figcaption>
    </figure>
    <figure class="ind-fig">
      <div class="ind-shapes">
        <svg viewBox="0 0 22 14" width="20" height="12" aria-hidden="true"><rect x="1" y="1" width="20" height="12" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" class="ind-shape-target"><rect x="1" y="1" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"/></svg>
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><polygon points="8,1 15,15 1,15" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
      </div>
      <figcaption>B5: tanya <strong>persegi</strong></figcaption>
    </figure>
    <figure class="ind-fig">
      <div class="ind-shapes">
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><polygon points="8,1 15,15 1,15" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
        <svg viewBox="0 0 22 14" width="20" height="12" aria-hidden="true" class="ind-shape-target"><rect x="1" y="1" width="20" height="12" fill="none" stroke="currentColor" stroke-width="2"/></svg>
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><rect x="1" y="1" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
      </div>
      <figcaption>B6: tanya <strong>persegi panjang</strong></figcaption>
    </figure>
  </div>
  <p class="ind-note">Emas = jawaban benar. Kunci posisi: 3; 4; 3; 2; 3; 2.</p>
</div>`;

// B1 L2: deret lima grafem konsonan + pengecoh vokal — guru tunjukkan ke anak
v['2:B1'] = `<div class="ind-visual">
  <div class="ind-col">
    <figure class="ind-fig">
      <div class="ind-grafem-row">
        <span class="ind-grafem-card ind-grafem-card--target">p</span>
        <span class="ind-grafem-card ind-grafem-card--target">m</span>
        <span class="ind-grafem-card">a</span>
        <span class="ind-grafem-card ind-grafem-card--target">b</span>
        <span class="ind-grafem-card ind-grafem-card--target">n</span>
      </div>
      <figcaption>Deret 5 grafem · <strong>a</strong> = pengecoh vokal · anak menunjuk satu per bunyi yang disebut guru</figcaption>
    </figure>
  </div>
</div>`;

// E1 L2: deret lima angka 1–5 — guru tunjukkan ke anak, anak menunjuk angka yang disebut
v['2:E1'] = `<div class="ind-visual">
  <div class="ind-col">
    <figure class="ind-fig">
      <div class="ind-grafem-row">
        <span class="ind-grafem-card ind-grafem-card--target">3</span>
        <span class="ind-grafem-card ind-grafem-card--target">1</span>
        <span class="ind-grafem-card ind-grafem-card--target">5</span>
        <span class="ind-grafem-card ind-grafem-card--target">2</span>
        <span class="ind-grafem-card ind-grafem-card--target">4</span>
      </div>
      <figcaption>Deret tetap terlihat sepanjang tes · anak menunjuk angka yang disebut guru</figcaption>
    </figure>
  </div>
</div>`;

// C2 L2: tata letak 3 kartu tulisan (atas) + 5 benda sasaran & pengecoh (bawah)
v['2:C2'] = `<div class="ind-visual">
  <div class="ind-col">
    <figure class="ind-fig">
      <div class="ind-grafem-row">
        <span class="ind-grafem-card ind-grafem-card--target">lap</span>
        <span class="ind-grafem-card ind-grafem-card--target">air</span>
        <span class="ind-grafem-card ind-grafem-card--target">roti</span>
      </div>
      <figcaption>3 kartu tulisan ditampilkan satu per satu ke tempat netral</figcaption>
    </figure>
    <figure class="ind-fig" style="margin-top:8px">
      <div class="ind-grafem-row">
        <span class="ind-grafem-card ind-grafem-card--target" style="font-size:0.7em">kain lap</span>
        <span class="ind-grafem-card ind-grafem-card--target" style="font-size:0.7em">wadah air</span>
        <span class="ind-grafem-card ind-grafem-card--target" style="font-size:0.7em">roti</span>
        <span class="ind-grafem-card" style="font-size:0.7em">sendok</span>
        <span class="ind-grafem-card" style="font-size:0.7em">topi</span>
      </div>
      <figcaption>5 benda di meja · emas = sasaran · abu = pengecoh tanpa tulisan</figcaption>
    </figure>
  </div>
  <p class="ind-note">Benda tetap di meja sepanjang tes. Posisi benda diacak sebelum tes dimulai.</p>
</div>`;

// ── Level 3 ──────────────────────────────────────────────────────────────────

// B1 L3: deret enam grafem (5 target + pengecoh m dari L2) — guru tunjukkan ke anak
v['3:B1'] = `<div class="ind-visual">
  <div class="ind-col">
    <figure class="ind-fig">
      <div class="ind-grafem-row">
        <span class="ind-grafem-card ind-grafem-card--target">k</span>
        <span class="ind-grafem-card ind-grafem-card--target">d</span>
        <span class="ind-grafem-card ind-grafem-card--target">s</span>
        <span class="ind-grafem-card">m</span>
        <span class="ind-grafem-card ind-grafem-card--target">l</span>
        <span class="ind-grafem-card ind-grafem-card--target">t</span>
      </div>
      <figcaption>Deret 6 grafem · <strong>m</strong> = pengecoh dari L2 · anak menunjuk satu per bunyi yang disebut guru</figcaption>
    </figure>
  </div>
</div>`;

// E1 L3: deret enam angka 6–10 + pengecoh 4 dari L1–2 — guru tunjukkan ke anak
v['3:E1'] = `<div class="ind-visual">
  <div class="ind-col">
    <figure class="ind-fig">
      <div class="ind-grafem-row">
        <span class="ind-grafem-card ind-grafem-card--target">9</span>
        <span class="ind-grafem-card ind-grafem-card--target">6</span>
        <span class="ind-grafem-card">4</span>
        <span class="ind-grafem-card ind-grafem-card--target">10</span>
        <span class="ind-grafem-card ind-grafem-card--target">7</span>
        <span class="ind-grafem-card ind-grafem-card--target">8</span>
      </div>
      <figcaption>Deret tetap terlihat sepanjang tes · <strong>4</strong> = pengecoh · anak menunjuk angka yang disebut guru</figcaption>
    </figure>
  </div>
</div>`;

// E2 L3: lima kumpulan benda 6–10 dengan susunan R/M/S (8-R, 6-S, 10-M, 7-S, 9-R)
v['3:E2'] = `<div class="ind-visual">
  <div class="ind-grid ind-grid--3">
    <figure class="ind-fig">
      <svg viewBox="0 0 148 22" width="140" height="20" aria-hidden="true">
        <circle cx="9"  cy="11" r="7" fill="currentColor"/>
        <circle cx="29" cy="11" r="7" fill="currentColor"/>
        <circle cx="49" cy="11" r="7" fill="currentColor"/>
        <circle cx="69" cy="11" r="7" fill="currentColor"/>
        <circle cx="89" cy="11" r="7" fill="currentColor"/>
        <circle cx="109" cy="11" r="7" fill="currentColor"/>
        <circle cx="129" cy="11" r="7" fill="currentColor"/>
        <circle cx="149" cy="11" r="7" fill="currentColor"/>
      </svg>
      <figcaption>8 benda · baris renggang</figcaption>
    </figure>
    <figure class="ind-fig">
      <svg viewBox="0 0 80 56" width="76" height="54" aria-hidden="true">
        <circle cx="18" cy="10" r="7" fill="currentColor"/>
        <circle cx="62" cy="10" r="7" fill="currentColor"/>
        <circle cx="10" cy="32" r="7" fill="currentColor"/>
        <circle cx="40" cy="32" r="7" fill="currentColor"/>
        <circle cx="70" cy="32" r="7" fill="currentColor"/>
        <circle cx="28" cy="50" r="7" fill="currentColor"/>
      </svg>
      <figcaption>6 benda · sebaran rapat</figcaption>
    </figure>
    <figure class="ind-fig">
      <svg viewBox="0 0 100 54" width="96" height="52" aria-hidden="true">
        <circle cx="9"  cy="46" r="7" fill="currentColor"/>
        <circle cx="23" cy="26" r="7" fill="currentColor"/>
        <circle cx="38" cy="12" r="7" fill="currentColor"/>
        <circle cx="55" cy="7"  r="7" fill="currentColor"/>
        <circle cx="72" cy="12" r="7" fill="currentColor"/>
        <circle cx="87" cy="26" r="7" fill="currentColor"/>
        <circle cx="91" cy="46" r="7" fill="currentColor"/>
        <circle cx="70" cy="46" r="7" fill="currentColor"/>
        <circle cx="50" cy="46" r="7" fill="currentColor"/>
        <circle cx="30" cy="46" r="7" fill="currentColor"/>
      </svg>
      <figcaption>10 benda · baris melengkung</figcaption>
    </figure>
    <figure class="ind-fig">
      <svg viewBox="0 0 80 56" width="76" height="54" aria-hidden="true">
        <circle cx="12" cy="10" r="7" fill="currentColor"/>
        <circle cx="40" cy="10" r="7" fill="currentColor"/>
        <circle cx="68" cy="10" r="7" fill="currentColor"/>
        <circle cx="22" cy="32" r="7" fill="currentColor"/>
        <circle cx="58" cy="32" r="7" fill="currentColor"/>
        <circle cx="40" cy="50" r="7" fill="currentColor"/>
        <circle cx="10" cy="50" r="7" fill="currentColor"/>
      </svg>
      <figcaption>7 benda · sebaran rapat</figcaption>
    </figure>
    <figure class="ind-fig">
      <svg viewBox="0 0 165 22" width="157" height="20" aria-hidden="true">
        <circle cx="9"   cy="11" r="7" fill="currentColor"/>
        <circle cx="27"  cy="11" r="7" fill="currentColor"/>
        <circle cx="46"  cy="11" r="7" fill="currentColor"/>
        <circle cx="65"  cy="11" r="7" fill="currentColor"/>
        <circle cx="84"  cy="11" r="7" fill="currentColor"/>
        <circle cx="103" cy="11" r="7" fill="currentColor"/>
        <circle cx="122" cy="11" r="7" fill="currentColor"/>
        <circle cx="141" cy="11" r="7" fill="currentColor"/>
        <circle cx="157" cy="11" r="7" fill="currentColor"/>
      </svg>
      <figcaption>9 benda · baris renggang</figcaption>
    </figure>
  </div>
  <p class="ind-note">Urutan penyajian bebas. Kunci: 8; 6; 10; 7; 9. Anak boleh menata ulang sendiri.</p>
</div>`;

// F1 L3: empat deret pola AB — dua balok lanjutan
v['3:F1'] = `<div class="ind-visual">
  <div class="ind-col">
    <figure class="ind-fig ind-fig--row">
      <div class="ind-pola">
        <span class="ind-blok ind-blok--merah"></span><span class="ind-blok ind-blok--biru"></span>
        <span class="ind-blok ind-blok--merah"></span><span class="ind-blok ind-blok--biru"></span>
        <span class="ind-blok ind-blok--merah"></span><span class="ind-blok ind-blok--biru"></span>
        <span class="ind-blok-gap"></span>
        <span class="ind-blok ind-blok--merah ind-blok--lanjut"></span><span class="ind-blok ind-blok--biru ind-blok--lanjut"></span>
      </div>
      <figcaption>merah–biru · lanjut: <strong>merah–biru</strong></figcaption>
    </figure>
    <figure class="ind-fig ind-fig--row">
      <div class="ind-pola">
        <span class="ind-blok ind-blok--kuning"></span><span class="ind-blok ind-blok--hijau"></span>
        <span class="ind-blok ind-blok--kuning"></span><span class="ind-blok ind-blok--hijau"></span>
        <span class="ind-blok ind-blok--kuning"></span><span class="ind-blok ind-blok--hijau"></span>
        <span class="ind-blok-gap"></span>
        <span class="ind-blok ind-blok--kuning ind-blok--lanjut"></span><span class="ind-blok ind-blok--hijau ind-blok--lanjut"></span>
      </div>
      <figcaption>kuning–hijau · lanjut: <strong>kuning–hijau</strong></figcaption>
    </figure>
    <figure class="ind-fig ind-fig--row">
      <div class="ind-pola">
        <span class="ind-blok ind-blok--putih"></span><span class="ind-blok ind-blok--hitam"></span>
        <span class="ind-blok ind-blok--putih"></span><span class="ind-blok ind-blok--hitam"></span>
        <span class="ind-blok ind-blok--putih"></span><span class="ind-blok ind-blok--hitam"></span>
        <span class="ind-blok-gap"></span>
        <span class="ind-blok ind-blok--putih ind-blok--lanjut"></span><span class="ind-blok ind-blok--hitam ind-blok--lanjut"></span>
      </div>
      <figcaption>putih–hitam · lanjut: <strong>putih–hitam</strong></figcaption>
    </figure>
    <figure class="ind-fig ind-fig--row">
      <div class="ind-pola">
        <span class="ind-blok ind-blok--merah"></span><span class="ind-blok ind-blok--kuning"></span>
        <span class="ind-blok ind-blok--merah"></span><span class="ind-blok ind-blok--kuning"></span>
        <span class="ind-blok ind-blok--merah"></span><span class="ind-blok ind-blok--kuning"></span>
        <span class="ind-blok-gap"></span>
        <span class="ind-blok ind-blok--merah ind-blok--lanjut"></span><span class="ind-blok ind-blok--kuning ind-blok--lanjut"></span>
      </div>
      <figcaption>merah–kuning · lanjut: <strong>merah–kuning</strong></figcaption>
    </figure>
  </div>
  <p class="ind-note">Tiga unit ditata guru, anak meletakkan 2 balok lanjutan (kotak putus-putus).</p>
</div>`;

// ── Level 4 ──────────────────────────────────────────────────────────────────

// F1 L4: empat deret pola ABC balok warna, 3 unit (9 balok) + 3 balok lanjutan putus-putus
v['4:F1'] = `<div class="ind-visual">
  <div class="ind-col">
    <figure class="ind-fig ind-fig--row">
      <div class="ind-pola ind-pola--abc">
        <span class="ind-blok ind-blok--merah"></span><span class="ind-blok ind-blok--biru"></span><span class="ind-blok ind-blok--hijau"></span>
        <span class="ind-blok ind-blok--merah"></span><span class="ind-blok ind-blok--biru"></span><span class="ind-blok ind-blok--hijau"></span>
        <span class="ind-blok ind-blok--merah"></span><span class="ind-blok ind-blok--biru"></span><span class="ind-blok ind-blok--hijau"></span>
        <span class="ind-blok-gap"></span>
        <span class="ind-blok ind-blok--merah ind-blok--lanjut"></span><span class="ind-blok ind-blok--biru ind-blok--lanjut"></span><span class="ind-blok ind-blok--hijau ind-blok--lanjut"></span>
      </div>
      <figcaption>merah–biru–hijau · lanjut: <strong>merah–biru–hijau</strong></figcaption>
    </figure>
    <figure class="ind-fig ind-fig--row">
      <div class="ind-pola ind-pola--abc">
        <span class="ind-blok ind-blok--kuning"></span><span class="ind-blok ind-blok--putih"></span><span class="ind-blok ind-blok--hitam"></span>
        <span class="ind-blok ind-blok--kuning"></span><span class="ind-blok ind-blok--putih"></span><span class="ind-blok ind-blok--hitam"></span>
        <span class="ind-blok ind-blok--kuning"></span><span class="ind-blok ind-blok--putih"></span><span class="ind-blok ind-blok--hitam"></span>
        <span class="ind-blok-gap"></span>
        <span class="ind-blok ind-blok--kuning ind-blok--lanjut"></span><span class="ind-blok ind-blok--putih ind-blok--lanjut"></span><span class="ind-blok ind-blok--hitam ind-blok--lanjut"></span>
      </div>
      <figcaption>kuning–putih–hitam · lanjut: <strong>kuning–putih–hitam</strong></figcaption>
    </figure>
    <figure class="ind-fig ind-fig--row">
      <div class="ind-pola ind-pola--abc">
        <span class="ind-blok ind-blok--biru"></span><span class="ind-blok ind-blok--merah"></span><span class="ind-blok ind-blok--kuning"></span>
        <span class="ind-blok ind-blok--biru"></span><span class="ind-blok ind-blok--merah"></span><span class="ind-blok ind-blok--kuning"></span>
        <span class="ind-blok ind-blok--biru"></span><span class="ind-blok ind-blok--merah"></span><span class="ind-blok ind-blok--kuning"></span>
        <span class="ind-blok-gap"></span>
        <span class="ind-blok ind-blok--biru ind-blok--lanjut"></span><span class="ind-blok ind-blok--merah ind-blok--lanjut"></span><span class="ind-blok ind-blok--kuning ind-blok--lanjut"></span>
      </div>
      <figcaption>biru–merah–kuning · lanjut: <strong>biru–merah–kuning</strong></figcaption>
    </figure>
    <figure class="ind-fig ind-fig--row">
      <div class="ind-pola ind-pola--abc">
        <span class="ind-blok ind-blok--hijau"></span><span class="ind-blok ind-blok--putih"></span><span class="ind-blok ind-blok--merah"></span>
        <span class="ind-blok ind-blok--hijau"></span><span class="ind-blok ind-blok--putih"></span><span class="ind-blok ind-blok--merah"></span>
        <span class="ind-blok ind-blok--hijau"></span><span class="ind-blok ind-blok--putih"></span><span class="ind-blok ind-blok--merah"></span>
        <span class="ind-blok-gap"></span>
        <span class="ind-blok ind-blok--hijau ind-blok--lanjut"></span><span class="ind-blok ind-blok--putih ind-blok--lanjut"></span><span class="ind-blok ind-blok--merah ind-blok--lanjut"></span>
      </div>
      <figcaption>hijau–putih–merah · lanjut: <strong>hijau–putih–merah</strong></figcaption>
    </figure>
  </div>
  <p class="ind-note">Tiga unit ditata guru, anak meletakkan 3 balok lanjutan (kotak putus-putus).</p>
</div>`;

// ── Level 5 ──────────────────────────────────────────────────────────────────

// B1 L5: deret tujuh grafem jarang x f w q v y z — semua ditanyakan; f diulang dalam sebutan
v['5:B1'] = `<div class="ind-visual">
  <div class="ind-col">
    <figure class="ind-fig">
      <div class="ind-grafem-row">
        <span class="ind-grafem-card ind-grafem-card--target">x</span>
        <span class="ind-grafem-card ind-grafem-card--target">f</span>
        <span class="ind-grafem-card ind-grafem-card--target">w</span>
        <span class="ind-grafem-card ind-grafem-card--target">q</span>
        <span class="ind-grafem-card ind-grafem-card--target">v</span>
        <span class="ind-grafem-card ind-grafem-card--target">y</span>
        <span class="ind-grafem-card ind-grafem-card--target">z</span>
      </div>
      <figcaption>Deret 7 grafem · semua ditanyakan · <strong>f</strong> diulang dalam urutan sebutan · anak menunjuk satu per bunyi yang disebut guru</figcaption>
    </figure>
  </div>
</div>`;

// E1 L5: grid 4×3 angka 11–20 dengan pengecoh 9 dan 10
v['5:E1'] = `<div class="ind-visual">
  <div class="ind-col">
    <figure class="ind-fig">
      <div class="ind-grid-num">
        <span>17</span><span>12</span><span>20</span><span>15</span>
        <span>11</span><span class="ind-num--decoy">9</span><span>18</span><span>13</span>
        <span>16</span><span>19</span><span class="ind-num--decoy">10</span><span>14</span>
      </div>
      <figcaption>Baris 1–3 · <span class="ind-num--decoy">9</span> dan <span class="ind-num--decoy">10</span> = pengecoh</figcaption>
    </figure>
  </div>
  <p class="ind-note">Guru menyebut: 14 · 20 · 11 · 17 · 13 · 19 · 12 · 16 · 14 · 18 · 15 (11 pertanyaan; 14 diulang).</p>
</div>`;

// F1 L5: empat pasangan stik atas-bawah ujung kiri sejajar, proporsional 8–15 cm
v['5:F1'] = `<div class="ind-visual">
  <div class="ind-col">
    <figure class="ind-fig">
      <div class="ind-panjang-wrap">
        <div class="ind-panjang-pair">
          <div class="ind-panjang-bar" style="width:53%"></div>
          <div class="ind-panjang-bar ind-panjang-bar--jawab" style="width:80%"></div>
          <small class="ind-panjang-label">8 cm · <strong>12 cm ↓</strong></small>
        </div>
        <div class="ind-panjang-pair">
          <div class="ind-panjang-bar ind-panjang-bar--jawab" style="width:93%"></div>
          <div class="ind-panjang-bar" style="width:67%"></div>
          <small class="ind-panjang-label"><strong>14 cm ↑</strong> · 10 cm</small>
        </div>
        <div class="ind-panjang-pair">
          <div class="ind-panjang-bar" style="width:60%"></div>
          <div class="ind-panjang-bar ind-panjang-bar--jawab" style="width:87%"></div>
          <small class="ind-panjang-label">9 cm · <strong>13 cm ↓</strong></small>
        </div>
        <div class="ind-panjang-pair">
          <div class="ind-panjang-bar" style="width:73%"></div>
          <div class="ind-panjang-bar ind-panjang-bar--jawab" style="width:100%"></div>
          <small class="ind-panjang-label">11 cm · <strong>15 cm ↓</strong></small>
        </div>
      </div>
      <figcaption>Ujung kiri sejajar · kunci: <strong>bawah; atas; bawah; bawah</strong></figcaption>
    </figure>
  </div>
  <p class="ind-note">Guru letakkan dua stik atas-bawah, ujung kiri rata. Tanya, "Mana yang lebih panjang?"</p>
</div>`;

// ── Level 6 ──────────────────────────────────────────────────────────────────

// B1 L6: deret 5 kartu huruf (n ny g ng y); guru ucap nga/nya, anak tunjuk ng/ny
v['6:B1'] = `<div class="ind-visual">
  <div class="ind-col">
    <figure class="ind-fig">
      <div class="ind-grafem-row">
        <span class="ind-grafem-card">n</span>
        <span class="ind-grafem-card ind-grafem-card--target">ny</span>
        <span class="ind-grafem-card">g</span>
        <span class="ind-grafem-card ind-grafem-card--target">ng</span>
        <span class="ind-grafem-card">y</span>
      </div>
      <figcaption>Deret 5 kartu · <strong>ng</strong> dan <strong>ny</strong> = sasaran</figcaption>
    </figure>
    <figure class="ind-fig">
      <table class="ind-tabel-kunci">
        <tbody>
          <tr><td class="muted">Guru ucap</td><td>nga</td><td>nya</td><td>nya</td><td>nga</td><td>nya</td><td>nga</td></tr>
          <tr><td class="muted">Kunci tunjuk</td><td><strong>ng</strong></td><td><strong>ny</strong></td><td><strong>ny</strong></td><td><strong>ng</strong></td><td><strong>ny</strong></td><td><strong>ng</strong></td></tr>
        </tbody>
      </table>
    </figure>
  </div>
  <p class="ind-note">Anak hanya menunjuk, tidak diminta mengucapkan. Menunjuk satu huruf penyusun saja (n atau g) tidak mendapat poin.</p>
</div>`;

// E1 L6: enam pasangan angka 0–20, anak tunjuk yang lebih besar
v['6:E1'] = `<div class="ind-visual">
  <div class="ind-col">
    <figure class="ind-fig">
      <div class="ind-pasangan-wrap">
        <div class="ind-pasangan"><span class="muted">14</span><span class="ind-pasangan--jawab">17</span></div>
        <div class="ind-pasangan"><span class="ind-pasangan--jawab">20</span><span class="muted">13</span></div>
        <div class="ind-pasangan"><span class="ind-pasangan--jawab">8</span><span class="muted">6</span></div>
        <div class="ind-pasangan"><span class="muted">18</span><span class="ind-pasangan--jawab">20</span></div>
        <div class="ind-pasangan"><span class="ind-pasangan--jawab">19</span><span class="muted">12</span></div>
        <div class="ind-pasangan"><span class="muted">0</span><span class="ind-pasangan--jawab">5</span></div>
      </div>
      <figcaption>Kunci (emas = lebih besar): <strong>kanan; kiri; kiri; kanan; kiri; kanan</strong></figcaption>
    </figure>
  </div>
  <p class="ind-note">Tampilkan satu pasangan per butir. Anak menunjuk satu lambang tanpa diminta membaca atau menulis tanda.</p>
</div>`;

// F1 L6: tiga set stik diurutkan pendek → panjang (batang proporsional; maks 16 cm = 100%)
v['6:F1'] = `<div class="ind-visual">
  <div class="ind-col">
    <figure class="ind-fig">
      <div class="ind-panjang-wrap">
        <div class="ind-panjang-pair">
          <div class="ind-panjang-bar" style="width:38%"></div>
          <div class="ind-panjang-bar ind-panjang-bar--med" style="width:63%"></div>
          <div class="ind-panjang-bar ind-panjang-bar--jawab" style="width:88%"></div>
          <small class="ind-panjang-label">Set 1: <strong>6 → 10 → 14 cm</strong></small>
        </div>
        <div class="ind-panjang-pair">
          <div class="ind-panjang-bar" style="width:50%"></div>
          <div class="ind-panjang-bar ind-panjang-bar--med" style="width:75%"></div>
          <div class="ind-panjang-bar ind-panjang-bar--jawab" style="width:100%"></div>
          <small class="ind-panjang-label">Set 2: <strong>8 → 12 → 16 cm</strong></small>
        </div>
        <div class="ind-panjang-pair">
          <div class="ind-panjang-bar" style="width:44%"></div>
          <div class="ind-panjang-bar ind-panjang-bar--med" style="width:69%"></div>
          <div class="ind-panjang-bar ind-panjang-bar--jawab" style="width:94%"></div>
          <small class="ind-panjang-label">Set 3: <strong>7 → 11 → 15 cm</strong></small>
        </div>
      </div>
      <figcaption>Urutan setelah disusun: <strong>terpendek → sedang → terpanjang</strong></figcaption>
    </figure>
  </div>
  <p class="ind-note">Urutan awal diacak. Minta, "Susun dari yang paling pendek sampai paling panjang."</p>
</div>`;

// ── Level 7 ──────────────────────────────────────────────────────────────────

// B1 L7: tiga kartu diftong (oi ai au); guru ucap 6 kata, anak tunjuk kartu
v['7:B1'] = `<div class="ind-visual">
  <div class="ind-col">
    <figure class="ind-fig">
      <div class="ind-grafem-row">
        <span class="ind-grafem-card ind-grafem-card--target">oi</span>
        <span class="ind-grafem-card ind-grafem-card--target">ai</span>
        <span class="ind-grafem-card ind-grafem-card--target">au</span>
      </div>
      <figcaption>Tiga pilihan kartu · anak hanya menunjuk</figcaption>
    </figure>
    <figure class="ind-fig">
      <table class="ind-tabel-kunci">
        <tbody>
          <tr><td class="muted">Guru ucap</td><td>pantai</td><td>pulau</td><td>koboi</td><td>sampai</td><td>konvoi</td><td>kerbau</td></tr>
          <tr><td class="muted">Kunci tunjuk</td><td><strong>ai</strong></td><td><strong>au</strong></td><td><strong>oi</strong></td><td><strong>ai</strong></td><td><strong>oi</strong></td><td><strong>au</strong></td></tr>
        </tbody>
      </table>
    </figure>
  </div>
  <p class="ind-note">Kata tidak ditulis; guru ucap wajar. Tiap diftong diuji dua kali; ambang 5 dari 6.</p>
</div>`;

// E1 L7: garis bilangan 0–20; target 3, 7, 12, 16 ditandai emas
v['7:E1'] = `<div class="ind-visual">
  <div class="ind-col">
    <figure class="ind-fig">
      <div class="ind-garis-wrap">
        <div class="ind-garis-ticks">
          <div class="ind-garis-tick"><span class="ind-garis-label">0</span></div>
          <div class="ind-garis-tick"></div>
          <div class="ind-garis-tick"></div>
          <div class="ind-garis-tick ind-garis-tick--target"><span class="ind-garis-marker">3</span></div>
          <div class="ind-garis-tick"></div>
          <div class="ind-garis-tick"><span class="ind-garis-label">5</span></div>
          <div class="ind-garis-tick"></div>
          <div class="ind-garis-tick ind-garis-tick--target"><span class="ind-garis-marker">7</span></div>
          <div class="ind-garis-tick"></div>
          <div class="ind-garis-tick"></div>
          <div class="ind-garis-tick"><span class="ind-garis-label">10</span></div>
          <div class="ind-garis-tick"></div>
          <div class="ind-garis-tick ind-garis-tick--target"><span class="ind-garis-marker">12</span></div>
          <div class="ind-garis-tick"></div>
          <div class="ind-garis-tick"></div>
          <div class="ind-garis-tick"><span class="ind-garis-label">15</span></div>
          <div class="ind-garis-tick ind-garis-tick--target"><span class="ind-garis-marker">16</span></div>
          <div class="ind-garis-tick"></div>
          <div class="ind-garis-tick"></div>
          <div class="ind-garis-tick"></div>
          <div class="ind-garis-tick"><span class="ind-garis-label">20</span></div>
        </div>
      </div>
      <figcaption>Target: <strong>3 · 7 · 12 · 16</strong> (ditandai emas)</figcaption>
    </figure>
  </div>
  <p class="ind-note">Tampilkan satu target per butir. Anak tunjuk takik tanpa guru membilangkan. Ambang 3 dari 4.</p>
</div>`;

// F1 L7: tiga pita kertas diukur dengan satuan balok kecil seragam
v['7:F1'] = `<div class="ind-visual">
  <div class="ind-col">
    <figure class="ind-fig">
      <div class="ind-panjang-wrap">
        <div class="ind-pita-row">
          <div class="ind-pita-strip">
            <span class="ind-satuan"></span><span class="ind-satuan"></span><span class="ind-satuan"></span><span class="ind-satuan"></span>
          </div>
          <small class="ind-panjang-label">Pita 1: <strong>4 satuan</strong></small>
        </div>
        <div class="ind-pita-row">
          <div class="ind-pita-strip">
            <span class="ind-satuan"></span><span class="ind-satuan"></span><span class="ind-satuan"></span><span class="ind-satuan"></span><span class="ind-satuan"></span><span class="ind-satuan"></span>
          </div>
          <small class="ind-panjang-label">Pita 2: <strong>6 satuan</strong></small>
        </div>
        <div class="ind-pita-row">
          <div class="ind-pita-strip">
            <span class="ind-satuan"></span><span class="ind-satuan"></span><span class="ind-satuan"></span><span class="ind-satuan"></span><span class="ind-satuan"></span>
          </div>
          <small class="ind-panjang-label">Pita 3: <strong>5 satuan</strong></small>
        </div>
      </div>
      <figcaption>Kunci: <strong>4 · 6 · 5 satuan</strong> · balok disusun ujung ke ujung tanpa celah</figcaption>
    </figure>
  </div>
  <p class="ind-note">Anak letakkan balok berurutan dari ujung ke ujung, lalu sebut jumlahnya. Ambang 2 dari 3.</p>
</div>`;

v['8:B1'] = `<div class="ind-visual">
  <div class="ind-col">
    <figure class="ind-fig">
      <div class="ind-grafem-row">
        <span class="ind-grafem-card ind-grafem-card--target">p</span>
        <span class="ind-grafem-card ind-grafem-card--target">b</span>
        <span class="ind-grafem-card">q</span>
        <span class="ind-grafem-card ind-grafem-card--target">d</span>
      </div>
      <figcaption>Empat pilihan tetap terlihat · <span class="muted">q hanya pengecoh, tidak menjadi sasaran bunyi</span></figcaption>
    </figure>
    <figure class="ind-fig">
      <table class="ind-tabel-kunci">
        <tbody>
          <tr><td class="muted">Guru ucap</td><td>/b/</td><td>/p/</td><td>/d/</td><td>/p/</td><td>/b/</td><td>/d/</td></tr>
          <tr><td class="muted">Kunci tunjuk</td><td><strong>b</strong></td><td><strong>p</strong></td><td><strong>d</strong></td><td><strong>p</strong></td><td><strong>b</strong></td><td><strong>d</strong></td></tr>
        </tbody>
      </table>
    </figure>
  </div>
  <p class="ind-note">Guru ucap bunyi saja, bukan nama huruf. Anak tunjuk tanpa bersuara. Ambang 5 dari 6.</p>
</div>`;

v['8:E1'] = `<div class="ind-visual">
  <div class="ind-col">
    <figure class="ind-fig">
      <div class="ind-barisan-wrap">
        <div class="ind-barisan-row">
          <span class="ind-barisan-num">4</span><span class="ind-barisan-sep">,</span>
          <span class="ind-barisan-num">6</span><span class="ind-barisan-sep">,</span>
          <span class="ind-barisan-num">8</span><span class="ind-barisan-sep">,</span>
          <span class="ind-barisan-num ind-barisan-num--jawab">10</span><span class="ind-barisan-sep">,</span>
          <span class="ind-barisan-num ind-barisan-num--jawab">12</span>
        </div>
        <div class="ind-barisan-row">
          <span class="ind-barisan-num">7</span><span class="ind-barisan-sep">,</span>
          <span class="ind-barisan-num">9</span><span class="ind-barisan-sep">,</span>
          <span class="ind-barisan-num">11</span><span class="ind-barisan-sep">,</span>
          <span class="ind-barisan-num ind-barisan-num--jawab">13</span><span class="ind-barisan-sep">,</span>
          <span class="ind-barisan-num ind-barisan-num--jawab">15</span>
        </div>
        <div class="ind-barisan-row">
          <span class="ind-barisan-num">12</span><span class="ind-barisan-sep">,</span>
          <span class="ind-barisan-num">14</span><span class="ind-barisan-sep">,</span>
          <span class="ind-barisan-num">16</span><span class="ind-barisan-sep">,</span>
          <span class="ind-barisan-num ind-barisan-num--jawab">18</span><span class="ind-barisan-sep">,</span>
          <span class="ind-barisan-num ind-barisan-num--jawab">20</span>
        </div>
        <div class="ind-barisan-row">
          <span class="ind-barisan-num">9</span><span class="ind-barisan-sep">,</span>
          <span class="ind-barisan-num">11</span><span class="ind-barisan-sep">,</span>
          <span class="ind-barisan-num">13</span><span class="ind-barisan-sep">,</span>
          <span class="ind-barisan-num ind-barisan-num--jawab">15</span><span class="ind-barisan-sep">,</span>
          <span class="ind-barisan-num ind-barisan-num--jawab">17</span>
        </div>
      </div>
      <figcaption>Dua angka terakhir (emas) = jawaban anak · tampilkan satu baris per butir</figcaption>
    </figure>
  </div>
  <p class="ind-note">Guru tidak membacakan awalan. Anak menyebut dua bilangan lanjutan. Ambang 3 dari 4 baris.</p>
</div>`;

v['8:F1'] = `<div class="ind-visual">
  <div class="ind-col">
    <figure class="ind-fig">
      <div class="ind-tali-wrap">
        <div class="ind-tali-row">
          <div class="ind-tali" style="width:38%"></div>
          <small class="ind-panjang-label">Tali 1: <strong>5 satuan</strong> · diterima 4–6</small>
        </div>
        <div class="ind-tali-row">
          <div class="ind-tali" style="width:62%"></div>
          <small class="ind-panjang-label">Tali 2: <strong>8 satuan</strong> · diterima 6–10</small>
        </div>
        <div class="ind-tali-row">
          <div class="ind-tali" style="width:85%"></div>
          <small class="ind-panjang-label">Tali 3: <strong>11 satuan</strong> · diterima 9–13</small>
        </div>
        <div class="ind-tali-satuan">
          <span class="ind-satuan"></span>
          <small class="ind-panjang-label">Satuan contoh (terpisah)</small>
        </div>
      </div>
      <figcaption>Tali ditegangkan lurus · satuan contoh di samping, tidak menempel target</figcaption>
    </figure>
  </div>
  <p class="ind-note">Anak sebut perkiraan dahulu. Guru ukur setelah jawaban final. Ambang 2 dari 3.</p>
</div>`;

v['9:E1'] = `<div class="ind-visual">
  <div class="ind-col">
    <figure class="ind-fig">
      <table class="ind-nilaitempat">
        <thead>
          <tr>
            <th>Bilangan</th>
            <th class="ind-nilaitempat--r">Ratusan</th>
            <th class="ind-nilaitempat--p">Puluhan</th>
            <th class="ind-nilaitempat--s">Satuan</th>
          </tr>
        </thead>
        <tbody>
          <tr><td class="ind-nilaitempat--bil">236</td><td class="ind-nilaitempat--r">2</td><td class="ind-nilaitempat--p">3</td><td class="ind-nilaitempat--s">6</td></tr>
          <tr><td class="ind-nilaitempat--bil">408</td><td class="ind-nilaitempat--r">4</td><td class="ind-nilaitempat--p">0</td><td class="ind-nilaitempat--s">8</td></tr>
          <tr><td class="ind-nilaitempat--bil">751</td><td class="ind-nilaitempat--r">7</td><td class="ind-nilaitempat--p">5</td><td class="ind-nilaitempat--s">1</td></tr>
          <tr><td class="ind-nilaitempat--bil">690</td><td class="ind-nilaitempat--r">6</td><td class="ind-nilaitempat--p">9</td><td class="ind-nilaitempat--s">0</td></tr>
          <tr><td class="ind-nilaitempat--bil">125</td><td class="ind-nilaitempat--r">1</td><td class="ind-nilaitempat--p">2</td><td class="ind-nilaitempat--s">5</td></tr>
        </tbody>
      </table>
      <figcaption>Kunci — guru gunakan sebagai acuan jawaban anak</figcaption>
    </figure>
  </div>
  <p class="ind-note">Guru bacakan bilangan, anak sebutkan angka ratusan, puluhan, dan satuannya. Ambang 4 dari 5.</p>
</div>`;

v['9:F1'] = `<div class="ind-visual">
  <div class="ind-col">
    <figure class="ind-fig ind-fig--row" style="gap:16px;flex-wrap:wrap;justify-content:center">
      <div class="ind-bangun-wrap">
        <svg viewBox="0 0 60 60" width="56" height="56" class="ind-bangun-svg">
          <rect x="8" y="8" width="44" height="44" fill="none" stroke="currentColor" stroke-width="2.5"/>
        </svg>
        <small>Persegi</small>
      </div>
      <div class="ind-bangun-wrap">
        <svg viewBox="0 0 80 60" width="72" height="56" class="ind-bangun-svg">
          <rect x="6" y="12" width="68" height="36" fill="none" stroke="currentColor" stroke-width="2.5"/>
        </svg>
        <small>Persegi panjang</small>
      </div>
      <div class="ind-bangun-wrap">
        <svg viewBox="0 0 60 60" width="56" height="56" class="ind-bangun-svg">
          <polygon points="30,6 54,54 6,54" fill="none" stroke="currentColor" stroke-width="2.5"/>
        </svg>
        <small>Segitiga</small>
      </div>
      <div class="ind-bangun-wrap">
        <svg viewBox="0 0 60 60" width="56" height="56" class="ind-bangun-svg">
          <circle cx="30" cy="30" r="24" fill="none" stroke="currentColor" stroke-width="2.5"/>
        </svg>
        <small>Lingkaran</small>
      </div>
    </figure>
    <figure class="ind-fig">
      <table class="ind-tabel-kunci">
        <tbody>
          <tr><td class="muted">(1) sisinya semua sama panjang</td><td><strong>persegi</strong></td></tr>
          <tr><td class="muted">(2) memiliki tepat 3 sisi</td><td><strong>segitiga</strong></td></tr>
          <tr><td class="muted">(3) tidak memiliki sudut</td><td><strong>lingkaran</strong></td></tr>
          <tr><td class="muted">(4) tepat 4 sudut, sisi belum tentu sama panjang</td><td><strong>persegi panjang</strong></td></tr>
        </tbody>
      </table>
    </figure>
  </div>
  <p class="ind-note">Guru gambar 4 bangun. Anak tunjuk bangun yang disebut. Ambang 3 dari 4.</p>
</div>`;

v['10:E1'] = `<div class="ind-visual">
  <div class="ind-col">
    <figure class="ind-fig">
      <table class="ind-nilaitempat">
        <thead>
          <tr><th>Soal</th><th>Bentuk penjumlahan</th><th class="ind-nilaitempat--r">Hasil</th></tr>
        </thead>
        <tbody>
          <tr><td class="ind-nilaitempat--bil">3 × 2</td><td class="muted">2 + 2 + 2</td><td class="ind-nilaitempat--r">6</td></tr>
          <tr><td class="ind-nilaitempat--bil">4 × 3</td><td class="muted">3 + 3 + 3 + 3</td><td class="ind-nilaitempat--r">12</td></tr>
          <tr><td class="ind-nilaitempat--bil">5 × 2</td><td class="muted">2 + 2 + 2 + 2 + 2</td><td class="ind-nilaitempat--r">10</td></tr>
          <tr><td class="ind-nilaitempat--bil">2 × 6</td><td class="muted">6 + 6</td><td class="ind-nilaitempat--r">12</td></tr>
          <tr><td class="ind-nilaitempat--bil">3 × 4</td><td class="muted">4 + 4 + 4</td><td class="ind-nilaitempat--r">12</td></tr>
        </tbody>
      </table>
      <figcaption>Kunci — anak sebutkan bentuk penjumlahan <em>dan</em> hasil</figcaption>
    </figure>
  </div>
  <p class="ind-note">Guru tampilkan satu soal per butir. Anak sebutkan bentuk penjumlahan berulang lalu hasilnya. Ambang 4 dari 5.</p>
</div>`;

v['10:F1'] = `<div class="ind-visual">
  <div class="ind-col">
    <figure class="ind-fig ind-fig--row" style="gap:20px;justify-content:center;flex-wrap:wrap">
      <div class="ind-jam-wrap">
        <svg viewBox="0 0 80 80" width="72" height="72" class="ind-bangun-svg">
          <circle cx="40" cy="40" r="36" fill="none" stroke="currentColor" stroke-width="2"/>
          <line x1="40" y1="40" x2="40" y2="14" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
          <line x1="40" y1="40" x2="56" y2="40" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <circle cx="40" cy="40" r="2.5" fill="currentColor"/>
        </svg>
        <small><strong>03.00</strong></small>
      </div>
      <div class="ind-jam-wrap">
        <svg viewBox="0 0 80 80" width="72" height="72" class="ind-bangun-svg">
          <circle cx="40" cy="40" r="36" fill="none" stroke="currentColor" stroke-width="2"/>
          <line x1="40" y1="40" x2="40" y2="66" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
          <line x1="40" y1="40" x2="29" y2="51" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <circle cx="40" cy="40" r="2.5" fill="currentColor"/>
        </svg>
        <small><strong>07.30</strong></small>
      </div>
      <div class="ind-jam-wrap">
        <svg viewBox="0 0 80 80" width="72" height="72" class="ind-bangun-svg">
          <circle cx="40" cy="40" r="36" fill="none" stroke="currentColor" stroke-width="2"/>
          <line x1="40" y1="40" x2="40" y2="14" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
          <line x1="40" y1="40" x2="26" y2="32" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <circle cx="40" cy="40" r="2.5" fill="currentColor"/>
        </svg>
        <small><strong>10.00</strong></small>
      </div>
    </figure>
    <figure class="ind-fig">
      <table class="ind-tabel-kunci">
        <tbody>
          <tr><td class="muted">Baca jam kiri</td><td><strong>pukul tiga</strong></td></tr>
          <tr><td class="muted">Baca jam tengah</td><td><strong>pukul tujuh tiga puluh / setengah delapan</strong></td></tr>
          <tr><td class="muted">Baca jam kanan</td><td><strong>pukul sepuluh</strong></td></tr>
          <tr><td class="muted">1 minggu = … hari</td><td><strong>7</strong></td></tr>
          <tr><td class="muted">1 bulan ≈ … minggu</td><td><strong>4</strong></td></tr>
        </tbody>
      </table>
    </figure>
  </div>
  <p class="ind-note">Guru gambar jam di kertas dengan posisi jarum sesuai waktu. Ambang 4 dari 5.</p>
</div>`;

v['11:E1'] = `<div class="ind-visual">
  <div class="ind-col">
    <figure class="ind-fig">
      <table class="ind-nilaitempat">
        <thead>
          <tr><th>Bilangan</th><th>Angka digarisbawahi</th><th class="ind-nilaitempat--r">Nilai tempat</th></tr>
        </thead>
        <tbody>
          <tr><td class="ind-nilaitempat--bil"><u>3</u>.482</td><td class="muted">3</td><td class="ind-nilaitempat--r">3.000 (ribuan)</td></tr>
          <tr><td class="ind-nilaitempat--bil">5.<u>7</u>61</td><td class="muted">7</td><td class="ind-nilaitempat--r">700 (ratusan)</td></tr>
          <tr><td class="ind-nilaitempat--bil">8.0<u>9</u>5</td><td class="muted">9</td><td class="ind-nilaitempat--r">90 (puluhan)</td></tr>
        </tbody>
      </table>
    </figure>
    <figure class="ind-fig">
      <div class="ind-barisan-wrap" style="flex-direction:row;gap:6px;flex-wrap:wrap;align-items:center">
        <span style="font-size:11px;color:var(--muted);margin-right:4px">Urutkan:</span>
        <span class="ind-barisan-num">2.314</span>
        <span class="ind-barisan-sep">·</span>
        <span class="ind-barisan-num">2.413</span>
        <span class="ind-barisan-sep">·</span>
        <span class="ind-barisan-num">2.134</span>
        <span class="ind-barisan-sep">·</span>
        <span class="ind-barisan-num">2.431</span>
      </div>
      <figcaption>Kunci urutan terkecil: <strong>2.134 · 2.314 · 2.413 · 2.431</strong></figcaption>
    </figure>
  </div>
  <p class="ind-note">Guru bacakan satu tugas per butir. Anak sebutkan nilai tempat atau urutan bilangan. Ambang 3 dari 4.</p>
</div>`;

v['11:F1'] = `<div class="ind-visual">
  <div class="ind-col">
    <figure class="ind-fig">
      <table class="ind-nilaitempat">
        <thead>
          <tr><th>Pertanyaan</th><th class="ind-nilaitempat--r">Jawaban</th></tr>
        </thead>
        <tbody>
          <tr><td>1 kg = … gram</td><td class="ind-nilaitempat--r"><strong>1.000</strong></td></tr>
          <tr><td>1 jam = … menit</td><td class="ind-nilaitempat--r"><strong>60</strong></td></tr>
          <tr><td>1 hari = … jam</td><td class="ind-nilaitempat--r"><strong>24</strong></td></tr>
          <tr><td>Berat sebuah apel → gram atau kg?</td><td class="ind-nilaitempat--r"><strong>gram</strong></td></tr>
          <tr><td>Berat beras sekarung → gram atau kg?</td><td class="ind-nilaitempat--r"><strong>kg</strong></td></tr>
        </tbody>
      </table>
      <figcaption>Kunci — guru tanyakan lisan, anak jawab lisan. Ambang 4 dari 5</figcaption>
    </figure>
  </div>
  <p class="ind-note">Semua pertanyaan lisan. Tidak perlu alat timbang. Ambang 4 dari 5.</p>
</div>`;

v['11:C1'] = `<div class="ind-visual">
  <div class="ind-col">
    <figure class="ind-fig">
      <div class="ind-paragraf">
        <div class="ind-paragraf-row ind-paragraf-row--pokok">
          <span class="ind-paragraf-num">—</span>
          <span><strong>Manfaat Air</strong></span>
          <span class="ind-paragraf-tag">← judul</span>
        </div>
        <div class="ind-paragraf-row ind-paragraf-row--pokok">
          <span class="ind-paragraf-num">1</span>
          <span>Air dibutuhkan tubuh setiap hari.</span>
          <span class="ind-paragraf-tag">← kalimat pembuka</span>
        </div>
        <div class="ind-paragraf-row">
          <span class="ind-paragraf-num">2</span>
          <span>Kita minum air agar tubuh tidak lemas.</span>
          <span class="ind-paragraf-tag muted">← kalimat rincian</span>
        </div>
        <div class="ind-paragraf-row">
          <span class="ind-paragraf-num">3</span>
          <span>Air juga membantu tubuh tetap segar.</span>
          <span class="ind-paragraf-tag muted">← kalimat rincian</span>
        </div>
        <div class="ind-paragraf-row">
          <span class="ind-paragraf-num">4</span>
          <span>Karena itu, kita perlu minum cukup air.</span>
        </div>
      </div>
      <figcaption>Anak tunjuk: judul → "Manfaat Air" · kalimat pembuka → kalimat 1 · kalimat rincian → kalimat 2 atau 3</figcaption>
    </figure>
  </div>
  <p class="ind-note">Guru tulis teks di kertas/papan. Anak baca lalu tunjuk bagian yang diminta. Lulus bila 2 dari 3 bagian benar.</p>
</div>`;

v['12:B1'] = `<div class="ind-visual">
  <div class="ind-col">
    <figure class="ind-fig">
      <div class="ind-paragraf">
        <div class="ind-paragraf-row ind-paragraf-row--pokok">
          <span class="ind-paragraf-num">1</span>
          <span>Membaca setiap hari banyak manfaatnya.</span>
          <span class="ind-paragraf-tag">← gagasan pokok</span>
        </div>
        <div class="ind-paragraf-row">
          <span class="ind-paragraf-num">2</span>
          <span>Anak dapat mengenal kata baru.</span>
        </div>
        <div class="ind-paragraf-row">
          <span class="ind-paragraf-num">3</span>
          <span>Anak juga lebih mudah memahami cerita.</span>
        </div>
        <div class="ind-paragraf-row">
          <span class="ind-paragraf-num">4</span>
          <span>Karena itu, membaca baik dilakukan secara rutin.</span>
        </div>
      </div>
      <figcaption>Anak tunjuk nomor kalimat gagasan pokok → jawaban: kalimat 1</figcaption>
    </figure>
  </div>
  <p class="ind-note">Guru tulis paragraf di kertas/papan. Anak pilih nomor kalimat yang menjadi gagasan pokok.</p>
</div>`;

v['12:E1'] = `<div class="ind-visual">
  <div class="ind-col">
    <figure class="ind-fig ind-fig--row" style="justify-content:center;gap:10px;flex-wrap:wrap">
      <div class="ind-pecahan-col">
        <div class="ind-pecahan-bar" style="grid-template-columns:repeat(2,1fr)">
          <span class="ind-pecahan-isi"></span><span></span>
        </div>
        <strong>½</strong>
      </div>
      <div class="ind-pecahan-col">
        <div class="ind-pecahan-bar" style="grid-template-columns:repeat(3,1fr)">
          <span class="ind-pecahan-isi"></span><span></span><span></span>
        </div>
        <strong>⅓</strong>
      </div>
      <div class="ind-pecahan-col">
        <div class="ind-pecahan-bar" style="grid-template-columns:repeat(4,1fr)">
          <span class="ind-pecahan-isi"></span><span></span><span></span><span></span>
        </div>
        <strong>¼</strong>
      </div>
      <div class="ind-pecahan-col">
        <div class="ind-pecahan-bar" style="grid-template-columns:repeat(4,1fr)">
          <span class="ind-pecahan-isi"></span><span class="ind-pecahan-isi"></span><span></span><span></span>
        </div>
        <strong style="font-size:12px">2/4</strong>
      </div>
      <div class="ind-pecahan-col">
        <div class="ind-pecahan-bar" style="grid-template-columns:repeat(4,1fr)">
          <span class="ind-pecahan-isi"></span><span class="ind-pecahan-isi"></span><span class="ind-pecahan-isi"></span><span></span>
        </div>
        <strong>¾</strong>
      </div>
    </figure>
    <figcaption style="text-align:center;font-size:11px;color:var(--muted);margin-top:4px">Anak sebutkan arti tiap pecahan. Ambang 4 dari 5</figcaption>
  </div>
  <p class="ind-note">Guru tunjukkan kartu pecahan satu per satu. Anak tunjuk bagian yang diarsir dan sebutkan artinya.</p>
</div>`;

v['12:C1'] = `<div class="ind-visual">
  <div class="ind-col">
    <figure class="ind-fig">
      <div class="ind-paragraf">
        <div class="ind-paragraf-row ind-paragraf-row--pokok">
          <span class="ind-paragraf-num">1</span>
          <span>Pagi itu, Siti lupa membawa pensil.</span>
          <span class="ind-paragraf-tag">← awal</span>
        </div>
        <div class="ind-paragraf-row ind-paragraf-row--pokok">
          <span class="ind-paragraf-num">2</span>
          <span>Ia meminjam pensil kepada Dina.</span>
          <span class="ind-paragraf-tag">← tengah</span>
        </div>
        <div class="ind-paragraf-row">
          <span class="ind-paragraf-num">3</span>
          <span>Setelah selesai menulis, Siti mengembalikan pensil itu.</span>
          <span class="ind-paragraf-tag muted">← tengah</span>
        </div>
        <div class="ind-paragraf-row">
          <span class="ind-paragraf-num">4</span>
          <span>Dina senang karena barangnya dijaga.</span>
          <span class="ind-paragraf-tag">← akhir</span>
        </div>
      </div>
      <figcaption>Anak tunjuk: kejadian awal → kalimat 1 · kejadian tengah → kalimat 2 atau 3 · kejadian akhir → kalimat 4</figcaption>
    </figure>
  </div>
  <p class="ind-note">Guru tulis teks di kertas/papan. Anak baca lalu tunjuk urutan kejadian. Lulus bila 3 dari 3 urutan benar.</p>
</div>`;

v['12:F1'] = `<div class="ind-visual">
  <div class="ind-col">
    <figure class="ind-fig ind-fig--row" style="justify-content:center;gap:12px;flex-wrap:wrap">
      <div class="ind-luas-bangun">
        <div class="ind-luas-grid" style="grid-template-columns:repeat(3,16px)">
          <div class="ind-luas-cell"></div><div class="ind-luas-cell"></div><div class="ind-luas-cell"></div>
          <div class="ind-luas-cell"></div><div class="ind-luas-cell"></div><div class="ind-luas-cell"></div>
        </div>
        <span>A = <strong>6</strong></span>
      </div>
      <div class="ind-luas-bangun">
        <div class="ind-luas-grid" style="grid-template-columns:repeat(4,16px)">
          <div class="ind-luas-cell"></div><div class="ind-luas-cell"></div><div class="ind-luas-cell"></div><div class="ind-luas-cell"></div>
          <div class="ind-luas-cell"></div><div class="ind-luas-cell"></div><div class="ind-luas-cell"></div><div class="ind-luas-cell"></div>
        </div>
        <span>B = <strong>8</strong></span>
      </div>
      <div class="ind-luas-bangun">
        <div class="ind-luas-grid" style="grid-template-columns:repeat(3,16px)">
          <div class="ind-luas-cell"></div><div class="ind-luas-cell"></div><div class="ind-luas-cell"></div>
          <div class="ind-luas-cell"></div><div class="ind-luas-cell"></div><div class="ind-luas-cell"></div>
          <div class="ind-luas-cell"></div><div class="ind-luas-cell"></div><div class="ind-luas-cell"></div>
        </div>
        <span>C = <strong>9</strong></span>
      </div>
      <div class="ind-luas-bangun">
        <div class="ind-luas-grid" style="grid-template-columns:repeat(5,16px)">
          <div class="ind-luas-cell"></div><div class="ind-luas-cell"></div><div class="ind-luas-cell"></div><div class="ind-luas-cell"></div><div class="ind-luas-cell"></div>
        </div>
        <span>D = <strong>5</strong></span>
      </div>
    </figure>
    <figcaption style="text-align:center;font-size:11px;color:var(--muted);margin-top:4px">Anak hitung kotak tiap bangun. Ambang 3 dari 4</figcaption>
  </div>
  <p class="ind-note">Guru gambar petak kotak di kertas. Anak hitung banyak kotak dan bandingkan luas keempat bangun.</p>
</div>`;

v['13:C1'] = `<div class="ind-visual">
  <div class="ind-col">
    <figure class="ind-fig">
      <div class="ind-paragraf">
        <div class="ind-paragraf-row">
          <span class="ind-paragraf-num">1</span>
          <span>Tanaman membutuhkan air.</span>
        </div>
        <div class="ind-paragraf-row ind-paragraf-row--pokok">
          <span class="ind-paragraf-num">2</span>
          <span>Akar tanaman <u><strong>menyerap</strong></u> air dari tanah.</span>
          <span class="ind-paragraf-tag">← kata sasaran</span>
        </div>
        <div class="ind-paragraf-row">
          <span class="ind-paragraf-num">3</span>
          <span>Air itu membantu batang dan daun tetap segar.</span>
        </div>
        <div class="ind-paragraf-row">
          <span class="ind-paragraf-num">4</span>
          <span>Tanaman yang cukup air dapat tumbuh baik.</span>
        </div>
      </div>
      <figcaption>Anak baca kalimat sekitar kata bergaris bawah, lalu jelaskan artinya</figcaption>
    </figure>
  </div>
  <p class="ind-note">Guru tulis teks di kertas/papan, garis bawahi kata "menyerap". Arti diterima: mengambil / masuknya air ke akar.</p>
</div>`;

v['13:B1'] = `<div class="ind-visual">
  <div class="ind-col">
    <figure class="ind-fig">
      <div class="ind-paragraf">
        <div class="ind-paragraf-row">
          <span class="ind-paragraf-num">A</span>
          <span>"Disiplin adalah sikap menaati aturan dan waktu."</span>
          <span class="ind-paragraf-tag">← definisi</span>
        </div>
        <div class="ind-paragraf-row">
          <span class="ind-paragraf-num">B</span>
          <span>"Contohnya, anak datang tepat waktu dan membawa alat belajar."</span>
          <span class="ind-paragraf-tag">← contoh</span>
        </div>
        <div class="ind-paragraf-row">
          <span class="ind-paragraf-num">C</span>
          <span>"Belajar sendiri membuat kita fokus, sedangkan belajar kelompok membantu berdiskusi."</span>
          <span class="ind-paragraf-tag">← perbandingan</span>
        </div>
        <div class="ind-paragraf-row">
          <span class="ind-paragraf-num">D</span>
          <span>"Amanah berarti menjaga kepercayaan yang diberikan orang lain."</span>
          <span class="ind-paragraf-tag">← definisi</span>
        </div>
      </div>
      <figcaption>Kunci: A definisi · B contoh · C perbandingan · D definisi. Ambang 3 dari 4</figcaption>
    </figure>
  </div>
  <p class="ind-note">Guru bacakan tiap kutipan. Anak sebut jenisnya: definisi, contoh, atau perbandingan.</p>
</div>`;

v['13:E1'] = `<div class="ind-visual">
  <div class="ind-col">
    <figure class="ind-fig">
      <table class="ind-nilaitempat">
        <thead>
          <tr><th>Bilangan</th><th>Angka ditanya</th><th class="ind-nilaitempat--r">Nilai tempat</th></tr>
        </thead>
        <tbody>
          <tr><td class="ind-nilaitempat--bil"><u>8</u>.426</td><td class="muted">8</td><td class="ind-nilaitempat--r">8.000 (ribuan)</td></tr>
          <tr><td class="ind-nilaitempat--bil">9.<u>5</u>03</td><td class="muted">5</td><td class="ind-nilaitempat--r">500 (ratusan)</td></tr>
        </tbody>
      </table>
    </figure>
    <figure class="ind-fig">
      <table class="ind-nilaitempat">
        <thead>
          <tr><th>Soal</th><th class="ind-nilaitempat--r">Jawaban</th></tr>
        </thead>
        <tbody>
          <tr><td>FPB dari 12 dan 18</td><td class="ind-nilaitempat--r"><strong>6</strong></td></tr>
          <tr><td>KPK dari 4 dan 6</td><td class="ind-nilaitempat--r"><strong>12</strong></td></tr>
          <tr><td>KPK dari 5 dan 10</td><td class="ind-nilaitempat--r"><strong>10</strong></td></tr>
        </tbody>
      </table>
      <figcaption>Guru tanyakan lisan. Ambang 4 dari 5 (nilai tempat + FPB/KPK)</figcaption>
    </figure>
  </div>
  <p class="ind-note">Guru bacakan soal satu per satu. Anak sebut nilai tempat atau jawaban FPB/KPK.</p>
</div>`;

v['13:F1'] = `<div class="ind-visual">
  <div class="ind-col">
    <figure class="ind-fig ind-fig--row" style="justify-content:center;gap:16px">
      <div class="ind-bangun-wrap">
        <svg viewBox="0 0 60 58" class="ind-bangun-svg">
          <polygon points="4,18 34,18 34,48 4,48" fill="none" stroke="currentColor" stroke-width="1.5"/>
          <polygon points="4,18 14,8 44,8 34,18" fill="none" stroke="currentColor" stroke-width="1.5"/>
          <polygon points="34,18 44,8 44,38 34,48" fill="none" stroke="currentColor" stroke-width="1.5"/>
        </svg>
        <small>kubus</small>
      </div>
      <div class="ind-bangun-wrap">
        <svg viewBox="0 0 68 52" class="ind-bangun-svg">
          <polygon points="4,18 46,18 46,46 4,46" fill="none" stroke="currentColor" stroke-width="1.5"/>
          <polygon points="4,18 16,6 58,6 46,18" fill="none" stroke="currentColor" stroke-width="1.5"/>
          <polygon points="46,18 58,6 58,34 46,46" fill="none" stroke="currentColor" stroke-width="1.5"/>
        </svg>
        <small>balok</small>
      </div>
      <div class="ind-bangun-wrap">
        <svg viewBox="0 0 70 58" class="ind-bangun-svg">
          <polygon points="4,50 34,50 19,18" fill="none" stroke="currentColor" stroke-width="1.5"/>
          <line x1="4" y1="50" x2="20" y2="50" stroke="currentColor" stroke-width="1.5"/>
          <line x1="34" y1="50" x2="50" y2="50" stroke="currentColor" stroke-width="1.5"/>
          <line x1="19" y1="18" x2="35" y2="18" stroke="currentColor" stroke-width="1.5"/>
          <polygon points="20,50 50,50 35,18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3,2"/>
        </svg>
        <small>prisma segitiga</small>
      </div>
    </figure>
    <figure class="ind-fig">
      <table class="ind-nilaitempat">
        <thead><tr><th>Pertanyaan guru</th><th class="ind-nilaitempat--r">Jawaban</th></tr></thead>
        <tbody>
          <tr><td>Kubus — berapa sisi?</td><td class="ind-nilaitempat--r"><strong>6</strong></td></tr>
          <tr><td>Balok — berapa rusuk?</td><td class="ind-nilaitempat--r"><strong>12</strong></td></tr>
          <tr><td>Prisma segitiga — berapa sisi?</td><td class="ind-nilaitempat--r"><strong>5</strong></td></tr>
          <tr><td>Kubus — berapa titik sudut?</td><td class="ind-nilaitempat--r"><strong>8</strong></td></tr>
          <tr><td>Sisi-sisi balok berbentuk apa?</td><td class="ind-nilaitempat--r"><strong>persegi panjang</strong></td></tr>
        </tbody>
      </table>
      <figcaption>Ambang 4 dari 5</figcaption>
    </figure>
  </div>
  <p class="ind-note">Guru tunjukkan sketsa tiga bangun. Anak tunjuk nama bangun dan jawab pertanyaan sisi/rusuk/titik sudut.</p>
</div>`;

// ── Level 14 ─────────────────────────────────────────────────────────────────

// C1 L14: teks kalimat majemuk kompleks — koma jeda ditandai
v['14:C1'] = `<div class="ind-visual">
  <div class="ind-col">
    <figure class="ind-fig">
      <div class="ind-paragraf">
        <div class="ind-paragraf-row ind-paragraf-row--pokok">
          <span class="ind-paragraf-num">1</span>
          <span>Ketika hujan turun<strong style="color:var(--green)">,</strong> anak-anak tetap belajar di kelas.</span>
          <span class="ind-paragraf-tag">← jeda koma</span>
        </div>
        <div class="ind-paragraf-row">
          <span class="ind-paragraf-num">2</span>
          <span>Mereka tidak bermain di halaman karena lantai menjadi licin.</span>
        </div>
        <div class="ind-paragraf-row ind-paragraf-row--pokok">
          <span class="ind-paragraf-num">3</span>
          <span>Walaupun begitu<strong style="color:var(--green)">,</strong> suasana kelas tetap menyenangkan.</span>
          <span class="ind-paragraf-tag">← jeda koma</span>
        </div>
        <div class="ind-paragraf-row">
          <span class="ind-paragraf-num">4</span>
          <span>Guru mengajak anak membaca cerita.</span>
        </div>
        <div class="ind-paragraf-row ind-paragraf-row--pokok">
          <span class="ind-paragraf-num">5</span>
          <span>Setelah hujan reda<strong style="color:var(--green)">,</strong> mereka pulang dengan tertib.</span>
          <span class="ind-paragraf-tag">← jeda koma</span>
        </div>
      </div>
      <figcaption>Guru catat: anak beri jeda pada koma hijau (ada 3) + jeda akhir kalimat (5). Ambang 3 dari 5 tanda baca dijeda wajar</figcaption>
    </figure>
  </div>
  <p class="ind-note">Guru tulis teks di kertas/papan. Amati jeda anak pada koma (setelah "turun", "begitu", "reda") dan titik akhir kalimat. Lulus bila 3 dari 5 dijeda dengan wajar.</p>
</div>`;

// B1 L14: fakta vs opini — 4 kalimat, kunci fakta/opini/fakta/opini
v['14:B1'] = `<div class="ind-visual">
  <div class="ind-col">
    <figure class="ind-fig">
      <div class="ind-paragraf">
        <div class="ind-paragraf-row">
          <span class="ind-paragraf-num">A</span>
          <span>"Kelas dimulai pukul delapan."</span>
          <span class="ind-paragraf-tag">← fakta</span>
        </div>
        <div class="ind-paragraf-row">
          <span class="ind-paragraf-num">B</span>
          <span>"Belajar pagi lebih menyenangkan."</span>
          <span class="ind-paragraf-tag">← opini</span>
        </div>
        <div class="ind-paragraf-row">
          <span class="ind-paragraf-num">C</span>
          <span>"Perpustakaan memiliki dua rak buku."</span>
          <span class="ind-paragraf-tag">← fakta</span>
        </div>
        <div class="ind-paragraf-row">
          <span class="ind-paragraf-num">D</span>
          <span>"Buku cerita itu paling bagus."</span>
          <span class="ind-paragraf-tag">← opini</span>
        </div>
      </div>
      <figcaption>Kunci: A fakta · B opini · C fakta · D opini. Ambang 3 dari 4</figcaption>
    </figure>
  </div>
  <p class="ind-note">Guru bacakan tiap kalimat. Anak sebut jenisnya: fakta atau opini.</p>
</div>`;

// E1 L14: desimal ↔ pecahan, ambang 4 dari 5
v['14:E1'] = `<div class="ind-visual">
  <div class="ind-col">
    <figure class="ind-fig">
      <table class="ind-nilaitempat">
        <thead><tr><th>Desimal</th><th class="ind-nilaitempat--r">Pecahan setara</th></tr></thead>
        <tbody>
          <tr><td>0,5</td><td class="ind-nilaitempat--r"><strong>5/10</strong></td></tr>
          <tr><td>0,25</td><td class="ind-nilaitempat--r"><strong>25/100</strong></td></tr>
          <tr><td>0,75</td><td class="ind-nilaitempat--r"><strong>75/100</strong></td></tr>
          <tr><td>0,3</td><td class="ind-nilaitempat--r"><strong>3/10</strong></td></tr>
          <tr><td>0,08</td><td class="ind-nilaitempat--r"><strong>8/100</strong></td></tr>
        </tbody>
      </table>
      <figcaption>Guru baca desimal; anak sebut pecahannya. Ambang 4 dari 5</figcaption>
    </figure>
  </div>
  <p class="ind-note">Guru bacakan desimal satu per satu. Anak pasangkan dengan pecahan yang nilainya sama.</p>
</div>`;

// F1 L14: tabel data buku + bar chart sederhana, ambang 4 dari 5
v['14:F1'] = `<div class="ind-visual">
  <div class="ind-col">
    <figure class="ind-fig">
      <table class="ind-nilaitempat">
        <thead><tr><th>Nama</th><th class="ind-nilaitempat--r">Buku dibaca</th></tr></thead>
        <tbody>
          <tr><td>Ani</td><td class="ind-nilaitempat--r"><strong>6</strong></td></tr>
          <tr><td>Budi</td><td class="ind-nilaitempat--r"><strong>4</strong></td></tr>
          <tr><td>Cici</td><td class="ind-nilaitempat--r"><strong>8</strong></td></tr>
          <tr><td>Dodi</td><td class="ind-nilaitempat--r"><strong>5</strong></td></tr>
        </tbody>
      </table>
    </figure>
    <figure class="ind-fig" style="align-items:center;gap:0">
      <svg viewBox="0 0 180 90" style="width:180px;height:90px;display:block">
        <line x1="20" y1="5" x2="20" y2="75" stroke="currentColor" stroke-width="1.2"/>
        <line x1="20" y1="75" x2="175" y2="75" stroke="currentColor" stroke-width="1.2"/>
        <rect x="28" y="30" width="24" height="45" fill="var(--green)" opacity=".75"/>
        <rect x="66" y="45" width="24" height="30" fill="var(--green)" opacity=".75"/>
        <rect x="104" y="15" width="24" height="60" fill="var(--green)" opacity=".75"/>
        <rect x="142" y="38" width="24" height="37" fill="var(--green)" opacity=".75"/>
        <text x="40" y="84" text-anchor="middle" font-size="9" fill="currentColor">Ani</text>
        <text x="78" y="84" text-anchor="middle" font-size="9" fill="currentColor">Budi</text>
        <text x="116" y="84" text-anchor="middle" font-size="9" fill="currentColor">Cici</text>
        <text x="154" y="84" text-anchor="middle" font-size="9" fill="currentColor">Dodi</text>
        <text x="40" y="26" text-anchor="middle" font-size="9" fill="currentColor">6</text>
        <text x="78" y="41" text-anchor="middle" font-size="9" fill="currentColor">4</text>
        <text x="116" y="11" text-anchor="middle" font-size="9" fill="currentColor">8</text>
        <text x="154" y="34" text-anchor="middle" font-size="9" fill="currentColor">5</text>
      </svg>
      <figcaption style="font-size:.72rem">Diagram batang: jumlah buku dibaca</figcaption>
    </figure>
    <figure class="ind-fig">
      <table class="ind-nilaitempat">
        <thead><tr><th>Pertanyaan</th><th class="ind-nilaitempat--r">Jawaban</th></tr></thead>
        <tbody>
          <tr><td>Siapa paling banyak?</td><td class="ind-nilaitempat--r"><strong>Cici</strong></td></tr>
          <tr><td>Siapa paling sedikit?</td><td class="ind-nilaitempat--r"><strong>Budi</strong></td></tr>
          <tr><td>Selisih Ani dan Budi?</td><td class="ind-nilaitempat--r"><strong>2</strong></td></tr>
          <tr><td>Jumlah Budi dan Dodi?</td><td class="ind-nilaitempat--r"><strong>9</strong></td></tr>
          <tr><td>Berapa orang dalam data?</td><td class="ind-nilaitempat--r"><strong>4</strong></td></tr>
        </tbody>
      </table>
      <figcaption>Ambang 4 dari 5</figcaption>
    </figure>
  </div>
  <p class="ind-note">Guru tunjukkan tabel dan diagram. Anak jawab lima pertanyaan lisan.</p>
</div>`;

// ── Level 15 ─────────────────────────────────────────────────────────────────

// B1 L15: struktur teks — klaim, argumen, simpulan
v['15:B1'] = `<div class="ind-visual">
  <div class="ind-col">
    <figure class="ind-fig">
      <div class="ind-paragraf">
        <div class="ind-paragraf-row ind-paragraf-row--pokok">
          <span class="ind-paragraf-num">1</span>
          <span>"Membaca rutin perlu dibiasakan."</span>
          <span class="ind-paragraf-tag">← klaim</span>
        </div>
        <div class="ind-paragraf-row">
          <span class="ind-paragraf-num">2</span>
          <span>"Kebiasaan ini menambah kosakata dan membantu anak memahami pelajaran."</span>
          <span class="ind-paragraf-tag">← argumen</span>
        </div>
        <div class="ind-paragraf-row">
          <span class="ind-paragraf-num">3</span>
          <span>"Jadi, anak sebaiknya menyediakan waktu membaca setiap hari."</span>
          <span class="ind-paragraf-tag">← simpulan</span>
        </div>
      </div>
      <figcaption>Kunci: 1 klaim · 2 argumen · 3 simpulan. Lulus 3 dari 3</figcaption>
    </figure>
  </div>
  <p class="ind-note">Guru bacakan teks. Anak sebut bagian tiap kalimat: klaim, argumen, atau simpulan.</p>
</div>`;

// E1 L15: bilangan bulat negatif — garis bilangan, perbandingan, urutan, bilangan berlawanan
v['15:E1'] = `<div class="ind-visual">
  <div class="ind-col">
    <figure class="ind-fig" style="align-items:center">
      <svg viewBox="0 0 260 44" style="width:260px;height:44px;display:block">
        <line x1="10" y1="22" x2="250" y2="22" stroke="currentColor" stroke-width="1.4"/>
        <polygon points="250,18 258,22 250,26" fill="currentColor"/>
        ${[-6,-5,-4,-3,-2,-1,0,1,2,3,4].map((n,i) => {
          const x = 20 + i*21;
          return `<line x1="${x}" y1="17" x2="${x}" y2="27" stroke="currentColor" stroke-width="1.2"/>
<text x="${x}" y="38" text-anchor="middle" font-size="9" fill="currentColor">${n}</text>`;
        }).join('')}
        <circle cx="83" cy="22" r="4" fill="var(--green)" opacity=".8"/>
      </svg>
      <figcaption style="font-size:.72rem">Garis bilangan; lingkaran = posisi −4</figcaption>
    </figure>
    <figure class="ind-fig">
      <table class="ind-nilaitempat">
        <thead><tr><th>Pasangan</th><th class="ind-nilaitempat--r">Yang lebih besar</th></tr></thead>
        <tbody>
          <tr><td>−3 dan 2</td><td class="ind-nilaitempat--r"><strong>2</strong></td></tr>
          <tr><td>−5 dan −1</td><td class="ind-nilaitempat--r"><strong>−1</strong></td></tr>
          <tr><td>0 dan −4</td><td class="ind-nilaitempat--r"><strong>0</strong></td></tr>
        </tbody>
      </table>
    </figure>
    <figure class="ind-fig">
      <table class="ind-nilaitempat">
        <thead><tr><th>Tugas</th><th class="ind-nilaitempat--r">Jawaban</th></tr></thead>
        <tbody>
          <tr><td>Urutkan dari terkecil: −2, 4, −6, 1, 0</td><td class="ind-nilaitempat--r"><strong>−6, −2, 0, 1, 4</strong></td></tr>
          <tr><td>Bilangan berlawanan dari −4</td><td class="ind-nilaitempat--r"><strong>4</strong></td></tr>
        </tbody>
      </table>
      <figcaption>Ambang 4 dari 5 tugas benar</figcaption>
    </figure>
  </div>
  <p class="ind-note">Guru bacakan soal lisan. Anak sebut bilangan yang lebih besar, urutan, atau bilangan berlawanan.</p>
</div>`;

// F1 L15: jenis segitiga + jajargenjang — SVG sketsa dan tabel sifat
v['15:F1'] = `<div class="ind-visual">
  <div class="ind-col">
    <figure class="ind-fig ind-fig--row" style="justify-content:center;gap:14px;flex-wrap:wrap">
      <div class="ind-bangun-wrap">
        <svg viewBox="0 0 60 54" class="ind-bangun-svg">
          <polygon points="30,4 56,50 4,50" fill="none" stroke="currentColor" stroke-width="1.5"/>
        </svg>
        <small>sama sisi</small>
      </div>
      <div class="ind-bangun-wrap">
        <svg viewBox="0 0 60 54" class="ind-bangun-svg">
          <polygon points="30,4 52,50 8,50" fill="none" stroke="currentColor" stroke-width="1.5"/>
        </svg>
        <small>sama kaki</small>
      </div>
      <div class="ind-bangun-wrap">
        <svg viewBox="0 0 60 54" class="ind-bangun-svg">
          <polygon points="6,50 6,10 52,50" fill="none" stroke="currentColor" stroke-width="1.5"/>
          <rect x="6" y="43" width="7" height="7" fill="none" stroke="currentColor" stroke-width="1"/>
        </svg>
        <small>siku-siku</small>
      </div>
      <div class="ind-bangun-wrap">
        <svg viewBox="0 0 60 54" class="ind-bangun-svg">
          <polygon points="18,6 54,46 4,38" fill="none" stroke="currentColor" stroke-width="1.5"/>
        </svg>
        <small>sembarang</small>
      </div>
      <div class="ind-bangun-wrap">
        <svg viewBox="0 0 70 54" class="ind-bangun-svg">
          <polygon points="16,8 58,8 54,46 12,46" fill="none" stroke="currentColor" stroke-width="1.5"/>
        </svg>
        <small>jajargenjang</small>
      </div>
    </figure>
    <figure class="ind-fig">
      <table class="ind-nilaitempat">
        <thead><tr><th>Bangun</th><th>Satu sifat kunci</th></tr></thead>
        <tbody>
          <tr><td>Segitiga sama sisi</td><td>3 sisi sama panjang</td></tr>
          <tr><td>Segitiga sama kaki</td><td>2 sisi sama panjang</td></tr>
          <tr><td>Segitiga siku-siku</td><td>1 sudut 90°</td></tr>
          <tr><td>Segitiga sembarang</td><td>semua sisi berbeda</td></tr>
          <tr><td>Jajargenjang</td><td>sisi berhadapan sejajar &amp; sama panjang</td></tr>
        </tbody>
      </table>
      <figcaption>Ambang 4 dari 5 identifikasi atau sifat benar</figcaption>
    </figure>
  </div>
  <p class="ind-note">Guru tunjukkan sketsa. Anak tunjuk nama bangun yang disebutkan dan sebutkan satu sifatnya.</p>
</div>`;

// ── Level 16 ──────────────────────────────────────────────────────────────────

v['16:B1'] = `<div class="ind-visual">
  <div class="ind-col">
    <figure class="ind-fig">
      <div class="ind-paragraf">
        <div class="ind-paragraf-row">
          <span class="ind-paragraf-num">A</span>
          <span>"Air <b>menguap</b> saat terkena panas, yaitu berubah menjadi uap."</span>
          <span class="ind-paragraf-tag">← berubah jadi uap</span>
        </div>
        <div class="ind-paragraf-row">
          <span class="ind-paragraf-num">B</span>
          <span>"Tanaman <b>menyerap</b> air melalui akar."</span>
          <span class="ind-paragraf-tag">← mengambil / masuk ke dalam</span>
        </div>
        <div class="ind-paragraf-row">
          <span class="ind-paragraf-num">C</span>
          <span>"Hewan <b>beradaptasi</b> agar dapat hidup di lingkungannya."</span>
          <span class="ind-paragraf-tag">← menyesuaikan diri</span>
        </div>
        <div class="ind-paragraf-row">
          <span class="ind-paragraf-num">D</span>
          <span>"<b>Data</b> dikumpulkan untuk mengetahui hasil pengamatan."</span>
          <span class="ind-paragraf-tag">← informasi hasil catatan</span>
        </div>
      </div>
      <figcaption>Kunci: A berubah jadi uap · B masuk ke dalam · C menyesuaikan diri · D informasi hasil catatan. Ambang 3 dari 4</figcaption>
    </figure>
  </div>
  <p class="ind-note">Guru bacakan tiap kalimat. Anak jelaskan arti kata yang dicetak tebal berdasarkan kalimat itu.</p>
</div>`;

v['16:E1'] = `<div class="ind-visual">
  <div class="ind-col">
    <figure class="ind-fig">
      <table class="ind-nilaitempat">
        <thead><tr><th>PERBANDINGAN</th><th>PALING SEDERHANA</th></tr></thead>
        <tbody>
          <tr><td>6 : 9</td><td class="ind-nilaitempat--r">2 : 3</td></tr>
          <tr><td>8 : 12</td><td class="ind-nilaitempat--r">2 : 3</td></tr>
          <tr><td>10 : 15</td><td class="ind-nilaitempat--r">2 : 3</td></tr>
          <tr><td>12 : 16</td><td class="ind-nilaitempat--r">3 : 4</td></tr>
          <tr><td>5 : 20</td><td class="ind-nilaitempat--r">1 : 4</td></tr>
        </tbody>
      </table>
      <figcaption>Ambang 4 dari 5 disederhanakan benar</figcaption>
    </figure>
  </div>
  <p class="ind-note">Guru tulis tiap perbandingan. Anak sederhanakan ke bentuk paling kecil.</p>
</div>`;

v['16:F1'] = `<div class="ind-visual">
  <div class="ind-col">
    <figure class="ind-fig" style="align-items:center;gap:0">
      <svg viewBox="0 0 180 140" class="ind-bangun-svg" style="max-width:180px">
        <circle cx="90" cy="62" r="50" fill="none" stroke="currentColor" stroke-width="2"/>
        <line x1="40" y1="62" x2="140" y2="62" stroke="currentColor" stroke-width="1.5" stroke-dasharray="5,3"/>
        <line x1="90" y1="62" x2="140" y2="62" stroke="#c79a3b" stroke-width="3"/>
        <circle cx="90" cy="62" r="3.5" fill="currentColor"/>
        <circle cx="140" cy="62" r="3" fill="currentColor"/>
        <circle cx="40" cy="62" r="3" fill="currentColor"/>
        <text x="90" y="54" text-anchor="middle" font-size="13" fill="currentColor">O</text>
        <text x="147" y="60" text-anchor="start" font-size="13" fill="currentColor">A</text>
        <text x="33" y="60" text-anchor="end" font-size="13" fill="currentColor">B</text>
        <text x="116" y="54" text-anchor="middle" font-size="12" fill="#c79a3b" font-style="italic">r</text>
        <text x="90" y="84" text-anchor="middle" font-size="12" fill="currentColor" font-style="italic">d</text>
      </svg>
      <table class="ind-nilaitempat" style="margin-top:6px">
        <thead><tr><th>NO</th><th>PERTANYAAN</th><th>JAWABAN</th></tr></thead>
        <tbody>
          <tr><td>1</td><td>Tunjuk jari-jari</td><td>Garis OA</td></tr>
          <tr><td>2</td><td>Tunjuk diameter</td><td>Garis AB</td></tr>
          <tr><td>3</td><td>Diameter = 2 × jari-jari?</td><td>Benar</td></tr>
          <tr><td>4</td><td>Pi kira-kira berapa?</td><td>≈ 3,14 atau 22/7</td></tr>
          <tr><td>5</td><td>Jika jari-jari 7, diameter berapa?</td><td>14</td></tr>
        </tbody>
      </table>
      <figcaption>Ambang 4 dari 5 benar</figcaption>
    </figure>
  </div>
  <p class="ind-note">Guru gambar lingkaran berpusat O, tandai jari-jari OA dan diameter AB. Anak jawab lima pertanyaan.</p>
</div>`;

// ── Level 17 ──────────────────────────────────────────────────────────────────

v['17:B1'] = `<div class="ind-visual">
  <div class="ind-col">
    <figure class="ind-fig">
      <div class="ind-paragraf">
        <div class="ind-paragraf-row">
          <span class="ind-paragraf-num">1</span>
          <span>"Kucing adalah hewan peliharaan yang lincah."</span>
        </div>
        <div class="ind-paragraf-row">
          <span class="ind-paragraf-num">2</span>
          <span>"<b>Hewan</b> ini suka bergerak cepat."</span>
        </div>
        <div class="ind-paragraf-row">
          <span class="ind-paragraf-num">3</span>
          <span>"<b>Si manis</b> itu juga pandai menjaga keseimbangan."</span>
        </div>
        <div class="ind-paragraf-row">
          <span class="ind-paragraf-num">4</span>
          <span>"Kucing sering melompat dari tempat tinggi."</span>
        </div>
      </div>
      <table class="ind-nilaitempat" style="margin-top:8px">
        <thead><tr><th>PERTANYAAN</th><th>JAWABAN</th></tr></thead>
        <tbody>
          <tr><td>Kata apa yang diulang?</td><td><b>kucing</b></td></tr>
          <tr><td>"Hewan" merujuk pada apa?</td><td><b>kucing</b></td></tr>
          <tr><td>"Si manis" merujuk pada apa?</td><td><b>kucing</b></td></tr>
          <tr><td>Semua sebutan membicarakan siapa?</td><td><b>kucing</b></td></tr>
        </tbody>
      </table>
      <figcaption>Ambang 3 dari 4 tepat</figcaption>
    </figure>
  </div>
  <p class="ind-note">Guru bacakan paragraf. Anak jawab tiap pertanyaan kohesi.</p>
</div>`;

v['17:E1'] = `<div class="ind-visual">
  <div class="ind-col">
    <figure class="ind-fig">
      <table class="ind-nilaitempat">
        <thead><tr><th>BARISAN</th><th>LANJUTAN</th><th>ATURAN</th></tr></thead>
        <tbody>
          <tr><td>3, 6, 9, 12, …</td><td class="ind-nilaitempat--r"><b>15, 18</b></td><td>+3 tiap suku</td></tr>
          <tr><td>40, 35, 30, 25, …</td><td class="ind-nilaitempat--r"><b>20, 15</b></td><td>−5 tiap suku</td></tr>
          <tr><td>2, 4, 8, 16, …</td><td class="ind-nilaitempat--r"><b>32, 64</b></td><td>×2 tiap suku</td></tr>
          <tr><td>1, 4, 9, 16, …</td><td class="ind-nilaitempat--r"><b>25, 36</b></td><td>1², 2², 3², … (kuadrat)</td></tr>
        </tbody>
      </table>
      <figcaption>Ambang 3 dari 4 barisan benar lengkap dengan aturan</figcaption>
    </figure>
  </div>
  <p class="ind-note">Guru bacakan tiap barisan. Anak lanjutkan dua bilangan berikutnya dan sebutkan aturannya.</p>
</div>`;

v['17:F1'] = `<div class="ind-visual">
  <div class="ind-col">
    <figure class="ind-fig" style="align-items:center;gap:0">
      <svg viewBox="0 0 200 155" class="ind-bangun-svg" style="max-width:200px">
        <!-- Titik-titik -->
        <circle cx="30" cy="30" r="4" fill="currentColor"/>
        <circle cx="150" cy="30" r="4" fill="currentColor"/>
        <circle cx="30" cy="118" r="4" fill="currentColor"/>
        <circle cx="150" cy="100" r="4" fill="currentColor"/>
        <!-- Garis jalan -->
        <line x1="30" y1="30" x2="150" y2="30" stroke="currentColor" stroke-width="1.5"/>
        <line x1="30" y1="30" x2="30" y2="118" stroke="currentColor" stroke-width="1.5"/>
        <line x1="150" y1="30" x2="150" y2="100" stroke="currentColor" stroke-width="1.5"/>
        <line x1="30" y1="118" x2="150" y2="100" stroke="currentColor" stroke-width="1.5"/>
        <!-- Label lokasi -->
        <text x="30" y="22" text-anchor="middle" font-size="11" fill="currentColor" font-weight="bold">Rumah</text>
        <text x="150" y="22" text-anchor="middle" font-size="11" fill="currentColor" font-weight="bold">Sekolah</text>
        <text x="30" y="136" text-anchor="middle" font-size="11" fill="currentColor" font-weight="bold">Pasar</text>
        <text x="150" y="116" text-anchor="middle" font-size="11" fill="currentColor" font-weight="bold">Taman</text>
        <!-- Label jarak -->
        <text x="90" y="24" text-anchor="middle" font-size="10" fill="#c79a3b">3 cm</text>
        <text x="14" y="76" text-anchor="middle" font-size="10" fill="#c79a3b">4 cm</text>
        <text x="162" y="68" text-anchor="start" font-size="10" fill="#c79a3b">2 cm</text>
        <text x="90" y="120" text-anchor="middle" font-size="10" fill="#c79a3b">5 cm</text>
        <!-- Skala -->
        <text x="100" y="150" text-anchor="middle" font-size="10" fill="currentColor" font-style="italic">Skala: 1 cm = 2 km</text>
      </svg>
      <table class="ind-nilaitempat" style="margin-top:6px">
        <thead><tr><th>JALUR</th><th>DENAH</th><th>SEBENARNYA</th></tr></thead>
        <tbody>
          <tr><td>Rumah – Sekolah</td><td>3 cm</td><td class="ind-nilaitempat--r"><b>6 km</b></td></tr>
          <tr><td>Rumah – Pasar</td><td>4 cm</td><td class="ind-nilaitempat--r"><b>8 km</b></td></tr>
          <tr><td>Sekolah – Taman</td><td>2 cm</td><td class="ind-nilaitempat--r"><b>4 km</b></td></tr>
          <tr><td>Pasar – Taman</td><td>5 cm</td><td class="ind-nilaitempat--r"><b>10 km</b></td></tr>
        </tbody>
      </table>
      <figcaption>Ambang 3 dari 4 jarak sebenarnya benar</figcaption>
    </figure>
  </div>
  <p class="ind-note">Guru gambar denah di papan dengan skala 1 cm = 2 km. Anak hitung jarak sebenarnya tiap jalur.</p>
</div>`;

v['18:B1'] = `<div class="ind-visual">
  <div class="ind-col">
    <figure class="ind-fig">
      <div class="ind-paragraf">
        <div class="ind-paragraf-row">
          <span class="ind-paragraf-num">1</span>
          <span>"Siswa kelas besar perlu mengatur waktu belajar."</span>
        </div>
        <div class="ind-paragraf-row">
          <span class="ind-paragraf-num">2</span>
          <span>"Tugas sekolah biasanya lebih banyak."</span>
        </div>
        <div class="ind-paragraf-row ind-paragraf-row--pokok">
          <span class="ind-paragraf-num">3</span>
          <span>"<b>Karena jadwal membantu tugas tidak menumpuk.</b>"</span>
          <span class="ind-paragraf-tag">← struktur tidak lengkap</span>
        </div>
        <div class="ind-paragraf-row ind-paragraf-row--pokok">
          <span class="ind-paragraf-num">4</span>
          <span>"<b>Pisang matang berwarna kuning.</b>"</span>
          <span class="ind-paragraf-tag">← tidak koheren</span>
        </div>
      </div>
      <figcaption>Lulus bila anak menemukan 2 masalah: kalimat 3 (struktur tidak lengkap) dan kalimat 4 (tidak koheren)</figcaption>
    </figure>
  </div>
  <p class="ind-note">Guru bacakan paragraf. Anak tunjuk atau sebutkan kalimat yang bermasalah dan jelaskan mengapa.</p>
</div>`;

v['18:E1'] = `<div class="ind-visual">
  <div class="ind-col">
    <figure class="ind-fig">
      <table class="ind-nilaitempat">
        <thead><tr><th>SOAL</th><th>JAWABAN</th></tr></thead>
        <tbody>
          <tr><td>Baca: 1.250.000</td><td class="ind-nilaitempat--r"><b>satu juta dua ratus lima puluh ribu</b></td></tr>
          <tr><td>Baca: 3.600.000</td><td class="ind-nilaitempat--r"><b>tiga juta enam ratus ribu</b></td></tr>
          <tr><td>498 + 503 ≈ ?</td><td class="ind-nilaitempat--r"><b>1.000</b></td></tr>
          <tr><td>1.980 − 995 ≈ ?</td><td class="ind-nilaitempat--r"><b>1.000</b></td></tr>
          <tr><td>49 × 21 ≈ ? <span style="font-size:0.85em">(100 / 1.000 / 10.000)</span></td><td class="ind-nilaitempat--r"><b>1.000</b></td></tr>
        </tbody>
      </table>
      <figcaption>Ambang 4 dari 5 benar</figcaption>
    </figure>
  </div>
  <p class="ind-note">Guru ucapkan bilangan dan soal estimasi satu per satu. Anak baca keras / sebutkan perkiraan.</p>
</div>`;

v['18:F1'] = `<div class="ind-visual">
  <div class="ind-col">
    <figure class="ind-fig">
      <div style="display:flex;gap:8px;align-items:center;justify-content:center;flex-wrap:wrap;margin-bottom:4px">
        <svg viewBox="0 0 140 60" class="ind-bangun-svg" style="max-width:140px">
          <text x="70" y="14" text-anchor="middle" font-size="11" fill="currentColor" font-weight="bold">6  7  7  8  10</text>
          <line x1="10" y1="20" x2="130" y2="20" stroke="currentColor" stroke-width="1"/>
          <text x="70" y="32" text-anchor="middle" font-size="9" fill="#c79a3b">modus = 7</text>
          <text x="70" y="44" text-anchor="middle" font-size="9" fill="#c79a3b">median = 7</text>
          <text x="70" y="56" text-anchor="middle" font-size="9" fill="#c79a3b">mean = 38 ÷ 5 = 7,6</text>
        </svg>
      </div>
      <table class="ind-nilaitempat">
        <thead><tr><th>PERTANYAAN</th><th>JAWABAN</th></tr></thead>
        <tbody>
          <tr><td>Modus (paling sering)</td><td class="ind-nilaitempat--r"><b>7</b></td></tr>
          <tr><td>Median (nilai tengah)</td><td class="ind-nilaitempat--r"><b>7</b></td></tr>
          <tr><td>Jumlah semua data</td><td class="ind-nilaitempat--r"><b>38</b></td></tr>
          <tr><td>Banyak data</td><td class="ind-nilaitempat--r"><b>5</b></td></tr>
          <tr><td>Mean = jumlah ÷ banyak</td><td class="ind-nilaitempat--r"><b>7,6</b></td></tr>
        </tbody>
      </table>
      <figcaption>Ambang 4 dari 5 benar</figcaption>
    </figure>
  </div>
  <p class="ind-note">Guru tulis data di papan: 6 7 7 8 10 (sudah urut). Anak jawab tiap pertanyaan.</p>
</div>`;

export function indicatorVisual(level, slot) {
  return v[`${level}:${slot}`] || '';
}
