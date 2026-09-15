import test from 'node:test';
import assert from 'node:assert/strict';
import { PGlite } from '@electric-sql/pglite';
import { readFile, readdir } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { TABLES, exportSql, restoreSql } from '../scripts/backup-data.mjs';

// Cadangan hanya berguna bila bisa dipulihkan: data dibuat lewat RPC di satu database, diekspor dengan kueri
// skrip cadangan, lalu restore.sql dijalankan ke database baru dan isinya dibandingkan.
async function fresh(){
 const db=new PGlite();
 await db.exec(`create role anon; create role authenticated; create role service_role bypassrls; create schema auth;
 create table auth.users(id uuid primary key,email text);
 create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
 grant usage on schema public,auth to authenticated,anon,service_role; grant execute on function auth.uid() to authenticated,anon,service_role;`);
 const dir=new URL('../supabase/migrations/',import.meta.url);
 for(const f of (await readdir(dir)).filter(f=>f.endsWith('.sql')).sort())await db.exec((await readFile(new URL(f,dir),'utf8')).replace(/^﻿/,''));
 return db;
}
test('cadangan data: restore.sql memulihkan semua tabel aplikasi apa adanya',async()=>{
 const owner=randomUUID(),teacher=randomUUID();
 const akun=async db=>{await db.exec(`insert into access_list values('owner@test.invalid','Pemilik','owner',true),('guru@test.invalid','Guru O''Neil','teacher',true) on conflict do nothing;`);await db.query('insert into auth.users values($1,$2),($3,$4)',[owner,'owner@test.invalid',teacher,'guru@test.invalid']);};
 const a=await fresh();await akun(a);
 const as=async(sql,args=[])=>{await a.exec('reset role');await a.query("select set_config('request.jwt.claim.sub',$1,false)",[teacher]);await a.exec('set role authenticated');return a.query(sql,args);};
 const siswa=async(nama,lulus)=>{const id=(await as('select create_student($1::jsonb) as id',[JSON.stringify({name:nama,parent_name:'Bunda',phone:'',nickname:'',birth_date:'2021-03-14',school_grade:'TK A',school_year:'2026/2027'})])).rows[0].id;await as('select start_diagnostic($1,1)',[id]);for(const n of lulus)await as("select rate_diagnostic($1,$2,'lulus','utama')",[id,n]);await as('select finalize_diagnostic($1)',[id]);return id;};
 const x=await siswa("Hana D'Silva",[1,2,3]),y=await siswa('Umar',[1,2,3,4,5,6,7,8,9,10,11]);
 const j=(await as('select save_schedule(null,$1::jsonb) as id',[JSON.stringify({scheduled_date:'2026-09-21',scheduled_time:'08:00'})])).rows[0].id;
 await as('select save_meeting($1,$2::jsonb,true)',[j,JSON.stringify([{student_id:x,result:'lulus',english:'',character:'lulus'},{student_id:y,result:'lulus',english:'',character:''}])]);
 await as('select confirm_level_up($1)',[y]);
 await as('select save_schedule(null,$1::jsonb)',[JSON.stringify({scheduled_date:'2026-09-22',scheduled_time:'08:00'})]);
 await a.exec('reset role');
 const data={};for(const t of TABLES)data[t]=(await a.query(exportSql(t))).rows[0].j;
 for(const t of TABLES)assert.ok(data[t].length>0,`data contoh mengisi ${t}`);

 const b=await fresh();await akun(b);
 await b.exec(restoreSql(data));
 for(const t of TABLES){
  const pulih=(await b.query(exportSql(t))).rows[0].j;
  const urut=rows=>rows.map(r=>JSON.stringify(r)).sort();
  assert.deepEqual(urut(pulih),urut(data[t]),`${t} sama setelah dipulihkan`);
 }
 // Setelah pulih, aplikasi tetap berjalan: antrean dihitung dari data yang dipulihkan.
 assert.equal((await b.query('select current_indicator($1) as n',[x])).rows[0].n,5);
});
