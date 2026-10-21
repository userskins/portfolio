import fs from 'node:fs/promises';
import path from 'node:path';
const { chromium } = await import(process.env.STUDIO_PLAYWRIGHT || '/tmp/studio-tools/node_modules/playwright/index.mjs');
const root = process.cwd();
const source = (await fs.readFile('client/src/lib/data.ts', 'utf8')).split('export const projects: Project[] = [')[1].split('export interface GalleryImage')[0].replace(/\/\*[\s\S]*?\*\//g, '');
const read = (block, field) => new RegExp(`${field}:\\s*(['"])(.*?)\\1`).exec(block)?.[2];
const entries = [...source.matchAll(/\{[^{}]*\}/g)].map(([block]) => ({ id: read(block,'id'), title: read(block,'title'), tag: read(block,'tag'), url: read(block,'url') })).filter(p => p.id && p.url && ['websites','email'].includes(p.tag));
const out = path.join(root,'client/studio/public/previews');
await fs.mkdir(out, {recursive:true});
const browser = await chromium.launch({headless:true});
const reports = [];
let cursor=0;
async function worker() {
  while(cursor < entries.length) {
    const project=entries[cursor++];
    const context=await browser.newContext({viewport:{width:1280,height:880},deviceScaleFactor:1, reducedMotion:'reduce'});
    const page=await context.newPage();
    try {
      const response=await page.goto(project.url,{waitUntil:'domcontentloaded',timeout:22000});
      if (!response || response.status()>=400) throw new Error(`HTTP ${response?.status()}`);
      await page.waitForTimeout(2300);
      const text=await page.locator('body').innerText({timeout:4000});
      if (/access denied|checking your browser|just a moment|forbidden|site not found/i.test(text.slice(0,500))) throw new Error('The website returned an access/error page.');
      await page.screenshot({path:path.join(out,`${project.id}.jpg`),type:'jpeg',quality:83,animations:'disabled',timeout:10000});
      reports.push({id:project.id,title:project.title,available:true,capturedAt:new Date().toISOString()});
      console.log(`Captured project ${project.id}`);
    } catch(error) {
      reports.push({id:project.id,title:project.title,available:false,error:String(error).split('\n')[0]});
      console.log(`No screenshot for ${project.id}; the UI keeps its original link.`);
    } finally { await context.close(); }
  }
}
await Promise.all([worker(),worker()]);
await browser.close();
await fs.writeFile(path.join(out,'manifest.json'),JSON.stringify(reports,null,2));
console.log(`Screenshots available: ${reports.filter(p=>p.available).length}/${entries.length}`);
