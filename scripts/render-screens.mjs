// Renders every screen with a fixed sample state and writes the HTML to a file.
// Run it before and after a refactor and compare the two files: identical HTML means the screens
// still produce exactly what they produced before, without needing a browser or a login.
//
//   node scripts/render-screens.mjs before.html
//   ...refactor...
//   node scripts/render-screens.mjs after.html
//   diff before.html after.html
import fs from 'node:fs';
import { loadSampleState } from '../tests/fixtures/sample-state.mjs';
import { sessionsView } from '../src/views/sessions.js';
import { dashboard } from '../src/views/dashboard.js';
import { studentsView } from '../src/views/students.js';
import { curriculumView } from '../src/views/curriculum.js';
import { teamView } from '../src/views/team.js';

const out = process.argv[2] || 'screens.html';
loadSampleState();

const screens = [];
const add = (name, html) => screens.push(`<!-- ${name} -->\n${html}`);

add('dashboard', dashboard());
add('studentsView', studentsView());
add('sessionsView', sessionsView());
add('teamView', teamView());
add('curriculumView', curriculumView());

const html = screens.join('\n\n');
fs.writeFileSync(out, html);
console.log('ditulis', out, Math.round(html.length / 1024) + ' KB');
