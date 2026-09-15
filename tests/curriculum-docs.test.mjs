import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildCurriculum, MIGRATION, SLOTS } from '../scripts/build-curriculum.mjs';

const read = async rel =>
  (await readFile(new URL(`../${rel}`, import.meta.url), 'utf8')).replace(/\r\n/g, '\n');
const norm = s =>
  s
    .replace(/\*\*/g, '')
    .replace(/\\\*/g, '*')
    .replace(/[.\s]+$/, '')
    .trim();

test('migrasi kurikulum 8 level sama dengan hasil pembangkit dari dokumen', async () => {
  const { sql } = buildCurriculum();
  assert.equal(
    (await read(MIGRATION)).replace(/\r\n/g, '\n'),
    sql,
    'dokumen berubah: jalankan node scripts/build-curriculum.mjs'
  );
});

test('kurikulum 8 level lengkap dan setia pada milestone', async () => {
  const { data } = buildCurriculum();
  assert.equal(data.levels.length, 8);
  assert.equal(data.indicators.length, 112);
  for (let level = 1; level <= 8; level++) {
    const own = data.indicators.filter(i => i.level === level);
    assert.deepEqual(
      own.map(i => i.slot).sort(),
      [...SLOTS].sort(),
      `level ${level} memiliki 14 slot tanpa duplikat`
    );
    for (const i of own) assert.equal(i.number, SLOTS.indexOf(i.slot) + 1);
  }

  // Kompetensi akademik sama dengan milestone 12x8 (kolom slot 1 dan 2 per alur).
  const milestone = await read('docs/curriculum/milestone-12x8.md');
  const tables = milestone.split(/^## /m).slice(1);
  for (const block of tables) {
    const strand = block[0];
    if (!'ABCDEF'.includes(strand)) continue;
    for (const line of block.split('\n').filter(l => /^\| L\d/.test(l))) {
      const c = line.split('|').map(x => x.trim());
      const level = Number(c[1].slice(1));
      for (const [col, slot] of [
        [2, `${strand}1`],
        [3, `${strand}2`]
      ]) {
        const ind = data.indicators.find(i => i.level === level && i.slot === slot);
        assert.equal(norm(ind.competency), norm(c[col]), `${slot} L${level}`);
      }
    }
  }
  // English dan Karakter sama dengan milestone di english-karakter.md.
  const ek = await read('docs/curriculum/english-karakter.md');
  const section = title => ek.split(/^## /m).find(b => b.startsWith(title));
  for (const line of section('English\n')
    .split('\n')
    .filter(l => /^\| L\d/.test(l))) {
    const c = line.split('|').map(x => x.trim());
    const ind = data.indicators.find(i => i.level === Number(c[1].slice(1)) && i.slot === 'EN');
    assert.equal(norm(ind.competency), norm(c[4]), `English ${c[1]}`);
  }
  for (const line of section('Karakter\n')
    .split('\n')
    .filter(l => /^\| L\d/.test(l))) {
    const c = line.split('|').map(x => x.trim());
    const ind = data.indicators.find(i => i.level === Number(c[1].slice(1)) && i.slot === 'KR');
    assert.equal(norm(ind.competency), norm(c[3]), `Karakter ${c[1]}`);
  }
});

test('tema: 8 tema × 4 subtema berurutan dan kosakata English memenuhi aturan', () => {
  const { data } = buildCurriculum();
  assert.equal(data.themes.length, 8);
  data.themes.forEach((t, i) => {
    assert.equal(t.number, i + 1);
    assert.equal(t.first_meeting, i * 24 + 1);
    assert.equal(t.last_meeting, (i + 1) * 24);
    const subs = data.subthemes.filter(s => s.theme === t.number);
    assert.equal(subs.length, 4, `tema ${t.number} punya 4 subtema`);
    subs.forEach((s, k) => {
      assert.equal(s.first_meeting, t.first_meeting + k * 6);
      assert.equal(s.last_meeting, t.first_meeting + k * 6 + 5);
    });
    const nouns = data.english.filter(e => e.theme === t.number && e.kind === 'noun');
    const phrases = data.english.filter(e => e.theme === t.number && e.kind === 'phrase');
    assert.ok(nouns.filter(n => n.requestable).length >= 4, `tema ${t.number}: minimal 4 kata wajar diminta`);
    assert.ok(phrases.length >= 4, `tema ${t.number}: minimal 4 frasa`);
    // Minimal dua frasa dengan kata benda sama dan kata kerja berbeda.
    const objects = phrases.map(p => p.text.split(' ').slice(1).join(' '));
    assert.ok(new Set(objects).size < objects.length, `tema ${t.number}: frasa memuat kontras kata kerja`);
  });
  const nouns = data.english.filter(e => e.kind === 'noun').map(e => e.text.toLowerCase());
  assert.equal(new Set(nouns).size, nouns.length, 'kata benda English tidak berulang antartema');
  assert.equal(nouns.length, 40);
});
