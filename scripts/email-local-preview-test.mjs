import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const { chromium } = await import(process.env.STUDIO_PLAYWRIGHT || '/tmp/studio-tools/node_modules/playwright/index.mjs');
const browser = await chromium.launch({headless:true});
await fs.mkdir('email-previews-review',{recursive:true});
const page = await browser.newPage({viewport:{width:1440,height:900}});
const errors=[];
page.on('pageerror',error => errors.push(error.message));

try {
  await page.goto('http://127.0.0.1:4173/studio/',{waitUntil:'domcontentloaded'});
  await page.getByTestId('mail-envelope').click();
  await page.locator('.reader[role="dialog"]').waitFor();
  assert.equal(await page.locator('.case-files > button').count(),22,'five earlier and seventeen hosted emails');
  assert.equal(await page.locator('.case-files [data-case^="email-archive-"]').count(),17,'all provided HTML previews are indexed');

  for(let i=1;i<=17;i++) {
    const name=String(i).padStart(2,'0');
    const id='email-archive-'+name;
    const item=page.locator('[data-case="'+id+'"]');
    await item.click();
    const frame=page.getByTestId('email-local-preview');
    await frame.waitFor();
    const src=await frame.getAttribute('src');
    assert.ok(src?.startsWith('/studio/emails/'+name+'-'),id+' local iframe URL');
    assert.equal(await frame.getAttribute('sandbox'),'','embedded email never receives script/navigation permissions');
    assert.equal(await page.locator('.reader .original-link').count(),0,'no off-site source link for '+id);
    const response=await page.request.get('http://127.0.0.1:4173'+src);
    assert.equal(response.status(),200,'HTML preview hosted in site for '+id);
    const html=await response.text();
    assert.ok(html.includes('<html')&&html.includes('</html>'),'complete HTML preview for '+id);
    if(i>=16)assert.ok(html.includes('data:image/'),'ZIP archive image is embedded in '+id);
  }

  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:'email-previews-review/01-email-preview-mobile.png',fullPage:true});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'email reader is within mobile viewport');
  assert.deepEqual(errors,[],'no browser JavaScript exceptions');
  console.log('17 local in-site HTML email previews validated with desktop and mobile layouts.');
} finally {await browser.close();}
