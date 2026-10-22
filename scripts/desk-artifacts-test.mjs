import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const { chromium } = await import(process.env.STUDIO_PLAYWRIGHT || '/tmp/studio-tools/node_modules/playwright/index.mjs');
await fs.mkdir('desk-artifacts-review', { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 950 }, deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
await page.goto('http://127.0.0.1:4173/studio/', { waitUntil: 'networkidle', timeout: 45000 });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(700);

assert.equal(await page.locator('[data-object]').count(), 8, 'the seven main desk objects and pencil remain fixed');
assert.equal(await page.locator('[data-folder="design"] .design-cover-graphic').count(), 1, 'design has custom art-directed geometry');
assert.equal(await page.locator('[data-folder="design"] img').count(), 0, 'design has no unrelated pasted-on photo');
assert.equal(await page.locator('[data-folder="design"] .hand-star').evaluate(el=>getComputedStyle(el).color),'rgb(18, 36, 56)','Design star contrasts against bright-red block');
assert.equal(await page.locator('.notebook-title').evaluate(el=>getComputedStyle(el,'::after').bottom),'1px','About underline stays above notebook metadata');
assert.equal(await page.getByTestId('mail-envelope').count(), 1, 'email is a physical envelope');
assert.equal(await page.locator('.modern-laptop-note').count(),0,'redundant laptop handwriting removed');
assert.equal(await page.locator('.desk-star').count(),0,'stray red star removed');
assert.equal(await page.getByTestId('motion-disc').count(), 1, 'motion uses an animated physical record');
assert.equal(await page.locator('[data-testid^="rotate-"],[data-testid^="move-"]').count(), 0, 'free drag/rotation controls remain removed');
assert.equal(await page.getByTestId('motion-disc').innerText(),'motion.','only one handwritten Motion label remains');
assert.equal(await page.locator('.motion-cd-player-display,.motion-record-index,.motion-cd-inlay-subtitle').count(),0,'fake technical CD labels are gone');
assert.equal(await page.locator('.mail-letter-number,.mail-letter-footer').count(),0,'envelope no longer contains generic placeholder metadata');
await page.screenshot({ path: 'desk-artifacts-review/01-new-objects-desktop.png', fullPage: true });

const envelope = page.getByTestId('mail-envelope');
const envelopeLetter = envelope.locator('.mail-envelope-letter');
const y = () => envelopeLetter.evaluate(el => new DOMMatrixReadOnly(getComputedStyle(el).transform).m42);
await page.mouse.move(2, 2);
await page.waitForTimeout(660);
const closed = await y();
const closedBounds=await envelope.evaluate(node=>{
 const letter=node.querySelector('.mail-envelope-letter'),back=node.querySelector('.mail-envelope-back');
 const s=getComputedStyle(letter),b=getComputedStyle(back);
 return {letterBottom:parseFloat(s.top)+parseFloat(s.height)+new DOMMatrixReadOnly(s.transform).m42,backBottom:node.clientHeight-parseFloat(b.bottom)};
});
assert.ok(closedBounds.letterBottom < closedBounds.backBottom-2,'letter stays fully within closed envelope; no white strips');
await envelope.hover();
await page.waitForTimeout(780);
assert.equal(await page.locator('.atelier-cursor').getAttribute('data-label'),'КУРСОР','envelope keeps a small unobtrusive cursor');
const opened = await y();
assert.ok(opened < closed - 40, `hover visibly opens mail letter: ${closed} -> ${opened}`);
const layers = await page.evaluate(() => ({ email: Number(getComputedStyle(document.querySelector('.object-email')).zIndex), laptop: Number(getComputedStyle(document.querySelector('.object-laptop')).zIndex) }));
assert.ok(layers.email > layers.laptop,'opened envelope rises above laptop instead of being hidden under it');
await page.screenshot({ path: 'desk-artifacts-review/02-envelope-opening.png', fullPage: true });
await envelope.click();
await page.locator('.reader[role="dialog"]').waitFor();
assert.match(await page.locator('.reader-heading').innerText(), /EMAIL/i, 'envelope opens actual CRM work');
await page.waitForTimeout(430);
await page.locator('.reader .back-to-desk').click();
await page.locator('.reader[role="dialog"]').waitFor({ state: 'detached', timeout: 7000 });

const record = page.getByTestId('motion-disc');
const discAnimation = await record.locator('.motion-record-spinning').evaluate(el => getComputedStyle(el).animationName);
assert.equal(discAnimation, 'desk-record-spin', 'CD rotates inside its case');
assert.equal(await record.locator('.motion-cd-case').count(), 1, 'CD has jewel case');
assert.equal(await page.getByTestId('motion-spin-toggle').count(), 0, 'no play button');
await record.hover();
assert.equal(await page.locator('.atelier-cursor').getAttribute('data-label'),'КУРСОР','record remains visible under the cursor');
await page.getByTestId('open-motion').click();
await page.locator('.reader[role="dialog"]').waitFor();
assert.match(await page.locator('.reader-heading').innerText(), /АНИМАЦИЯ|MOTION/i, 'record opens actual animation projects');
await page.waitForTimeout(430);
await page.locator('.reader .back-to-desk').click();
await page.locator('.reader[role="dialog"]').waitFor({ state: 'detached', timeout: 7000 });

await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(640);
assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'mail and record cause no mobile overflow');
assert.equal(await envelope.isVisible(), true, 'envelope remains visible on phones');
assert.equal(await record.isVisible(), true, 'record remains visible on phones');
assert.equal(await record.locator('.motion-cd-case').isVisible(), true, 'mobile CD case remains visible');
assert.equal(await page.locator('[data-testid^="move-"]').count(),0,'no dragging handles on mobile');
await page.screenshot({ path: 'desk-artifacts-review/03-new-objects-mobile.png', fullPage: true });
assert.deepEqual(errors, [], 'no runtime errors');
await fs.writeFile('desk-artifacts-review/results.json', JSON.stringify({ passed: true,
  checks: ['8 desk objects with gentle bounded hover motion', 'contrasting star on Design cover', 'openable envelope layered above laptop',
    'email project dialog', 'rotating jewel-case CD with one handwritten label', 'no play button', 'animation project dialog',
    'mobile layout', 'no mobile drag handles', 'no JavaScript errors'], errors }, null, 2));
await browser.close();
console.log('Desk art-direction and interactive material tests passed.');
