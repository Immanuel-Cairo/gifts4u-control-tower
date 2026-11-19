# GIFTS4U — systeemcontext van de Control Tower

Het use-casediagram toont het hele GIFTS4U-platform. De klant bestelt, het magazijn draagt producten over aan Printz en DHL bevestigt de aflevering. De ketenregisseur volgt deze gebeurtenissen in de Control Tower.

Productissue: [#73](https://github.com/Immanuel-Cairo/gifts4u-control-tower/issues/73). Pull request: [#74](https://github.com/Immanuel-Cairo/gifts4u-control-tower/pull/74). Gerelateerd aan #70 en #71.

## Diagrammen openen

- [Use-casediagram — SVG](use-case-diagram.svg) en bewerkbare [PlantUML-bron](use-case-diagram.puml).
- [DFD niveau 0 — SVG](dfd-level-0.svg) en [Mermaid-bron](dfd-level-0.mmd).

![Use cases van de klant, ketenpartners, directie en ketenregisseur](use-case-diagram.svg)

![Control Tower met externe gegevensstromen](dfd-level-0.svg)

## Systeemgrens

**Use-casediagram:** de systeemgrens omvat het GIFTS4U-platform en de diensten voor bestelling, import, voorraad, bedrukking, transport en klantcommunicatie.

**DFD niveau 0:** het centrale proces is de GIFTS4U Control Tower. Deze brengt ketengegevens samen, toont orders, voorraad, bevestigde status en verwachtingen, signaleert uitzonderingen en legt acties, besluiten en opvolging vast.

**Buiten de DFD-grens:** de beheerder als menselijke gebruiker, de tijd als triggerbron, plus webshop/orders, importregistratie, magazijn/voorraad, Printz, DHL en klantcommunicatie als externe informatiebronnen of ontvangende diensten. Een bron kan software, een partneroverzicht of handmatig aangeleverde informatie zijn. Het diagram legt nog geen API, protocol of automatische koppeling vast.

Orders plaatsen, goederen ontvangen, voorraad reserveren, bedrukken, kwaliteitscontrole uitvoeren en pakketten afleveren gebeuren in de keten buiten de Control Tower. De beheerder **volgt de geregistreerde uitkomsten** en stuurt bij. Klanten gebruiken de webshop en ontvangen berichten via de communicatiedienst; zij bedienen de Control Tower niet.

Het UCD toont de doelen van de actoren in de hele keten. Het DFD werkt de uitwisseling met externe bronnen uit; een externe DFD-entiteit is niet automatisch een ingelogde gebruiker. Het DFD heeft precies één procescirkel, nummer 0, en geen interne datastores. UCD-lijnen betekenen deelname; DFD-pijlen betekenen gegevensoverdracht, geen schermnavigatie.

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

"In" betekent naar proces 0; "uit" betekent vanuit de Control Tower. De acht externe entiteiten zijn één beheerder, zes gegevensbronnen/ontvangende diensten en de tijd. Het diagram bevat dertien gerichte stromen.

| ID | Richting / partij | Inhoud |
| --- | --- | --- |
| F01 | In — beheerder | Zoek- en filtercriteria, uitzonderingsbeoordeling, acties, besluit, actiehouder en deadline. Optionele scenario-invoer blijft een voorstel. In de demo ook gesimuleerde partnerevents (UC09), gemarkeerd als **Demo**. |
| F02 | Uit — beheerder | Orderbeeld, voorraad, partnerstatus, KPI's, dashboardmeldingen en vertragingsalarmen, impact, besluiten en opvolgingslog. |
| F03 | In — webshop/orderservice | Uniek order-ID (ongewijzigd in de hele keten), klanttype, één of meer orderregels, oorspronkelijke leverbelofte en bevestigd Order Received-event met bron/tijdstip. |
| F04 | In — leverancier Hongkong / import | Partijreferentie, SKU, hoeveelheid, verwachte aankomst (1 dag verwerking + ca. 10 werkdagen transport) en de status 'Delayed' bij vertraging (douane, brand of andere oorzaak). Hongkong levert geen voorraadstand en geen verdere details. |
| F05 | In — magazijn/voorraadservice | Fysieke, gereserveerde en beschikbare aantallen; bevestigde ontvangst en overdracht naar Printz; voorraadtekorten; handmatig verhoogde batchaantallen. |
| F06 | In — Printz | De vier statussen die de Control Tower moet kennen: opdracht ontvangen, in productie, gereed (na kwaliteitsvrijgave), verzonden; plus storing/capaciteitstekort met betrokken order-ID's, bron en tijdstip. Geen lijst van alle printopdrachten. |
| F07 | Uit — Printz | Toegewezen corrigerende actie met order/uitzondering, actiehouder en deadline. Dit is geen automatisch bewijs van uitvoering. |
| F08 | In — DHL | Zending-ID, positie in de DHL-route (vervoersfase), ophaling, afleverbewijs, geschatte ETA, vraag/capaciteit en transportuitzonderingen. |
| F09 | Uit — DHL | Toegewezen corrigerende actie met betrokken zending/order, actiehouder en deadline. |
| F10 | In — klantcommunicatie | Verzend- en afhandelstatus, communicatielog, klacht met ordernummer en gekozen vervolgactie. |
| F11 | Uit — klantcommunicatie | Concept/update, bevestigde status, oorzaak, belofte, ETA of expliciet onbekend, ontvanger/kanaal en communicatieopdracht. |
| F12 | In — tijd/klok | Huidige datum en tijd als controlemoment voor de leverlooptijd (UC10). |
| F13 | Uit — leverancier Hongkong / import | Verhoogd batchaantal per SKU voor een piekperiode (UC11), in aantallen producten. |

De stromen zijn logisch: informatie kan ook handmatig door de beheerder worden overgenomen. Bronvermelding blijft dan de partner, terwijl de invoerende actor de beheerder is. Partnerbevestigingen worden niet verzonnen door de beheerder; gesimuleerde events (F01) zijn altijd als demo herkenbaar. Een retourstroom is alleen getekend waar deze context een opdracht of update verstuurt; oorspronkelijke printopdrachten en webshopbevestigingen behoren tot de keten buiten deze grens. Er is geen e-maildienst: meldingen gaan via het dashboard (FR-CT-11).

## Ontwerpgeschiedenis

De [uitwerking van de klantfeedback en het Control Tower-prototype](https://github.com/Immanuel-Cairo/gifts4u-control-tower/blob/d16a66d/products/system%20context/README.md) gebruikt de UC-nummers van die latere ontwerpversie. In het oorspronkelijke platformdiagram hierboven lopen de doelen van UC01 tot en met UC16.

## Randvoorwaarden en beperkingen

- **Beveiliging (NFR-01, NFR-06):** één bediener neemt authenticatie en toegangsbeperking niet weg. Een partner ontvangt alleen noodzakelijke opdrachtgegevens.
- **Events (NFR-02, NFR-03):** dubbele events mogen niet dubbel wijzigen. Bewaar bron, tijdstip, betrokken record en invoerende actor; demo-events blijven als simulatie herkenbaar.
- **Onzekerheid (NFR-04, NFR-08):** mislukte gegevensuitwisseling verandert geen bevestiging. Status, schatting en uitzondering blijven apart.
- **Kwaliteit (NFR-05, NFR-07):** laadtijd en behoud na herstart vereisen implementatie- en acceptatietests; diagrammen bewijzen deze eigenschappen niet.
- **Open beleid:** kalender-/werkdagen bij de 120%-regel (vraag 6.1; de klant noemde Hongkong in werkdagen, de 5 dagen levertijd niet expliciet), wat de "special request" bij Hongkong precies inhoudt, of de douanestatus via Hongkong of via DHL binnenkomt (team moet kiezen), "extra hoge prioriteit" (5.1), backorders en deellevering (2.3, 2.4) en automatische inkoop (2.2) blijven te valideren. Geplande batchverhoging (FR-MAG-06) is geen bevestigde fysieke ontvangst (FR-MAG-02).
- **Prototype:** de Partnerdemo in het [prototype](../prototype/walkthrough.md) simuleert partnergebeurtenissen; het zijn simulaties door dezelfde beheerder, geen extra gebruikersrollen.

## Onderhoud en controle

De [generator](generate_diagrams.py) maakt het use-casediagram als SVG en PlantUML en het DFD als SVG en Mermaid.

```powershell
python "products/system context/generate_diagrams.py"
```
