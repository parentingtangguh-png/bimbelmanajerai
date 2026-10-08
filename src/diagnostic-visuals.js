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
  <p class="ind-note">★ = tulisan huruf (jawaban). Bentuk geometri diganti goresan nyata saat tes.</p>
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
  <p class="ind-note">★ (tebal) = jawaban benar. Kunci posisi: 3; 4; 3; 2; 3; 2.</p>
</div>`;

// ── Level 3 ──────────────────────────────────────────────────────────────────

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
      <div class="ind-pola">
        <span class="ind-blok ind-blok--merah"></span><span class="ind-blok ind-blok--biru"></span><span class="ind-blok ind-blok--hijau"></span>
        <span class="ind-blok ind-blok--merah"></span><span class="ind-blok ind-blok--biru"></span><span class="ind-blok ind-blok--hijau"></span>
        <span class="ind-blok ind-blok--merah"></span><span class="ind-blok ind-blok--biru"></span><span class="ind-blok ind-blok--hijau"></span>
        <span class="ind-blok-gap"></span>
        <span class="ind-blok ind-blok--merah ind-blok--lanjut"></span><span class="ind-blok ind-blok--biru ind-blok--lanjut"></span><span class="ind-blok ind-blok--hijau ind-blok--lanjut"></span>
      </div>
      <figcaption>merah–biru–hijau · lanjut: <strong>merah–biru–hijau</strong></figcaption>
    </figure>
    <figure class="ind-fig ind-fig--row">
      <div class="ind-pola">
        <span class="ind-blok ind-blok--kuning"></span><span class="ind-blok ind-blok--putih"></span><span class="ind-blok ind-blok--hitam"></span>
        <span class="ind-blok ind-blok--kuning"></span><span class="ind-blok ind-blok--putih"></span><span class="ind-blok ind-blok--hitam"></span>
        <span class="ind-blok ind-blok--kuning"></span><span class="ind-blok ind-blok--putih"></span><span class="ind-blok ind-blok--hitam"></span>
        <span class="ind-blok-gap"></span>
        <span class="ind-blok ind-blok--kuning ind-blok--lanjut"></span><span class="ind-blok ind-blok--putih ind-blok--lanjut"></span><span class="ind-blok ind-blok--hitam ind-blok--lanjut"></span>
      </div>
      <figcaption>kuning–putih–hitam · lanjut: <strong>kuning–putih–hitam</strong></figcaption>
    </figure>
    <figure class="ind-fig ind-fig--row">
      <div class="ind-pola">
        <span class="ind-blok ind-blok--biru"></span><span class="ind-blok ind-blok--merah"></span><span class="ind-blok ind-blok--kuning"></span>
        <span class="ind-blok ind-blok--biru"></span><span class="ind-blok ind-blok--merah"></span><span class="ind-blok ind-blok--kuning"></span>
        <span class="ind-blok ind-blok--biru"></span><span class="ind-blok ind-blok--merah"></span><span class="ind-blok ind-blok--kuning"></span>
        <span class="ind-blok-gap"></span>
        <span class="ind-blok ind-blok--biru ind-blok--lanjut"></span><span class="ind-blok ind-blok--merah ind-blok--lanjut"></span><span class="ind-blok ind-blok--kuning ind-blok--lanjut"></span>
      </div>
      <figcaption>biru–merah–kuning · lanjut: <strong>biru–merah–kuning</strong></figcaption>
    </figure>
    <figure class="ind-fig ind-fig--row">
      <div class="ind-pola">
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

export function indicatorVisual(level, slot) {
  return v[`${level}:${slot}`] || '';
}
