// Tim pengajar: hanya dibuka pemilik.
import { state } from '../state.js';

import { escapeHtml as h } from '../domain.js';
import { empty, heading } from '../ui.js';
// One row per person. Only a teacher can be switched off; the owner has no button, because an
// owner who deactivated themselves would lock the installation.
function memberRow(m) {
  const roleLabel = m.role === 'owner' ? 'Pemilik' : 'Guru';
  const toggle =
    m.role === 'teacher'
      ? `<button class="secondary" data-action="toggle-member" data-id="${h(m.email)}">${m.active ? 'Nonaktifkan' : 'Aktifkan'}</button>`
      : '';
  return `<div class="class-row"><span class="avatar">${h(m.name[0])}</span><div><h3>${h(m.name)}</h3><p>${h(m.email)} · ${roleLabel} · ${m.active ? 'Aktif' : 'Nonaktif'}</p></div>${toggle}</div>`;
}

function memberList() {
  return (
    state.members.map(m => memberRow(m)).join('') ||
    empty('Belum ada guru', 'Daftarkan email guru, lalu buat akunnya di Supabase. Buka Panduan Tim pengajar.')
  );
}

function teamHeading() {
  return heading(
    'TIM YANG SALING MENDUKUNG',
    'Guru yang mendampingi.',
    'Daftarkan email guru. Setiap guru menambahkan dan mengelola siswanya sendiri.',
    '<button class="primary" data-action="new-member">＋ Daftarkan guru</button>'
  );
}

export function teamView() {
  const note = `<div class="notice">Akun guru dibuat dan diaktifkan oleh pemilik di Supabase dengan email yang didaftarkan di sini (lihat Panduan Tim pengajar). Guru lalu menambahkan siswanya sendiri di menu Data siswa.</div>`;
  return `${teamHeading()}<div class="panel">${memberList()}</div>${note}`;
}
