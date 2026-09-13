import test from 'node:test';
import assert from 'node:assert/strict';
import { PGlite } from '@electric-sql/pglite';
import { readFile, readdir } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';

// Semua migrasi dijalankan berurutan, jadi yang diuji adalah keadaan akhir: arsitektur pilot saja.
test('PostgreSQL: akun, siswa, kurikulum pilot, dan tes diagnostik',async t=>{
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

 await t.test('struktur lama sudah tidak ada',async()=>{
  const tabel=(await admin("select table_name from information_schema.tables where table_schema='public' order by 1")).rows.map(r=>r.table_name);
  assert.deepEqual(tabel,['access_list','assignments','class_schedule_students','class_schedules','curriculum_level_indicators','curriculum_levels','curriculum_phases','curriculum_themes','diagnostic_results','diagnostic_tests','profiles','students']);
  const fungsi=(await admin("select proname from pg_proc where pronamespace='public'::regnamespace order by 1")).rows.map(r=>r.proname);
  assert.deepEqual(fungsi,['can_teach','check_student_identity','create_student','delete_schedule','delete_student','handle_new_user','is_member','is_owner','reject_owner_student_insert','save_diagnostic','save_schedule','set_student_active','update_student_profile']);
  const kolom=(await admin("select column_name from information_schema.columns where table_schema='public' and table_name='students' order by ordinal_position")).rows.map(r=>r.column_name);
  assert.deepEqual(kolom,['id','name','parent_name','phone','status','created_at','nickname','birth_date','school_grade','school_year','pilot_level']);
  const tes=(await admin("select column_name from information_schema.columns where table_schema='public' and table_name='diagnostic_tests' order by ordinal_position")).rows.map(r=>r.column_name);
  assert.deepEqual(tes,['id','student_id','teacher_id','tested_on','final_level','note','created_at','tested_level','passed']);
 });
 await t.test('email tidak dikenal tidak bisa mendaftar',async()=>{await db.exec('reset role');await assert.rejects(db.query('insert into auth.users values($1,$2)',[randomUUID(),'unknown@test.invalid']),/belum didaftarkan/);});
 await t.test('fungsi pemicu tidak tersedia sebagai RPC pengguna',async()=>{
  for(const f of ['public.handle_new_user()','public.reject_owner_student_insert()','public.check_student_identity(jsonb)'])
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
 await t.test('tes diagnostik satu level: hasil dihitung database, satu tes final per anak tanpa revisi',async()=>{
  const kid=await buat(),lain=await buat(stranger),k4=await buat();
  const lvl=(level,ratings)=>ratings.map((rating,i)=>({level,number:i+1,rating}));
  const simpan=(who,sid,level,res,note='catatan')=>as(who,'select save_diagnostic($1,$2,$3::jsonb,$4) as final',[sid,level,JSON.stringify(res),note]);
  const hampir=lvl(2,['T','T','B','T','T','T','N','N']);
  await assert.rejects(simpan(owner,kid,2,hampir),/guru pendamping/,'pemilik ditolak');
  await assert.rejects(simpan(stranger,kid,2,hampir),/guru pendamping/,'guru lain ditolak');
  await assert.rejects(simpan(teacher,kid,2,lvl(2,['T','T','T','T','T'])),/belum selesai dinilai/);
  await assert.rejects(simpan(teacher,kid,2,[...hampir,{level:3,number:1,rating:'T'}]),/hanya boleh berisi indikator Level 2/);
  await assert.rejects(simpan(teacher,kid,2,[...hampir,{level:2,number:1,rating:'T'}]),/lebih dari sekali/);
  await assert.rejects(simpan(teacher,kid,2,lvl(2,['T','T','T','T','T','X'])),/nilai yang dikenal/);
  await assert.rejects(simpan(teacher,kid,5,lvl(5,['T','T','T','T','T','T'])),/Level 1–4/);
  assert.equal((await admin('select count(*)::int n from diagnostic_tests where student_id=$1',[kid])).rows[0].n,0,'gagal tidak meninggalkan data');
  // Satu ◐ di indikator 1-6 = belum lulus → level awal = level yang dites. English/Karakter tidak menentukan.
  assert.equal((await simpan(teacher,kid,2,hampir)).rows[0].final,2);
  let tes=(await admin('select tested_level,passed,final_level,note,teacher_id from diagnostic_tests where student_id=$1',[kid])).rows[0];
  assert.deepEqual([tes.tested_level,tes.passed,tes.final_level,tes.note,tes.teacher_id],[2,false,2,'catatan',teacher]);
  assert.equal((await admin('select pilot_level from students where id=$1',[kid])).rows[0].pilot_level,2);
  assert.equal((await admin('select count(*)::int n from diagnostic_results r join diagnostic_tests t on t.id=r.test_id where t.student_id=$1',[kid])).rows[0].n,8);
  // Salinan kalimat indikator tetap walau kurikulum diubah.
  const asli=(await admin('select indicator_text from diagnostic_results r join diagnostic_tests t on t.id=r.test_id where t.student_id=$1 and indicator_number=1',[kid])).rows[0].indicator_text;
  await as(owner,"update curriculum_level_indicators set text='Teks baru' where level=2 and number=1");
  assert.equal((await admin('select indicator_text from diagnostic_results r join diagnostic_tests t on t.id=r.test_id where t.student_id=$1 and indicator_number=1',[kid])).rows[0].indicator_text,asli);
  await as(owner,'update curriculum_level_indicators set text=$1 where level=2 and number=1',[asli]);
  // Akses: guru pendamping membaca semuanya; pemilik membaca ringkasan tes saja; guru lain tidak.
  assert.equal((await as(teacher,'select * from diagnostic_results r join diagnostic_tests t on t.id=r.test_id where t.student_id=$1',[kid])).rows.length,8);
  assert.equal((await as(stranger,'select * from diagnostic_tests where student_id=$1',[kid])).rows.length,0);
  assert.equal((await as(owner,'select passed from diagnostic_tests where student_id=$1',[kid])).rows.length,1,'pemilik membaca ringkasan');
  assert.equal((await as(owner,'select * from diagnostic_results')).rows.length,0,'pemilik tidak membaca hasil per indikator');
  await assert.rejects(as(teacher,"insert into diagnostic_tests(student_id,teacher_id,tested_level,passed,final_level) values($1,$2,1,true,2)",[lain,teacher]),/permission denied|row-level security/i);
  await assert.rejects(admin("update diagnostic_tests set final_level=4 where student_id=$1",[kid]),/final_level_rule/,'level awal harus sesuai hasil');
  // Tanpa revisi: tes kedua ditolak; tes, level, dan nilai tetap.
  await assert.rejects(simpan(teacher,kid,2,lvl(2,['T','T','T','T','T','T','B']),'revisi'),/sudah dites diagnostik/);
  tes=(await admin('select count(*) over() n,passed,final_level,note from diagnostic_tests where student_id=$1',[kid])).rows[0];
  assert.deepEqual([Number(tes.n),tes.passed,tes.final_level,tes.note],[1,false,2,'catatan']);
  assert.equal((await admin('select pilot_level from students where id=$1',[kid])).rows[0].pilot_level,2);
  assert.equal((await admin('select count(*)::int n from diagnostic_results r join diagnostic_tests t on t.id=r.test_id where t.student_id=$1',[kid])).rows[0].n,8);
  // Lulus Level 4 → tetap Level 4.
  assert.equal((await simpan(teacher,k4,4,lvl(4,['T','T','T','T','T','T']))).rows[0].final,4);
  // Anak nonaktif tidak dites.
  await as(teacher,'select set_student_active($1,false)',[k4]);
  await assert.rejects(simpan(teacher,k4,4,lvl(4,['T','T','T','T','T','T'])),/anak aktif/);
  // Menghapus siswa ikut menghapus tesnya.
  await as(teacher,'select delete_student($1)',[kid]);
  assert.equal((await admin('select count(*)::int n from diagnostic_tests where student_id=$1',[kid])).rows[0].n,0);
 });
 await t.test('jadwal kelas: siswa terpilih dengan indikator dari levelnya, tema, pertemuan; ubah/hapus sebelum selesai',async()=>{
  const lvl=(level,r)=>JSON.stringify(r.map((rating,i)=>({level,number:i+1,rating})));
  const dites=async(level,who=teacher)=>{const id=await buat(who);await as(who,'select save_diagnostic($1,$2,$3::jsonb,$4)',[id,level,lvl(level,['N','T','T','T','T','T']),'']);return id;};
  const a1=await dites(1),a4=await dites(4),belum=await buat(),milikLain=await dites(2,stranger);
  const muat=(students,extra={})=>JSON.stringify({meeting_number:1,theme_number:1,scheduled_date:'2026-09-15',scheduled_time:'15:00',students,...extra});
  const simpan=(who,p,id=null)=>as(who,'select save_schedule($1,$2::jsonb) as id',[id,p]);
  const baik=[{student_id:a1,indicator_number:1},{student_id:a4,indicator_number:2}];
  await assert.rejects(simpan(owner,muat(baik)),/guru pengajar/,'pemilik tidak membuat jadwal');
  await assert.rejects(simpan(teacher,muat([])),/minimal satu siswa/);
  await assert.rejects(simpan(teacher,muat([{student_id:belum,indicator_number:1}])),/sudah dites diagnostik/);
  await assert.rejects(simpan(teacher,muat([{student_id:milikLain,indicator_number:1}])),/tidak tersedia/,'siswa guru lain');
  await assert.rejects(simpan(teacher,muat(baik,{meeting_number:193})),/1–192/);
  await assert.rejects(simpan(teacher,muat(baik,{theme_number:99})),/Tema tidak dikenal/);
  await assert.rejects(simpan(teacher,muat([baik[0],baik[0]])),/lebih dari sekali/);
  assert.equal((await admin('select count(*)::int n from class_schedules')).rows[0].n,0,'gagal tidak meninggalkan data');
  const id=(await simpan(teacher,muat(baik))).rows[0].id;
  const isi=async()=>(await admin('select student_id,level,indicator_number from class_schedule_students where schedule_id=$1 order by level',[id])).rows.map(r=>[r.student_id,r.level,r.indicator_number]);
  assert.deepEqual(await isi(),[[a1,1,1],[a4,4,2]],'level diambil dari siswa');
  let j=(await admin('select teacher_id,meeting_number,theme_number,scheduled_date::text d,scheduled_time::text t,completed_at from class_schedules where id=$1',[id])).rows[0];
  assert.deepEqual([j.teacher_id,j.meeting_number,j.theme_number,j.d,j.t,j.completed_at],[teacher,1,1,'2026-09-15','15:00:00',null]);
  // Akses baca: guru pemilik jadwal dan pemilik; guru lain tidak; tulis langsung ditolak.
  assert.equal((await as(teacher,'select * from class_schedule_students')).rows.length,2);
  assert.equal((await as(owner,'select * from class_schedules where id=$1',[id])).rows.length,1);
  assert.equal((await as(stranger,'select * from class_schedules')).rows.length,0);
  assert.equal((await as(stranger,'select * from class_schedule_students')).rows.length,0);
  await assert.rejects(as(teacher,'insert into class_schedules(teacher_id,meeting_number,theme_number,scheduled_date) values($1,1,1,current_date)',[teacher]),/permission denied|row-level security/i);
  await assert.rejects(simpan(stranger,muat([{student_id:milikLain,indicator_number:1}]),id),/Jadwal tidak tersedia/,'guru lain tidak mengubah');
  // Ubah: siswa, indikator, pertemuan, tema, jam.
  await simpan(teacher,muat([{student_id:a4,indicator_number:3}],{meeting_number:30,theme_number:2,scheduled_time:''}),id);
  assert.deepEqual(await isi(),[[a4,4,3]]);
  j=(await admin('select meeting_number,theme_number,scheduled_time from class_schedules where id=$1',[id])).rows[0];
  assert.deepEqual([j.meeting_number,j.theme_number,j.scheduled_time],[30,2,null]);
  // Selesai → dikunci.
  await admin('update class_schedules set completed_at=now() where id=$1',[id]);
  await assert.rejects(simpan(teacher,muat(baik),id),/sudah selesai/);
  await assert.rejects(as(teacher,'select delete_schedule($1)',[id]),/sudah selesai/);
  await admin('update class_schedules set completed_at=null where id=$1',[id]);
  await assert.rejects(as(stranger,'select delete_schedule($1)',[id]),/tidak tersedia/);
  await as(teacher,'select delete_schedule($1)',[id]);
  assert.equal((await admin('select count(*)::int n from class_schedule_students where schedule_id=$1',[id])).rows[0].n,0);
  // Menghapus siswa ikut mengeluarkannya dari jadwal.
  const id2=(await simpan(teacher,muat(baik))).rows[0].id;
  await as(teacher,'select delete_student($1)',[a1]);
  assert.equal((await admin('select count(*)::int n from class_schedule_students where schedule_id=$1',[id2])).rows[0].n,1);
 });
 await t.test('guru nonaktif kehilangan akses',async()=>{
  await as(owner,"update access_list set active=false where email='guru@test.invalid'");
  assert.equal((await as(teacher,'select * from students')).rows.length,0);
  await assert.rejects(as(teacher,'select create_student($1::jsonb)',[identitas()]),/Akun tidak aktif/);
 });
 await db.close();
});
