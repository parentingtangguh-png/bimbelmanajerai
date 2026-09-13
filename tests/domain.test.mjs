import test from 'node:test';
import assert from 'node:assert/strict';
import {escapeHtml,localDate} from '../src/domain.js';
test('data siswa tidak menjadi HTML dan tanggal lokal berformat ISO',()=>{assert.equal(escapeHtml('<img src=x onerror="alert(1)">'),'&lt;img src=x onerror=&quot;alert(1)&quot;&gt;');assert.match(localDate(),/^\d{4}-\d{2}-\d{2}$/);});
