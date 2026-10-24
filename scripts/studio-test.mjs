import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const { chromium }=await import(process.env.STUDIO_PLAYWRIGHT || '/tmp/studio-tools/node_modules/playwright/index.mjs');
await fs.mkdir('studio-review',{recursive:true});
const browser=await chromium.launch({headless:true});
const errors=[];
const page=await browser.newPage({viewport:{width:1440,height:950},deviceScaleFactor:1});
page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:4173/studio/',{waitUntil:'networkidle',timeout:30000});
await page.evaluate(()=>document.fonts.ready);
const topNote=page.locator('.desk-handnote.note-top');
assert.deepEqual((await topNote.innerText()).split(/\r?\n/),['креатив.','а потом все удивляются'],'two exact handwritten lines');
assert.equal(await topNote.locator('br').count(),1,'exactly two lines with one line break');
assert.equal(await topNote.evaluate(el=>getComputedStyle(el).textAlign),'left','handwriting has left alignment');

const deskLettering = await page.evaluate(() => {
  const size = selector => parseFloat(getComputedStyle(document.querySelector(selector)).fontSize);
  const back = document.querySelector('.mail-envelope-back').getBoundingClientRect();
  const seal = document.querySelector('.mail-envelope-seal').getBoundingClientRect();
  return {
    intro: size('.intro-line'), idea: size('.rail-note'),
    top: size('.desk-handnote.note-top'), bottom: size('.desk-handnote.note-bottom'),
    notebook: size('.notebook-title'), design: size('.design-cover .binder-title'),
    motion: size('.motion-record-caption'), contact: size('.contact-card strong'),
    sealOffsetX: (seal.left + seal.width / 2) - (back.left + back.width / 2),
    sealOffsetY: (seal.top + seal.height / 2) - (back.top + back.height / 2)
  };
});
assert.ok(deskLettering.intro <= 22 && deskLettering.idea <= 24
  && deskLettering.top <= 22 && deskLettering.bottom <= 30
  && deskLettering.notebook <= 39 && deskLettering.design <= 44
  && deskLettering.motion <= 23 && deskLettering.contact <= 20,
  'all primary desk lettering uses the original compact scale: ' + JSON.stringify(deskLettering));
assert.ok(Math.abs(deskLettering.sealOffsetX) < 2
  && Math.abs(deskLettering.sealOffsetY) < 2,
  'wax seal is precisely centered on the closed envelope body: ' + JSON.stringify(deskLettering));

assert.ok(await topNote.evaluate(el=>parseFloat(getComputedStyle(el).fontSize)<=24),
  'handwriting is compact and does not dominate the desk');
assert.ok(await topNote.evaluate(el=>el.getBoundingClientRect().width < 360),
  'long second line fits compact top area');

