import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const { chromium } = await import(process.env.STUDIO_PLAYWRIGHT || '/tmp/studio-tools/node_modules/playwright/index.mjs');
await fs.mkdir('tech-review', { recursive: true });
const browser = await chromium.launch({ headless: true });
const errors = [];
const page = await browser.newPage({ viewport: {width: 1440, height: 950}, deviceScaleFactor: 1 });
page.on('pageerror', error => errors.push(error.message));

const readAppearance = () => page.evaluate(() => {
  const styles = getComputedStyle(document.documentElement);
  const shell = document.querySelector('.atelier-shell');
  const reader = document.querySelector('.reader');
  return {
    htmlTheme: document.documentElement.dataset.studioTheme,
    deskTheme: shell?.getAttribute('data-theme'),
    paper: styles.getPropertyValue('--paper').trim(),
    ink: styles.getPropertyValue('--ink').trim(),
    red: styles.getPropertyValue('--red').trim(),
    screenBackground: shell ? getComputedStyle(shell).backgroundImage : '',
    readerBackground: reader ? getComputedStyle(reader).backgroundColor : '',
  };
});
await page.goto('http://127.0.0.1:4173/studio/', {waitUntil:'networkidle', timeout:45000});
await page.evaluate(() => document.fonts.ready);
// Keep historical case-navigation assertions deterministic; autoplay itself is exercised in featured-autoplay-test.mjs.
await page.locator('[data-testid="laptop-auto-toggle"]').click();
await page.evaluate(() => { if(document.activeElement instanceof HTMLElement) document.activeElement.blur(); });
await page.mouse.move(2,2);
await page.waitForTimeout(500);

let a = await readAppearance();
assert.equal(a.htmlTheme,'tech','Tech must be the sole HTML palette');
assert.equal(a.deskTheme,'tech','Tech desk is explicitly selected');
assert.equal(a.paper,'#edf2f7','silver-blue paper');
assert.equal(a.ink,'#101824','graphite lettering');
assert.equal(a.red,'#ff0000','pure red accents');
assert.match(a.screenBackground,/radial-gradient/,'real silver gradient, not old beige background');
assert.equal(await page.locator('.theme-console, .theme-option').count(),0,'no palette switchers');
assert.equal(await page.locator('[data-object]').count(),7,'physical interactive objects remain');
assert.equal(await page.locator('[data-testid="modern-laptop"]').count(),1,'modern laptop remains');
await page.screenshot({path:'tech-review/01-desktop-tech.png',fullPage:true});

// The user's browser might have saved Cold or Swiss from the previous version.
for (const oldTheme of ['cold','swiss']) {
  await page.evaluate(value => localStorage.setItem('userskins-atelier-theme', value),oldTheme);
  await page.reload({waitUntil:'networkidle'});
  await page.waitForTimeout(350);
  a=await readAppearance();
  assert.equal(a.htmlTheme,'tech','previously saved '+oldTheme+' must not override Tech');
  assert.equal(a.paper,'#edf2f7','old saved palette must not affect Tech CSS');
}

await page.locator('[data-folder="design"]').click();
await page.locator('.reader[role="dialog"]').waitFor();
await page.waitForTimeout(420);
a=await readAppearance();
assert.equal(a.readerBackground,'rgb(232, 239, 247)','project windows use Tech editorial, not beige');
assert.equal(await page.locator('.reader-top .theme-console').count(),0,'no switcher inside project viewer');
await page.screenshot({path:'tech-review/02-project-viewer-tech.png',fullPage:true});
await page.locator('.reader .back-to-desk').click();
await page.locator('.reader[role="dialog"]').waitFor({state:'detached',timeout:7000});

await page.locator('[data-testid="laptop-next"]').click();
await page.waitForTimeout(350);
assert.match(await page.locator('.modern-page-count').innerText(),/02\s*\/\s*08/,'websites still scroll inside modern laptop');
await page.locator('[data-testid="atelier-shuffle"]').click();
await page.waitForTimeout(350);
assert.equal(await page.locator('.atelier-shell').getAttribute('data-arrangement'),'1','object shuffle still works');
await page.getByRole('button',{name:'Собрать стол'}).click();
await page.waitForTimeout(500);
assert.equal(await page.locator('.atelier-shell').getAttribute('data-arrangement'),'0','desk reset still works');

for (const width of [768,390]) {
  await page.setViewportSize({width,height:844});
  await page.waitForTimeout(320);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false,'no mobile horizontal overflow at '+width);
  assert.equal((await readAppearance()).htmlTheme,'tech','tech is stable at '+width);
  assert.equal(await page.locator('.theme-console').count(),0,'no hidden/mobile palette control at '+width);
  await page.screenshot({path:'tech-review/03-mobile-'+width+'-tech.png',fullPage:true});
}
await page.reload({waitUntil:'networkidle'});
assert.equal((await readAppearance()).paper,'#edf2f7','Tech persists after mobile reload');
assert.deepEqual(errors,[],'no JavaScript errors');

await fs.writeFile('tech-review/results.json',JSON.stringify({
 passed:true,
 checks:['fixed single Tech theme','pure red accents','silver-blue desk','no switch controls',
  'old stored Cold/Swiss ignored','Tech project viewer','modern laptop carousel',
  'desk shuffle/reset','768px and 390px responsive layouts','no runtime errors'],
 errors
},null,2));
await browser.close();
console.log('Tech-only desktop, modal, stale-storage and mobile checks passed.');
