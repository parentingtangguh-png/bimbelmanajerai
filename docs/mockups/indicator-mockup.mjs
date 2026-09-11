// Mockup only (no app code changed): renders the evaluation card "Sekarang" vs
// "Sesudah" with the app's real CSS, using real curriculum goals for level 5.
// Run from the repo root: node <this file>
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import path from 'node:path';

const repo = process.cwd();
const { chromium } = createRequire(path.join(repo, 'package.json'))('@playwright/test');
const out = path.dirname(fileURLToPath(import.meta.url));
const css = (await Promise.all(['style.css', 'curriculum.css', 'owner.css', 'schedule.css', 'student-form.css']
  .map(f => readFile(path.join(repo, 'src', f), 'utf8')))).join('\n');

// Proposed styling for the indicator block (would live in the app's CSS).
const proposed = `
.compare{display:grid;grid-template-columns:1fr 1.25fr;gap:24px;align-items:start}
.compare h2.col{font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin:0 0 10px}
.indicator{border:1px solid var(--line);border-radius:10px;padding:12px 14px;margin:10px 0 12px;background:#1b1d18;grid-column:1/-1}
.target-eval .rating-row{grid-column:1/-1;display:grid;grid-template-columns:1fr 2fr;gap:14px}
.indicator li label{color:var(--ink);font-weight:400}
.indicator li input[type=checkbox]{width:16px;height:16px;min-height:0;flex:0 0 16px;padding:0}
.indicator .goal{font-size:13px;line-height:1.5;margin:0 0 8px}
.indicator .goal b{color:var(--ink)}
.indicator ul{list-style:none;margin:0;padding:0;display:grid;gap:6px}
.indicator li label{display:flex;gap:10px;align-items:flex-start;font-size:13px;line-height:1.45;cursor:pointer}
.indicator li input{margin-top:3px;accent-color:var(--green)}
.indicator .rule{font-size:12px;color:var(--muted);margin:10px 0 0}
.suggest{font-size:12px;margin:8px 0 0;padding:6px 10px;border-radius:8px;display:inline-block}
.suggest.t{background:#263328;color:#b8d5a5}.suggest.mb{background:#40331b;color:#edcc75}
.rating-guide{font-size:12px;color:var(--muted);line-height:1.6;margin:0 0 12px;padding:10px 12px;border-left:3px solid var(--green);background:#1b1d18;border-radius:0 8px 8px 0}
.rating-guide b{color:var(--ink)}
@media(max-width:700px){.compare{grid-template-columns:1fr}.compare .before{display:none}.target-eval .rating-row{grid-template-columns:1fr}}
`;

const targets = [
  { subject: 'Membaca', level: 5,
    goal: 'Membaca teks 3–4 kalimat dengan kelancaran awal dan menemukan informasi tersurat.',
    oldCriteria: 'Menunjukkan minimal 4 dari 5 respons tepat dalam dua sesi berbeda dan dapat menjelaskan jawaban bila diminta.',
    items: ['Membaca nyaring teks 3–4 kalimat tanpa mengeja huruf demi huruf',
            'Salah baca paling banyak 2 kata dan bisa membetulkan sendiri',
            'Menjawab 2 pertanyaan siapa/apa/di mana yang jawabannya ada di teks',
            'Menunjuk kalimat di teks yang memuat jawaban'],
    checked: 4, rating: 'T', note: 'Membaca teks “Pasar Pagi” lancar, 1 kata dibetulkan sendiri; menjawab 2 pertanyaan dan menunjuk kalimatnya.' },
  { subject: 'Matematika', level: 5,
    goal: 'Memahami puluhan dan satuan sampai 100 serta membandingkan bilangan.',
    oldCriteria: 'Menyelesaikan minimal 4 dari 5 tugas setara, menunjukkan strategi, dan memeriksa jawaban dalam dua sesi.',
    items: ['Menyusun bilangan sampai 100 dengan ikatan puluhan dan satuan (47 = 4 puluhan 7 satuan)',
            'Membaca dan menulis lambang bilangan sampai 100',
            'Membandingkan dua bilangan dengan >, <, = dan menjelaskan alasannya',
            'Mengurutkan 4 bilangan dari terkecil ke terbesar'],
    checked: 2, rating: 'MB', note: 'Menyusun dan menulis bilangan benar; membandingkan masih perlu contoh dari guru.' },
];

const ratingOptions = sel => [['', 'Pilih perkembangan'], ['BT', 'Belum tampak'], ['MB', 'Mulai berkembang'], ['T', 'Tercapai']]
  .map(([v, t]) => `<option value="${v}" ${v === sel ? 'selected' : ''}>${t}</option>`).join('');

const head = `<div class="panel-heading"><div><h2>Doni Saputra <small>· Kelompok 1</small></h2><p>Dinosaurus · Membaca 5 · Matematika 5</p></div><span class="badge amber">Sesi berlangsung</span></div>`;

const before = `<article class="panel session-card">${head}<form class="evaluation competency-evaluation"><h3>01 / Bukti target inti</h3>${targets.map(t => `
  <div class="target-eval"><div><span class="badge green">${t.subject} · Level ${t.level}</span><small>Dua bukti Tercapai dibutuhkan sebelum naik level.</small></div>
  <label>Perkembangan<select>${ratingOptions('')}</select></label>
  <label>Bukti singkat<textarea rows="2"></textarea></label></div>`).join('')}</form></article>`;

const after = `<article class="panel session-card">${head}<form class="evaluation competency-evaluation"><h3>01 / Bukti target inti</h3>
  <p class="rating-guide"><b>Panduan menilai</b> · <b>Belum tampak</b>: belum terlihat walau dibantu · <b>Mulai berkembang</b>: terlihat sebagian atau masih dengan bantuan · <b>Tercapai</b>: semua indikator terlihat secara mandiri.</p>${targets.map(t => `
  <div class="target-eval"><div><span class="badge green">${t.subject} · Level ${t.level} · Fase A</span><small>Dua bukti Tercapai pada kesempatan berbeda dibutuhkan sebelum naik level.</small></div>
  <div class="indicator"><p class="goal"><b>Tujuan level ${t.level}:</b> ${t.goal}</p><ul>${t.items.map((it, i) => `<li><label><input type="checkbox" ${i < t.checked ? 'checked' : ''}>${it}</label></li>`).join('')}</ul>
  <span class="suggest ${t.rating === 'T' ? 't' : 'mb'}">${t.checked}/${t.items.length} indikator terlihat → saran: ${t.rating === 'T' ? 'Tercapai' : 'Mulai berkembang'}</span></div>
  <div class="rating-row"><label>Perkembangan<select>${ratingOptions(t.rating)}</select></label>
  <label>Bukti singkat<textarea rows="2">${t.note}</textarea></label></div></div>`).join('')}</form></article>`;

const page = `<main class="workspace" style="margin:0;width:100%"><section class="content">
<div class="compare"><div class="before"><h2 class="col">Sekarang</h2>${before}</div><div><h2 class="col">Sesudah (usulan)</h2>${after}</div></div></section></main>`;

const browser = await chromium.launch({ channel: 'chrome' });
for (const [name, width, height] of [['desktop', 1400, 1150], ['mobile', 390, 1500]]) {
  const p = await browser.newPage({ viewport: { width, height } });
  await p.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${css}${proposed}</style></head><body>${page}</body></html>`);
  await p.screenshot({ path: path.join(out, `indicator-${name}.png`), fullPage: true });
  console.log(`${name}: saved, overflow=${await p.evaluate(() => document.documentElement.scrollWidth > innerWidth)}`);
  await p.close();
}
await browser.close();
