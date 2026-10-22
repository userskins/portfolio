import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const { chromium } = await import(process.env.STUDIO_PLAYWRIGHT || '/tmp/studio-tools/node_modules/playwright/index.mjs');
await fs.mkdir('free-desk-review', {recursive:true});
const browser = await chromium.launch({headless:true});
const page = await browser.newPage({viewport:{width:1440,height:950},deviceScaleFactor:1});
const errors=[];
page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:4173/studio/',{waitUntil:'networkidle',timeout:45000});
await page.evaluate(()=>document.fonts.ready);
await page.waitForTimeout(1200);

const names = ['design','gallery','laptop','email','motion','about','contact','loose-one','loose-two','pencil'];
const item = (name) => page.getByTestId('desk-item-'+name);
const angle = async (name) => await item(name).evaluate(el=>{
  const m=new DOMMatrixReadOnly(getComputedStyle(el).transform);
  return Math.atan2(m.b,m.a)*180/Math.PI;
});
const deltaAngle=(a,b)=>((b-a+540)%360)-180;
const center=box=>({x:box.x+box.width/2,y:box.y+box.height/2});

assert.equal(await page.locator('.desk-item').count(),10,'seven main objects plus two photos and pencil');
assert.equal(await page.locator('.desk-rotate-handle').count(),10,'every movable item can rotate');
assert.equal(await page.locator('[data-testid="atelier-shuffle"]').count(),0,'shuffle action is removed');
assert.equal(await page.getByRole('button',{name:'Собрать стол'}).count(),1,'single reset action remains');
assert.match(await page.locator('.desk-topline').innerText(),/ПОРТФОЛИО|РАБОЧИЙ СТОЛ/,'editorial headings are more Russian');
assert.ok(await item('loose-one').isVisible(),'first background photo is interactive');
assert.ok(await item('loose-two').isVisible(),'second background photo is interactive');
assert.ok(await item('pencil').isVisible(),'pencil is interactive');
await page.screenshot({path:'free-desk-review/01-tech-desk-before.png',fullPage:true});

const old=await item('design').boundingBox();
const p=center(old);
await page.mouse.move(p.x,p.y);
await page.mouse.down();
await page.mouse.move(p.x+240,p.y+130,{steps:18});
await page.mouse.up();
await page.waitForTimeout(360);
const moved=await item('design').boundingBox();
assert.ok(Math.abs(moved.x-old.x)>105,'folder drags hundreds of pixels, not only the old 105px constraint');
assert.ok(Math.abs(moved.y-old.y)>55,'folder is free on both axes');
assert.equal(await page.locator('.reader[role="dialog"]').count(),0,'drag does not accidentally open a project');

// The pencil is a true desk item. Keyboard arrows rotate it, and the actual handle spins around its axis.
const beforeSpin=await angle('pencil');
await page.getByTestId('rotate-pencil').focus();
await page.keyboard.press('ArrowRight');
await page.waitForTimeout(350);
const afterKeySpin=await angle('pencil');
assert.ok(Math.abs(deltaAngle(beforeSpin,afterKeySpin))>=11,'rotation keyboard control turns the pencil');

const pencilBox=await item('pencil').boundingBox();
const spinCenter=center(pencilBox);
const handle=await page.getByTestId('rotate-pencil').boundingBox();
const start=center(handle);
let theta=Math.atan2(start.y-spinCenter.y,start.x-spinCenter.x);
const distance=Math.max(28,Math.hypot(start.x-spinCenter.x,start.y-spinCenter.y));
await page.mouse.move(start.x,start.y);
await page.mouse.down();
for(let step=1;step<=15;step++){
 const rad=theta + Math.PI*.55*(step/15);
 await page.mouse.move(spinCenter.x+Math.cos(rad)*distance,spinCenter.y+Math.sin(rad)*distance,{steps:2});
}
await page.mouse.up();
await page.waitForTimeout(400);
const afterDragSpin=await angle('pencil');
assert.ok(Math.abs(deltaAngle(afterKeySpin,afterDragSpin))>18,'dragging the spin handle rotates around the pencil axis');
assert.equal(await item('pencil').getAttribute('data-rotating'),'false','rotation gesture closes cleanly');

