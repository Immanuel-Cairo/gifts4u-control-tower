# GIFTS-4-U | Requirements-overzicht

_Voorstel voor de PoC — te bespreken en valideren met het projectteam en de opdrachtgever._

## Requirements

| # | FR/NFR | Requirement | Priority | SDLC Status | Last Status Change Date | Related Use Case | Owner in Project | Additional Info |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FR-WEB-01 | FR | Het systeem moet B2B- en B2C-bestellingen vastleggen met uniek ordernummer, klanttype, één of meer orderregels (SKU en aantal) en beloofde leverdatum, waarbij het oorspronkelijke ordernummer ongewijzigd door de hele keten wordt gebruikt. | MUST HAVE | RAISED |  | UC-WEB-01 | Nog toe te wijzen | Service: Webshop / Orders \| Test: Nieuwe B2B-order met 100 stuks \| Zie tabblad Acceptatiecriteria. |
| FR-WEB-02 | FR | Het systeem moet het bezorgadres controleren op verplichte velden voordat een order voor verzending wordt vrijgegeven. | MUST HAVE | RAISED |  | UC-WEB-02 | Nog toe te wijzen | Service: Webshop / Orders \| Test: Order met onvolledig adres \| Zie tabblad Acceptatiecriteria. |
| FR-WEB-03 | FR | Het systeem moet de voorraadbeschikbaarheid voor een bestelde SKU opvragen voordat de leverbelofte wordt bevestigd. | MUST HAVE | RAISED |  | UC-WEB-03 | Nog toe te wijzen | Service: Webshop / Orders \| Test: Order met onvoldoende voorraad \| Zie tabblad Acceptatiecriteria. |
| FR-WEB-04 | FR | Het systeem moet de gebeurtenis 'Order Received' inclusief bron en tijdstip delen met de Control Tower. | MUST HAVE | RAISED |  | UC-WEB-04 | Nog toe te wijzen | Service: Webshop / Orders \| Test: Nieuwe order delen met Control Tower \| Zie tabblad Acceptatiecriteria. |
| FR-WEB-05 | FR | Het systeem moet klantprioriteit en gewenste leverdatum per B2B-order vastleggen zonder bestaande voorraadreserveringen stilzwijgend te wijzigen. | SHOULD HAVE | RAISED |  | UC-WEB-05 | Nog toe te wijzen | Service: Webshop / Orders \| Test: B2B-prioriteitsorder \| Zie tabblad Acceptatiecriteria. |
| FR-IMP-01 | FR | Het systeem moet inkomende partijen blanco producten uit Hongkong registreren met SKU, aantal en zendingreferentie. | MUST HAVE | RAISED |  | UC-IMP-01 | Nog toe te wijzen | Service: Leverancier / Import \| Test: Inkomende Hongkong-zending \| Zie tabblad Acceptatiecriteria. |
| FR-IMP-02 | FR | Het systeem moet de verwachte aankomstdatum en de bevestigde transportgebeurtenissen van een importzending tonen. | SHOULD HAVE | RAISED |  | UC-IMP-02 | Nog toe te wijzen | Service: Leverancier / Import \| Test: Inkomende levering volgen \| Zie tabblad Acceptatiecriteria. |
| FR-IMP-03 | FR | Het systeem moet een douanevertraging of andere vertraging (bijv. brand in Hongkong), ook gesimuleerd in de demo, als uitzondering kunnen registreren en aan getroffen voorraadpartijen koppelen. | MUST HAVE | RAISED |  | UC-IMP-03 | Nog toe te wijzen | Service: Leverancier / Import \| Test: Douane houdt zending vast \| Zie tabblad Acceptatiecriteria. |
| FR-IMP-04 | FR | Het systeem moet de impact van vertraagde importvoorraad op openstaande bestellingen zichtbaar maken. | SHOULD HAVE | RAISED |  | UC-IMP-04 | Nog toe te wijzen | Service: Leverancier / Import \| Test: Douanevertraging raakt B2B-order \| Zie tabblad Acceptatiecriteria. |
| FR-IMP-05 | FR | Het systeem moet bevestigde ontvangst van importvoorraad doorgeven aan de magazijnservice. | MUST HAVE | RAISED |  | UC-IMP-05 | Nog toe te wijzen | Service: Leverancier / Import \| Test: Importvoorraad ontvangen \| Zie tabblad Acceptatiecriteria. |
| FR-MAG-01 | FR | Het systeem moet per SKU de fysieke, gereserveerde en beschikbare voorraad tonen. | MUST HAVE | RAISED |  | UC-MAG-01 | Nog toe te wijzen | Service: Magazijn / Voorraad \| Test: Voorraadoverzicht per SKU \| Zie tabblad Acceptatiecriteria. |
| FR-MAG-02 | FR | Het systeem moet de werkelijke ontvangst van goederen als 'Stock Received' vastleggen met SKU, aantal, datum en bron. | MUST HAVE | RAISED |  | UC-MAG-02 | Nog toe te wijzen | Service: Magazijn / Voorraad \| Test: Ontvangst uit Hongkong \| Zie tabblad Acceptatiecriteria. |
| FR-MAG-03 | FR | Het systeem moet voorraad voor orders kunnen reserveren zonder dubbele reservering van dezelfde aantallen. | MUST HAVE | RAISED |  | UC-MAG-03 | Nog toe te wijzen | Service: Magazijn / Voorraad \| Test: Laatste SKU, twee orders \| Zie tabblad Acceptatiecriteria. |
| FR-MAG-04 | FR | Het systeem moet een out-of-stock-uitzondering aanmaken wanneer een order niet volledig kan worden gereserveerd. | MUST HAVE | RAISED |  | UC-MAG-04 | Nog toe te wijzen | Service: Magazijn / Voorraad \| Test: SKU shortage \| Zie tabblad Acceptatiecriteria. |
| FR-MAG-05 | FR | Het systeem moet de overdracht van gereserveerde producten naar Printz registreren als 'Sent to Print'. | MUST HAVE | RAISED |  | UC-MAG-05 | Nog toe te wijzen | Service: Magazijn / Voorraad \| Test: Magazijn draagt goederen over \| Zie tabblad Acceptatiecriteria. |
| FR-PRT-01 | FR | Het systeem moet per printopdracht het order-ID, de SKU, het aantal en de juiste goedgekeurde ontwerpversie kunnen raadplegen. | MUST HAVE | RAISED |  | UC-PRT-01 | Nog toe te wijzen | Service: Printz / Bedrukking \| Test: Juiste foto bij juiste order \| Zie tabblad Acceptatiecriteria. |
| FR-PRT-02 | FR | Het systeem moet ‘Printing’ registreren zodra Printz meldt (in de demo: gesimuleerd) dat de bedrukking is gestart. | MUST HAVE | RAISED |  | UC-PRT-02 | Nog toe te wijzen | Service: Printz / Bedrukking \| Test: Printopdracht starten \| Zie tabblad Acceptatiecriteria. |
| FR-PRT-03 | FR | Het systeem moet machinestoringen en onvoldoende printcapaciteit als uitzonderingen kunnen registreren bij getroffen orders, en in de demo een probleem laten simuleren (bijv. via een knop). | MUST HAVE | RAISED |  | UC-PRT-03 | Nog toe te wijzen | Service: Printz / Bedrukking \| Test: Printmachine valt uit \| Zie tabblad Acceptatiecriteria. |
| FR-PRT-04 | FR | Het systeem moet na bedrukking de juiste personalisatie en aantallen laten controleren. | MUST HAVE | RAISED |  | UC-PRT-04 | Nog toe te wijzen | Service: Printz / Bedrukking \| Test: Verkeerde foto / kwaliteitscheck \| Zie tabblad Acceptatiecriteria. |
| FR-PRT-05 | FR | Het systeem moet 'Ready to Ship' delen wanneer productie en kwaliteitscontrole zijn afgerond. | MUST HAVE | RAISED |  | UC-PRT-05 | Nog toe te wijzen | Service: Printz / Bedrukking \| Test: Printopdracht gereed \| Zie tabblad Acceptatiecriteria. |
| FR-DHL-01 | FR | Het systeem moet per order de DHL-zending tonen met order-ID, bestemming, het punt in de DHL-route waar de zending zich bevindt (vervoersfase) en verwachte leverdatum. | MUST HAVE | RAISED |  | UC-DHL-01 | Nog toe te wijzen | Service: DHL / Transport \| Test: DHL-zendingenoverzicht \| Zie tabblad Acceptatiecriteria. |
| FR-DHL-02 | FR | Het systeem moet alleen na bevestigde overdracht/ophaling 'In Transit' en na afleverbewijs 'Delivered' registreren. | MUST HAVE | RAISED |  | UC-DHL-02 | Nog toe te wijzen | Service: DHL / Transport \| Test: Pakket ophalen en afleveren \| Zie tabblad Acceptatiecriteria. |
| FR-DHL-03 | FR | Het systeem moet geplande vervoersvraag en beschikbare capaciteit per datum tonen en tekorten melden. | MUST HAVE | RAISED |  | UC-DHL-03 | Nog toe te wijzen | Service: DHL / Transport \| Test: DHL ondercapaciteit \| Zie tabblad Acceptatiecriteria. |
| FR-DHL-04 | FR | Het systeem moet adresproblemen en mislukte afleverpogingen als uitzonderingen vastleggen. | MUST HAVE | RAISED |  | UC-DHL-04 | Nog toe te wijzen | Service: DHL / Transport \| Test: Verkeerd adres / failed delivery \| Zie tabblad Acceptatiecriteria. |
| FR-DHL-05 | FR | Het systeem moet gewijzigde verwachte levertijden en transportuitzonderingen delen met de Control Tower. | MUST HAVE | RAISED |  | UC-DHL-05 | Nog toe te wijzen | Service: DHL / Transport \| Test: DHL meldt vertraging \| Zie tabblad Acceptatiecriteria. |
| FR-KLM-01 | FR | Het systeem moet een klantupdate kunnen opstellen op basis van een bevestigd order-event. | MUST HAVE | RAISED |  | UC-KLM-01 | Nog toe te wijzen | Service: Klantcommunicatie \| Test: Orderstatus aan klant \| Zie tabblad Acceptatiecriteria. |
| FR-KLM-02 | FR | Het systeem moet klanten bij een bevestigd risico op vertraging kunnen informeren via een vastgelegde communicatiestap. | MUST HAVE | RAISED |  | UC-KLM-02 | Nog toe te wijzen | Service: Klantcommunicatie \| Test: Printstoring met klantimpact \| Zie tabblad Acceptatiecriteria. |
| FR-KLM-03 | FR | Het systeem moet alle verzonden of gesimuleerd verzonden klantberichten registreren met kanaal, ontvanger en tijdstip. | MUST HAVE | RAISED |  | UC-KLM-03 | Nog toe te wijzen | Service: Klantcommunicatie \| Test: Verzonden update terugvinden \| Zie tabblad Acceptatiecriteria. |
| FR-KLM-04 | FR | Het systeem moet kritieke B2B-communicatie aan een accountmanager of klantenservicemedewerker kunnen toewijzen. | SHOULD HAVE | RAISED |  | UC-KLM-04 | Nog toe te wijzen | Service: Klantcommunicatie \| Test: Prioritaire B2B-klant informeren \| Zie tabblad Acceptatiecriteria. |
| FR-KLM-05 | FR | Het systeem moet een klacht over verkeerde personalisatie kunnen registreren en koppelen aan retour, herdruk of vervanging. | COULD HAVE | RAISED |  | UC-KLM-05 | Nog toe te wijzen | Service: Klantcommunicatie \| Test: Wrong photo / return \| Zie tabblad Acceptatiecriteria. |
| FR-CT-01 | FR | De Control Tower moet een gedeeld overzicht van alle orders, laatste bevestigde events, partner en beloofde leverdatum tonen. | MUST HAVE | RAISED |  | UC-CT-01 | Nog toe te wijzen | Service: Control Tower \| Test: Centraal orderoverzicht \| Zie tabblad Acceptatiecriteria. |
| FR-CT-02 | FR | De Control Tower moet uitzonderingen onafhankelijk van de laatst bevestigde orderstatus registreren en tonen. | MUST HAVE | RAISED |  | UC-CT-02 | Nog toe te wijzen | Service: Control Tower \| Test: Exception naast orderstatus \| Zie tabblad Acceptatiecriteria. |
| FR-CT-03 | FR | De Control Tower moet per uitzondering betrokken orders, mogelijke leveringsimpact, urgentie, eigenaar en volgende actie tonen. | MUST HAVE | RAISED |  | UC-CT-03 | Nog toe te wijzen | Service: Control Tower \| Test: Impact van Printz-storing \| Zie tabblad Acceptatiecriteria. |
| FR-CT-04 | FR | De Control Tower moet kritieke uitzonderingen escaleren zodat de directeur een corrigerende beslissing kan registreren en toewijzen. | MUST HAVE | RAISED |  | UC-CT-04 | Nog toe te wijzen | Service: Control Tower \| Test: Directeur keurt alternatief goed \| Zie tabblad Acceptatiecriteria. |
| FR-CT-05 | FR | De Control Tower moet waarschuwingen en KPI's tonen, waaronder een leverlooptijd-overschrijding strikt groter dan 20%. | SHOULD HAVE | RAISED |  | UC-CT-05 | Nog toe te wijzen | Service: Control Tower \| Test: 5 dagen beloofd; 6 vs. 7 dagen \| Zie tabblad Acceptatiecriteria. Drempel >20% is nog door opdrachtgever te valideren. |
| NFR-01 | NFR | Het systeem moet toegang tot klantgegevens, foto's en beslissingen beperken op basis van gebruikersrollen. | MUST HAVE | RAISED |  | N.V.T. | Nog toe te wijzen | Service: Beveiliging \| Test: Toegangsrechten testen \| Zie tabblad Acceptatiecriteria. |
| NFR-02 | NFR | Het systeem moet duplicate events herkenbaar maken of zonder dubbele verwerking afhandelen. | MUST HAVE | RAISED |  | N.V.T. | Nog toe te wijzen | Service: Gegevenskwaliteit \| Test: Dubbele statusupdate \| Zie tabblad Acceptatiecriteria. |
| NFR-03 | NFR | Het systeem moet een controleerbaar log van status-events, uitzonderingen, besluiten en acties bijhouden. | MUST HAVE | RAISED |  | N.V.T. | Nog toe te wijzen | Service: Traceerbaarheid \| Test: Auditlog bekijken \| Zie tabblad Acceptatiecriteria. |
| NFR-04 | NFR | Het systeem moet een mislukte partnergegevensuitwisseling melden zonder informatie stilzwijgend als bevestigd te tonen. | MUST HAVE | RAISED |  | N.V.T. | Nog toe te wijzen | Service: Betrouwbaarheid \| Test: Partner-API offline \| Zie tabblad Acceptatiecriteria. |
| NFR-05 | NFR | De demonstratiedashboard moet binnen 3 seconden bruikbaar zijn met de afgesproken testdataset. | SHOULD HAVE | RAISED |  | N.V.T. | Nog toe te wijzen | Service: Prestaties \| Test: Performance test 50 orders \| Zie tabblad Acceptatiecriteria. |
| NFR-06 | NFR | Het systeem moet persoonsgegevens en klantontwerpen uitsluitend beschikbaar maken aan rollen die deze nodig hebben. | MUST HAVE | RAISED |  | N.V.T. | Nog toe te wijzen | Service: Privacy \| Test: Minimale gegevensdeling \| Zie tabblad Acceptatiecriteria. |
| NFR-07 | NFR | Het systeem moet bij herstart opgeslagen orders en gebeurtenissen behouden. | SHOULD HAVE | RAISED |  | N.V.T. | Nog toe te wijzen | Service: Herstelbaarheid \| Test: Backend herstarten \| Zie tabblad Acceptatiecriteria. |
| NFR-08 | NFR | De frontend moet bevestigde statussen onderscheiden van prognoses, risico's en open uitzonderingen. | MUST HAVE | RAISED |  | N.V.T. | Nog toe te wijzen | Service: Duidelijkheid \| Test: Status versus schatting \| Zie tabblad Acceptatiecriteria. |
|  |  | **Toegevoegd door aantekeningen Q&A, kijk dit nog na!!!** |  |  |  |  |  |  |
| FR-WEB-06 | FR | Het systeem mag na het plaatsen van een order geen wijzigingen van bezorgadres of annuleringen toestaan; informatie wijzigt niet halverwege de keten. | MUST HAVE | RAISED |  | UC-WEB-06 | Nog toe te wijzen | Service: Webshop / Orders \| Test: Poging tot adreswijziging of annulering na plaatsing \| Zie tabblad Acceptatiecriteria. |
| FR-MAG-06 | FR | Het systeem moet batchaantallen handmatig kunnen verhogen voor piekperiodes zoals Kerst en Valentijn. | SHOULD HAVE | RAISED |  | UC-MAG-06 | Nog toe te wijzen | Service: Magazijn / Voorraad \| Test: Batch verhogen voor Kerst \| Zie tabblad Acceptatiecriteria. |
| FR-CT-06 | FR | De Control Tower moet orders kunnen filteren (bijv. op status, klanttype, partner en uitzondering). | SHOULD HAVE | RAISED |  | UC-CT-06 | Nog toe te wijzen | Service: Control Tower \| Test: Orders filteren op uitzondering \| Zie tabblad Acceptatiecriteria. |
| FR-CT-07 | FR | De Control Tower moet een duidelijk voorraadoverzicht (tabblad) tonen met fysieke, gereserveerde en beschikbare voorraad per SKU, in aantallen producten. | MUST HAVE | RAISED |  | UC-CT-07 | Nog toe te wijzen | Service: Control Tower \| Test: Voorraadtabblad in Control Tower \| Zie tabblad Acceptatiecriteria. |
| FR-CT-08 | FR | De Control Tower moet per order een detailweergave bieden met huidige status, uitvoerbare acties, uitzonderingen en historie. | MUST HAVE | RAISED |  | UC-CT-08 | Nog toe te wijzen | Service: Control Tower \| Test: Doorklikken op een order \| Zie tabblad Acceptatiecriteria. |
| FR-CT-09 | FR | De Control Tower moet items waarop direct actie nodig is als eerste tonen en uitzonderingen duidelijk onderscheiden met kleur, zodat problemen zichtbaar zijn zonder te scrollen. | MUST HAVE | RAISED |  | UC-CT-09 | Nog toe te wijzen | Service: Control Tower \| Test: Dashboard met één uitzondering tussen geslaagde orders \| Zie tabblad Acceptatiecriteria. |
| FR-CT-10 | FR | De Control Tower moet op de homepage een beknopte, abstracte samenvatting tonen van waarom een order of uitzondering misgaat. | SHOULD HAVE | RAISED |  | UC-CT-10 | Nog toe te wijzen | Service: Control Tower \| Test: Samenvatting oorzaak op homepage \| Zie tabblad Acceptatiecriteria. |
| FR-CT-11 | FR | De Control Tower moet dashboardmeldingen tonen bij uitzonderingen wanneer er geen e-mailnotificaties worden verstuurd. | MUST HAVE | RAISED |  | UC-CT-11 | Nog toe te wijzen | Service: Control Tower \| Test: Uitzondering zonder e-mailnotificatie \| Zie tabblad Acceptatiecriteria. |

