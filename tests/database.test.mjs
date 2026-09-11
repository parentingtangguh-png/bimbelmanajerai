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
 await t.test('data uji mencakup 20 siswa Fondasi sampai SD 6 tanpa nomor telepon',async()=>{
  const seeded=(await db.query("select name,phone from students where id::text like '20000000-0000-4000-8000-0000000000%' order by id")).rows;
  assert.equal(seeded.length,20);
  assert.ok(seeded.every(row=>row.name.startsWith('Siswa Uji ')&&row.phone===''));
  assert.match(seeded[0].name,/Fondasi/);
  assert.match(seeded.at(-1).name,/SD 6/);
  const active=(await db.query("select count(*)::int as total from student_competencies where student_id::text like '20000000-0000-4000-8000-0000000000%' and active")).rows[0].total;
  assert.equal(active,140);
 });
 const owner=randomUUID(),teacher=randomUUID(),stranger=randomUUID(),student=randomUUID(),other=randomUUID();
 await db.exec(`insert into access_list values('owner@test.invalid','Pemilik','owner',true),('guru@test.invalid','Guru','teacher',true),('lain@test.invalid','Guru Lain','teacher',true);`);
 await db.query('insert into auth.users values($1,$2),($3,$4),($5,$6)',[owner,'owner@test.invalid',teacher,'guru@test.invalid',stranger,'lain@test.invalid']);
 async function as(id,sql,args=[]){await db.exec('reset role');await db.query("select set_config('request.jwt.claim.sub',$1,false)",[id]);await db.exec('set role authenticated');return db.query(sql,args);}
 // Fixture setup outside any user role (owners may no longer insert students).
 async function admin(sql,args=[]){await db.exec('reset role');await db.query("select set_config('request.jwt.claim.sub','',false)");return db.query(sql,args);}
 await admin(`insert into students(id,name,parent_name,reading_baseline,reading_level,reading_target,math_baseline,math_level,math_target) values($1,'Alya','Bunda',1,1,3,1,1,3),($2,'Bima','Ayah',1,1,10,1,1,10)`,[student,other]);
 await admin('insert into assignments values($1,$2)',[student,teacher]);
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
  assert.equal((await db.query("select has_function_privilege('authenticated','public.finalize_evaluation(uuid,text,text)','execute') as allowed")).rows[0].allowed,false);
  assert.equal((await db.query("select has_function_privilege('authenticated','public.finalize_competency_evaluation(uuid,jsonb,text)','execute') as allowed")).rows[0].allowed,false);
  assert.equal((await db.query("select has_function_privilege('anon','public.create_student(jsonb)','execute') as allowed")).rows[0].allowed,false);
 });
 await t.test('email tidak dikenal tidak bisa mendaftar',async()=>{await db.exec('reset role');await assert.rejects(db.query('insert into auth.users values($1,$2)',[randomUUID(),'unknown@test.invalid']),/belum didaftarkan/);});
 async function create(id=teacher,sid=student){const cid=randomUUID();await as(id,"select create_class($1,current_date,'Pasar',$2::uuid[])",[cid,[sid]]);return {cid,rid:(await as(id,'select id from session_students where session_id=$1',[cid])).rows[0].id};}
 async function finalize(id,rid,rating='T',anecdote=''){
  const targets=(await as(id,'select subject from session_assessments where session_student_id=$1 order by subject',[rid])).rows;
  const payload=targets.map(({subject})=>({subject,rating,note:anecdote}));
  const observation={english_rating:'',english_note:'',character_dimensions:[],character_note:''};
  return as(id,'select finalize_competency_evaluation($1,$2::jsonb,$3,$4::jsonb)',[rid,JSON.stringify(payload),anecdote,JSON.stringify(observation)]);
 }
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
  await assert.rejects(finalize(stranger,session.rid),/Akses ditolak/);
 });
 await t.test('evaluasi final idempoten dan tidak menggandakan bukti',async()=>{
  await finalize(teacher,session.rid,'T','Aktif');
  await finalize(teacher,session.rid,'T','Aktif');
  const reading=(await as(teacher,"select current_level,evidence_count from student_competencies where student_id=$1 and subject='reading'",[student])).rows[0];
  assert.deepEqual([reading.current_level,reading.evidence_count],[1,1]);
 });
 await t.test('sakit tidak menaikkan level dan tidak memanggil AI',async()=>{
  const x=await create();await as(teacher,"select save_attendance($1,'Sakit')",[x.rid]);
  await assert.rejects(as(teacher,"select claim_ai_job($1,'material')",[x.rid]),/absen/);
  await finalize(teacher,x.rid,'T','');
  assert.equal((await as(teacher,'select reading_level from students where id=$1',[student])).rows[0].reading_level,1);
  const row=(await as(teacher,'select * from session_students where id=$1',[x.rid])).rows[0];assert.equal(row.grade,null);assert.match(row.report,/lekas sembuh/);
 });
 await t.test('tiga MB di level sama memicu alarm khusus pemilik',async()=>{
  for(let i=0;i<7;i++){const x=await create();await finalize(teacher,x.rid,'MB','Perlu latihan');}
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
  await finalize(teacher,x.rid,'MB','');
 });
 await t.test('status tetap aktif dan level inti tidak dapat diubah langsung',async()=>{
  const s=(await as(owner,'select * from students where id=$1',[student])).rows[0];assert.equal(s.status,'Aktif');
  // No role has a direct update path to students; levels only move through evaluation RPCs.
  assert.equal((await as(owner,"update students set reading_level=2 where id=$1 returning id",[student])).rows.length,0);
  assert.equal((await as(teacher,"update students set reading_level=2 where id=$1 returning id",[student])).rows.length,0);
  assert.equal((await as(owner,'select reading_level from students where id=$1',[student])).rows[0].reading_level,s.reading_level);
 });
 await t.test('level 11–16 aktif dan asesmen baru menaikkan tiap kompetensi secara mandiri setelah dua bukti',async()=>{
  const advanced=randomUUID();
  await admin(`insert into students(id,name,parent_name,reading_baseline,reading_level,reading_target,math_baseline,math_level,math_target) values($1,'Citra','Bunda Citra',10,10,16,10,10,16)`,[advanced]);
  await admin('insert into assignments values($1,$2)',[advanced,teacher]);
  let x=await create(teacher,advanced);
  const first=(await as(teacher,'select subject from session_assessments where session_student_id=$1 order by subject',[x.rid])).rows.map(x=>x.subject);
  assert.equal(first.length,2);
  let payload=first.map(subject=>({subject,rating:'T',note:'Bukti pertama'}));
  const noObservation=JSON.stringify({english_rating:'',english_note:'',character_dimensions:[],character_note:''});
  await assert.rejects(as(teacher,'select finalize_competency_evaluation($1,$2::jsonb,$3,$4::jsonb)',[x.rid,JSON.stringify([...payload,payload[0]]),'Duplikat',noObservation]),/Lengkapi semua target/);
  await as(teacher,'select finalize_competency_evaluation($1,$2::jsonb,$3,$4::jsonb)',[x.rid,JSON.stringify(payload),'Observasi pertama',noObservation]);
  x=await create(teacher,advanced);
  const second=(await as(teacher,'select subject from session_assessments where session_student_id=$1 order by subject',[x.rid])).rows.map(x=>x.subject);
  const shared=first.find(subject=>second.includes(subject));
  assert.ok(shared,'dua sesi spiral berurutan berbagi satu kompetensi');
  payload=second.map(subject=>({subject,rating:subject===shared?'T':'MB',note:'Bukti kedua'}));
  await as(teacher,'select finalize_competency_evaluation($1,$2::jsonb,$3,$4::jsonb)',[x.rid,JSON.stringify(payload),'Observasi kedua',noObservation]);
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
  await assert.rejects(as(teacher,"update class_sessions set material='Palsu' where id=$1",[cid]),/permission denied/);
  await assert.rejects(as(teacher,"update session_observations set character_note='Palsu' where session_student_id=$1",[records[0].id]),/permission denied/);
  const saved=(await as(teacher,'select * from session_observations where session_student_id=$1',[records[0].id])).rows[0];
  assert.equal(saved.english_rating,'T');
  assert.deepEqual(saved.character_dimensions,['kerja_sama','tanggung_jawab']);
  assert.equal((await as(teacher,"select evidence_count from student_competencies where student_id=$1 and subject='english'",[student])).rows[0].evidence_count,1);
  await assert.rejects(as(stranger,'select claim_class_ai_job($1)',[cid]),/Akses ditolak/);
  const job=(await as(teacher,'select claim_class_ai_job($1) as id',[cid])).rows[0].id;
  await assert.rejects(as(teacher,"select finish_class_ai_job($1,'Panduan palsu',false)",[job]),/permission denied/);
  await db.exec('reset role; set role service_role');
  await db.query("select finish_class_ai_job($1,'Panduan multigrade tematik dengan English Exposure.',false)",[job]);
  assert.match((await as(teacher,'select material from class_sessions where id=$1',[cid])).rows[0].material,/English Exposure/);
 });
 await t.test('mengubah kehadiran tidak menghapus panduan kelas dan anak absen bisa diselesaikan',async()=>{
  const ids=[randomUUID(),randomUUID()];
  for(const [index,id] of ids.entries()){
   await admin(`insert into students(id,name,parent_name,reading_baseline,reading_level,reading_target,math_baseline,math_level,math_target) values($1,$2,'Orang tua',2,2,8,2,2,8)`,[id,`Hadir ${index+1}`]);
   await admin('insert into assignments values($1,$2)',[id,teacher]);
  }
  const cid=randomUUID();
  await as(teacher,"select create_class($1,current_date,'Kebun',$2::uuid[],60)",[cid,ids]);
  const job=(await as(teacher,'select claim_class_ai_job($1) as id',[cid])).rows[0].id;
  await db.exec('reset role; set role service_role');
  await db.query("select finish_class_ai_job($1,'Panduan kelas kebun untuk dua kelompok.',false)",[job]);
  const absent=(await as(teacher,'select id from session_students where session_id=$1 and student_id=$2',[cid,ids[0]])).rows[0].id;
  await as(teacher,"select save_attendance($1,'Sakit')",[absent]);
  assert.match((await as(teacher,'select material from class_sessions where id=$1',[cid])).rows[0].material,/Panduan kelas kebun/);
  assert.match((await as(teacher,'select report from session_students where id=$1',[absent])).rows[0].report,/lekas sembuh/);
  await as(teacher,"select finalize_competency_evaluation($1,'[]'::jsonb,'',$2::jsonb)",[absent,JSON.stringify({})]);
  assert.ok((await as(teacher,'select finalized_at from session_students where id=$1',[absent])).rows[0].finalized_at);
 });
 await t.test('siswa dengan posisi kompetensi sama tidak dipecah ke kelompok berbeda',async()=>{
  const ids=[randomUUID(),randomUUID(),randomUUID()];
  for(const [index,id] of ids.entries()){
   await admin(`insert into students(id,name,parent_name,reading_baseline,reading_level,reading_target,math_baseline,math_level,math_target) values($1,$2,'Orang tua',4,4,8,4,4,8)`,[id,`Setara ${index+1}`]);
   await admin('insert into assignments values($1,$2)',[id,teacher]);
  }
  const cid=randomUUID();
  await as(teacher,"select create_class($1,current_date,'Kebun',$2::uuid[],60)",[cid,ids]);
  const groups=(await as(teacher,'select group_no from session_students where session_id=$1 order by student_id',[cid])).rows.map(x=>x.group_no);
  assert.deepEqual(groups,[1,1,1]);
 });
 await t.test('sumatif dan kelulusan oleh guru pendamping, level tidak melewati target',async()=>{
  const x=await create();await finalize(teacher,x.rid,'T','');
  const core=(await as(teacher,'select reading_level,reading_target from students where id=$1',[student])).rows[0];
  assert.ok(core.reading_level<=core.reading_target);
  await assert.rejects(as(owner,'select complete_summative($1,90,true)',[student]),/Hanya guru pendamping/);
  await assert.rejects(as(stranger,'select complete_summative($1,90,true)',[student]),/Hanya guru pendamping/);
  await assert.rejects(as(teacher,'select complete_summative($1,90,true)',[student]),/Target kompetensi wajib/);
  await admin('update student_competencies set current_level=target where student_id=$1 and required',[student]);
  await as(teacher,'select complete_summative($1,90,true)',[student]);
  assert.equal((await as(owner,'select status from students where id=$1',[student])).rows[0].status,'Lulus');
 });
 await t.test('guru mengelola sesi jadwal sendiri dan jamnya tersimpan di kelas',async()=>{
  const kid=randomUUID();
  await admin(`insert into students(id,name,parent_name,reading_baseline,reading_level,reading_target,math_baseline,math_level,math_target) values($1,'Eka','Bunda Eka',1,1,5,1,1,5)`,[kid]);
  await admin('insert into assignments values($1,$2)',[kid,teacher]);
  const sid=(await as(teacher,"insert into schedules(name,start_time,end_time) values('Sesi Pagi','08:00','09:30') returning id")).rows[0].id;
  await as(teacher,'insert into schedule_students values($1,$2)',[sid,kid]);
  await assert.rejects(as(teacher,'insert into schedule_students values($1,$2)',[sid,other]),/row-level security/i);
  await assert.rejects(as(teacher,"insert into schedules(name,start_time,end_time) values('Terlalu singkat','08:00','08:10')"),/check constraint/i);
  await assert.rejects(as(owner,"insert into schedules(name,start_time,end_time) values('Pemilik','08:00','09:00')"),/row-level security/i);
  assert.equal((await as(stranger,'select * from schedules')).rows.length,0);
  assert.equal((await as(owner,'select * from schedules where id=$1',[sid])).rows.length,1);
  await as(teacher,"update schedules set end_time='09:45' where id=$1",[sid]);
  const cid=randomUUID();
  await as(teacher,"select create_class($1,current_date,'Kebun',$2::uuid[],90)",[cid,[kid]]);
  await assert.rejects(as(stranger,'select set_class_schedule($1,$2)',[cid,sid]),/Akses ditolak/);
  await as(teacher,'select set_class_schedule($1,$2)',[cid,sid]);
  const c=(await as(teacher,'select schedule_id,start_time,end_time from class_sessions where id=$1',[cid])).rows[0];
  assert.equal(c.schedule_id,sid);assert.equal(c.start_time,'08:00:00');assert.equal(c.end_time,'09:45:00');
  await as(teacher,'delete from schedules where id=$1',[sid]);
  assert.equal((await as(teacher,'select schedule_id from class_sessions where id=$1',[cid])).rows[0].schedule_id,null);
 });
 await t.test('isolasi antar guru: guru lain tidak melihat atau mengubah data guru pertama',async()=>{
  const kidA=randomUUID(),kidB=randomUUID();
  await admin(`insert into students(id,name,parent_name,reading_baseline,reading_level,reading_target,math_baseline,math_level,math_target) values($1,'Anak Guru A','Bunda A',1,1,5,1,1,5),($2,'Anak Guru B','Bunda B',1,1,5,1,1,5)`,[kidA,kidB]);
  await admin('insert into assignments values($1,$2),($3,$4)',[kidA,teacher,kidB,stranger]);
  // Guru A: kelas, evaluasi lengkap (asesmen + observasi), dan sesi jadwal.
  const a=await create(teacher,kidA);await finalize(teacher,a.rid,'T','Catatan rahasia guru A');
  const scheduleA=(await as(teacher,"insert into schedules(name,start_time,end_time) values('Jadwal A','08:00','09:00') returning id")).rows[0].id;
  await as(teacher,'insert into schedule_students values($1,$2)',[scheduleA,kidA]);
  const scheduleB=(await as(stranger,"insert into schedules(name,start_time,end_time) values('Jadwal B','10:00','11:00') returning id")).rows[0].id;
  // Guru B hanya melihat miliknya sendiri di setiap tabel.
  const ids=async sql=>(await as(stranger,sql)).rows.map(x=>Object.values(x)[0]);
  const hidden=async sql=>{try{assert.equal((await as(stranger,sql)).rows.length,0,sql);}catch(error){if(!/permission denied/.test(error.message))throw error;}};
  assert.deepEqual(await ids('select id from students'),[kidB]);
  assert.deepEqual([...new Set(await ids('select student_id from student_competencies'))],[kidB]);
  assert.deepEqual(await ids('select student_id from assignments'),[kidB]);
  assert.deepEqual(await ids('select id from profiles'),[stranger]);
  assert.deepEqual(await ids('select email from access_list'),['lain@test.invalid']);
  assert.deepEqual(await ids('select id from schedules'),[scheduleB]);
  for(const sql of [`select * from class_sessions where id='${a.cid}'`,`select * from session_students where id='${a.rid}'`,`select * from session_assessments where session_student_id='${a.rid}'`,`select * from session_observations where session_student_id='${a.rid}'`,`select * from schedule_students where schedule_id='${scheduleA}'`,'select * from student_alerts','select * from ai_jobs','select * from class_ai_jobs'])await hidden(sql);
  // Guru B tidak bisa menulis ke data guru A, baik langsung maupun lewat RPC.
  assert.equal((await as(stranger,"update students set name='Diubah' where id=$1 returning id",[kidA])).rows.length,0);
  assert.equal((await as(stranger,"update schedules set name='Diubah' where id=$1 returning id",[scheduleA])).rows.length,0);
  assert.equal((await as(stranger,'delete from schedules where id=$1 returning id',[scheduleA])).rows.length,0);
  await assert.rejects(as(stranger,'insert into schedule_students values($1,$2)',[scheduleA,kidB]),/row-level security/i);
  await assert.rejects(as(stranger,'insert into schedule_students values($1,$2)',[scheduleB,kidA]),/row-level security/i);
  await assert.rejects(as(stranger,'insert into assignments values($1,$2)',[kidA,stranger]),/row-level security/i);
  await assert.rejects(as(stranger,"select create_class($1,current_date,'Pasar',$2::uuid[])",[randomUUID(),[kidA]]),/Siswa tidak tersedia/);
  await assert.rejects(as(stranger,"select create_class($1,current_date,'Pasar',$2::uuid[])",[a.cid,[kidB]]),/Akses ditolak/);
  await assert.rejects(as(stranger,"select create_class($1,current_date,'Pasar',$2::uuid[],60)",[randomUUID(),[kidA]]),/Siswa tidak tersedia/);
  await assert.rejects(as(stranger,"select create_class($1,current_date,'Pasar',$2::uuid[],60)",[a.cid,[kidB]]),/Akses ditolak/);
  await assert.rejects(as(stranger,"select save_attendance($1,'Alfa')",[a.rid]),/Akses ditolak/);
  await assert.rejects(as(stranger,"select finalize_competency_evaluation($1,'[]'::jsonb,'',$2::jsonb)",[a.rid,'{}']),/Akses ditolak/);
  await assert.rejects(as(stranger,"select claim_ai_job($1,'report')",[a.rid]),/Akses ditolak/);
  await assert.rejects(as(stranger,'select claim_class_ai_job($1)',[a.cid]),/Akses ditolak/);
  await assert.rejects(as(stranger,'select set_class_schedule($1,$2)',[a.cid,scheduleB]),/Akses ditolak/);
  // Data guru A tetap utuh.
  assert.equal((await as(teacher,'select name from students where id=$1',[kidA])).rows[0].name,'Anak Guru A');
  assert.equal((await as(teacher,'select anecdote from session_students where id=$1',[a.rid])).rows[0].anecdote,'Catatan rahasia guru A');
  assert.equal((await as(teacher,'select count(*)::int as n from schedule_students where schedule_id=$1',[scheduleA])).rows[0].n,1);
 });
 await t.test('guru dapat mengubah profil umum siswanya sendiri saja',async()=>{
  const kid=randomUUID();
  await admin(`insert into students(id,name,parent_name,reading_baseline,reading_level,reading_target,math_baseline,math_level,math_target) values($1,'Fajar','Bunda Fajar',1,1,5,1,1,5)`,[kid]);
  await admin('insert into assignments values($1,$2)',[kid,teacher]);
  const profile=(extra={})=>JSON.stringify({name:'Fajar Nugraha',parent_name:'Bunda Rina',phone:'0812-3456-7890',interest:'Robot',diagnostic:'Mengenal huruf',learning_notes:'Visual',...extra});
  await as(teacher,'select update_student_profile($1,$2::jsonb)',[kid,profile({reading_target:16,reading_level:9,reading_baseline:5})]);
  const s=(await as(teacher,'select * from students where id=$1',[kid])).rows[0];
  assert.deepEqual([s.name,s.parent_name,s.phone,s.interest,s.diagnostic,s.learning_notes],['Fajar Nugraha','Bunda Rina','0812-3456-7890','Robot','Mengenal huruf','Visual']);
  assert.deepEqual([s.status,s.reading_target,s.reading_level,s.reading_baseline],['Aktif',5,1,1]);
  await assert.rejects(as(stranger,'select update_student_profile($1,$2::jsonb)',[kid,profile({name:'Diambil alih'})]),/Akses ditolak/);
  await assert.rejects(as(teacher,'select update_student_profile($1,$2::jsonb)',[kid,profile({name:'  '})]),/Nama anak/);
  await assert.rejects(as(teacher,'select update_student_profile($1,$2::jsonb)',[kid,profile({phone:'<script>'})]),/Nomor WhatsApp/);
  assert.equal((await as(teacher,"update students set name='Langsung' where id=$1 returning id",[kid])).rows.length,0);
  assert.equal((await as(teacher,'select name from students where id=$1',[kid])).rows[0].name,'Fajar Nugraha');
 });
 await t.test('guru mengatur target dan status siswanya; pemilik hanya membaca',async()=>{
  const kid=randomUUID();
  await admin(`insert into students(id,name,parent_name,reading_baseline,reading_level,reading_target,math_baseline,math_level,math_target) values($1,'Gita','Bunda Gita',2,2,6,2,2,6)`,[kid]);
  await admin('insert into assignments values($1,$2)',[kid,teacher]);
  await as(teacher,'select set_student_targets($1,$2::jsonb)',[kid,JSON.stringify({reading:9,math:8,ipas:7})]);
  const targets=Object.fromEntries((await as(teacher,"select subject,target from student_competencies where student_id=$1 and subject in ('reading','math','ipas')",[kid])).rows.map(r=>[r.subject,r.target]));
  assert.deepEqual(targets,{ipas:7,math:8,reading:9});
  const core=(await as(teacher,'select reading_target,math_target from students where id=$1',[kid])).rows[0];
  assert.deepEqual([core.reading_target,core.math_target],[9,8]);
  await assert.rejects(as(teacher,'select set_student_targets($1,$2::jsonb)',[kid,JSON.stringify({reading:1})]),/Target reading/);
  await assert.rejects(as(teacher,'select set_student_targets($1,$2::jsonb)',[kid,JSON.stringify({reading:17})]),/Target reading/);
  await assert.rejects(as(stranger,'select set_student_targets($1,$2::jsonb)',[kid,JSON.stringify({reading:10})]),/Akses ditolak/);
  await assert.rejects(as(owner,'select set_student_targets($1,$2::jsonb)',[kid,JSON.stringify({reading:10})]),/Akses ditolak/);
  const profile=(extra={})=>JSON.stringify({name:'Gita',parent_name:'Bunda Gita',...extra});
  await as(teacher,'select update_student_profile($1,$2::jsonb)',[kid,profile({status:'Non-Aktif'})]);
  assert.equal((await as(teacher,'select status from students where id=$1',[kid])).rows[0].status,'Non-Aktif');
  await assert.rejects(as(teacher,'select update_student_profile($1,$2::jsonb)',[kid,profile({status:'Lulus'})]),/kelulusan/);
  await assert.rejects(as(owner,'select update_student_profile($1,$2::jsonb)',[kid,profile({name:'Pemilik'})]),/hanya membaca/);
  // Pemilik tidak punya jalur tulis langsung ke data siswa, tetapi tetap bisa membaca.
  assert.equal((await as(owner,"update students set name='X' where id=$1 returning id",[kid])).rows.length,0);
  await assert.rejects(as(owner,'update student_competencies set target=10 where student_id=$1',[kid]),/permission denied/);
  await assert.rejects(as(owner,'insert into assignments values($1,$2)',[kid,stranger]),/row-level security/i);
  assert.equal((await as(owner,'select * from assignments where student_id=$1',[kid])).rows.length,1);
  assert.equal((await as(owner,'select name from students where id=$1',[kid])).rows[0].name,'Gita');
 });
 await t.test('guru mengoreksi level awal hanya sebelum anak ikut kelas',async()=>{
  const kid=randomUUID();
  await admin(`insert into students(id,name,parent_name,reading_baseline,reading_level,reading_target,math_baseline,math_level,math_target) values($1,'Hana','Bunda Hana',1,1,4,1,1,4)`,[kid]);
  await admin('insert into assignments values($1,$2)',[kid,teacher]);
  await as(teacher,'select correct_student_baseline($1,9,7)',[kid]);
  const s=(await as(teacher,'select reading_baseline,reading_level,reading_target,math_baseline,math_level,math_target from students where id=$1',[kid])).rows[0];
  assert.deepEqual([s.reading_baseline,s.reading_level,s.reading_target,s.math_baseline,s.math_level,s.math_target],[9,9,9,7,7,7]);
  const comps=Object.fromEntries((await as(teacher,'select subject,baseline,current_level,target from student_competencies where student_id=$1 and active',[kid])).rows.map(r=>[r.subject,[r.baseline,r.current_level,r.target]]));
  for(const subject of ['listening','speaking','reading','writing','ipas','english'])assert.deepEqual(comps[subject],[9,9,9],subject);
  assert.deepEqual(comps.math,[7,7,7]);
  await assert.rejects(as(teacher,'select correct_student_baseline($1,17,7)',[kid]),/Level awal harus/);
  await assert.rejects(as(stranger,'select correct_student_baseline($1,2,2)',[kid]),/Akses ditolak/);
  await assert.rejects(as(owner,'select correct_student_baseline($1,2,2)',[kid]),/Akses ditolak/);
  await create(teacher,kid);
  await assert.rejects(as(teacher,'select correct_student_baseline($1,3,3)',[kid]),/sebelum anak mengikuti kelas/);
 });
 await t.test('pemilik ditolak menambah siswa dan menjalankan kegiatan kelas',async()=>{
  await assert.rejects(as(owner,`insert into students(name,parent_name,reading_baseline,reading_level,reading_target,math_baseline,math_level,math_target) values('X','Y',1,1,3,1,1,3)`),/row-level security|agregat/i);
  await assert.rejects(as(owner,"select create_class($1,current_date,'Pasar',$2::uuid[])",[randomUUID(),[other]]),/agregat/);
  const fresh=randomUUID();
  await admin(`insert into students(id,name,parent_name,reading_baseline,reading_level,reading_target,math_baseline,math_level,math_target) values($1,'Dewi','Bunda Dewi',1,1,5,1,1,5)`,[fresh]);
  await admin('insert into assignments values($1,$2)',[fresh,teacher]);
  const x=await create(teacher,fresh);
  await assert.rejects(as(owner,"select save_attendance($1,'Sakit')",[x.rid]),/agregat/);
  await assert.rejects(as(owner,'select claim_class_ai_job($1)',[x.cid]),/agregat/);
  await as(teacher,"select save_attendance($1,'Sakit')",[x.rid]);
  assert.equal((await as(owner,'select attendance from session_students where id=$1',[x.rid])).rows[0].attendance,'Sakit');
 });
 await t.test('guru nonaktif kehilangan akses',async()=>{
  await as(owner,"update access_list set active=false where email='guru@test.invalid'");
  assert.equal((await as(teacher,'select * from students')).rows.length,0);
 });
 await db.close();
});
