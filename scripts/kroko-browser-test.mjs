import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const {chromium}=await import(process.env.STUDIO_PLAYWRIGHT||'/tmp/studio-tools/node_modules/playwright/index.mjs');
const browser=await chromium.launch({headless:true});const contexts=[],phones=[];
try{
 const hostContext=await browser.newContext({viewport:{width:1440,height:960}});contexts.push(hostContext);
 // Even with WebRTC unavailable, the room must work over the HTTPS room server.
 await hostContext.addInitScript(()=>{window.RTCPeerConnection=undefined});const host=await hostContext.newPage();
 const base=process.env.KROKO_TEST_BASE||'http://127.0.0.1:4173/studio/';if(process.env.KROKO_TEST_BASE)await host.goto(base+'kroko/');else{await host.goto(base);await host.getByRole('link',{name:'Открыть игру КРОКО'}).click();}
 await host.locator('#create').click();await host.locator('.host-room-code').waitFor({timeout:30000});const code=await host.locator('.host-room-code').innerText();assert.match(code,/^[A-Z2-9]{6}$/);
 assert.equal(await host.locator('#claim').count(),0,'display does not occupy a team');assert.ok(!(await host.locator('[data-act="launch"]').isEnabled()));
 for(let i=0;i<4;i++){
  const ctx=await browser.newContext({viewport:{width:390,height:844}});contexts.push(ctx);await ctx.addInitScript(()=>{window.RTCPeerConnection=undefined});const p=await ctx.newPage();phones.push(p);
  if(i===0){await p.goto(base+'kroko/');await p.locator('#code').fill(code);await p.locator('#join').click();}
  else await p.goto(base+'kroko/?room='+code);
  await p.locator('[data-team="'+i+'"]').waitFor({timeout:30000});await p.locator('[data-team="'+i+'"]').click();await p.locator('#claim').click();await p.getByText('Вы здесь ✓',{exact:true}).waitFor({timeout:20000});
 }
 await host.getByText('НАЧАТЬ ИГРУ · 4/4',{exact:true}).waitFor({timeout:15000});await host.locator('[data-act="launch"]').click();await host.locator('[data-act="start"]').click();
 await phones[0].locator('#word').waitFor({timeout:15000});assert.ok(await phones[0].locator('#word').innerText());assert.equal(await host.locator('#word').count(),0);assert.equal(await host.locator('[data-act="yes"]').count(),0);
 for(let i=1;i<4;i++){await phones[i].getByText('Тс-с… они угадывают!',{exact:true}).waitFor({timeout:15000});assert.equal(await phones[i].locator('#word').count(),0);}
 await phones[0].locator('[data-act="yes"]').click();await host.waitForFunction(()=>document.querySelector('.host-score')?.textContent.trim().startsWith('1'),{timeout:15000});
 await fs.mkdir('kroko-review',{recursive:true});await host.screenshot({path:'kroko-review/tv-playing.png',fullPage:true});await phones[0].screenshot({path:'kroko-review/phone-secret-card.png',fullPage:true});
 await host.getByText('МИНУТА ЗАКОНЧИЛАСЬ',{exact:true}).waitFor({timeout:70000});await host.locator('[data-act="next"]').click();await phones[1].locator('[data-act="start"]').waitFor({timeout:15000});
 console.log('PASS: separate TV/desktop display + four phones; manual room code; all clients with WebRTC disabled; HTTPS room server; private cards; score; 60-second timer; next team');
}catch(e){await fs.mkdir('kroko-review',{recursive:true});for(let i=0;i<contexts.length;i++){const p=contexts[i].pages()[0];if(p)await p.screenshot({path:'kroko-review/failure-'+i+'.png',fullPage:true}).catch(()=>{});}throw e;
}finally{await Promise.all(contexts.map(c=>c.close()));await browser.close();}
