<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
$origin=$_SERVER['HTTP_ORIGIN']??'';
if($origin==='https://userskins.github.io'||preg_match('~^http://(127\.0\.0\.1|localhost):[0-9]+$~',$origin)){
 header('Access-Control-Allow-Origin: '.$origin);header('Vary: Origin');
 header('Access-Control-Allow-Headers: Content-Type, X-Player');header('Access-Control-Allow-Methods: GET, POST, OPTIONS');header('Access-Control-Max-Age: 3600');
}
if($_SERVER['REQUEST_METHOD']==='OPTIONS'){http_response_code(204);exit;}
function respond(array $data,int $status=200):void{http_response_code($status);echo json_encode($data,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE|JSON_THROW_ON_ERROR);exit;}
function fail(string $message,int $status=400):void{respond(['error'=>$message],$status);}
function nowms():int{return (int)round(microtime(true)*1000);}
function settle(array &$s):bool{if($s['phase']==='playing'&&nowms()>=$s['end']){
 $s['teams'][$s['turn']]['pos']+=$s['score'];array_unshift($s['history'],['team'=>$s['teams'][$s['turn']]['name'],'score'=>$s['score'],'round'=>$s['round']]);$s['history']=array_slice($s['history'],0,20);
 $s['phase']=$s['teams'][$s['turn']]['pos']>=$s['target']?'winner':'result';$s['revision']++;return true;
}return false;}
function gameview(array $s,string $token):array{
 $v=$s;unset($v['host'],$v['deck'],$v['requests']);$v['isHost']=$s['host']===$token;$v['myTeam']=-1;
 foreach($s['teams'] as $i=>$t){if($t['owner']===$token)$v['myTeam']=$i;$v['teams'][$i]['joined']=$t['owner']!==null;unset($v['teams'][$i]['owner']);}
 $v['card']=$s['phase']==='playing'&&$s['teams'][$s['turn']]['owner']===$token?$s['deck'][$s['index']%count($s['deck'])]:null;
 $v['mode']=['Объясняй','Показывай','Рисуй'][($s['teams'][$s['turn']]['pos']+$s['round']-1)%3];$v['serverNow']=nowms();$v['totalCards']=count($s['deck']);return $v;
}
function applyaction(array &$s,string $token,array $b):void{
 $host=$s['host']===$token;$active=$s['teams'][$s['turn']]['owner']===$token;$a=$b['action']??'';
 if($a==='join'){
  if($host)throw new RuntimeException('Главный экран не занимает команду. Подключитесь с телефона.');
  if($s['phase']!=='lobby')throw new RuntimeException('Игра уже началась. Вернитесь с телефона своей команды.');
  $i=$b['team']??-1;if(!is_int($i)||$i<0||$i>=count($s['teams']))throw new RuntimeException('Выберите команду');
  if($s['teams'][$i]['owner']!==null&&$s['teams'][$i]['owner']!==$token)throw new RuntimeException('Эта команда уже занята');
  foreach($s['teams'] as &$t)if($t['owner']===$token)$t['owner']=null;unset($t);$s['teams'][$i]['owner']=$token;
  if(isset($b['name'])&&is_string($b['name'])&&trim($b['name'])!==''){$name=trim($b['name']);$s['teams'][$i]['name']=function_exists('mb_substr')?mb_substr($name,0,28):substr($name,0,80);}
 }elseif($a==='launch'&&$host&&$s['phase']==='lobby'){
  $joined=array_values(array_filter($s['teams'],fn($t)=>$t['owner']!==null));if(count($joined)<2)throw new RuntimeException('Нужно минимум две команды на разных телефонах');$s['teams']=$joined;$s['phase']='ready';
 }elseif($a==='start'&&($active||$host)&&$s['phase']==='ready'){$s['phase']='playing';$s['end']=nowms()+60000;}
 elseif(in_array($a,['yes','skip'],true)&&$active&&$s['phase']==='playing'){
  if(($b['index']??-1)!==$s['index'])throw new RuntimeException('Карточка уже сменилась. Обновите состояние комнаты.');
  if($a==='yes')$s['score']++;else $s['skips']++;$s['index']++;$s['used']++;if($s['index']>=count($s['deck'])){shuffle($s['deck']);$s['index']=0;}
 }elseif($a==='next'&&($host||$active)&&$s['phase']==='result'){
  $s['phase']='ready';$s['turn']=($s['turn']+1)%count($s['teams']);if($s['turn']===0)$s['round']++;$s['score']=0;$s['skips']=0;
 }elseif($a==='reset'&&$host){foreach($s['teams'] as &$t)$t['pos']=0;unset($t);$s['turn']=0;$s['round']=1;$s['score']=0;$s['skips']=0;$s['phase']='ready';$s['index']=0;shuffle($s['deck']);$s['history']=[];}
 else throw new RuntimeException('Сейчас это действие недоступно');$s['revision']++;
}
try{
 $op=$_GET['op']??'state';if($op==='health')respond(['ok'=>true,'version'=>'https-v1','transport'=>'https']);
 $token=$_SERVER['HTTP_X_PLAYER']??'';if(!preg_match('/^[a-zA-Z0-9_-]{12,100}$/',$token))fail('Не удалось определить устройство. Обновите страницу.');
 $method=$_SERVER['REQUEST_METHOD'];if(!in_array($method,['GET','POST'],true))fail('Метод не поддерживается',405);
 $body=[];if($method==='POST'){$raw=file_get_contents('php://input',false,null,0,16385);if(strlen($raw)>16384)fail('Слишком большой запрос',413);$body=json_decode($raw,true,32,JSON_THROW_ON_ERROR);if(!is_array($body))fail('Некорректный запрос');}
 $root=getenv('KROKO_DATA_DIR')?:dirname($_SERVER['DOCUMENT_ROOT']).'/.kroko-rooms';
 if(!@is_dir($root)&&!@mkdir($root,0700,true)&&!@is_dir($root)){$root=sys_get_temp_dir().'/kroko-'.substr(hash('sha256',__DIR__),0,16);if(!@is_dir($root)&&!@mkdir($root,0700,true)&&!@is_dir($root))throw new RuntimeException('Не удалось подготовить хранилище комнат');}
 if($op==='create'){
  if($method!=='POST')fail('Создание комнаты требует POST',405);
  $cards=require __DIR__.'/cards.php';$categories=array_values(array_unique(array_column($cards,'cat')));$cats=$body['cats']??$categories;if(!is_array($cats)||count($cats)===0)fail('Выберите хотя бы одну тему');
  $deck=array_values(array_filter($cards,fn($c)=>in_array($c['cat'],$cats,true)));if(!$deck)fail('Выберите хотя бы одну тему');shuffle($deck);
  $names=['Лаймовые панки','Фиолетовый шум','Розовые рейверы','Голубой экран'];$colors=['#b9f246','#b7a0ff','#ff83b3','#7edcf6'];$teams=[];for($i=0;$i<4;$i++)$teams[]=['name'=>$names[$i],'color'=>$colors[$i],'pos'=>0,'owner'=>null];
  $s=['host'=>$token,'revision'=>0,'created'=>nowms(),'teams'=>$teams,'phase'=>'lobby','turn'=>0,'round'=>1,'end'=>0,'score'=>0,'skips'=>0,'index'=>0,'deck'=>$deck,'used'=>0,'history'=>[],'target'=>40,'displayHost'=>true,'requests'=>[]];
  $alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';$handle=false;for($n=0;$n<10;$n++){$code='';foreach(unpack('C*',random_bytes(6)) as $v)$code.=$alphabet[$v%32];$path=$root.'/'.$code.'.json';$handle=@fopen($path,'x+');if($handle)break;}
  if(!$handle)throw new RuntimeException('Не удалось создать комнату. Повторите.');chmod($path,0600);flock($handle,LOCK_EX);fwrite($handle,json_encode($s,JSON_UNESCAPED_UNICODE|JSON_THROW_ON_ERROR));fflush($handle);flock($handle,LOCK_UN);fclose($handle);respond(['code'=>$code,'state'=>gameview($s,$token)]);
 }
 $code=strtoupper($_GET['room']??'');if(!preg_match('/^[A-Z2-9]{6}$/',$code))fail('Введите код комнаты из 6 символов');
 $path=$root.'/'.$code.'.json';$handle=@fopen($path,'r+');if(!$handle)fail('Комната не найдена. Создайте новую на главном экране и введите её код.',404);
 if(!flock($handle,LOCK_EX)){fclose($handle);throw new RuntimeException('Комната временно занята. Повторите.');}
 $s=json_decode(stream_get_contents($handle),true,512,JSON_THROW_ON_ERROR);if(nowms()-$s['created']>86400000){flock($handle,LOCK_UN);fclose($handle);fail('Комната устарела. Создайте новую.',410);}
 $changed=settle($s);$error=null;
 if($method==='POST'){
  $id=$body['requestId']??'';if(!preg_match('/^[a-f0-9]{24}$/',$id))$error='Не удалось определить действие. Повторите.';
  elseif(!isset($s['requests'][$token.':'.$id])){
   try{applyaction($s,$token,$body);$s['requests'][$token.':'.$id]=true;if(count($s['requests'])>200)array_shift($s['requests']);$changed=true;}catch(RuntimeException $e){$error=$e->getMessage();}
  }
 }
 if($changed){rewind($handle);ftruncate($handle,0);fwrite($handle,json_encode($s,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE|JSON_THROW_ON_ERROR));fflush($handle);}
 flock($handle,LOCK_UN);fclose($handle);if($error!==null)fail($error,409);respond(['code'=>$code,'state'=>gameview($s,$token)]);
}catch(Throwable $e){error_log('KROKO API: '.$e->getMessage());fail('Сервер комнаты временно недоступен. Повторите подключение.',503);}
