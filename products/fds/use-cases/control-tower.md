# UC-CT-01 — Keteninformatie beoordelen en opvolgen

Concept voor review · #186 / #180. Primaire actor: **Control Tower-beheerder**. Ondersteunende systemen: de vijf partner-API's. De directeur kan buiten het systeem een besluit nemen; de beheerder registreert het besluit met de bevoegde beslisser. Partners zijn geen extra menselijke Control Tower-gebruikers.

## Doel en grens

De beheerder ziet de laatst bevestigde ketengegevens, onderscheidt die van prognoses en uitzonderingen, en volgt een noodzakelijke actie op. Eén uitvoering begint bij het beoordelen van een order of uitzondering en eindigt bij een vastgelegde actie of beoordeling zonder actie. Externe productie- en vervoershandelingen worden niet door de Control Tower als voltooid aangenomen.

Bronnen: FR-CT-01/02/03/04/06/07/08/09/10/11, NFR-01/02/03/04/07/08; stories #146–#154, #159–#162, #165–#166 en #170–#179. [UCD](../ucd/control-tower.md), [proces](../activity/control-tower.md), [DFD](../dfd/control-tower.md), [API](../api/control-tower.openapi.json).

## Trigger, pre- en postcondities

- Trigger: de beheerder opent het overzicht of beoordeelt een gemelde uitzondering.
- Vooraf: beheerder is bevoegd; gegevens hebben een bekende bron en tijd. Ontbrekende data mogen expliciet onbekend zijn.
- Succes: de beoordeling en eventuele actie bevatten order/exception, besluit, beslisser, eigenaar, deadline en auditinformatie. Bevestigde status blijft gebaseerd op werkelijke partner-events.
- Minimale garantie: fouten of een nieuwe ETA veranderen geen bevestigde status; onbevoegde wijzigingen worden afgewezen.

## Hoofdscenario

| Stap | Actor/systeem | Gedrag |
| --- | --- | --- |
| H1 | Partner → Control Tower | Biedt een event met stabiele ID, bron, aggregate/order-ID en gebeurtenistijd aan. |
| H2 | Control Tower | Controleert service-identiteit, schema, duplicaten en conflicten; bewaart event en projectie samen. |
| H3 | Beheerder | Opent overzicht, filtert en kiest een order/uitzondering. |
| H4 | Control Tower | Toont bevestigde status, oorspronkelijke belofte, ETA als schatting, bron/tijden, voorraad en onafhankelijke uitzonderingen. |
| H5 | Beheerder | Beoordeelt oorzaak, getroffen orders, mogelijke impact, urgentie en eigenaar. |
| H6 | Beheerder | Vraagt indien nodig een bevoegd besluit buiten het systeem en legt besluit, beslisser en onderbouwing vast. |
| H7 | Control Tower | Controleert bevoegdheid en actuele exceptionversie; bewaart besluit/actie met eigenaar en deadline. |
| H8 | Beheerder | Volgt partnerbevestiging op; laat een klantupdate voorbereiden op basis van feiten of expliciet onbekende ETA. |
| H9 | Beheerder | Sluit de uitzondering pas na gecontroleerde oplossing, met reden en historie. |

## Alternatieven en herstel

| Situatie | Afhandeling |
| --- | --- |
| Geen actie nodig | Leg beoordeling vast; verander geen partnerstatus. |
| Exact duplicaat | Geef bestaande ontvangst terug; geen tweede audit-/tijdlijnitem. |
| Zelfde bron/event-ID met andere inhoud | 409; bewaar oorspronkelijke inhoud en maak conflict zichtbaar voor opvolging. |
| Onbekende order of partij | Quarantaine/afwijzing volgens berichttype; verzin geen orderdetails. Het initiële Order Received-event mag de eerste projectie aanmaken. |
| Late of verkeerd geordende gebeurtenis | Bewaar geschiedenis waar geldig, maar laat de actuele bevestigde status niet stilzwijgend terugvallen. Definitieve ordenings-/correctieregels worden per partner bevestigd. |
| Partner onbereikbaar / ontbrekende bevestiging | Toon synchronisatieprobleem en laatst bevestigde gegevens. Een timeout is geen bewijs van mislukte opslag bij de partner. |
| ETA onbekend | Toon ‘nog onbekend’; overschrijf oorspronkelijke leverbelofte niet. |
| Twee beheerdersessies wijzigen dezelfde exception | Versiecontrole: tweede wijziging krijgt conflict en moet actuele gegevens herladen. |
| Onbevoegd besluit of opslagfout | Geen succes claimen; geen gedeeltelijke actie versturen. |

## Acceptatiecriteria

1. Hetzelfde oorspronkelijke order-ID verbindt alle relevante ontvangen events en de orderhistorie.
2. Een printstoring bij status Printing creëert een exception zonder de status te vervangen.
3. ETA, oorspronkelijke belofte, confirmed status en synchronisatie zijn afzonderlijke velden en herkenbaar in de UI.
4. Een exact opnieuw ontvangen event verschijnt eenmaal, ook na herstart; een inhoudelijk conflict overschrijft geen eerdere registratie.
5. Elk besluit noemt de bevoegde beslisser, actor, betrokken order/exception, eigenaar, deadline en tijdstip.
6. Zonder autorisatie of bij versieconflict ontstaat geen besluit/actie; na fout blijft de laatste bevestigde toestand zichtbaar.
7. Klantcommunicatie gebruikt alleen een bevestigd event of expliciet benoemd risico; verzonden en gesimuleerde berichten blijven te onderscheiden.

## Implementatiegrens

De [PoC](../../../code/supply-chain-poc/README.md) bewijst alleen ontvangst van Order Received, persistente projectie, idempotentie en een leesbaar orderoverzicht. Besluiten, exceptions, partnerstatusovergangen, echte authenticatie van de beheerder, KPI's en klantcommunicatie zijn ontwerp en vervolgwerk. De lokale demo is geen productievoorziening.

Te reviewen: mandaat beheerder versus beslisser, dataminimalisatie, afhandeling late events, exceptionversies en verantwoordelijkheden. De >20%-KPI uit FR-CT-05 is nog door de opdrachtgever te valideren en wordt niet als vastgestelde regel uitgebreid.
