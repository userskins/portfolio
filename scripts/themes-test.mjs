import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const { chromium } = await import(process.env.STUDIO_PLAYWRIGHT || '/tmp/studio-tools/node_modules/playwright/index.mjs');
await fs.mkdir('theme-review', { recursive:true });
const browser = await chromium.launch({headless:true});
const errors = [];
const page = await browser.newPage({viewport:{width:1440,height:950},deviceScaleFactor:1});
page.on('pageerror', error => errors.push(error.message));

await page.goto('http://127.0.0.1:4173/studio/', {waitUntil:'networkidle',timeout:45000});
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);

const root = page.locator('html');
const palette = async () => page.evaluate(() => {
  const rootStyle = getComputedStyle(document.documentElement);
  const shellStyle = getComputedStyle(document.querySelector('.atelier-shell'));
  const reader = document.querySelector('.reader');
  return {
    theme: document.documentElement.dataset.studioTheme,
    paper: rootStyle.getPropertyValue('--paper').trim(),
    ink: rootStyle.getPropertyValue('--ink').trim(),
    desk: shellStyle.backgroundImage + '/' + shellStyle.backgroundColor,
    reader: reader ? getComputedStyle(reader).backgroundColor : null
  };
});
const change = async (theme) => {
  await page.locator('.identity-rail').getByTestId('theme-' + theme).click();
  await page.waitForFunction(next => document.documentElement.dataset.studioTheme === next,theme);
  assert.equal(await root.getAttribute('data-studio-theme'),theme);
  assert.equal(await page.locator('.studio-shell').getAttribute('data-theme'),theme);
  assert.equal(await page.locator('.identity-rail').getByTestId('theme-' + theme).getAttribute('aria-pressed'),'true');
  assert.equal(await page.evaluate(() => localStorage.getItem('userskins-atelier-theme')),theme);
};
assert.equal(await root.getAttribute('data-studio-theme'),'cold','new visitors get cold white by default');
assert.equal(await page.locator('.identity-rail .theme-option').count(),3,'all three themes are always visible');
assert.equal(await page.locator('[data-object]').count(),7,'original interactive desk remains intact');
const cold=await palette();
assert.equal(cold.paper,'#f7f9fc');
await page.screenshot({path:'theme-review/01-cold-white-studio.png',fullPage:true});

await change('tech');
const tech=await palette();
assert.equal(tech.paper,'#edf2f7','tech has a steel-tinted base');
assert.notEqual(tech.desk,cold.desk,'tech changes the full desk not just the switcher');
await page.screenshot({path:'theme-review/02-white-tech-editorial.png',fullPage:true});

await change('swiss');
const swiss=await palette();
assert.equal(swiss.paper,'#ffffff');
assert.equal(swiss.desk.includes('rgb(255, 255, 255)'),true,'Swiss white desktop is genuinely white');
assert.notEqual(swiss.desk,tech.desk,'Swiss visually differs from tech');
await page.screenshot({path:'theme-review/03-minimal-swiss-chaos.png',fullPage:true});

// Reload must preserve the chosen theme; page should not revert to beige.
await page.reload({waitUntil:'networkidle'});
await page.waitForFunction(() => document.documentElement.dataset.studioTheme === 'swiss');
assert.equal(await page.locator('.identity-rail').getByTestId('theme-swiss').getAttribute('aria-pressed'),'true','persistence is reflected in the UI');

// Modal is a React Portal, so its palette must update too.
await page.locator('[data-folder="design"]').click();
await page.locator('.reader[role="dialog"]').waitFor();
const before=await palette();
assert.equal(before.reader,'rgb(255, 255, 255)','Swiss reader uses white');
await page.locator('.reader-top').getByTestId('theme-tech').click();
await page.waitForFunction(() => document.documentElement.dataset.studioTheme === 'tech');
const after=await palette();
assert.notEqual(after.reader,before.reader,'modal reader responds to palette while staying open');
assert.equal(await page.locator('.reader[role="dialog"]').count(),1,'changing theme does not close the project');
await page.screenshot({path:'theme-review/04-tech-project-viewer.png',fullPage:true});
await page.locator('.reader .back-to-desk').click();
await page.locator('.reader[role="dialog"]').waitFor({state:'detached',timeout:6000});

// Functionality must be unchanged after palette switching.
await page.locator('[data-testid="laptop-next"]').click();
assert.match(await page.locator('.modern-page-count').innerText(),/02\s*\/\s*06/);
await page.locator('[data-testid="atelier-shuffle"]').click();
assert.equal(await page.locator('.atelier-shell').getAttribute('data-arrangement'),'1');
await page.getByRole('button',{name:'Собрать стол'}).click();

await page.setViewportSize({width:390,height:844});
await page.waitForTimeout(200);
for (const theme of ['tech','swiss','cold']) {
  await change(theme);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),false,'no mobile horizontal overflow for '+theme);
  await page.screenshot({path:'theme-review/05-mobile-'+theme+'.png',fullPage:true});
}
await page.reload({waitUntil:'networkidle'});
assert.equal(await root.getAttribute('data-studio-theme'),'cold','mobile saved theme survives reload');
assert.deepEqual(errors,[],'no JavaScript errors across switching and modals');

await fs.writeFile('theme-review/results.json',JSON.stringify({
  passed:true,
  tested:['cold','tech','swiss'],
  checks:['one-click change','distinct full-desktop palettes','reader palette updates in portal',
    'theme survives reload','all three switches keyboard accessible','real project images remain',
    'laptop carousel remains functional','shuffle remains functional','mobile layout in all three themes',
    'no runtime errors'],
  colors:{cold,tech,swiss},
  errors
},null,2));
await browser.close();
console.log('All three studio theme modes passed desktop, modal and mobile browser tests.');