// Older interaction tests exercise specific slides. Pause the new automatic showcase to keep their fixtures deterministic.
await page.locator('[data-testid="laptop-auto-toggle"]').click();
await page.evaluate(() => { if(document.activeElement instanceof HTMLElement) document.activeElement.blur(); });
await page.mouse.move(2,2);
await page.waitForTimeout(1500);
assert.equal(await page.locator('[data-object]').count(),8);
await page.screenshot({path:'studio-review/01-desktop.png',fullPage:true});
await page.locator('[data-folder="design"]').click();
await page.locator('[role="dialog"]').waitFor();await page.waitForTimeout(550);
assert.match(await page.locator('.case-files [aria-pressed="true"]').innerText(),/10/);
await page.screenshot({path:'studio-review/02-design.png',fullPage:true});
await page.keyboard.press('ArrowRight');await page.waitForTimeout(650);
assert.equal(await page.locator('.case-files [aria-pressed="true"]').getAttribute('data-case'),'07');
await page.keyboard.press('Escape');await page.locator('.reader[role="dialog"]').waitFor({state:'detached',timeout:7000});
assert.equal(await page.locator('[role="dialog"]').count(),0);
assert.equal(await page.locator('.desk-rotate-handle, .desk-move-handle').count(),0,'no movement or rotation handles');
assert.equal(await page.getByRole('button',{name:'Собрать стол'}).count(),0,'no reset control');
assert.equal(await page.locator('[data-object="loose-one"],[data-object="loose-two"]').count(),0,'background photos removed');
await page.locator('[data-folder="email"]').focus();await page.keyboard.press('Enter');await page.waitForTimeout(600);
assert.equal(await page.locator('[role="dialog"]').count(),1);
await page.keyboard.press('Tab');
assert.equal(await page.evaluate(()=>!!document.activeElement?.closest('[role="dialog"]')),true);
await page.keyboard.press('Escape');await page.locator('.reader[role="dialog"]').waitFor({state:'detached',timeout:7000});
await page.locator('[data-testid="open-websites"]').click();await page.waitForTimeout(700);
assert.equal(await page.locator('.original-link').getAttribute('href'),'https://itmm.unn.ru/');
await page.screenshot({path:'studio-review/03-websites.png',fullPage:true});
await page.keyboard.press('Escape');await page.locator('.reader[role="dialog"]').waitFor({state:'detached',timeout:7000});
await page.locator('[data-testid="open-gallery"]').click();await page.waitForTimeout(650);
assert.equal(await page.locator('.gallery-wall button').count(),80,'12 new originals plus 68 unique existing works (one original duplicate was already removed)');
const newPosters=["ptitsey-stat","staya-ptits","redecorate","tishe-vdrug-uslyshat","bolshe-chem-tvorchestvo","glaza-la-vtornik","ne-poteryay-svoey-dushi","isle-of-flightless-birds","kayus","ne-dumay-o-takom","kap-kap-kap-kap","vesna"];
for(const [i,slug] of newPosters.entries()) {
 const img=page.locator('.gallery-wall button').nth(i).locator('img');
 assert.ok((await img.getAttribute('src')||'').endsWith('/gallery/'+slug+'.webp'),'poster thumbnail '+slug);
 const response=await page.request.get('http://127.0.0.1:4173/studio/gallery/'+slug+'.webp');
 assert.equal(response.status(),200,'original poster available: '+slug);
 assert.ok((response.headers()['content-type']||'').includes('image/webp'),'poster file type: '+slug);
 assert.ok((await response.body()).length>150_000,'full poster bytes: '+slug);
}
assert.equal(await page.locator('link[rel="icon"]').getAttribute('href'),'/studio/favicon.png','user-provided logo favicon');
assert.equal((await page.request.get('http://127.0.0.1:4173/studio/favicon.png')).status(),200,'favicon copied into site');
assert.equal((await page.request.get('http://127.0.0.1:4173/studio/apple-touch-icon.png')).status(),200,'phone icon copied into site');
await page.locator('.gallery-wall button').first().click();
await page.waitForTimeout(350);
assert.ok((await page.getByTestId('gallery-lightbox-image').getAttribute('src')||'').endsWith('/gallery/ptitsey-stat.webp'),'opened first original poster');
assert.equal(await page.getByTestId('gallery-lightbox-image').getAttribute('alt'),'Птицей стать');
await page.waitForTimeout(300);
await page.keyboard.press('ArrowRight');assert.match(await page.locator('.gallery-counter').innerText(),/^2 /);
await page.keyboard.press('Escape');await page.locator('.reader[role="dialog"]').waitFor({state:'detached',timeout:7000});
await page.locator('[data-testid="open-about"]').click();await page.waitForTimeout(550);
assert.ok(await page.locator('.experience-sheet article').count()>=4);
await page.keyboard.press('Escape');await page.locator('.reader[role="dialog"]').waitFor({state:'detached',timeout:7000});
await page.locator('[data-testid="open-contact"]').click();await page.waitForTimeout(550);
assert.equal(await page.locator('.contact-options a[href="mailto:userskins@gmail.com"]').count(),1);
await page.keyboard.press('Escape');await page.locator('.reader[role="dialog"]').waitFor({state:'detached',timeout:7000});
await page.setViewportSize({width:390,height:844});await page.waitForTimeout(700);
assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth),false);
await page.screenshot({path:'studio-review/04-mobile.png',fullPage:true});
await page.locator('[data-testid="open-websites"]').click();await page.waitForTimeout(600);
await page.screenshot({path:'studio-review/05-mobile-websites.png',fullPage:true});
assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth),false);
await page.keyboard.press('Escape');await page.locator('.reader[role="dialog"]').waitFor({state:'detached',timeout:7000});
await page.emulateMedia({reducedMotion:'reduce'});
await page.setViewportSize({width:1440,height:950});
// Start the reduced-motion desktop scenario from a clean viewport. A scrolled
// mobile page can otherwise retain a stale hit-test position during resize.
await page.goto('http://127.0.0.1:4173/studio/',{waitUntil:'networkidle',timeout:45000});
await page.evaluate(()=>document.fonts.ready);
await page.mouse.move(2,2);
await page.locator('[data-folder="design"]').click();await page.waitForTimeout(200);
assert.equal(await page.locator('[role="dialog"]').count(),1);
assert.deepEqual(errors,[]);
await fs.writeFile('studio-review/tests.json',JSON.stringify({passed:true,checks:['desktop scene','real project selection','arrow navigation','Escape closes','fixed objects, no drag or rotate controls','keyboard activation','modal focus trap','website original link','all 12 original posters, favicon, 81-gallery lightbox','experience data','contact links','mobile layout','no horizontal overflow','reduced motion','no runtime errors'],errors},null,2));
await browser.close();
console.log('Studio browser checks passed.');
