"use strict";

// No network requests: this product deliberately uses a reproducible local demo.
const STORAGE_KEY = "gifts4u-prototype-v1";
const DEMO_DATE = "2026-11-16";
const OPERATOR = "Sophie · Control Tower-beheerder";
// Demo input for external sources is opt-in per page session, never a user role.
let partnerDemo = false;
const partnerActions = new Set([
  "new-order", "advance", "receive", "new-import", "capacity", "report-print", "duplicate", "delay-import",
]);
const partnerForms = new Set([
  "order-form", "qc-form", "shipping-form", "receive-form", "import-form", "capacity-form", "fault-form", "delay-form",
]);
const icons = {
  grid: "M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z",
  box: "m3 7 9-5 9 5v10l-9 5-9-5z M3 7l9 5 9-5 M12 12v10 M8 4l9 5",
  alert: "m12 3 10 18H2z M12 9v5 M12 17v.2",
  globe:
    "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0 M3 12h18 M12 3c-5 6-5 12 0 18 M12 3c5 6 5 12 0 18",
  warehouse: "m3 10 9-7 9 7v11H3z M8 21V11h8v10 M8 15h8 M8 18h8",
  print: "M6 9V3h12v6 M6 17H3V9h18v8h-3 M6 14h12v7H6z M17 12h1",
  truck:
    "M2 5h12v12H2z M14 10h4l4 4v3h-8 M8 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0 M20 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0",
  message: "M21 4H3v14h4v4l5-4h9z M7 9h10 M7 13h6",
  history: "M3 10a9 9 0 1 1 1 8 M3 4v6h6 M12 7v5l4 2",
  help: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0 M9 9a3 3 0 1 1 4 3c-1 0-1 1-1 2 M12 17v.2",
  search: "M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0 M15 15l6 6",
  bell: "M6 9a6 6 0 0 1 12 0c0 8 3 8 3 9H3c0-1 3-1 3-9 M10 21h4",
  arrow: "M4 12h16 M14 6l6 6-6 6",
  plus: "M12 5v14 M5 12h14",
  close: "m6 6 12 12 M6 18 18 6",
  check: "m5 12 4 4L19 6",
  clock: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0 M12 6v6l4 3",
  spark: "m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3z",
  download: "M12 3v12 M7 10l5 5 5-5 M4 16v5h16v-5",
  shield: "m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6z M8 12l3 3 5-6",
};
const icon = (name) =>
  `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${icons[name] || icons.box}"/></svg>`;
const escapeHTML = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const fmt = (value) => new Intl.NumberFormat("nl-NL").format(value);
const date = (value) =>
  value
    ? new Intl.DateTimeFormat("nl-NL", {
        day: "numeric",
        month: "short",
        timeZone: "Europe/Amsterdam",
      }).format(new Date(value + "T12:00:00Z"))
    : "Nog onbekend";
const timestamp = (value) =>
  new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Amsterdam",
  }).format(new Date(value));
