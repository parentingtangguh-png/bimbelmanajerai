import test from 'node:test';
import assert from 'node:assert/strict';
import {progress,waLink,escapeHtml,localDate} from '../src/domain.js';
test('progres dihitung dari baseline dan tidak keluar rentang',()=>{assert.equal(progress(3,3,7),0);assert.equal(progress(5,3,7),50);assert.equal(progress(9,3,7),100);assert.equal(progress(7,7,7),100);assert.equal(progress(1,3,7),0);});
test('WhatsApp membawa pesan terenkode dan menolak nomor kosong',()=>{assert.equal(waLink('0812-1234-5678','Halo Bunda & Ayah 😊'),'https://wa.me/6281212345678?text=Halo%20Bunda%20%26%20Ayah%20%F0%9F%98%8A');assert.equal(waLink('','x'),null);});
test('teks AI dan data siswa tidak menjadi HTML',()=>{assert.equal(escapeHtml('<img src=x onerror="alert(1)">'),'&lt;img src=x onerror=&quot;alert(1)&quot;&gt;');assert.match(localDate(),/^\d{4}-\d{2}-\d{2}$/);});
