// Penampil Markdown kecil untuk isi kurikulum dari docs/curriculum/ (judul, daftar, tabel, tebal, miring,
// kode). Semua teks di-escape lebih dulu; tautan hanya ditampilkan teksnya.
import { escapeHtml } from './domain.js';

const STAR = '';

export function inlineMarkdown(text) {
  let s = escapeHtml(String(text ?? '').replace(/\\\*/g, STAR));
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*\w])\*([^*\s][^*]*)\*(?!\w)/g, '$1<em>$2</em>');
  s = s.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');
  return s.replaceAll(STAR, '*');
}

const cellsOf = line =>
  line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map(c => c.trim());

export function renderMarkdown(md) {
  const lines = String(md ?? '')
    .replace(/\r\n/g, '\n')
    .split('\n');
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    const head = /^(#{1,4})\s+(.*)$/.exec(line);
    if (head) {
      const level = Math.min(head[1].length + 2, 6);
      out.push(`<h${level}>${inlineMarkdown(head[2])}</h${level}>`);
      i++;
      continue;
    }
    if (line.trim().startsWith('|')) {
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) rows.push(lines[i++]);
      const [first, , ...body] = rows;
      const th = cellsOf(first)
        .map(c => `<th>${inlineMarkdown(c)}</th>`)
        .join('');
      const tb = body
        .map(
          r =>
            `<tr>${cellsOf(r)
              .map(c => `<td>${inlineMarkdown(c)}</td>`)
              .join('')}</tr>`
        )
        .join('');
      out.push(
        `<div class="md-table"><table><thead><tr>${th}</tr></thead><tbody>${tb}</tbody></table></div>`
      );
      continue;
    }
    const bullet = /^\s*[-*]\s+/;
    const numbered = /^\s*\d+\.\s+/;
    if (bullet.test(line) || numbered.test(line)) {
      const tag = numbered.test(line) ? 'ol' : 'ul';
      const re = tag === 'ol' ? numbered : bullet;
      const items = [];
      while (i < lines.length && re.test(lines[i])) {
        let item = lines[i++].replace(re, '');
        while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !re.test(lines[i]))
          item += ' ' + lines[i++].trim();
        items.push(`<li>${inlineMarkdown(item)}</li>`);
      }
      out.push(`<${tag}>${items.join('')}</${tag}>`);
      continue;
    }
    const para = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{1,4})\s/.test(lines[i]) &&
      !lines[i].trim().startsWith('|') &&
      !bullet.test(lines[i]) &&
      !numbered.test(lines[i])
    )
      para.push(lines[i++].trim());
    out.push(`<p>${inlineMarkdown(para.join(' '))}</p>`);
  }
  return out.join('');
}
