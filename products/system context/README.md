# GIFTS4U — systeemcontext

Dit product beschrijft **wie het GIFTS4U-platform gebruikt** en **welke gegevens de systeemgrens passeren**. Het bestaat uit een use-casediagram (UCD) en een Level 0 Data Flow Diagram (DFD). Alle use cases hebben een concrete menselijke rol, waaronder manager, directeur en partnermedewerker.

Productissue: [#73](https://github.com/Immanuel-Cairo/gifts4u-control-tower/issues/73). Gerelateerd aan #70 en #71. Het bestaande [Nederlandstalige prototype](../prototype/index.html) en de [walkthrough](../prototype/walkthrough.md) zijn opgeleverd via #4 / PR #5.

## Diagrammen openen

- [Use-casediagram — SVG](use-case-diagram.svg), direct te openen in een browser; [PlantUML-bron](use-case-diagram.puml).
- [DFD niveau 0 — SVG](dfd-level-0.svg), direct te openen in een browser; [Mermaid-bron](dfd-level-0.mmd).

![Use cases en gebruikersrollen](use-case-diagram.svg)

![DFD niveau 0](dfd-level-0.svg)

De kleuren sluiten aan op het prototype: donkere kop, lichte werkruimte, limegroene accenten en paars voor de diagrammen. De SVG's zijn lokaal te bekijken en gebruiken geen externe scripts of lettertypen. Zoom in op de diagrammen voor bespreking of druk ze liggend af op groot formaat.

## Systeemgrens en bronnen

**Binnen de grens:** het gehele beoogde GIFTS4U-platform, inclusief webshop/orders, importregistratie, voorraad, Printz- en DHL-functionaliteit, klantcommunicatie en Control Tower. Deze functies worden op contextniveau als één systeem beschouwd. De fysieke bedrijven Printz en DHL en hun medewerkers blijven buiten die grens. Hun interne software is niet uitgewerkt als extra actor: de technische koppelingen zijn nog niet vastgesteld.

**Buiten de grens:** klanten, leverancier Hongkong en de medewerkers die informatie invoeren of ontvangen. Een medewerker van GIFTS4U is ook een externe actor ten opzichte van de software. Goederen, machines, douaneafhandeling en echte transporthandelingen vallen buiten de softwaregrens; alleen de registratie daarvan passeert de grens. Betaling, automatische inkoop en financiële administratie zijn hier niet gespecificeerd.

Deze keuze is voor beide diagrammen gelijk. Het DFD gebruikt de conventie **niveau 0 = contextdiagram**: één cirkelvormig proces met nummer 0, externe entiteiten en gegevensstromen. Interne databases en service-aanroepen horen bij een latere decompositie. Het UCD gebruikt menselijke actoren, ellipsen en een systeemkader; associatielijnen betekenen deelname, geen volgorde of gegevensrichting.

Bronvolgorde:

1. [Requirements en acceptatiecriteria](../../documents/Requirments/GIFTS4U_Requirements.md), versie op `main` bij commit `6677d6a`: 43 functionele en acht niet-functionele eisen, inclusief de nog te beoordelen Q&A-aanvullingen.
2. [Open opdrachtgevervragen](../../documents/Vragen/open-vragen-opdrachtgever.md), voor beslissingen die nog niet vaststaan.
3. [Stakeholderanalyse](../../documents/Stakeholders-analyse/stakeholderanalyse.md) en [probleemstelling](../../documents/Problemen/probleemstelling.md), voor de keten en betrokken partijen.
4. [Prototypewalkthrough](../prototype/walkthrough.md), voor de ontwerpuitwerking. Deze beschrijft een eerdere requirementsversie en is geen bewijs dat alle nieuwe eisen al zijn geïmplementeerd.

Dit is een ontwerp van het beoogde systeem, geen verklaring dat de voorbeeldbackend of het prototype alle eisen uitvoert. `docs/REQUIREMENTS.md` en de interviewbestanden bevatten nog templates en zijn niet gebruikt als ingevulde requirementsbron.

## Afstemming op de FDS- en UX-lessen

De volgende lesbestanden zijn als referentie gecontroleerd. Ze staan lokaal in Downloads en zijn niet naar deze repository gekopieerd. De dianummers hieronder zijn de posities in het PowerPoint-bestand; paginanummers verwijzen naar de PDF.

| Referentie | Richtlijn uit de les | Toepassing op dit product |
| --- | --- | --- |
| `2026-Semester3-UVC-FDS-Class1-Final.pptx`, dia 34–38 | Groepeer requirements tot beknopte gebruikersdoelen; elke actor en elke use case heeft minstens één associatie. Actoren beschrijven rollen, niet individuele personen. | UC01–UC16 zijn contextdoelen met een primaire rol en requirementkoppelingen. Manager en directeur blijven afzonderlijke rollen. |
| Hetzelfde bestand, dia 36 | Use cases bevatten actieve werkwoorden; actor- en use-casenamen gebruiken Title Case. Actorassociaties zijn gewone lijnen zonder pijl. | De diagramlabels volgen die schrijfwijze; doelen staan in ellipsen binnen de systeemgrens en rollen erbuiten. De Nederlandse lopende tekst gebruikt normale zinskapitalisatie. |
| Hetzelfde bestand, dia 50–52 | `include` betreft verplicht gedeeld gedrag; `extend` optioneel aanvullend gedrag. Vermijd overerving voor deze cursus. | Dit contextoverzicht toont zelfstandige doelen zonder onnodige `include`-/`extend`-relaties of overerving. De optionele impactverkenner blijft een ontwerpvariant binnen UC02. |
| `2026-Semester3-UVE-FDS-Class3-Final.pptx`, dia 9–11, 14 en 17 | Een Level 0 DFD toont het gehele systeem als één procescirkel met externe bronnen/bestemmingen. Gerichte pijlen benoemen gegevens; de diagrammen moeten onderling overeenstemmen. | Eén proces 0, negen externe partijen en F01–F17. Het proces heet “GIFTS4U-orderketen beheren”; de stromen benoemen gegevensgroepen. Geen interne datastores op dit niveau. |
| `2026-Semester3-UVE-FDS-Class4-Final.pptx`, dia 6 | Expliciete verduidelijking: precies één procescirkel op niveau 0; zelfstandige naamwoorden boven gegevensstromen. | De eerdere afgeronde procesrechthoek is vervangen door een echte cirkel in SVG én Mermaid. |
| `uxd-lesson-2-flows-and-frames-v2.pdf`, pagina 9, 15 en 18 | Scenario's beschrijven de gebruikerservaring; use cases systeeminteracties. Een user flow beschrijft stappen, beslissingen en navigatie. | Het herstelvoorbeeld is een scenario ter toelichting. UCD-lijnen betekenen deelname en DFD-pijlen gegevensuitwisseling; geen van beide is een scherm- of navigatieflow. |

Een UML-actor kan volgens de FDS-les ook een extern systeem of een trigger zijn. In dit product hebben alle use cases op verzoek een menselijke rol; dat is een projectkeuze, geen algemene UML-beperking. Er worden geen onbevestigde externe API's of triggers toegevoegd. Gedetailleerde use-casespecificaties en activiteitendiagrammen blijven afzonderlijke producten.

## Rollen en use cases

De onderstaande contextdoelen worden aangeduid met **UC01–UC16**. Ze vervangen niet de fijnmazige `UC-WEB-*`, `UC-CT-*` enzovoort uit de requirements. Een primaire rol initieert of draagt verantwoordelijkheid voor het doel; de rolmatrix is een voorstel voor de nog vast te stellen autorisatiematrix.

| Use case | Primaire menselijke rol | Doel / zichtbaar resultaat | Requirements |
| --- | --- | --- | --- |
| UC01 Ketenoverzicht raadplegen | Manager / ketenregisseur | Orders filteren, voorraad en orderdetails bekijken; urgente zaken, oorzaken, KPI's en dashboardmeldingen herkennen. | FR-CT-01, FR-CT-05, FR-CT-06, FR-CT-07, FR-CT-08, FR-CT-09, FR-CT-10, FR-CT-11 |
| UC02 Uitzonderingen en impact beoordelen | Manager / ketenregisseur | Bevestigde status scheiden van uitzondering; betrokken orders, eigenaar en volgende actie bepalen. Optioneel herstelopties verkennen. | FR-CT-02, FR-CT-03, FR-IMP-04 |
| UC03 Corrigerend besluit vastleggen en toewijzen | Directeur / eigenaar | Bij een escalatie een actie kiezen, eigenaar en deadline vastleggen. | FR-CT-04 |
| UC04 Besluit en opvolging controleren | Directeur / eigenaar | Vastgelegd besluit en bijbehorende acties terugvinden in het controleerbare log. Geen apart goedkeuringsproces verondersteld. | FR-CT-04, NFR-03 |
| UC05 Importpartijen registreren en volgen | Importcoördinator | Partij met SKU, aantal en referentie registreren; ETA en bevestigde gebeurtenissen volgen. Leveranciersmedewerker is ondersteunende actor. | FR-IMP-01, FR-IMP-02 |
| UC06 Importvertraging registreren | Importcoördinator | Douane- of andere importvertraging aan een partij koppelen; orderimpact tonen aan de manager. | FR-IMP-03, FR-IMP-04 |
| UC07 Voorraad ontvangen, plannen en reserveren | Magazijnmedewerker | Werkelijke ontvangst boeken, beschikbare aantallen bekijken, reserveren en tekorten signaleren. Bevoegde medewerker plant een hoger batchaantal. | FR-IMP-05, FR-MAG-01, FR-MAG-02, FR-MAG-03, FR-MAG-04, FR-MAG-06 |
| UC08 Overdracht naar Printz bevestigen | Magazijnmedewerker | Bevestigde overdracht met order, aantallen en tijdstip vastleggen. | FR-MAG-05 |
| UC09 Printopdracht uitvoeren en kwaliteit vrijgeven | Printz-medewerker | Juiste ontwerpversie raadplegen, start bevestigen en na kwaliteitscontrole verzendklaar melden. | FR-PRT-01, FR-PRT-02, FR-PRT-04, FR-PRT-05 |
| UC10 Printstoring of capaciteitstekort melden | Printz-medewerker | Getroffen orders en oorzaak vastleggen zonder de bevestigde orderstatus te vervangen. | FR-PRT-03 |
| UC11 Zending volgen en gebeurtenissen bevestigen | DHL-medewerker | Bestemming en vervoersfase raadplegen; ophaling, aflevering met bewijs, ETA en adres-/afleverproblemen vastleggen. | FR-DHL-01, FR-DHL-02, FR-DHL-04, FR-DHL-05 |
| UC12 Transportcapaciteit plannen | DHL-medewerker | Vervoersvraag en capaciteit per datum vergelijken; tekort signaleren. | FR-DHL-03 |
| UC13 Klantupdate opstellen en afhandeling vastleggen | Klantenservice / accountmanager | Op basis van events/risico's een bericht opstellen, toewijzen en de verzend- en afhandelstatus registreren. | FR-KLM-01, FR-KLM-02, FR-KLM-03, FR-KLM-04 |
| UC14 Personalisatieklacht registreren en opvolgen | Klantenservice / accountmanager | Klacht koppelen aan order, oorzaak en gekozen retour, herdruk of vervanging. | FR-KLM-05 |
| UC15 Bestelling plaatsen met personalisatie | Klant (B2B / B2C) | Geldige bestelling en leverbelofte vastleggen na voorraadcontrole; B2B-prioriteit behouden; adreswijziging en annulering na plaatsing blokkeren. | FR-WEB-01, FR-WEB-02, FR-WEB-03, FR-WEB-04, FR-WEB-05, FR-WEB-06 |
| UC16 Orderupdates ontvangen | Klant (B2B / B2C) | Bevestigde status en zo nodig oorzaak en geschatte ETA ontvangen. Ontvangende actor; dit veronderstelt geen zelfstandig klantportaal. | FR-KLM-01, FR-KLM-02 |

**Manager is niet automatisch directeur.** De manager onderzoekt en coördineert; alleen de directeur legt het corrigerende directiebesluit vast. In een klein bedrijf kan één persoon beide rollen hebben. Bevoegdheden worden aan rollen gekoppeld, niet aan een persoonsnaam. Het model kent ook uitvoerende rollen toe: niet elke handeling is een managementtaak.

## Gegevenswoordenboek bij het DFD

Elke pijl is afzonderlijk gericht. “In” betekent naar proces 0; “uit” betekent naar de externe partij. Een gegevensstroom kan meerdere records bundelen en zegt niets over het gekozen protocol of de timing.

| ID | Richting / partij | Inhoud en betekenis |
| --- | --- | --- |
| F01 | In — manager | Zoek-/filtercriteria, uitzonderingsbeoordeling, eigenaar en volgende actie. Scenario-invoer is optioneel ontwerpvoorstel. |
| F02 | Uit — manager | Orderbeeld, voorraad in aantallen, KPI's, meldingen, oorzaken en impact. Scenariouitkomst blijft een voorstel. |
| F03 | In — directeur | Corrigerend besluit, betrokken uitzondering, actiehouder en deadline. |
| F04 | Uit — directeur | Kritieke escalatie met orderimpact; vastgelegde besluiten en opvolgingslog. |
| F05 | In — importcoördinator | Partijreferentie, leverancier, SKU, aantallen, bron en importuitzondering. |
| F06 | Uit — importcoördinator | Geregistreerde partij, bevestigde events, geschatte aankomst en afhankelijke orders. |
| F07 | In — magazijnmedewerker | Werkelijk ontvangen aantal, reserveringsopdracht, bevestigd overdrachtsevent; geplande batchverhoging als apart gegeven. |
| F08 | Uit — magazijnmedewerker | Fysieke, gereserveerde en beschikbare voorraad; reserveringsresultaat, tekort en geplande batchaantallen. |
| F09 | In — klant | Klanttype, orderregels, adres, personalisatie, gewenste datum; klachtinformatie via klantenservice. Geen rechtstreekse klantlogin verondersteld. |
| F10 | Uit — klant | Ordernummer, leverbelofte en bevestiging; statusupdate, vertragingsoorzaak en ETA of expliciet onbekend. |
| F11 | In — leverancier Hongkong | Zendingreferentie, SKU, aantallen, ETA en bevestigde transport-/vertragingsgegevens. Mag via de importcoördinator binnenkomen; geen directe API verondersteld. |
| F12 | In — Printz-medewerker | Productiestart, kwaliteitscontrole, verzendklaarbevestiging, storing en capaciteitstekort met bron/tijdstip. |
| F13 | Uit — Printz-medewerker | Order-ID, SKU, aantal, goedgekeurde ontwerpversie en toegewezen herstelactie; geen onnodige klantgegevens. |
| F14 | In — DHL-medewerker | Ophaling, vervoersfase, afleverbewijs, gewijzigde ETA, beschikbare capaciteit en transportuitzondering. |
| F15 | Uit — DHL-medewerker | Order-/zending-ID, benodigde aflevergegevens, vervoersvraag en toegewezen actie; geen klantfoto voor bedrukking. |
| F16 | In — klantenservice/accountmanager | Concept/bericht, ontvanger, kanaal, toegewezen medewerker, afhandeling en personalisatieklacht met vervolgactie. |
| F17 | Uit — klantenservice/accountmanager | Laatste bevestigde ordergegevens, oorzaak, leverbelofte, ETA, communicatielog en open/afgehandelde werkvoorraad. |

F09 en F16 representeren de herkomst respectievelijk verwerking van klachtgegevens; dit zijn geen twee aparte klachten. Evenzo zijn F11 en F05 bron en registratie van importgegevens. De diagrammen tonen geen verplichte dubbele invoer.

## Creatieve oplossing: een impactverkenner met overdracht per rol

De bestaande prototypegedachte wordt in UC02 zichtbaar als een **optionele ontwerpuitbreiding**: de manager vergelijkt bij een printstoring een extra shift met reguliere herstart. Een voorstel toont getroffen orders, verwachte tijdwinst, kostenindicatie en onzekerheden. De directeur kan vervolgens in UC03 een besluit vastleggen. Een toegewezen Printz-medewerker bevestigt later de uitvoering, waarna klantenservice een passende update maakt.

De scheiding voorkomt dat een mooie voorspelling al als nieuwe werkelijkheid wordt opgeslagen:

1. **Signaal:** Printz meldt een storing (UC10, F12). De order blijft bijvoorbeeld “In bedrukking”.
2. **Verkenning:** manager beoordeelt impact en optionele scenario's (UC02, F01/F02). Ontbrekende gegevens blijven onbekend.
3. **Besluit:** directeur legt actie, eigenaar en deadline vast (UC03, F03/F04). Dit is nog geen bevestiging van uitvoering of nieuwe ETA.
4. **Bevestiging:** de uitvoerende partner levert een nieuwe bevestiging; de oorspronkelijke leverbelofte blijft bestaan.
5. **Communicatie:** klantenservice legt de klantupdate en afhandeling vast (UC13, F16/F17); de klant ontvangt de update (UC16, F10).

De scenarioberekening, extra-shiftkosten en tijdwinst zijn geen vastgestelde requirements of gegarandeerde optimalisatie. De bedragen uit de prototypewalkthrough zijn fictieve demowaarden. Het contextdiagram voegt hiervoor geen nieuw extern systeem toe.

## Randvoorwaarden en open ontwerpbesluiten

- **Rollen en privacy (NFR-01, NFR-06):** toegang moet later per actie én gegeven worden afgedwongen. De lijnen in het UCD zijn geen volledige rechtenmatrix. De rolwissel in het prototype biedt geen echte beveiliging.
- **Events en log (NFR-02, NFR-03):** event-ID, bron, tijdstip, actor en betrokken record maken verwerking herleidbaar; dezelfde event-ID mag niet twee keer wijzigen.
- **Onzekerheid (NFR-04, NFR-08):** mislukte gegevensuitwisseling verandert de laatste bevestiging niet. Status, prognose, risico en uitzondering blijven afzonderlijk herkenbaar.
- **Prestaties en behoud (NFR-05, NFR-07):** drie seconden bij minimaal 50 testorders en behoud na herstart vragen aparte implementatie- en acceptatietests; de diagrammen bewijzen deze eigenschappen niet.
- **Batchverhoging (FR-MAG-06):** modelleren als verhoging van geplande batchaantallen; fysieke voorraad stijgt alleen door bevestigde ontvangst (FR-MAG-02). De precieze betekenis en bevoegde rol moeten worden afgestemd, omdat de Q&A-eis hier dubbelzinnig is.
- **Leverancier:** de precieze aanleverroute van F11 is nog vast te stellen. Er is geen uitgaande leveranciersstroom getekend: automatische inkoop en goedkeuring zijn nog open vragen. Douane is geen apart gekoppeld systeem zolang een directe gegevenskoppeling niet is afgesproken.
- **Beleid:** de >20%-alarmgrens, kalender-/werkdagen, escalatiecriteria, backorders, deellevering en automatische inkoop blijven open conform de opdrachtgevervragen. Het diagram kent daar geen definitieve regel aan toe.
- **Klantinteractie:** bestelling en ontvangst van updates zijn contextdoelen van de beoogde webshop. De huidige Control Tower-demo laat medewerkers sommige klantacties simuleren. Het diagram stelt geen volledige webshop of klantportaal als gerealiseerd voor.

## Onderhoud en controle

De tekstbronnen en SVG's worden samen uit [generate_diagrams.py](generate_diagrams.py) gegenereerd. Pas rollen, doelen, stromen of layout daar aan en voer vanuit de repositoryroot uit:

```powershell
python "products/system context/generate_diagrams.py"
git diff --check
```

Geen installatie, netwerkverzoek of externe renderer nodig voor de SVG's. De losse `.puml`- en `.mmd`-bestanden zijn beschikbaar voor verdere bewerking met PlantUML of Mermaid; zij kunnen een andere automatische layout krijgen. Houd bij inhoudelijke wijzigingen ook deze rolmatrix en het gegevenswoordenboek bij.

Uitgevoerde controle op 18 november 2026: beide SVG's lokaal gerenderd met resvg en visueel beoordeeld; XML en lokale documentlinks gecontroleerd; alle 43 FR-ID's teruggevonden in de rolmatrix; alle 16 use cases gekoppeld aan rollen; alle 17 DFD-stromen aanwezig. De 12 bestaande prototypetests slagen. De SVG-weergaven zijn gecontroleerd; een afzonderlijke PlantUML-/Mermaid-rendering is niet uitgevoerd.

Reviewpunten: dezelfde systeemgrens in beide diagrammen; alle 16 use cases verbonden met een menselijke rol; alle 43 functionele eisen terug te vinden; precies één DFD-proces zonder interne datastore; richting en betekenis van F01–F17; leesbare labels; herkenbare aannames. Inhoudelijke review door een teamgenoot en validatie van de open besluiten door de opdrachtgever blijven nodig vóór acceptatie.
