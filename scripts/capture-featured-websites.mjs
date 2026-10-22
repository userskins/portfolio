/**
 * Captures the two new, verified public sites using a real Chromium viewport.
 * Never substitute generic screenshots or use fabricated design images.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
const { chromium } = await import(process.env.STUDIO_PLAYWRIGHT || '/tmp/studio-tools/node_modules/playwright/index.mjs');

const targets = [
  { id:'itmm', url:'https://itmm.unn.ru/', verify:/Институт|Информационных технологий|ИТ.ММ/i },
  { id:'learnio', url:'https://learnio.ru/', verify:/Лёрнио|LearnIO|Учись, тренируйся/i },
];
const out = path.resolve('client/studio/public/previews');
await fs.mkdir(out,{recursive:true});
const browser = await chromium.launch({headless:true});
const reports = [];

for (const target of targets) {
  const context = await browser.newContext({
    viewport:{width:1440,height:940}, deviceScaleFactor:1, colorScheme:'light', reducedMotion:'reduce',
  });
  const page = await context.newPage();
  let succeeded=false,reason='';
  for (let attempt=1;attempt<=2&&!succeeded;attempt++) {
    try {
      const response=await page.goto(target.url,{waitUntil:'domcontentloaded',timeout:32000});
      if (!response || response.status() >= 400) throw new Error('Unexpected HTTP '+response?.status());
      await page.waitForTimeout(2200);
      await page.evaluate(() => document.fonts.ready).catch(()=>{});
      await page.evaluate(async () => {
        await Promise.all([...document.images].slice(0,30).map(img => img.complete ? undefined : Promise.race([
          new Promise(resolve=>{img.addEventListener('load',resolve,{once:true});img.addEventListener('error',resolve,{once:true});}),
          new Promise(resolve=>setTimeout(resolve,1800)),
        ])));
      });
      const content=(await page.locator('body').innerText({timeout:6000})).slice(0,3500);
      if (!target.verify.test(content)) throw new Error('Unexpected page content; refusing to capture a blocked or error page');
      const dest=path.join(out,target.id+'.jpg');
      await page.screenshot({path:dest,type:'jpeg',quality:88,animations:'disabled',timeout:16000});
      const file=await fs.stat(dest);
      if(file.size<16000)throw new Error('Screenshot too small; likely incomplete');
      succeeded=true;
      console.log('CAPTURED '+target.id+' => '+file.size+' bytes / '+target.url);
      reports.push({id:target.id,url:target.url,available:true,bytes:file.size});
    }catch(error) {
      reason=String(error).split('\n')[0];
      console.log('RETRY '+target.id+' '+attempt+' / '+reason);
      await page.waitForTimeout(1000);
    }
  }
  if(!succeeded){reports.push({id:target.id,url:target.url,available:false,error:reason});}
  await context.close();
}
await browser.close();
await fs.writeFile(path.join(out,'featured-captures.json'),JSON.stringify(reports,null,2));
const missing=reports.filter(r=>!r.available);
if(missing.length)throw new Error('Missing authentic previews: '+missing.map(r=>r.id+': '+r.error).join('; '));
console.log('Both featured project screenshots captured from their real websites.');
