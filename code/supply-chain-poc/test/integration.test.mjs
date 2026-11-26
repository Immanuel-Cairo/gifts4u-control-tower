import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {randomUUID} from 'node:crypto';
import {createWebshop} from '../src/webshop.mjs';
import {createControlTower} from '../src/control-tower.mjs';
import {listen,close} from '../src/http.mjs';
const serviceKey='test-service-key-not-for-production-12345';
const request=()=>({customerType:'B2B',lines:[{sku:'MUG-WHITE',quantity:10}],designVersion:'design-demo-v1',promisedDeliveryDate:'2099-12-01',deliveryAddress:{street:'Demostraat',houseNumber:'10',postalCode:'1000AA',city:'Demostad',countryCode:'NL'}});
const event=()=>{const {deliveryAddress,...data}=request();return {eventId:randomUUID(),type:'order.received',source:'webshop',occurredAt:'2026-11-26T12:00:00Z',orderId:randomUUID(),data};};
async function post(url,data,headers={}){const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json',...headers},body:JSON.stringify(data)});return {status:r.status,body:await r.json()};}
async function fixture(t,options={}){
  const dir=mkdtempSync(join(tmpdir(),'gifts4u-poc-test-'));
  const ct=createControlTower({database:join(dir,'ct.sqlite'),serviceKey});
  const ctUrl=await listen(ct.server);
  const shop=createWebshop({database:join(dir,'web.sqlite'),serviceKey,controlTowerUrl:ctUrl,...options});
  const shopUrl=await listen(shop.server);
  let disposed=false;
  async function dispose(){if(disposed)return;disposed=true;await close(shop.server);await shop.flush();await close(ct.server);shop.db.close();ct.db.close();}
  t.after(async()=>{await dispose();rmSync(dir,{recursive:true,force:true});});
  return {ct,ctUrl,shop,shopUrl,dir,dispose,accept:(data=request(),key=randomUUID())=>post(shopUrl+'/webshop/orders',data,{'Idempotency-Key':key}),orders:async()=> (await fetch(ctUrl+'/control-tower/orders')).json()};
}
test('accepted B2B/B2C orders cross HTTP with stable IDs, source/times and no address leak',async t=>{
  const f=await fixture(t);
  for(const customerType of ['B2B','B2C']){
    const r=await f.accept({...request(),customerType});assert.equal(r.status,201);assert.equal(r.body.synchronization,'delivered');
    const view=(await f.orders()).orders.find(o=>o.orderId===r.body.orderId);
    assert.equal(view.data.customerType,customerType);assert.equal(view.source,'webshop');assert.equal(view.status,'Order Received');assert.equal(view.eta,null);
    assert.ok(Date.parse(view.occurredAt));assert.ok(Date.parse(view.receivedAt));assert.equal(JSON.stringify(view).includes('Demostraat'),false);
    const read=await fetch(f.shopUrl+'/webshop/orders/'+r.body.orderId);assert.equal(read.status,200);assert.equal((await read.json()).eventId,r.body.eventId);
  }
  assert.equal((await f.orders()).orders.length,2);
});
test('concurrent identical requests create exactly one order and one received event',async t=>{
  const f=await fixture(t),key=randomUUID();
  const responses=await Promise.all(Array.from({length:8},()=>f.accept(request(),key)));
  await f.shop.flush();assert.equal(new Set(responses.map(r=>r.body.orderId)).size,1);
  assert.equal(responses.filter(r=>r.status===201).length,1);assert.equal((await f.orders()).orders.length,1);
  assert.equal(f.shop.db.prepare('SELECT COUNT(*) n FROM outbox').get().n,1);
});
test('changed data under one request key is a conflict, preserving the original order',async t=>{
  const f=await fixture(t),key=randomUUID();const first=await f.accept(request(),key);
  const changed=request();changed.lines[0].quantity=11;
  const conflict=await f.accept(changed,key);assert.equal(conflict.status,409);assert.equal((await f.orders()).orders[0].data.lines[0].quantity,10);
  assert.equal((await f.accept(request(),key)).body.orderId,first.body.orderId);
});
test('known request succeeds even if inventory subsequently becomes unavailable',async t=>{
  let available=100;const f=await fixture(t,{inventory:()=>available}),key=randomUUID();await f.accept(request(),key);available=null;
  const retry=await f.accept(request(),key);assert.equal(retry.status,200);assert.equal(retry.body.duplicate,true);
});
test('invalid address, quantities, duplicate SKU, dates and unknown fields leave no order',async t=>{
  const f=await fixture(t);
  const changes=[p=>delete p.deliveryAddress.postalCode,p=>p.deliveryAddress.houseNumber='',p=>p.lines[0].quantity=0,p=>p.lines[0].quantity=1.5,p=>p.lines.push({...p.lines[0]}),p=>p.promisedDeliveryDate='2026-02-30',p=>p.unexpected='x',p=>p.customerType='admin'];
  for(const change of changes){const p=request();change(p);assert.equal((await f.accept(p)).status,422);}
  assert.equal(f.shop.db.prepare('SELECT COUNT(*) n FROM orders').get().n,0);assert.equal((await f.orders()).orders.length,0);
});
test('stock shortage and unknown stock are explicit; neither produces an accepted order',async t=>{
  const f=await fixture(t);const shortage=request();shortage.lines[0].quantity=101;assert.equal((await f.accept(shortage)).status,409);
  const unknown=request();unknown.lines[0].sku='UNKNOWN';assert.equal((await f.accept(unknown)).status,503);
  assert.equal(f.shop.db.prepare('SELECT COUNT(*) n FROM outbox').get().n,0);
});
test('HTTP rejects missing key, malformed JSON, wrong content type and oversized payload',async t=>{
  const f=await fixture(t);
  assert.equal((await post(f.shopUrl+'/webshop/orders',request())).status,400);
  for(const [body,type,expected]of [['{','application/json',400],['{}','text/plain',415],['x'.repeat(70000),'application/json',413]]){
    const r=await fetch(f.shopUrl+'/webshop/orders',{method:'POST',headers:{'Content-Type':type,'Idempotency-Key':'valid'},body});assert.equal(r.status,expected);await r.text();
  }
});
test('event source is authenticated, unknown schema rejected, duplicate identity protected',async t=>{
  const f=await fixture(t),e=event();
  assert.equal((await post(f.ctUrl+'/control-tower/events',e)).status,401);
  assert.equal((await post(f.ctUrl+'/control-tower/events',{...e,source:'dhl'},{'X-Service-Key':serviceKey})).status,422);
  assert.equal((await post(f.ctUrl+'/control-tower/events',{...e,address:'private'},{'X-Service-Key':serviceKey})).status,422);
  assert.equal((await post(f.ctUrl+'/control-tower/events',e,{'X-Service-Key':serviceKey})).status,201);
  assert.equal((await post(f.ctUrl+'/control-tower/events',e,{'X-Service-Key':serviceKey})).body.duplicate,true);
  const changed=structuredClone(e);changed.data.lines[0].quantity=11;
  assert.equal((await post(f.ctUrl+'/control-tower/events',changed,{'X-Service-Key':serviceKey})).status,409);
  assert.equal((await post(f.ctUrl+'/control-tower/events',{...e,eventId:randomUUID()},{'X-Service-Key':serviceKey})).status,409);
  assert.equal((await f.orders()).orders.length,1);
});
test('unavailable Control Tower leaves pending data; actual HTTP retry delivers once',async t=>{
  let offline=true;
  const f=await fixture(t,{fetchImpl:(...args)=>{if(offline)throw new Error('offline');return fetch(...args);}});
  const r=await f.accept();assert.equal(r.status,201);assert.equal(r.body.synchronization,'pending');assert.equal((await f.orders()).orders.length,0);
  offline=false;await f.shop.flush();assert.equal(f.shop.result(r.body.orderId).synchronization,'delivered');assert.equal((await f.orders()).orders.length,1);
});
test('lost acknowledgment retries the already stored event without a second timeline item',async t=>{
  let lose=true;
  const f=await fixture(t,{fetchImpl:async(...args)=>{const response=await fetch(...args);if(lose){lose=false;await response.text();throw new Error('lost acknowledgment');}return response;}});
  const r=await f.accept();assert.equal(r.body.synchronization,'pending');assert.equal((await f.orders()).orders.length,1);
  await f.shop.flush();assert.equal(f.shop.result(r.body.orderId).synchronization,'delivered');assert.equal((await f.orders()).orders.length,1);
});
test('incorrect receipt never marks an outgoing event delivered',async t=>{
  const f=await fixture(t,{fetchImpl:async()=>new Response(JSON.stringify({eventId:randomUUID(),orderId:randomUUID(),duplicate:false}),{status:201})});
  const r=await f.accept();assert.equal(r.body.synchronization,'pending');assert.match(f.shop.db.prepare('SELECT last_error FROM outbox').get().last_error,/acknowledgment/);
});
test('order and outbox transaction rolls back together on storage failure',async t=>{
  const f=await fixture(t);f.shop.db.exec("CREATE TRIGGER fail_outbox BEFORE INSERT ON outbox BEGIN SELECT RAISE(ABORT,'injected storage failure'); END;");
  assert.equal((await f.accept()).status,503);assert.equal(f.shop.db.prepare('SELECT COUNT(*) n FROM orders').get().n,0);assert.equal((await f.orders()).orders.length,0);
});
test('received event and projection transaction rolls back together on storage failure',async t=>{
  const f=await fixture(t);f.ct.db.exec("CREATE TRIGGER fail_view BEFORE INSERT ON order_views BEGIN SELECT RAISE(ABORT,'injected storage failure'); END;");
  assert.equal((await post(f.ctUrl+'/control-tower/events',event(),{'X-Service-Key':serviceKey})).status,503);
  assert.equal(f.ct.db.prepare('SELECT COUNT(*) n FROM received_events').get().n,0);
});
test('restart preserves pending outbox, order and received projection with unchanged IDs',async t=>{
  const f=await fixture(t,{fetchImpl:async()=>{throw new Error('offline');}}),key=randomUUID();
  const first=await f.accept(request(),key);await f.dispose();
  const ct=createControlTower({database:join(f.dir,'ct.sqlite'),serviceKey}),ctUrl=await listen(ct.server);
  const shop=createWebshop({database:join(f.dir,'web.sqlite'),serviceKey,controlTowerUrl:ctUrl});
  try{await shop.flush();assert.equal(shop.result(first.body.orderId).synchronization,'delivered');assert.equal(shop.accept(request(),key).orderId,first.body.orderId);
    const received=await (await fetch(ctUrl+'/control-tower/orders')).json();assert.equal(received.orders.length,1);assert.equal(received.orders[0].orderId,first.body.orderId);
  }finally{await close(ct.server);shop.db.close();ct.db.close();}
  const reopened=createControlTower({database:join(f.dir,'ct.sqlite'),serviceKey});
  assert.equal(reopened.db.prepare('SELECT COUNT(*) n FROM order_views').get().n,1);reopened.db.close();
});
test('both demo pages are served and API unknown routes are explicit',async t=>{
  const f=await fixture(t);const web=await (await fetch(f.shopUrl)).text(),ct=await (await fetch(f.ctUrl)).text();
  assert.match(web,/vaste teststub/);assert.match(web,/Idempotency-Key/);assert.match(ct,/Nog onbekend/);assert.match(ct,/textContent/);
  assert.equal((await fetch(f.ctUrl+'/not-found')).status,404);assert.equal((await fetch(f.shopUrl+'/webshop/orders/'+randomUUID())).status,404);
});
