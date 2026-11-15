# GIFTS4U Control Tower — walkthrough

Een Nederlandstalig interactief prototype voor de regisseur van GIFTS4U: zien waar een order staat, begrijpen wat een verstoring betekent en een volgende actie vastleggen.

**Product-issue:** [#4](https://github.com/Immanuel-Cairo/gifts4u-control-tower/issues/4). Dit is het high-fidelity prototypeproduct uit [products.md](../products.md), met de bijbehorende demonstratiehandleiding. Alle wijzigingen zijn lokaal en fictief. Het prototype verstuurt geen berichten en benadert geen partners.

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

De **impactverkenner** verbindt een uitzondering met de betrokken orders en toont de keten van import tot klant. Voor de printstoring vergelijk je een extra shift met de reguliere herstart. Het venster toont mogelijke tijdwinst, kostenindicatie en een scenario-ETA.

Dit voorkomt dat een voorgesteld herstelplan ongemerkt als bevestigde werkelijkheid wordt gepresenteerd. De directeur legt een besluit vast, de partner bevestigt later een nieuwe verwachting en de klantenservice stelt daarna een bericht op. Elke stap is apart terug te vinden.

De bedragen en scenario’s zijn **ontwerpaannames**: een extra printshift kost in de demo € 180 en kan één dag winnen. Ze komen niet uit het requirementsbestand en vormen geen optimalisatieberekening of toezegging. Het printscenario gebruikt de vaste startcasus met een belofte op 16 november; na wijzigingen aan orders is het geen automatische herberekening. Voor douane en transport blijven tijdwinst en kosten onbekend tot overleg met de partner.

## Demonstratie in ongeveer tien minuten

### 1. Oriënteer je op de startpagina

De vaste demodag is **16 november 2026**. De startset bevat 50 orders, drie uitzonderingen en acht betrokken orders. Nieuwe handelingen krijgen het werkelijke tijdstip van invoer. Alle tijdstippen worden in de interface in de tijdzone Europe/Amsterdam getoond.

De kerncijfers en faseverdeling zijn afgeleid van de huidige demodataset. **Verwacht op tijd** is het aandeel orders met een bekende ETA op of vóór de leverbelofte, gedeeld door alle orders. Een onbekende ETA telt niet als op tijd. De paarse trendgrafiek is expliciet illustratieve demohistorie, geen aggregatie van de 50 huidige orders. Het periodeveld wisselt tussen twee illustraties.

Gebruik de zoekbalk of `/` om `G4U-1048` te vinden. De zoekfunctie doorzoekt ordernummer, klant en SKU. Wis de zoekterm voordat je andere datasets wilt bekijken. De filters combineren met de zoekterm; paginering toont zes orders per pagina. Een onbekende zoekterm levert een lege toestand met uitleg op.

### 2. Onderzoek de printstoring

Open **G4U-1048** via het ordernummer of de pijl in de tabel. Je ziet:

- Bevestigde status **In bedrukking**, met bron Printz en een tijdstip.
- Oorspronkelijke leverbelofte **16 november**.
- Geschatte levering **18 november**, bij vijf beloofde dagen een overschrijding van 40%.
- Een afzonderlijke uitzondering **Printlijn 02 staat stil** met oorzaak, eigenaar en volgende actie.
- Een goedgekeurde fictieve ontwerpverwijzing, gekoppeld aan order en SKU.

De storing heeft de bevestigde status niet vervangen. Klik op **Test dubbel event**: hetzelfde event-ID wordt herkend. Er komt geen tweede status-event bij; de detectie wordt wel in het logboek geregistreerd.

### 3. Vergelijk een herstelroute en leg een besluit vast

Kies **Verken herstelopties**. Wissel tussen **Extra printshift** en **Reguliere herstart**. Bekijk de betrokken orders. Het wisselen verandert geen order, ETA of reservering.

Kies **Bekijk als directeur**. Dit is een demonstratie van een rolweergave, geen login. Controleer actiehouder, deadline en toelichting en kies **Besluit vastleggen**. De uitzondering wordt **In behandeling**. De order blijft **In bedrukking** en behoudt zijn ETA, tot een aparte partnerupdate wordt vastgelegd. Via **SV** kun je de rol ook wijzigen.

Directiebesluitdetails worden in dit venster alleen voor de directeur getoond. Het logboek vermeldt dat er een besluit is geregistreerd. De data blijft in deze statische demo beschikbaar in JavaScript en lokale opslag; dit is geen beveiligingsgrens.

### 4. Werk de verwachting bij en informeer de klant

Open G4U-1048 opnieuw. Kies **ETA bijwerken**, vul **17 november 2026** in, kies Printz als bron en vermeld dat de extra shift door de partner is bevestigd. De nieuwe ETA staat naast de ongewijzigde belofte van 16 november. De status blijft In bedrukking.

Kies **Klantupdate opstellen**. Het concept bevat de laatste bevestigde status, de oorzaak, de schatting en de oorspronkelijke belofte. Controleer ontvanger, kanaal, toegewezen medewerker en tekst. **Simuleer verzending** schrijft alleen naar het lokale communicatielog; er gaat niets naar een ontvanger.

Sluit het dossier en open **Klantcommunicatie**. Het bericht staat daar met ontvanger, kanaal, medewerker, tijdstip en **Gesimuleerd verzonden**. In **Logboek** staan de besluit-, ETA- en communicatiehandelingen met actor en bron.

### 5. Volg een order tot aflevering

Open G4U-1048 en kies **Kwaliteitscontrole & vrijgave**. Beide controles — personalisatie en aantal/kwaliteit — zijn verplicht. Daarna wordt **Verzendklaar** bevestigd.

Kies vervolgens **Bevestig ophaling**. Controleer postcode, huisnummer en gebeurtenistijd en bevestig de overdracht. De status wordt **Onderweg**. Bij **Bevestig aflevering** is daarnaast een referentie naar het afleverbewijs vereist. De bevestiging wordt opgeslagen in de tijdlijn.

Een open storing sluit niet automatisch door een statuswijziging. Open de impactverkenner en kies **Oplossing bevestigen** wanneer de oorzaak voor alle gekoppelde orders is verholpen. Vermeld de bevestiging van de partner. De uitzondering verdwijnt uit de open aandachtspunten; oorzaak en afsluiting blijven opgeslagen en gelogd.

### 6. Bekijk import en voorraad

**Import** toont de inkomende partijen uit Hongkong. De douanevertraging van HK-2026-081 heeft een onbekende ETA en koppelt drie orders aan de vertraagde SKU. Via **Partij registreren** maak je een extra partij aan met unieke referentie, leverancier, SKU, aantal en optionele ETA.

Kies bij HK-2026-081 **Bevestig ontvangst** en voer bijvoorbeeld 580 van de verwachte 600 stuks in. Alleen deze 580 verhogen de fysieke voorraad. De ontvangstknop wordt daarna uitgeschakeld en de mutatie is ook programmatisch tegen dubbeltelling beschermd. Het verschil van 20 staat in het logboek. Deze demo ondersteunt geen verdere deelontvangsten op dezelfde partij; registreer zo nodig een aparte vervolgpartij.

In **Magazijn** zie je fysiek, gereserveerd en beschikbaar per SKU. Reserveer een ontvangen order. Bij onvoldoende voorraad blijft de status gelijk en ontstaat een uitzondering met ontbrekend aantal, order en eigenaar. Overdracht aan Printz verbruikt de fysieke goederen en heft de bijbehorende reservering op. De demo controleert opeenvolgende acties binnen één venster; echte gelijktijdigheid vraagt backendtransacties.

### 7. Probeer de overige serviceacties

| Actie                                              | Verwacht resultaat                                                                                         |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Nieuwe order met 100 stuks en volledig adres       | Unieke B2B- of B2C-order, voorraadcontrole en één ontvangst-event                                          |
| Nieuwe order met 10.000 stuks van een beperkte SKU | Duidelijke voorraadfout; geen onbevestigde leverbelofte                                                    |
| B2B-prioriteit aanvinken                           | Prioriteit zichtbaar; bestaande reserveringen veranderen niet                                              |
| Printz → Storing melden                            | Aparte uitzondering; orderstatus blijft gelijk                                                             |
| DHL → Capaciteit plannen                           | Bij vraag boven capaciteit ontstaat of actualiseert een capaciteitsexceptie                                |
| Orderdossier → Probleem of klacht melden           | Adresprobleem, mislukte aflevering of personalisatieklacht met eigenaar en vervolgactie                    |
| SV → Simuleer Printz offline                       | Syncprobleem zichtbaar; nieuwe Printz-status- en ETA-bevestigingen worden geblokkeerd                      |
| SV → rol DHL                                       | Ontwerpverwijzing verdwijnt uit het orderdossier; aflevergegevens blijven zichtbaar                        |
| SV → rol Printz                                    | Klantnaam en adres verdwijnen uit het dossier; order, SKU en ontwerp blijven zichtbaar                     |
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

## Traceerbaarheid naar de requirements

Bron: het door de gebruiker aangeleverde **GIFTS4U_Requirements_ControlTower_Alle_Services.xlsx**, tabbladen **Requirements** en **Acceptatiecriteria**, rijen 2–44. Dit bestand bevat 35 functionele en acht niet-functionele eisen. De spreadsheet is gelezen en niet gewijzigd. De requirements beschrijven de beoogde oplossing; de onderstaande mapping beschrijft uitsluitend wat dit prototype daadwerkelijk demonstreert.

**Interactief** betekent dat de actie met lokale demodata werkt. **Gedeeltelijk** betekent dat een deel wordt getoond of gesimuleerd en het resterende deel vervolgwerk is. Geen van deze aanduidingen verklaart een productieacceptatietest geslaagd.

| ID        | Scherm / bewijs in het ontwerp        | Dekking en grens                                                                                                                         |
| --------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| FR-WEB-01 | Nieuwe order                          | Interactief: uniek ID, klanttype, SKU, aantal en leverbelofte                                                                            |
| FR-WEB-02 | Nieuwe order en DHL-bevestiging       | Interactief: verplichte adresvelden, postcodepatroon en huisnummer; geen externe adresverificatie                                        |
| FR-WEB-03 | Voorraadcontrole vóór orderacceptatie | Interactief voor bekende demo-SKU’s; productiebron kan niet uitvallen in dit prototype                                                   |
| FR-WEB-04 | Tijdlijn en logboek                   | Interactief: één lokaal ontvangst-event met ID, bron en tijdstip                                                                         |
| FR-WEB-05 | Nieuwe order en prioriteitslabel      | Interactief: gewenste datum en B2B-prioriteit, zonder herverdeling van bestaande reserveringen                                           |
| FR-IMP-01 | Partij registreren                    | Interactief: leverancier, SKU, aantal en unieke zendingreferentie                                                                        |
| FR-IMP-02 | Import en ontvangstlog                | Gedeeltelijk: schatting en bevestigde ontvangst; uitgebreide inbound-transporttijdlijn is vervolgwerk                                    |
| FR-IMP-03 | HK-2026-081 en EX-002                 | Gedeeltelijk: douane-uitzondering met oorzaak en eigenaar voorgeladen; nieuwe douane-events invoeren is vervolgwerk                      |
| FR-IMP-04 | Afhankelijke orders bij Import        | Gedeeltelijk: de startcasus heeft expliciete koppelingen; automatische afhankelijkheidsanalyse van nieuwe partijen is vervolgwerk        |
| FR-IMP-05 | Ontvangstbevestiging                  | Interactief: werkelijk ontvangen aantal wordt één keer voorraad                                                                          |
| FR-MAG-01 | Voorraadtabel                         | Interactief: fysiek minus reserveringen, niet-negatieve beschikbaarheid                                                                  |
| FR-MAG-02 | Ontvangst en logboek                  | Interactief: Stock Received met hoeveelheid, SKU, bron en tijdstip                                                                       |
| FR-MAG-03 | Reserveren                            | Gedeeltelijk: hercontrole en bescherming tegen overtoewijzing in één venster; geen gelijktijdige gebruikers/backendtransacties           |
| FR-MAG-04 | Tekort bij reserveren                 | Interactief: ontbrekend aantal, betrokken order en eigenaar                                                                              |
| FR-MAG-05 | Overdragen aan Printz                 | Interactief: reservering verbruikt, status-event met order en tijdstip                                                                   |
| FR-PRT-01 | Orderdossier                          | Interactief zichtbaar: order, SKU, aantal en één goedgekeurde ontwerpversie; geen afbeeldingsopslag                                      |
| FR-PRT-02 | Start bedrukking                      | Interactief: expliciet start-event met bron en tijdstip                                                                                  |
| FR-PRT-03 | Storing melden                        | Gedeeltelijk: machinestoring als aparte uitzondering; berekening van printcapaciteit is vervolgwerk                                      |
| FR-PRT-04 | Kwaliteitscontrole & vrijgave         | Interactief: verplichte controle van ontwerp en aantal/kwaliteit                                                                         |
| FR-PRT-05 | Verzendklaar                          | Interactief: vrijgave na controle, zichtbaar in DHL-perspectief                                                                          |
| FR-DHL-01 | DHL en orderdossier                   | Interactief: zending, gekoppelde order, fase, bestemming en geschatte levering                                                           |
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
| FR-CT-04  | Directiebesluit                       | Interactief als UI-simulatie: corrigerende actie, eigenaar, deadline en log; echte autorisatie en notificatie-escalatie zijn vervolgwerk |
| FR-CT-05  | KPI’s, orderalarm en grenscalculator  | Interactief: strikt >20%, te valideren; grafiek en scenariokosten zijn illustratief                                                      |
| NFR-01    | Demorolkeuze                          | Gedeeltelijk: selectieve UI-weergave en besluitguard; geen veilige serverautorisatie                                                     |
| NFR-02    | Event-ID en Test dubbel event         | Interactief: dubbele statusmutaties voorkomen in het lokale eventmodel                                                                   |
| NFR-03    | Logboek en tijdlijn                   | Gedeeltelijk: bron, actor, tijdstip en record aanwezig; lokale opslag is niet manipulatiebestendig                                       |
| NFR-04    | Printz offline                        | Gedeeltelijk: falen gesimuleerd, bevestigingen blijven behouden; geen echte API-retry of netwerkdetectie                                 |
| NFR-05    | Startset van 50 orders                | Dataset aanwezig; <3 seconden bruikbaarheid in een echte browser is nog niet gemeten                                                     |
| NFR-06    | DHL-/Printz-perspectief               | Gedeeltelijk: ontwerp versus afleverinformatie in het dossier; geen echte dataminimalisatie aan de serverkant                            |
| NFR-07    | localStorage                          | Gedeeltelijk: behoud na pagina-/browserherstart waar opslag beschikbaar is; geen backendherstel of back-up                               |
| NFR-08    | Drie gescheiden informatietypen       | Interactief zichtbaar: bevestiging, schatting en uitzondering met eigen labels                                                           |

## Uitgevoerde verificatie en resterende controle

Voer vanuit de repositoryroot uit:

```powershell
node --check products/prototype/app.js
node --test products/prototype/tests/prototype.test.cjs
git diff --check
```

De 12 tests slagen. Ze testen de echte applicatielogica met een kleine DOM-adapter: dataset, voorraad, alarmgrens, schermgeneratie, zoek-/filterlogica, onafhankelijke scenario’s/besluiten, dubbele events, importontvangst, offline blokkades, kwaliteits-/verzendflow, berichten/klachten, ontsnapping van HTML-invoer, rolweergave en behoud na opnieuw laden. Deze tests vervangen geen native formuliervalidatie, toetsenbordtest of browserrendering. De lokale server retourneerde HTTP 200 voor het prototype.

**Visuele browsercontrole is niet uitgevoerd.** Computer Use stopte omdat de huidige Chrome-URL niet betrouwbaar kon worden vastgesteld. Er zijn daarom geen gecontroleerde screenshots of gemeten browserlaadtijden opgenomen. Desktop- en mobiele CSS zijn geïmplementeerd, maar blijven handmatig te controleren.

De reviewer kan de volgende open controles uitvoeren vóór acceptatie:

1. Open het overzicht op circa 1440 × 1000 en 390 × 844 pixels. Controleer dat alleen brede tabellen horizontaal scrollen en de hoofdinterface binnen het scherm blijft.
2. Doorloop de bovenstaande herstelroute met muis én toetsenbord; controleer focus na dialogen en filterwissels.
3. Probeer lege adresvelden, ontbrekende kwaliteitsvinkjes en aflevering zonder bewijs. De browser moet verzending blokkeren.
4. Controleer zoeken, paginering, CSV-download, Escape, herladen en opslagblokkade in de beoogde browser.
5. Meet laden en bruikbaarheid met de 50 testorders tegen de eis van drie seconden.
6. Valideer terminologie, scenarioaannames en de >20%-grens met het projectteam en de opdrachtgever.

Het prototype gebruikt één browservenster als toestandsbron. Meerdere vensters of gebruikers kunnen elkaars opgeslagen wijzigingen overschrijven. Alle data staat leesbaar op de client; gebruik uitsluitend demo-invoer. Productie-authenticatie, betrouwbare partnerintegraties, server-side logging, concurrency, echte berichten en opslag van klantfoto’s vallen buiten dit ontwerpdocument en prototypeproduct.
