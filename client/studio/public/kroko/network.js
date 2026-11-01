import {CATEGORIES,fresh,settle,view,next} from './rules.js';
let peer=null,conn=null,code='',ownerToken='',game=null,host=false,opening=null,openingCode='',heartbeat=null;
const clients=new Set(),pending=new Map(),seen=new Map();
const HOST_PREFIX='kroko-portfolio-v1-';
const options={debug:0,config:{iceServers:[{urls:'stun:stun.cloudflare.com:3478'},{urls:'stun:stun.l.google.com:19302'}]}};
const save=()=>{if(host&&game)try{localStorage.setItem('kroko-host-'+code,JSON.stringify(game))}catch(e){}};
function requireGame(){if(!game)throw Error('Комната ещё не готова');if(Date.now()-game.created>86400000)throw Error('Комната устарела. Создайте новую.');}
function updateTimer(){if(!game)return;const before=game.phase;settle(game);if(before!==game.phase){game.revision++;save();broadcast()}}
export function perform(s,token,b){
 if(!b)return;const isHost=s.host===token,active=s.teams[s.turn]?.owner===token;
 if(b.action==='join'){
  if(s.phase!=='lobby')throw Error('Игра уже началась. Вернитесь с телефона своей команды.');
  if(!Number.isInteger(b.team)||b.team<0||b.team>=s.teams.length)throw Error('Выберите команду');
  if(s.teams[b.team].owner&&s.teams[b.team].owner!==token)throw Error('Эта команда уже занята');
  s.teams.forEach(t=>{if(t.owner===token)t.owner=null});s.teams[b.team].owner=token;
  if(typeof b.name==='string'&&b.name.trim())s.teams[b.team].name=b.name.trim().slice(0,28);
 }else if(b.action==='launch'&&isHost&&s.phase==='lobby'){
  const joined=s.teams.filter(t=>t.owner);if(joined.length<2)throw Error('Нужно минимум две команды на разных телефонах');
  s.teams=joined;s.phase='ready';
 }else if(b.action==='start'&&active&&s.phase==='ready'){s.phase='playing';s.end=Date.now()+60000;}
 else if(['yes','skip'].includes(b.action)&&active&&s.phase==='playing'){
  if(b.index!==s.index)throw Error('Карточка уже сменилась');
  if(b.action==='yes')s.score++;else s.skips++;
  s.index++;s.used++;if(s.index>=s.deck.length){s.deck.sort(()=>Math.random()-.5);s.index=0;}
 }else if(b.action==='next'&&(active||isHost)&&s.phase==='result')next(s);
 else if(b.action==='reset'&&isHost){s.teams.forEach(t=>t.pos=0);s.turn=0;s.round=1;s.score=0;s.skips=0;s.phase='ready';s.index=0;s.deck.sort(()=>Math.random()-.5);s.history=[];}
 else throw Error('Сейчас это действие недоступно');
 s.revision++;
}
function result(token){requireGame();updateTimer();return {code,state:view(game,token)}}
function broadcast(){for(const c of clients)if(c.open&&c.player)c.send({type:'state',...result(c.player)})}
function hostRequest(token,body){requireGame();updateTimer();if(body){perform(game,token,body);save();broadcast()}return result(token)}
function attachClient(c){clients.add(c);c.on('data',m=>{
 if(!m||m.type!=='request'||typeof m.id!=='string'||typeof m.token!=='string'||m.token.length<12||m.token.length>100)return;
 if(c.player&&c.player!==m.token)return;c.player=m.token;
 const key=m.token+':'+m.id;if(seen.has(key)){c.send(seen.get(key));return}
 let reply;try{reply={type:'response',id:m.id,...hostRequest(m.token,m.body)}}catch(e){reply={type:'response',id:m.id,error:e.message}}
 seen.set(key,reply);if(seen.size>200)seen.delete(seen.keys().next().value);if(c.open)c.send(reply);
 });c.on('close',()=>clients.delete(c));c.on('error',()=>clients.delete(c));}
