# UC-DHL-02 - Transportstatus registreren met bewijs

## Identificatie en doel

| Onderdeel | Specificatie |
| --- | --- |
| Organisatie | DHL / Transport binnen GIFTS-4-U Control Tower |
| Use case | UC-DHL-02 |
| Doel | Een werkelijk uitgevoerde ophaling of aflevering betrouwbaar registreren en de bevestigde transportstatus delen met de Control Tower. |
| Primaire actor | Bevoegde DHL-medewerker die een transportgebeurtenis registreert. |
| Ondersteunend systeem | Control Tower, ontvanger van de bevestigde gebeurtenis. |
| Systeemgrens | De DHL-service, inclusief de bediening voor DHL-medewerkers en de opslag van zendingen en transportgebeurtenissen. |
| Prioriteit | MUST HAVE: [FR-DHL-02, issue #30](https://github.com/Immanuel-Cairo/gifts4u-control-tower/issues/30). |
| Producttaak | DHL-UC-01, [issue #80](https://github.com/Immanuel-Cairo/gifts4u-control-tower/issues/80); onderdeel van [DHL-epic #14](https://github.com/Immanuel-Cairo/gifts4u-control-tower/issues/14). |
| Status | Concept voor inhoudelijke peer review; beschrijft gewenst gedrag, geen gerealiseerde software. |

**User story:** Als DHL-medewerker wil ik een ophaling of aflevering met het bijbehorende bewijs registreren, zodat DHL en de Control Tower de werkelijke voortgang van dezelfde zending tonen.

Dit is meer dan een statusveld wijzigen: de service controleert bevoegdheid, bewijs, dubbele gebeurtenissen en de volgorde van statussen. Ook bij een fout in de gegevensuitwisseling moet duidelijk blijven wat daadwerkelijk bevestigd is.

## Afbakening

Eén uitvoering verwerkt **één transportgebeurtenis voor één zending**: een ophaling of een aflevering. De fysieke rit en de tijd tussen ophalen en afleveren vallen buiten deze uitvoering. Voor aflevering start de medewerker later een nieuwe uitvoering.

Het aanmaken van een zending, capaciteitsplanning (FR-DHL-03), adres-/afleverproblemen (FR-DHL-04), ETA-wijzigingen (FR-DHL-05) en klantberichten zijn afzonderlijke use cases. Een mislukte afleverpoging is geen succesvolle aflevering en mag dus geen `Delivered` opleveren. Deze use case wijzigt geen ETA, oorspronkelijke leverbelofte, adres of klantontwerp.

## Trigger en voorwaarden

**Trigger:** Na een werkelijk uitgevoerde ophaling of aflevering kiest de DHL-medewerker om die gebeurtenis te registreren.

**Precondities:**

- De medewerker heeft een account en een actieve sessie. De service controleert bij uitvoering opnieuw de bevoegdheid voor de zending.
- De zending bestaat en is gekoppeld aan het oorspronkelijke GIFTS-4-U-order-ID.
- De medewerker beschikt over de gebeurtenisgegevens en de bijbehorende bevestiging of het afleverbewijs. Ontbrekende of ongeldige invoer wordt tijdens de uitvoering afgewezen.
- Voor ophaling is de zending verzendklaar; voor aflevering bestaat een bevestigde ophaling. Deze strikte volgorderegel is ontwerpkeuze O1 hieronder.

**Postconditie bij volledig succes:** De gebeurtenis, bewijsverwijzing, actor, bron en tijden zijn opgeslagen; de DHL-status is correct bijgewerkt; dezelfde gebeurtenis is één keer zichtbaar bij de juiste order in de Control Tower.

**Postconditie bij gedeeltelijk succes:** DHL heeft de gebeurtenis duurzaam geregistreerd, maar de uitwisseling met de Control Tower is nog niet bevestigd. De synchronisatiefout is zichtbaar en de update blijft beschikbaar voor opnieuw verzenden.

**Minimale garantie bij afwijzing:** Er ontstaat geen nieuwe bevestigde transportgebeurtenis en de laatst bevestigde status blijft behouden. Een exacte herhaling van een eerder geaccepteerd event verandert niets nogmaals.

## Benodigde gegevens

Dit is een logisch gegevensoverzicht, nog geen API-contract.

| Gegeven | Betekenis en controle |
| --- | --- |
| Event-ID | Unieke, bij een retry ongewijzigde identificatie van de gebeurtenis; voorkomt dubbele verwerking (NFR-02). |
| Zending-ID | Identificeert een bestaande zending waarvoor de actor bevoegd is. |
| Order-ID | Wordt uit de zending afgeleid en blijft door de keten hetzelfde (FR-CT-01). |
| Gebeurtenistype | `Ophaling bevestigd` of `Aflevering bevestigd`; andere types vallen buiten deze use case. |
| Gebeurtenistijd | Tijdstip waarop de gebeurtenis werkelijk plaatsvond, met tijdzone; dit is geen ETA. |
| Bron | Herleidbare bron van de bevestiging, bijvoorbeeld een DHL-registratie. De service controleert dat de bron is toegestaan. |
| Bewijsverwijzing | Voor ophaling een herleidbare overdrachts-/ophaalbevestiging; voor aflevering een geldig afleverbewijs voor dezelfde zending. |
| Actor en registratietijd | Door de service bepaald vanuit de sessie en de klok; naast de gebeurtenistijd opgeslagen voor het auditspoor. |
| Synchronisatiestatus | Afzonderlijk van de transportstatus: te verzenden, bevestigd of synchronisatieprobleem. |

## Hoofdscenario H - Ophaling bevestigen

| Stap | Actor of systeem | Actie en resultaat |
| --- | --- | --- |
| H1 | DHL-medewerker | Selecteert een zending en start de registratie van een transportgebeurtenis. |
| H2 | DHL-service | Controleert sessie, bevoegdheid en het bestaan van de zending. Toont het order-ID en de laatst bevestigde transportstatus, met alleen noodzakelijke aflevergegevens. |
| H3 | DHL-medewerker | Kiest `Ophaling bevestigd`, vult gebeurtenistijd en bron in, koppelt de ophaalbevestiging en dient de registratie in met een stabiel event-ID. |
| H4 | DHL-service | Controleert verplichte gegevens, toegestane bron en het bijbehorende bewijs. Bij aflevering gelden de controles uit A1. |
| H5 | DHL-service | Controleert of het event-ID al is verwerkt. Een exacte herhaling volgt A2; hetzelfde ID met andere inhoud volgt E4. |
| H6 | DHL-service | Controleert de statusovergang en gebeurtenisvolgorde: een nieuwe ophaling mag volgens O1 alleen vanaf `Ready to Ship` naar `In Transit`. |
| H7 | DHL-service | Slaat event, bewijsverwijzing, auditgegevens, nieuwe status `In Transit` en een te verzenden update samen op. Controleert hierbij opnieuw op gelijktijdige wijziging of dubbele verwerking. |
| H8 | DHL-service | Verstuurt de opgeslagen update met event-ID, zending-ID, order-ID, bevestigde status, bron en gebeurtenistijd naar de Control Tower. |
| H9 | Control Tower | Verwerkt de update idempotent bij de juiste order en bevestigt ontvangst. De status verschijnt als bevestigd event, los van ETA en eventuele uitzonderingen. |
| H10 | DHL-service | Legt de ontvangstbevestiging vast en toont aan de medewerker dat registratie en synchronisatie zijn geslaagd. |

## Alternatieve scenario's

| ID en instappunt | Verloop | Eindresultaat |
| --- | --- | --- |
| A1 - Aflevering, H3 | De medewerker kiest `Aflevering bevestigd` en koppelt afleverbewijs. H4 controleert het bewijs voor dezelfde zending. H6 vereist volgens O1 de status `In Transit` en een gebeurtenistijd die niet voor de bevestigde ophaling ligt. H7 registreert `Delivered`; H8-H10 verlopen gelijk. | Aflevering is met bewijs geregistreerd en gedeeld. |
| A2 - Exact duplicaat, H5 of H7 | Het event-ID en alle inhoudelijke gegevens komen overeen met de opgeslagen gebeurtenis. De service toont het bestaande resultaat en de actuele synchronisatiestatus. Een nog openstaande synchronisatie kan via E6 opnieuw worden verstuurd met hetzelfde event-ID. | Geen tweede statuswijziging, gebeurtenis of tijdlijnitem. |
| A3 - Annuleren, voor H3 wordt ingediend | De medewerker verlaat het formulier zonder de registratie in te dienen. | De zending en status blijven ongewijzigd. |

## Uitzonderingen en herstel

| ID en instappunt | Fout en afhandeling | Status en vervolg |
| --- | --- | --- |
| E1 - H2 | Sessie ongeldig of medewerker niet bevoegd: toegang weigeren zonder zendinggegevens vrij te geven. | Geen wijziging; opnieuw aanmelden of bevoegdheid laten controleren. |
| E2 - H2 | Zending bestaat niet: melden dat registratie niet mogelijk is. | Geen wijziging; juiste zending selecteren. |
| E3 - H4 | Gegevens ontbreken, bron is niet toegestaan of bewijs is ongeldig, ontbreekt of hoort bij een andere zending. Ook een niet-ondersteund gebeurtenistype wordt afgewezen. | Geen wijziging; concrete invoerfout tonen. Na correctie opnieuw indienen. Een oude ETA of een verstreken bezorgdatum telt nooit als bewijs. |
| E4 - H5/H6/H7 | Het event-ID is hergebruikt met andere inhoud, de overgang/volgorde is ongeldig, of een gelijktijdige wijziging heeft de uitgangsstatus veranderd. | Geen nieuwe status vastleggen. Conflict tonen en actuele gegevens laten herladen/beoordelen. Een oud event mag `Delivered` niet terugzetten naar `In Transit`. Een exact gelijktijdig duplicaat volgt A2. |
| E5 - H7 | Opslag van de registratie mislukt. De samenhangende wijziging wordt niet deels vastgelegd. | Geen succes tonen en geen update verzenden. Bij onbekende uitkomst na een timeout opnieuw opvragen/indienen met hetzelfde event-ID; een al opgeslagen event volgt A2. |
| E6 - H8-H10 | Control Tower onbereikbaar, update afgewezen, ontvangstbevestiging ontbreekt of kan bij DHL niet worden opgeslagen. | De lokale registratie blijft geldig. Toon `DHL geregistreerd - synchronisatieprobleem`; behoud de update voor retry. Zonder ontvangen update blijft in de Control Tower het vorige event staan. Bij verloren bevestiging kan het nieuwe event daar al zichtbaar zijn: toon bij DHL geen zekere synchronisatiestatus. |

**Herstel van E6:** Verzend de al opgeslagen update opnieuw, zonder de transportregistratie opnieuw uit te voeren. Gebruik hetzelfde event-ID, dezelfde inhoud, bron en gebeurtenistijd. De Control Tower maakt een eventueel al ontvangen event niet nogmaals aan en bevestigt ontvangst opnieuw. Pas na vastgelegde ontvangstbevestiging wordt de synchronisatiestatus bevestigd. Aantal retries en escalatie zijn nog af te spreken (O4).

## Bedrijfsregels en traceerbaarheid

| Regel | Afspraak | Requirement |
| --- | --- | --- |
| R1 | `In Transit` alleen na bevestigde overdracht/ophaling; `Delivered` alleen met afleverbewijs. Beide events hebben zending-ID, gebeurtenistijd en bron. | FR-DHL-02 / #30 |
| R2 | Dezelfde event-ID veroorzaakt niet tweemaal een wijziging. | NFR-02 |
| R3 | Bron, gebeurtenistijd, registratietijd, betrokken record en actor zijn terug te vinden. | NFR-03 |
| R4 | Mislukte uitwisseling is zichtbaar; onbevestigde ontvangst wordt niet als zeker gepresenteerd. | NFR-04 |
| R5 | Alleen bevoegde rollen krijgen toegang; DHL ziet noodzakelijke aflevergegevens en geen klantfoto voor bedrukking. | NFR-01, NFR-06 |
| R6 | Bevestigde transportstatus, geschatte ETA en open uitzonderingen blijven afzonderlijke gegevens. | NFR-08 |
| R7 | De Control Tower koppelt het event aan dezelfde oorspronkelijke order, met bron en tijdstip. | FR-CT-01 |

De bovenstaande eisen staan in het [requirementsdocument](../../documents/Requirments/GIFTS4U_Requirements.md). FR-PRT-05 levert de context voor `Ready to Ship`; dit product implementeert die Printz-use-case niet.

## Acceptatiecriteria

De criteria beschrijven gewenst gedrag voor latere implementatie en review; ze zijn nog geen geslaagde softwaretests.

| ID | Gegeven / wanneer | Dan |
| --- | --- | --- |
| AC1 | Een bevoegde medewerker registreert een nieuwe geldige ophaling voor een verzendklare zending. | Er ontstaat precies één event met zending-ID, bron, tijden, actor en bewijsverwijzing; de status wordt `In Transit` (H, R1/R3). |
| AC2 | Een zending staat op `In Transit` en wordt met geldig afleverbewijs en een geldige gebeurtenistijd afgeleverd. | De status wordt `Delivered`; bewijs en gebeurtenis zijn herleidbaar (A1, R1). |
| AC3 | Zending-ID, bron, gebeurtenistijd of het vereiste bewijs ontbreekt of is ongeldig. | Registratie wordt afgewezen met een concrete fout; status blijft gelijk (E2/E3, R1). |
| AC4 | Dezelfde gebeurtenis wordt tweemaal aangeboden, ook gelijktijdig of na een timeout. | DHL bewaart één registratie; de Control Tower toont maximaal één item per event-ID (A2, R2). |
| AC5 | Een event-ID wordt met andere inhoud aangeboden, of een oude ophaling volgt op `Delivered`. | Het conflict wordt gemeld; de bestaande registratie en status worden niet overschreven (E4, R2/O1). |
| AC6 | De opslag mislukt voordat de registratie is voltooid. | Geen gedeeltelijke bevestiging of nieuwe uitgaande update; bij onzekere uitkomst is retry met hetzelfde ID veilig (E5, O3). |
| AC7 | De lokale registratie slaagt maar de Control Tower bevestigt de uitwisseling niet. | DHL toont een synchronisatieprobleem en bewaart de update. Retry met hetzelfde event-ID herstelt de uitwisseling zonder dubbel event (E6, R2/R4). |
| AC8 | Een onbevoegde gebruiker probeert een zending te openen of te wijzigen. | Toegang wordt geweigerd; er worden geen zendinggegevens getoond of gewijzigd. Een bevoegde DHL-medewerker krijgt geen klantontwerp te zien (E1, R5). |
| AC9 | De Control Tower ontvangt een geldige bevestigde update. | Het event staat bij het oorspronkelijke order-ID met bron/tijd; ETA, leverbelofte en uitzonderingen blijven apart en ongewijzigd (H9, R6/R7). |
| AC10 | Een aflevering wordt zonder vooraf bevestigde ophaling of met een eerdere gebeurtenistijd ingediend. | De service meldt een volgordeconflict en bewaart de laatst bevestigde status (E4, ontwerpkeuze O1). |

## Ontwerpkeuzes en open vragen

Deze details zijn een voorstel voor de PoC en moeten met het team worden bevestigd; ze staan niet allemaal letterlijk in FR-DHL-02.

| ID | Voorgestelde keuze / nog te bevestigen vraag |
| --- | --- |
| O1 | Strikte overgang `Ready to Ship` -> `In Transit` -> `Delivered`, zonder terugval. Hoe moeten late of verkeerd geordende partnerberichten en correcties worden behandeld? Tot die afspraak is gemaakt worden conflicten ter beoordeling afgewezen. |
| O2 | Bewijs wordt als gecontroleerde verwijzing gekoppeld. Welke bewijssoorten, bronnen en geldigheidscontroles accepteert het team? In de PoC mag herkenbaar fictief bewijs worden gebruikt; dat bewijst geen echte DHL-koppeling. |
| O3 | Event, status, auditgegevens en uitgaande update worden als één samenhangende wijziging bewaard, met bescherming tegen concurrerende updates. De technische opslagoplossing volgt in het ontwerp. |
| O4 | Het event-ID blijft gelijk bij retries; beide services verwerken het idempotent. Wie geeft het ID uit, hoe vaak wordt opnieuw geprobeerd en wie behandelt blijvende synchronisatiefouten? |

## Samenhang en werkverantwoording

Het [activitydiagram, issue #81](https://github.com/Immanuel-Cairo/gifts4u-control-tower/issues/81) visualiseert dezezelfde uitvoering, inclusief A1/A2 en E1-E6. Het DFD en de API-specificatie zijn volgende, afzonderlijke producten.

Taak **DHL-UC-01** heeft een schatting van **2,5 uur** in issue #80. De student registreert zelf de werkelijk bestede tijd en een Toggl-referentie in dat issue. Peer review en Toggl-registratie zijn nog open; deze pagina levert daarvoor geen fictief bewijs.
