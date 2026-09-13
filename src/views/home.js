// Menu utama layar HP: sapaan, slogan, kartu tujuan, dan doa penutup. Hanya tampil di bawah
// 620px; di layar lebar tempatnya diambil alih sidebar, jadi CSS yang menyembunyikannya.
import { state, labels, homeKeys, sloganOfTheMoment, doaOfTheDay } from '../state.js';
import { escapeHtml as h } from '../domain.js';

// Motif daun yang sama dengan dasbor (growth-art), dipakai dua kali: kecil sebagai logo di kiri
// atas, besar dan samar sebagai latar. Markupnya identik supaya CSS-nya bisa dipakai bersama.
export const leafArt = () =>
  '<div class="growth-art" aria-hidden="true"><div class="orbit"></div><span class="petal p1"></span><span class="petal p2"></span><span class="petal p3"></span><span class="stem"></span></div>';

// Ilustrasi guru: gambar tetap, bukan foto, supaya tidak ada data pribadi di repo publik.
const teacherArt = () =>
  `<div class="home-teacher" title="${h(state.name)}"><svg width="34" height="34" viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="18" fill="#2b3140"/><path d="M18 8c5 0 7 3 7 7v2h-1l-1-3c-3 1.5-7 1.5-10 0l-1 3h-1v-2c0-4 2-7 7-7Z" fill="#3d4557"/><circle cx="18" cy="18" r="6" fill="#e6b98f"/><path d="M9 32c1.5-4 4.5-6 9-6s7.5 2 9 6" fill="#c79a3b"/><g stroke="#0d0f0d" stroke-width="1.1" fill="none"><circle cx="15.6" cy="17.6" r="2.5"/><circle cx="21.2" cy="17.6" r="2.5"/><path d="M18.1 17.6h.6M13.1 17.2l-1.4-.5M23.7 17.2l1.4-.5"/></g></svg></div>`;

// Kepala dan doa dipakai di semua tab, bukan hanya di menu utama, jadi keduanya diekspor dan
// dipasang main.js di luar .home. Logonya membawa pulang ke menu: di layar HP sidebar tidak ada,
// jadi inilah satu-satunya jalan kembali.
export function homeTop(org) {
  const brand = `<button class="home-brand" data-view="${homeKeys.ringkasan}" aria-label="Kembali ke menu utama"><span class="home-mark" aria-hidden="true">${leafArt()}</span><span><strong>${h(org)}</strong><small>Ruang tumbuh bersama</small></span></button>`;
  const keluar =
    '<button class="home-keluar" data-action="logout" title="Keluar" aria-label="Keluar akun">↗</button>';
  return `<div class="home-top">${brand}<div class="home-corner">${teacherArt()}${keluar}</div></div>`;
}

function homeGreeting() {
  const today = new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'full',
    timeZone: 'Asia/Jakarta'
  }).format(new Date());
  // Slogan sudah berupa HTML dengan <br> di state.js, jadi tidak di-escape.
  return `<h1 class="home-hello">Assalamu’alaikum, ${h(state.name.split(' ')[0])}</h1><p class="home-date">${h(today)}</p><div class="home-motto"><p>${sloganOfTheMoment()}</p></div>`;
}

// Ikon digambar, bukan glyph geometris: guru harus bisa menebak isi kartu sebelum membaca judulnya.
const icons = {
  [homeKeys.kelas]:
    '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4M7.5 12.5l2.5 2.5 5-5.5"/>',
  [homeKeys.ringkasan]: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  [homeKeys.siswa]:
    '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-5 6-5s6 1.7 6 5"/><circle cx="17.5" cy="9.5" r="2.2"/><path d="M17 15c2.4 0 4 1.4 4 4"/>',
  [homeKeys.kurikulum]:
    '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5V5.5Z"/><path d="M9 8h7M9 12h5"/>',
  [homeKeys.tim]: '<circle cx="12" cy="7" r="3.4"/><path d="M5 20c0-3.6 3.1-5.6 7-5.6s7 2 7 5.6"/>'
};
const blurbs = {
  [homeKeys.kelas]: 'Buka sesi, catat kehadiran, isi evaluasi',
  [homeKeys.ringkasan]: 'Melihat kemajuan dan siapa yang perlu perhatian',
  [homeKeys.siswa]: 'Menambah anak, mengubah profil dan statusnya',
  [homeKeys.kurikulum]: 'Membaca tujuan dan indikator tiap level',
  [homeKeys.tim]: 'Mendaftarkan guru dan melihat timnya'
};

function homeCard(key, wide) {
  const icon = `<div class="home-ico"><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[key]}</svg></div>`;
  const teks = `<b>${labels[key]}</b><span>${blurbs[key]}</span>`;
  return wide
    ? `<button class="home-card wide" data-view="${key}">${icon}<div>${teks}</div></button>`
    : `<button class="home-card" data-view="${key}">${icon}${teks}</button>`;
}

// Yang melintang penuh adalah tempat kerja harian dan acuan; yang berdampingan adalah melihat
// dan mengelola. Pemilik tidak membuka kelas, jadi tempat itu diisi Tim pengajar.
function homeCards() {
  const utama = state.role === 'owner' ? homeKeys.tim : homeKeys.kelas;
  return `<nav class="home-menu">${homeCard(utama, true)}${homeCard(homeKeys.ringkasan)}${homeCard(homeKeys.siswa)}${homeCard(homeKeys.kurikulum, true)}</nav>`;
}

export function homeDoa() {
  const [arab, arti, sumber] = doaOfTheDay();
  const sandi = '<button class="home-sandi" data-action="password">⊟ Ganti kata sandi</button>';
  return `<footer class="home-doa"><p class="ar" dir="rtl">${h(arab)}</p><p class="id">${h(arti)}<span class="sumber">${h(sumber)}</span></p>${sandi}</footer>`;
}

// Navbar bawah: satu-satunya cara berpindah tab di HP, karena sidebar disembunyikan. Ikonnya
// dipakai ulang dari kartu menu supaya guru mengenali lambang yang sama di dua tempat.
const navIcons = {
  ...icons,
  beranda: '<path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1v-9.5Z"/>'
};
function navItem(key, ikon, teks) {
  const aktif = state.view === key ? ' aktif' : '';
  const ariaAktif = state.view === key ? ' aria-current="page"' : '';
  return `<button class="home-nav-item${aktif}" data-view="${key}"${ariaAktif}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ikon}</svg><span>${teks}</span></button>`;
}
export function homeNav() {
  const ketiga = state.role === 'owner' ? homeKeys.tim : homeKeys.kelas;
  return `<nav class="home-nav" aria-label="Pindah layar">${navItem(homeKeys.ringkasan, navIcons.beranda, labels[homeKeys.ringkasan])}${navItem(homeKeys.siswa, navIcons[homeKeys.siswa], 'Siswa')}${navItem(ketiga, navIcons[ketiga], labels[ketiga])}${navItem(homeKeys.kurikulum, navIcons[homeKeys.kurikulum], labels[homeKeys.kurikulum])}</nav>`;
}

// Isi menu saja. Kepala dan doa dipasang main.js supaya tab lain ikut memakainya.
export function homeMenu() {
  const latar = `<div class="home-leaf" aria-hidden="true">${leafArt()}</div>`;
  return `<div class="home">${latar}${homeGreeting()}<div class="home-label">RUANG KERJA</div>${homeCards()}</div>`;
}
