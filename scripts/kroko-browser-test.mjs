import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const {chromium}=await import(process.env.STUDIO_PLAYWRIGHT||'/tmp/studio-tools/node_modules/playwright/index.mjs');
const browser=await chromium.launch({headless:true});const contexts=[];const pages=[];
try {
 for(let i=0;i<4;i++){const ctx=await browser.newContext({viewport:{width:390,height:844}});contexts.push(ctx);pages.push(await ctx.newPage());}
 const host=pages[0];const base='http://127.0.0.1:4173/studio/';
 await host.goto(base);await host.getByRole('link',{name:'Открыть игру КРОКО'}).click();
 await host.locator('#create').click();await host.locator('.code').waitFor({timeout:25000});
 const code=await host.locator('.code').innerText();assert.match(code,/^[A-Z2-9]{6}$/);
 await host.locator('#claim').click();await host.getByText('Вы здесь ✓',{exact:true}).waitFor();
 for(let i=1;i<4;i++){
  await pages[i].goto(base+'kroko/?room='+code);await pages[i].locator('.code').waitFor({timeout:30000});
  await pages[i].locator('[data-team="'+i+'"]').click();await pages[i].locator('#claim').click();await pages[i].getByText('Вы здесь ✓',{exact:true}).waitFor();
 }
 await host.getByText('4/4',{exact:true}).waitFor({timeout:10000});
 await host.locator('[data-act="launch"]').click();await host.locator('[data-act="start"]').click();
 await host.locator('#word').waitFor();assert.ok(await host.locator('#word').innerText());
 for(let i=1;i<4;i++){await pages[i].getByText('Тс-с… они угадывают!',{exact:true}).waitFor({timeout:10000});assert.equal(await pages[i].locator('#word').count(),0);}
 await host.locator('[data-act="yes"]').click();await host.getByText('УГАДАНО 1',{exact:true}).waitFor();
 await fs.mkdir('kroko-review',{recursive:true});await host.screenshot({path:'kroko-review/host-playing.png',fullPage:true});await pages[1].screenshot({path:'kroko-review/team-private.png',fullPage:true});
 await host.getByText('МИНУТА ЗАКОНЧИЛАСЬ',{exact:true}).waitFor({timeout:70000});
 await host.locator('[data-act="next"]').click();await pages[1].locator('[data-act="start"]').waitFor({timeout:10000});
 console.log('PASS: real PeerJS/WebRTC room, four isolated mobile browsers, secret cards, synchronized score, 60-second timeout, next team');
}finally{await Promise.all(contexts.map(c=>c.close()));await browser.close();}
