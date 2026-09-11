import test from 'node:test';
import assert from 'node:assert/strict';
import { PGlite } from '@electric-sql/pglite';
import { readFile, readdir } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';

test('PostgreSQL: hak akses, kelas, evaluasi, remedial, sumatif, dan AI',async t=>{
 const db=new PGlite();
 await db.exec(`create role anon; create role authenticated; create role service_role bypassrls; create schema auth;
 create table auth.users(id uuid primary key,email text);
 create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
 grant usage on schema public,auth to authenticated,anon,service_role; grant execute on function auth.uid() to authenticated,anon,service_role;`);
 const migrationDir=new URL('../supabase/migrations/',import.meta.url);
 const migrations=(await readdir(migrationDir)).filter(file=>file.endsWith('.sql')).sort();
 for(const file of migrations)await db.exec((await readFile(new URL(file,migrationDir),'utf8')).replace(/^\uFEFF/,''));
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
 await t.test('level 11–16 aktif dan asesmen baru menaikkan tiap kompetensi secara mandiri setelah dua bukti',async()=>{
  const advanced=randomUUID();
  await as(owner,`insert into students(id,name,parent_name,reading_baseline,reading_level,reading_target,math_baseline,math_level,math_target) values($1,'Citra','Bunda Citra',10,10,16,10,10,16)`,[advanced]);
  await as(owner,'insert into assignments values($1,$2)',[advanced,teacher]);
  let x=await create(teacher,advanced);
  const first=(await as(teacher,'select subject from session_assessments where session_student_id=$1 order by subject',[x.rid])).rows.map(x=>x.subject);
  assert.equal(first.length,2);
  let payload=first.map(subject=>({subject,rating:'T',note:'Bukti pertama'}));
  await assert.rejects(as(teacher,'select finalize_competency_evaluation($1,$2::jsonb,$3)',[x.rid,JSON.stringify([...payload,payload[0]]),'Duplikat']),/Lengkapi semua target/);
  await as(teacher,'select finalize_competency_evaluation($1,$2::jsonb,$3)',[x.rid,JSON.stringify(payload),'Observasi pertama']);
  x=await create(teacher,advanced);
  const second=(await as(teacher,'select subject from session_assessments where session_student_id=$1 order by subject',[x.rid])).rows.map(x=>x.subject);
  const shared=first.find(subject=>second.includes(subject));
  assert.ok(shared,'dua sesi spiral berurutan berbagi satu kompetensi');
  payload=second.map(subject=>({subject,rating:subject===shared?'T':'MB',note:'Bukti kedua'}));
  await as(teacher,'select finalize_competency_evaluation($1,$2::jsonb,$3)',[x.rid,JSON.stringify(payload),'Observasi kedua']);
  const level=(await as(teacher,'select current_level from student_competencies where student_id=$1 and subject=$2',[advanced,shared])).rows[0].current_level;
  assert.equal(level,11);
 });
 await t.test('model tematik memakai kompetensi aktif baru dan mengarsipkan data lama',async()=>{
  const active=(await as(teacher,'select subject,required from student_competencies where student_id=$1 and active order by subject',[student])).rows;
  assert.deepEqual(active.map(x=>x.subject),['english','ipas','listening','math','reading','speaking','writing']);
  assert.equal(active.find(x=>x.subject==='english').required,false);
  assert.ok(active.filter(x=>x.subject!=='english').every(x=>x.required));
  const archived=(await as(teacher,"select subject,active,required from student_competencies where student_id=$1 and subject in ('character','pancasila') order by subject",[student])).rows;
  assert.ok(archived.every(x=>x.active===false&&x.required===false));
 });
 await t.test('kelas 90 menit memiliki tiga target bersama, kelompok, English Exposure, dan observasi karakter',async()=>{
  const advanced=(await as(teacher,"select id from students where name='Citra'")).rows[0].id;
  const cid=randomUUID();
  await as(teacher,"select create_class($1,current_date,'Air Bersih',$2::uuid[],90)",[cid,[student,advanced]]);
  const records=(await as(teacher,'select id,student_id,group_no from session_students where session_id=$1 order by group_no',[cid])).rows;
  assert.equal(records.length,2);
  assert.deepEqual(records.map(x=>x.group_no),[1,2]);
  const targetSets=[];
  for(const record of records){
   const targetRows=(await as(teacher,'select subject from session_assessments where session_student_id=$1 order by subject',[record.id])).rows;
   assert.equal(targetRows.length,3);
   targetSets.push(targetRows.map(x=>x.subject));
   const payload=targetRows.map(x=>({subject:x.subject,rating:'T',note:'Terlihat dalam kegiatan tema'}));
   const observation={english_rating:'T',english_note:'Menggunakan kosakata water',character_dimensions:['kerja_sama','tanggung_jawab'],character_note:'Berbagi alat dan merapikan kembali'};
   await as(teacher,'select finalize_competency_evaluation($1,$2::jsonb,$3,$4::jsonb)',[record.id,JSON.stringify(payload),'Aktif dalam kelompok',JSON.stringify(observation)]);
  }
  assert.deepEqual(targetSets[0],targetSets[1]);
  assert.equal((await as(teacher,'select duration_minutes from class_sessions where id=$1',[cid])).rows[0].duration_minutes,90);
  const saved=(await as(teacher,'select * from session_observations where session_student_id=$1',[records[0].id])).rows[0];
  assert.equal(saved.english_rating,'T');
  assert.deepEqual(saved.character_dimensions,['kerja_sama','tanggung_jawab']);
  assert.equal((await as(teacher,"select evidence_count from student_competencies where student_id=$1 and subject='english'",[student])).rows[0].evidence_count,1);
  await assert.rejects(as(stranger,'select claim_class_ai_job($1)',[cid]),/Akses ditolak/);
  const job=(await as(teacher,'select claim_class_ai_job($1) as id',[cid])).rows[0].id;
  await db.exec('reset role; set role service_role');
  await db.query("select finish_class_ai_job($1,'Panduan multigrade tematik dengan English Exposure.',false)",[job]);
  assert.match((await as(teacher,'select material from class_sessions where id=$1',[cid])).rows[0].material,/English Exposure/);
 });
 await t.test('sumatif hanya pemilik, level tidak melewati target',async()=>{
  const x=await create();await as(teacher,"select finalize_evaluation($1,'SB','')",[x.rid]);
  const core=(await as(owner,'select reading_level,reading_target from students where id=$1',[student])).rows[0];
  assert.ok(core.reading_level<=core.reading_target);
  await assert.rejects(as(teacher,'select complete_summative($1,90,true)',[student]),/Hanya pemilik/);
  await assert.rejects(as(owner,'select complete_summative($1,90,true)',[student]),/Target kompetensi wajib/);
  await as(owner,'update student_competencies set current_level=target where student_id=$1 and required',[student]);
  await as(owner,'select complete_summative($1,90,true)',[student]);
  assert.equal((await as(owner,'select status from students where id=$1',[student])).rows[0].status,'Lulus');
 });
 await t.test('guru nonaktif kehilangan akses',async()=>{
  await as(owner,"update access_list set active=false where email='guru@test.invalid'");
  assert.equal((await as(teacher,'select * from students')).rows.length,0);
 });
 await db.close();
});
