import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdtemp,rm,readFile,writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';import path from 'node:path';
const dir=await mkdtemp(path.join(tmpdir(),'kroko-api-'));const port=18573;const child=spawn('php',['-S','127.0.0.1:'+port,'-t','client/studio/public'],{env:{...process.env,KROKO_DATA_DIR:dir},stdio:'ignore'});
child.on('error',e=>{console.error(e.message)});
const base='http://127.0.0.1:'+port+'/kroko/api.php';
const players=['host-device-123456789','phone-one-123456789','phone-two-123456789','phone-three-123456789','phone-four-123456789'];
let seq=0;async function call(q,token,body){const r=await fetch(base+q,{method:body?'POST':'GET',headers:{'Content-Type':'application/json','X-Player':token},...(body?{body:JSON.stringify({requestId:(++seq).toString(16).padStart(24,'0'),...body})}:{})});return {status:r.status,...await r.json()};}
try{
 for(let i=0;i<40;i++){try{if((await fetch(base+'?op=health')).ok)break}catch(e){}await new Promise(r=>setTimeout(r,100));}
 const created=await call('?op=create',players[0],{cats:['Слова','Игры']});assert.equal(created.status,200);assert.equal(created.state.totalCards,110);assert.equal(created.state.myTeam,-1);const code=created.code,q='?room='+code;
 assert.equal((await call(q,players[0],{action:'join',team:0})).status,409);
 for(let i=0;i<4;i++)assert.equal((await call(q,players[i+1],{action:'join',team:i,name:'Команда '+i})).status,200);
 assert.equal((await call(q,'someone-else-12345',{action:'join',team:0})).status,409);
 assert.equal((await call(q,players[1],{action:'launch'})).status,409);assert.equal((await call(q,players[0],{action:'launch'})).state.phase,'ready');
 await call(q,players[0],{action:'start'});const first=await call(q,players[1]);assert.ok(first.state.card);assert.equal((await call(q,players[0])).state.card,null);assert.equal((await call(q,players[2])).state.card,null);assert.equal(first.state.deck,undefined);assert.equal(first.state.host,undefined);assert.equal(first.state.teams[0].owner,undefined);
 const requestId='ab'.repeat(12);assert.equal((await call(q,players[1],{action:'yes',index:0,requestId})).state.score,1);assert.equal((await call(q,players[1],{action:'yes',index:0,requestId})).state.score,1);assert.equal((await call(q,players[1],{action:'yes',index:0})).status,409);
 await call(q,players[1],{action:'skip',index:1});
 const file=path.join(dir,code+'.json');let raw=JSON.parse(await readFile(file,'utf8'));raw.end=Date.now()-1;await writeFile(file,JSON.stringify(raw));
 const result=await call(q,players[0]);assert.equal(result.state.phase,'result');assert.equal(result.state.teams[0].pos,1);assert.equal((await call(q,players[0])).state.teams[0].pos,1);
 assert.equal((await call(q,players[0],{action:'next'})).state.turn,1);
 await call(q,players[2],{action:'start'});raw=JSON.parse(await readFile(file,'utf8'));raw.teams[1].pos=39;raw.score=2;raw.end=Date.now()-1;await writeFile(file,JSON.stringify(raw));assert.equal((await call(q,players[0])).state.phase,'winner');assert.equal((await call(q,players[0],{action:'reset'})).state.teams[1].pos,0);
 const cors=await fetch(base+'?op=health',{headers:{Origin:'https://userskins.github.io'}});assert.equal(cors.headers.get('Access-Control-Allow-Origin'),'https://userskins.github.io');
 console.log('PASS HTTPS API: real PHP server; host + four phones; secret cards; role checks; request replay; timeout; turn rotation; winner; reset; CORS');
}finally{child.kill();await new Promise(r=>child.once('exit',r));await rm(dir,{recursive:true,force:true});}
