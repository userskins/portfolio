import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const { chromium } = await import(process.env.STUDIO_PLAYWRIGHT || '/tmp/studio-tools/node_modules/playwright/index.mjs');
await fs.mkdir('free-desk-review',{recursive:true});
const browser = await chromium.launch({headless:true});
const page = await browser.newPage({viewport:{width:1440,height:950},deviceScaleFactor:1});
const errors=[];
page.on('pageerror',error=>errors.push(error.message));
await page.goto('http://127.0.0.1:4173/studio/',{waitUntil:'networkidle',timeout:45000});
await page.evaluate(()=>document.fonts.ready);
await page.waitForTimeout(1100);

const names=['design','gallery','laptop','email','motion','about','contact','pencil'];
const item=name=>page.getByTestId('desk-item-'+name);
assert.equal(await page.locator('.desk-item').count(),8,'7 functional objects plus stationary pencil');
assert.equal(await page.locator('.desk-rotate-handle,.desk-move-handle').count(),0,'no rotate/drag handles');
assert.equal(await page.locator('[data-testid^="move-"],[data-testid^="rotate-"]').count(),0,'no movement/rotation interactions');
assert.equal(await page.locator('[data-object="loose-one"],[data-object="loose-two"]').count(),0,'no floating background photographs');
assert.equal(await page.locator('[aria-label="Собрать стол"],[data-testid="atelier-help"]').count(),0,'no unnecessary reset/drag instructions');
for(const name of names)assert.equal(await item(name).count(),1,'desk item remains: '+name);
assert.equal(await page.getByTestId('motion-disc').count(),1,'Motion record retained');
assert.equal(await page.getByTestId('mail-envelope').count(),1,'Email envelope retained');
assert.equal(await page.locator('.desk-scene').evaluate(el=>getComputedStyle(el).touchAction!=='none'),true,'desktop no longer reserves global touch drag gestures');
const note=page.locator('.rail-note');
assert.equal(await note.locator('.rail-note-first').innerText(),'Идеи не сидят','slogan first line');
assert.equal(await note.locator('.rail-note-second').innerText(),'на месте.','slogan second line');
const box1=await note.locator('.rail-note-second').boundingBox();
const star=await note.locator('.rail-note-star').boundingBox();
assert.ok(star.x >= box1.x+box1.width-3,'red asterisk does not cover second line');
assert.equal(await page.locator('.notebook-title').evaluate(el=>getComputedStyle(el,'::after').bottom),'1px','About underline positioned below the raised title');
assert.equal(await item('design').getAttribute('data-hover-travel'),'7','a small 7px hover-follow allowance');
assert.equal(await item('laptop').getAttribute('data-hover-travel'),'1.5','laptop moves only 1.5px for reliable arrows');
await page.screenshot({path:'free-desk-review/01-fixed-desktop.png',fullPage:true});

// Mouse movement gives a slight temporary nudge, not a persistent drag.
const start=await item('design').boundingBox();
await page.mouse.move(start.x+70,start.y+180,{steps:8});
await page.waitForTimeout(430);
const hovered=await item('design').boundingBox();
const nudge=Math.hypot(hovered.x-start.x,hovered.y-start.y);
assert.ok(nudge>1 && nudge<11,'folder follows hover within an 11px visual envelope: '+nudge);
await page.screenshot({path:'free-desk-review/01b-gentle-hover.png',fullPage:true});
await page.mouse.move(2,2);
await page.waitForTimeout(600);
const settled=await item('design').boundingBox();
assert.ok(Math.hypot(settled.x-start.x,settled.y-start.y)<2,'folder springs back after hover');

// Attempt a long pointer gesture over the design folder; fixed geometry must not move.
const old=await item('design').boundingBox();
await page.mouse.move(old.x+37,old.y+38);
await page.mouse.down();
await page.mouse.move(old.x+180,old.y+115,{steps:12});
await page.mouse.up();
await page.waitForTimeout(450);
const after=await item('design').boundingBox();
assert.ok(Math.abs(after.x-old.x)<3 && Math.abs(after.y-old.y)<3,'design object cannot be dragged');
if(await page.locator('.reader[role="dialog"]').count()){
 await page.locator('.reader .back-to-desk').click();
 await page.locator('.reader[role="dialog"]').waitFor({state:'detached',timeout:7000});
}
await page.getByTestId('open-about').click();
await page.locator('.reader[role="dialog"]').waitFor();
assert.match(await page.locator('.reader-heading').innerText(),/ОБО МНЕ/,'static notebook still opens About');
await page.locator('.reader .back-to-desk').click();
await page.locator('.reader[role="dialog"]').waitFor({state:'detached',timeout:7000});

await page.setViewportSize({width:390,height:844});
await page.waitForTimeout(600);
for(const name of names.slice(0,7))assert.equal(await item(name).isVisible(),true,'mobile item stays clickable: '+name);
assert.equal(await page.locator('.desk-rotate-handle,.desk-move-handle').count(),0,'touch drag handles absent');
assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'mobile has no horizontal overflow');
await page.screenshot({path:'free-desk-review/02-fixed-mobile.png',fullPage:true});
assert.deepEqual(errors,[],'no runtime JS errors');
await fs.writeFile('free-desk-review/results.json',JSON.stringify({
 passed:true,
 checks:['eight objects with bounded pointer nudge, no free drag','no background photos','drag handles removed','no reset controls',
   'design stays in place after pointer drag','About opens on click','two-line slogan without overlap',
   'notebook underline raised','mobile no horizontal overflow','no JS errors'],
 errors
},null,2));
console.log('Fixed desk and typography browser checks passed.');
await browser.close();
