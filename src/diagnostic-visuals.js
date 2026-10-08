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
          <tr><td class="muted">(1) sisi sama panjang semua</td><td><strong>persegi</strong></td></tr>
          <tr><td class="muted">(2) memiliki 3 sisi</td><td><strong>segitiga</strong></td></tr>
          <tr><td class="muted">(3) tidak memiliki sudut</td><td><strong>lingkaran</strong></td></tr>
          <tr><td class="muted">(4) memiliki 4 sudut</td><td><strong>persegi / persegi panjang</strong></td></tr>
          <tr><td class="muted">(5) tidak punya sudut sama sekali</td><td><strong>lingkaran</strong></td></tr>
        </tbody>
      </table>
    </figure>
  </div>
  <p class="ind-note">Guru gambar 4 bangun di kertas. Anak tunjuk bangun lalu sebutkan satu sifatnya. Ambang 4 dari 5.</p>
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
          <line x1="40" y1="40" x2="55" y2="15" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
          <line x1="40" y1="40" x2="40" y2="66" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <circle cx="40" cy="40" r="2.5" fill="currentColor"/>
        </svg>
        <small><strong>07.30</strong></small>
      </div>
      <div class="ind-jam-wrap">
        <svg viewBox="0 0 80 80" width="72" height="72" class="ind-bangun-svg">
          <circle cx="40" cy="40" r="36" fill="none" stroke="currentColor" stroke-width="2"/>
          <line x1="40" y1="40" x2="40" y2="14" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
          <line x1="40" y1="40" x2="56" y2="40" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
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

export function indicatorVisual(level, slot) {
  return v[`${level}:${slot}`] || '';
}
