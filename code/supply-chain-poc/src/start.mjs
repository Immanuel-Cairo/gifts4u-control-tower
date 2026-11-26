import {mkdirSync,existsSync,readFileSync,writeFileSync} from 'node:fs';
import {randomBytes} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {createWebshop} from './webshop.mjs';
import {createControlTower} from './control-tower.mjs';
import {listen,close} from './http.mjs';
const data=fileURLToPath(new URL('../.data/',import.meta.url));mkdirSync(data,{recursive:true});
const keyFile=join(data,'service-key');
if(!existsSync(keyFile))writeFileSync(keyFile,randomBytes(32).toString('hex'),{mode:0o600,flag:'wx'});
const serviceKey=readFileSync(keyFile,'utf8').trim();
const ct=createControlTower({database:join(data,'control-tower.sqlite'),serviceKey});
const ctUrl=await listen(ct.server,4011);
const shop=createWebshop({database:join(data,'webshop.sqlite'),controlTowerUrl:ctUrl,serviceKey});
try{await listen(shop.server,4010);}catch(e){await close(ct.server);ct.db.close();shop.db.close();throw e;}
const timer=setInterval(()=>shop.flush().catch(()=>console.error('Outbox-opslag niet beschikbaar; pending berichten blijven bewaard.')),3000);
await shop.flush();
console.log('Webshop demo: http://127.0.0.1:4010');
console.log('Control Tower: http://127.0.0.1:4011');
console.log('Lokale PoC: vaste voorraadstub, geen echte partnerverbindingen of productie-uitrol.');
let stopping=false;
async function stop(){if(stopping)return;stopping=true;clearInterval(timer);await close(shop.server);await shop.flush();await close(ct.server);shop.db.close();ct.db.close();}
process.on('SIGINT',()=>stop().catch(()=>process.exitCode=1));
process.on('SIGTERM',()=>stop().catch(()=>process.exitCode=1));