const now = () => new Date().toISOString();
const uid = () =>
  globalThis.crypto?.randomUUID?.() ||
  `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const stages = [
  "Ontvangen",
  "Gereserveerd",
  "Naar Printz",
  "In bedrukking",
  "Verzendklaar",
  "Onderweg",
  "Afgeleverd",
];
const sources = [
  "Webshop",
  "Magazijn",
  "Magazijn",
  "Printz",
  "Printz",
  "DHL",
  "DHL",
];
const nav = [
  ["overzicht", "Overzicht", "grid"],
  ["orders", "Alle orders", "box"],
  ["uitzonderingen", "Uitzonderingen", "alert"],
  ["import", "Import", "globe"],
  ["magazijn", "Magazijn", "warehouse"],
  ["printz", "Printz", "print"],
  ["dhl", "DHL / transport", "truck"],
  ["communicatie", "Klantcommunicatie", "message"],
  ["logboek", "Logboek", "history"],
];

function createDemo() {
  const customers = [
    "Studio Noord",
    "Maison Bloom",
    "Bureau Buiten",
    "Nova Events",
    "Hotel De Linde",
    "Atelier West",
    "Team Rivier",
    "Fleur de Vries",
    "Lucas Bakker",
    "Emma Visser",
  ];
  const skus = ["MUG-WHT", "BAG-NAT", "BOT-BLK"];
  const orders = Array.from({ length: 50 }, (_, i) => {
    const stage = i % 7;
    return {
      id: `G4U-${1048 - i}`,
      customer: customers[i % 10],
      type: i % 10 < 7 ? "B2B" : "B2C",
      sku: skus[i % 3],
      quantity: i % 10 < 7 ? [100, 60, 120, 80, 50][i % 5] : 2,
      stage,
      created: "2026-11-11",
      promised: DEMO_DATE,
      eta: DEMO_DATE,
      priority: i % 10 < 3,
      design: `ONT-${1048 - i} · v${(i % 3) + 1} · goedgekeurd`,
      address: {
        street: "Voorbeeldstraat",
        number: String(10 + i),
        postal: "1234 AB",
        city: ["Utrecht", "Amsterdam", "Rotterdam"][i % 3],
      },
      shipment: `DHL-${8800 + i}`,
      qc: stage >= 4,
      reserved: stage === 1,
      events: [],
    };
  });
  const exceptions = [
    {
      id: "EX-001",
      title: "Printlijn 02 staat stil",
      service: "Printz",
      kind: "print",
      cause: "Een bevestigde machinestoring vertraagt drie printopdrachten.",
      owner: "Milan · Printz",
      next: "Alternatieve printcapaciteit beoordelen",
      urgency: "Kritiek",
      orders: ["G4U-1048", "G4U-1044", "G4U-1040"],
      impact: "+2 dagen verwacht",
      state: "Open",
    },
    {
      id: "EX-002",
      title: "Zending wacht bij douane",
      service: "Import",
      kind: "customs",
      cause: "De invoercontrole van HK-2026-081 duurt langer dan gepland.",
      owner: "Lotte · Inkoop",
      next: "Douaneafhandeling navragen",
      urgency: "Hoog",
      orders: ["G4U-1047", "G4U-1043", "G4U-1039"],
      impact: "Leverdatum nog onbekend",
      state: "Open",
    },
    {
      id: "EX-003",
      title: "Meer pakketten dan plek",
      service: "DHL",
      kind: "capacity",
      cause:
        "Voor 16 november staan 52 pakketten gepland bij een capaciteit van 40.",
      owner: "Daan · Logistiek",
      next: "Extra ophaalmoment afstemmen",
      urgency: "Hoog",
      orders: ["G4U-1046", "G4U-1042"],
      impact: "+1 dag verwacht",
      state: "Open",
    },
  ];
  orders.forEach((o) => {
    const ex = exceptions.find((e) => e.orders.includes(o.id));
    if (ex) {
      o.stage = ex.kind === "print" ? 3 : ex.kind === "customs" ? 0 : 4;
      o.eta =
        ex.kind === "print"
          ? "2026-11-18"
          : ex.kind === "customs"
            ? null
            : "2026-11-17";
      o.reserved = false;
      o.qc = o.stage >= 4;
      if (ex.kind === "customs") o.sku = "MUG-WHT";
    }
    o.events = Array.from({ length: o.stage + 1 }, (_, stage) => ({
      id: `EV-${o.id}-${stage}`,
      label: stages[stage],
      source: sources[stage],
      actor: "Demo-import",
      time: `2026-11-${String(11 + Math.min(stage, 4)).padStart(2, "0")}T08:30:00Z`,
      ...(stage === 6 ? { proof: `POD-DEMO-${o.id}` } : {}),
    }));
  });
  const inventory = skus.map((sku, i) => ({
    sku,
    name: [
      "Keramische mok · wit",
      "Katoenen tas · naturel",
      "Drinkfles · zwart",
    ][i],
    physical: [420, 800, 550][i],
    // Standaard bestelaantal per partij bij Hongkong (FR-MAG-06, UC11).
    batch: [600, 400, 400][i],
  }));
  return {
    version: 1,
    orders,
    exceptions,
    inventory,
    imports: [
      {
        id: "HK-2026-081",
        supplier: "Harbour Gifts · Hongkong",
        sku: "MUG-WHT",
        quantity: 600,
        eta: null,
        received: false,
        // Hongkong meldt alleen 'Delayed'; de oorzaak komt van onze eigen notitie.
        delayed: true,
        delayCause: "Douane: zending zit vast",
      },
      {
        id: "HK-2026-082",
        supplier: "Harbour Gifts · Hongkong",
        sku: "BAG-NAT",
        quantity: 400,
        eta: "2026-11-18",
        received: false,
        delayed: false,
      },
    ],
    messages: [],
    decisions: [],
    audit: [
      {
        id: "INIT",
        text: "Demodataset geladen: 50 orders en 3 uitzonderingen.",
        source: "Control Tower",
        record: "DEMO",
        actor: "Demo-import",
        time: "2026-11-16T08:41:00Z",
      },
    ],
    offline: false,
    transport: { planned: 52, capacity: 40 },
    seenEvents: [],
  };
}
let storageOK = true;
function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (
      saved?.version === 1 &&
      Array.isArray(saved.orders) &&
      Array.isArray(saved.audit)
    ) {
      // Keep all existing orders/history while retiring the old UI role choice.
      delete saved.role;
      // Velden uit de klantfeedback aanvullen zonder bestaande demodata te wissen.
      saved.inventory?.forEach((item, i) => {
        item.batch ??= [600, 400, 400][i] ?? 400;
      });
      saved.imports?.forEach((item) => {
        item.delayed ??= item.id === "HK-2026-081" && !item.received;
        if (item.delayed) item.delayCause ??= "Douane: zending zit vast";
      });
      return saved;
    }
  } catch {
    storageOK = false;
  }
  return createDemo();
}
let state = loadState();
let view = nav.some((n) => n[0] === location.hash.slice(1))
  ? location.hash.slice(1)
  : "overzicht";
let filter = "alle",
  query = "",
  page = 1,
  selectedOrder = null,
  scenario = "extra",
  scenarioException = null;
const main = document.querySelector("#main");
const detailDialog = document.querySelector("#detail-dialog");
const actionDialog = document.querySelector("#action-dialog");
function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    storageOK = false;
    toast(
      "Opslaan is niet beschikbaar. Wijzigingen blijven alleen in dit venster.",
    );
  }
}
function audit(text, source, record) {
  state.audit.unshift({
    id: uid(),
    text,
    source,
    record,
    actor: OPERATOR,
    simulated: partnerDemo,
    time: now(),
  });
}
let toastTimer;
function toast(message) {
  const target = document.querySelector("#toast");
  target.textContent = message;
  target.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => target.classList.remove("visible"), 4800);
}
function openAction(title, body, eyebrow = "GIFTS4U · DEMONSTRATIE") {
  document.querySelector("#action-content").innerHTML =
    `<div class="dialog-head"><div><span class="eyebrow">${escapeHTML(eyebrow)}</span><h2 id="action-title">${escapeHTML(title)}</h2></div><button class="icon-button" data-action="close-action" aria-label="Sluiten">${icon("close")}</button></div><div class="dialog-body">${partnerDemo ? '<div class="status-box"><strong>Partnerdemo actief</strong><p>Deze invoer simuleert externe gegevens. Je blijft de Control Tower-beheerder.</p></div>' : ""}${body}</div>`;
  if (!actionDialog.open) actionDialog.showModal();
}
function activeExceptions() {
  return state.exceptions.filter((e) => e.state !== "Opgelost");
}
function orderExceptions(order) {
  return activeExceptions().filter((e) => e.orders.includes(order.id));
}
function overrunPercent(order) {
  if (!order.eta || !order.promised) return null;
  const promised = Date.parse(order.promised) - Date.parse(order.created);
  return promised > 0
    ? ((Date.parse(order.eta) - Date.parse(order.created) - promised) /
        promised) *
        100
    : null;
}
function exceedsThreshold(planned, expected) {
  return (
    Number.isFinite(planned) &&
    Number.isFinite(expected) &&
    planned > 0 &&
    (expected - planned) * 100 > planned * 20
  );
}
function hasOverrun(order) {
  return Boolean(
    order.eta &&
      exceedsThreshold(
        Date.parse(order.promised) - Date.parse(order.created),
        Date.parse(order.eta) - Date.parse(order.created),
      ),
  );
}
function inventoryFor(sku) {
  const item = state.inventory.find((i) => i.sku === sku);
  const reserved = state.orders
    .filter((o) => o.sku === sku && o.reserved)
    .reduce((s, o) => s + o.quantity, 0);
  return {
    ...item,
    reserved,
    available: Math.max(0, item.physical - reserved),
  };
}
// Hongkong: 1 dag verwerking + 10 werkdagen transport (klantfeedback).
function addBusinessDays(isoDate, days) {
  const d = new Date(isoDate + "T12:00:00Z");
  let left = days;
  while (left > 0) {
    d.setUTCDate(d.getUTCDate() + 1);
    if (d.getUTCDay() !== 0 && d.getUTCDay() !== 6) left--;
  }
  return d.toISOString().slice(0, 10);
}
function hongKongEta(from = DEMO_DATE) {
  return addBusinessDays(from, 11);
}
// Waar in de DHL-route een zending zit, in plaats van een grote zendingenlijst.
const dhlHubs = {
  Utrecht: "Sorteercentrum Utrecht",
  Amsterdam: "Sorteercentrum Amsterdam",
  Rotterdam: "Sorteercentrum Rotterdam",
};
function dhlRoute(order) {
  return [
    "Ophalen bij Printz",
    dhlHubs[order.address.city] || "Sorteercentrum",
    `Bezorgroute ${order.address.city}`,
    "Afgeleverd",
  ];
}
function dhlStep(order) {
  if (order.stage < 4) return -1;
  if (order.stage === 4) return 0;
  if (order.stage === 6) return 3;
  // Onderweg: vaste demoverdeling over sorteercentrum en bezorgroute.
  return Number(order.id.split("-").at(-1)) % 2 ? 1 : 2;
}
function dhlPosition(order) {
  const step = dhlStep(order);
  if (step < 0) return "Nog niet bij DHL";
  return step === 0 ? "Wacht op ophaling bij Printz" : dhlRoute(order)[step];
}
const urgencyRank = { Kritiek: 0, Hoog: 1 };
function actionItems() {
  return activeExceptions()
    .slice()
    .sort((a, b) => (urgencyRank[a.urgency] ?? 2) - (urgencyRank[b.urgency] ?? 2));
}
function lateOrders() {
  return state.orders.filter((o) => o.stage < 6 && hasOverrun(o));
}
function badge(order) {
  const cls =
    order.stage === 6
      ? "lime"
      : order.stage === 3
        ? "purple"
        : order.stage === 5
          ? "dark"
          : "";
  return `<span class="badge ${cls}">${escapeHTML(stages[order.stage])}</span>`;
}
function navigate(next) {
  if (!nav.some((n) => n[0] === next)) return;
  view = next;
  page = 1;
  filter = "alle";
  location.hash = next;
  render();
}
function renderNavigation() {
  document.querySelector("#navigation").innerHTML = nav
    .map(
      ([id, label, img], i) =>
        `${i === 3 ? '<div class="nav-separator"></div>' : ""}<a href="#${id}" class="nav-item ${view === id ? "active" : ""}" title="${label}" ${view === id ? 'aria-current="page"' : ""}>${icon(img)}<span>${label}</span>${id === "uitzonderingen" ? `<b class="count">${activeExceptions().length}</b>` : ""}</a>`,
    )
    .join("");
}
function heading(title, subtitle, actions = "") {
  return `<div class="page-heading"><div><h2>${title}</h2><p>${subtitle}</p></div><div class="actions">${actions}</div></div>`;
}
function button(label, action, variant = "secondary", img = "", attrs = "") {
  if (partnerActions.has(action)) {
    if (!partnerDemo) return "";
    label = `Demo: ${label}`;
  }
  return `<button class="button ${variant}" data-action="${action}" ${attrs}>${img ? icon(img) : ""}${label}</button>`;
}
function render() {
  renderNavigation();
  document.querySelector("#partner-connection").textContent = state.offline
    ? "Printz tijdelijk offline"
    : "Alle demopartners verbonden";
  main.innerHTML =
    view === "overzicht"
      ? overview()
      : view === "uitzonderingen"
        ? exceptionsView()
        : view === "import"
          ? importView()
          : view === "magazijn"
            ? inventoryView()
            : view === "communicatie"
              ? communicationsView()
              : view === "logboek"
                ? auditView()
                : ordersView();
  if (partnerDemo) {
    main.innerHTML = `<div class="partner-demo-banner"><div><strong>Partnerdemo actief</strong><p>Je simuleert externe gegevens. Je blijft ${OPERATOR}; partners krijgen geen toegang.</p></div>${button("Sluit partnerdemo", "toggle-partner-demo")}</div>` + main.innerHTML;
  }
  document
    .querySelectorAll("[data-icon]")
    .forEach((el) => (el.innerHTML = icon(el.dataset.icon)));
}
function overview() {
  const risky = state.orders.filter((o) => orderExceptions(o).length).length;
  const delivered = state.orders.filter((o) => o.stage === 6).length;
  const onTrack = state.orders.filter(
    (o) => !orderExceptions(o).length && !hasOverrun(o),
  ).length;
  const planned = state.orders.filter((o) => o.stage < 3).length;
  const production = state.orders.filter((o) => o.stage === 3).length;
  const shipping = state.orders.length - planned - production;
  return (
    heading(
      "Jouw keten, in één overzicht.",
      "Eerst wat actie nodig heeft. Partners leveren de gegevens.",
      button("Exporteer", "export", "secondary", "download") +
        button("Webshoporder simuleren", "new-order", "lime", "plus"),
    ) +
    actionPanel() +
    `<section class="metrics" aria-label="Kerncijfers"><div class="metric attention"><div class="metric-label">Vragen aandacht ${icon("alert")}</div><div class="metric-value">${risky.toString().padStart(2, "0")}</div><div class="metric-note"><b>${activeExceptions().length} uitzonderingen</b> om op te volgen</div></div><div class="metric good"><div class="metric-label">Op schema ${icon("check")}</div><div class="metric-value">${fmt(onTrack)}</div><div class="metric-note"><b>Geen probleem</b> en binnen de leverbelofte</div></div><div class="metric"><div class="metric-label">Orders in beeld ${icon("box")}</div><div class="metric-value">${fmt(state.orders.length)}</div><div class="metric-note"><b>${state.orders.filter((o) => o.type === "B2B").length} B2B</b> · ${state.orders.filter((o) => o.type === "B2C").length} B2C-bestellingen</div></div><div class="metric"><div class="metric-label">Afgeleverd ${icon("check")}</div><div class="metric-value">${delivered.toString().padStart(2, "0")}</div><div class="metric-note"><b>Bevestigd</b> met afleverbewijs in de demo</div></div></section>
  <div class="dashboard-grid"><section class="chart-panel"><div class="panel-heading"><div><h3>De keten in één regel</h3><p>Aantal orders per schakel · groen is op schema, rood heeft een probleem</p></div></div>${chainPanel()}<div class="chart-summary">${icon("spark")} Alleen aantallen producten en orders; geen kosten.</div></section><section class="partner-panel"><div class="panel-heading"><h3>In verbinding</h3><button class="text-button" data-action="partners">Alle partners ${icon("arrow")}</button></div><div class="partner"><div class="partner-logo import">HG</div><div class="partner-info">Harbour Gifts<small>Import · Hongkong</small></div>${partnerStatus("Import")}</div><div class="partner"><div class="partner-logo printz">P.</div><div class="partner-info">Printz<small>Bedrukking & kwaliteit</small></div>${partnerStatus("Printz")}</div><div class="partner"><div class="partner-logo dhl">DHL</div><div class="partner-info">DHL Nederland<small>Transport & bezorging</small></div>${partnerStatus("DHL")}</div><div class="flow-breakdown"><span class="tiny-label">Verdeling bevestigde orderfasen</span><div class="flow-labels"><span>Voorbereiding<b>${planned} orders</b></span><span>Productie<b>${production} orders</b></span><span>Verzending / bezorgd<b>${shipping} orders</b></span></div><div class="stacked-bar" role="img" aria-label="${planned} voorbereiding, ${production} productie, ${shipping} verzending of bezorgd"><span style="width:${(planned / state.orders.length) * 100}%"></span><span style="width:${(production / state.orders.length) * 100}%"></span><span style="width:${(shipping / state.orders.length) * 100}%"></span></div></div></section></div>
  ${orderTable(true)}`
  );
}
// Klantfeedback: wat actie vraagt staat bovenaan, rood, met een korte oorzaak en de volgende stap.
function actionPanel() {
  const items = actionItems();
  const late = lateOrders();
  if (!items.length && !late.length)
    return `<section class="action-panel ok" aria-label="Actie nodig"><div class="action-head"><h3>${icon("check")} Alles op schema</h3><p>Er zijn geen open uitzonderingen en geen orders boven de 20%-grens.</p></div></section>`;
  const rows = items.map(
    (e) =>
      `<li class="action-item"><span class="badge danger">${escapeHTML(e.urgency)}</span><div class="action-text"><strong>${escapeHTML(e.title)}</strong><p>${escapeHTML(e.service)} · ${e.orders.length} order${e.orders.length === 1 ? "" : "s"} geraakt · ${escapeHTML(e.impact)}</p><p class="action-next">Volgende stap: ${escapeHTML(e.next)}</p></div>${button("Bekijk impact", "scenario", "secondary", "arrow", `data-id="${e.id}"`)}</li>`,
  );
  if (late.length)
    rows.push(
      `<li class="action-item"><span class="badge danger">Alarm</span><div class="action-text"><strong>Leverlooptijd meer dan 20% overschreden</strong><p>${late.length} order${late.length === 1 ? "" : "s"} · verwachte levering ligt ruim na de belofte van 5 dagen</p><p class="action-next">Volgende stap: klant informeren en ETA bij de partner bevestigen</p></div><div class="button-row">${late
        .slice(0, 3)
        .map((o) => button(o.id, "order", "secondary", "box", `data-id="${o.id}"`))
        .join("")}</div></li>`,
    );
  return `<section class="action-panel" aria-label="Actie nodig"><div class="action-head"><h3>${icon("alert")} Actie nodig <span class="danger-pill">${rows.length}</span></h3><p>Werk van boven naar beneden: eerst het meest urgente.</p></div><ol class="action-list">${rows.join("")}</ol></section>`;
}
// Vereenvoudigde keten op het dashboard (positieve feedback van een ander team).
function chainPanel() {
  const delayed = state.imports.filter((i) => i.delayed && !i.received).length;
  const inTransit = state.imports.filter((i) => !i.received).length;
  const nodes = [
    ["Webshop", "box", [0]],
    ["Magazijn", "warehouse", [1]],
    ["Printz", "print", [2, 3, 4]],
    ["DHL", "truck", [5]],
    ["Klant", "check", [6]],
  ].map(([label, img, stagesIn]) => {
    const orders = state.orders.filter((o) => stagesIn.includes(o.stage));
    const bad = orders.filter((o) => orderExceptions(o).length).length;
    return `<li class="chain-node ${bad ? "bad" : "ok"}">${icon(img)}<strong>${label}</strong><span class="chain-ok">${orders.length - bad} op schema</span>${bad ? `<span class="chain-bad">${bad} probleem</span>` : ""}</li>`;
  });
  nodes.unshift(
    `<li class="chain-node ${delayed ? "bad" : "ok"}">${icon("globe")}<strong>Hongkong</strong><span class="chain-ok">${inTransit - delayed} partij${inTransit - delayed === 1 ? "" : "en"} onderweg</span>${delayed ? `<span class="chain-bad">${delayed} Delayed</span>` : ""}</li>`,
  );
  return `<ol class="chain" aria-label="Vereenvoudigde keten">${nodes.join("")}</ol>`;
}
function filteredOrders() {
  let rows = state.orders.filter((o) =>
    `${o.id} ${o.customer} ${o.sku}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  if (view === "printz")
    rows = rows.filter((o) => o.stage >= 2 && o.stage <= 4);
  if (view === "dhl") rows = rows.filter((o) => o.stage >= 4);
  if (filter === "risico") rows = rows.filter((o) => orderExceptions(o).length);
  if (filter === "b2b") rows = rows.filter((o) => o.type === "B2B");
  if (filter === "afgeleverd") rows = rows.filter((o) => o.stage === 6);
  return rows;
}
function orderTable(compact = false) {
  const rows = filteredOrders();
  const pages = Math.max(1, Math.ceil(rows.length / 6));
  page = Math.min(page, pages);
  const visible = rows.slice((page - 1) * 6, page * 6);
  return `<section class="orders-section"><div class="table-toolbar"><h3>${view === "printz" ? "Status per order bij Printz" : view === "dhl" ? "Positie per order" : "Orderoverzicht"} <span class="total-pill">${rows.length}</span></h3><div class="filter-row" aria-label="Orderfilters">${[
    ["alle", "Alle orders"],
    ["risico", "Vragen aandacht"],
    ["b2b", "B2B"],
    ["afgeleverd", "Afgeleverd"],
  ]
    .map(
      ([id, label]) =>
        `<button class="filter-chip ${filter === id ? "active" : ""}" aria-pressed="${filter === id}" data-action="filter" data-id="${id}">${label}</button>`,
    )
    .join(
      "",
    )}</div></div><div class="table-scroll"><table><thead><tr><th>Order / klant</th><th>Product</th><th>Bevestigde status</th><th>Leverbelofte</th><th>Verwachting <span title="Schatting, geen bevestiging">↗</span></th><th><span class="tiny-label">${view === "dhl" ? "Positie in DHL-route" : "Partner"}</span></th><th><span class="tiny-label">Detail</span></th></tr></thead><tbody>${visible.length ? visible.map((o) => `<tr><td><button class="order-link" data-action="order" data-id="${o.id}">${icon("box")}${o.id}<span class="type-pill">${o.type}${o.priority ? " · PRIO" : ""}</span></button><small>${escapeHTML(o.customer)}</small></td><td>${escapeHTML(o.sku)}<small>${o.quantity} stuks</small></td><td>${badge(o)}${orderExceptions(o).length ? '<small class="risk-label"><i class="risk-dot"></i>Open uitzondering</small>' : ""}</td><td>${date(o.promised)}<small>Oorspronkelijke belofte</small></td><td>${date(o.eta)}<small>${hasOverrun(o) ? `<span class="risk-label">+${Math.round(overrunPercent(o))}% looptijd</span>` : "Schatting"}</small></td><td>${view === "dhl" ? `${escapeHTML(dhlPosition(o))}<small>${o.shipment}</small>` : sources[o.stage]}</td><td><button class="icon-button" data-action="order" data-id="${o.id}" aria-label="Bekijk ${o.id}">${icon("arrow")}</button></td></tr>`).join("") : '<tr><td colspan="7"><div class="empty-state"><strong>Geen orders gevonden</strong>Probeer een andere zoekterm of kies Alle orders.</div></td></tr>'}</tbody></table></div><div class="table-footer"><span>${rows.length ? `${(page - 1) * 6 + 1}–${Math.min(page * 6, rows.length)} van ${rows.length} orders` : "0 orders"} · Bevestiging en prognose blijven gescheiden</span><div class="pagination"><button data-action="prev" aria-label="Vorige pagina" ${page === 1 ? "disabled" : ""}>‹</button><span>${page} / ${pages}</span><button data-action="next" aria-label="Volgende pagina" ${page === pages ? "disabled" : ""}>›</button></div></div></section>`;
}
function ordersView() {
  const isPrint = view === "printz",
    isDHL = view === "dhl";
  const title = isPrint
    ? "Van ontwerp naar cadeau."
    : isDHL
      ? "Waar is elke zending?"
      : "Iedere order, één verhaal.";
  const subtitle = isPrint
    ? "Printz meldt vier statussen: ontvangen, in productie, gereed en verzonden. Een storing staat er apart naast."
    : isDHL
      ? "Per order zie je waar de zending in de DHL-route zit. De leverbelofte blijft staan."
      : "Bekijk de hele keten en volg de laatste bevestigde gebeurtenis.";
  const printCount = (from, to = from) =>
    state.orders.filter((o) => o.stage >= from && o.stage <= to).length;
  return (
    heading(
      title,
      subtitle,
      isDHL
        ? button("Capaciteit plannen", "capacity", "secondary", "truck")
        : isPrint
          ? simulateHint() + button("Storing simuleren", "report-print", "secondary", "alert")
          : button("Webshoporder simuleren", "new-order", "lime", "plus"),
    ) +
    (isPrint
      ? `<div class="content-pad"><div class="service-summary print-steps">${[
          ["Ontvangen bij Printz", printCount(2)],
          ["In productie", printCount(3)],
          ["Gereed", printCount(4)],
          ["Verzonden", printCount(5, 6)],
        ]
          .map(
            ([label, count]) =>
              `<div class="service-stat"><span>${label}</span><b>${count}</b><span>orders</span></div>`,
          )
          .join("")}</div></div>`
      : "") +
    (isPrint && state.offline
      ? '<div class="content-pad"><div class="warning-box"><strong>Printz-synchronisatie mislukt</strong><p>Laatste bevestigingen blijven zichtbaar. Nieuwe partnerbevestigingen zijn geblokkeerd tot de verbinding is hersteld.</p></div></div>'
      : "") +
    (isDHL
      ? `<div class="content-pad"><div class="service-summary"><div class="service-stat"><span>Gepland · ${date(DEMO_DATE)}</span><b>${state.transport.planned}</b><span>pakketten</span></div><div class="service-stat"><span>Beschikbare capaciteit</span><b>${state.transport.capacity}</b><span>pakketten</span></div><div class="service-stat"><span>Capaciteitstekort</span><b>${Math.max(0, state.transport.planned - state.transport.capacity)}</b><span>pakketten · demo-planning</span></div></div></div>`
      : "") +
    orderTable()
  );
}
// Problemen nabootsen gebeurt in Partnerdemo; deze knop maakt die modus vindbaar.
function simulateHint() {
  return partnerDemo
    ? ""
    : button("Probleem nabootsen", "toggle-partner-demo", "secondary", "spark");
}
function exceptionsView() {
  return (
    heading(
      "Eerst aandacht. Dan actie.",
      "Uitzonderingen veranderen nooit stilzwijgend de bevestigde orderstatus.",
      button("Wat als?", "scenario", "lime", "spark", 'data-id="EX-001"'),
    ) +
    `<div class="content-pad"><div class="exception-grid">${
      activeExceptions()
        .map(
          (e) =>
            `<article class="exception-card"><div class="card-top"><span class="badge ${e.urgency === "Kritiek" ? "dark" : "purple"}">${escapeHTML(e.urgency)}</span><span class="tiny-label">${e.id} · ${e.service}</span></div><h3>${escapeHTML(e.title)}</h3><p>${escapeHTML(e.cause)}</p><dl><div><dt>Betrokken</dt><dd>${e.orders.length} orders</dd></div><div><dt>Leveringsimpact</dt><dd>${escapeHTML(e.impact)}</dd></div><div><dt>Eigenaar</dt><dd>${escapeHTML(e.owner)}</dd></div><div><dt>Volgende stap</dt><dd>${escapeHTML(e.next)}</dd></div><div><dt>Opvolging</dt><dd>${escapeHTML(e.state)}</dd></div></dl>${button("Bekijk impact", "scenario", "secondary", "arrow", `data-id="${e.id}"`)}</article>`,
        )
        .join("") ||
      '<div class="empty-state">Er zijn geen open uitzonderingen.</div>'
    }</div><div class="section-note">Een besluit is nog geen uitvoering. De beheerder sluit een uitzondering pas na bevestiging van de partner. De alarmregel voor een looptijdoverschrijding is strikt &gt;20% en moet nog door de opdrachtgever worden gevalideerd.</div></div>`
  );
}
function importView() {
  return (
    heading(
      "Van Hongkong naar het magazijn.",
      "Hongkong meldt alleen of een partij vertraagd is. Verwerking 1 dag, daarna ca. 10 werkdagen transport.",
      simulateHint() + button("Partij registreren", "new-import", "lime", "plus"),
    ) +
    `<div class="content-pad"><div class="table-scroll"><table><thead><tr><th>Zending / leverancier</th><th>SKU</th><th>Aantal</th><th>ETA · schatting</th><th>Status Hongkong</th><th>Actie</th></tr></thead><tbody>${state.imports.map((i) => `<tr><td>${escapeHTML(i.id)}<small>${escapeHTML(i.supplier)}</small></td><td>${escapeHTML(i.sku)}</td><td>${fmt(i.quantity)}</td><td>${date(i.eta)}</td><td><span class="badge ${i.received ? "lime" : i.delayed ? "danger" : ""}">${i.received ? "Ontvangen" : i.delayed ? "Delayed" : "Onderweg"}</span>${i.delayed && !i.received ? `<small>${escapeHTML(i.delayCause || "Oorzaak nog onbekend")}</small>` : ""}</td><td>${partnerDemo ? `<div class="button-row">${button(i.received ? "Ontvangst vastgelegd" : "Bevestig ontvangst", "receive", "secondary", "", `data-id="${escapeHTML(i.id)}" ${i.received ? "disabled" : ""}`)}${i.received || i.delayed ? "" : button("Vertraging simuleren", "delay-import", "secondary", "alert", `data-id="${escapeHTML(i.id)}"`)}</div>` : (i.received ? "Ontvangst aangeleverd" : "Wacht op magazijn")}</td></tr>`).join("")}</tbody></table></div><h3 class="service-heading">Afhankelijk van de vertraagde partij</h3>${activeExceptions()
      .filter((e) => ["customs", "delay"].includes(e.kind))
      .map(
        (e) =>
          `<div class="status-box"><strong>${escapeHTML(e.title)}</strong><p>${escapeHTML(e.owner)} · ${escapeHTML(e.next)} · ETA nog onbekend</p><div class="button-row">${e.orders.length ? e.orders.map((id) => button(id, "order", "secondary", "box", `data-id="${id}"`)).join("") : '<span class="tiny-label">Nog geen wachtende orders op deze SKU</span>'}</div></div>`,
      )
      .join(
        "",
      )}<div class="section-note">Ontvangst telt het werkelijk ontvangen aantal één keer bij de fysieke voorraad op. De resterende hoeveelheid blijft in deze demo een expliciet verschil in het logboek; een vervolgpartij moet apart worden geregistreerd.</div></div>`
  );
}
function inventoryView() {
  return (
    heading(
      "Voorraad die je kunt beloven.",
      "Eén voorraad voor B2B en B2C, in aantallen producten. Beschikbaar = fysiek aanwezig − gereserveerd.",
      button("Batchaantal verhogen", "batch", "lime", "plus"),
    ) +
    `<div class="content-pad"><div class="table-scroll"><table><thead><tr><th>Product / SKU</th><th>Fysiek aanwezig</th><th>Gereserveerd</th><th>Beschikbaar</th><th>Batch Hongkong</th><th>Voorraadstatus</th></tr></thead><tbody>${state.inventory
      .map((i) => inventoryFor(i.sku))
      .map(
        (i) =>
          `<tr><td>${escapeHTML(i.name)}<small>${i.sku}</small></td><td>${fmt(i.physical)}</td><td>${fmt(i.reserved)}</td><td><strong>${fmt(i.available)}</strong></td><td>${fmt(i.batch)}<small>stuks per partij</small></td><td><span class="badge ${i.available > 100 ? "lime" : "danger"}">${i.available > 100 ? "Beschikbaar" : "Beperkt beschikbaar"}</span></td></tr>`,
      )
      .join(
        "",
      )}</tbody></table></div><h3 class="service-heading">Wachten op de volgende magazijnbevestiging</h3><div class="table-scroll"><table><thead><tr><th>Order</th><th>SKU / aantal</th><th>Status</th><th>Actie</th></tr></thead><tbody>${state.orders
      .filter((o) => o.stage < 2)
      .map(
        (o) =>
          `<tr><td>${o.id}<small>${escapeHTML(o.customer)}</small></td><td>${o.sku} · ${o.quantity}</td><td>${badge(o)}</td><td>${partnerDemo ? button(o.stage === 0 ? "Reserveer voorraad" : "Overdragen aan Printz", "advance", "secondary", "", `data-id="${o.id}"`) : button("Bekijk dossier", "order", "secondary", "", `data-id="${o.id}"`)}</td></tr>`,
      )
      .join(
        "",
      )}</tbody></table></div><div class="section-note">Reserveringen worden in dit venster opnieuw gecontroleerd vóór toewijzing. Concurrente verzoeken tussen gebruikers vereisen in de uiteindelijke backend een atomische reservering.</div></div>`
  );
}
function communicationsView() {
  return (
    heading(
      "Houd de klant dichtbij.",
      "Berichten volgen bevestigde gebeurtenissen. Verzending is altijd een simulatie.",
    ) +
    `<div class="content-pad"><div class="insight" style="margin:0 0 24px"><div class="insight-icon">${icon("message")}</div><div><h3>Van ordergebeurtenis naar duidelijke update</h3><p>Open een order en kies ‘Klantupdate opstellen’. Controleer de oorzaak en de verwachte leverdatum.</p></div>${button("Bekijk orders", "all-orders", "secondary", "arrow")}</div><h3 class="service-heading">Communicatielog</h3>${state.messages.length ? `<div class="table-scroll"><table><thead><tr><th>Order / tijdstip</th><th>Ontvanger / kanaal</th><th>Bericht</th><th>Toegewezen aan</th><th>Status</th></tr></thead><tbody>${state.messages.map((m) => `<tr><td>${m.orderId}<small>${timestamp(m.time)}</small></td><td>${escapeHTML(m.recipient)}<small>${escapeHTML(m.channel)}</small></td><td class="log-message">${escapeHTML(m.body)}</td><td>${escapeHTML(m.owner)}</td><td><span class="badge lime">Gesimuleerd verzonden</span></td></tr>`).join("")}</tbody></table></div>` : '<div class="empty-state"><strong>Nog geen klantupdates</strong>Een verzonden demo-update verschijnt hier met ontvanger, kanaal en tijdstip.</div>'}</div>`
  );
}
function auditView() {
  return (
    heading(
      "Elke stap is terug te vinden.",
      "Bevestigingen, uitzonderingen, besluiten en acties met bron, actor en tijdstip.",
      button("Exporteer logboek", "export-audit", "secondary", "download"),
    ) +
    `<div class="content-pad"><ul class="audit-list">${state.audit.map((a) => `<li class="audit-item">${icon("history")}<div>${escapeHTML(a.text)}<small>${timestamp(a.time)} · ${escapeHTML(a.source)} · ${escapeHTML(a.actor)} · ${escapeHTML(a.record)}${a.simulated ? " · partnerdemo" : ""}</small></div></li>`).join("")}</ul></div>`
  );
}

