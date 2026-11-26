import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import {server,json,html,body,requireKey,notFound} from './http.mjs';
import {orderEvent,canonical,HttpError} from './validation.mjs';
export function createControlTower({database=':memory:',serviceKey,clock=()=>new Date().toISOString()}={}){
  if(typeof serviceKey!=='string'||serviceKey.length<24)throw new Error('A service key of at least 24 characters is required.');
  const db=new DatabaseSync(database,{timeout:5000});
  db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;
    CREATE TABLE IF NOT EXISTS received_events (source TEXT NOT NULL,event_id TEXT NOT NULL,order_id TEXT NOT NULL UNIQUE,payload TEXT NOT NULL,received_at TEXT NOT NULL,PRIMARY KEY(source,event_id));
    CREATE TABLE IF NOT EXISTS order_views (order_id TEXT PRIMARY KEY,view_json TEXT NOT NULL);`);
  function receive(input){
    const e=orderEvent(input), payload=canonical(e);
    db.exec('BEGIN IMMEDIATE');
    try{
      const existing=db.prepare('SELECT payload FROM received_events WHERE source=? AND event_id=?').get(e.source,e.eventId);
      if(existing){
        if(existing.payload!==payload)throw new HttpError(409,'EVENT_CONFLICT','Deze event-ID heeft al andere inhoud.');
        db.exec('COMMIT');return {eventId:e.eventId,orderId:e.orderId,duplicate:true};
      }
      if(db.prepare('SELECT order_id FROM order_views WHERE order_id=?').get(e.orderId))throw new HttpError(409,'ORDER_CONFLICT','Deze order heeft al een ander initialisatie-event.');
      const receivedAt=clock();
      const view={orderId:e.orderId,status:'Order Received',source:e.source,occurredAt:e.occurredAt,receivedAt,data:e.data,eta:null,exceptions:[]};
      db.prepare('INSERT INTO received_events VALUES (?,?,?,?,?)').run(e.source,e.eventId,e.orderId,payload,receivedAt);
      db.prepare('INSERT INTO order_views VALUES (?,?)').run(e.orderId,JSON.stringify(view));
      db.exec('COMMIT');return {eventId:e.eventId,orderId:e.orderId,duplicate:false};
    }catch(e){db.exec('ROLLBACK');throw e;}
  }
  const s=server(async(req,res,url)=>{
    if(req.method==='GET'&&url.pathname==='/')return html(res,readFileSync(new URL('../public/control-tower.html',import.meta.url),'utf8'));
    if(req.method==='GET'&&url.pathname==='/health')return json(res,200,{status:'ok',service:'control-tower',mode:'local-poc'});
    if(req.method==='GET'&&url.pathname==='/control-tower/orders')return json(res,200,{orders:db.prepare('SELECT view_json FROM order_views ORDER BY rowid DESC').all().map(r=>JSON.parse(r.view_json))});
    if(req.method==='POST'&&url.pathname==='/control-tower/events'){
      requireKey(req,serviceKey);const result=receive(await body(req));return json(res,result.duplicate?200:201,result);
    }
    notFound();
  });
  return {server:s,db,receive};
}
