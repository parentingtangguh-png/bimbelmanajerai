// Membangkitkan src/kabar-data.js dari docs/curriculum/kabar-orang-tua.md (kalimat pesan WhatsApp orang tua).
// Dokumen adalah sumber kebenaran; jalankan setelah dokumen berubah:
//   node scripts/build-kabar.mjs
// tests/kabar.test.mjs gagal bila src/kabar-data.js tidak sama dengan hasil pembangkit.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const DOC = 'docs/curriculum/kabar-orang-tua.md';
export const OUT = 'src/kabar-data.js';

const cells = line =>
  line
    .split('|')
    .slice(1, -1)
    .map(c => c.trim());
const list = (md, title) => {
  const part = md.split(`### ${title}\n`)[1];
  if (!part) throw new Error(`Bagian ${title} tidak ditemukan`);
  return part
    .split(/\n#/)[0]
    .split('\n')
    .filter(l => /^\d+\. /.test(l))
    .map(l => l.replace(/^\d+\. /, '').trim());
};

export function buildKabar() {
  const md = fs.readFileSync(path.join(ROOT, DOC), 'utf8').replace(/^﻿/, '').replace(/\r\n/g, '\n');
  const indicators = md
    .split('\n')
    .filter(l => /^\| \d \| \d+ \|/.test(l))
    .map(l => {
      const [level, number, slot, berhasil, berlatih, berikutnya, rumah] = cells(l);
      return {
        level: Number(level),
        number: Number(number),
        slot,
        berhasil,
        berlatih,
        berikutnya,
        rumah: rumah === '-' ? '' : rumah
      };
    });
  const themes = md
    .split('## C.')[1]
    .split('\n## ')[0]
    .split('\n')
    .filter(l => l.startsWith('| ') && !l.startsWith('| tema') && !l.startsWith('|---'))
    .map(l => {
      const [tema, subtema, kait] = cells(l);
      return { tema, subtema, kait };
    });
  const data = {
    indicators,
    themes,
    penyemangat: list(md, 'PENYEMANGAT'),
    penyemangatUlang: list(md, 'PENYEMANGAT_ULANG'),
    penutup: list(md, 'PENUTUP')
  };
  const js = `// DIBANGKITKAN oleh scripts/build-kabar.mjs dari ${DOC}. Jangan disunting tangan.\nexport const KABAR = ${JSON.stringify(data, null, 1)};\n`;
  return { data, js };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { data, js } = buildKabar();
  fs.writeFileSync(path.join(ROOT, OUT), js);
  console.log(`${OUT}: ${data.indicators.length} indikator, ${data.themes.length} subtema`);
}
