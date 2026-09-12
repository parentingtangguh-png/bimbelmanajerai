// Every name a module borrows from another module must be imported there. A missing one builds
// fine and only fails when a teacher opens that screen, which is exactly what happened with h().
import fs from 'node:fs';

const read = p => fs.readFileSync(p, 'utf8');
const EXPORTS = /^export (?:async function |function |const |let )(\w+)/gm;
const DECLARES = /^(?:export )?(?:async function |function |const |let )(\w+)/gm;
const exportsOf = p => [...read(p).matchAll(EXPORTS)].map(m => m[1]);

const views = fs.readdirSync('src/views').map(f => 'src/views/' + f);
const shared = new Map();
for (const n of exportsOf('src/state.js')) shared.set(n, 'state.js');
for (const n of exportsOf('src/ui.js')) shared.set(n, 'ui.js');
for (const v of views) for (const n of exportsOf(v)) shared.set(n, v);
for (const n of ['h', 'progress', 'waLink', 'localDate', 'minutesBetween', 'durationPattern', 'formatTime']) shared.set(n, 'domain.js');

let problems = 0;
for (const p of ['src/main.js', ...views]) {
  const src = read(p);
  const declared = new Set([...src.matchAll(DECLARES)].map(m => m[1]));
  const imported = new Set();
  for (const m of src.matchAll(/import \{([^}]*)\} from/g)) {
    for (const part of m[1].split(',')) {
      const name = part.trim();
      if (name) imported.add(name.split(' as ').pop().trim());
    }
  }
  const body = src.replace(/^import .*$/gm, '');
  for (const [name, home] of shared) {
    if (declared.has(name) || imported.has(name)) continue;
    if (new RegExp(`\\b${name}\\b`).test(body)) {
      console.log('KURANG IMPOR:', p, '->', name, '(dari', home + ')');
      problems++;
    }
  }
}
console.log(problems ? `masalah: ${problems}` : 'semua rujukan antar modul sudah terimpor');
process.exit(problems ? 1 : 0);