function networkError(e){if(e?.type==='peer-unavailable')return 'Создатель комнаты не в сети. Проверьте код и оставьте его вкладку открытой.';if(e?.type==='unavailable-id')return 'Этот код ещё занят. Закройте дубликат вкладки создателя и попробуйте через несколько секунд.';return 'Не удалось соединить телефоны. Попробуйте общий Wi-Fi без изоляции устройств или другую сеть.';}
function makePeer(id){if(!window.Peer)throw Error('Не загрузился модуль соединения. Обновите страницу.');return id?new window.Peer(id,options):new window.Peer(options);}
export function closeRoom(){for(const p of pending.values()){clearTimeout(p.timer);p.reject(Error('Вы вышли из комнаты'))}pending.clear();clearInterval(heartbeat);heartbeat=null;clients.forEach(c=>c.close());clients.clear();conn?.close();peer?.destroy();conn=null;peer=null;game=null;host=false;opening=null;openingCode='';code='';}
function startPeer(room,token,initial){
 if(opening&&openingCode===room)return opening;
 closeRoom();code=room;ownerToken=token;openingCode=room;
 let stored=null;try{stored=JSON.parse(localStorage.getItem('kroko-host-'+room))}catch(e){}
 host=!!initial||stored?.host===token;game=initial||(host?stored:null);
 opening=new Promise((resolve,reject)=>{
 let done=false;const finish=(err)=>{if(done)return;done=true;clearTimeout(timer);if(err){opening=null;reject(Error(networkError(err)))}else resolve()};
 const timer=setTimeout(()=>finish({type:'timeout'}),18000);
 try{peer=makePeer(host?HOST_PREFIX+room:undefined)}catch(e){clearTimeout(timer);opening=null;reject(e);return}
 peer.on('error',e=>{finish(e);});
 peer.on('disconnected',()=>{if(peer&&!peer.destroyed)try{peer.reconnect()}catch(e){}});
 if(host){peer.on('connection',attachClient);peer.on('open',()=>{save();heartbeat=setInterval(()=>{updateTimer()},250);finish()})}
 else peer.on('open',()=>{
  conn=peer.connect(HOST_PREFIX+room,{reliable:true,serialization:'json'});
  conn.on('open',()=>finish());conn.on('error',e=>finish(e));
  conn.on('data',m=>{if(m?.type==='response'){const p=pending.get(m.id);if(p){clearTimeout(p.timer);pending.delete(m.id);m.error?p.reject(Error(m.error)):p.resolve({code:m.code,state:m.state})}}});
  conn.on('close',()=>{opening=null;for(const p of pending.values()){clearTimeout(p.timer);p.reject(Error('Телефон создателя отключился. Откройте на нём игру.'))}pending.clear()});
 });
 });return opening;
}
export async function roomRequest(path,token,body){
 if(path==='/api/create'){
  const cats=body?.cats?.filter(c=>CATEGORIES.includes(c))||CATEGORIES;if(!cats.length)throw Error('Выберите хотя бы одну тему');
  const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';const room=Array.from(crypto.getRandomValues(new Uint8Array(6)),v=>alphabet[v%32]).join('');
  await startPeer(room,token,fresh(token,cats));return result(token);
 }
 const room=new URL(path,location.href).searchParams.get('room')?.toUpperCase();
 if(!/^[A-Z2-9]{6}$/.test(room||''))throw Error('Нужен код комнаты из 6 символов');
 if(room!==code||!opening||(!host&&!conn?.open)||peer?.destroyed)await startPeer(room,token);
 else await opening;
 if(host)return hostRequest(token,body);
 return new Promise((resolve,reject)=>{
  const id=Array.from(crypto.getRandomValues(new Uint8Array(12)),n=>n.toString(16)).join('');
  const timer=setTimeout(()=>{pending.delete(id);reject(Error('Создатель не отвечает. Проверьте, что его экран включён.'))},10000);
  pending.set(id,{resolve,reject,timer});try{conn.send({type:'request',id,token,body:body||null})}catch(e){clearTimeout(timer);pending.delete(id);reject(Error('Соединение прервалось. Повторите действие.'))}
 });
}
// Keep the host's screen awake while the game is visible, when the browser supports it.
let wakeLock=null;async function keepAwake(){if(!host||document.visibilityState!=='visible'||wakeLock)return;try{wakeLock=await navigator.wakeLock?.request('screen');wakeLock?.addEventListener('release',()=>{wakeLock=null})}catch(e){}}
if(typeof document!=='undefined'){document.addEventListener('click',keepAwake);document.addEventListener('visibilitychange',keepAwake)}
