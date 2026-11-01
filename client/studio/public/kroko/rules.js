import {BANKS} from './cards-data.js';
export const MODES={show:'Показывай',explain:'Объясняй',draw:'Рисуй'};
export const CATEGORIES=Object.values(MODES);
export const TASK_TYPES=['','Два глагола в начальной форме','Три существительных','Сложное необычное слово','Личность или фильм','Два прилагательных'];
export const CARDS=Object.entries(BANKS).flatMap(([mode,groups])=>Object.entries(groups).flatMap(([number,lines])=>lines.split('\n').map((line,i)=>({id:`${mode}-${number}-${i+1}`,mode,number:+number,items:line.split(' | '),text:line.replaceAll(' | ','\n'),cat:TASK_TYPES[+number]}))));
const cardById=new Map(CARDS.map(c=>[c.id,c]));
const names=['Красные крокодилы','Зелёные крокодилы','Синие крокодилы','Жёлтые крокодилы'];
const colors=['#ef6452','#42ad75','#4a78d1','#efb63f'];
export const COLUMN_MODES=['show','draw','explain','show','draw','explain'];
// Thirty adjacent squares. Reflections give each team an equal corner-to-corner route.
export function routeFor(lane){const route=[];for(let r=4;r>=0;r--)for(let i=0;i<6;i++){let c=(4-r)%2?5-i:i;route.push({row:lane===1||lane===3?4-r:r,col:lane===2||lane===3?5-c:c})}return route;}
export function fieldFor(team){const route=routeFor(team.lane),cell=route[Math.max(0,Math.min(29,team.pos-1))];return {...cell,mode:COLUMN_MODES[cell.col],number:cell.row+1};}
function shuffled(items){const out=[...items];for(let i=out.length-1;i>0;i--){const range=i+1,limit=Math.floor(4294967296/range)*range;let value;do{value=crypto.getRandomValues(new Uint32Array(1))[0]}while(value>=limit);const j=value%range;[out[i],out[j]]=[out[j],out[i]]}return out;}
export function fresh(token){const decks={};for(const mode of Object.keys(MODES))for(let n=1;n<=5;n++)decks[`${mode}-${n}`]=shuffled(CARDS.filter(c=>c.mode===mode&&c.number===n).map(c=>c.id));return {schema:3,host:token,revision:0,created:Date.now(),teams:names.map((name,lane)=>({name,color:colors[lane],lane,pos:0,owner:null})),phase:'lobby',turn:0,round:1,end:0,score:0,skips:0,index:0,decks,activeCard:null,task:null,used:0,history:[],target:31,outcome:null};}
export function next(s){s.phase='ready';s.turn=(s.turn+1)%s.teams.length;if(s.turn===0)s.round++;s.score=0;s.skips=0;s.task=null;s.activeCard=null;s.outcome=null;s.end=0;}
export function start(s){const task=fieldFor(s.teams[s.turn]),bucket=s.decks[`${task.mode}-${task.number}`];if(!bucket.length)throw Error('Эта стопка закончилась: все 150 карточек уже сыграны. Создайте новую комнату для новой колоды.');s.activeCard=bucket.pop();s.task=task;s.used++;s.index++;s.score=0;s.skips=0;s.outcome=null;s.phase='playing';s.end=Date.now()+60000;}
export function finish(s,outcome){if(s.phase!=='playing')return;const team=s.teams[s.turn];s.score=outcome==='yes'?s.task.number:0;s.skips=outcome==='skip'?1:0;s.outcome=outcome;team.pos=Math.min(s.target,team.pos+s.score);s.history.unshift({team:team.name,score:s.score,number:s.task.number,mode:MODES[s.task.mode],outcome,round:s.round});s.history=s.history.slice(0,20);s.phase=team.pos>=s.target?'winner':'result';}
export function settle(s){if(s.phase==='playing'&&Date.now()>=s.end)finish(s,'timeout');}
export function view(s,token){const {host,decks,activeCard,...publicState}=s;const v=structuredClone(publicState),task=s.task||fieldFor(s.teams[s.turn]);v.isHost=host===token;v.myTeam=s.teams.findIndex(t=>t.owner===token);v.teams=v.teams.map(({owner,...t})=>({...t,joined:!!owner,route:routeFor(t.lane)}));v.card=s.phase==='playing'&&s.teams[s.turn].owner===token?structuredClone(cardById.get(activeCard)):null;v.mode=MODES[task.mode];v.modeKey=task.mode;v.number=task.number;v.taskType=TASK_TYPES[task.number];v.remainingInStack=decks[`${task.mode}-${task.number}`].length;v.totalCards=CARDS.length;v.remainingCards=CARDS.length-s.used;v.serverNow=Date.now();return v;}
