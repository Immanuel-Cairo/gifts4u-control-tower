export class HttpError extends Error {
  constructor(status, code, message) { super(message); this.status=status; this.code=code; }
}
export const fail=(message)=>{throw new HttpError(422,'VALIDATION',message);};
export function shape(value, keys, name) {
  if (!value || typeof value!=='object' || Array.isArray(value) || Object.keys(value).length!==keys.length || keys.some(k=>!Object.hasOwn(value,k))) fail(`${name}: ontbrekende of onbekende velden.`);
}
function text(value, name, max=100) {
  if(typeof value!=='string'||!value.trim()||value.length>max) fail(`${name}: geldige tekst vereist (maximaal ${max} tekens).`);
  return value.trim();
}
export function uuid(value,name) {
  if(typeof value!=='string'||!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value))fail(`${name}: UUID vereist.`);
  return value;
}
export function date(value) {
  if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value)||!Number.isFinite(Date.parse(value+'T00:00:00Z'))||new Date(value+'T00:00:00Z').toISOString().slice(0,10)!==value)fail('promisedDeliveryDate: geldige kalenderdatum vereist.');
  return value;
}
export function timestamp(value) {
  if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/.test(value)||!Number.isFinite(Date.parse(value)))fail('occurredAt: geldig tijdstip met tijdzone vereist.');
  date(value.slice(0,10));
  return value;
}
export function orderData(input) {
  shape(input,['customerType','lines','designVersion','promisedDeliveryDate'],'Ordergegevens');
  if(!['B2B','B2C'].includes(input.customerType))fail('customerType moet B2B of B2C zijn.');
  if(!Array.isArray(input.lines)||input.lines.length<1||input.lines.length>100)fail('Een order vereist 1–100 regels.');
  const seen=new Set();
  const lines=input.lines.map(line=>{
    shape(line,['sku','quantity'],'Orderregel');
    const sku=text(line.sku,'sku',64);
    if(seen.has(sku))fail('Voeg gelijke SKU’s samen in één orderregel.');
    seen.add(sku);
    if(!Number.isSafeInteger(line.quantity)||line.quantity<=0||line.quantity>1000000)fail('quantity moet een positief geheel aantal zijn (maximaal 1000000).');
    return {sku,quantity:line.quantity};
  });
  return {customerType:input.customerType,lines,designVersion:text(input.designVersion,'designVersion'),promisedDeliveryDate:date(input.promisedDeliveryDate)};
}
export function orderRequest(input) {
  shape(input,['customerType','lines','designVersion','promisedDeliveryDate','deliveryAddress'],'Bestelling');
  shape(input.deliveryAddress,['street','houseNumber','postalCode','city','countryCode'],'Afleveradres');
  const a=input.deliveryAddress;
  if(typeof a.countryCode!=='string'||!/^[A-Z]{2}$/.test(a.countryCode))fail('countryCode moet een landcode van twee hoofdletters zijn.');
  const data=orderData({customerType:input.customerType,lines:input.lines,designVersion:input.designVersion,promisedDeliveryDate:input.promisedDeliveryDate});
  return {...data,deliveryAddress:{street:text(a.street,'street',120),houseNumber:text(a.houseNumber,'houseNumber',20),postalCode:text(a.postalCode,'postalCode',20),city:text(a.city,'city',100),countryCode:a.countryCode}};
}
export function orderEvent(input) {
  shape(input,['eventId','type','source','occurredAt','orderId','data'],'Event');
  if(input.type!=='order.received'||input.source!=='webshop')fail('Deze PoC accepteert alleen order.received van webshop.');
  uuid(input.eventId,'eventId');uuid(input.orderId,'orderId');timestamp(input.occurredAt);orderData(input.data);
  // Keep the received facts immutable; normalisation must not hide a changed retry payload.
  return input;
}
export function idempotencyKey(value) {
  if(typeof value!=='string'||!/^[A-Za-z0-9._:-]{1,100}$/.test(value))throw new HttpError(400,'IDEMPOTENCY_KEY','Geef een stabiele Idempotency-Key op (1–100 letters, cijfers, punt, streep, dubbele punt).');
  return value;
}
export function canonical(value) {
  if(Array.isArray(value))return '['+value.map(canonical).join(',')+']';
  if(value&&typeof value==='object')return '{'+Object.keys(value).sort().map(k=>JSON.stringify(k)+':'+canonical(value[k])).join(',')+'}';
  return JSON.stringify(value);
}
