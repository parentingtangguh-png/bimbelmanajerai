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
 // Anak baru harus dites diagnostik sebelum ikut kelas. Tes kelas di bawah tidak membahas tes diagnostik,
 // jadi siswa ujinya dianggap sudah dites; tes diagnostik sendiri mematikan ini lewat test.untested.
 await db.exec(`update students set diagnostic_status='Lulus Level 1' where diagnostic_status='';
 create function test_mark_tested() returns trigger language plpgsql as $$ begin
  if coalesce(current_setting('test.untested',true),'')<>'on' and new.diagnostic_status='' then new.diagnostic_status:='Lulus Level 1'; end if;
  return new; end $$;
 create trigger test_mark_tested before insert on students for each row execute function test_mark_tested();`);
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
 await t.test('kurikulum dikosongkan untuk revisi; hanya pemilik yang mengubah',async()=>{
  // 13 Sep 2026 pemilik merevisi kurikulum dari awal, jadi isi lama dihapus. Peta cakupan dan jangkar
  // indikator lama ikut dihapus; tulis penjaga baru bersama kurikulum baru.
  assert.equal((await admin('select count(*)::int as n from curriculum')).rows[0].n,0);
  await admin("insert into curriculum(level,reading,writing,math,english,character) values(1,'uji','uji','uji','uji','uji')");
  await as(owner,`update curriculum set reading_indicators='["Satu indikator uji"]'::jsonb, reading_key=1 where level=1`);
  assert.equal((await admin('select reading_key from curriculum where level=1')).rows[0].reading_key,1);
  await assert.rejects(as(owner,'update curriculum set reading_key=5 where level=1'),/curriculum_reading_key_range/);
  assert.equal((await as(teacher,'update curriculum set reading_key=0 where level=1 returning level')).rows.length,0);
 });
 await t.test('kurikulum pilot Fondasi lengkap: CP, 4 level x 8 indikator, 8 tema tanpa lubang',async()=>{
  const cp=(await admin("select cp from curriculum_phases where code='fondasi'")).rows[0].cp;
  assert.match(cp,/^Pada akhir Fase Fondasi, anak mampu mengenali/);
  const levels=(await admin("select level,title from curriculum_levels where phase_code='fondasi' order by level")).rows;
  assert.deepEqual(levels.map(r=>r.title),['Aku Siap Belajar','Aku Mulai Mengenal','Aku Mulai Bisa','Aku Siap ke SD']);
  // Tiap level wajib 8 indikator bernomor 1-8 tanpa lompatan, dan nomor 7 English, nomor 8 karakter.
  for(const {level} of levels){
   const ind=(await admin('select number,domain,text from curriculum_level_indicators where level=$1 order by number',[level])).rows;
   assert.deepEqual(ind.map(r=>r.number),[1,2,3,4,5,6,7,8],`level ${level} harus punya indikator 1-8`);
   assert.equal(ind[6].domain,'English',`level ${level} indikator 7`);
   assert.equal(ind[7].domain,'Karakter',`level ${level} indikator 8`);
   assert.match(ind[7].text,/\(observasi guru\)$/);
  }
  // Rentang pertemuan tema bersambung dari 1 sampai 192, 24 pertemuan per tema.
  const themes=(await admin("select number,name,first_meeting,last_meeting from curriculum_themes where phase_code='fondasi' order by number")).rows;
  assert.equal(themes.length,8);
  themes.forEach((th,i)=>{assert.equal(th.number,i+1);assert.equal(th.first_meeting,i*24+1);assert.equal(th.last_meeting,(i+1)*24);});
  assert.equal(themes[0].name,'Aku Bisa Bercerita');assert.equal(themes[7].name,'Aku Siap ke SD');
  // Setiap tema berdeskriptor lengkap, dan indikator fokusnya menunjuk indikator kurikulum yang ada.
  const desc=(await admin("select number,description,focus_areas,focus_indicators,character_focus,english_words from curriculum_themes where phase_code='fondasi' order by number")).rows;
  for(const d of desc){
   for(const k of ['description','focus_areas','character_focus','english_words'])assert.ok(d[k].trim().length>5,`tema ${d.number} belum punya ${k}`);
   assert.ok(d.focus_indicators.length>=5,`tema ${d.number} kekurangan indikator fokus`);
   for(const ref of d.focus_indicators){
    const [,lv,no]=ref.match(/^L(\d+)-(\d+)$/);
    assert.equal((await admin('select count(*)::int as n from curriculum_level_indicators where level=$1 and number=$2',[Number(lv),Number(no)])).rows[0].n,1,`tema ${d.number}: ${ref} tidak ada di kurikulum`);
   }
  }
  assert.match(desc[5].english_words,/I don't know/);
  await assert.rejects(admin("update curriculum_themes set focus_indicators=array['Level 1'] where number=1"),/check/);
  // Guru membaca tapi tidak menyunting; pemilik menyunting teks tapi tidak menambah baris.
  assert.equal((await as(teacher,'select * from curriculum_level_indicators')).rows.length,32);
  assert.equal((await as(teacher,"update curriculum_levels set title='X' where level=1 returning level")).rows.length,0);
  assert.equal((await as(owner,"update curriculum_levels set title=title where level=1 returning level")).rows.length,1);
  await assert.rejects(as(owner,"insert into curriculum_themes values(9,'fondasi','X',193,216)"),/permission denied/);
  assert.equal((await as(stranger,'select * from curriculum_levels')).rows.length,4,'guru terdaftar lain juga membaca');
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
 await t.test('centang indikator tersimpan dan tidak bisa disentuh guru lain',async()=>{
  const subject=(await as(teacher,'select subject from session_assessments where session_student_id=$1 order by subject limit 1',[session.rid])).rows[0].subject;
  await as(teacher,'select set_indicator_check($1,$2,1,true,$3)',[session.rid,subject,'Indikator uji']);
  const saved=(await as(teacher,'select * from session_indicator_checks where session_student_id=$1',[session.rid])).rows;
  assert.equal(saved.length,1);
  assert.equal(saved[0].indicator_text,'Indikator uji');
  assert.ok(saved[0].level_snapshot>=1,'level ikut tercatat untuk riwayat');
  // Unticking removes the row, so history never claims something the teacher took back.
  await as(teacher,'select set_indicator_check($1,$2,1,false,$3)',[session.rid,subject,'']);
  assert.equal((await as(teacher,'select * from session_indicator_checks where session_student_id=$1',[session.rid])).rows.length,0);
  await as(teacher,'select set_indicator_check($1,$2,2,true,$3)',[session.rid,subject,'Indikator kedua']);
  await assert.rejects(as(stranger,'select set_indicator_check($1,$2,3,true,$3)',[session.rid,subject,'x']),/Akses ditolak/);
  assert.equal((await as(stranger,'select * from session_indicator_checks')).rows.length,0);
  await assert.rejects(as(teacher,'select set_indicator_check($1,$2,1,true,$3)',[session.rid,'pancasila','x']),/Bidang bukan target/);
  await assert.rejects(as(teacher,'select set_indicator_check($1,$2,9,true,$3)',[session.rid,subject,'x']),/Indikator tidak dikenal/);
  await assert.rejects(as(teacher,"update session_indicator_checks set indicator_index=5 where session_student_id=$1",[session.rid]),/permission denied/);
 });
 await t.test('evaluasi final idempoten dan tidak menggandakan bukti',async()=>{
  await finalize(teacher,session.rid,'T','Aktif');
  // Once the evaluation is saved the ticks are part of the record and stop being editable.
  const subject=(await as(teacher,'select subject from session_assessments where session_student_id=$1 order by subject limit 1',[session.rid])).rows[0].subject;
  await assert.rejects(as(teacher,'select set_indicator_check($1,$2,3,true,$3)',[session.rid,subject,'x']),/Evaluasi sudah disimpan/);
  assert.equal((await as(teacher,'select * from session_indicator_checks where session_student_id=$1',[session.rid])).rows.length,1,'centang sebelum final tetap tersimpan sebagai riwayat');
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
 await t.test('sumatif per fase oleh guru pendamping: lulus fase memindahkan target, akhir Fase C berarti lulus',async()=>{
  const x=await create();await finalize(teacher,x.rid,'T','');
  const core=(await as(teacher,'select reading_level,reading_target from students where id=$1',[student])).rows[0];
  assert.ok(core.reading_level<=core.reading_target);
  await assert.rejects(as(owner,'select complete_summative($1,90,true)',[student]),/Hanya guru pendamping/);
  await assert.rejects(as(stranger,'select complete_summative($1,90,true)',[student]),/Hanya guru pendamping/);
  await assert.rejects(as(teacher,'select complete_summative($1,90,true)',[student]),/Target kompetensi wajib/);
  await admin('update student_competencies set current_level=target where student_id=$1 and required',[student]);
  await as(teacher,'select complete_summative($1,90,true)',[student]);
  const afterPhase=(await as(teacher,'select status,reading_target,math_target from students where id=$1',[student])).rows[0];
  assert.deepEqual([afterPhase.status,afterPhase.reading_target,afterPhase.math_target],['Aktif',8,8]);
  assert.equal((await as(teacher,"select target from student_competencies where student_id=$1 and subject='ipas'",[student])).rows[0].target,8);
  await admin('update student_competencies set current_level=16,target=16 where student_id=$1 and required',[student]);
  await as(teacher,'select complete_summative($1,95,true)',[student]);
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
 await t.test('guru membuat siswa dengan identitas lengkap; tanggal lahir dan kelas formal wajib',async()=>{
  const baru=(extra={})=>JSON.stringify({name:'Hana',parent_name:'Bunda Hana',phone:'',reading_baseline:1,reading_target:4,math_baseline:1,math_target:4,nickname:'Fajar',birth_date:'2019-03-14',school_grade:'SD 1',school_year:'2026/2027',...extra});
  const id=(await as(teacher,'select create_student($1::jsonb) as id',[baru()])).rows[0].id;
  const s=(await as(teacher,'select * from students where id=$1',[id])).rows[0];
  assert.deepEqual([s.nickname,s.birth_date.toISOString().slice(0,10),s.school_grade,s.school_year,s.interest],['Fajar','2019-03-14','SD 1','2026/2027','']);
  assert.equal((await as(teacher,'select count(*)::int n from assignments where student_id=$1 and teacher_id=$2',[id,teacher])).rows[0].n,1);
  await assert.rejects(as(teacher,'select create_student($1::jsonb)',[baru({birth_date:null})]),/Tanggal lahir wajib/);
  await assert.rejects(as(teacher,'select create_student($1::jsonb)',[baru({birth_date:'2099-01-01'})]),/tidak masuk akal/);
  await assert.rejects(as(teacher,'select create_student($1::jsonb)',[baru({school_grade:''})]),/Kelas formal/);
  await assert.rejects(as(teacher,'select create_student($1::jsonb)',[baru({school_year:'2026'})]),/Tahun ajaran/);
 });
 await t.test('guru dapat mengubah profil umum siswanya sendiri saja',async()=>{
  const kid=randomUUID();
  await admin(`insert into students(id,name,parent_name,reading_baseline,reading_level,reading_target,math_baseline,math_level,math_target) values($1,'Fajar','Bunda Fajar',1,1,5,1,1,5)`,[kid]);
  await admin('insert into assignments values($1,$2)',[kid,teacher]);
  const profile=(extra={})=>JSON.stringify({name:'Fajar Nugraha',parent_name:'Bunda Rina',phone:'0812-3456-7890',interest:'Robot',diagnostic:'Mengenal huruf',learning_notes:'Visual',nickname:'Fajar',birth_date:'2019-03-14',school_grade:'SD 1',school_year:'2026/2027',...extra});
  await as(teacher,'select update_student_profile($1,$2::jsonb)',[kid,profile({reading_target:16,reading_level:9,reading_baseline:5})]);
  const s=(await as(teacher,'select * from students where id=$1',[kid])).rows[0];
  assert.deepEqual([s.name,s.parent_name,s.phone,s.interest,s.diagnostic,s.learning_notes],['Fajar Nugraha','Bunda Rina','0812-3456-7890','Robot','Mengenal huruf','Visual']);
  assert.deepEqual([s.status,s.reading_target,s.reading_level,s.reading_baseline],['Aktif',4,1,1]);
  assert.deepEqual([s.nickname,s.birth_date.toISOString().slice(0,10),s.school_grade,s.school_year],['Fajar','2019-03-14','SD 1','2026/2027']);
  await assert.rejects(as(teacher,'select update_student_profile($1,$2::jsonb)',[kid,profile({birth_date:''})]),/Tanggal lahir wajib/);
  await assert.rejects(as(teacher,'select update_student_profile($1,$2::jsonb)',[kid,profile({school_grade:'Kelas 7'})]),/Kelas formal/);
  await assert.rejects(as(teacher,'select update_student_profile($1,$2::jsonb)',[kid,profile({school_year:'2026/2028'})]),/Tahun ajaran/);
  await assert.rejects(as(stranger,'select update_student_profile($1,$2::jsonb)',[kid,profile({name:'Diambil alih'})]),/Akses ditolak/);
  await assert.rejects(as(teacher,'select update_student_profile($1,$2::jsonb)',[kid,profile({name:'  '})]),/Nama anak/);
  await assert.rejects(as(teacher,'select update_student_profile($1,$2::jsonb)',[kid,profile({phone:'<script>'})]),/Nomor WhatsApp/);
  assert.equal((await as(teacher,"update students set name='Langsung' where id=$1 returning id",[kid])).rows.length,0);
  assert.equal((await as(teacher,'select name from students where id=$1',[kid])).rows[0].name,'Fajar Nugraha');
 });
 await t.test('target mengalir ke akhir fase; guru mengatur status; pemilik hanya membaca',async()=>{
  const kid=randomUUID();
  await admin(`insert into students(id,name,parent_name,reading_baseline,reading_level,reading_target,math_baseline,math_level,math_target) values($1,'Gita','Bunda Gita',2,2,6,2,2,6)`,[kid]);
  await admin('insert into assignments values($1,$2)',[kid,teacher]);
  // Inserted with target 6, but targets always flow to the end of the current phase (level 2 → 4).
  const targets=Object.fromEntries((await as(teacher,"select subject,target from student_competencies where student_id=$1 and subject in ('reading','math','ipas')",[kid])).rows.map(r=>[r.subject,r.target]));
  assert.deepEqual(targets,{ipas:4,math:4,reading:4});
  const core=(await as(teacher,'select reading_target,math_target from students where id=$1',[kid])).rows[0];
  assert.deepEqual([core.reading_target,core.math_target],[4,4]);
  await assert.rejects(as(teacher,'select set_student_targets($1,$2::jsonb)',[kid,JSON.stringify({reading:9})]),/does not exist/);
  const profile=(extra={})=>JSON.stringify({name:'Gita',parent_name:'Bunda Gita',birth_date:'2018-07-01',school_grade:'SD 2',school_year:'2026/2027',...extra});
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
  assert.deepEqual([s.reading_baseline,s.reading_level,s.reading_target,s.math_baseline,s.math_level,s.math_target],[9,9,12,7,7,8]);
  const comps=Object.fromEntries((await as(teacher,'select subject,baseline,current_level,target from student_competencies where student_id=$1 and active',[kid])).rows.map(r=>[r.subject,[r.baseline,r.current_level,r.target]]));
  for(const subject of ['listening','speaking','reading','writing','ipas','english'])assert.deepEqual(comps[subject],[9,9,12],subject);
  assert.deepEqual(comps.math,[7,7,8]);
  await assert.rejects(as(teacher,'select correct_student_baseline($1,17,7)',[kid]),/Level awal harus/);
  await assert.rejects(as(stranger,'select correct_student_baseline($1,2,2)',[kid]),/Akses ditolak/);
  await assert.rejects(as(owner,'select correct_student_baseline($1,2,2)',[kid]),/Akses ditolak/);
  await create(teacher,kid);
  await assert.rejects(as(teacher,'select correct_student_baseline($1,3,3)',[kid]),/sebelum anak mengikuti kelas/);
 });
 await t.test('guru hanya bisa menghapus siswanya yang belum pernah ikut kelas',async()=>{
  const fresh=randomUUID(),used=randomUUID(),shared=randomUUID();
  await admin(`insert into students(id,name,parent_name,reading_baseline,reading_level,reading_target,math_baseline,math_level,math_target) values($1,'Salah Input','Bunda',1,1,4,1,1,4),($2,'Pernah Kelas','Bunda',1,1,4,1,1,4),($3,'Dibagi','Bunda',1,1,4,1,1,4)`,[fresh,used,shared]);
  await admin('insert into assignments values($1,$2),($3,$2),($4,$2),($4,$5)',[fresh,teacher,used,shared,stranger]);
  const sid=(await as(teacher,"insert into schedules(name,start_time,end_time) values('Jadwal hapus','13:00','14:00') returning id")).rows[0].id;
  await as(teacher,'insert into schedule_students values($1,$2)',[sid,fresh]);
  await assert.rejects(as(stranger,'select delete_student($1)',[fresh]),/Akses ditolak/);
  await assert.rejects(as(owner,'select delete_student($1)',[fresh]),/Akses ditolak/);
  await as(teacher,'select delete_student($1)',[fresh]);
  for(const sql of ['select count(*)::int as n from students where id=$1','select count(*)::int as n from student_competencies where student_id=$1','select count(*)::int as n from schedule_students where student_id=$1','select count(*)::int as n from assignments where student_id=$1'])assert.equal((await admin(sql,[fresh])).rows[0].n,0,sql);
  await create(teacher,used);
  await assert.rejects(as(teacher,'select delete_student($1)',[used]),/Non-Aktif/);
  await assert.rejects(as(teacher,'select delete_student($1)',[shared]),/guru lain/);
  await assert.rejects(as(teacher,'delete from students where id=$1',[used]),/permission denied/);
  assert.equal((await admin('select count(*)::int as n from students where id=any($1::uuid[])',[[used,shared]])).rows[0].n,2);
 });
 await t.test('guru menonaktifkan dan mengaktifkan kembali siswanya; sesi terbuka mencegah nonaktif',async()=>{
  const kid=randomUUID();
  await admin(`insert into students(id,name,parent_name,reading_baseline,reading_level,reading_target,math_baseline,math_level,math_target) values($1,'Indra','Bunda Indra',1,1,4,1,1,4)`,[kid]);
  await admin('insert into assignments values($1,$2)',[kid,teacher]);
  const status=async()=>(await as(teacher,'select status from students where id=$1',[kid])).rows[0].status;
  await as(teacher,'select set_student_active($1,false)',[kid]);assert.equal(await status(),'Non-Aktif');
  await assert.rejects(as(teacher,"select create_class($1,current_date,'Pasar',$2::uuid[])",[randomUUID(),[kid]]),/Siswa tidak tersedia/);
  await as(teacher,'select set_student_active($1,true)',[kid]);assert.equal(await status(),'Aktif');
  await assert.rejects(as(stranger,'select set_student_active($1,false)',[kid]),/Akses ditolak/);
  await assert.rejects(as(owner,'select set_student_active($1,false)',[kid]),/Akses ditolak/);
  await create(teacher,kid);
  await assert.rejects(as(teacher,'select set_student_active($1,false)',[kid]),/sesi yang masih terbuka/);
  await assert.rejects(as(teacher,'select update_student_profile($1,$2::jsonb)',[kid,JSON.stringify({name:'Indra',parent_name:'Bunda Indra',nickname:'Fajar',birth_date:'2019-03-14',school_grade:'SD 1',school_year:'2026/2027',status:'Non-Aktif'})]),/sesi yang masih terbuka/);
  assert.equal(await status(),'Aktif');
 });
 await t.test('pemilik ditolak menambah siswa dan menjalankan kegiatan kelas',async()=>{
  await assert.rejects(as(owner,'select create_student($1::jsonb)',[JSON.stringify({name:'X',parent_name:'Y',reading_baseline:1,reading_target:4,math_baseline:1,math_target:4,nickname:'Fajar',birth_date:'2019-03-14',school_grade:'SD 1',school_year:'2026/2027'})]),/agregat/);
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
 await t.test('evaluasi terakhir bisa dibuka kembali dan mengembalikan kenaikan level',async()=>{
  const koreksi=randomUUID();
  await admin(`insert into students(id,name,parent_name,reading_baseline,reading_level,reading_target,math_baseline,math_level,math_target) values($1,'Dewi','Bunda Dewi',10,10,16,10,10,16)`,[koreksi]);
  await admin('insert into assignments values($1,$2)',[koreksi,teacher]);
  const kosong=JSON.stringify({english_rating:'',english_note:'',character_dimensions:[],character_note:''});
  const nilai=async()=>(await as(teacher,'select subject,current_level,evidence_count,repeat_count from student_competencies where student_id=$1 and active order by subject',[koreksi])).rows;
  const simpan=(rid,subjects,note)=>as(teacher,'select finalize_competency_evaluation($1,$2::jsonb,$3,$4::jsonb)',[rid,JSON.stringify(subjects.map(subject=>({subject,rating:'T',note}))),note,kosong]);
  // Dua bukti Tercapai pada kompetensi yang sama menaikkan level; itulah yang harus bisa dibatalkan.
  let x=await create(teacher,koreksi);
  const pertama=(await as(teacher,'select subject from session_assessments where session_student_id=$1 order by subject',[x.rid])).rows.map(r=>r.subject);
  await simpan(x.rid,pertama,'Bukti pertama');
  x=await create(teacher,koreksi);
  const kedua=(await as(teacher,'select subject from session_assessments where session_student_id=$1 order by subject',[x.rid])).rows.map(r=>r.subject);
  const bersama=pertama.find(subject=>kedua.includes(subject));
  const sebelum=await nilai();
  await simpan(x.rid,kedua,'Bukti kedua');
  assert.equal((await nilai()).find(r=>r.subject===bersama).current_level,11,'dua bukti menaikkan level');
  await assert.rejects(as(owner,'select reopen_evaluation($1)',[x.rid]),/Pemilik hanya membaca/);
  await assert.rejects(as(stranger,'select reopen_evaluation($1)',[x.rid]),/Akses ditolak/);
  await as(teacher,'select reopen_evaluation($1)',[x.rid]);
  assert.deepEqual(await nilai(),sebelum,'kompetensi kembali persis seperti sebelum evaluasi');
  const r=(await as(teacher,'select finalized_at,grade from session_students where id=$1',[x.rid])).rows[0];
  assert.equal(r.finalized_at,null,'sesi kembali bisa diedit');
  assert.equal(r.grade,null);
  assert.equal((await as(teacher,'select count(*)::int as n from session_assessments where session_student_id=$1 and rating is not null',[x.rid])).rows[0].n,kedua.length,'jawaban guru tetap terbaca saat dibuka kembali');
  await assert.rejects(as(teacher,'select reopen_evaluation($1)',[x.rid]),/belum disimpan/);
  // Menyimpan ulang menaikkan levelnya lagi: koreksi tidak merusak alur kenaikan.
  await simpan(x.rid,kedua,'Bukti kedua diulang');
  assert.equal((await nilai()).find(r=>r.subject===bersama).current_level,11);
  // Evaluasi lama ditolak: mengembalikan potret lama akan menghapus kemajuan sesudahnya.
  const lama=(await as(teacher,'select id from session_students where student_id=$1 and id<>$2 and finalized_at is not null',[koreksi,x.rid])).rows[0].id;
  await assert.rejects(as(teacher,'select reopen_evaluation($1)',[lama]),/Hanya evaluasi terakhir/);
 });
 await t.test('sesi yang belum dievaluasi bisa dibatalkan; yang sudah, tidak',async()=>{
  const batal=randomUUID();
  await admin(`insert into students(id,name,parent_name,reading_baseline,reading_level,reading_target,math_baseline,math_level,math_target) values($1,'Eka','Bunda Eka',5,5,8,5,5,8)`,[batal]);
  await admin('insert into assignments values($1,$2)',[batal,teacher]);
  const x=await create(teacher,batal);
  // Sesi terbuka mengunci anak: tidak bisa masuk kelas lain sampai dievaluasi.
  await assert.rejects(create(teacher,batal),/sesi/i);
  await assert.rejects(as(owner,'select delete_class($1)',[x.cid]),/Pemilik tidak membuka/);
  await assert.rejects(as(stranger,'select delete_class($1)',[x.cid]),/Akses ditolak/);
  await as(teacher,'select delete_class($1)',[x.cid]);
  assert.equal((await admin('select count(*)::int as n from class_sessions where id=$1',[x.cid])).rows[0].n,0);
  assert.equal((await admin('select count(*)::int as n from session_students where session_id=$1',[x.cid])).rows[0].n,0,'baris anak ikut terhapus');
  assert.equal((await admin('select count(*)::int as n from session_assessments where session_student_id=$1',[x.rid])).rows[0].n,0,'target ikut terhapus');
  // Anak bebas lagi setelah sesinya dibatalkan.
  const y=await create(teacher,batal);
  const kosong=JSON.stringify({english_rating:'',english_note:'',character_dimensions:[],character_note:''});
  const subjects=(await as(teacher,'select subject from session_assessments where session_student_id=$1',[y.rid])).rows.map(r=>r.subject);
  await as(teacher,'select finalize_competency_evaluation($1,$2::jsonb,$3,$4::jsonb)',[y.rid,JSON.stringify(subjects.map(subject=>({subject,rating:'MB',note:'Bukti'}))),'Sudah dievaluasi',kosong]);
  await assert.rejects(as(teacher,'select delete_class($1)',[y.cid]),/sudah punya evaluasi tersimpan/);
 });
 await t.test('tabel potret kompetensi tertutup untuk pengguna',async()=>{
  // Dua lapis: tidak ada izin tabel, dan RLS menyala tanpa satu pun kebijakan.
  assert.equal((await db.query("select has_table_privilege('authenticated','public.session_competency_snapshots','select') as boleh")).rows[0].boleh,false);
  assert.equal((await db.query("select relrowsecurity as on from pg_class where relname='session_competency_snapshots'")).rows[0].on,true);
  assert.equal((await db.query("select count(*)::int as n from pg_policies where tablename='session_competency_snapshots'")).rows[0].n,0);
 });
 await t.test('tugas diagnostik menempel pada indikator Level 1-4',async()=>{
  const rows=(await admin('select level,number,diagnostic_task,diagnostic_material,diagnostic_success,diagnostic_observe from curriculum_level_indicators where level between 1 and 4 order by level,number')).rows;
  assert.equal(rows.length,32);
  for(const r of rows){
   for(const k of ['diagnostic_task','diagnostic_material','diagnostic_success'])assert.ok(r[k].trim().length>0,`L${r.level}-${r.number} belum punya ${k}`);
   assert.ok(!/kartu|pasir/i.test(r.diagnostic_task+' '+r.diagnostic_material),`L${r.level}-${r.number} masih butuh kartu cetak atau pasir`);
   // Karakter (8) dan L1-1 diamati sepanjang tes; tugas lain tidak.
   assert.equal(r.diagnostic_observe,r.number===8||(r.level===1&&r.number===1),`L${r.level}-${r.number} penanda diamati`);
   if(r.diagnostic_observe)assert.match(r.diagnostic_task,/sepanjang tes/);
  }
  const at=(l,n)=>rows.find(r=>r.level===l&&r.number===n);
  assert.match(at(3,2).diagnostic_material,/jangan ditulis atau diperlihatkan/,'jawaban dikte tidak diperlihatkan');
  assert.match(at(3,3).diagnostic_material,/ku · bu → buku/,'suku kata disajikan tertukar');
  assert.match(at(1,6).diagnostic_success,/tetap ✓/);
 });
 await t.test('tes diagnostik satu level: lulus bila 1-6 semua T, sekali, bisa direvisi sebelum kelas',async()=>{
  const kid=randomUUID(),lain=randomUUID(),k2=randomUUID();
  await db.query("select set_config('test.untested','on',false)");
  await admin(`insert into students(id,name,parent_name,reading_baseline,reading_level,reading_target,math_baseline,math_level,math_target) values($1,'Citra','Bunda',1,1,4,1,1,4),($2,'Daffa','Ayah',1,1,4,1,1,4),($3,'Eka','Ibu',1,1,4,1,1,4)`,[kid,lain,k2]);
  await db.query("select set_config('test.untested','off',false)");
  await admin('insert into assignments values($1,$2),($3,$2)',[kid,teacher,k2]);
  await admin('insert into assignments values($1,$2)',[lain,stranger]);
  const lvl=(level,ratings)=>ratings.map((rating,i)=>({level,number:i+1,rating}));
  const simpan=(who,sid,level,res,summary)=>as(who,'select save_diagnostic($1,$2,$3::jsonb,$4,$5,$6) as final',[sid,level,JSON.stringify(res),summary,'catatan','gaya']);
  // Belum dites → tidak bisa masuk kelas.
  await assert.rejects(create(teacher,kid),/tes diagnostik untuk Citra sebelum ikut kelas/);
  // Satu ◐ di indikator 1-6 = belum lulus; English dan Karakter tidak menentukan.
  const hampir=lvl(2,['T','T','B','T','T','T','N','N']);
  await assert.rejects(simpan(owner,kid,2,hampir,'Level awal: 2'),/guru pendamping/,'pemilik ditolak');
  await assert.rejects(simpan(stranger,kid,2,hampir,'Level awal: 2'),/guru pendamping/,'guru lain ditolak');
  await assert.rejects(simpan(teacher,kid,2,hampir,'Level awal: 3'),/Ringkasan tidak sesuai/,'database menghitung sendiri');
  await assert.rejects(simpan(teacher,kid,2,lvl(2,['T','T','T','T','T']),'Level awal: 2'),/belum selesai dinilai/);
  await assert.rejects(simpan(teacher,kid,2,[...hampir,{level:3,number:1,rating:'T'}],'Level awal: 2'),/hanya boleh berisi indikator Level 2/,'satu level saja');
  await assert.rejects(simpan(teacher,kid,2,[...hampir,{level:2,number:1,rating:'T'}],'Level awal: 2'),/lebih dari sekali/);
  assert.equal((await admin('select count(*)::int as n from diagnostic_tests where student_id=$1',[kid])).rows[0].n,0,'gagal tidak meninggalkan data');
  assert.equal((await simpan(teacher,kid,2,hampir,'Tes · Level awal: 2')).rows[0].final,2);
  let st=(await admin('select reading_baseline,math_baseline,diagnostic_status,diagnostic from students where id=$1',[kid])).rows[0];
  assert.deepEqual([st.reading_baseline,st.math_baseline,st.diagnostic_status,st.diagnostic],[2,2,'Belum lulus Level 2','Tes · Level awal: 2']);
  let tes=(await admin('select tested_level,passed,final_level,revised_at,teacher_id from diagnostic_tests where student_id=$1',[kid])).rows[0];
  assert.deepEqual([tes.tested_level,tes.passed,tes.final_level,tes.revised_at,tes.teacher_id],[2,false,2,null,teacher]);
  assert.equal((await admin('select count(*)::int as n from diagnostic_results r join diagnostic_tests t on t.id=r.test_id where t.student_id=$1',[kid])).rows[0].n,8);
  // Salinan kalimat indikator tetap walau kurikulum diubah.
  const asli=(await admin('select indicator_text from diagnostic_results r join diagnostic_tests t on t.id=r.test_id where t.student_id=$1 and indicator_number=1',[kid])).rows[0].indicator_text;
  await as(owner,"update curriculum_level_indicators set text='Teks baru' where level=2 and number=1");
  assert.equal((await admin('select indicator_text from diagnostic_results r join diagnostic_tests t on t.id=r.test_id where t.student_id=$1 and indicator_number=1',[kid])).rows[0].indicator_text,asli);
  await as(owner,'update curriculum_level_indicators set text=$1 where level=2 and number=1',[asli]);
  // Akses baca: guru pendamping ya; guru lain dan pemilik tidak, tapi pemilik membaca status di students.
  assert.equal((await as(teacher,'select * from diagnostic_tests where student_id=$1',[kid])).rows.length,1);
  assert.equal((await as(stranger,'select * from diagnostic_tests where student_id=$1',[kid])).rows.length,0);
  assert.equal((await as(owner,'select * from diagnostic_results')).rows.length,0);
  assert.equal((await as(owner,'select diagnostic_status from students where id=$1',[kid])).rows[0].diagnostic_status,'Belum lulus Level 2');
  await assert.rejects(as(teacher,"insert into diagnostic_tests(student_id,teacher_id,start_level,final_level) values($1,$2,1,1)",[lain,teacher]),/permission denied|row-level security/);
  // Revisi: tetap satu tes; kini lulus Level 2 → level awal 3, status berubah, tanggal revisi tercatat.
  const lulus=lvl(2,['T','T','T','T','T','T','B']);
  assert.equal((await simpan(teacher,kid,2,lulus,'Revisi · Level awal: 3')).rows[0].final,3);
  st=(await admin('select reading_baseline,diagnostic_status from students where id=$1',[kid])).rows[0];
  assert.deepEqual([st.reading_baseline,st.diagnostic_status],[3,'Lulus Level 2']);
  tes=(await admin('select count(*) over() as n,passed,final_level,revised_at is not null as r from diagnostic_tests where student_id=$1',[kid])).rows[0];
  assert.deepEqual([Number(tes.n),tes.passed,tes.final_level,tes.r],[1,true,3,true]);
  assert.equal((await admin('select count(*)::int as n from diagnostic_results r join diagnostic_tests t on t.id=r.test_id where t.student_id=$1',[kid])).rows[0].n,7,'hanya hasil terakhir');
  // Sudah dites → boleh masuk kelas; sesudahnya hasil terkunci.
  await create(teacher,kid);
  await assert.rejects(simpan(teacher,kid,2,hampir,'Level awal: 2'),/tidak bisa direvisi setelah anak mengikuti kelas/);
  // Lulus Level 4 → tetap Level 4, melampaui Fondasi.
  assert.equal((await simpan(teacher,k2,4,lvl(4,['T','T','T','T','T','T']),'Level awal: 4 (melampaui Fondasi)')).rows[0].final,4);
  tes=(await admin('select beyond,passed from diagnostic_tests where student_id=$1',[k2])).rows[0];
  assert.deepEqual([tes.beyond,tes.passed],[true,true]);
  assert.equal((await admin('select diagnostic_status from students where id=$1',[k2])).rows[0].diagnostic_status,'Lulus Level 4');
 });
 await t.test('guru nonaktif kehilangan akses',async()=>{
  await as(owner,"update access_list set active=false where email='guru@test.invalid'");
  assert.equal((await as(teacher,'select * from students')).rows.length,0);
 });
 await db.close();
});
