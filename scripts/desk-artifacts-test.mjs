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

assert.equal(await page.locator('[data-object]').count(), 10, 'all 10 draggable desk items survive the redesign');
assert.equal(await page.locator('[data-folder="design"] .design-cover-graphic').count(), 1, 'design has custom art-directed geometry');
assert.equal(await page.locator('[data-folder="design"] img').count(), 0, 'design has no unrelated pasted-on photo');
assert.equal(await page.getByTestId('mail-envelope').count(), 1, 'email is a physical envelope');
assert.equal(await page.getByTestId('motion-disc').count(), 1, 'motion uses an animated physical record');
assert.equal(await page.locator('[data-testid^="rotate-"]').count(), 10, 'all controls remain rotatable');
await page.screenshot({ path: 'desk-artifacts-review/01-new-objects-desktop.png', fullPage: true });

const envelope = page.getByTestId('mail-envelope');
const envelopeLetter = envelope.locator('.mail-envelope-letter');
const y = () => envelopeLetter.evaluate(el => new DOMMatrixReadOnly(getComputedStyle(el).transform).m42);
await page.mouse.move(2, 2);
await page.waitForTimeout(660);
const closed = await y();
await envelope.hover();
await page.waitForTimeout(780);
const opened = await y();
assert.ok(opened < closed - 40, `hover visibly opens mail letter: ${closed} -> ${opened}`);
await page.screenshot({ path: 'desk-artifacts-review/02-envelope-opening.png', fullPage: true });
await envelope.click();
await page.locator('.reader[role="dialog"]').waitFor();
assert.match(await page.locator('.reader-heading').innerText(), /EMAIL/i, 'envelope opens actual CRM work');
await page.keyboard.press('Escape');
await page.locator('.reader[role="dialog"]').waitFor({ state: 'detached', timeout: 7000 });

const record = page.getByTestId('motion-disc');
const spinStyle = () => record.locator('.motion-record-spinning').evaluate(el => ({
  name: getComputedStyle(el).animationName,
  state: getComputedStyle(el).animationPlayState,
}));
const spinning = await spinStyle();
assert.equal(spinning.name, 'desk-record-spin', 'record spins using CSS animation');
assert.equal(spinning.state, 'running', 'record plays on first view');
await page.getByTestId('motion-spin-toggle').click();
assert.equal((await spinStyle()).state, 'paused', 'pause button genuinely pauses the record');
await page.getByTestId('motion-spin-toggle').click();
assert.equal((await spinStyle()).state, 'running', 'play button resumes the record');
await page.getByTestId('open-motion').click();
await page.locator('.reader[role="dialog"]').waitFor();
assert.match(await page.locator('.reader-heading').innerText(), /АНИМАЦИЯ|MOTION/i, 'record opens actual animation projects');
await page.keyboard.press('Escape');
await page.locator('.reader[role="dialog"]').waitFor({ state: 'detached', timeout: 7000 });

await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(640);
assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'mail and record cause no mobile overflow');
assert.equal(await envelope.isVisible(), true, 'envelope remains visible on phones');
assert.equal(await record.isVisible(), true, 'record remains visible on phones');
assert.equal(await page.getByTestId('motion-spin-toggle').isVisible(), true, 'mobile record playback controls remain visible');
assert.equal(await page.getByTestId('move-email').isVisible(), true, 'envelope is mobile draggable');
assert.equal(await page.getByTestId('move-motion').isVisible(), true, 'record is mobile draggable');
await page.screenshot({ path: 'desk-artifacts-review/03-new-objects-mobile.png', fullPage: true });
assert.deepEqual(errors, [], 'no runtime errors');
await fs.writeFile('desk-artifacts-review/results.json', JSON.stringify({ passed: true,
  checks: ['10 draggable objects', 'geometric design cover without photos', 'openable hover envelope',
    'email project dialog', 'animated vinyl record', 'working pause and resume', 'animation project dialog',
    'mobile layout', 'mobile drag handles', 'no JavaScript errors'], errors }, null, 2));
await browser.close();
console.log('Desk art-direction and interactive material tests passed.');
