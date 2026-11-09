# GIFTS-4-U Control Tower — Proof of Concept

> Project voor *Supply Chain Management for ICT* (2026-2027), IT Studio.
> Wij zijn het ICT-projectteam. De klant is de **Director Supply Chain Management** van GIFTS-4-U.

---

## 1. Context

**GIFTS-4-U** verkoopt gepersonaliseerde cadeaus (blanco T-shirts, mokken, knuffels, kussens, dekbedovertrekken, telefoonhoesjes) aan **B2C- en B2B-klanten**, via webshop en fysieke winkel. De producten komen uit China (Hong Kong), de personalisatie gebeurt door een print-partner.

**Probleem:** de belofte aan de klant (right product, quantity, place, time, condition) staat onder druk.

| Gebied | Probleem |
|---|---|
| Availability | Producten niet beschikbaar, orders die we niet kunnen leveren |
| Fulfilment | Late leveringen, verkeerd adres, niets aangekomen |
| Communication | Klanten krijgen geen updates, klachten nemen toe |

**Gevolg:** klanten lopen weg, winst is gedaald, het bedrijf draait verlies.

**Oorzaak:** de oude webshop-applicatie is geen geïntegreerd supply-chain-systeem. Partners worden handmatig gecoördineerd (spreadsheets en e-mail) en er is **geen gedeeld overzicht** van orders, voorraad en uitzonderingen.

## 2. Opdracht

Bouw een **geïntegreerde proof of concept (PoC)**: een **Control Tower** die de informatie van alle partners combineert tot een **actionable operational overview**.

- **Primaire focus:** de Control Tower.
- **Ondersteunend:** vereenvoudigde webshop/store, print-service en LSP-interfaces om de scenario's te kunnen demonstreren.
- **Randvoorwaarden:** budget is beschikbaar, leveranciers en LSP werken mee.
- De klant bepaalt de **uitkomsten**, niet de technische architectuur. Wij ontdekken de requirements zelf.
- **Authenticatie** mag simpel blijven, security is geen aandachtspunt voor deze opdracht.

### Partners in de keten (5 bedrijven)

```
B2C/B2B klant → 1. GIFTS-4-U Webstore → 2. GIFTS-4-U Warehouse (Middelburg)
              → 3. LSP (DHL) → 5. PRINTZ (Middelburg, personalisatie) → 3. LSP (DHL) → klant

4. Hong Kong Novelty Goods Inc. (exporter) → 3. LSP (DHL) → Warehouse Middelburg
```

Drie stromen die samenkomen: **goods flow**, **information flow** en **money flow**.

### SKU-structuur

Een SKU (Stock Keeping Unit) is een unieke identifier voor een product in voorraad. Formaat: `<product> <maat> <kleur>`.

| SKU | Betekenis |
|---|---|
| `01 S B` | Knuffel, small, bruin |
| `02 L W` | Mok, large, wit |
| `03 M P` | T-shirt, medium, roze |

Het systeem moet weten **wat we bezitten, waar het is en of het beschikbaar is om te beloven (available to promise)**.

---

## 3. Wat de Control Tower moet kunnen

**See, Act, Communicate** — zichtbaarheid moet leiden tot beslissingen en opvolging.

### See
- Actuele order-, voorraad-, print- en zendingstatus
- Beloofde leverdatum, laatste update, trends in de tijd
- Verantwoordelijke partner per order

### Act
- Uitzonderingen herkennen, prioriteit en verantwoordelijke tonen
- **Wie moeten we bellen om het te fixen?** (bijv. geen drivers beschikbaar: toon contactpersoon van de LSP)
- **Tasklist in het control panel** waar de meldingen binnenkomen
- Alerts versturen en opvolging bijhouden

### Communicate
- Berichten uitwisselen met partners
- Zinvolle statusupdates naar eindklanten

### Voorraad en reorder
- Zakt de voorraad in het warehouse onder een bepaald niveau, dan komt er een **status/melding**
- **Reorder point:** automatisch nabestellen bij de exporter in Hong Kong

### Prioriteit B2B
- Vult een klant een **KvK-nummer** (of bedrijfsgegevens) in, dan geldt de bestelling als **B2B-aankoop** en krijgt die **hogere prioriteit**

### Statussen
Een status moet altijd een **echte gebeurtenis** vertegenwoordigen.

- **Normaal verloop:** order ontvangen → voorraad gereserveerd → naar print → printing → ready to ship → in transit → delivered
- **Uitzonderingen:** niet op voorraad, vast in douane, printmachine-storing, te weinig carrier-capaciteit, mislukte levering
- **Retouren:** retour aangevraagd → beoordeeld → retourontvangst → herprint, vervanging of refund

### Dashboard (3 views)

