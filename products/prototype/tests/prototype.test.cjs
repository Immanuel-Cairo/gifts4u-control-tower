/* Business-rule tests against the actual prototype script, without a browser.
 * The small DOM adapter captures rendered HTML and dispatched form handlers.
 * Native form validation, visual layout and accessibility require browser QA.
 */
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const vm = require("node:vm");

function demo(savedState) {
  const elements = new Map();
  const handlers = {};
  const stored = new Map(savedState ? [["gifts4u-prototype-v1", JSON.stringify(savedState)]] : []);
  function element(selector) {
    if (!elements.has(selector))
      elements.set(selector, {
        innerHTML: "",
        textContent: "",
        value: "",
        open: false,
        showModal() {
          this.open = true;
        },
        close() {
          this.open = false;
        },
        insertAdjacentHTML(_position, html) {
          this.innerHTML += html;
        },
        addEventListener() {},
        classList: { add() {}, remove() {} },
      });
    return elements.get(selector);
  }
  class Form {
    constructor(id, data, record) {
      this.id = id;
      this.data = data;
      this.dataset = { id: record };
    }
    reportValidity() {
      return true;
    }
  }
  const context = vm.createContext({
    console,
    Intl,
    Date,
    Math,
    JSON,
    Number,
    String,
    Array,
    Set,
    Map,
    Boolean,
    crypto: require("node:crypto").webcrypto,
    setTimeout: () => 0,
    clearTimeout() {},
    localStorage: {
      getItem: (key) => stored.get(key) || null,
      setItem: (key, value) => stored.set(key, value),
    },
    document: {
      querySelector: element,
      querySelectorAll: () => [],
      addEventListener: (type, fn) => {
        handlers[type] = fn;
      },
    },
    location: { hash: "" },
    window: { addEventListener() {} },
    HTMLFormElement: Form,
    FormData: class {
      constructor(form) {
        return Object.entries(form.data);
      }
    },
  });
  vm.runInContext(
    readFileSync(join(__dirname, "..", "app.js"), "utf8"),
    context,
  );
  return {
    run: (code) => vm.runInContext(code, context),
    html: (selector) => element(selector).innerHTML,
    text: (selector) => element(selector).textContent,
    click(action, id) {
      handlers.click({ target: { closest: () => ({ dataset: { action, id } }) } });
    },
    submit(id, data, record) {
      handlers.submit({
        target: new Form(id, data, record),
        preventDefault() {},
      });
    },
  };
}

test("50 unique demo orders, valid inventory and evidence for delivered orders", () => {
  const d = demo();
  assert.equal(d.run("state.orders.length"), 50);
  assert.equal(d.run("new Set(state.orders.map(o => o.id)).size"), 50);
  assert.equal(
    d.run(
      "state.inventory.every(i => inventoryFor(i.sku).available >= 0 && inventoryFor(i.sku).reserved <= i.physical)",
    ),
    true,
  );
  assert.equal(
    d.run(
      "state.orders.filter(o => o.stage === 6).every(o => o.events.at(-1).proof)",
    ),
    true,
  );
  assert.equal(
    d.run("state.orders.filter(o => orderExceptions(o).length).length"),
    8,
  );
});

test("strict overrun boundary handles 20%, 21%, 40% and unknown ETA", () => {
  const d = demo();
  assert.equal(d.run("exceedsThreshold(500,600)"), false);
  assert.equal(d.run("exceedsThreshold(500,605)"), true);
  assert.equal(d.run("exceedsThreshold(500,700)"), true);
  assert.equal(d.run("exceedsThreshold(0,100)"), false);
  assert.equal(
    d.run(
      'hasOverrun({created:"2026-11-11",promised:"2026-11-16",eta:"2026-11-17"})',
    ),
    false,
  );
  assert.equal(
    d.run('hasOverrun({created:"2026-11-11",promised:"2026-11-16",eta:null})'),
    false,
  );
  d.submit("threshold-form", { planned: "5", expected: "6.05" });
  assert.match(d.text("#threshold-result"), /21%.*Wel een/);
});

test("all navigation views render and search, filters, pagination and empty states work", () => {
  const d = demo();
  d.run("for (const [id] of nav) { view=id; render(); }");
  assert.match(d.html("#main"), /Elke stap is terug/);
  assert.equal(
    d.run('view="orders";query="studio noord";filteredOrders().length'),
    5,
  );
  assert.equal(d.run('query="";filter="risico";filteredOrders().length'), 8);
  d.run('query="niet-bestaand";page=9;render()');
  assert.match(d.html("#main"), /Geen orders gevonden/);
  assert.equal(d.run("page"), 1);
});

