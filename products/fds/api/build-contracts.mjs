import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const dir=path.dirname(fileURLToPath(import.meta.url));
const ref=name=>({$ref:`./schemas.json#/${name}`});
const str=(description,extra={})=>({type:'string',minLength:1,description,...extra});
const uuid={type:'string',format:'uuid'}, time={type:'string',format:'date-time'}, date={type:'string',format:'date'};
const integer={type:'integer',minimum:1,maximum:1000000};
const obj=(properties,required=Object.keys(properties),extra={})=>({type:'object',additionalProperties:false,properties,required,...extra});
const arr=(items)=>({type:'array',items,minItems:1,maxItems:100});
const enumeration=(...values)=>({type:'string',enum:values});
const sources=['webshop','import','warehouse','printz','dhl','control-tower'];
const schemas={
 StockQuery:obj({sku:str('SKU uit het pad')}),
 DeliveryQuery:obj({orderId:uuid}),
 ImpactQuery:obj({lotId:uuid}),
 ActionQuery:obj({owner:enumeration('warehouse','printz','dhl')}),
 Error:obj({error:obj({code:str('Machineleesbare foutcode'),message:str('Veilige uitleg zonder stacktrace')})}),
 Address:obj({street:str('Straat',{maxLength:120}),houseNumber:str('Huisnummer en toevoeging',{maxLength:20}),postalCode:str('Postcode',{maxLength:20}),city:str('Plaats',{maxLength:100}),countryCode:{type:'string',pattern:'^[A-Z]{2}$'}}),
 OrderLine:obj({sku:str('Catalogus-SKU',{maxLength:64}),quantity:integer}),
 OrderRequest:obj({customerType:enumeration('B2B','B2C'),lines:arr(ref('OrderLine')),designVersion:str('Goedgekeurde ontwerpverwijzing; geen bestand',{maxLength:100}),deliveryAddress:ref('Address'),promisedDeliveryDate:date}),
 OrderData:obj({customerType:enumeration('B2B','B2C'),lines:arr(ref('OrderLine')),designVersion:str('Ontwerpversie; geen toegangstoken',{maxLength:100}),promisedDeliveryDate:date}),
 OrderReceived:obj({eventId:uuid,type:enumeration('order.received'),source:enumeration('webshop'),occurredAt:time,orderId:uuid,data:ref('OrderData')}),
 EventReceipt:obj({eventId:uuid,orderId:uuid,duplicate:{type:'boolean'}}),
 OrderResult:obj({orderId:uuid,eventId:uuid,status:enumeration('Order Received'),synchronization:enumeration('pending','delivered'),inventoryMode:enumeration('stub'),duplicate:{type:'boolean'}}),
 OrderView:obj({orderId:uuid,status:enumeration('Order Received'),source:enumeration('webshop'),occurredAt:time,receivedAt:time,data:ref('OrderData'),eta:{type:'string',format:'date-time',nullable:true},exceptions:{type:'array',items:ref('Exception')}}),
 Stock:obj({sku:str('SKU'),physical:{type:'integer',minimum:0},reserved:{type:'integer',minimum:0},available:{type:'integer',minimum:0},observedAt:time}),
 Reservation:obj({reservationId:uuid,orderId:uuid,lines:arr(ref('OrderLine'))}),
 ReservationResult:obj({reservationId:uuid,state:enumeration('reserved'),lines:arr(ref('OrderLine'))}),
 ImportShipment:obj({lotId:uuid,supplier:str('Leverancier'),shipmentReference:str('Externe referentie'),lines:arr(ref('OrderLine')),eta:{...time,nullable:true}}),
 ImportProgress:obj({eventId:uuid,occurredAt:time,source:enumeration('import'),milestone:str('Bevestigde transportgebeurtenis'),eta:{...time,nullable:true}},['eventId','occurredAt','source','milestone']),
 Receipt:obj({receiptId:uuid,lotId:uuid,sku:str('SKU'),actualQuantity:integer,occurredAt:time,source:enumeration('import')}),
 ReceiptResult:obj({receiptId:uuid,duplicate:{type:'boolean'},stock:ref('Stock')}),
 Handover:obj({eventId:uuid,orderId:uuid,reservationId:uuid,lines:arr(ref('OrderLine')),occurredAt:time}),
 BatchChange:obj({sku:str('SKU'),plannedQuantity:integer,reason:str('Reden voor aanpassing'),actorId:str('Bevoegde gebruiker')}),
 PrintJob:obj({jobId:uuid,orderId:uuid,lineNo:integer,sku:str('SKU'),quantity:integer,designVersion:str('Goedgekeurde versie')}),
 PrintProgress:obj({eventId:uuid,type:enumeration('printing.started','ready-to-ship'),occurredAt:time,qualityCheckId:uuid},['eventId','type','occurredAt']),
 QualityCheck:obj({qualityCheckId:uuid,designVersion:str('Gecontroleerde versie'),quantity:integer,passed:{type:'boolean'},checkedAt:time,actorId:str('Controleur')}),
 ShipmentRequest:obj({shipmentId:uuid,orderId:uuid,jobId:uuid,quantity:integer,readyEventId:uuid}),
 Shipment:obj({shipmentId:uuid,orderId:uuid,status:enumeration('Ready to Ship','In Transit','Delivered'),eta:{...time,nullable:true},destination:ref('Address')}),
 TransportProof:obj({proofId:uuid,shipmentId:uuid,kind:enumeration('pickup','delivery'),evidenceRef:str('Beperkt toegankelijke bewijsverwijzing'),occurredAt:time}),
 TransportEvent:{oneOf:['Pickup','Delivery','EtaUpdate','TransportException'].map(ref)},
 Pickup:obj({eventId:uuid,type:enumeration('pickup.confirmed'),source:enumeration('dhl'),occurredAt:time,proof:ref('TransportProof')}),
 Delivery:obj({eventId:uuid,type:enumeration('delivery.confirmed'),source:enumeration('dhl'),occurredAt:time,proof:ref('TransportProof')}),
 EtaUpdate:obj({eventId:uuid,type:enumeration('eta.updated'),source:enumeration('dhl'),occurredAt:time,eta:{...time,nullable:true},reason:str('Reden')}),
 TransportException:obj({eventId:uuid,type:enumeration('exception.raised'),source:enumeration('dhl'),occurredAt:time,exception:ref('Exception')}),
 Capacity:obj({date,planned:{type:'integer',minimum:0},available:{type:'integer',minimum:0},shortage:{type:'integer',minimum:0}}),
 Exception:obj({exceptionId:uuid,cause:str('Oorzaak'),owner:str('Eigenaar'),nextAction:str('Volgende actie'),urgency:enumeration('low','medium','high'),affectedOrderIds:{type:'array',items:uuid},state:enumeration('open','resolved')}),
 Decision:obj({decisionId:uuid,exceptionId:uuid,expectedVersion:{type:'integer',minimum:0},decidedBy:str('Bevoegde beslisser'),rationale:str('Onderbouwing'),action:str('Vervolgactie'),owner:str('Verantwoordelijke'),dueAt:time}),
 Action:obj({actionId:uuid,decisionId:uuid,owner:str('Eigenaar'),action:str('Actie'),dueAt:time,state:enumeration('assigned','confirmed','completed')}),
 Impact:obj({lotId:uuid,orders:{type:'array',items:obj({orderId:uuid,impact:str('Mogelijke impact; geen bevestigde leverdatum')})}}),
 CustomerUpdate:obj({messageId:uuid,orderId:uuid,eventId:uuid,channel:enumeration('email','phone','dashboard'),recipientRef:str('Beperkt toegankelijke ontvangerreferentie'),message:str('Feitelijke tekst'),simulated:{type:'boolean'}}),
 Complaint:obj({complaintId:uuid,orderId:uuid,cause:str('Klacht'),followUp:enumeration('return','reprint','replacement','pending')}),
 Ack:obj({id:str('Geaccepteerde resource/event-ID'),duplicate:{type:'boolean'}})
};
// Schema variants keep ETA, confirmed status and exceptions separate.
schemas.PartnerEvent={oneOf:['LotEvent','StockEvent','StatusEvent','ExceptionEvent','EtaEvent','CommunicationEvent'].map(ref)};
const envelope=(type,data,aggregateType)=>obj({eventId:uuid,source:enumeration(...sources),type:enumeration(type),aggregateType:enumeration(aggregateType),aggregateId:str('Bronidentiteit van aggregate'),occurredAt:time,data});
schemas.LotEvent=envelope('import.progress',ref('ImportProgress'),'lot');
schemas.StockEvent=envelope('stock.snapshot',ref('Stock'),'stock');
schemas.StatusEvent=envelope('order.status.confirmed',obj({orderId:uuid,status:enumeration('Stock Received','Sent to Print','Printing','Ready to Ship','In Transit','Delivered'),proofRef:str('Verplicht voor DHL-statussen'),shipmentId:uuid},['orderId','status']),'order');
schemas.ExceptionEvent=envelope('exception.raised',ref('Exception'),'exception');
schemas.EtaEvent=envelope('eta.updated',obj({orderId:uuid,eta:{...time,nullable:true},reason:str('Reden')}),'order');
schemas.CommunicationEvent=envelope('communication.recorded',obj({messageId:uuid,orderId:uuid,state:enumeration('sent','simulated','failed'),occurredAt:time}),'order');
const json=(schema)=>({'application/json':{schema}});
const response=(schema,description='Succes')=>({description,content:json(schema)});
const errors=Object.fromEntries([400,401,403,404,409,413,415,422,503].map(code=>[code,response(ref('Error'),({400:'Ongeldige JSON of ontbrekende idempotentiesleutel',401:'Service-identiteit ontbreekt of is ongeldig',403:'Geen rechten',404:'Niet gevonden',409:'Conflict: sleutel, voorraad of statusovergang',413:'Bericht te groot',415:'Content-Type moet application/json zijn',422:'Inhoud voldoet niet aan contract',503:'Afhankelijkheid of opslag niet beschikbaar'})[code])]));
const key={in:'header',name:'Idempotency-Key',required:true,schema:{type:'string',minLength:1,maxLength:100,pattern:'^[A-Za-z0-9._:-]+$'},description:'Stabiele clientaanvraag-ID; dezelfde inhoud bij retries.'};
const doc=(title)=>({openapi:'3.0.3',info:{title:`GIFTS4U — ${title}`,version:'0.1.0',description:'Reviewbaar contractvoorstel bij #190/#180. Alleen x-implementation=poc is lokaal geïmplementeerd; andere routes zijn nog ontwerp. Geen externe servers worden verondersteld.'},paths:{},components:{securitySchemes:{ServiceKey:{type:'apiKey',in:'header',name:'X-Service-Key',description:'Alleen lokale PoC. Productie: brongebonden service-identiteit.'},BearerAuth:{type:'http',scheme:'bearer',description:'Voorgestelde productie-authenticatie; niet geïmplementeerd door de PoC.'}}},security:[{BearerAuth:[]}]});
function add(d,p,method,name,input,output,{poc=false,status=method==='post'?201:200,description='',idempotency=false,serviceKey=false,query=[]}={}){
 const parameters=[...p.matchAll(/\{(\w+)\}/g)].map(m=>({in:'path',name:m[1],required:true,schema:str('Resource-ID')}));
 parameters.push(...query);if(idempotency)parameters.push(key);
 const op={operationId:name,summary:name,description,parameters,'x-implementation':poc?'poc':'proposed',responses:{[status]:response(ref(output)),...errors}};
 if(method==='post')op.responses[200]=response(ref(output),'Bestaande registratie bij exacte retry');
 if(input)op.requestBody={required:true,content:json(ref(input))};
 if(poc)op.security=serviceKey?[{ServiceKey:[]}]:[];
 d.paths[p]??={};d.paths[p][method]=op;
}
const web=doc('Webshop / Orders');
add(web,'/webshop/orders','post','acceptOrder','OrderRequest','OrderResult',{poc:true,idempotency:true,description:'Lokale PoC: vaste voorraadstub, geen echte reservering of berekende leverbelofte. Order en outbox atomair; pending is geen bevestigde CT-ontvangst.'});
add(web,'/webshop/orders/{orderId}','get','readOrder',null,'OrderResult',{poc:true});
add(web,'/webshop/orders/{orderId}/delivery','get','readDeliveryAddress',null,'Address',{description:'Alleen bevoegde DHL-service; geen klantfoto of ontwerpbestand.'});
add(web,'/webshop/customer-updates','post','recordCustomerUpdate','CustomerUpdate','Ack',{description:'Simulated blijft herkenbaar; geen echt bericht zonder expliciete communicatieopdracht.'});
add(web,'/webshop/complaints','post','recordComplaint','Complaint','Ack');
const imp=doc('Import');
add(imp,'/import/shipments','post','registerImportShipment','ImportShipment','ImportShipment');
add(imp,'/import/shipments/{lotId}','get','readImportShipment',null,'ImportShipment');
add(imp,'/import/shipments/{lotId}/events','post','recordImportProgress','ImportProgress','Ack');
const wh=doc('Magazijn');
add(wh,'/warehouse/stock/{sku}','get','readStock',null,'Stock');
add(wh,'/warehouse/receipts','post','confirmReceipt','Receipt','ReceiptResult',{description:'receiptId dedupliceert; alleen werkelijke ontvangst verhoogt voorraad. lotId + sku verwijzen naar een partijregel.'});
add(wh,'/warehouse/reservations','post','reserveStock','Reservation','ReservationResult',{description:'Atomair over alle regels; geen overselling. Dubbele ID met gewijzigde inhoud geeft 409.'});
add(wh,'/warehouse/handovers','post','recordHandover','Handover','Ack');
add(wh,'/warehouse/batches','post','changeBatchPlan','BatchChange','Ack');
const prt=doc('Printz');
add(prt,'/printz/jobs','post','createPrintJob','PrintJob','PrintJob');
add(prt,'/printz/jobs/{jobId}/handover','post','confirmPrintHandover','Handover','Ack');
add(prt,'/printz/jobs/{jobId}/events','post','recordPrintProgress','PrintProgress','Ack',{description:'Ready to Ship vereist een geslaagde kwaliteitscontrole voor dezelfde opdracht/ontwerpversie.'});
add(prt,'/printz/jobs/{jobId}/quality-checks','post','recordQualityCheck','QualityCheck','Ack');
const dhl=doc('DHL');
add(dhl,'/dhl/shipments','post','createShipment','ShipmentRequest','Shipment');
add(dhl,'/dhl/shipments/{shipmentId}','get','readShipment',null,'Shipment');
add(dhl,'/dhl/shipments/{shipmentId}/events','post','recordTransportEvent','TransportEvent','Ack',{description:'Bewijs moet bestaan, bij path-shipmentId horen en overeenkomen met pickup/delivery; server controleert bevoegdheid en overgang Ready to Ship → In Transit → Delivered. ETA/exception verandert status niet. Conflicten geven 409.'});
add(dhl,'/dhl/capacity','get','readCapacity',null,'Capacity',{query:[{in:'query',name:'date',required:true,schema:date}]});
const ct=doc('Control Tower');
add(ct,'/control-tower/events','post','receiveOrderEvent','OrderReceived','EventReceipt',{poc:true,serviceKey:true,description:'Alleen order.received van webshop in deze PoC. Exacte duplicate: 200; nieuwe ontvangst: 201; gewijzigde inhoud of tweede init-event voor dezelfde order: 409. Extra velden zoals adressen worden afgewezen.'});
add(ct,'/control-tower/orders','get','listOrders',null,'OrderList',{poc:true});
schemas.OrderList=obj({orders:{type:'array',items:ref('OrderView')}});
add(ct,'/control-tower/partner-events','post','receivePartnerEvent','PartnerEvent','Ack',{description:'Voorstel: brongebonden authenticatie en bevoegdheid per eventtype. DHL-status vereist shipment-ID en gecontroleerd bewijs. Late events mogen actuele status niet ongemerkt terugzetten.'});
add(ct,'/control-tower/decisions','post','recordDecision','Decision','Ack',{description:'recordedBy komt uit de sessie; decidedBy is de bevoegde beslisser. expectedVersion voorkomt verloren updates.'});
schemas.ActionList=obj({actions:{type:'array',items:ref('Action')}});
add(ct,'/control-tower/actions','get','listAssignedActions',null,'ActionList',{query:[{in:'query',name:'owner',required:true,schema:enumeration(...sources)}]});
add(ct,'/control-tower/impact/{lotId}','get','readLotImpact',null,'Impact');
const docs={webshop:web,import:imp,warehouse:wh,printz:prt,dhl,'control-tower':ct};
for(const [name,d]of Object.entries(docs))fs.writeFileSync(path.join(dir,`${name}.openapi.json`),JSON.stringify(d,null,2)+'\n');
fs.writeFileSync(path.join(dir,'schemas.json'),JSON.stringify(schemas,null,2)+'\n');
const order={customerType:'B2B',lines:[{sku:'MUG-WHITE',quantity:10}],designVersion:'design-demo-v1',deliveryAddress:{street:'Demostraat',houseNumber:'10',postalCode:'1000AA',city:'Demostad',countryCode:'NL'},promisedDeliveryDate:'2099-12-01'};
fs.mkdirSync(path.join(dir,'examples'),{recursive:true});
fs.writeFileSync(path.join(dir,'examples/order-request.json'),JSON.stringify(order,null,2)+'\n');
fs.writeFileSync(path.join(dir,'examples/order-received.json'),JSON.stringify({eventId:'1da2c8ab-b12f-4ef9-9061-713da729eaf5',type:'order.received',source:'webshop',occurredAt:'2026-11-26T14:00:00Z',orderId:'f248ad63-a179-4075-9265-a0186b789a19',data:{customerType:order.customerType,lines:order.lines,designVersion:order.designVersion,promisedDeliveryDate:order.promisedDeliveryDate}},null,2)+'\n');
console.log(`Generated ${Object.keys(docs).length} OpenAPI documents and ${Object.keys(schemas).length} shared schemas.`);
