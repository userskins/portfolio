import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const {chromium}=await import(process.env.STUDIO_PLAYWRIGHT||'/tmp/studio-tools/node_modules/playwright/index.mjs');
const browser=await chromium.launch({headless:true});const contexts=[],phones=[];
try{
 const hostContext=await browser.newContext({viewport:{width:1440,height:960}});contexts.push(hostContext);
 // Even with WebRTC unavailable, the room must work over the dual port-443 relay with different channels blocked per phone.
 await hostContext.addInitScript(()=>{window.RTCPeerConnection=undefined});const host=await hostContext.newPage();
 const base='http://127.0.0.1:4173/studio/';await host.goto(base);await host.getByRole('link',{name:'Открыть игру КРОКО'}).click();
 await host.locator('#create').click();await host.locator('.host-room-code').waitFor({timeout:30000});const code=await host.locator('.host-room-code').innerText();assert.match(code,/^S[A-Z2-9]{5}$/);
 assert.equal(await host.locator('#claim').count(),0,'display does not occupy a team');assert.ok(!(await host.locator('[data-act="launch"]').isEnabled()));
 for(let i=0;i<4;i++){
  const ctx=await browser.newContext({viewport:{width:390,height:844}});contexts.push(ctx);await ctx.addInitScript(()=>{window.RTCPeerConnection=undefined});if(i===1)await ctx.routeWebSocket(/public\.cloud\.shiftr\.io/,ws=>ws.close());if(i===2)await ctx.routeWebSocket(/demo\.tbmq\.io/,ws=>ws.close());const p=await ctx.newPage();phones.push(p);
  if(i===0){await p.goto(base+'kroko/');await p.locator('#code').fill(code);await p.locator('#join').click();}
  else await p.goto(base+'kroko/?room='+code);
  await p.locator('[data-team="'+i+'"]').waitFor({timeout:30000});await p.locator('[data-team="'+i+'"]').click();await p.locator('#claim').click();await p.getByText('Вы здесь ✓',{exact:true}).waitFor({timeout:20000});
 }
 await host.getByText('НАЧАТЬ ИГРУ · 4/4',{exact:true}).waitFor({timeout:15000});await host.locator('[data-act="launch"]').click();await host.locator('[data-act="start"]').click();
 await phones[0].locator('#word').waitFor({timeout:15000});assert.ok(await phones[0].locator('#timer').evaluate(e=>e.getBoundingClientRect().top>=0),'turn starts at the top of the phone screen');assert.ok(await phones[0].locator('#word').innerText());assert.equal(await host.locator('#word').count(),0);assert.equal(await host.locator('[data-act="yes"]').count(),0);
 for(let i=1;i<4;i++){await phones[i].getByText('Тс-с… они угадывают!',{exact:true}).waitFor({timeout:15000});assert.equal(await phones[i].locator('#word').count(),0);}
 assert.equal(await host.locator('[data-start]').count(),4);assert.equal(await host.locator('[data-finish]').count(),4);assert.equal(await host.locator('.field').count(),30);
 const secret=await phones[0].locator('#word').innerText();const cardId=await phones[0].locator('[data-card-id]').getAttribute('data-card-id');
 await fs.mkdir('kroko-review',{recursive:true});await host.screenshot({path:'kroko-review/tv-playing.png',fullPage:true});await phones[0].screenshot({path:'kroko-review/phone-secret-card.png',fullPage:true});
 await phones[0].locator('[data-act="yes"]').click();await host.getByText('КАРТОЧКА УГАДАНА',{exact:true}).waitFor({timeout:15000});assert.equal(await phones[0].locator('#word').count(),0);assert.ok(!(await host.locator('body').innerText()).includes(secret));assert.match(await host.locator('.result-score').innerText(),/^\+5/);
 // Three skipped turns return to the red team's new drawing field.
 for(let i=1;i<4;i++){
  await host.locator('[data-act="next"]').click();await phones[i].locator('[data-act="start"]').waitFor({timeout:15000});await phones[i].locator('[data-act="start"]').click();await phones[i].locator('#word').waitFor({timeout:15000});
  assert.notEqual(await phones[i].locator('[data-card-id]').getAttribute('data-card-id'),cardId);
  await phones[i].locator('[data-act="skip"]').click();await host.getByText('КАРТОЧКА ПРОПУЩЕНА',{exact:true}).waitFor({timeout:15000});assert.equal(await phones[i].locator('#word').count(),0);
 }
 await host.locator('[data-act="next"]').click();await phones[0].locator('[data-act="start"]').waitFor({timeout:15000});await phones[0].locator('[data-act="start"]').click();await phones[0].locator('canvas').waitFor({timeout:15000});
 assert.notEqual(await phones[0].locator('[data-card-id]').getAttribute('data-card-id'),cardId);assert.equal(await host.locator('canvas').count(),0);assert.equal(await host.locator('#word').count(),0);
 await phones[0].locator('#hideword').click();assert.equal(await phones[0].locator('#word').innerText(),'••••••');await phones[0].locator('#hideword').click();
 await phones[0].screenshot({path:'kroko-review/phone-drawing.png',fullPage:true});await host.screenshot({path:'kroko-review/tv-four-routes.png',fullPage:true});
 await host.getByText('МИНУТА ЗАКОНЧИЛАСЬ',{exact:true}).waitFor({timeout:70000});assert.match(await host.locator('.result-score').innerText(),/^\+0/);await host.locator('[data-act="next"]').click();await phones[1].locator('[data-act="start"]').waitFor({timeout:15000});
 console.log('PASS: TV + four isolated phones; two independent port-443 relays; 4 starts/finishes and 30 fields; one secret card per turn; correct value movement; immediate results; skipped card retirement; drawing canvas and hide control; real 60-second timeout; next team');
}catch(e){await fs.mkdir('kroko-review',{recursive:true});for(let i=0;i<contexts.length;i++){const p=contexts[i].pages()[0];if(p)await p.screenshot({path:'kroko-review/failure-'+i+'.png',fullPage:true}).catch(()=>{});}throw e;
}finally{await Promise.all(contexts.map(c=>c.close()));await browser.close();}
