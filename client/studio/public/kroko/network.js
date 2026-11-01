import {CATEGORIES,fresh,settle,view,next} from './rules.js';
import {BROKERS,RoomRelay} from './relay.js?v=tv1';
let current=null,generation=0,wakeLock=null;
const pending=new Map(),seen=new Map();
const randomId=()=>Array.from(crypto.getRandomValues(new Uint8Array(12)),n=>n.toString(16).padStart(2,'0')).join('');
const root=room=>'kroko/portfolio/tv1/'+room+'/';
function save(){if(current?.host)try{localStorage.setItem('kroko-tv-host-'+current.room,JSON.stringify(current.game))}catch(e){}}
function hostResult(token,body){const s=current.game;if(Date.now()-s.created>86400000)throw Error('Комната устарела. Создайте новую.');const before=s.phase;settle(s);let changed=before!==s.phase;if(changed)s.revision++;if(body){perform(s,token,body);changed=true}if(changed)save();return {code:current.room,state:view(s,token)};}
function receive(topic,m){
 if(!current||!m||typeof m.id!=='string')return;
 if(current.host){
  if(topic!==root(current.room)+'ask'||typeof m.token!=='string'||!/^[a-zA-Z0-9_-]{12,100}$/.test(m.token)||m.id.length>100)return;
  const key=m.token+':'+m.id;let answer=seen.get(key);
  if(!answer){try{answer={id:m.id,...hostResult(m.token,m.body)}}catch(e){answer={id:m.id,error:e.message}}seen.set(key,answer);if(seen.size>200)seen.delete(seen.keys().next().value);}
  current.relay.publish(root(current.room)+'reply/'+m.token,answer);
 }else if(topic===root(current.room)+'reply/'+current.token){const p=pending.get(m.id);if(p){clearTimeout(p.timer);clearInterval(p.retry);pending.delete(m.id);m.error?p.reject(Error(m.error)):p.resolve({code:m.code,state:m.state})}}
}
export function closeRoom(){generation++;for(const p of pending.values()){clearTimeout(p.timer);clearInterval(p.retry);p.reject(Error('Вы вышли из комнаты'))}pending.clear();seen.clear();current?.relay?.close();clearInterval(current?.heartbeat);current=null;wakeLock?.release().catch(()=>{});wakeLock=null;}
async function connectSession(){
 const s=current;if(!s)throw Error('Комната закрыта');if(s.relay?.ready)return;if(s.opening)return s.opening;
 const gen=generation;
 s.opening=(async()=>{
  s.relay?.close();const relay=new RoomRelay(BROKERS[s.room[0]],{onMessage:receive});s.relay=relay;await relay.connect();
  if(gen!==generation){relay.close();throw Error('Комната закрыта')}
  await relay.subscribe(root(s.room)+(s.host?'ask':'reply/'+s.token));
 })().finally(()=>{s.opening=null});return s.opening;
}
async function openSession(room,token,initial){
 if(current?.room===room&&current.token===token){await connectSession();return}
 closeRoom();let stored=null;try{stored=JSON.parse(localStorage.getItem('kroko-tv-host-'+room))}catch(e){}
 const host=!!initial||stored?.host===token;current={room,token,host,game:initial||(host?stored:null),relay:null,opening:null,heartbeat:null};
 await connectSession();if(host){save();current.heartbeat=setInterval(()=>{if(current?.host)hostResult(current.token)},500);await keepAwake();}
}
async function keepAwake(){if(!current?.host||document.visibilityState!=='visible'||wakeLock)return;try{wakeLock=await navigator.wakeLock?.request('screen');wakeLock?.addEventListener('release',()=>{wakeLock=null})}catch(e){}}
if(typeof document!=='undefined'){document.addEventListener('click',keepAwake);document.addEventListener('visibilitychange',keepAwake)}
export async function roomRequest(path,token,body){
 if(path==='/api/create'){
  const cats=body?.cats?.filter(c=>CATEGORIES.includes(c))||CATEGORIES;if(!cats.length)throw Error('Выберите хотя бы одну тему');
  let lastError;for(const broker of Object.keys(BROKERS)){
   const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';const room=broker+Array.from(crypto.getRandomValues(new Uint8Array(5)),v=>alphabet[v%32]).join('');
   const game=fresh(token,cats);game.displayHost=true;
   try{await openSession(room,token,game);return hostResult(token)}catch(e){lastError=e;closeRoom()}
  }throw lastError||Error('Сервис комнат недоступен');
 }
 const room=new URL(path,location.href).searchParams.get('room')?.toUpperCase();
 if(!/^[HE][A-Z2-9]{5}$/.test(room||''))throw Error('Введите код нового главного экрана из 6 символов');
 await openSession(room,token);if(current.host)return hostResult(token,body);
 return new Promise((resolve,reject)=>{
  const id=randomId();const send=()=>{try{current?.relay?.publish(root(room)+'ask',{id,token,body:body||null})}catch(e){}};
  const timer=setTimeout(()=>{const p=pending.get(id);if(p)clearInterval(p.retry);pending.delete(id);current?.relay?.close();reject(Error('Главный экран не отвечает. Проверьте код и оставьте игру открытой на телевизоре или ноутбуке.'))},12000);
  const retry=setInterval(send,1800);pending.set(id,{resolve,reject,timer,retry});send();
 });
}

export function perform(s,token,b){
 if(!b)return;const isHost=s.host===token,active=s.teams[s.turn]?.owner===token;
 if(b.action==='join'){
  if(s.displayHost&&isHost)throw Error('Главный экран не занимает команду. Подключитесь с телефона.');
  if(s.phase!=='lobby')throw Error('Игра уже началась. Вернитесь с телефона своей команды.');
  if(!Number.isInteger(b.team)||b.team<0||b.team>=s.teams.length)throw Error('Выберите команду');
  if(s.teams[b.team].owner&&s.teams[b.team].owner!==token)throw Error('Эта команда уже занята');
  s.teams.forEach(t=>{if(t.owner===token)t.owner=null});s.teams[b.team].owner=token;
  if(typeof b.name==='string'&&b.name.trim())s.teams[b.team].name=b.name.trim().slice(0,28);
 }else if(b.action==='launch'&&isHost&&s.phase==='lobby'){
  const joined=s.teams.filter(t=>t.owner);if(joined.length<2)throw Error('Нужно минимум две команды на разных телефонах');
  s.teams=joined;s.phase='ready';
 }else if(b.action==='start'&&(active||(isHost&&s.displayHost))&&s.phase==='ready'){s.phase='playing';s.end=Date.now()+60000;}
 else if(['yes','skip'].includes(b.action)&&active&&s.phase==='playing'){
  if(b.index!==s.index)throw Error('Карточка уже сменилась');
  if(b.action==='yes')s.score++;else s.skips++;
  s.index++;s.used++;if(s.index>=s.deck.length){s.deck.sort(()=>Math.random()-.5);s.index=0;}
 }else if(b.action==='next'&&(active||isHost)&&s.phase==='result')next(s);
 else if(b.action==='reset'&&isHost){s.teams.forEach(t=>t.pos=0);s.turn=0;s.round=1;s.score=0;s.skips=0;s.phase='ready';s.index=0;s.deck.sort(()=>Math.random()-.5);s.history=[];}
 else throw Error('Сейчас это действие недоступно');
 s.revision++;
}
