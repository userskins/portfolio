// Keep the landing page visible before JavaScript or connection assets arrive.
import {readFile,writeFile} from 'node:fs/promises';
import vm from 'node:vm';
import {webcrypto} from 'node:crypto';
const path=new URL('../client/studio/public/kroko/index.html',import.meta.url);
let html=await readFile(path,'utf8');const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
const elements=new Map();const element=selector=>{if(!elements.has(selector))elements.set(selector,{innerHTML:'',textContent:'',disabled:false,addEventListener(){},removeAttribute(){}});return elements.get(selector)};
vm.runInNewContext(script,{document:{querySelector:element,querySelectorAll:()=>[]},window:{addEventListener(){}},localStorage:{getItem:()=>null,setItem(){},removeItem(){}},crypto:webcrypto,location:{search:''},URLSearchParams,setInterval(){},Map,console},{timeout:1000});
let landing=element('#app').innerHTML.replace('<div class="cats" id="cats"></div>','<div class="cats" id="cats">'+element('#cats').innerHTML+'</div>');
html=html.replace(/<main id="app">[\s\S]*?<\/main>/,'<main id="app">'+landing+'</main>');
html=html.replace(/<div class="brand" id="brand">[\s\S]*?<\/div>/,'<div class="brand" id="brand">'+element('#brand').innerHTML+'</div>');
await writeFile(path,html);console.log('Landing page includes full HTML; first paint requires only index.html ('+Buffer.byteLength(html)+' bytes).');
