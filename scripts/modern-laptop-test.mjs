import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const { chromium } = await import(process.env.STUDIO_PLAYWRIGHT || '/tmp/studio-tools/node_modules/playwright/index.mjs');
const browser = await chromium.launch({ headless: true });
await fs.mkdir('ultralight-review', { recursive: true });
const errors = [];
const page = await browser.newPage({ viewport:{width:1440,height:950}, deviceScaleFactor:1 });
page.on('pageerror', error => errors.push(error.message));
await page.goto('http://127.0.0.1:4173/studio/', { waitUntil:'networkidle', timeout:45000 });
await page.evaluate(() => document.fonts.ready);
// Keep historical case-navigation assertions deterministic; autoplay itself is exercised in featured-autoplay-test.mjs.
await page.locator('[data-testid="laptop-auto-toggle"]').click();
await page.evaluate(() => { if(document.activeElement instanceof HTMLElement) document.activeElement.blur(); });
await page.mouse.move(2,2);
await page.waitForTimeout(900);

assert.equal(await page.locator('[data-testid="modern-laptop"]').count(), 1, 'modern laptop is present');
assert.equal(await page.locator('.modern-key').count(), 49, 'subtle keyboard hardware exists');
assert.equal(await page.locator('.modern-screen-content .project-visual').count(), 1);
const aspect = await page.locator('.modern-laptop-lid').evaluate(element => {
  const css = getComputedStyle(element);
  return css.aspectRatio;
});
assert.match(aspect, /16\s*\/\s*10/, 'modern thin-bezel display is 16:10');
assert.ok(await page.locator('.modern-laptop-screen img').first().evaluate(img => img instanceof HTMLImageElement && img.complete && img.naturalWidth > 0), 'the portfolio image really loaded');
await page.screenshot({ path:'ultralight-review/01-ultralight-desktop.png', fullPage:true });

await page.locator('[data-testid="laptop-next"]').click();
await page.waitForTimeout(520);
assert.match(await page.locator('.modern-page-count').innerText(), /02\s*\/\s*09/, 'modern pager shows second project');
assert.match((await page.locator('.modern-screen-open').getAttribute('aria-label')) ?? '', /Лёрнио/, 'selected project changed');
await page.screenshot({ path:'ultralight-review/02-next-site-on-laptop.png', fullPage:true });

await page.locator('[data-testid="open-websites"]').click();
await page.locator('[role="dialog"]').waitFor();
assert.equal(await page.locator('.case-files [aria-pressed="true"]').getAttribute('data-case'), 'learnio', 'opening modern laptop selects project 02');
await page.locator('.reader .back-to-desk').click();
await page.locator('.reader[role="dialog"]').waitFor({state:'detached',timeout:6000});

await page.setViewportSize({width:390,height:844});
await page.waitForTimeout(400);
assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'no horizontal overflow on mobile');
await page.screenshot({path:'ultralight-review/03-ultralight-mobile.png',fullPage:true});

// Touch Events test the site's actual swipe handlers without relying on a mobile emulator gesture library.
const swipeResult = await page.locator('.modern-screen-open').evaluate(element => {
  const t1 = new Touch({identifier:8,target:element,clientX:280,clientY:230});
  const t2 = new Touch({identifier:8,target:element,clientX:105,clientY:228});
  const start = new TouchEvent('touchstart',{bubbles:true,cancelable:true,touches:[t1],targetTouches:[t1],changedTouches:[t1]});
  const end = new TouchEvent('touchend',{bubbles:true,cancelable:true,touches:[],targetTouches:[],changedTouches:[t2]});
  element.dispatchEvent(start);
  element.dispatchEvent(end);
  return end.defaultPrevented;
});
assert.equal(swipeResult,true,'mobile swipe is handled and cancels accidental project-open click');
await page.waitForTimeout(580);
assert.match(await page.locator('.modern-page-count').innerText(),/03\s*\/\s*09/,'mobile swipe advances to site 03');
await page.screenshot({path:'ultralight-review/04-mobile-swiped-project.png',fullPage:true});
assert.deepEqual(errors,[],'no runtime JavaScript errors');

await fs.writeFile('ultralight-review/results.json',JSON.stringify({
  passed:true,
  checks:[
    'modern 16:10 screen','real preview image loaded','minimal 49-key hardware',
    'carousel navigation','selected website opens correctly',
    'mobile viewport no overflow','mobile swipe advances project',
    'prevent click after swipe','no browser errors'
  ],
  errors
},null,2));
console.log('Modern ultralight laptop tests passed.');
await browser.close();
