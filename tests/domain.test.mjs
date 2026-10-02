import test from 'node:test';
import assert from 'node:assert/strict';
import {escapeHtml,localDate,errorText} from '../src/domain.js';
test('data siswa tidak menjadi HTML dan tanggal lokal berformat ISO',()=>{assert.equal(escapeHtml('<img src=x onerror="alert(1)">'),'&lt;img src=x onerror=&quot;alert(1)&quot;&gt;');assert.match(localDate(),/^\d{4}-\d{2}-\d{2}$/);});
test('galat simpan diterjemahkan untuk guru: jaringan, sesi berakhir, pesan database apa adanya',()=>{assert.match(errorText(new TypeError('Failed to fetch')),/periksa koneksi internet[\s\S]*belum hilang/);assert.match(errorText({message:'NetworkError when attempting to fetch resource.'}),/periksa koneksi internet/);assert.match(errorText({message:'JWT expired'}),/Sesi login berakhir/);assert.equal(errorText({message:'Siswa yang sudah mengikuti kelas tidak bisa dihapus.'}),'Siswa yang sudah mengikuti kelas tidak bisa dihapus.');assert.match(errorText(''),/Coba ketuk tombol simpan sekali lagi/);});
