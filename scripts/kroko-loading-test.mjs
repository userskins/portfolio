import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const {chromium}=await import(process.env.STUDIO_PLAYWRIGHT||'/tmp/studio-tools/node_modules/playwright/index.mjs');
const browser=await chromium.launch({headless:true});const base='http://127.0.0.1:4173/studio/kroko/';
try{
 await fs.mkdir('kroko-review',{recursive:true});
 const ctx=await browser.newContext({viewport:{width:390,height:844}});const page=await ctx.newPage();const requests=[];
 await ctx.route(/\/(network\.js|rules\.js|vendor\/peerjs\.min\.js)/,r=>r.abort());
 page.on('request',r=>requests.push(r.url()));
 await page.goto(base,{waitUntil:'load'});
 assert.ok(await page.locator('#create').isVisible(),'menu renders with connection assets blocked');
 assert.equal(await page.locator('.cat').count(),7);
 assert.ok(!(await page.locator('body').innerText()).includes('Error'));
 assert.equal(requests.filter(url=>/network\.js|rules\.js|peerjs\.min\.js/.test(url)).length,0,'landing requests no connection modules');
 await page.screenshot({path:'kroko-review/fast-mobile-menu.png',fullPage:true});
 await page.locator('#create').click();await page.locator('#err').waitFor();assert.match(await page.locator('#err').innerText(),/модуль комнаты/);
 assert.ok(await page.locator('#create').isEnabled(),'failed module download leaves retryable controls');
 await ctx.close();
 const noJS=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const staticPage=await noJS.newPage();await staticPage.goto(base);assert.ok(await staticPage.getByRole('heading',{name:'Ну ты же понял!'}).isVisible());assert.ok(await staticPage.locator('#create').isVisible());await noJS.close();
 const privateCtx=await browser.newContext();await privateCtx.addInitScript(()=>{Storage.prototype.getItem=()=>{throw Error('storage disabled')};Storage.prototype.setItem=()=>{throw Error('storage disabled')};});const privatePage=await privateCtx.newPage();await privatePage.goto(base);assert.ok(await privatePage.locator('#create').isVisible(),'privacy settings do not leave a blank page');await privateCtx.close();
 console.log('PASS: immediate menu with blocked network modules; no connection requests on landing; static fallback without JS; disabled storage; retry after failed download');
}finally{await browser.close();}
