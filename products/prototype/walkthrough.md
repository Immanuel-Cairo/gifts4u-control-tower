# GIFTS4U Control Tower — walkthrough

Een Nederlandstalig interactief prototype voor één Control Tower-beheerder van GIFTS4U: zien waar een order staat, begrijpen wat een verstoring betekent en een volgende actie vastleggen.

**Oorspronkelijk product-issue:** [#4](https://github.com/Immanuel-Cairo/gifts4u-control-tower/issues/4). Dit is het high-fidelity prototypeproduct uit [products.md](../products.md), met de bijbehorende demonstratiehandleiding. Alle wijzigingen zijn lokaal en fictief. Het prototype verstuurt geen berichten en benadert geen partners.

**Aanpassing op feedback:** [#75](https://github.com/Immanuel-Cairo/gifts4u-control-tower/issues/75), aansluitend op de systeemcontext in [PR #74](https://github.com/Immanuel-Cairo/gifts4u-control-tower/pull/74). Sophie is de enige bediener. De vormgeving blijft behouden; de rolwisselaar en aparte directeur-/partnerweergaven zijn verwijderd.

## Eén beheerder, externe gegevens

Je werkt steeds als **Sophie · Control Tower-beheerder**. Bekijk orders, import, voorraad, productie en transport; beoordeel uitzonderingen; registreer een bevoegd besluit en coördineer klantcommunicatie. Een beslisser of actiehouder is een naam bij een besluit, geen extra gebruikersaccount.

Via **SV → Open partnerdemo** worden externe testhandelingen zichtbaar met het voorvoegsel **Demo:**. De paarse banner en dialoogmelding maken deze toestand herkenbaar. Nieuwe orders, importpartijen, voorraadmutaties, productiestart, kwaliteitsvrijgave en DHL-events simuleren aanlevering uit de keten. Dit zijn geen taken van extra Control Tower-gebruikers. Sluit Partnerdemo met de bannerknop of via SV. Na herladen staat deze altijd uit; reeds ingevoerde demogegevens blijven behouden.

De oorspronkelijke opslagnaam blijft behouden. Een eerder opgeslagen rolkeuze wordt bij laden verwijderd, zonder orders, besluiten, berichten of historische actornamen te wissen. Nieuwe wijzigingen noemen altijd Sophie als invoerende beheerder; de bron blijft bijvoorbeeld Printz of DHL. Gesimuleerde partner-events krijgen een aparte aanduiding in de tijdlijn en het logboek.

## Openen

Open [index.html](index.html) in een moderne browser. CSS en JavaScript staan naast het HTML-bestand; installatie en een build zijn niet nodig. Lokale opslag bij `file://` verschilt per browser. Gebruik voor een reproduceerbare demo bij voorkeur een lokale HTTP-server vanuit de repositoryroot:

```powershell
python -m http.server 8765 --bind 127.0.0.1 --directory products/prototype
```

Open daarna `http://127.0.0.1:8765`. Stop de server na gebruik met Ctrl+C. Met **SV → Herstel startdemo** zet je uitsluitend deze browserdemo terug. Een bevestigingsvenster voorkomt onbedoeld verlies van demo-invoer.

Bestanden:

- `index.html`: Nederlandstalige paginastructuur, navigatie en dialogen.
- `styles.css`: vormgeving en responsieve varianten.
- `app.js`: fictieve dataset, schermen, acties en lokale opslag.
- `walkthrough.md`: deze handleiding en requirementdekking.
- `tests/prototype.test.cjs`: tests voor de daadwerkelijke prototype-bedrijfsregels, zonder externe dependencies.

## Ontwerpkeuzes

Het aangeleverde dashboardbeeld bepaalt de visuele richting: een donkere zijbalk, een witte werkruimte, dunne scheidingslijnen, limegroene acties en paarse grafieken. De financiële inhoud uit het voorbeeld is vertaald naar de orderketen van GIFTS4U.

De startpagina heeft vier lagen: kerncijfers, orderstroom en partneroverzicht, een aandachtspunt met herstelactie en een doorzoekbare ordertabel. Het rechter orderdossier houdt de hoofdcontext herkenbaar tijdens het onderzoeken van een order. Tabellen kunnen horizontaal scrollen op kleine schermen; kerncijfers gaan naar twee kolommen en de navigatie wordt smaller. SVG-iconen en lokale lettertypen houden de pagina onafhankelijk van externe diensten.

De belangrijkste informatie blijft gescheiden:

| Informatie        | Presentatie                                 | Betekenis                                                            |
| ----------------- | ------------------------------------------- | -------------------------------------------------------------------- |
| Bevestigde status | Statuslabel en gebeurtenistijdlijn          | Wat een partner daadwerkelijk heeft bevestigd in de demo             |
| Leverbelofte      | Eigen kolom en detailveld                   | De oorspronkelijke afspraak; ETA-wijzigingen overschrijven deze niet |
| ETA               | Expliciet als schatting aangeduid           | De verwachting; ontbrekende informatie blijft **Nog onbekend**       |
| Uitzondering      | Apart aandachtspunt met oorzaak en eigenaar | Een probleem naast de orderstatus                                    |
| Scenario          | Eigen ‘Wat als?’-venster                    | Een mogelijke herstelroute; verandert op zichzelf niets              |
| Besluit           | Actiehouder, deadline en logregistratie     | Opdracht tot uitvoering; geen bewijs dat uitvoering al is afgerond   |

Statuslabels gebruiken tekst naast kleur. Formulieren hebben labels, verplichte velden en herkenbare bevestigingsknoppen. Native dialogen ondersteunen Escape; de pagina heeft een skiplink, zichtbare focusstijlen en respecteert verminderde beweging. Volledige toegankelijkheid is nog niet in een echte browser geverifieerd.

## Creatieve oplossing: eerst de impact verkennen

De **impactverkenner** verbindt een uitzondering met de betrokken orders en toont de keten van import tot klant. Voor de printstoring vergelijk je een extra shift met de reguliere herstart. Het venster toont mogelijke tijdwinst, het aantal betrokken producten en een scenario-ETA. Kosten staan er bewust niet in: volgens de klantfeedback is geld buiten de scope; we rekenen alleen in aantallen producten.

Dit voorkomt dat een voorgesteld herstelplan ongemerkt als bevestigde werkelijkheid wordt gepresenteerd. Dezelfde beheerder registreert een bevoegd genomen besluit, verwerkt later een aangeleverde partnerverwachting en coördineert daarna de klantupdate. Elke stap is apart terug te vinden.

De scenario’s zijn **ontwerpaannames**: een extra printshift kan in de demo één dag winnen. Ze komen niet uit het requirementsbestand en vormen geen optimalisatieberekening of toezegging. Het printscenario gebruikt de vaste startcasus met een belofte op 16 november; na wijzigingen aan orders is het geen automatische herberekening. Voor douane en transport blijft de tijdwinst onbekend tot overleg met de partner. Bij een vertraging in Hongkong is de herstelroute een **spoedverzoek** (de "special request" uit de klantfeedback).

## Demonstratie in ongeveer tien minuten

### 1. Oriënteer je op de startpagina

De vaste demodag is **16 november 2026**. De startset bevat 50 orders, drie uitzonderingen en acht betrokken orders. Nieuwe handelingen krijgen het werkelijke tijdstip van invoer. Alle tijdstippen worden in de interface in de tijdzone Europe/Amsterdam getoond.

Bovenaan staat **Actie nodig**: alle open uitzonderingen, de meest urgente eerst, in rood, met per regel een korte oorzaak (partner, aantal geraakte orders, impact) en de **volgende stap**. Daaronder staat een alarmregel voor orders waarvan de verwachte looptijd meer dan 20% boven de belofte van 5 dagen ligt. Zonder open punten wordt het blok groen: **Alles op schema**. Zo zie je problemen zonder te scrollen, zoals de klant vroeg.

De kerncijfers volgen dezelfde kleurafspraak: **Vragen aandacht** is rood, **Op schema** (geen uitzondering en geen alarm) is groen. **De keten in één regel** toont per schakel — Hongkong, webshop, magazijn, Printz, DHL, klant — hoeveel orders op schema zijn en hoeveel een probleem hebben. Alle cijfers zijn afgeleid van de huidige demodataset; er staan geen bedragen in.

Gebruik de zoekbalk of `/` om `G4U-1048` te vinden. De zoekfunctie doorzoekt ordernummer, klant en SKU. Wis de zoekterm voordat je andere datasets wilt bekijken. De filters combineren met de zoekterm; paginering toont zes orders per pagina. Een onbekende zoekterm levert een lege toestand met uitleg op.

### 2. Onderzoek de printstoring

Open **G4U-1048** via het ordernummer of de pijl in de tabel. Je ziet:

- Bevestigde status **In bedrukking**, met bron Printz en een tijdstip.
- Oorspronkelijke leverbelofte **16 november**.
- Geschatte levering **18 november**, bij vijf beloofde dagen een overschrijding van 40%.
- Een afzonderlijke uitzondering **Printlijn 02 staat stil** met oorzaak, eigenaar en volgende actie.
- Een goedgekeurde fictieve ontwerpverwijzing, gekoppeld aan order en SKU.

De storing heeft de bevestigde status niet vervangen. Open desgewenst eerst Partnerdemo en klik op **Demo: Test dubbel event**: hetzelfde event-ID wordt herkend. Er komt geen tweede status-event bij; de detectie wordt wel in het logboek geregistreerd.

### 3. Vergelijk een herstelroute en leg een besluit vast

Kies **Verken herstelopties**. Wissel tussen **Extra printshift** en **Reguliere herstart**. Bekijk de betrokken orders. Het wisselen verandert geen order, ETA of reservering.

Vul **Actiehouder bij de partner**, **Deadline**, **Besluit genomen door** en de toelichting in. Bevestig **Ik registreer een bevoegd genomen besluit** en kies **Besluit vastleggen**. Zonder beslisser of bevestiging wordt niets vastgelegd. De uitzondering wordt **In behandeling**. Orderstatus, reservering en ETA blijven gelijk.

Je blijft Sophie. Het dossier toont de beslisser en de invoerende beheerder afzonderlijk. De beslisser kan Sophie/eigenaar zijn of iemand die buiten de applicatie heeft besloten. De checkbox legt die verklaring vast; zij is geen controle van daadwerkelijke bevoegdheid. Ook eerdere besluiten blijven zichtbaar, met een expliciete melding wanneer de beslisser toen niet was opgeslagen. Echte authenticatie en autorisatie blijven implementatiewerk.

### 4. Werk de verwachting bij en informeer de klant

Open G4U-1048 opnieuw. Kies **ETA bijwerken**, vul **17 november 2026** in, kies Printz als bron en vermeld dat de extra shift door de partner is bevestigd. De nieuwe ETA staat naast de ongewijzigde belofte van 16 november. De status blijft In bedrukking.

Kies **Klantupdate opstellen**. Het concept bevat de laatste bevestigde status, de oorzaak, de schatting en de oorspronkelijke belofte. Controleer ontvanger, kanaal, toegewezen medewerker en tekst. **Simuleer verzending** schrijft alleen naar het lokale communicatielog; er gaat niets naar een ontvanger.

Sluit het dossier en open **Klantcommunicatie**. Het bericht staat daar met ontvanger, kanaal, medewerker, tijdstip en **Gesimuleerd verzonden**. In **Logboek** staan de besluit-, ETA- en communicatiehandelingen met actor en bron.

### 5. Volg een order tot aflevering

Open **SV → Open partnerdemo**, open G4U-1048 en kies **Demo: Kwaliteitscontrole & vrijgave**. Je simuleert hiermee een bevestiging van Printz. Beide controles — personalisatie en aantal/kwaliteit — zijn verplicht. Daarna wordt **Verzendklaar** bevestigd.

Kies vervolgens **Demo: Bevestig ophaling**. Controleer postcode, huisnummer en gebeurtenistijd en bevestig de overdracht. De status wordt **Onderweg**. Bij **Demo: Bevestig aflevering** is daarnaast een referentie naar het afleverbewijs vereist. De bevestiging wordt opgeslagen in de tijdlijn.

Een open storing sluit niet automatisch door een statuswijziging. Open de impactverkenner en kies **Oplossing bevestigen** wanneer de oorzaak voor alle gekoppelde orders is verholpen. Vermeld de bevestiging van de partner. De uitzondering verdwijnt uit de open aandachtspunten; oorzaak en afsluiting blijven opgeslagen en gelogd.

### 6. Bekijk import en voorraad

**Import** toont de inkomende partijen uit Hongkong. Hongkong heeft zelf geen voorraad voor ons en meldt alleen **Delayed**; de oorzaak noteer je zelf. HK-2026-081 staat op Delayed (douane), heeft een onbekende ETA en koppelt drie orders aan de vertraagde SKU. Met Partnerdemo actief (knop **Probleem nabootsen**) kies je bij een partij **Demo: Vertraging simuleren** met als oorzaak douane, brand in Hongkong of onbekend. De partij wordt Delayed, de ETA onbekend en orders die nog op die SKU wachten worden aan een nieuwe uitzondering gekoppeld. Via **Demo: Partij registreren** maak je een extra partij aan; de ETA staat standaard op 1 dag verwerking plus 10 werkdagen transport.

Kies bij HK-2026-081 **Demo: Bevestig ontvangst** en voer bijvoorbeeld 580 van de verwachte 600 stuks in. Alleen deze 580 verhogen de fysieke voorraad. De ontvangstknop wordt daarna uitgeschakeld en de mutatie is ook programmatisch tegen dubbeltelling beschermd. Het verschil van 20 staat in het logboek. Deze demo ondersteunt geen verdere deelontvangsten op dezelfde partij; registreer zo nodig een aparte vervolgpartij.

In **Magazijn** zie je fysiek aanwezig, gereserveerd en beschikbaar per SKU, in één gezamenlijke voorraad voor B2B en B2C. Met **Batchaantal verhogen** zet je voor Kerst, Valentijn of een andere piek het bestelaantal per partij bij Hongkong hoger. Dat is een aangepaste bestelling, geen fysieke voorraad: de kolom **Batch Hongkong** verandert, fysiek aanwezig niet. Een lager of gelijk aantal wordt geweigerd; de wijziging staat in het logboek. In de normale werkruimte open je alleen het dossier. Met Partnerdemo actief kun je een magazijnreservering simuleren voor een ontvangen order. Bij onvoldoende voorraad blijft de status gelijk en ontstaat een uitzondering met ontbrekend aantal, order en eigenaar. Overdracht aan Printz verbruikt de fysieke goederen en heft de bijbehorende reservering op. De demo controleert opeenvolgende acties binnen één venster; echte gelijktijdigheid vraagt backendtransacties.

### 7. Probeer de overige serviceacties

Orders ontstaan altijd in de webshop, nooit in de Control Tower; **Webshoporder simuleren** bootst die aanlevering na. Voor een gesimuleerde webshoporder, magazijnmutatie, Printz-storing, importvertraging of capaciteitsplanning moet Partnerdemo actief zijn. Op de pagina's Printz en Import opent **Probleem nabootsen** die modus direct. De bijbehorende knoppen beginnen met **Demo:**. ETA en klachtgegevens kun je als beheerder overnemen uit een partnerbericht.

| Actie                                              | Verwacht resultaat                                                                                         |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Webshoporder met 100 stuks en volledig adres       | Unieke B2B- of B2C-order, voorraadcontrole en één ontvangst-event                                          |
| Webshoporder met 10.000 stuks, beperkte SKU        | Duidelijke voorraadfout; geen onbevestigde leverbelofte                                                    |
| B2B-prioriteit aanvinken                           | Prioriteit zichtbaar; bestaande reserveringen veranderen niet                                              |
| Printz → Storing simuleren                         | Aparte uitzondering; orderstatus blijft gelijk                                                             |
| Import → Vertraging simuleren                      | Partij Delayed, ETA onbekend, wachtende orders gekoppeld; herstelroute Spoedverzoek bij Hongkong           |
| Magazijn → Batchaantal verhogen                    | Hoger bestelaantal per partij; fysieke voorraad onveranderd; logboekregel met reden                       |
| Printz / DHL / transport                           | Printz: vier statussen (ontvangen, in productie, gereed, verzonden). DHL: positie in de route per order    |
| DHL → Capaciteit plannen                           | Bij vraag boven capaciteit ontstaat of actualiseert een capaciteitsexceptie                                |
| Orderdossier → Probleem of klacht melden           | Adresprobleem, mislukte aflevering of personalisatieklacht met eigenaar en vervolgactie                    |
| SV → Simuleer Printz offline                       | Syncprobleem zichtbaar; nieuwe Printz-status- en ETA-bevestigingen worden geblokkeerd                      |
| Exporteer                                          | CSV van de demo-orders; logboek heeft een eigen JSON-export                                                |
| Pagina vernieuwen                                  | Opgeslagen orders, besluiten, uitzonderingen en berichten blijven behouden als localStorage beschikbaar is |

Een grotere transportcapaciteit sluit een bestaande uitzondering niet automatisch: de verantwoordelijke bevestigt eerst de oplossing. De partnerkaart op de startpagina telt de open aandachtspunten per partner en toont een eventueel Printz-synchronisatieprobleem.

### 8. Test de exacte alarmgrens

Open **SV → Test alarmdrempel**. De regel is `(verwachte looptijd − beloofde looptijd) / beloofde looptijd > 20%`.

| Beloofd | Verwacht   | Overschrijding | Alarm                         |
| ------- | ---------- | -------------- | ----------------------------- |
| 5 dagen | 6 dagen    | 20%            | Nee                           |
| 5 dagen | 6,05 dagen | 21%            | Ja                            |
| 5 dagen | 7 dagen    | 40%            | Ja                            |
| 5 dagen | Onbekend   | Onbekend       | Geen berekende overschrijding |

Gebruik de decimale notatie die de browser voor het numerieke veld accepteert. De orderweergave gebruikt kalenderdatums; de aparte grenscalculator maakt ook 21% toetsbaar. De 20%-regel staat in het requirementsbestand als **nog te valideren door de opdrachtgever**.

## Verwerkte klantfeedback (presentaties)

| Feedback | In het prototype |
| --- | --- |
| Eerst zien waar actie op nodig is; uitzonderingen echt goed zichtbaar; rood zonder scrollen, groen wat goed gaat | **Actie nodig** bovenaan het overzicht, gesorteerd op urgentie, met kleuren in kerncijfers en keten |
| Korte, abstracte samenvatting van waarom iets misgaat; stap voor stap wat je moet doen | Per actiepunt één oorzaakregel en de volgende stap, genummerd |
| Vereenvoudigde keten in de Control Tower | **De keten in één regel** op het overzicht |
| Geld buiten scope, alleen aantallen producten | Kostenindicatie verwijderd; impactverkenner toont betrokken stuks |
| Printz: ontvangen, in productie, gereed, verzonden; geen lijst van printopdrachten nodig | Vier statustellers op de Printz-pagina |
| Happy flow plus een knop om een probleem na te bootsen (Printz, Hongkong) | **Probleem nabootsen**, **Storing simuleren**, **Vertraging simuleren** |
| Hongkong meldt alleen Delayed; 1 dag verwerking + 10 werkdagen; brand mogelijk | Status Hongkong, standaard-ETA, oorzaak douane/brand/onbekend, herstelroute Spoedverzoek |
| Batches verhogen voor Kerst en Valentijn | **Batchaantal verhogen** in Magazijn |
| DHL: waar in de route zit de zending, geen groot kopje met zendingen | Kolom **Positie in DHL-route** en routebalk in het orderdossier |
| Geen orders maken in de Control Tower | Knop heet **Webshoporder simuleren** en legt uit dat orders uit de webshop komen |
| Eén voorraad, niet apart voor B2B en B2C; fysiek aanwezig duidelijker | Uitleg en kolomnaam **Fysiek aanwezig** in Magazijn |

## Traceerbaarheid naar de requirements

Bron: het door de gebruiker aangeleverde **GIFTS4U_Requirements_ControlTower_Alle_Services.xlsx**, tabbladen **Requirements** en **Acceptatiecriteria**, rijen 2–44. Dit bestand bevat 35 functionele en acht niet-functionele eisen. De spreadsheet is gelezen en niet gewijzigd. De requirements beschrijven de beoogde oplossing; de onderstaande mapping beschrijft uitsluitend wat dit prototype daadwerkelijk demonstreert.

**Interactief** betekent dat de actie met lokale demodata werkt. **Gedeeltelijk** betekent dat een deel wordt getoond of gesimuleerd en het resterende deel vervolgwerk is. Geen van deze aanduidingen verklaart een productieacceptatietest geslaagd. Webshop-, import-, magazijn-, Printz- en DHL-mutaties hieronder zijn externe simulaties onder Partnerdemo; zij zijn geen aanvullende gebruikersrollen.

| ID        | Scherm / bewijs in het ontwerp        | Dekking en grens                                                                                                                         |
| --------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| FR-WEB-01 | Nieuwe order                          | Interactief: uniek ID, klanttype, SKU, aantal en leverbelofte                                                                            |
| FR-WEB-02 | Nieuwe order en DHL-bevestiging       | Interactief: verplichte adresvelden, postcodepatroon en huisnummer; geen externe adresverificatie                                        |
| FR-WEB-03 | Voorraadcontrole vóór orderacceptatie | Interactief voor bekende demo-SKU’s; productiebron kan niet uitvallen in dit prototype                                                   |
| FR-WEB-04 | Tijdlijn en logboek                   | Interactief: één lokaal ontvangst-event met ID, bron en tijdstip                                                                         |
| FR-WEB-05 | Nieuwe order en prioriteitslabel      | Interactief: gewenste datum en B2B-prioriteit, zonder herverdeling van bestaande reserveringen                                           |
| FR-IMP-01 | Partij registreren                    | Interactief: leverancier, SKU, aantal en unieke zendingreferentie                                                                        |
| FR-IMP-02 | Import en ontvangstlog                | Gedeeltelijk: schatting en bevestigde ontvangst; uitgebreide inbound-transporttijdlijn is vervolgwerk                                    |
| FR-IMP-03 | HK-2026-081, EX-002 en Vertraging simuleren | Interactief: douane voorgeladen; nieuwe vertraging (douane, brand, onbekend) is te simuleren en koppelt wachtende orders             |
| FR-IMP-04 | Afhankelijke orders bij Import        | Gedeeltelijk: de startcasus heeft expliciete koppelingen; automatische afhankelijkheidsanalyse van nieuwe partijen is vervolgwerk        |
| FR-IMP-05 | Ontvangstbevestiging                  | Interactief: werkelijk ontvangen aantal wordt één keer voorraad                                                                          |
| FR-MAG-01 | Voorraadtabel                         | Interactief: fysiek minus reserveringen, niet-negatieve beschikbaarheid                                                                  |
| FR-MAG-02 | Ontvangst en logboek                  | Interactief: Stock Received met hoeveelheid, SKU, bron en tijdstip                                                                       |
| FR-MAG-03 | Reserveren                            | Gedeeltelijk: hercontrole en bescherming tegen overtoewijzing in één venster; geen gelijktijdige gebruikers/backendtransacties           |
| FR-MAG-04 | Tekort bij reserveren                 | Interactief: ontbrekend aantal, betrokken order en eigenaar                                                                              |
| FR-MAG-05 | Overdragen aan Printz                 | Interactief: reservering verbruikt, status-event met order en tijdstip                                                                   |
| FR-MAG-06 | Batchaantal verhogen                  | Interactief: hoger batchaantal per SKU met reden, direct zichtbaar en gelogd; geen echte bestelling bij Hongkong                         |
| FR-PRT-01 | Orderdossier                          | Interactief zichtbaar: order, SKU, aantal en één goedgekeurde ontwerpversie; geen afbeeldingsopslag                                      |
| FR-PRT-02 | Start bedrukking                      | Interactief: expliciet start-event met bron en tijdstip                                                                                  |
| FR-PRT-03 | Storing simuleren                     | Gedeeltelijk: machinestoring als aparte uitzondering; berekening van printcapaciteit is vervolgwerk                                      |
| FR-PRT-04 | Kwaliteitscontrole & vrijgave         | Interactief: verplichte controle van ontwerp en aantal/kwaliteit                                                                         |
| FR-PRT-05 | Verzendklaar | Interactief in Partnerdemo: vrijgave na controle; de beheerder volgt deze bevestiging in het transportoverzicht. |
| FR-DHL-01 | DHL en orderdossier                   | Interactief: per order de positie in de DHL-route (ophalen, sorteercentrum, bezorgroute, afgeleverd), bestemming en geschatte levering   |
| FR-DHL-02 | Ophaling en aflevering                | Interactief: bevestiging, zending-ID, bron, tijdstip; aflevering vereist bewijsreferentie                                                |
| FR-DHL-03 | Capaciteit plannen                    | Gedeeltelijk: vraag/capaciteit en tekortmelding voor één vaste demodatum; meerdagenplanning is vervolgwerk                               |
| FR-DHL-04 | Probleem melden                       | Interactief: adres-/afleverprobleem met zending, reden, eigenaar en volgende actie                                                       |
| FR-DHL-05 | ETA bijwerken en uitzonderingen       | Interactief: schatting blijft gescheiden van oorspronkelijke belofte en status                                                           |
| FR-KLM-01 | Klantupdate opstellen                 | Interactief: concept op basis van bevestigd event en ordernummer                                                                         |
| FR-KLM-02 | Concept bij uitzondering              | Interactief: oorzaak en ETA of expliciet nog onbekend                                                                                    |
| FR-KLM-03 | Communicatielog                       | Interactief: gesimuleerde verzending met tekst, ontvanger, kanaal en tijdstip                                                            |
| FR-KLM-04 | Toegewezen medewerker in bericht      | Gedeeltelijk: toewijzing werkt; aparte open/afgehandeld-werkvoorraad is vervolgwerk                                                      |
| FR-KLM-05 | Personalisatieklacht                  | Interactief: order, oorzaak, eigenaar en gekozen retour/herdruk/vervanging; uitvoering van deze processen is vervolgwerk                 |
| FR-CT-01  | Overzicht en orderdossier             | Interactief: gedeelde order, laatste events, partner en leverbelofte                                                                     |
| FR-CT-02  | Apart uitzonderingenmodel             | Interactief: storing vervangt geen bevestigde status                                                                                     |
| FR-CT-03  | Uitzonderingen en impactverkenner     | Interactief: orders, impact, urgentie, eigenaar en volgende stap; onbekend blijft onbekend                                               |
| FR-CT-04 | Besluit registreren | Interactief: één beheerder registreert beslisser, actiehouder, deadline en toelichting; bevestiging van bevoegdheid is een verklaring, geen autorisatie. |
| FR-CT-05  | Actie nodig, orderalarm en grenscalculator | Interactief: strikt >20%, als alarmregel bovenaan het overzicht; kalender- of werkdagen nog te valideren                            |
| FR-CT-09  | Actie nodig en kleuren                | Interactief: urgente punten bovenaan, rood voor problemen en groen voor op schema, zonder scrollen zichtbaar                             |
| FR-CT-10  | Actie nodig                           | Interactief: per uitzondering een korte, abstracte oorzaak en de volgende stap                                                            |
| FR-CT-11  | Actie nodig en meldingenbel           | Interactief: dashboardmeldingen in plaats van e-mail                                                                                      |
| NFR-01 | Eén beheerder | Niet als beveiliging gerealiseerd: geen login of serverautorisatie. Een naam of beslischeckbox is geen toegangscontrole. |
| NFR-02    | Event-ID en Test dubbel event         | Interactief: dubbele statusmutaties voorkomen in het lokale eventmodel                                                                   |
| NFR-03    | Logboek en tijdlijn                   | Gedeeltelijk: bron, actor, tijdstip en record aanwezig; lokale opslag is niet manipulatiebestendig                                       |
| NFR-04    | Printz offline                        | Gedeeltelijk: falen gesimuleerd, bevestigingen blijven behouden; geen echte API-retry of netwerkdetectie                                 |
| NFR-05 | Startset van 50 orders | Browserflow en rendering gecontroleerd; de eis van drie seconden is niet afzonderlijk gemeten. |
| NFR-06 | Externe bronnen | Geen partneraccounts of echte gegevensdeling. Dataminimalisatie moet later aan de servicegrens worden afgedwongen. |
| NFR-07    | localStorage                          | Gedeeltelijk: behoud na pagina-/browserherstart waar opslag beschikbaar is; geen backendherstel of back-up                               |
| NFR-08    | Drie gescheiden informatietypen       | Interactief zichtbaar: bevestiging, schatting en uitzondering met eigen labels                                                           |

## Uitgevoerde verificatie en resterende controle

Voer vanuit de repositoryroot uit:

```powershell
node --check products/prototype/app.js
node --test products/prototype/tests/prototype.test.cjs
git diff --check
```

De **20 tests** slagen. Zes daarvan zijn toegevoegd na de klantfeedback: actiepunten eerst en in rood, geen bedragen in de impactverkenner, gesimuleerde importvertraging, batch verhogen zonder fysieke voorraadmutatie, Printz-statussen en DHL-routepositie, en migratie van oudere opgeslagen demo's. Naast de bestaande bedrijfsregels controleren ze de migratie van een oude rolkeuze, het behoud van data/historie, besluitregistratie zonder rolwissel, het blokkeren van externe mutaties buiten Partnerdemo en het behoud van dezelfde invoerende beheerder naast de externe bron.

**Browsercontrole op 19 november 2026:** het prototype gaf HTTP 200 en is in headless Microsoft Edge doorlopen. Getest: order openen, besluit registreren zonder rolwissel, behoud van status/ETA, ontbreken van de rolkeuze, Partnerdemo openen/sluiten en besluitbehoud na herladen. Desktop (1440 × 1000) en mobiel (390 × 844) zijn gerenderd en visueel gecontroleerd. De mobiele pagina blijft 390 pixels breed; de brede tabel heeft eigen horizontale scrolling. Er waren geen JavaScript-fouten tijdens deze flow.

Open controles vóór acceptatie:

1. Volledige toetsenbord- en toegankelijkheidscontrole, inclusief focus bij dialoog- en filterwissels.
2. Alle overige demoformulieren, download/export en geblokkeerde browseropslag testen in de beoogde browser.
3. De drie-seconden-eis afzonderlijk meten met minimaal 50 orders.
4. Bevoegdheden, scenarioaannames en de >20%-regel valideren met opdrachtgever en projectteam.

Het prototype gebruikt één browservenster als toestandsbron. Meerdere vensters of gebruikers kunnen elkaars opgeslagen wijzigingen overschrijven. Alle data staat leesbaar op de client; gebruik uitsluitend demo-invoer. Productie-authenticatie, betrouwbare partnerintegraties, server-side logging, concurrency, echte berichten en opslag van klantfoto’s vallen buiten dit ontwerpdocument en prototypeproduct.