| View | Inhoud |
|---|---|
| **Live overview** | Open orders per status, voorraadrisico's, vertraagde printjobs, zendingen, uitzonderingen, laatste update, verantwoordelijke partner |
| **Trends / KPI's** | On-time delivery, order-cycle time, orders >20% vertraagd, retouren, tekorten, print turnaround time |
| **High-priority alerts** | E-mail bij extra-hoge prioriteit: betrokken order(s), probleem, urgentie, eigenaar, volgende actie |

---

## 4. KPI-regel: vertraging

> Een order wordt geflagd als de werkelijke of verwachte levertijd **meer dan 120%** van de oorspronkelijk beloofde levertijd is.

- Beloofde levertijd = beloofde leverdatum − orderdatum
- Voorbeeld: beloofd 5 dagen, 20% marge = 1 dag. Flag bij **meer dan 6 dagen**. Precies 6 dagen is **niet** geflagd.
- Dit is een voorgestelde interpretatie → **valideren met de klant**.

---

## 5. Scenario's om te demonstreren

**Set A — vraag en voorraad**
1. **Christmas rush:** orders stijgen sterk. Toon voorraad- en capaciteitsrisico's, orderstatus en klantverwachtingen.
2. **SKU-tekort:** een SKU (bijv. mok, kussen, dekbedovertrek) is op. Identificeer de geraakte orders en coördineer een reactie.
3. **B2B-priority:** een bulkorder concurreert om voorraad/capaciteit. Toon de impact op bestaande B2B- en B2C-beloftes.

**Set B — capaciteit en retouren**
4. **Printing breakdown:** machine valt uit of printen duurt veel langer. Toon geraakte orders, herziene verwachtingen en opvolging.
5. **LSP-onderbezetting:** te weinig voertuigen of personeel. Toon de impact en klantupdates.
6. **Verkeerde foto / retour:** gepersonaliseerd product heeft de verkeerde afbeelding. Toon de retourstroom en een duurzame oplossing.

---

## 6. Werkwijze (agile)

| Onderdeel | Aanpak |
|---|---|
| **Requirements list** | Business needs, gebruikers, functioneel en non-functioneel, prioriteiten, open vragen |
| **Acceptance criteria** | Elke requirement testbaar maken: data, eigenaarschap, uitzonderingsregels, observeerbaar resultaat |
| **Iteratief leveren** | Eerst een kleine end-to-end flow, demo, feedback van de klant, daarna uitbreiden |

Bijvoorbeeld acceptance criterium: *1 dag te laat is acceptabel* (zie KPI-regel).

### Planning

| Fase | Duur | Inhoud |
|---|---|---|
| **Sprint 0** | 1 week | Analyse en ontwerp. **Projectplan deze week:** wie doet wat en wanneer |
| **Sprint 1** | 2 weken | Bouwen en opleveren |

**Wekelijks ritme**

| Dag | Activiteit |
|---|---|
| Maandag | **Demo aan de klant**. Deadline **release en sprint report** |
| Dinsdag | Coachingsessie IT Studio |
| Donderdag | IT Studio |

---

## 7. Op te leveren

Het eindassessment is een **portfolio** met:

- [ ] **Functional Design Specification** (design document)
- [ ] Projectplan (wie doet wat en wanneer)
- [ ] Requirements list met acceptance criteria
- [ ] **Sprint reports** (bewijs van hoe het proces verliep)
- [ ] Release / werkende proof of concept van de Control Tower
- [ ] Demo's aan de klant en verwerkte feedback

---

## 8. Team

Iedereen in het team heeft een **andere rol** en een eigen **business context** (de vijf bedrijven in de keten).

| Teamlid | Rol | Business context (bedrijf) |
|---|---|---|
| Immanuel | _nog invullen_ | _nog invullen_ |
| Jarno | _nog invullen_ | _nog invullen_ |
| Sahim | _nog invullen_ | _nog invullen_ |
| Ashraf | _nog invullen_ | _nog invullen_ |

---

## 9. Open vragen voor de klant

- Is de 120%-regel voor vertraging correct geïnterpreteerd?
- Welke reorder points gelden per SKU en welke bestelhoeveelheid richting Hong Kong?
- Wie is het aanspreekpunt per partner (DHL, PRINTZ, exporter) bij een uitzondering?
- Hoe wordt een B2B-klant precies herkend (alleen KvK-nummer of meer)?
- Welke alerts gelden als "extra hoge prioriteit" en wie ontvangt de e-mail?

---

## 10. Begrippen

| Term | Betekenis |
|---|---|
| SCM | Supply Chain Management: coördinatie van supply, operations en delivery over organisaties heen |
| SKU | Stock Keeping Unit |
| Control Tower | Centraal overzicht dat partnerinformatie combineert tot acties |
| LSP | Logistics Service Provider (hier DHL) |
| ATP | Available to promise: voorraad die we kunnen beloven |
| Reorder point | Voorraadniveau waarbij automatisch nabesteld wordt |
| 7 R's | Right product, quantity, condition, place, time, customer, cost |