test("single operator records an authorized decision without changing order facts", () => {
  const d = demo();
  const before = d.run("JSON.stringify(state.orders)");
  d.run('showScenario("EX-001");scenario="wait";showScenario("EX-001",true)');
  assert.equal(d.run("JSON.stringify(state.orders)"), before);
  d.submit(
    "decision-form",
    {
      owner: "Milan",
      deadline: "2026-11-16T15:00",
      reason: "Extra capaciteit afstemmen",
    },
    "EX-001",
  );
  assert.equal(d.run("state.decisions.length"), 0);

  d.submit(
    "decision-form",
    {
      owner: "Milan",
      decidedBy: "Sophie / eigenaar",
      authorized: "on",
      deadline: "2026-11-16T15:00",
      reason: "Extra capaciteit afstemmen",
    },
    "EX-001",
  );
  assert.equal(d.run("state.decisions.length"), 1);
  assert.equal(d.run("state.exceptions[0].state"), "In behandeling");
  assert.equal(d.run("JSON.stringify(state.orders)"), before);
});

test("an unavailable stock balance prevents double allocation in the local demo", () => {
  const d = demo();
  d.click("toggle-partner-demo");
  d.run(
    'state.orders.forEach(o=>o.reserved=false); state.inventory[0].physical=100; state.orders[0].stage=0;state.orders[0].sku="MUG-WHT";state.orders[0].quantity=100;state.orders[0].events=state.orders[0].events.slice(0,1); state.orders[1].quantity=100; advance("G4U-1048");advance("G4U-1047")',
  );
  assert.equal(d.run("state.orders[0].stage"), 1);
  assert.equal(d.run("state.orders[1].stage"), 0);
  assert.equal(d.run('inventoryFor("MUG-WHT").available'), 0);
  assert.equal(d.run('state.exceptions.some(e=>e.kind==="stock")'), true);
});

test("receiving an import batch adds actual quantity only once", () => {
  const d = demo();
  d.click("toggle-partner-demo");
  const before = d.run("state.inventory[0].physical");
  d.submit("receive-form", { quantity: "580" }, "HK-2026-081");
  d.submit("receive-form", { quantity: "580" }, "HK-2026-081");
  assert.equal(d.run("state.inventory[0].physical"), before + 580);
  assert.match(d.run("state.audit[0].text"), /verschil 20/);
});

test("duplicate events are idempotent, offline Printz cannot confirm new status", () => {
  const d = demo();
  d.click("toggle-partner-demo");
  const count = d.run("state.orders[0].events.length");
  assert.equal(d.run("addEvent(state.orders[0],state.orders[0].stage)"), false);
  assert.equal(d.run("state.orders[0].events.length"), count);
  d.run("state.offline=true");
  d.submit("qc-form", { design: "on", quantity: "on" }, "G4U-1048");
  assert.equal(d.run("state.orders[0].stage"), 3);
  d.submit(
    "eta-form",
    { eta: "2026-11-17", source: "Printz", reason: "Test" },
    "G4U-1048",
  );
  assert.equal(d.run("state.orders[0].eta"), "2026-11-18");
});

test("quality, shipment proof and ETA changes are tracked independently", () => {
  const d = demo();
  d.click("toggle-partner-demo");
  d.submit("qc-form", { design: "on", quantity: "on" }, "G4U-1048");
  assert.equal(d.run("state.orders[0].qc"), true);
  assert.equal(d.run("state.orders[0].stage"), 4);
  d.submit(
    "shipping-form",
    { postal: "1234 AB", number: "10", eventTime: "2026-11-16T12:00" },
    "G4U-1048",
  );
  assert.equal(d.run("state.orders[0].stage"), 5);
  d.submit(
    "shipping-form",
    {
      postal: "1234 AB",
      number: "10",
      eventTime: "2026-11-17T12:00",
      proof: "POD-TEST",
    },
    "G4U-1048",
  );
  assert.equal(d.run("state.orders[0].stage"), 6);
  assert.equal(d.run("state.orders[0].events.at(-1).proof"), "POD-TEST");
  d.submit(
    "eta-form",
    { eta: "2026-11-17", source: "DHL", reason: "Nieuwe verwachting" },
    "G4U-1048",
  );
  assert.equal(d.run("state.orders[0].promised"), "2026-11-16");
  assert.equal(d.run("state.orders[0].stage"), 6);
});

