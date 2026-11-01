import assert from 'node:assert/strict';
import {CARDS,MODES,COLUMN_MODES,fresh,view,settle,start,finish,prepareTurn,choose,movesFor,fieldFor,STARTS,GOALS} from '../client/studio/public/kroko/rules.js';
import {perform} from '../client/studio/public/kroko/network.js';
assert.equal(CARDS.length,2250);assert.equal(new Set(CARDS.map(c=>c.id)).size,2250);
const targets=new Map(),sizes={1:2,2:3,3:1,4:1,5:2};
for(const mode of Object.keys(MODES))for(let n=1;n<=5;n++){
 const cards=CARDS.filter(c=>c.mode===mode&&c.number===n);assert.equal(cards.length,150);assert.equal(new Set(cards.map(c=>c.text)).size,150);
 for(const c of cards){assert.equal(c.items.length,sizes[n]);for(const word of c.items){const normalized=word.toLocaleLowerCase('ru').replaceAll('ё','е');assert.ok(!targets.has(normalized),`Repeated target: ${word}`);targets.set(normalized,c.id)}}
}
assert.equal(targets.size,4050);assert.equal(new Set(STARTS.map(p=>JSON.stringify(p))).size,4);assert.equal(new Set(GOALS.map(p=>JSON.stringify(p))).size,4);
for(let lane=0;lane<4;lane++){
 assert.equal(STARTS[lane].row+GOALS[lane].row,4);assert.equal(STARTS[lane].col+GOALS[lane].col,5);
 const team=fresh('host').teams[lane];assert.equal(movesFor(team).length,1);assert.deepEqual({row:movesFor(team)[0].row,col:movesFor(team)[0].col},STARTS[lane]);
 for(let row=0;row<5;row++)for(let col=0;col<6;col++){
  team.cell={row,col};const moves=movesFor(team);assert.equal(moves.length,4-(row===0||row===4?1:0)-(col===0||col===5?1:0));
  for(const m of moves){assert.equal(Math.abs(row-m.row)+Math.abs(col-m.col),1);assert.ok(m.row>=0&&m.row<5&&m.col>=0&&m.col<6);}
 }
}
// The user's blue-team example: Explain 5 -> Draw 5 (left) or Explain 4 (up).
const blue=fresh('host').teams[2];assert.equal(fieldFor(blue).mode,'explain');assert.equal(fieldFor(blue).number,5);blue.cell={row:4,col:5};
assert.deepEqual(movesFor(blue).map(m=>[m.direction,m.mode,m.number]),[['up','explain',4],['left','draw',5]]);
const host='tv-12345678901',players=Array.from({length:4},(_,i)=>'phone-'+i+'-12345678901');
const s=fresh(host);s.displayHost=true;assert.throws(()=>perform(s,host,{action:'join',team:0}));
for(let i=0;i<4;i++)perform(s,players[i],{action:'join',team:i,name:'Команда '+i});
assert.throws(()=>perform(s,'stranger-123456789',{action:'join',team:0}));assert.throws(()=>perform(s,players[1],{action:'launch'}));perform(s,host,{action:'launch'});
assert.equal(s.phase,'ready');assert.throws(()=>perform(s,players[1],{action:'choose',row:4,col:0,index:s.index}));assert.throws(()=>perform(s,players[1],{action:'start'}));perform(s,host,{action:'start'});
assert.ok(s.end-Date.now()>59000);assert.equal(s.used,1);const secret=view(s,players[0]).card;assert.ok(secret);assert.equal(view(s,host).card,null);
for(const token of [host,players[1],'spectator-123456789']){const v=view(s,token);for(const key of ['decks','activeCard','host'])assert.equal(v[key],undefined);assert.ok(v.teams.every(t=>t.owner===undefined));assert.ok(!JSON.stringify(v).includes(secret.items[0]));}
assert.throws(()=>perform(s,host,{action:'yes',index:s.index}));assert.throws(()=>perform(s,players[0],{action:'choose',row:3,col:0,index:s.index}));
const oldIndex=s.index;perform(s,players[0],{action:'yes',index:s.index});assert.equal(s.phase,'result');assert.equal(s.score,1);assert.equal(s.task.number,5);assert.equal(s.teams[0].pos,1);assert.deepEqual(s.teams[0].cell,{row:4,col:0});assert.equal(view(s,players[0]).card,null);assert.equal(s.used,1);
assert.throws(()=>perform(s,players[0],{action:'yes',index:oldIndex}));assert.throws(()=>perform(s,players[0],{action:'start'}));
perform(s,host,{action:'next'});assert.equal(s.turn,1);perform(s,players[1],{action:'start'});const skipped=s.activeCard;perform(s,players[1],{action:'skip',index:s.index});assert.equal(s.phase,'result');assert.equal(s.score,0);assert.equal(s.teams[1].cell,null);assert.equal(s.outcome,'skip');assert.ok(!Object.values(s.decks).flat().includes(skipped));
perform(s,host,{action:'next'});perform(s,players[2],{action:'start'});s.end=Date.now()-1;settle(s);assert.equal(s.phase,'result');assert.equal(s.outcome,'timeout');assert.equal(s.teams[2].cell,null);settle(s);assert.equal(s.history.length,3);
// Entered pieces need a new explicit choice each turn. Reject diagonals, staying, jumps and bounds.
s.turn=0;prepareTurn(s);assert.equal(s.destination,null);assert.throws(()=>perform(s,players[0],{action:'start'}),/выберите соседнюю/);
for(const [row,col] of [[3,1],[4,0],[0,0],[5,0],[4,-1],['3',0]])assert.throws(()=>perform(s,players[0],{action:'choose',row,col,index:s.index}));
assert.throws(()=>perform(s,players[0],{action:'choose',row:3,col:0,index:0}));
perform(s,players[0],{action:'choose',row:3,col:0,index:s.index});assert.deepEqual(s.destination,{row:3,col:0});assert.equal(s.used,3);assert.equal(view(s,host).number,4);assert.deepEqual(s.teams[0].cell,{row:4,col:0});
perform(s,players[0],{action:'start'});perform(s,players[0],{action:'yes',index:s.index});assert.deepEqual(s.teams[0].cell,{row:3,col:0});assert.equal(s.score,1);
// Backtracking is legal and consumes a new card.
prepareTurn(s);perform(s,players[0],{action:'choose',row:4,col:0,index:s.index});perform(s,players[0],{action:'start'});assert.notEqual(s.activeCard,secret.id);perform(s,players[0],{action:'yes',index:s.index});assert.deepEqual(s.teams[0].cell,{row:4,col:0});
const beforeReset=Object.values(s.decks).flat().length;perform(s,host,{action:'reset'});assert.equal(Object.values(s.decks).flat().length,beforeReset);assert.equal(s.used,5);assert.ok(s.teams.every(t=>!t.cell&&!t.finished&&t.pos===0));
const sparse=fresh(host);perform(sparse,players[0],{action:'join',team:1});perform(sparse,players[1],{action:'join',team:3});perform(sparse,host,{action:'launch'});assert.deepEqual(sparse.teams.map(t=>t.lane),[1,3]);assert.deepEqual(sparse.destination,STARTS[1]);
// All 2250 dealt tasks are retired, including skips and timeouts. No recycling at exhaustion.
const full=fresh(host),drawn=new Set();
for(const mode of Object.keys(MODES))for(let n=1;n<=5;n++){
 const col=COLUMN_MODES.indexOf(mode),row=n-1;full.teams[0].cell={row,col:col+1};
 for(let i=0;i<150;i++){prepareTurn(full);choose(full,row,col);start(full);assert.ok(!drawn.has(full.activeCard));drawn.add(full.activeCard);assert.equal(view(full,host).remainingInStack,149-i);finish(full,i%2?'timeout':'skip');}
 prepareTurn(full);choose(full,row,col);assert.throws(()=>start(full),/150 карточек/);
}
assert.equal(drawn.size,2250);assert.equal(full.used,2250);
// Reaching somebody else's finish does not win. Reaching your own does, regardless of step counter.
s.turn=0;s.teams[0].cell={row:1,col:0};s.teams[0].pos=50;prepareTurn(s);choose(s,0,0);start(s);finish(s,'yes');assert.equal(s.phase,'result');assert.equal(s.teams[0].finished,false);
s.turn=2;s.teams[2].cell={row:1,col:0};prepareTurn(s);choose(s,0,0);start(s);finish(s,'yes');assert.equal(s.phase,'winner');assert.equal(s.teams[2].finished,true);assert.deepEqual(s.teams[2].cell,GOALS[2]);
assert.notDeepEqual(fresh(host).decks,fresh(host).decks);
console.log('PASS: 2250 cards / 15×150 / 4050 unique targets; every legal orthogonal move on all 30 cells; blue Explain5 -> Draw5 or Explain4; choice authorization, stale requests, locked target, one step per success, backtracking, no jumps/diagonals, own-color finish, no card repeats, private card, skip/timeout, replay.');
