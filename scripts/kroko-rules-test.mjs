import assert from 'node:assert/strict';
import {CARDS,MODES,fresh,view,settle,start,finish,next,routeFor,fieldFor} from '../client/studio/public/kroko/rules.js';
import {perform} from '../client/studio/public/kroko/network.js';
assert.equal(CARDS.length,2250);assert.equal(new Set(CARDS.map(c=>c.id)).size,2250);
const targets=new Map();const sizes={1:2,2:3,3:1,4:1,5:2};
for(const mode of Object.keys(MODES))for(let n=1;n<=5;n++){
 const cards=CARDS.filter(c=>c.mode===mode&&c.number===n);assert.equal(cards.length,150);
 assert.equal(new Set(cards.map(c=>c.text)).size,150);
 for(const c of cards){assert.equal(c.items.length,sizes[n]);for(const word of c.items){const normalized=word.toLocaleLowerCase('ru').replaceAll('ё','е');assert.ok(!targets.has(normalized),`Repeated target: ${word}, ${targets.get(normalized)}, ${c.id}`);targets.set(normalized,c.id)}}
}
assert.equal(targets.size,4050);
const corners=new Set(),finishes=new Set();
for(let lane=0;lane<4;lane++){const route=routeFor(lane);assert.equal(route.length,30);assert.equal(new Set(route.map(p=>p.row+','+p.col)).size,30);corners.add(JSON.stringify(route[0]));finishes.add(JSON.stringify(route.at(-1)));for(let i=1;i<30;i++)assert.equal(Math.abs(route[i].row-route[i-1].row)+Math.abs(route[i].col-route[i-1].col),1);assert.equal(route[0].row+route.at(-1).row,4);assert.equal(route[0].col+route.at(-1).col,5);}
assert.equal(corners.size,4);assert.equal(finishes.size,4);
const host='tv-12345678901',players=Array.from({length:4},(_,i)=>'phone-'+i+'-12345678901');
const s=fresh(host);s.displayHost=true;
assert.throws(()=>perform(s,host,{action:'join',team:0}));
for(let i=0;i<4;i++)perform(s,players[i],{action:'join',team:i,name:'Команда '+i});
assert.throws(()=>perform(s,'stranger-123456789',{action:'join',team:0}));
assert.throws(()=>perform(s,players[1],{action:'launch'}));perform(s,host,{action:'launch'});
assert.equal(s.phase,'ready');assert.throws(()=>perform(s,players[1],{action:'start'}));perform(s,host,{action:'start'});
assert.ok(s.end-Date.now()>59000);assert.equal(s.used,1);
const secret=view(s,players[0]).card;assert.ok(secret);assert.equal(view(s,host).card,null);
for(const token of [host,players[1],'spectator-123456789']){const v=view(s,token);for(const key of ['decks','activeCard','host'])assert.equal(v[key],undefined);assert.ok(v.teams.every(t=>t.owner===undefined));assert.ok(!JSON.stringify(v).includes(secret.items[0]));}
assert.throws(()=>perform(s,host,{action:'yes',index:s.index}));
const number=s.task.number,oldIndex=s.index;perform(s,players[0],{action:'yes',index:s.index});
assert.equal(s.phase,'result');assert.equal(s.score,number);assert.equal(s.teams[0].pos,number);assert.equal(view(s,players[0]).card,null);assert.equal(s.used,1);
assert.throws(()=>perform(s,players[0],{action:'yes',index:oldIndex}));assert.throws(()=>perform(s,players[0],{action:'start'}));
perform(s,host,{action:'next'});assert.equal(s.turn,1);perform(s,players[1],{action:'start'});
const skipped=s.activeCard;perform(s,players[1],{action:'skip',index:s.index});assert.equal(s.phase,'result');assert.equal(s.score,0);assert.equal(s.teams[1].pos,0);assert.equal(s.outcome,'skip');assert.ok(!Object.values(s.decks).flat().includes(skipped));
perform(s,host,{action:'next'});perform(s,players[2],{action:'start'});s.end=Date.now()-1;settle(s);assert.equal(s.phase,'result');assert.equal(s.outcome,'timeout');assert.equal(s.score,0);settle(s);assert.equal(s.history.length,3);
const beforeReset=Object.values(s.decks).flat().length;perform(s,host,{action:'reset'});assert.equal(Object.values(s.decks).flat().length,beforeReset);assert.equal(s.used,3);assert.ok(s.teams.every(t=>t.pos===0));
// Sparse lobbies must retain the original lanes after unused teams are removed.
const sparse=fresh(host);perform(sparse,players[0],{action:'join',team:1});perform(sparse,players[1],{action:'join',team:3});perform(sparse,host,{action:'launch'});assert.deepEqual(sparse.teams.map(t=>t.lane),[1,3]);
// Consume every bucket completely, alternating skipped/expired cards. Never recycle.
const full=fresh(host),drawn=new Set();
for(const mode of Object.keys(MODES))for(let n=1;n<=5;n++){
 const team=full.teams[0];team.pos=routeFor(team.lane).findIndex(p=>p.row===n-1&&['show','draw','explain','show','draw','explain'][p.col]===mode)+1;
 assert.equal(fieldFor(team).mode,mode);
 for(let i=0;i<150;i++){full.phase='ready';start(full);assert.ok(!drawn.has(full.activeCard));drawn.add(full.activeCard);assert.equal(view(full,host).remainingInStack,149-i);finish(full,i%2?'timeout':'skip');}
 full.phase='ready';assert.throws(()=>start(full),/150 карточек/);
}
assert.equal(drawn.size,2250);assert.equal(full.used,2250);
// A correct last card wins immediately, without waiting for the timer.
s.teams[0].pos=30;s.phase='ready';perform(s,host,{action:'start'});perform(s,players[0],{action:'yes',index:s.index});assert.equal(s.phase,'winner');assert.equal(s.teams[0].pos,s.target);
const other=fresh(host);assert.notDeepEqual(other.decks,fresh(host).decks);
console.log('PASS: 2250 cards, 15×150 buckets, 4050 unique targets; 4 equal adjacent routes and 4 starts/finishes; private card; 1-card turns; value movement; skip/timeout retirement; 2250 draws without recycling; replay without repeats; sparse teams; immediate win.');