function showOrder(id) {
  const o = state.orders.find((o) => o.id === id);
  if (!o) return;
  selectedOrder = id;
  const exceptions = orderExceptions(o);
  const percent = overrunPercent(o);
  document.querySelector("#detail-content").innerHTML =
    `<div class="dialog-head"><div><span class="eyebrow">ORDERDOSSIER · ${o.type}${o.priority ? " · PRIORITEIT" : ""}</span><h2 id="detail-title">${o.id}</h2><p>${escapeHTML(o.customer)}</p></div><button class="icon-button" data-action="close-detail" aria-label="Orderdetails sluiten">${icon("close")}</button></div><div class="dialog-body"><dl class="detail-facts"><div><dt>Product</dt><dd>${o.sku}<small>${o.quantity} stuks</small></dd></div><div><dt>Verantwoordelijke partner</dt><dd>${sources[o.stage]}<small>Zending ${o.shipment}</small></dd></div><div><dt>Oorspronkelijke leverbelofte</dt><dd>${date(o.promised)}<small>Vastgelegd bij orderacceptatie</small></dd></div><div><dt>Verwachte levering · schatting</dt><dd>${date(o.eta)}<small>${percent === null ? "Geen bevestigde nieuwe verwachting" : `${Math.round(percent)}% extra looptijd${hasOverrun(o) ? " · >20%-alarm" : ""}`}</small></dd></div></dl><div class="status-box"><span class="tiny-label">Laatste bevestigde status</span><p>${badge(o)}</p><p>${timestamp(o.events.at(-1).time)} · bron: ${o.events.at(-1).source}. Een risico wijzigt deze status niet.</p></div>${dhlStep(o) >= 0 ? `<div class="status-box"><span class="tiny-label">Positie in DHL-route · ${o.shipment}</span><ol class="dhl-route">${dhlRoute(o).map((step, i) => `<li class="${i < dhlStep(o) ? "done" : i === dhlStep(o) ? "current" : ""}">${escapeHTML(step)}</li>`).join("")}</ol></div>` : ""}${exceptions.map((e) => `<div class="warning-box"><strong>${escapeHTML(e.title)} · ${escapeHTML(e.urgency)}</strong><p>${escapeHTML(e.cause)}<br>Impact: ${escapeHTML(e.impact)}<br>Eigenaar: ${escapeHTML(e.owner)}<br>Volgende actie: ${escapeHTML(e.next)}</p>${button("Verken herstelopties", "scenario", "secondary", "spark", `data-id="${e.id}"`)}</div>`).join("")}
  <h3>Opvolging door de beheerder</h3><p class="scenario-intro">Status en voorraad volgen externe bevestigingen. Gebruik Partnerdemo om zulke gegevens tijdens de demo te simuleren.</p><div class="button-row">${o.stage < 6 ? button(["Reserveer voorraad", "Overdragen aan Printz", "Start bedrukking", "Kwaliteitscontrole & vrijgave", "Bevestig ophaling", "Bevestig aflevering"][o.stage], "advance", "lime", "check", `data-id="${o.id}"`) : '<span class="badge lime">Aflevering bevestigd</span>'}${button("Klantupdate opstellen", "compose", "secondary", "message", `data-id="${o.id}"`)}${button("ETA bijwerken", "eta", "secondary", "clock", `data-id="${o.id}"`)}</div>
  <h3>Goedgekeurd ontwerp</h3><div class="status-box"><strong>${escapeHTML(o.design)}</strong><p>Fictieve ontwerpverwijzing · gekoppeld aan ${o.id} en ${o.sku}. Geen klantfoto opgenomen.</p></div><h3>Aflevergegevens · fictief</h3><p class="scenario-intro">${escapeHTML(o.address.street)} ${escapeHTML(o.address.number)}<br>${escapeHTML(o.address.postal)} ${escapeHTML(o.address.city)}</p><h3>Bevestigde gebeurtenissen</h3><ol class="timeline">${o.events
    .slice()
    .reverse()
    .map(
      (e) =>
        `<li>${escapeHTML(e.label)}<small>${timestamp(e.time)} · bron: ${escapeHTML(e.source)} · invoer: ${escapeHTML(e.actor)}${e.simulated ? " · gesimuleerde partnerdata" : ""}<br>${escapeHTML(e.id)}${e.proof ? ` · bewijs: ${escapeHTML(e.proof)}` : ""}</small></li>`,
    )
    .join(
      "",
    )}</ol>${button("Test dubbel event", "duplicate", "secondary", "history", `data-id="${o.id}"`)}<div class="section-note">${OPERATOR}. Partnergegevens zijn externe bronnen; een actiehouder is geen extra gebruiker.</div></div>`;
  document
    .querySelector("#detail-content")
    .insertAdjacentHTML(
      "beforeend",
      `<div class="dialog-body"><h3>Een probleem vastleggen</h3><p class="scenario-intro">Leg een adresprobleem, mislukte levering of personalisatieklacht vast zonder de orderstatus te wijzigen.</p>${button("Probleem of klacht melden", "report-problem", "secondary", "alert", `data-id="${o.id}"`)}</div>`,
    );
  if (!detailDialog.open) detailDialog.showModal();
}
function refresh() {
  save();
  render();
  if (detailDialog.open && selectedOrder) showOrder(selectedOrder);
}
function addEvent(o, stage, proof = "") {
  const eventId = `EV-${o.id}-${stage}`;
  if (
    o.events.some((e) => e.id === eventId) ||
    state.seenEvents.includes(eventId)
  )
    return false;
  const event = {
    id: eventId,
    label: stages[stage],
    source: sources[stage],
    actor: OPERATOR,
    simulated: true,
    time: now(),
    proof,
  };
  o.stage = stage;
  o.events.push(event);
  state.seenEvents.push(eventId);
  audit(`${o.id}: ${stages[stage]} bevestigd.`, sources[stage], o.id);
  return true;
}
function addException(data) {
  const existing = activeExceptions().find(
    (e) =>
      e.kind === data.kind &&
      (data.record
        ? e.record === data.record
        : data.orders.every((id) => e.orders.includes(id))),
  );
  if (existing) return existing;
  const ex = {
    id: `EX-${String(state.exceptions.length + 1).padStart(3, "0")}`,
    state: "Open",
    ...data,
  };
  state.exceptions.push(ex);
  audit(`Uitzondering geregistreerd: ${ex.title}.`, ex.service, ex.id);
  return ex;
}
function advance(id) {
  if (!partnerDemo) return;
  const o = state.orders.find((o) => o.id === id);
  if (!o || o.stage >= 6) return;
  if (state.offline && [2, 3].includes(o.stage)) {
    toast("Printz is offline. Er is geen nieuwe status bevestigd.");
    return;
  }
  if (o.stage === 0) {
    const stock = inventoryFor(o.sku);
    if (stock.available < o.quantity) {
      addException({
        title: "Onvoldoende voorraad",
        service: "Magazijn",
        kind: "stock",
        cause: `${o.quantity - stock.available} stuks ${o.sku} ontbreken voor ${o.id}.`,
        owner: "Noor · Magazijn",
        next: "Aanvulling afstemmen",
        urgency: "Hoog",
        orders: [o.id],
        impact: "Leverdatum nog onbekend",
      });
      refresh();
      toast(
        "Onvoldoende voorraad. Uitzondering vastgelegd; status blijft Ontvangen.",
      );
      return;
    }
    o.reserved = true;
    addEvent(o, 1);
  } else if (o.stage === 1) {
    if (!o.reserved) {
      toast("Een voorraadreservering ontbreekt.");
      return;
    }
    state.inventory.find((i) => i.sku === o.sku).physical -= o.quantity;
    o.reserved = false;
    addEvent(o, 2);
  } else if (o.stage === 2) {
    addEvent(o, 3);
  } else if (o.stage === 3) {
    openAction(
      "Controleer vóór vrijgave",
      `<form id="qc-form" data-id="${o.id}"><p class="scenario-intro">${o.id} · ${o.quantity} stuks · ${escapeHTML(o.design)}</p><label class="checkbox"><input type="checkbox" name="design" required> De personalisatie komt overeen met de goedgekeurde ontwerpversie.</label><label class="checkbox"><input type="checkbox" name="quantity" required> Het aantal (${o.quantity}) en de productkwaliteit zijn gecontroleerd.</label><div class="form-actions">${button("Annuleren", "close-action")}<button class="button lime" type="submit">Bevestig verzendklaar</button></div></form>`,
    );
    return;
  } else if (o.stage >= 4) {
    openAction(
      o.stage === 4 ? "Bevestig overdracht aan DHL" : "Bevestig aflevering",
      `<form id="shipping-form" data-id="${o.id}"><p class="scenario-intro">Zending ${o.shipment} · ${o.id}. ${o.stage === 5 ? "Aflevering vereist een bewijsreferentie." : "Alleen een werkelijk bevestigde ophaling verandert de status."}</p><div class="form-grid"><label class="field">Postcode<input name="postal" value="${escapeHTML(o.address.postal)}" required pattern="[1-9][0-9]{3} ?[A-Za-z]{2}"></label><label class="field">Huisnummer<input name="number" value="${escapeHTML(o.address.number)}" required></label></div><label class="field">Gebeurtenistijd<input type="datetime-local" name="eventTime" value="${localDateTime()}" required></label>${o.stage === 5 ? '<label class="field">Referentie afleverbewijs<input name="proof" placeholder="Bijvoorbeeld POD-DEMO-1048" required></label>' : ""}<label class="checkbox"><input type="checkbox" required> Ik bevestig ${o.stage === 4 ? "de overdracht/ophaling" : "de aflevering met bewijs"} voor deze zending.</label><div class="form-actions"><button class="button lime" type="submit">Gebeurtenis bevestigen</button></div></form>`,
    );
    return;
  }
  refresh();
  toast(`${o.id}: ${stages[o.stage]} bevestigd in de demo.`);
}
function localDateTime() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}T${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
function scenarioOptions(exception) {
  return (
    {
      print: ["Extra printshift", "Reguliere herstart"],
      customs: ["Douane versnellen", "Wachten op vrijgave"],
      // Klantfeedback: bij Hongkong kan een "special request" (spoedverzoek) worden gedaan.
      delay: ["Spoedverzoek bij Hongkong", "Wachten op nieuwe ETA"],
      capacity: ["Extra ophaalronde", "Volgende reguliere rit"],
      stock: ["Alternatieve voorraad regelen", "Wachten op aanvulling"],
      address: ["Adres nu verifiëren", "Klant om adres vragen"],
      delivery: ["Nieuwe afleverafspraak", "Afhalen afstemmen"],
      photo: ["Herdruk voorbereiden", "Vervanging voorbereiden"],
    }[exception.kind] || ["Actief bijsturen", "Partneradvies afwachten"]
  );
}
function partnerStatus(service) {
  if (service === "Printz" && state.offline)
    return '<span class="partner-status warn">Syncprobleem</span>';
  const open = activeExceptions().filter((e) => e.service === service);
  return `<span class="partner-status ${open.length ? "warn" : ""}">${open.length ? `${open.length} aandachtspunt${open.length > 1 ? "en" : ""}` : "Verbonden"}</span>`;
}
function showScenario(id, keepChoice = false) {
  const ex = state.exceptions.find((e) => e.id === id);
  if (!ex) return;
  scenarioException = id;
  if (!keepChoice) scenario = "extra";
  const isPrint = ex.kind === "print";
  const selected = scenario === "extra";
  const options = scenarioOptions(ex);
  const decisions = state.decisions.filter((d) => d.exception === id);
  openAction(
    "Wat als je nu bijstuurt?",
    `<p class="scenario-intro">${escapeHTML(ex.title)} raakt <strong>${ex.orders.length} orders</strong>. Vergelijk een herstelroute vóór je een besluit vastlegt. Dit zijn illustratieve scenario’s, geen berekende capaciteitsgaranties. We vergelijken tijd en aantallen; kosten vallen buiten de scope.</p><div class="route"><span>${icon("globe")}Import</span>→<span>${icon("warehouse")}Magazijn</span>→<span class="${isPrint ? "route-risk" : ""}">${icon("print")}Printz</span>→<span>${icon("truck")}DHL</span>→<span>${icon("box")}Klant</span></div><span class="tiny-label">Kies een scenario</span><div class="scenario-options">${options.map((label, i) => `<button class="scenario-option ${(i === 0) === selected ? "selected" : ""}" data-action="scenario-choice" data-id="${i === 0 ? "extra" : "wait"}" aria-pressed="${(i === 0) === selected}"><span class="option-tag">${i === 0 ? "ACTIEF BIJSTUREN" : "BESTAANDE ROUTE"}</span><strong>${label}</strong><small>${isPrint ? (i === 0 ? "Een extra shift bij Printz, na akkoord op capaciteit." : "Wachten tot lijn 02 weer beschikbaar is.") : i === 0 ? "Eigenaar stemt een versnelling af met de partner." : "De partner bevestigt eerst een nieuwe verwachting."}</small></button>`).join("")}</div><div class="scenario-result"><div><span>Mogelijke tijdwinst</span><b>${isPrint ? (selected ? "1 dag" : "0 dagen") : "Onbekend"}</b></div><div><span>Betrokken producten</span><b>${fmt(ex.orders.reduce((sum, oid) => sum + (state.orders.find((o) => o.id === oid)?.quantity || 0), 0))} stuks</b></div><div><span>Betrokken orders</span><b>${ex.orders.length}</b></div></div><p class="scenario-intro">${isPrint ? `Scenario-ETA: <strong>${selected ? "17" : "18"} november</strong>. De oorspronkelijke leverbelofte blijft 16 november. ${selected ? "Bij vijf dagen beloofde looptijd is zes dagen precies 20%: geen >20%-alarm." : "Zeven dagen is 40% extra looptijd: wel een >20%-alarm."}` : "Een nieuwe ETA is nog onbekend. De partner moet de haalbaarheid bevestigen."}</p><div class="button-row">${ex.orders.map((oid) => button(oid, "scenario-order", "secondary", "box", `data-id="${oid}"`)).join("")}</div><div class="section-note">${escapeHTML(ex.owner)} · ${escapeHTML(ex.next)}. Het kiezen van een scenario wijzigt geen orderstatus, reservering of ETA.</div>
  <form id="decision-form" data-id="${ex.id}"><div class="form-grid"><label class="field">Actiehouder bij de partner<input name="owner" value="${escapeHTML(ex.owner)}" required maxlength="80"></label><label class="field">Deadline<input name="deadline" type="datetime-local" required value="${localDateTime()}"></label></div><label class="field">Besluit genomen door<input name="decidedBy" required maxlength="80" placeholder="Naam van de bevoegde beslisser"></label><label class="field">Besluit en toelichting<textarea name="reason" required maxlength="600">${options[selected ? 0 : 1]} afstemmen. Eerst capaciteit en ETA laten bevestigen; daarna de klant informeren.</textarea></label><label class="checkbox"><input name="authorized" type="checkbox" required> Ik registreer een bevoegd genomen besluit.</label><div class="section-note">Vastgelegd door ${OPERATOR}. De beslisser en actiehouder zijn geen extra gebruikersaccounts.</div><button class="button lime" type="submit">Besluit vastleggen</button></form>
  ${decisions.length ? `<h3>Vastgelegde besluiten</h3>${decisions.map((d) => `<div class="status-box"><strong>${escapeHTML(d.option)}</strong><p>${escapeHTML(d.reason)}<br>${escapeHTML(d.owner)} · deadline ${timestamp(d.deadline)}<br>Beslisser: ${escapeHTML(d.decidedBy || "Niet vastgelegd in eerdere demo")}<br>Ingevoerd door ${escapeHTML(d.recordedBy || "Historische invoer")} · ${timestamp(d.time)}</p></div>`).join("")}` : ""}<h3>Is het probleem daadwerkelijk verholpen?</h3><p class="scenario-intro">Sluit de uitzondering pas na bevestiging van de verantwoordelijke partner. Ook deze stap wijzigt geen orderstatus of ETA.</p>${button("Oplossing bevestigen", "resolve-exception", "secondary", "check", `data-id="${ex.id}" ${ex.state === "Opgelost" ? "disabled" : ""}`)}`,
    `IMPACTVERKENNER · ${ex.id}`,
  );
}
function showNewOrder() {
  openAction(
    "Webshoporder simuleren",
    `<p class="scenario-intro">Orders ontstaan altijd in de webshop, nooit in de Control Tower. Dit formulier bootst die aanlevering na voor de demo. Eén ordernummer blijft door de hele keten gelijk; adres en order zijn na plaatsing niet meer te wijzigen.</p><form id="order-form"><div class="form-grid"><label class="field">Klantnaam<input name="customer" required maxlength="80" placeholder="Bijvoorbeeld Studio Noord"></label><label class="field">Klanttype<select name="type"><option>B2B</option><option>B2C</option></select></label><label class="field">Product<select name="sku">${state.inventory.map((i) => `<option value="${i.sku}">${i.sku} · ${inventoryFor(i.sku).available} beschikbaar</option>`).join("")}</select></label><label class="field">Aantal<input name="quantity" type="number" required min="1" max="10000" step="1" value="100"></label><label class="field">Gewenste / beloofde leverdatum<input name="promised" type="date" min="2026-11-17" value="2026-11-20" required></label><label class="field">Goedgekeurde ontwerpversie<input name="design" value="ONT-DEMO · v1 · goedgekeurd" required maxlength="100"></label><label class="field">Straat<input name="street" required value="Demostraat" maxlength="80"></label><label class="field">Huisnummer<input name="number" required value="12" maxlength="12"></label><label class="field">Postcode<input name="postal" required pattern="[1-9][0-9]{3} ?[A-Za-z]{2}" value="1234 AB"></label><label class="field">Plaats<input name="city" required value="Utrecht" maxlength="60"></label></div><label class="checkbox"><input name="priority" type="checkbox"> B2B-prioriteit (wijzigt bestaande reserveringen niet)</label><div class="section-note">De leverbelofte wordt alleen geaccepteerd bij voldoende beschikbare voorraad. Er wordt nog geen voorraad gereserveerd.</div><p class="form-error" role="alert" id="order-error"></p><div class="form-actions">${button("Annuleren", "close-action")}<button class="button lime" type="submit">Controleer & maak order</button></div></form>`,
  );
}
function compose(id) {
  const o = state.orders.find((o) => o.id === id);
  const ex = orderExceptions(o);
  const body = `Beste ${o.customer},\n\nJe bestelling ${o.id} heeft de bevestigde status ‘${stages[o.stage]}’.${ex.length ? " " + ex.map((e) => e.cause).join(" ") : ""}\nDe verwachte levering is ${o.eta ? date(o.eta) + " (schatting)" : "nog onbekend"}. De oorspronkelijke leverbelofte is ${date(o.promised)}.\n\nMet vriendelijke groet,\nGIFTS4U`;
  openAction(
    "Een heldere update voor de klant",
    `<form id="message-form" data-id="${id}"><p class="scenario-intro">Gebaseerd op ${o.events.at(-1).id} · ${timestamp(o.events.at(-1).time)} · ${o.events.at(-1).source}</p><div class="form-grid"><label class="field">Ontvanger<input name="recipient" type="email" required value="${o.id.toLowerCase()}@example.test"></label><label class="field">Kanaal<select name="channel"><option>E-mail</option><option>Telefoonnotitie</option></select></label></div><label class="field">Toegewezen medewerker<input name="owner" required value="Sophie · Control Tower-beheerder" maxlength="80"></label><label class="field">Bericht<textarea name="body" required maxlength="2000" style="min-height:210px">${escapeHTML(body)}</textarea></label><div class="section-note">Dit registreert een gesimuleerde verzending. Er wordt geen e-mail of ander bericht verstuurd.</div><div class="form-actions"><button class="button lime" type="submit">Simuleer verzending</button></div></form>`,
  );
}
function showSettings() {
  openAction(
    "Jouw werkruimte",
    `<div class="status-box"><strong>${OPERATOR}</strong><p>Eén beheerder volgt de keten, beoordeelt uitzonderingen en registreert besluiten. Partners leveren gegevens; zij bedienen deze werkruimte niet.</p></div><h3>Partnerdemo</h3><p class="scenario-intro">Test externe gegevens zoals een nieuwe webshoporder, goederenontvangst of een DHL-bevestiging. Dit opent alleen demohandelingen; je wisselt niet van gebruiker.</p><div class="button-row">${button(partnerDemo ? "Sluit partnerdemo" : "Open partnerdemo", "toggle-partner-demo", "lime")}${button(state.offline ? "Herstel Printz-verbinding" : "Simuleer Printz offline", "toggle-offline", "secondary", "globe")}</div><div class="section-note">Vaste demodag: 16 november 2026. Nieuwe handelingen krijgen het werkelijke tijdstip. ${storageOK ? "Wijzigingen blijven lokaal bewaard; Partnerdemo staat na herladen weer uit." : "Opslag is niet beschikbaar; wijzigingen zijn tijdelijk."}</div><div class="button-row">${button("Test alarmdrempel", "threshold", "secondary", "alert")}${button("Herstel startdemo", "reset-confirm", "secondary", "history")}</div>`,
  );
}
function showHelp() {
  openAction(
    "Welkom in de Control Tower",
    `<p class="scenario-intro">Je werkt als ${OPERATOR}. Alle orders en partnergegevens zijn fictief.</p><ol class="help-steps"><li><strong>Begin bij het overzicht.</strong> Bekijk bevestigde status, leverbelofte en geschatte levering.</li><li><strong>Open G4U-1048.</strong> De order staat In bedrukking; de storing is een aparte uitzondering.</li><li><strong>Verken herstelopties.</strong> Vergelijk scenario’s zonder de bevestigde gegevens te wijzigen.</li><li><strong>Registreer een bevoegd besluit.</strong> Vermeld beslisser, actiehouder en deadline. Je blijft dezelfde beheerder.</li><li><strong>Volg de partnerbevestiging op.</strong> Leg de aangeleverde ETA vast en coördineer de klantupdate.</li></ol><div class="section-note">Via SV open je Partnerdemo voor externe testgegevens. / opent zoeken; Escape sluit een venster.</div><a class="button secondary" href="walkthrough.md" target="_blank" rel="noopener">Open de walkthrough</a>`,
  );
}
function showThreshold() {
  openAction(
    "Wanneer gaat het alarm aan?",
    `<p class="scenario-intro">De regel is strikt groter dan 20%. De opdrachtgever moet deze grens nog valideren.</p><form id="threshold-form"><div class="form-grid"><label class="field">Beloofde looptijd (dagen)<input name="planned" type="number" min="0.1" step="0.01" value="5" required></label><label class="field">Verwachte looptijd (dagen)<input name="expected" type="number" min="0.1" step="0.01" value="6" required></label></div><button class="button secondary" type="submit">Bereken alarm</button><div class="status-box" id="threshold-result" role="status">5 → 6 dagen = precies 20%. Geen &gt;20%-alarm.</div></form>`,
  );
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const { action, id } = target.dataset;
  if (partnerActions.has(action) && !partnerDemo) return;
  switch (action) {
    case "close-action":
      actionDialog.close();
      break;
    case "close-detail":
      detailDialog.close();
      break;
    case "help":
      showHelp();
      break;
    case "settings":
      showSettings();
      break;
    case "exceptions":
      navigate("uitzonderingen");
      break;
    case "all-orders":
      navigate("orders");
      break;
    case "partners":
      navigate("import");
      break;
    case "order":
      showOrder(id);
      break;
    case "scenario-order":
      actionDialog.close();
      showOrder(id);
      break;
    case "filter":
      filter = id;
      page = 1;
      render();
      break;
    case "prev":
      page = Math.max(1, page - 1);
      render();
      break;
    case "next":
      page++;
      render();
      break;
    case "new-order":
      showNewOrder();
      break;
    case "advance":
      advance(id);
      break;
    case "scenario":
      showScenario(id);
      break;
    case "scenario-choice":
      scenario = id;
      showScenario(scenarioException, true);
      break;
    case "toggle-partner-demo":
      partnerDemo = !partnerDemo;
      actionDialog.close();
      refresh();
      toast(partnerDemo ? "Partnerdemo geopend. Je blijft de beheerder." : "Partnerdemo gesloten.");
      break;
    case "compose":
      compose(id);
      break;
    case "report-problem":
      openAction(
        "Probleem of klacht registreren",
        `<form id="problem-form" data-id="${id}"><label class="field">Type probleem<select name="kind"><option value="address">Adresprobleem</option><option value="delivery">Mislukte afleverpoging</option><option value="photo">Verkeerde personalisatie</option></select></label><label class="field">Oorzaak<input name="cause" required maxlength="250"></label><label class="field">Eigenaar<input name="owner" required value="Sophie · Control Tower-beheerder" maxlength="80"></label><label class="field">Volgende actie<select name="next"><option>Adres controleren en opnieuw aanbieden</option><option>Retour afstemmen</option><option>Herdruk voorbereiden</option><option>Vervanging voorbereiden</option></select></label><button class="button lime" type="submit">Registreer probleem</button></form>`,
      );
      break;
    case "resolve-exception":
      openAction(
        "Oplossing bevestigen",
        `<form id="resolve-form" data-id="${id}"><label class="field">Bevestiging van de partner<textarea name="proof" required maxlength="600" placeholder="Wie heeft welke oplossing bevestigd?"></textarea></label><label class="checkbox"><input type="checkbox" required> De oorzaak is verholpen voor alle gekoppelde orders.</label><button class="button lime" type="submit">Sluit uitzondering</button></form>`,
      );
      break;
    case "threshold":
      showThreshold();
      break;
    case "toggle-offline":
      state.offline = !state.offline;
      audit(
        state.offline
          ? "Printz-uitwisseling mislukt; laatste bevestiging behouden."
          : "Printz-verbinding hersteld (simulatie).",
        "Printz",
        "SYNC",
      );
      refresh();
      showSettings();
      break;
    case "reset-confirm":
      openAction(
        "Startdemo herstellen?",
        `<p class="scenario-intro">Dit verwijdert alleen de orders en wijzigingen van dit prototype in deze browser. De startset met 50 orders wordt opnieuw geladen.</p><div class="form-actions">${button("Annuleren", "close-action")}${button("Herstel startdemo", "reset", "lime")}</div>`,
      );
      break;
    case "reset":
      state = createDemo();
      partnerDemo = false;
      query = "";
      filter = "alle";
      page = 1;
      selectedOrder = null;
      document.querySelector("#global-search").value = "";
      detailDialog.close();
      actionDialog.close();
      refresh();
      toast("De startdemo is hersteld.");
      break;
    case "duplicate": {
      const o = state.orders.find((o) => o.id === id);
      const count = o.events.length;
      addEvent(o, o.stage);
      audit(
        `Dubbel event ${o.events.at(-1).id} genegeerd; ${count} ordergebeurtenissen behouden.`,
        "Control Tower",
        id,
      );
      refresh();
      toast(
        "Dubbel event herkend. Status en aantal gebeurtenissen zijn ongewijzigd.",
      );
      break;
    }
    case "eta": {
      const o = state.orders.find((o) => o.id === id);
      openAction(
        "Een nieuwe verwachting",
        `<form id="eta-form" data-id="${id}"><p class="scenario-intro">De leverbelofte blijft ${date(o.promised)}. Een nieuwe ETA is een schatting en verandert de bevestigde status niet.</p><label class="field">Verwachte levering (leeg = onbekend)<input name="eta" type="date" min="${o.created}" value="${o.eta || ""}"></label><label class="field">Bron van de verwachting<select name="source"><option>Printz</option><option>DHL</option><option>Import</option><option>Magazijn</option></select></label><label class="field">Reden<input name="reason" required maxlength="200" placeholder="Partner bevestigt beschikbare extra shift"></label><button class="button lime" type="submit">Verwachting vastleggen</button></form>`,
      );
      break;
    }
    case "receive": {
      const item = state.imports.find((i) => i.id === id);
      if (item.received) break;
      openAction(
        "Werkelijke ontvangst bevestigen",
        `<form id="receive-form" data-id="${escapeHTML(id)}"><p class="scenario-intro">${escapeHTML(id)} · ${item.sku} · verwacht: ${item.quantity} stuks.</p><label class="field">Werkelijk ontvangen aantal<input name="quantity" type="number" min="1" max="${item.quantity}" step="1" required value="${item.quantity}"></label><label class="checkbox"><input required type="checkbox"> De goederen zijn fysiek ontvangen en geteld.</label><button class="button lime" type="submit">Voeg toe aan voorraad</button></form>`,
      );
      break;
    }
    case "delay-import": {
      const item = state.imports.find((i) => i.id === id);
      if (!item || item.received || item.delayed) break;
      openAction(
        "Vertraging bij Hongkong simuleren",
        `<form id="delay-form" data-id="${escapeHTML(id)}"><p class="scenario-intro">${escapeHTML(id)} · ${fmt(item.quantity)} stuks ${item.sku}. Hongkong meldt alleen <strong>Delayed</strong>; de oorzaak noteer je zelf als die bekend is.</p><label class="field">Oorzaak<select name="cause"><option>Douane: zending zit vast</option><option>Brand in Hongkong</option><option>Oorzaak nog onbekend</option></select></label><div class="form-actions">${button("Annuleren", "close-action")}<button class="button lime" type="submit">Registreer Delayed</button></div></form>`,
      );
      break;
    }
    case "batch":
      openAction(
        "Batchaantal verhogen",
        `<form id="batch-form"><p class="scenario-intro">Voor drukke periodes zoals Kerst en Valentijn bestel je per partij meer bij Hongkong. Dit is een aangepaste bestelling, nog geen fysieke voorraad.</p><div class="form-grid"><label class="field">Product<select name="sku">${state.inventory.map((i) => `<option value="${i.sku}">${i.sku} · nu ${fmt(i.batch)} per partij</option>`).join("")}</select></label><label class="field">Nieuw batchaantal (stuks)<input name="quantity" type="number" required min="1" max="100000" step="1" value="1000"></label></div><label class="field">Reden<select name="reason"><option>Kerst</option><option>Valentijn</option><option>Andere piekperiode</option></select></label><p class="form-error" role="alert" id="batch-error"></p><div class="form-actions">${button("Annuleren", "close-action")}<button class="button lime" type="submit">Batch verhogen</button></div></form>`,
      );
      break;
    case "new-import":
      openAction(
        "Inkomende partij registreren",
        `<form id="import-form"><label class="field">Unieke zendingreferentie<input name="reference" required maxlength="40" placeholder="HK-2026-083"></label><label class="field">Leverancier<input name="supplier" required value="Harbour Gifts · Hongkong" maxlength="80"></label><div class="form-grid"><label class="field">SKU<select name="sku">${state.inventory.map((i) => `<option>${i.sku}</option>`).join("")}</select></label><label class="field">Aantal<input name="quantity" type="number" required min="1" max="100000" step="1"></label></div><label class="field">ETA · schatting (1 dag verwerking + 10 werkdagen)<input name="eta" type="date" value="${hongKongEta()}"></label><p id="import-error" class="form-error" role="alert"></p><button class="button lime" type="submit">Registreer partij</button></form>`,
      );
      break;
    case "capacity":
      openAction(
        "Transportcapaciteit plannen",
        `<form id="capacity-form"><p class="scenario-intro">Planning voor ${date(DEMO_DATE)}. Een tekort veroorzaakt een aparte uitzondering voor nog niet opgehaalde orders.</p><div class="form-grid"><label class="field">Geplande pakketten<input name="planned" type="number" min="0" max="100000" step="1" value="${state.transport.planned}" required></label><label class="field">Beschikbare capaciteit<input name="capacity" type="number" min="0" max="100000" step="1" value="${state.transport.capacity}" required></label></div><button class="button lime" type="submit">Sla planning op</button></form>`,
      );
      break;
    case "report-print": {
      const orders = state.orders.filter((o) => o.stage === 3);
      openAction(
        "Printstoring registreren",
        `<form id="fault-form"><label class="field">Getroffen order<select name="order">${orders.map((o) => `<option>${o.id}</option>`).join("")}</select></label><label class="field">Oorzaak<input name="cause" required placeholder="Printmachine tijdelijk niet beschikbaar" maxlength="250"></label><label class="field">Actiehouder<input name="owner" required value="Milan · Printz" maxlength="80"></label><button class="button lime" type="submit" ${orders.length ? "" : "disabled"}>Registreer uitzondering</button></form>`,
      );
      break;
    }
    case "export":
      download(
        "gifts4u-orders-demo.csv",
        "\uFEFFOrder;Klant;Type;SKU;Aantal;Bevestigde status;Leverbelofte;ETA schatting\n" +
          state.orders
            .map((o) =>
              [
                o.id,
                o.customer,
                o.type,
                o.sku,
                o.quantity,
                stages[o.stage],
                o.promised,
                o.eta || "Onbekend",
              ]
                .map(csvCell)
                .join(";"),
            )
            .join("\n"),
        "text/csv;charset=utf-8",
      );
      break;
    case "export-audit":
      download(
        "gifts4u-logboek-demo.json",
        JSON.stringify(state.audit, null, 2),
        "application/json",
      );
      break;
  }
});
function csvCell(value) {
  let text = String(value);
  if (/^[=+@\-\t\r]/.test(text)) text = "'" + text;
  return '"' + text.replaceAll('"', '""') + '"';
}
function download(name, content, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast("Demo-export gedownload.");
}
document.addEventListener("submit", (event) => {
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) return;
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = Object.fromEntries(new FormData(form));
  if (partnerForms.has(form.id) && !partnerDemo) return;
  const id = form.dataset.id;
  const o = state.orders.find((order) => order.id === id);
  switch (form.id) {
    case "order-form": {
      const quantity = Number(data.quantity);
      if (!data.customer.trim() || !data.design.trim()) {
        document.querySelector("#order-error").textContent =
          "Vul een klantnaam en ontwerpversie in.";
        return;
      }
      if (quantity > inventoryFor(data.sku).available) {
        document.querySelector("#order-error").textContent =
          `Onvoldoende voorraad: ${inventoryFor(data.sku).available} beschikbaar, ${quantity} gevraagd. Er is geen order of leverbelofte bevestigd.`;
        return;
      }
      const next =
        Math.max(
          ...state.orders.map((order) => Number(order.id.split("-")[1])),
        ) + 1;
      const order = {
        id: `G4U-${next}`,
        customer: data.customer.trim(),
        type: data.type,
        sku: data.sku,
        quantity,
        stage: 0,
        created: DEMO_DATE,
        promised: data.promised,
        eta: data.promised,
        priority: data.type === "B2B" && data.priority === "on",
        design: data.design,
        address: {
          street: data.street.trim(),
          number: data.number.trim(),
          postal: data.postal.toUpperCase(),
          city: data.city.trim(),
        },
        shipment: `DHL-DEMO-${next}`,
        qc: false,
        reserved: false,
        events: [
          {
            id: `EV-G4U-${next}-0`,
            label: stages[0],
            source: "Webshop",
            actor: OPERATOR,
            simulated: true,
            time: now(),
          },
        ],
      };
      state.orders.unshift(order);
      audit(
        `${order.id} ontvangen; voorraad en leverbelofte gecontroleerd.`,
        "Webshop",
        order.id,
      );
      actionDialog.close();
      refresh();
      showOrder(order.id);
      toast(
        "Order aangemaakt. Reserveer voorraad via de volgende bevestiging.",
      );
      return;
    }
    case "qc-form":
      if (!o || o.stage !== 3) return;
      if (state.offline) {
        toast("Printz is offline; vrijgave is niet bevestigd.");
        return;
      }
      o.qc = true;
      addEvent(o, 4);
      break;
    case "shipping-form":
      if (!o || ![4, 5].includes(o.stage)) return;
      if (o.stage === 4 && !o.qc) {
        toast("Kwaliteitscontrole ontbreekt.");
        return;
      }
      if (!data.number.trim() || (o.stage === 5 && !data.proof.trim())) {
        toast("Vul een huisnummer en, bij aflevering, bewijsreferentie in.");
        return;
      }
      o.address.postal = data.postal;
      o.address.number = data.number;
      addEvent(o, o.stage + 1, data.proof || "Overdracht bevestigd");
      o.events.at(-1).time = new Date(data.eventTime).toISOString();
      break;
    case "decision-form": {
      if (!data.authorized || !data.decidedBy?.trim()) {
        toast("Vermeld de beslisser en bevestig dat het besluit bevoegd is genomen.");
        return;
      }
      const ex = state.exceptions.find((e) => e.id === id);
      state.decisions.unshift({
        id: uid(),
        exception: id,
        option: scenarioOptions(ex)[scenario === "extra" ? 0 : 1],
        reason: data.reason,
        decidedBy: data.decidedBy.trim(),
        recordedBy: OPERATOR,
        owner: data.owner,
        deadline: new Date(data.deadline).toISOString(),
        time: now(),
      });
      ex.owner = data.owner;
      ex.next = "Actie uitvoeren en partnerbevestiging ophalen";
      ex.state = "In behandeling";
      audit(
        `Besluit voor ${id} geregistreerd; beslisser ${data.decidedBy.trim()}; actiehouder ${data.owner}.`,
        "Control Tower",
        id,
      );
      actionDialog.close();
      refresh();
      toast("Besluit vastgelegd. Orderstatus en ETA zijn ongewijzigd.");
      return;
    }
    case "message-form":
      state.messages.unshift({
        id: uid(),
        orderId: id,
        ...data,
        event: o.events.at(-1).id,
        time: now(),
        status: "Gesimuleerd verzonden",
      });
      audit(
        `Klantupdate gesimuleerd via ${data.channel} aan ${data.recipient}.`,
        "Klantcommunicatie",
        id,
      );
      break;
    case "eta-form":
      if (state.offline && data.source === "Printz") {
        toast("Printz is offline. De verwachting is niet bijgewerkt.");
        return;
      }
      o.eta = data.eta || null;
      audit(
        `ETA voor ${id}: ${o.eta || "onbekend"} (schatting). Reden: ${data.reason}.`,
        data.source,
        id,
      );
      break;
    case "receive-form": {
      const item = state.imports.find((i) => i.id === id);
      if (!item || item.received) return;
      const quantity = Number(data.quantity);
      if (quantity < 1 || quantity > item.quantity) return;
      item.received = true;
      item.delayed = false;
      item.actual = quantity;
      item.receivedAt = now();
      state.inventory.find((i) => i.sku === item.sku).physical += quantity;
      audit(
        `Stock Received: ${quantity} stuks ${item.sku}; verwacht ${item.quantity}, verschil ${item.quantity - quantity}.`,
        "Magazijn",
        id,
      );
      break;
    }
    case "import-form":
      if (state.imports.some((i) => i.id === data.reference.trim())) {
        document.querySelector("#import-error").textContent =
          "Deze zendingreferentie bestaat al. Kies een unieke referentie.";
        return;
      }
      state.imports.push({
        id: data.reference.trim(),
        supplier: data.supplier,
        sku: data.sku,
        quantity: Number(data.quantity),
        eta: data.eta || null,
        received: false,
        delayed: false,
      });
      audit(
        `Inkomende partij ${data.reference} geregistreerd; ${data.quantity} stuks ${data.sku}.`,
        "Import",
        data.reference,
      );
      break;
    case "capacity-form": {
      state.transport = {
        planned: Number(data.planned),
        capacity: Number(data.capacity),
      };
      if (state.transport.planned > state.transport.capacity) {
        const affected = state.orders
          .filter((order) => order.stage === 4)
          .map((order) => order.id);
        const existing = activeExceptions().find((e) => e.kind === "capacity");
        const cause = `${state.transport.planned} geplande pakketten bij ${state.transport.capacity} beschikbare plekken.`;
        if (existing) {
          existing.cause = cause;
          existing.orders = affected;
        } else
          addException({
            title: "Transportcapaciteit tekort",
            service: "DHL",
            kind: "capacity",
            cause,
            owner: "Daan · Logistiek",
            next: "Extra capaciteit afstemmen",
            urgency: "Hoog",
            orders: affected,
            impact: "Leverdatum nog onbekend",
          });
      }
      audit(
        `DHL-planning: ${data.planned} pakketten, capaciteit ${data.capacity}.`,
        "DHL",
        "PLANNING",
      );
      break;
    }
    case "delay-form": {
      const item = state.imports.find((i) => i.id === id);
      if (!item || item.received || item.delayed) return;
      item.delayed = true;
      item.delayCause = data.cause;
      item.eta = null;
      // Orders die nog op deze SKU wachten, raken de vertraging.
      const affected = state.orders
        .filter((order) => order.sku === item.sku && order.stage === 0)
        .map((order) => order.id);
      addException({
        title: `Importvertraging · ${data.cause}`,
        service: "Import",
        kind: "delay",
        record: item.id,
        cause: `Hongkong meldt Delayed voor ${item.id} (${fmt(item.quantity)} stuks ${item.sku}).`,
        owner: "Lotte · Inkoop",
        next: "Nieuwe ETA of spoedverzoek bij Hongkong",
        urgency: "Hoog",
        orders: affected,
        impact: "Leverdatum nog onbekend",
      });
      break;
    }
    case "batch-form": {
      const item = state.inventory.find((i) => i.sku === data.sku);
      const quantity = Number(data.quantity);
      if (!item) return;
      if (!Number.isInteger(quantity) || quantity <= item.batch) {
        document.querySelector("#batch-error").textContent =
          `Kies meer dan het huidige batchaantal (${fmt(item.batch)} stuks).`;
        return;
      }
      const before = item.batch;
      item.batch = quantity;
      audit(
        `Batchaantal ${item.sku} verhoogd van ${before} naar ${quantity} stuks (${data.reason}); bestelling bij Hongkong aangepast, nog geen fysieke voorraad.`,
        "Control Tower",
        item.sku,
      );
      break;
    }
    case "fault-form":
      addException({
        title: "Printstoring gemeld",
        service: "Printz",
        kind: "print",
        cause: data.cause,
        owner: data.owner,
        next: "Herstelcapaciteit afstemmen",
        urgency: "Kritiek",
        orders: [data.order],
        impact: "Leverdatum nog onbekend",
      });
      break;
    case "problem-form":
      addException({
        title: {
          address: "Adresprobleem",
          delivery: "Aflevering mislukt",
          photo: "Klacht: verkeerde personalisatie",
        }[data.kind],
        service: data.kind === "photo" ? "Klantcommunicatie" : "DHL",
        kind: data.kind,
        cause: `${o.shipment} / ${id}: ${data.cause}`,
        owner: data.owner,
        next: data.next,
        urgency: "Hoog",
        orders: [id],
        impact: "Leverdatum nog onbekend",
      });
      break;
    case "resolve-form": {
      const ex = state.exceptions.find((e) => e.id === id);
      if (!ex || ex.state === "Opgelost") return;
      ex.state = "Opgelost";
      ex.resolvedAt = now();
      ex.resolution = data.proof;
      audit(
        `Uitzondering ${id} gesloten na bevestiging: ${data.proof}.`,
        ex.service,
        id,
      );
      break;
    }
    case "threshold-form": {
      const planned = Math.round(Number(data.planned) * 100),
        expected = Math.round(Number(data.expected) * 100);
      const percent = ((expected - planned) / planned) * 100;
      document.querySelector("#threshold-result").textContent =
        `${fmt(percent)}% extra looptijd. ${exceedsThreshold(planned, expected) ? "Wel een >20%-alarm." : "Geen >20%-alarm."}`;
      return;
    }
    default:
      return;
  }
  actionDialog.close();
  refresh();
  toast("De handeling is vastgelegd in de lokale demo.");
});
document.querySelector("#global-search").addEventListener("input", (event) => {
  query = event.target.value;
  page = 1;
  if (!["overzicht", "orders", "printz", "dhl"].includes(view)) {
    view = "orders";
    location.hash = view;
  }
  render();
});
window.addEventListener("hashchange", () => {
  const next = location.hash.slice(1);
  if (nav.some((n) => n[0] === next) && next !== view) {
    view = next;
    page = 1;
    filter = "alle";
    render();
  }
});
document.addEventListener("keydown", (event) => {
  if (
    event.key === "/" &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.altKey &&
    !actionDialog.open &&
    !detailDialog.open &&
    !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)
  ) {
    event.preventDefault();
    document.querySelector("#global-search").focus();
  }
});
render();
if (!storageOK)
  toast(
    "Lokale opslag is niet beschikbaar. De demo werkt tijdelijk in dit venster.",
  );
