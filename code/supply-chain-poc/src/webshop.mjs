import {DatabaseSync} from 'node:sqlite';
import {randomUUID} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {server,json,html,body,notFound} from './http.mjs';
import {orderRequest,canonical,idempotencyKey,HttpError} from './validation.mjs';
export const demoInventory=sku=>({'MUG-WHITE':100,'TSHIRT-BLACK-M':200})[sku]??null;
export function createWebshop({database=':memory:',controlTowerUrl,serviceKey,inventory=demoInventory,fetchImpl=fetch,clock=()=>new Date().toISOString(),timeoutMs=2000}={}){
  const target=new URL(controlTowerUrl);
  if(target.protocol!=='http:'||target.hostname!=='127.0.0.1')throw new Error('The local PoC only connects to a loopback HTTP Control Tower.');
  if(typeof serviceKey!=='string'||serviceKey.length<24)throw new Error('A service key of at least 24 characters is required.');
  const db=new DatabaseSync(database,{timeout:5000});
  db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;
    CREATE TABLE IF NOT EXISTS orders (order_id TEXT PRIMARY KEY,request_id TEXT NOT NULL UNIQUE,request_json TEXT NOT NULL,event_id TEXT NOT NULL UNIQUE);
    CREATE TABLE IF NOT EXISTS outbox (event_id TEXT PRIMARY KEY,order_id TEXT NOT NULL REFERENCES orders(order_id),payload TEXT NOT NULL,state TEXT NOT NULL DEFAULT 'pending',attempts INTEGER NOT NULL DEFAULT 0,last_error TEXT);`);
  function result(orderId,duplicate=false){
    const row=db.prepare('SELECT o.order_id,o.event_id,b.state FROM orders o JOIN outbox b ON o.event_id=b.event_id WHERE o.order_id=?').get(orderId);
    if(!row)notFound();
    return {orderId:row.order_id,eventId:row.event_id,status:'Order Received',synchronization:row.state,inventoryMode:'stub',duplicate};
  }
  function accept(input,key){
    idempotencyKey(key);
    const order=orderRequest(input),encoded=canonical(order);
    db.exec('BEGIN IMMEDIATE');
    try{
      const previous=db.prepare('SELECT order_id,request_json FROM orders WHERE request_id=?').get(key);
      if(previous){
        if(previous.request_json!==encoded)throw new HttpError(409,'REQUEST_CONFLICT','Deze aanvraag-ID hoort bij een andere bestelling.');
        db.exec('COMMIT');return result(previous.order_id,true);
      }
      for(const line of order.lines){
        const available=inventory(line.sku);
        if(!Number.isSafeInteger(available)||available<0)throw new HttpError(503,'STOCK_UNKNOWN','Voorraad onbekend; geen leverbelofte bevestigd.');
        if(available<line.quantity)throw new HttpError(409,'STOCK_SHORTAGE','Onvoldoende testvoorraad voor '+line.sku+'.');
      }
      const orderId=randomUUID(),eventId=randomUUID();
      const {deliveryAddress,...data}=order;
      const event={eventId,type:'order.received',source:'webshop',occurredAt:clock(),orderId,data};
      db.prepare('INSERT INTO orders VALUES (?,?,?,?)').run(orderId,key,encoded,eventId);
      db.prepare('INSERT INTO outbox(event_id,order_id,payload) VALUES (?,?,?)').run(eventId,orderId,JSON.stringify(event));
      db.exec('COMMIT');return result(orderId);
    }catch(e){db.exec('ROLLBACK');throw e;}
  }
  let inFlight;
  async function deliver(){
    for(const item of db.prepare("SELECT * FROM outbox WHERE state='pending' ORDER BY rowid").all()){
      db.prepare('UPDATE outbox SET attempts=attempts+1 WHERE event_id=?').run(item.event_id);
      try{
        const response=await fetchImpl(new URL('/control-tower/events',target),{method:'POST',headers:{'Content-Type':'application/json','X-Service-Key':serviceKey},body:item.payload,signal:AbortSignal.timeout(timeoutMs),redirect:'error'});
        if(![200,201].includes(response.status))throw new Error('HTTP '+response.status);
        const receipt=await response.json();
        if(receipt.eventId!==item.event_id||receipt.orderId!==item.order_id||typeof receipt.duplicate!=='boolean')throw new Error('Invalid acknowledgment');
        db.prepare("UPDATE outbox SET state='delivered',last_error=NULL WHERE event_id=?").run(item.event_id);
      }catch(e){db.prepare('UPDATE outbox SET last_error=? WHERE event_id=?').run(e.name==='TimeoutError'?'timeout':String(e.message).slice(0,120),item.event_id);}
    }
  }
  function flush(){if(inFlight)return inFlight;inFlight=deliver().finally(()=>{inFlight=undefined;});return inFlight;}
  const s=server(async(req,res,url)=>{
    if(req.method==='GET'&&url.pathname==='/')return html(res,readFileSync(new URL('../public/webshop.html',import.meta.url),'utf8'));
    if(req.method==='GET'&&url.pathname==='/health')return json(res,200,{status:'ok',service:'webshop',inventoryMode:'stub',pending:db.prepare("SELECT COUNT(*) AS n FROM outbox WHERE state='pending'").get().n});
    if(req.method==='POST'&&url.pathname==='/webshop/orders'){
      const accepted=accept(await body(req),req.headers['idempotency-key']);
      await flush();return json(res,accepted.duplicate?200:201,result(accepted.orderId,accepted.duplicate));
    }
    const match=/^\/webshop\/orders\/([0-9a-f-]+)$/i.exec(url.pathname);
    if(req.method==='GET'&&match)return json(res,200,result(match[1]));
    notFound();
  });
  return {server:s,db,accept,flush,result};
}
