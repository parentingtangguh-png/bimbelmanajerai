import test from 'node:test';
import assert from 'node:assert/strict';
import { PGlite } from '@electric-sql/pglite';
import { readFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';

test('PostgreSQL: hak akses, kelas, evaluasi, remedial, sumatif, dan AI',async t=>{
 const db=new PGlite();
 await db.exec(`create role anon; create role authenticated; create role service_role bypassrls; create schema auth;
 create table auth.users(id uuid primary key,email text);
 create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
 grant usage on schema public,auth to authenticated,anon,service_role; grant execute on function auth.uid() to authenticated,anon,service_role;`);
 for(const file of ['20260911000000_bimbel.sql','20260911010000_ai_jobs.sql','20260911020000_harden_trigger_functions.sql'])await db.exec(await readFile(new URL('../supabase/migrations/'+file,import.meta.url),'utf8'));
 const owner=randomUUID(),teacher=randomUUID(),stranger=randomUUID(),student=randomUUID(),other=randomUUID();
 await db.exec(`insert into access_list values('owner@test.invalid','Pemilik','owner',true),('guru@test.invalid','Guru','teacher',true),('lain@test.invalid','Guru Lain','teacher',true);`);
 await db.query('insert into auth.users values($1,$2),($3,$4),($5,$6)',[owner,'owner@test.invalid',teacher,'guru@test.invalid',stranger,'lain@test.invalid']);
 async function as(id,sql,args=[]){await db.exec('reset role');await db.query("select set_config('request.jwt.claim.sub',$1,false)",[id]);await db.exec('set role authenticated');return db.query(sql,args);}
 await as(owner,`insert into students(id,name,parent_name,reading_baseline,reading_level,reading_target,math_baseline,math_level,math_target) values($1,'Alya','Bunda',1,1,3,1,1,3),($2,'Bima','Ayah',1,1,10,1,1,10)`,[student,other]);
 await as(owner,'insert into assignments values($1,$2)',[student,teacher]);
 await t.test('guru hanya membaca siswa sendiri dan tidak membaca alarm',async()=>{
  assert.equal((await as(teacher,'select * from students')).rows.length,1);
  assert.equal((await as(stranger,'select * from students')).rows.length,0);
  assert.equal((await as(teacher,'select * from student_alerts')).rows.length,0);
  await assert.rejects(as(teacher,`insert into students(name,parent_name,reading_baseline,reading_level,reading_target,math_baseline,math_level,math_target) values('X','Y',1,1,3,1,1,3)`),/row-level security/i);
  assert.equal((await as(teacher,"update students set reading_target=10 where id=$1 returning id",[student])).rows.length,0);
 });
 await t.test('fungsi trigger tidak tersedia sebagai RPC pengguna',async()=>{
  assert.equal((await db.query("select has_function_privilege('authenticated','public.handle_new_user()','execute') as allowed")).rows[0].allowed,false);
  assert.equal((await db.query("select has_function_privilege('authenticated','public.guard_student_update()','execute') as allowed")).rows[0].allowed,false);
 });
 await t.test('email tidak dikenal tidak bisa mendaftar',async()=>{await db.exec('reset role');await assert.rejects(db.query('insert into auth.users values($1,$2)',[randomUUID(),'unknown@test.invalid']),/belum didaftarkan/);});
 async function create(id=teacher,sid=student){const cid=randomUUID();await as(id,"select create_class($1,current_date,'Pasar',$2::uuid[])",[cid,[sid]]);return {cid,rid:(await as(id,'select id from session_students where session_id=$1',[cid])).rows[0].id};}
 let session;
 await t.test('kelas menolak siswa lain dan duplikasi sesi terbuka',async()=>{
  await assert.rejects(create(teacher,other),/Siswa tidak tersedia/);
  session=await create();
  await assert.rejects(create(),/Selesaikan sesi sebelumnya/);
  await as(teacher,"select create_class($1,current_date,'Pasar',$2::uuid[])",[session.cid,[student]]);
  assert.equal((await as(teacher,'select * from session_students')).rows.length,1);
 });
 await t.test('akses langsung nilai ditolak, RPC tidak boleh lintas guru',async()=>{
  await assert.rejects(as(teacher,"update session_students set grade='SB' where id=$1",[session.rid]),/permission denied/);
  await assert.rejects(as(stranger,"select finalize_evaluation($1,'SB','')",[session.rid]),/Akses ditolak/);
 });
 await t.test('evaluasi dua kali hanya menaikkan satu level',async()=>{
  await as(teacher,"select finalize_evaluation($1,'SB','Aktif')",[session.rid]);
  await as(teacher,"select finalize_evaluation($1,'SB','Aktif')",[session.rid]);
  assert.equal((await as(teacher,'select reading_level from students where id=$1',[student])).rows[0].reading_level,2);
 });
 await t.test('sakit tidak menaikkan level dan tidak memanggil AI',async()=>{
  const x=await create();await as(teacher,"select save_attendance($1,'Sakit')",[x.rid]);
  await assert.rejects(as(teacher,"select claim_ai_job($1,'material')",[x.rid]),/absen/);
  await as(teacher,"select finalize_evaluation($1,'SB','')",[x.rid]);
  assert.equal((await as(teacher,'select reading_level from students where id=$1',[student])).rows[0].reading_level,2);
  const row=(await as(teacher,'select * from session_students where id=$1',[x.rid])).rows[0];assert.equal(row.grade,null);assert.match(row.report,/lekas sembuh/);
 });
 await t.test('tiga MB di level sama memicu alarm khusus pemilik',async()=>{
  for(let i=0;i<3;i++){const x=await create();await as(teacher,"select finalize_evaluation($1,'MB','Perlu latihan')",[x.rid]);}
  assert.equal((await as(owner,'select * from student_alerts where student_id=$1',[student])).rows[0].intervention,true);
  assert.equal((await as(teacher,'select * from student_alerts')).rows.length,0);
 });
 await t.test('AI mensyaratkan evaluasi untuk rapor dan menolak pekerjaan ganda',async()=>{
  const x=await create();
  await assert.rejects(as(teacher,"select claim_ai_job($1,'report')",[x.rid]),/evaluasi/);
  const job=(await as(teacher,"select claim_ai_job($1,'material') as id",[x.rid])).rows[0].id;
  await assert.rejects(as(teacher,"select claim_ai_job($1,'material')",[x.rid]),/berlangsung/);
  await assert.rejects(as(teacher,"select save_attendance($1,'Izin')",[x.rid]),/Tunggu/);
  await assert.rejects(as(teacher,"select finish_ai_job($1,'Panduan palsu',false)",[job]),/permission denied/);
  await db.exec('reset role; set role service_role');
  await db.query("select finish_ai_job($1,'Panduan membaca dan menulis.',false)",[job]);
  assert.equal((await as(teacher,"select claim_ai_job($1,'material') as id",[x.rid])).rows[0].id,null);
  await as(teacher,"select finalize_evaluation($1,'BSH','')",[x.rid]);
 });
 await t.test('mencapai target tetap aktif, alarm remedial terhapus',async()=>{
  const s=(await as(owner,'select * from students where id=$1',[student])).rows[0];assert.equal(s.reading_level,3);assert.equal(s.status,'Aktif');
  assert.equal((await as(owner,'select * from student_alerts where student_id=$1',[student])).rows[0].intervention,false);
  await assert.rejects(as(owner,"update students set reading_level=2 where id=$1",[student]),/alur evaluasi/);
 });
 await t.test('sumatif hanya pemilik, level tidak melewati target',async()=>{
  const x=await create();await as(teacher,"select finalize_evaluation($1,'SB','')",[x.rid]);
  assert.equal((await as(owner,'select reading_level from students where id=$1',[student])).rows[0].reading_level,3);
  await assert.rejects(as(teacher,'select complete_summative($1,90,true)',[student]),/Hanya pemilik/);
  await as(owner,'select complete_summative($1,90,true)',[student]);
  assert.equal((await as(owner,'select status from students where id=$1',[student])).rows[0].status,'Lulus');
 });
 await t.test('guru nonaktif kehilangan akses',async()=>{
  await as(owner,"update access_list set active=false where email='guru@test.invalid'");
  assert.equal((await as(teacher,'select * from students')).rows.length,0);
 });
 await db.close();
});