test("communication and complaint are logged without status mutation", () => {
  const d = demo();
  d.submit(
    "message-form",
    {
      recipient: "demo@example.test",
      channel: "E-mail",
      owner: "Sophie",
      body: "Verwachte levering nog onbekend.",
    },
    "G4U-1048",
  );
  d.submit(
    "problem-form",
    {
      kind: "photo",
      cause: "Verkeerd ontwerp",
      owner: "Sophie",
      next: "Herdruk voorbereiden",
    },
    "G4U-1048",
  );
  assert.equal(d.run("state.messages[0].status"), "Gesimuleerd verzonden");
  assert.equal(d.run("state.messages[0].event"), "EV-G4U-1048-3");
  assert.equal(d.run("state.orders[0].stage"), 3);
  assert.equal(d.run("state.exceptions.at(-1).next"), "Herdruk voorbereiden");
  assert.equal(d.run("state.audit.length"), 3);
});

test("new order rejects insufficient stock and escapes rendered user content", () => {
  const d = demo();
  d.click("toggle-partner-demo");
  const fields = {
    customer: "<img src=x onerror=alert(1)>",
    type: "B2B",
    sku: "MUG-WHT",
    quantity: "10000",
    promised: "2026-11-20",
    design: "v1",
    street: "Demo",
    number: "12",
    postal: "1234 AB",
    city: "Utrecht",
  };
  d.submit("order-form", fields);
  assert.equal(d.run("state.orders.length"), 50);
  assert.match(d.text("#order-error"), /Onvoldoende voorraad/);
  d.submit("order-form", { ...fields, quantity: "1" });
  assert.equal(d.run("state.orders.length"), 51);
  assert.match(
    d.html("#detail-content"),
    /&lt;img src=x onerror=alert\(1\)&gt;/,
  );
  assert.doesNotMatch(d.html("#detail-content"), /<img src=x/);
  assert.equal(d.run("state.orders[0].reserved"), false);
});

test("one operator sees order context without a role switch", () => {
  const d = demo();
  d.run('showSettings();showOrder("G4U-1048")');
  assert.doesNotMatch(d.html("#action-content"), /role-select|Bekijk als directeur/);
  assert.match(d.html("#action-content"), /Control Tower-beheerder/);
  assert.match(d.html("#detail-content"), /ONT-1048/);
  assert.match(d.html("#detail-content"), /Voorbeeldstraat/);
  assert.doesNotMatch(d.html("#detail-content"), /data-action="advance"/);
  d.run('showScenario("EX-001")');
  assert.match(d.html("#action-content"), /id="decision-form"/);
});

test("legacy role migration preserves orders and historical actors", () => {
  const old = demo().run('JSON.parse(JSON.stringify(state))');
  old.role = "DHL";
  old.orders[0].customer = "Bewaarde klant";
  old.audit[0].actor = "Historische directeur";
  const d = demo(old);
  assert.equal(d.run('Object.hasOwn(state,"role")'), false);
  assert.equal(d.run('state.orders[0].customer'), "Bewaarde klant");
  assert.equal(d.run('state.audit[0].actor'), "Historische directeur");
  d.run('audit("Test", "Printz", "G4U-1048");save();state=loadState()');
  assert.equal(d.run('state.audit[0].actor'), "Sophie · Control Tower-beheerder");
  assert.equal(d.run('state.audit[0].source'), "Printz");
});

test("partner inputs require explicit demo mode and keep the same operator", () => {
  const d = demo();
  const before = d.run('JSON.stringify(state)');
  d.click("receive", "HK-2026-081");
  d.submit("receive-form", { quantity: "580" }, "HK-2026-081");
  d.run('advance("G4U-1047")');
  assert.equal(d.run('JSON.stringify(state)'), before);
  assert.doesNotMatch(d.html("#main"), /data-action="new-order"/);
  d.click("toggle-partner-demo");
  assert.match(d.html("#main"), /Partnerdemo actief/);
  d.submit("receive-form", { quantity: "580" }, "HK-2026-081");
  assert.equal(d.run('state.imports[0].received'), true);
  assert.equal(d.run('state.audit[0].actor'), "Sophie · Control Tower-beheerder");
  assert.equal(d.run('state.audit[0].simulated'), true);
  d.click("toggle-partner-demo");
  assert.doesNotMatch(d.html("#main"), /Partnerdemo actief/);
  const reopened = demo(d.run('JSON.parse(JSON.stringify(state))'));
  assert.equal(reopened.run('partnerDemo'), false);
  assert.equal(reopened.run('state.imports[0].received'), true);
});

test("closing an exception preserves order facts and state survives reload", () => {
  const d = demo();
  const before = d.run("JSON.stringify(state.orders)");
  d.submit(
    "resolve-form",
    { proof: "Printz bevestigt herstel voor alle betrokken orders" },
    "EX-001",
  );
  assert.equal(d.run("activeExceptions().length"), 2);
  assert.equal(d.run("JSON.stringify(state.orders)"), before);
  assert.equal(
    d.run("state=loadState();state.exceptions[0].state"),
    "Opgelost",
  );
  assert.match(d.run("state.audit[0].text"), /Printz bevestigt herstel/);
});
