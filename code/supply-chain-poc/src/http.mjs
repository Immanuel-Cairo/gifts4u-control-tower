import {createServer} from 'node:http';
import {timingSafeEqual} from 'node:crypto';
import {HttpError} from './validation.mjs';
export const json=(res,status,body)=>{res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'});res.end(JSON.stringify(body));};
export async function body(req) {
  if(!/^application\/json(?:\s*;|$)/i.test(req.headers['content-type']??''))throw new HttpError(415,'CONTENT_TYPE','Gebruik application/json.');
  const raw=await new Promise((resolve,reject)=>{
    const chunks=[];let size=0,tooLarge=false;
    req.on('data',chunk=>{size+=chunk.length;if(size>65536){tooLarge=true;chunks.length=0;reject(new HttpError(413,'BODY_TOO_LARGE','Bericht is groter dan 64 KiB.'));}else if(!tooLarge)chunks.push(chunk);});
    req.on('end',()=>{if(!tooLarge)resolve(Buffer.concat(chunks).toString('utf8'));});
    req.on('error',reject);
  });
  try{return JSON.parse(raw);}catch{throw new HttpError(400,'INVALID_JSON','Ongeldige JSON.');}
}
export function requireKey(req,key){
  const supplied=req.headers['x-service-key'];
  if(typeof supplied!=='string'||Buffer.byteLength(supplied)!==Buffer.byteLength(key)||!timingSafeEqual(Buffer.from(supplied),Buffer.from(key)))throw new HttpError(401,'SERVICE_AUTH','Ongeldige service-identiteit.');
}
export function server(handler){
  const s=createServer(async(req,res)=>{
    try{await handler(req,res,new URL(req.url,'http://127.0.0.1'));}
    catch(e){if(!res.writableEnded)json(res,e instanceof HttpError?e.status:503,{error:{code:e instanceof HttpError?e.code:'UNAVAILABLE',message:e instanceof HttpError?e.message:'Verwerking tijdelijk niet beschikbaar; probeer later met dezelfde aanvraag-ID.'}});}
  });
  s.requestTimeout=10000;s.headersTimeout=10000;
  return s;
}
export const notFound=()=>{throw new HttpError(404,'NOT_FOUND','Niet gevonden.');};
export function html(res,content){res.writeHead(200,{'content-type':'text/html; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff','content-security-policy':"default-src 'self'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'"});res.end(content);}
export function listen(s,port=0){return new Promise((resolve,reject)=>{s.once('error',reject);s.listen(port,'127.0.0.1',()=>{s.off('error',reject);resolve(`http://127.0.0.1:${s.address().port}`);});});}
export function close(s){return new Promise((resolve,reject)=>{s.close(e=>e?reject(e):resolve());s.closeAllConnections();});}