## Acceptatiecriteria

| Requirement ID | Service | Acceptatiecriterium (toetsbaar) | Testscenario | Prioriteit | Status |
| --- | --- | --- | --- | --- | --- |
| FR-WEB-01 | Webshop / Orders | Bij het plaatsen van een geldige bestelling ontstaat precies één order met verplichte velden, minimaal één orderregel en een uniek ID; dit ordernummer blijft ongewijzigd in alle services zichtbaar. | Nieuwe B2B-order met 100 stuks | MUST HAVE | Nog te testen |
| FR-WEB-02 | Webshop / Orders | Een ontbrekende postcode of huisnummer blokkeert verzending en toont een duidelijke foutmelding. | Order met onvolledig adres | MUST HAVE | Nog te testen |
| FR-WEB-03 | Webshop / Orders | Bij onvoldoende of onbekende voorraad wordt geen onbevestigde beschikbaarheid als zeker getoond. | Order met onvoldoende voorraad | MUST HAVE | Nog te testen |
| FR-WEB-04 | Webshop / Orders | Na orderacceptatie is het event één keer zichtbaar in de centrale tijdlijn met hetzelfde order-ID. | Nieuwe order delen met Control Tower | MUST HAVE | Nog te testen |
| FR-WEB-05 | Webshop / Orders | Een B2B-prioriteit is zichtbaar, maar bestaande B2C-reserveringen veranderen pas na expliciete actie. | B2B-prioriteitsorder | SHOULD HAVE | Nog te testen |
| FR-WEB-06 | Webshop / Orders | Na plaatsing van een order wordt een poging om het bezorgadres te wijzigen of de order te annuleren geweigerd; order en adres blijven ongewijzigd. | Poging tot adreswijziging of annulering na plaatsing | MUST HAVE | Nog te testen |
| FR-IMP-01 | Leverancier / Import | Een inkomende partij bevat leverancier, SKU, aantal en uniek zendingnummer. | Inkomende Hongkong-zending | MUST HAVE | Nog te testen |
| FR-IMP-02 | Leverancier / Import | De ETA is als schatting herkenbaar en elke bevestigde gebeurtenis heeft een bron en tijdstip. | Inkomende levering volgen | SHOULD HAVE | Nog te testen |
| FR-IMP-03 | Leverancier / Import | Bij 'Stuck in Customs' of een andere (ook gesimuleerde) vertraging ontstaat een exception met zending, eigenaar en oorzaak. | Douane houdt zending vast | MUST HAVE | Nog te testen |
| FR-IMP-04 | Leverancier / Import | Bestellingen met afhankelijkheid van de vertraagde SKU worden getoond met mogelijke leveringsimpact. | Douanevertraging raakt B2B-order | SHOULD HAVE | Nog te testen |
| FR-IMP-05 | Leverancier / Import | Na ontvangstbevestiging wordt precies het werkelijk ontvangen aantal aan de magazijnvoorraad toegevoegd. | Importvoorraad ontvangen | MUST HAVE | Nog te testen |
| FR-MAG-01 | Magazijn / Voorraad | Beschikbaar aantal is gelijk aan fysieke voorraad minus reserveringen en is niet negatief. | Voorraadoverzicht per SKU | MUST HAVE | Nog te testen |
| FR-MAG-02 | Magazijn / Voorraad | Alleen bevestigde goederenontvangst verhoogt fysieke voorraad; het event is terug te vinden. | Ontvangst uit Hongkong | MUST HAVE | Nog te testen |
| FR-MAG-03 | Magazijn / Voorraad | Twee gelijktijdige reserveringen kunnen samen niet meer dan de beschikbare voorraad toewijzen. | Laatste SKU, twee orders | MUST HAVE | Nog te testen |
| FR-MAG-04 | Magazijn / Voorraad | Een tekort toont de ontbrekende hoeveelheid, betrokken orders en verantwoordelijke. | SKU shortage | MUST HAVE | Nog te testen |
| FR-MAG-05 | Magazijn / Voorraad | Na bevestigde handover toont de Control Tower het event met order, aantallen en tijdstip. | Magazijn draagt goederen over | MUST HAVE | Nog te testen |
| FR-MAG-06 | Magazijn / Voorraad | Een bevoegde gebruiker kan het batchaantal van een SKU handmatig verhogen; de nieuwe aantallen zijn direct zichtbaar in het voorraadoverzicht en de wijziging is terug te vinden in het log. | Batch verhogen voor Kerst | SHOULD HAVE | Nog te testen |
| FR-PRT-01 | Printz / Bedrukking | Een printopdracht verwijst naar exact één bestelling en een herkenbare ontwerpversie. | Juiste foto bij juiste order | MUST HAVE | Nog te testen |
| FR-PRT-02 | Printz / Bedrukking | De Control Tower ontvangt het bevestigde (in de demo gesimuleerde) start-event met bron en tijdstip. | Printopdracht starten | MUST HAVE | Nog te testen |
| FR-PRT-03 | Printz / Bedrukking | Een storing, in de demo te simuleren (bijv. via een knop), is zichtbaar als afzonderlijke uitzondering; bestaande orderstatus blijft ongewijzigd. | Printmachine valt uit | MUST HAVE | Nog te testen |
| FR-PRT-04 | Printz / Bedrukking | Zonder geregistreerde kwaliteitscontrole kan de opdracht niet als verzendklaar worden bevestigd. | Verkeerde foto / kwaliteitscheck | MUST HAVE | Nog te testen |
| FR-PRT-05 | Printz / Bedrukking | Na bevestiging is de gebeurtenis zichtbaar met tijdstip; DHL kan de zending voorbereiden. | Printopdracht gereed | MUST HAVE | Nog te testen |
| FR-DHL-01 | DHL / Transport | Per order is de DHL-zending vindbaar met order-ID, bestemming, vervoersfase en verwachte leverdatum. | DHL-zendingenoverzicht | MUST HAVE | Nog te testen |
| FR-DHL-02 | DHL / Transport | Beide events vereisen zending-ID, gebeurtenistijd, bron; Delivered heeft afleverbewijs. | Pakket ophalen en afleveren | MUST HAVE | Nog te testen |
| FR-DHL-03 | DHL / Transport | Als geplande zendingen de capaciteit overschrijden ontstaat een capaciteitsexceptie. | DHL ondercapaciteit | MUST HAVE | Nog te testen |
| FR-DHL-04 | DHL / Transport | Een adres- of afleverprobleem bevat zending, reden, eigenaar en volgende actie. | Verkeerd adres / failed delivery | MUST HAVE | Nog te testen |
| FR-DHL-05 | DHL / Transport | Een nieuwe ETA blijft herkenbaar als schatting; de oorspronkelijke leverbelofte wordt niet overschreven. | DHL meldt vertraging | MUST HAVE | Nog te testen |
| FR-KLM-01 | Klantcommunicatie | Bij een relevant event wordt een conceptbericht met juist ordernummer en status aangemaakt. | Orderstatus aan klant | MUST HAVE | Nog te testen |
| FR-KLM-02 | Klantcommunicatie | Een betrokken klant krijgt een update met oorzaak en actuele ETA of expliciet 'nog onbekend'. | Printstoring met klantimpact | MUST HAVE | Nog te testen |
| FR-KLM-03 | Klantcommunicatie | Het communicatielog toont bericht, verzendstatus, ontvanger, kanaal en tijdstip. | Verzonden update terugvinden | MUST HAVE | Nog te testen |
| FR-KLM-04 | Klantcommunicatie | Het bericht heeft een toegewezen medewerker en open/afgehandeld-status. | Prioritaire B2B-klant informeren | SHOULD HAVE | Nog te testen |
| FR-KLM-05 | Klantcommunicatie | Een verkeerde-foto-klacht krijgt order-ID, oorzaak en gekozen vervolgactie. | Wrong photo / return | COULD HAVE | Nog te testen |
| FR-CT-01 | Control Tower | Updates van verschillende services verschijnen consequent bij dezelfde order en zijn herleidbaar naar bron en tijdstip. | Centraal orderoverzicht | MUST HAVE | Nog te testen |
| FR-CT-02 | Control Tower | Een printstoring bij status Printing verandert deze status niet en verschijnt als aparte uitzondering. | Exception naast orderstatus | MUST HAVE | Nog te testen |
| FR-CT-03 | Control Tower | Elke open exception toont minimaal betrokken order(s), inschatting, eigenaar en volgende stap; onbekend blijft onbekend. | Impact van Printz-storing | MUST HAVE | Nog te testen |
| FR-CT-04 | Control Tower | De directeur kan actie kiezen, eigenaar en deadline vastleggen; tijdstip en besluit worden bewaard. | Directeur keurt alternatief goed | MUST HAVE | Nog te testen |
| FR-CT-05 | Control Tower | Een overrun van precies 20% geeft geen >20%-alarm; 21% wel. Regel staat als te valideren bij opdrachtgever. | 5 dagen beloofd; 6 vs. 7 dagen | SHOULD HAVE | Nog te testen |
| FR-CT-06 | Control Tower | Na het kiezen van een filter (status, klanttype, partner of uitzondering) toont de lijst alleen de orders die aan het filter voldoen. | Orders filteren op uitzondering | SHOULD HAVE | Nog te testen |
| FR-CT-07 | Control Tower | Het voorraadtabblad toont per SKU fysieke, gereserveerde en beschikbare voorraad in aantallen producten; beschikbaar = fysiek minus gereserveerd. | Voorraadtabblad in Control Tower | MUST HAVE | Nog te testen |
| FR-CT-08 | Control Tower | Doorklikken op een order toont huidige status, uitvoerbare acties, uitzonderingen en historie van die order. | Doorklikken op een order | MUST HAVE | Nog te testen |
| FR-CT-09 | Control Tower | Items die directe actie vereisen staan bovenaan; een uitzondering is met kleur onderscheiden en zonder scrollen zichtbaar tussen geslaagde orders. | Dashboard met één uitzondering tussen geslaagde orders | MUST HAVE | Nog te testen |
| FR-CT-10 | Control Tower | De homepage toont per probleemorder of uitzondering een beknopte samenvatting van de oorzaak; onbekende oorzaak wordt als 'nog onbekend' getoond. | Samenvatting oorzaak op homepage | SHOULD HAVE | Nog te testen |
| FR-CT-11 | Control Tower | Bij een uitzondering waarvoor geen e-mailnotificatie wordt verstuurd verschijnt een dashboardmelding met order, oorzaak en tijdstip. | Uitzondering zonder e-mailnotificatie | MUST HAVE | Nog te testen |
| NFR-01 | Beveiliging | Een niet-bevoegde gebruiker kan geen klantfoto's of directiebesluiten bekijken/wijzigen. | Toegangsrechten testen | MUST HAVE | Nog te testen |
| NFR-02 | Gegevenskwaliteit | Tweemaal dezelfde event-ID verwerken verandert de status niet twee keer. | Dubbele statusupdate | MUST HAVE | Nog te testen |
| NFR-03 | Traceerbaarheid | Voor elke wijziging is bron, tijdstip, betrokken record en actor terug te vinden. | Auditlog bekijken | MUST HAVE | Nog te testen |
| NFR-04 | Betrouwbaarheid | Bij API-fout verschijnt synchronisatieprobleem en blijft laatste bevestigde event zichtbaar. | Partner-API offline | MUST HAVE | Nog te testen |
| NFR-05 | Prestaties | Met minimaal 50 testorders laadt dashboard binnen 3 seconden in lokale demo-omgeving. | Performance test 50 orders | SHOULD HAVE | Nog te testen |
| NFR-06 | Privacy | DHL ziet noodzakelijke aflevergegevens maar niet de klantfoto voor bedrukking. | Minimale gegevensdeling | MUST HAVE | Nog te testen |
| NFR-07 | Herstelbaarheid | Na herstart zijn orderstatussen, uitzonderingen en besluiten ongewijzigd beschikbaar. | Backend herstarten | SHOULD HAVE | Nog te testen |
| NFR-08 | Duidelijkheid | Een gebruiker kan op orderdetail bevestigd event, geschatte ETA en exception afzonderlijk herkennen. | Status versus schatting | MUST HAVE | Nog te testen |

## Overzicht

| Service | Functionele eisen | Must have | Should have | Could have |
| --- | --- | --- | --- | --- |
| Webshop / Orders | 6 | 5 | 1 | 0 |
| Leverancier / Import | 5 | 3 | 2 | 0 |
| Magazijn / Voorraad | 6 | 5 | 1 | 0 |
| Printz / Bedrukking | 5 | 5 | 0 | 0 |
| DHL / Transport | 5 | 5 | 0 | 0 |
| Klantcommunicatie | 5 | 3 | 1 | 1 |
| Control Tower | 11 | 8 | 3 | 0 |
| **Totaal functioneel** | **43** | **34** | **8** | **1** |

| Kengetal | Aantal |
| --- | --- |
| Niet-functionele eisen | 8 |
| Totaal requirements | 51 |
