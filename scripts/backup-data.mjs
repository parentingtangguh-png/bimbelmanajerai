// Cadangan manual data aplikasi (hanya membaca produksi). Docker/pg_dump tidak tersedia, jadi setiap tabel
// dibaca lewat `supabase db query --linked` dan disimpan sebagai JSON, ditambah restore.sql untuk memulihkan.
//
//   node scripts/backup-data.mjs "D:\ribuan_pengguna\CLAUDE\bimbel_cadangan"
//
// Folder tujuan WAJIB di luar repo (repo publik; berkas berisi data pribadi anak). Kurikulum (k8_*) tidak
// dicadangkan karena dibangun ulang dari migrasi. Akun login (auth.users) juga tidak: restore.sql mengandaikan
// akun dengan id yang sama sudah ada. Pemulihan dijaga tests/backup.test.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Urutan = urutan pemulihan (tabel induk lebih dulu).
export const TABLES = [
  'access_list',
  'profiles',
  'students',
  'assignments',
  'diagnostic_tests',
  'diagnostic_results',
  'class_schedules',
  'class_schedule_students',
  'student_level_changes'
];

export const exportSql = table => `select coalesce(json_agg(x), '[]'::json) as j from public.${table} x`;

// data: { tabel: [baris] }. Dijalankan ke database yang tabelnya sudah dibuat migrasi dan belum berisi data
// aplikasi. profiles biasanya sudah terisi pemicu akun, jadi baris yang sama ditimpa.
export function restoreSql(data) {
  const lines = [
    '-- Pulihkan cadangan. Jalankan hanya dengan izin pemilik, ke database tanpa data siswa.',
    'begin;'
  ];
  for (const t of TABLES) {
    const rows = data[t] || [];
    if (!rows.length) continue;
    const json = JSON.stringify(rows).replace(/'/g, "''");
    const source = `select * from json_populate_recordset(null::public.${t}, '${json}')`;
    lines.push(
      t === 'profiles' || t === 'access_list'
        ? `delete from public.${t}; insert into public.${t} ${source};`
        : `insert into public.${t} ${source};`
    );
  }
  lines.push('commit;');
  return lines.join('\n') + '\n';
}

function query(sql) {
  const out = execSync(`npx --no-install supabase db query --linked "${sql}"`, {
    encoding: 'utf8',
    maxBuffer: 256 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe']
  });
  return JSON.parse(out.slice(out.indexOf('{'), out.lastIndexOf('}') + 1)).rows;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const target = process.argv[2];
  if (!target) throw new Error('Sebutkan folder tujuan di luar repo.');
  const repo = path.resolve('.');
  const base = path.resolve(target);
  if (base === repo || base.startsWith(repo + path.sep))
    throw new Error('Folder tujuan tidak boleh di dalam repo.');
  const dir = path.join(
    base,
    new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Jakarta' }).slice(0, 16).replace(/[: ]/g, '-')
  );
  fs.mkdirSync(dir, { recursive: true });
  const data = {};
  for (const t of TABLES) {
    data[t] = query(exportSql(t))[0].j;
    fs.writeFileSync(path.join(dir, `${t}.json`), JSON.stringify(data[t], null, 1));
  }
  fs.writeFileSync(path.join(dir, 'restore.sql'), restoreSql(data));
  const jumlah = Object.fromEntries(TABLES.map(t => [t, data[t].length]));
  fs.writeFileSync(
    path.join(dir, 'ringkasan.json'),
    JSON.stringify({ dibuat: new Date().toISOString(), jumlah }, null, 1)
  );
  console.log('Cadangan tersimpan:', dir);
  console.log(jumlah);
}
