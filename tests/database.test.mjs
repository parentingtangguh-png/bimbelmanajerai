import test from 'node:test';
import assert from 'node:assert/strict';
import { PGlite } from '@electric-sql/pglite';
import { readFile, readdir } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';

// Semua migrasi dijalankan berurutan, jadi yang diuji adalah keadaan akhir.
test('PostgreSQL: akun, siswa, kurikulum 8 level, tes diagnostik, dan ruang kelas',async t=>{
 const db=new PGlite();
 await db.exec(`create role anon; create role authenticated; create role service_role bypassrls; create schema auth;
 create table auth.users(id uuid primary key,email text);
 create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
 grant usage on schema public,auth to authenticated,anon,service_role; grant execute on function auth.uid() to authenticated,anon,service_role;`);
 const migrationDir=new URL('../supabase/migrations/',import.meta.url);
 const migrations=(await readdir(migrationDir)).filter(file=>file.endsWith('.sql')).sort();
 for(const file of migrations)await db.exec((await readFile(new URL(file,migrationDir),'utf8')).replace(/^\uFEFF/,''));
 const owner=randomUUID(),teacher=randomUUID(),stranger=randomUUID();
 await db.exec(`insert into access_list values('owner@test.invalid','Pemilik','owner',true),('guru@test.invalid','Guru','teacher',true),('lain@test.invalid','Guru Lain','teacher',true);`);
 await db.query('insert into auth.users values($1,$2),($3,$4),($5,$6)',[owner,'owner@test.invalid',teacher,'guru@test.invalid',stranger,'lain@test.invalid']);
 async function as(id,sql,args=[]){await db.exec('reset role');await db.query("select set_config('request.jwt.claim.sub',$1,false)",[id]);await db.exec('set role authenticated');return db.query(sql,args);}
 async function admin(sql,args=[]){await db.exec('reset role');await db.query("select set_config('request.jwt.claim.sub','',false)");return db.query(sql,args);}
 const identitas=(extra={})=>JSON.stringify({name:'Hana Salsabila',parent_name:'Bunda Hana',phone:'',nickname:'Hana',birth_date:'2021-03-14',school_grade:'TK A',school_year:'2026/2027',...extra});
 const buat=async(who=teacher,extra={})=>(await as(who,'select create_student($1::jsonb) as id',[identitas(extra)])).rows[0].id;

 await t.test('kurikulum 8 level: isi lengkap, hanya dibaca, kata benda English unik',async()=>{
  assert.equal((await as(teacher,'select count(*)::int n from k8_indicators')).rows[0].n,252);
  assert.equal((await as(stranger,'select count(*)::int n from k8_levels')).rows[0].n,18,'semua anggota membaca');
  assert.equal((await as(owner,'select count(*)::int n from k8_subthemes')).rows[0].n,64);
  assert.equal((await as(teacher,"select count(*)::int n from k8_theme_english where kind='noun'")).rows[0].n,80);
  await assert.rejects(as(owner,"update k8_levels set title='X' where level=1"),/permission denied/,'pemilik pun tidak mengubah isi');
  await assert.rejects(as(owner,"insert into k8_cp values(1,'X')"),/permission denied|row-level/);
  await assert.rejects(admin("insert into k8_theme_english values(2,'noun',9,'BOX',false)"),/duplicate|unique/);
  await assert.rejects(admin("insert into k8_theme_english values(2,'phrase',9,'open jar',true)"),/check/);
  assert.equal((await as(teacher,"select slot from k8_indicators where level=3 and number=11")).rows[0].slot,'C2');
 });
 await t.test('struktur lama sudah tidak ada',async()=>{
  const tabel=(await admin("select table_name from information_schema.tables where table_schema='public' order by 1")).rows.map(r=>r.table_name);
  assert.deepEqual(tabel,['access_list','assignments','class_schedule_students','class_schedules','diagnostic_results','diagnostic_tests','k8_cp','k8_indicators','k8_levels','k8_notes','k8_subthemes','k8_theme_english','k8_themes','profiles','student_level_changes','students']);
  const fungsi=(await admin("select proname from pg_proc where pronamespace='public'::regnamespace order by 1")).rows.map(r=>r.proname);
  assert.deepEqual(fungsi,['can_teach','check_student_identity','confirm_level_up','create_student','current_indicator','delete_schedule','delete_student','diagnostic_restart_level','diagnostic_stopped','finalize_diagnostic','handle_new_user','is_member','is_owner','passed_numbers','rate_diagnostic','reject_owner_student_insert','save_meeting','save_schedule','set_student_active','start_diagnostic','theme_attendance','update_student_profile']);
  const kolom=(await admin("select column_name from information_schema.columns where table_schema='public' and table_name='students' order by ordinal_position")).rows.map(r=>r.column_name);
  assert.deepEqual(kolom,['id','name','parent_name','phone','status','created_at','nickname','birth_date','school_grade','school_year','pilot_level']);
  const tes=(await admin("select column_name from information_schema.columns where table_schema='public' and table_name='diagnostic_tests' order by ordinal_position")).rows.map(r=>r.column_name);
  assert.deepEqual(tes,['id','student_id','teacher_id','tested_level','started_on','finalized_at','start_level','start_indicator','curriculum_complete','created_at']);
 });
 await t.test('email tidak dikenal tidak bisa mendaftar',async()=>{await db.exec('reset role');await assert.rejects(db.query('insert into auth.users values($1,$2)',[randomUUID(),'unknown@test.invalid']),/belum didaftarkan/);});
 await t.test('fungsi pemicu tidak tersedia sebagai RPC pengguna',async()=>{
  for(const f of ['public.passed_numbers(uuid,integer)','public.current_indicator(uuid)','public.theme_attendance(uuid,integer,date)','public.diagnostic_stopped(uuid)','public.diagnostic_restart_level(integer)','public.handle_new_user()','public.reject_owner_student_insert()','public.check_student_identity(jsonb)'])
   assert.equal((await db.query('select has_function_privilege($1,$2,$3) as allowed',['authenticated',f,'execute'])).rows[0].allowed,false,f);
  assert.equal((await db.query("select has_function_privilege('anon','public.create_student(jsonb)','execute') as allowed")).rows[0].allowed,false);
 });
 await t.test('guru membuat siswa baru: identitas saja, level kosong sampai dites',async()=>{
  const id=await buat();
  const s=(await as(teacher,'select * from students where id=$1',[id])).rows[0];
  assert.deepEqual([s.name,s.nickname,s.birth_date.toISOString().slice(0,10),s.school_grade,s.school_year,s.status,s.pilot_level],['Hana Salsabila','Hana','2021-03-14','TK A','2026/2027','Aktif',null]);
  assert.equal((await as(teacher,'select count(*)::int n from assignments where student_id=$1 and teacher_id=$2',[id,teacher])).rows[0].n,1);
  await assert.rejects(as(teacher,'select create_student($1::jsonb)',[identitas({birth_date:null})]),/Tanggal lahir wajib/);
  await assert.rejects(as(teacher,'select create_student($1::jsonb)',[identitas({birth_date:'2099-01-01'})]),/tidak masuk akal/);
  await assert.rejects(as(teacher,'select create_student($1::jsonb)',[identitas({school_grade:''})]),/Kelas formal/);
  await assert.rejects(as(teacher,'select create_student($1::jsonb)',[identitas({school_year:'2026'})]),/Tahun ajaran/);
  await assert.rejects(as(teacher,'select create_student($1::jsonb)',[identitas({name:' '})]),/Nama anak/);
  await assert.rejects(as(owner,'select create_student($1::jsonb)',[identitas()]),/Pemilik hanya membaca/,'pemilik tidak menambah siswa');
  // Tulis langsung ke tabel ditolak; semua perubahan lewat RPC.
  await assert.rejects(as(teacher,"insert into students(name,parent_name) values('X','Y')"),/row-level security/i);
  assert.equal((await as(teacher,"update students set pilot_level=4 where id=$1 returning id",[id])).rows.length,0);
 });
 await t.test('profil, status, dan hapus siswa hanya oleh guru pendampingnya',async()=>{
  const id=await buat();
  await as(teacher,'select update_student_profile($1,$2::jsonb)',[id,identitas({name:'Hana S.',phone:'0812-3456-7890'})]);
  assert.deepEqual(Object.values((await as(teacher,'select name,phone from students where id=$1',[id])).rows[0]),['Hana S.','0812-3456-7890']);
  await assert.rejects(as(teacher,'select update_student_profile($1,$2::jsonb)',[id,identitas({phone:'<script>'})]),/Nomor WhatsApp/);
  await assert.rejects(as(stranger,'select update_student_profile($1,$2::jsonb)',[id,identitas()]),/Akses ditolak/);
  await assert.rejects(as(owner,'select update_student_profile($1,$2::jsonb)',[id,identitas()]),/Pemilik hanya membaca/);
  await as(teacher,'select set_student_active($1,false)',[id]);
  assert.equal((await as(teacher,'select status from students where id=$1',[id])).rows[0].status,'Non-Aktif');
  await as(teacher,'select set_student_active($1,true)',[id]);
  await assert.rejects(as(stranger,'select set_student_active($1,false)',[id]),/Akses ditolak/);
  await assert.rejects(as(owner,'select set_student_active($1,false)',[id]),/Akses ditolak/);
  await assert.rejects(as(stranger,'select delete_student($1)',[id]),/Akses ditolak/);
  const dibagi=await buat();
  await admin('insert into assignments values($1,$2)',[dibagi,stranger]);
  await assert.rejects(as(teacher,'select delete_student($1)',[dibagi]),/didampingi guru lain/);
  await as(teacher,'select delete_student($1)',[id]);
  assert.equal((await admin('select count(*)::int n from students where id=$1',[id])).rows[0].n,0);
 });
 await t.test('isolasi antar guru dan akses pemilik',async()=>{
  const milikA=await buat(teacher),milikB=await buat(stranger,{name:'Anak Guru B'});
  const ids=async(who,sql)=>(await as(who,sql)).rows.map(x=>Object.values(x)[0]);
  assert.ok((await ids(stranger,'select id from students')).every(x=>x!==milikA),'guru lain tidak melihat siswa guru A');
  assert.ok((await ids(stranger,'select id from students')).includes(milikB));
  assert.deepEqual(await ids(stranger,'select id from profiles'),[stranger]);
  assert.deepEqual(await ids(stranger,'select email from access_list'),['lain@test.invalid']);
  await assert.rejects(as(stranger,'insert into assignments values($1,$2)',[milikA,stranger]),/row-level security/i);
  assert.ok((await ids(owner,'select id from students')).includes(milikA),'pemilik membaca semua siswa');
 });
 await t.test('tes diagnostik 8 level: draf di server, berhenti dini, English tidak dinilai, final tanpa revisi',async()=>{
  const kid=await buat(),lain=await buat(stranger);
  const mulai=(who,sid,level)=>as(who,'select start_diagnostic($1,$2) as id',[sid,level]);
  const nilai=(sid,n,status,pkg='utama',who=teacher)=>as(who,'select rate_diagnostic($1,$2,$3,$4)',[sid,n,status,pkg]);
  const final=(sid,who=teacher)=>as(who,'select finalize_diagnostic($1) as level',[sid]).then(r=>r.rows[0].level);
  const tes=async sid=>(await admin('select * from diagnostic_tests where student_id=$1',[sid])).rows[0];
  await assert.rejects(mulai(owner,kid,3),/guru pendamping/,'pemilik ditolak');
  await assert.rejects(mulai(stranger,kid,3),/guru pendamping/,'guru lain ditolak');
  await assert.rejects(mulai(teacher,kid,19),/Level 1–18/);
  await assert.rejects(nilai(kid,1,'lulus'),/belum dimulai/);
  await mulai(teacher,kid,5);
  await assert.rejects(mulai(teacher,kid,3),/sudah dimulai/,'level tidak bisa diganti selama tes berjalan');
  // Draf: nilai bisa diubah dan dikosongkan sebelum final; English (13) ditolak; nilai tak dikenal ditolak.
  await nilai(kid,1,'belum');await nilai(kid,1,'lulus','cadangan');
  assert.deepEqual((await admin('select status,package from diagnostic_results')).rows.map(r=>[r.status,r.package]),[['lulus','cadangan']]);
  await nilai(kid,1,null);
  assert.equal((await admin('select count(*)::int n from diagnostic_results')).rows[0].n,0,'belum dinilai = tanpa baris');
  await assert.rejects(nilai(kid,13,'lulus'),/English tidak dinilai/);
  await assert.rejects(nilai(kid,2,'T'),/Lulus, Belum/);
  await assert.rejects(nilai(kid,2,'lulus','lain'),/utama atau cadangan/);
  await assert.rejects(nilai(kid,15,'lulus'),/tidak dikenal/);
  await assert.rejects(nilai(kid,2,'lulus','utama',stranger),/guru pendamping/);
  // Berhenti dini: A1, B1, E1, D1 semuanya Belum → tidak bisa diisi atau final; hanya tes baru di Level 3.
  for(const n of [1,2,3])await nilai(kid,n,'belum');
  await nilai(kid,5,'lulus');
  await nilai(kid,4,'belum');
  await assert.rejects(nilai(kid,6,'lulus'),/Tes berhenti. Mulai tes baru di Level 3/);
  await assert.rejects(final(kid),/tidak dihitung/);
  await assert.rejects(mulai(teacher,kid,1),/Level 3/,'level saran awal pita sebelumnya');
  await mulai(teacher,kid,3);
  assert.equal((await tes(kid)).tested_level,3);
  assert.equal((await admin('select count(*)::int n from diagnostic_results')).rows[0].n,0,'tes yang berhenti tidak dihitung');
  assert.deepEqual((await admin('select array_agg(diagnostic_restart_level(l) order by l) a from generate_series(1,8) l')).rows[0].a,[1,1,1,1,3,3,5,5]);
  // Final: mulai dari indikator akademik pertama yang belum Lulus; belum dinilai dihitung belum lulus.
  for(const n of [1,2,4,5,14])await nilai(kid,n,'lulus');
  await nilai(kid,3,'belum');
  assert.equal(await final(kid),3);
  let t1=await tes(kid);
  assert.deepEqual([t1.start_level,t1.start_indicator,t1.curriculum_complete,!!t1.finalized_at],[3,3,false,true]);
  assert.equal((await admin('select pilot_level from students where id=$1',[kid])).rows[0].pilot_level,3);
  // Tanpa revisi.
  await assert.rejects(nilai(kid,3,'lulus'),/sudah disimpan final/);
  await assert.rejects(final(kid),/sudah disimpan final/);
  await assert.rejects(mulai(teacher,kid,3),/sudah dites diagnostik/);
  // L1 tidak berhenti; 12 Lulus → level berikutnya indikator 1; 12 Lulus di L18 → kurikulum selesai.
  const l1=await buat(),l7=await buat(),l8=await buat(),l18b=await buat();
  await mulai(teacher,l1,1);for(const n of [1,2,3,4])await nilai(l1,n,'belum');await nilai(l1,5,'lulus');
  assert.equal(await final(l1),1);
  assert.equal((await tes(l1)).start_indicator,1);
  for(const [sid,level] of [[l7,7],[l8,8]]){await mulai(teacher,sid,level);for(let n=1;n<=12;n++)await nilai(sid,n,'lulus');}
  assert.equal(await final(l7),8);
  assert.deepEqual([(await tes(l7)).start_indicator,(await tes(l7)).curriculum_complete],[1,false]);
  assert.equal(await final(l8),9);
  assert.deepEqual([(await tes(l8)).start_indicator,(await tes(l8)).curriculum_complete],[1,false]);
  await mulai(teacher,l18b,18);for(let n=1;n<=12;n++)await nilai(l18b,n,'lulus');
  assert.equal(await final(l18b),18);
  assert.deepEqual([(await tes(l18b)).start_indicator,(await tes(l18b)).curriculum_complete],[null,true]);
  // Akses: guru pendamping membaca hasil; pemilik hanya ringkasan; guru lain tidak; tulis langsung ditolak.
  assert.ok((await as(teacher,'select * from diagnostic_results')).rows.length>0);
  assert.equal((await as(stranger,'select * from diagnostic_tests where student_id=$1',[kid])).rows.length,0);
  assert.equal((await as(owner,'select start_level from diagnostic_tests where student_id=$1',[kid])).rows.length,1,'pemilik membaca ringkasan');
  assert.equal((await as(owner,'select * from diagnostic_results')).rows.length,0,'pemilik tidak membaca hasil per tugas');
  await assert.rejects(as(teacher,"insert into diagnostic_tests(student_id,teacher_id,tested_level) values($1,$2,1)",[lain,teacher]),/permission denied|row-level security/i);
  await assert.rejects(admin("update diagnostic_tests set start_level=null where student_id=$1",[kid]),/check/,'final selalu punya level mulai');
  // Anak nonaktif tidak dites; hapus siswa ikut menghapus tesnya, tetapi tidak bila sudah ikut kelas.
  const nonaktif=await buat();await as(teacher,'select set_student_active($1,false)',[nonaktif]);
  await assert.rejects(mulai(teacher,nonaktif,1),/anak aktif/);
  await as(teacher,'select delete_student($1)',[l1]);
  assert.equal((await admin('select count(*)::int n from diagnostic_tests where student_id=$1',[l1])).rows[0].n,0);
  const c=(await admin("insert into class_schedules(teacher_id,meeting_number,theme_number,scheduled_date) values($1,1,1,'2026-09-16') returning id",[teacher])).rows[0].id;
  await admin('insert into class_schedule_students(schedule_id,student_id,level,indicator_number) values($1,$2,1,1)',[c,l7]);
  await assert.rejects(as(teacher,'select delete_student($1)',[l7]),/sudah mengikuti kelas/);
  await admin('delete from class_schedules where id=$1',[c]);
 });
 await t.test('ruang kelas 8 level: antrean 12 indikator dengan hasil diagnostik, belum dinilai, English/Karakter, naik level',async()=>{
  // Anak dites final pada satu level dengan nomor Lulus tertentu.
  const dites=async(level,lulus,who=teacher)=>{const id=await buat(who);await as(who,'select start_diagnostic($1,$2)',[id,level]);for(const n of lulus)await as(who,"select rate_diagnostic($1,$2,'lulus','utama')",[id,n]);await as(who,'select finalize_diagnostic($1)',[id]);return id;};
  const sesi=(date,time='08:00',who=teacher)=>as(who,'select save_schedule(null,$1::jsonb) as id',[JSON.stringify({scheduled_date:date,scheduled_time:time})]).then(r=>r.rows[0].id);
  const isi=(sid,rows,finish=false,who=teacher)=>as(who,'select save_meeting($1,$2::jsonb,$3)',[sid,JSON.stringify(rows),finish]);
  const baris=async(sid,kid)=>(await admin('select level,indicator_number,result,english_result,character_result from class_schedule_students where schedule_id=$1 and student_id=$2',[sid,kid])).rows[0];
  const level=async kid=>(await admin('select pilot_level from students where id=$1',[kid])).rows[0].pilot_level;
  const a=await dites(3,[1,2,4,14]),b=await dites(2,[1,2,3,4,5,6,7,8,9,10,11]),l1=await dites(1,[]),draf=await buat(),lain=await dites(3,[],stranger);
  await as(teacher,'select start_diagnostic($1,3)',[draf]);
  // Hari 1 (Pertemuan 1, Tema 1): tema dari kurikulum 8 level.
  const h1=await sesi('2026-09-21');
  assert.equal((await admin('select theme_number,meeting_number from class_schedules where id=$1',[h1])).rows[0].theme_number,1);
  await assert.rejects(isi(h1,[{student_id:draf,result:'lulus'}]),/dites diagnostik final/,'tes draf belum boleh ikut kelas');
  await assert.rejects(isi(h1,[{student_id:lain,result:'lulus'}]),/Siswa tidak tersedia/);
  await assert.rejects(isi(h1,[{student_id:a,result:'lulus'}],false,owner),/guru pengajar/);
  await assert.rejects(isi(h1,[{student_id:a,result:'T'}]),/Belum dinilai/);
  await assert.rejects(isi(h1,[{student_id:a,result:'lulus',english:'lulus'}]),/English belum bisa dinilai/,'L3 butuh paparan 3 pertemuan');
  await assert.rejects(isi(h1,[{student_id:a,result:'lulus',character:'lulus'}]),/Karakter Level 3 sudah Lulus/,'Karakter Lulus di diagnostik');
  await assert.rejects(isi(h1,[{student_id:a,result:''}],true),/Lulus, Belum, atau Belum dinilai/);
  // A: indikator 3 (1, 2, 4 Lulus di diagnostik). L1: English ungkapan tetap boleh sejak hari pertama.
  await isi(h1,[{student_id:a,result:'lulus'},{student_id:b,result:'belum_dinilai'},{student_id:l1,result:'belum',english:'lulus',character:'belum'}],true);
  assert.deepEqual(await baris(h1,a),{level:3,indicator_number:3,result:'lulus',english_result:null,character_result:null});
  assert.deepEqual(await baris(h1,b),{level:2,indicator_number:12,result:'belum_dinilai',english_result:null,character_result:null});
  assert.deepEqual(await baris(h1,l1),{level:1,indicator_number:1,result:'belum',english_result:'lulus',character_result:'belum'});
  // Hari 2: A melewati 4 (Lulus di diagnostik) ke 5; belum dinilai membuat B tetap di 12; English L1 sudah Lulus.
  const h2=await sesi('2026-09-22');
  await assert.rejects(isi(h2,[{student_id:l1,result:'lulus',english:'belum'}]),/English Level 1 sudah Lulus/);
  await isi(h2,[{student_id:a,result:'belum'},{student_id:b,result:'lulus'}],true);
  assert.equal((await baris(h2,a)).indicator_number,5);
  assert.equal((await baris(h2,b)).indicator_number,12);
  // Hari 3: A hadir di pertemuan ke-3 tema ini → English boleh dinilai. B siap naik: tanpa indikator akademik.
  const h3=await sesi('2026-09-23');
  await assert.rejects(isi(h3,[{student_id:b,result:'lulus'}]),/sudah Lulus semua/);
  await isi(h3,[{student_id:a,result:'belum',english:'belum'},{student_id:b}],true);
  assert.deepEqual(await baris(h3,b),{level:2,indicator_number:null,result:null,english_result:null,character_result:null});
  assert.equal((await baris(h3,a)).english_result,'belum');
  // Satu anak satu sesi per tanggal tetap berlaku.
  const h4=await sesi('2026-09-24'),h4b=await sesi('2026-09-24','10:00');
  await isi(h4,[{student_id:a,result:''}]);
  await assert.rejects(isi(h4b,[{student_id:a,result:'lulus'}]),/sudah ikut sesi lain/);
  // Naik level: hanya bila 12 Lulus, bukan dari guru lain/pemilik, tidak saat anak di sesi terbuka.
  await assert.rejects(as(teacher,'select confirm_level_up($1)',[a]),/belum Lulus semua/);
  await assert.rejects(as(owner,'select confirm_level_up($1)',[b]),/guru pendamping/);
  await isi(h4,[{student_id:a,result:''},{student_id:b}]);
  await assert.rejects(as(teacher,'select confirm_level_up($1)',[b]),/Selesaikan dulu sesi/);
  await isi(h4,[{student_id:a,result:'lulus'}],true);
  assert.equal((await as(teacher,'select confirm_level_up($1) as l',[b])).rows[0].l,3);
  assert.equal(await level(b),3);
  assert.equal((await admin('select count(*)::int n from student_level_changes where student_id=$1 and from_level=2 and to_level=3',[b])).rows[0].n,1);
  await isi(h4b,[{student_id:b,result:'lulus'}]);
  assert.equal((await baris(h4b,b)).indicator_number,1,'level baru mulai indikator 1');
  // Level 18 selesai: tidak bisa naik lagi.
  const l18=await dites(18,[1,2,3,4,5,6,7,8,9,10,11,12]);
  await assert.rejects(as(teacher,'select confirm_level_up($1)',[l18]),/tidak ada level berikutnya/);
  // Akses baca dan hapus siswa.
  assert.equal((await as(stranger,'select * from class_schedule_students')).rows.length,0);
  assert.ok((await as(owner,'select * from class_schedule_students')).rows.length>0);
  await assert.rejects(as(teacher,'select delete_student($1)',[a]),/sudah mengikuti kelas/);
 });
 await t.test('guru nonaktif kehilangan akses',async()=>{
  await as(owner,"update access_list set active=false where email='guru@test.invalid'");
  assert.equal((await as(teacher,'select * from students')).rows.length,0);
  await assert.rejects(as(teacher,'select create_student($1::jsonb)',[identitas()]),/Akun tidak aktif/);
 });
 await db.close();
});
