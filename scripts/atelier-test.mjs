import fs from 'node:fs/promises';
import assert from 'node:assert/strict';

const { chromium } = await import(process.env.STUDIO_PLAYWRIGHT || '/tmp/studio-tools/node_modules/playwright/index.mjs');
await fs.mkdir('atelier-review', { recursive: true });
const browser = await chromium.launch({headless:true});
const errors = [];
const page = await browser.newPage({ viewport:{width:1440,height:950}, deviceScaleFactor:1 });
page.on('pageerror', error => errors.push(error.message));
await page.goto('http://127.0.0.1:4173/studio/',{waitUntil:'networkidle',timeout:45000});
await page.evaluate(()=>document.fonts.ready);
// Older interaction tests exercise specific slides. Pause the new automatic showcase to keep their fixtures deterministic.
await page.locator('[data-testid="laptop-auto-toggle"]').click();
assert.equal(await page.locator('[data-testid="laptop-auto-toggle"]').getAttribute('aria-pressed'),'true','autoplay stops before manual navigation');
await page.evaluate(() => { if(document.activeElement instanceof HTMLElement) document.activeElement.blur(); });
await page.mouse.move(2,2);
await page.waitForTimeout(1000);
assert.equal(await page.locator('[data-object]').count(),10,'10 moveable desk objects');
assert.equal(await page.locator('[data-testid="laptop-next"]').count(),1,'laptop pagination is visible');
await page.screenshot({path:'atelier-review/01-interactive-desk.png',fullPage:true});

await page.locator('[data-folder="design"]').hover();
await page.waitForTimeout(260);
assert.match(await page.locator('.atelier-hover-status').innerText(),/ДИЗАЙН/,'scene status reacts to hover');
assert.equal(await page.locator('.atelier-cursor').getAttribute('data-visible'),'true','cursor is visible on desk');
await page.screenshot({path:'atelier-review/02-cursor-hover.png',fullPage:true});

assert.match(await page.locator('.atelier-laptop-pager').innerText(),/01\s*\/\s*07/,'manual browsing starts at ITMM');
// Pointer hover may activate graphics; actual pointer click must still advance on the first attempt.
await page.locator('[data-testid="laptop-next"]').hover();
await page.waitForTimeout(250);
await page.locator('[data-testid="laptop-next"]').click();
await page.waitForFunction(() => /02\s*\/\s*07/.test(document.querySelector('.atelier-laptop-pager')?.textContent ?? ''),null,{timeout:2500});
assert.match(await page.locator('.atelier-laptop-pager').innerText(),/02\s*\/\s*07/,'laptop switched websites with first pointer click');
await page.locator('[data-testid="open-websites"]').click();
await page.locator('[role="dialog"]').waitFor();
await page.waitForTimeout(500);
assert.equal(await page.locator('.case-files [aria-pressed="true"]').getAttribute('data-case'),'learnio','opening laptop uses selected website');
await page.screenshot({path:'atelier-review/03-flipped-laptop-project.png',fullPage:true});
await page.keyboard.press('Escape');
await page.waitForTimeout(650);

assert.equal(await page.locator('[data-testid="atelier-shuffle"]').count(),0,'shuffle was removed');
assert.equal(await page.locator('.desk-rotate-handle').count(),10,'all ten desk items have rotation controls');
await page.locator('.desk-bottomline button[aria-label="Собрать стол"]').click();
await page.waitForTimeout(450);
assert.equal(await page.locator('[data-testid="desk-item-pencil"]').count(),1,'reset keeps movable pencil on the desk');

await page.locator('[data-testid="atelier-help"]').click();
assert.equal(await page.locator('.atelier-help-sheet').count(),1,'help sheet opens');
await page.screenshot({path:'atelier-review/04-interaction-guide.png',fullPage:true});
await page.locator('.atelier-help-top button').click();
await page.locator('.atelier-help-sheet').waitFor({state:'detached',timeout:2500});
assert.equal(await page.locator('.atelier-help-sheet').count(),0,'help closes');
await page.keyboard.press('3');
await page.locator('[role="dialog"]').waitFor();
assert.match(await page.locator('.reader-heading').innerText(),/EMAIL/i,'keyboard opens Email / CRM');
await page.locator('.reader .back-to-desk').click();
await page.locator('.reader[role="dialog"]').waitFor({state:'detached',timeout:6000});

await page.setViewportSize({width:390,height:844});
await page.waitForTimeout(550);
assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth > innerWidth),false,'mobile has no sideways overflow');
await page.screenshot({path:'atelier-review/05-mobile-desk.png',fullPage:true});
await page.locator('[data-testid="laptop-next"]').click();
await page.waitForFunction(() => /03\s*\/\s*07/.test(document.querySelector('.atelier-laptop-pager')?.textContent ?? ''),null,{timeout:3500});
assert.match(await page.locator('.atelier-laptop-pager').innerText(),/03\s*\/\s*07/,'laptop pager works on touch layout');
await page.locator('[data-testid="atelier-help"]').click();
assert.equal(await page.locator('.atelier-help-sheet').count(),1,'mobile help works');
await page.screenshot({path:'atelier-review/06-mobile-help.png',fullPage:true});
assert.deepEqual(errors,[],'no JavaScript errors');
await fs.writeFile('atelier-review/results.json',JSON.stringify({
 passed: true,
 checks: [
  '10 movable desk objects','responsive custom cursor','hover reacts with contextual label',
  'real laptop website pagination','opening selected laptop project',
  '10 rotatable objects and reset, no shuffle','keyboard shortcuts','interactive help card',
  'mobile has no horizontal overflow','mobile laptop pager','mobile help','no page errors'
 ],
 errors
},null,2));
await browser.close();
console.log('Atelier interactive browser tests passed.');
