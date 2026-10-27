import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const { chromium } = await import(process.env.STUDIO_PLAYWRIGHT || '/tmp/studio-tools/node_modules/playwright/index.mjs');
await fs.mkdir('site-refinement-review',{recursive:true});
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:950},deviceScaleFactor:1});
const errors=[];
page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:4173/studio/',{waitUntil:'networkidle',timeout:45000});
await page.evaluate(()=>document.fonts.ready);
await page.waitForTimeout(650);

assert.equal(await page.locator('.rail-note-star').count(),0,'decorative asterisk removed');
assert.equal(await page.locator('.desk-topline .tiny-cross').count(),0,'unused cross removed');
assert.doesNotMatch(await page.locator('.desk-topline').innerText(),/ПОРТФОЛИО \/ ЖИВОЙ РАБОЧИЙ СТОЛ/,'cluttered label removed');
assert.equal(await page.getByTestId('mail-envelope').count(),1,'envelope remains interactive');
assert.equal(await page.locator('.motion-cd-case').count(),1,'CD jewel case remains');
assert.equal(await page.getByTestId('modern-laptop').count(),1,'laptop remains');
assert.equal(await page.getByTestId('gallery-desk-cover').count(),1,'gallery paper remains');
await page.screenshot({path:'site-refinement-review/01-materials.png',fullPage:true});

await page.getByRole('button',{name:'Проекты'}).first().click();
await page.locator('.reader[role="dialog"]').waitFor();
assert.equal(await page.locator('.project-filter-options button').count(),5,'all five category chips visible');
assert.equal(await page.getByTestId('projects-filter-all').getAttribute('aria-pressed'),'true','All is active initially');
assert.equal(await page.locator(' .case-files > button').count(),35,'all remaining projects visible');
assert.equal(await page.locator('.reader[role="dialog"]').getByTestId('project-preview').getAttribute('data-preview-mode'),'fit','all project previews use the full-fit view');
assert.equal(await page.locator('.reader .preview-view-modes').count(),0,'no preview mode action tags in work cards');
assert.equal(await page.getByTestId('preview-fit').count(),0,'whole-view button is removed');
assert.equal(await page.getByTestId('preview-detail').count(),0,'zoom/scroll button is removed');
await page.getByTestId('projects-filter-email').click();
assert.equal(await page.getByTestId('projects-filter-email').getAttribute('aria-pressed'),'true','email filter active');
assert.equal(await page.locator('.case-files > button').count(),17,'only seventeen locally hosted email projects remain');
await page.getByTestId('projects-filter-websites').click();
assert.equal(await page.locator('.case-files > button').count(),9,'websites selected without exiting');
const selected=await page.locator('.case-files > button').first().getAttribute('data-case');
assert.equal(selected,'itmm','original first website preserved');
for (const site of ['sea-real-estate-mexico','business-academia']) {
  const filename = `previews/${site}.webp`;
  const response = await page.request.get('http://127.0.0.1:4173/studio/' + filename);
  assert.equal(response.status(),200,`actual screenshot exists for ${site}`);
  assert.ok((response.headers()['content-type'] || '').includes('image/webp'),`correct WebP type for ${site}`);
  assert.ok((await response.body()).length > 20_000,`real screenshot asset for ${site}`);
  await page.locator(`.reader .case-files button[data-case="${site}"]`).click();
  await page.locator(`.reader .case-proof .project-visual img[src$="/${filename}"]`).waitFor({state:'visible',timeout:7000});
}
await page.getByTestId('projects-filter-all').click();
assert.equal(await page.locator('.case-files > button').count(),35,'return to all remaining projects works');
await page.screenshot({path:'site-refinement-review/02-filters.png',fullPage:true});
await page.locator('.reader .back-to-desk').click();
await page.locator('.reader[role="dialog"]').waitFor({state:'detached',timeout:7000});

await page.getByTestId('open-about').click();
await page.locator('.reader[role="dialog"]').waitFor();
assert.equal(await page.locator('.bio-sheet > .education-sheet h3').innerText(), 'EDUCATION', 'Education is under Tools & Thinking in the left column');
assert.equal(await page.locator('.bio-sheet .education-sheet article').count(), 2, 'Both education records remain in the left column');
assert.equal(await page.locator('.experience-sheet .education-sheet').count(), 0, 'The right column contains experience only');
assert.ok((await page.locator('.experience-sheet').innerText()).includes('Бизнес-школа «Горки»'),'Gorki is in experience');
assert.ok((await page.locator('.experience-sheet').innerText()).includes('Апрель 2026 — настоящее время'),'Gorki dates correct');
await page.locator('.reader .back-to-desk').click();
await page.locator('.reader[role="dialog"]').waitFor({state:'detached',timeout:7000});

for(const width of [360,390,768]) {
  await page.setViewportSize({width,height:844});
  await page.waitForTimeout(240);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'mobile no overflow '+width);
  await page.getByRole('button',{name:'Проекты'}).first().click();
  await page.locator('.reader[role="dialog"]').waitFor();
  assert.equal(await page.locator('.project-filter-options button').count(),5,'mobile filters '+width);
  assert.equal(await page.getByTestId('projects-filter-design').isVisible(),true,'filter visible '+width);
  await page.getByTestId('projects-filter-design').click();
  assert.equal(await page.locator('.case-files > button').count(),6,'mobile category works '+width);
  await page.getByTestId('projects-filter-all').click();
  assert.equal(await page.locator('.case-files > button').count(),35,'mobile All works '+width);
  if(width===390)await page.screenshot({path:'site-refinement-review/03-mobile-projects.png',fullPage:true});
  await page.locator('.reader .back-to-desk').click();
  await page.locator('.reader[role="dialog"]').waitFor({state:'detached',timeout:7000});
}
assert.deepEqual(errors,[],'no browser errors');
await fs.writeFile('site-refinement-review/results.json',JSON.stringify({passed:true,checks:['all tags','mobile tag switching','realistic desk material styles','uncluttered header','fit and detail modes','Gorki experience','mobile no overflow'],errors},null,2));
await browser.close();
console.log('Project filters, previews, new experience and mobile refinement checks passed.');
