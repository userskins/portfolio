// Capture current live homepages for the two websites added to the 2024 portfolio.
// This is best-effort; custom graphic covers remain available when an origin blocks browsers.
import fs from 'node:fs/promises';
const { chromium } = await import(process.env.STUDIO_PLAYWRIGHT || '/tmp/studio-tools/node_modules/playwright/index.mjs');
const targets = [
  ['sea-real-estate-mexico', 'https://searealestatemexico.com/'],
  ['business-academia', 'https://businessacademia.ru/'],
];
await fs.mkdir('client/studio/public/previews', { recursive: true });
let browser;
try {
  browser = await chromium.launch({headless:true});
  for(const [id,url] of targets) {
    const page = await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1,reducedMotion:'reduce'});
    try {
      await page.goto(url,{waitUntil:'domcontentloaded',timeout:26000});
      await page.waitForTimeout(1400);
      await page.screenshot({path:`client/studio/public/previews/${id}.jpg`,type:'jpeg',quality:78,animations:'disabled'});
      console.log('Website preview saved:',id);
    } catch(error) {console.warn('Preview unavailable; styled fallback will display:',id,String(error));}
    finally {await page.close();}
  }
} catch(error) {console.warn('Website preview capture skipped:',String(error));}
finally {if(browser) await browser.close();}
