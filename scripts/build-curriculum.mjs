// Membangkitkan migrasi kurikulum 8 level dari dokumen terkunci di docs/curriculum/.
// Dokumen adalah sumber kebenaran; migrasi hanya salinannya. Jalankan setelah dokumen berubah:
//   node scripts/build-curriculum.mjs
// tests/curriculum-docs.test.mjs gagal bila migrasi tidak sama dengan hasil pembangkit.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const MIGRATION = 'supabase/migrations/20260915000000_curriculum_8_levels.sql';

// Nomor antrean per level: urutan slot yang dikunci arsitektur, lalu English dan Karakter.
export const SLOTS = ['A1', 'B1', 'E1', 'D1', 'C1', 'F1', 'A2', 'B2', 'E2', 'D2', 'C2', 'F2', 'EN', 'KR'];
const STRANDS = [
  ['A', 'docs/curriculum/indikator/alur-a.md'],
  ['B', 'docs/curriculum/indikator/alur-b.md'],
  ['C', 'docs/curriculum/indikator/alur-c.md'],
  ['D', 'docs/curriculum/indikator/alur-d.md'],
  ['E', 'docs/curriculum/indikator/alur-e.md'],
  ['F', 'docs/curriculum/indikator/alur-f.md'],
  ['EK', 'docs/curriculum/indikator/english-karakter.md']
];

const read = rel => fs.readFileSync(path.join(ROOT, rel), 'utf8').replace(/^﻿/, '').replace(/\r\n/g, '\n');
const clean = s =>
  s
    .trim()
    .replace(/^\*\*(.*)\*\*$/, '$1')
    .trim();
const cells = line =>
  line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map(c => c.trim());

// Membagi dokumen menjadi bagian "## Judul".
function sections(md) {
  const out = [];
  let cur = null;
  for (const line of md.split('\n')) {
    const m = /^## (.+)$/.exec(line);
    if (m) {
      cur = { title: m[1].trim(), lines: [] };
      out.push(cur);
    } else if (cur) cur.lines.push(line);
  }
  return out;
}

// Mengambil tabel indikator (baris header "| Level | Kompetensi ...") dari satu bagian.
function takeIndicatorTable(lines) {
  const start = lines.findIndex(l => /^\|\s*Level\s*\|\s*Kompetensi\s*\|/.test(l));
  if (start < 0) return null;
  let end = start + 2;
  while (end < lines.length && lines[end].trim().startsWith('|')) end++;
  const rows = lines.slice(start + 2, end).map(l => {
    const c = cells(l);
    if (c.length !== 5) throw new Error(`Baris tabel indikator harus 5 kolom: ${l.slice(0, 80)}`);
    const level = Number(clean(c[0]).replace(/^L/, ''));
    if (!(level >= 1 && level <= 8)) throw new Error(`Level tidak dikenali: ${c[0]}`);
    return { level, competency: c[1], method: c[2], material: c[3], success: c[4] };
  });
  const rest = [...lines.slice(0, start), ...lines.slice(end)].join('\n').trim();
  return { rows, rest };
}

function slotOf(strand, title) {
  if (strand === 'EK') return /^English/.test(title) ? 'EN' : /^Karakter/.test(title) ? 'KR' : null;
  const m = new RegExp(`^(${strand}[12])\\b`).exec(title);
  return m ? m[1] : null;
}

