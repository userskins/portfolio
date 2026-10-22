import fs from 'node:fs/promises';
import assert from 'node:assert/strict';

const { chromium } = await import(process.env.STUDIO_PLAYWRIGHT || '/tmp/studio-tools/node_modules/playwright/index.mjs');
await fs.mkdir('featured-review',{recursive:true});
const browser=await chromium.launch({headless:true});
const errors=[];
const page=await browser.newPage({viewport:{width:1440,height:950},deviceScaleFactor:1});
page.on('pageerror',error=>errors.push(error.message));
await page.goto('http://127.0.0.1:4173/studio/',{waitUntil:'networkidle',timeout:45000});
await page.evaluate(()=>document.fonts.ready);
await page.waitForTimeout(420);

const counter=async()=> (await page.locator('.modern-page-count').innerText()).replace(/\s+/g,' ').trim();
const awaitCounter=async nth=>await page.waitForFunction(n=>{
 const x=document.querySelector('.modern-page-count')?.textContent?.replace(/\s+/g,' ').trim()||'';
 return x.includes(String(n).padStart(2,'0')+' / 08');
},nth,{timeout:7500});
assert.equal(await page.locator('[data-testid="modern-laptop"]').count(),1);
assert.equal(await page.locator('.modern-screen-tick').count(),8,'all eight websites in quick project index');
assert.equal(await page.locator('.modern-screen-tick.is-featured').count(),4,'the chosen four projects are highlighted');
assert.match(await page.locator('.modern-screen-open').getAttribute('aria-label')??'',/Институт ИТММ ННГУ/,'ITMM loads first');
assert.match(await counter(),/01 \/ 08/);
assert.equal(await page.locator('.modern-laptop').getAttribute('data-auto-playing'),'true','automatic preview starts on load');
for(const id of ['itmm','learnio']){
 assert.equal(await page.locator('.modern-screen-content img').first().evaluate(img=>img instanceof HTMLImageElement && img.complete && img.naturalWidth>100),true,'website screenshot must be authentic and loaded: '+id);
 if(id==='itmm')await page.screenshot({path:'featured-review/01-itmm-first.png',fullPage:true});
 else await page.screenshot({path:'featured-review/02-learnio-second.png',fullPage:true});
 if(id==='itmm') await awaitCounter(2);
}
assert.match(await page.locator('.modern-screen-open').getAttribute('aria-label')??'',/Лёрнио/,'auto-advance goes to Learnio');
await page.locator('.modern-laptop').hover();
assert.equal(await page.locator('.modern-laptop').getAttribute('data-auto-playing'),'false','hover stops auto advance');
await page.waitForTimeout(5200);
assert.match(await counter(),/02 \/ 08/,'hover keeps current project still for longer than 4.5 seconds');
await page.mouse.move(3,3);
await awaitCounter(3);
assert.match(await page.locator('.modern-screen-open').getAttribute('aria-label')??'',/День победы/,'Sirius 9 May is third');

await page.locator('[data-testid="laptop-auto-toggle"]').click();
assert.equal(await page.locator('[data-testid="laptop-auto-toggle"]').getAttribute('aria-pressed'),'true','user can stop auto playback');
await page.evaluate(()=>{(document.activeElement instanceof HTMLElement)&&document.activeElement.blur();});
await page.mouse.move(3,3);
await page.waitForTimeout(5050);
assert.match(await counter(),/03 \/ 08/,'manual pause suppresses automatic switch');
await page.locator('[data-testid="laptop-auto-toggle"]').click();
await page.evaluate(()=>{(document.activeElement instanceof HTMLElement)&&document.activeElement.blur();});
await page.mouse.move(3,3);
await awaitCounter(4);
assert.match(await page.locator('.modern-screen-open').getAttribute('aria-label')??'',/Новогодний музыкальный фестиваль/,'Sirius NY festival follows 9 May');

await page.locator('[data-testid="laptop-site-itmm"]').click();
assert.match(await counter(),/01 \/ 08/,'quick index returns to ITMM');
assert.equal(await page.locator('.modern-laptop').getAttribute('data-auto-playing'),'false','quick index gives time to inspect');
await page.locator('[data-testid="open-websites"]').click();
await page.locator('.reader[role="dialog"]').waitFor();
assert.equal(await page.locator('.original-link').getAttribute('href'),'https://itmm.unn.ru/');
assert.equal(await page.locator('.case-files [aria-pressed="true"]').getAttribute('data-case'),'itmm');
await page.screenshot({path:'featured-review/03-itmm-case.png',fullPage:true});
await page.locator('.reader .back-to-desk').click();
await page.locator('.reader[role="dialog"]').waitFor({state:'detached',timeout:7000});

// Validate the requested period update in the rendered experience, not only in source.
await page.locator('[data-testid="open-about"]').click();
await page.locator('.reader[role="dialog"]').waitFor();
const experiences=await page.locator('.experience-sheet').innerText();
assert.match(experiences,/Амбассадоры VK/);
assert.match(experiences,/Сентябрь 2023\s*—\s*Сентябрь 2026/,'VK ambassador role ended September 2026');
await page.screenshot({path:'featured-review/04-vk-role-ended.png',fullPage:true});
await page.locator('.reader .back-to-desk').click();
await page.locator('.reader[role="dialog"]').waitFor({state:'detached',timeout:7000});

await page.emulateMedia({reducedMotion:'reduce'});
await page.reload({waitUntil:'networkidle'});
await page.waitForTimeout(4700);
assert.match(await counter(),/01 \/ 08/,'prefers-reduced-motion disables auto-rotation');
await page.locator('[data-testid="laptop-next"]').click();
assert.match(await counter(),/02 \/ 08/,'manual pager stays accessible with reduced motion');

await page.setViewportSize({width:390,height:844});
await page.waitForTimeout(350);
assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'no mobile sideways scroll');
await page.screenshot({path:'featured-review/05-mobile-showcase.png',fullPage:true});
assert.deepEqual(errors,[],'no JavaScript exceptions');
await fs.writeFile('featured-review/results.json',JSON.stringify({passed:true,
 checks:['ITMM first','Learnio second','9 May third','festival fourth',
 '8 working project indices','hover pause','manual pause and resume','autoplay every ~4.5 seconds',
 'opening selected project','VK experience date September 2026',
 'reduced-motion pauses autoplay','mobile layout','no runtime errors'],
 errors},null,2));
await browser.close();
console.log('Featured website autopager and VK experience browser tests passed.');