// Background photos can independently rotate, too, and do not open a dialog.
for(const name of ['loose-one','loose-two']){
 const before=await angle(name);
 await page.getByTestId('rotate-'+name).focus();
 await page.keyboard.press('ArrowLeft');
 await page.waitForTimeout(330);
 assert.ok(Math.abs(deltaAngle(before,await angle(name)))>10,'background image rotates: '+name);
}
await page.screenshot({path:'free-desk-review/02-desk-rearranged-spun.png',fullPage:true});

await page.getByRole('button',{name:'Собрать стол'}).click();
await page.waitForTimeout(1100);
const restored=await item('design').boundingBox();
assert.ok(Math.abs(restored.x-old.x)<3 && Math.abs(restored.y-old.y)<3,'gather desk restores original coordinates');
assert.ok(Math.abs(deltaAngle(beforeSpin,await angle('pencil')))<3,'gather desk also resets pencil rotation');
assert.ok(Math.abs(deltaAngle(13,await angle('loose-one')))<3,'gather desk resets first photo');
await page.screenshot({path:'free-desk-review/03-desk-after-reset.png',fullPage:true});

// In mobile layout touch dragging is enabled through a dedicated move handle, without intercepting scrolling.
await page.setViewportSize({width:390,height:844});
await page.waitForTimeout(500);
for(const name of names){
 assert.equal(await item(name).isVisible(),true,'mobile object is visible: '+name);
 if(['loose-one','loose-two','pencil'].includes(name)) {
  assert.equal(await page.getByTestId('rotate-'+name).count(),0,'mobile decoration has no rotation handle: '+name);
  assert.equal(await page.getByTestId('move-'+name).count(),0,'mobile decoration has no move handle: '+name);
 } else {
  assert.equal(await page.getByTestId('rotate-'+name).isVisible(),true,'mobile rotation control is visible: '+name);
  assert.equal(await page.getByTestId('move-'+name).isVisible(),true,'mobile drag handle exists: '+name);
 }
}
assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'no mobile sideways overflow');
await page.screenshot({path:'free-desk-review/04-mobile-with-photos-pencil.png',fullPage:true});
const mobileBefore=await item('gallery').boundingBox();
await page.getByTestId('move-gallery').scrollIntoViewIfNeeded();
const moveHandle=await page.getByTestId('move-gallery').boundingBox();
const hp=center(moveHandle);
await page.mouse.move(hp.x,hp.y);
await page.mouse.down();
await page.mouse.move(hp.x+48,hp.y+58,{steps:13});
await page.mouse.up();
await page.waitForTimeout(300);
const mobileAfter=await item('gallery').boundingBox();
assert.ok(Math.abs(mobileAfter.x-mobileBefore.x)>16||Math.abs(mobileAfter.y-mobileBefore.y)>16,'mobile move handle actually moves the gallery');
await page.getByRole('button',{name:'Собрать стол'}).click();
await page.waitForTimeout(520);
assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'reset leaves no mobile overflow');
await page.screenshot({path:'free-desk-review/05-mobile-after-reset.png',fullPage:true});
assert.deepEqual(errors,[],'no uncaught browser errors');

await fs.writeFile('free-desk-review/results.json',JSON.stringify({
 passed:true,
 checks:['10 independent movable objects','200px+ unconstrained mouse drag','no click after drag',
 'rotate pencil by keyboard','rotate pencil by pointer around its axis',
 'rotate both background photos','reset coordinates and angles','mobile photos and pencil are present',
 'mobile move and spin handles','real mobile drag movement','no mobile overflow',
 'shuffle removed','more Russian in labels','no runtime errors'],
 errors
},null,2));
await browser.close();
console.log('Free desk drag/rotate, reset, Russian labels, and mobile gestures passed.');