export function buildCurriculum() {
  const indicators = [];
  const notes = [];
  for (const [strand, file] of STRANDS) {
    const md = read(file);
    let position = 0;
    for (const sec of sections(md)) {
      const table = takeIndicatorTable(sec.lines);
      const slot = table && slotOf(strand, sec.title);
      if (table && slot) {
        for (const r of table.rows) indicators.push({ ...r, slot, number: SLOTS.indexOf(slot) + 1 });
        if (table.rest)
          notes.push({ doc: strand, position: ++position, title: sec.title, markdown: table.rest });
      } else if (!/^Tanggapan/.test(sec.title)) {
        notes.push({
          doc: strand,
          position: ++position,
          title: sec.title,
          markdown: sec.lines.join('\n').trim()
        });
      }
    }
  }

  const tema = read('docs/curriculum/cp-level-tema.md');
  const byTitle = Object.fromEntries(sections(tema).map(s => [s.title, s.lines.join('\n')]));
  const cp = byTitle['CP'].trim();
  const levels = byTitle['8 Level']
    .split('\n')
    .filter(l => /^\|\s*L\d/.test(l))
    .map(l => {
      const c = cells(l);
      return { level: Number(c[0].replace(/^L/, '')), title: c[1], description: c[2] };
    });

  const themes = [];
  const subthemes = [];
  const english = [];
  const blocks = byTitle['Tema'].split(/^### /m).slice(1);
  for (const block of blocks) {
    const [head, ...body] = block.split('\n');
    const hm = /^Tema (\d+) — (.+) \(pertemuan (\d+)–(\d+)\)$/.exec(head.trim());
    if (!hm) throw new Error(`Judul tema tidak dikenali: ${head}`);
    const number = Number(hm[1]);
    const field = label => {
      const line = body.find(l => l.startsWith(`- **${label}:**`));
      if (!line) throw new Error(`Tema ${number}: bagian "${label}" tidak ditemukan`);
      return line.slice(`- **${label}:**`.length).trim();
    };
    // Deskripsi: paragraf sebelum daftar pertama (baris sesudah daftar bukan bagian tema).
    const firstBullet = body.findIndex(l => l.startsWith('- '));
    const description = body
      .slice(0, firstBullet)
      .filter(l => l.trim())
      .join(' ')
      .trim();
    themes.push({
      number,
      name: hm[2],
      first_meeting: Number(hm[3]),
      last_meeting: Number(hm[4]),
      description,
      objects: field('Benda nyata bersama'),
      vocabulary: field('Kosakata bahasa Indonesia'),
      character: field('Situasi Karakter alami'),
      illustration: field('Ilustrasi lintas level')
    });
    field('Subtema')
      .split('·')
      .forEach((part, i) => {
        const sm = /^(\d+)–(\d+) (.+)$/.exec(part.trim());
        if (!sm) throw new Error(`Tema ${number}: subtema tidak dikenali: ${part}`);
        subthemes.push({
          theme: number,
          position: i + 1,
          name: sm[3].trim(),
          first_meeting: Number(sm[1]),
          last_meeting: Number(sm[2])
        });
      });
    field('English — kata benda')
      .split(',')
      .forEach((w, i) => {
        const text = w.trim();
        const requestable = /\\\*$/.test(text);
        english.push({
          theme: number,
          kind: 'noun',
          position: i + 1,
          text: text.replace(/\\\*$/, ''),
          requestable
        });
      });
    field('English — frasa tindakan')
      .split(',')
      .forEach((p, i) =>
        english.push({ theme: number, kind: 'phrase', position: i + 1, text: p.trim(), requestable: false })
      );
  }
  const temaUmum = byTitle['Catatan Umum Tema'];
  if (temaUmum)
    notes.push({ doc: 'TEMA', position: 1, title: 'Catatan Umum Tema', markdown: temaUmum.trim() });

  const data = { cp, levels, indicators, notes, themes, subthemes, english };
  return { data, sql: toSql(data) };
}

const q = v =>
  v === null || v === undefined
    ? 'null'
    : typeof v === 'number' || typeof v === 'boolean'
      ? String(v)
      : `'${String(v).replace(/'/g, "''")}'`;
const values = (rows, cols) => rows.map(r => `  (${cols.map(c => q(r[c])).join(', ')})`).join(',\n');

function toSql(d) {
  return `-- DIBANGKITKAN OTOMATIS oleh scripts/build-curriculum.mjs dari docs/curriculum/. Jangan disunting tangan.
-- Kurikulum 8 level dipasang berdampingan dengan kurikulum pilot lama (Fase 1 docs/rencana-aplikasi.md).
-- Hanya dibaca aplikasi; tidak ada kebijakan tulis, isi berubah lewat dokumen lalu migrasi baru.

create table public.k8_cp(
  id integer primary key check (id = 1),
  text text not null check (length(trim(text)) > 0)
);
create table public.k8_levels(
  level integer primary key check (level between 1 and 8),
  title text not null check (length(trim(title)) > 0),
  description text not null check (length(trim(description)) > 0)
);
create table public.k8_indicators(
  level integer not null references public.k8_levels(level),
  number integer not null check (number between 1 and 14),
  slot text not null check (slot in (${SLOTS.map(s => `'${s}'`).join(', ')})),
  competency text not null check (length(trim(competency)) > 0),
  method text not null check (length(trim(method)) > 0),
  material text not null check (length(trim(material)) > 0),
  success text not null check (length(trim(success)) > 0),
  primary key (level, number),
  unique (level, slot)
);
create table public.k8_notes(
  doc text not null check (doc in ('A', 'B', 'C', 'D', 'E', 'F', 'EK', 'TEMA')),
  position integer not null check (position >= 1),
  title text not null,
  markdown text not null,
  primary key (doc, position)
);
create table public.k8_themes(
  number integer primary key check (number between 1 and 8),
  name text not null check (length(trim(name)) > 0),
  first_meeting integer not null check (first_meeting between 1 and 192),
  last_meeting integer not null check (last_meeting between 1 and 192),
  description text not null,
  objects text not null,
  vocabulary text not null,
  character text not null,
  illustration text not null,
  check (last_meeting >= first_meeting)
);
create table public.k8_subthemes(
  theme integer not null references public.k8_themes(number),
  position integer not null check (position between 1 and 4),
  name text not null check (length(trim(name)) > 0),
  first_meeting integer not null check (first_meeting between 1 and 192),
  last_meeting integer not null check (last_meeting between 1 and 192),
  primary key (theme, position),
  check (last_meeting >= first_meeting)
);
create table public.k8_theme_english(
  theme integer not null references public.k8_themes(number),
  kind text not null check (kind in ('noun', 'phrase')),
  position integer not null check (position >= 1),
  text text not null check (length(trim(text)) > 0),
  requestable boolean not null default false,
  primary key (theme, kind, position),
  check (kind = 'noun' or not requestable)
);
-- Kata benda English tidak berulang antartema (english-karakter.md).
create unique index k8_theme_english_noun_unique on public.k8_theme_english(lower(text)) where kind = 'noun';

do $$ declare t text; begin
  foreach t in array array['k8_cp','k8_levels','k8_indicators','k8_notes','k8_themes','k8_subthemes','k8_theme_english'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy %I on public.%I for select to authenticated using (is_member())', t || '_read', t);
    execute format('grant select on public.%I to authenticated', t);
  end loop;
end $$;

insert into public.k8_cp(id, text) values (1, ${q(d.cp)});

insert into public.k8_levels(level, title, description) values
${values(d.levels, ['level', 'title', 'description'])};

insert into public.k8_indicators(level, number, slot, competency, method, material, success) values
${values(d.indicators, ['level', 'number', 'slot', 'competency', 'method', 'material', 'success'])};

insert into public.k8_notes(doc, position, title, markdown) values
${values(d.notes, ['doc', 'position', 'title', 'markdown'])};

insert into public.k8_themes(number, name, first_meeting, last_meeting, description, objects, vocabulary, character, illustration) values
${values(d.themes, ['number', 'name', 'first_meeting', 'last_meeting', 'description', 'objects', 'vocabulary', 'character', 'illustration'])};

insert into public.k8_subthemes(theme, position, name, first_meeting, last_meeting) values
${values(d.subthemes, ['theme', 'position', 'name', 'first_meeting', 'last_meeting'])};

insert into public.k8_theme_english(theme, kind, position, text, requestable) values
${values(d.english, ['theme', 'kind', 'position', 'text', 'requestable'])};
`;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { data, sql } = buildCurriculum();
  fs.writeFileSync(path.join(ROOT, MIGRATION), sql);
  console.log(
    `${MIGRATION}: ${data.levels.length} level, ${data.indicators.length} indikator, ${data.themes.length} tema, ` +
      `${data.subthemes.length} subtema, ${data.english.length} kosakata English, ${data.notes.length} catatan`
  );
}
