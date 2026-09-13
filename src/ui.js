// The HTML building blocks every screen shares, plus the two bits of chrome (toast, dialog).
import { escapeHtml as h } from './domain.js';
export let messageTimer;
export const field = (label, name, type = 'text', value = '', extra = '') =>
  `<label>${label}<input name="${name}" type="${type}" value="${h(value)}" ${extra}></label>`;
export const select = (label, name, items, value = '', extra = '') =>
  `<label>${label}<select name="${name}" ${extra}>${items
    .map(x => {
      const [v, t] = Array.isArray(x) ? x : [x, x];
      return `<option value="${h(v)}" ${v === value ? 'selected' : ''}>${h(t)}</option>`;
    })
    .join('')}</select></label>`;
export const area = (label, name, value = '', extra = '') =>
  `<label>${label}<textarea name="${name}" rows="3" ${extra}>${h(value)}</textarea></label>`;
export const empty = (title, text) =>
  `<div class="empty"><span>✧</span><h3>${title}</h3><p>${text}</p></div>`;
export function notify(text, error = false) {
  document.querySelector('.toast')?.remove();
  const el = document.createElement('div');
  el.className = `toast ${error ? 'error' : ''}`;
  el.role = 'status';
  el.textContent = text;
  // Modal yang terbuka berada di lapisan paling atas, jadi pesan yang ditempel ke body tertutup olehnya.
  // Pesan galat simpan justru muncul saat modal masih terbuka, maka pesan ditempel ke modal itu.
  (document.querySelector('dialog[open]') || document.body).append(el);
  clearTimeout(messageTimer);
  messageTimer = setTimeout(() => el.remove(), 6500);
}
// A screen may leave the subtitle out; an empty <p> would still take its margin.
export function heading(kicker, title, subtitle, button = '') {
  const sub = subtitle ? `<p>${subtitle}</p>` : '';
  return `<div class="page-heading"><div><div class="eyebrow">${kicker}</div><h1>${title}</h1>${sub}</div>${button}</div>`;
}
export function modal(title, body) {
  const d = document.querySelector('#modal');
  d.innerHTML = `<div class="modal-head"><h2>${title}</h2><button data-action="close" aria-label="Tutup">✕</button></div>${body}`;
  d.showModal();
}
