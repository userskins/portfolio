import {CATEGORIES,fresh,settle,view,next} from './rules.js';
const controllers=new Set();let apiEndpointPromise=null;
async function apiEndpoint(){
 if(location.hostname!=='userskins.github.io')return new URL('./api.php',import.meta.url);
 if(!apiEndpointPromise)apiEndpointPromise=Promise.any(['https://userskins.site/kroko/api.php','https://usersksite.temp.swtest.ru/kroko/api.php'].map(async endpoint=>{
  const response=await fetch(endpoint+'?op=health',{cache:'no-store',signal:AbortSignal.timeout(8000)});const data=await response.json();if(!response.ok||data.version!=='https-v1')throw Error('API unavailable');return endpoint;
 })).catch(()=>{apiEndpointPromise=null;throw Error('HTTPS-сервер игры пока недоступен. Повторите подключение.');});
 return new URL(await apiEndpointPromise);
}
export function closeRoom(){for(const c of controllers)c.abort();controllers.clear();}
export async function roomRequest(path,token,body){
 const url=await apiEndpoint();
 if(path==='/api/create')url.searchParams.set('op','create');
 else {const code=new URL(path,location.href).searchParams.get('room')?.toUpperCase();if(!/^[A-Z2-9]{6}$/.test(code||''))throw Error('Введите код комнаты из 6 символов');url.searchParams.set('room',code);}
 const controller=new AbortController();controllers.add(controller);const timer=setTimeout(()=>controller.abort(),12000);
 const payload=body?{...body,requestId:Array.from(crypto.getRandomValues(new Uint8Array(12)),n=>n.toString(16).padStart(2,'0')).join('')}:undefined;
 try{
  const response=await fetch(url,{method:body?'POST':'GET',headers:{'Content-Type':'application/json','X-Player':token},cache:'no-store',signal:controller.signal,...(payload?{body:JSON.stringify(payload)}:{})});
  const text=await response.text();let result;try{result=JSON.parse(text)}catch(e){throw Error('Сервер вернул неверный ответ. Обновите страницу игры.');}
  if(!response.ok)throw Error(result.error||'Не удалось подключиться к комнате');return result;
 }catch(e){if(e.name==='AbortError')throw Error('Сервер не ответил за 12 секунд. Проверьте интернет и повторите.');if(e instanceof TypeError)throw Error('Не удалось открыть сервер игры. Проверьте интернет и повторите.');throw e;}
 finally{clearTimeout(timer);controllers.delete(controller);}
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
