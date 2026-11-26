# UC-WEB-01 — Bestelling accepteren en delen

Concept voor review · #184 / #180. Organisatie: Webshop / Orders. Primaire actor: B2B- of B2C-klant. Ondersteunende systemen: Magazijn en Control Tower.

## Doel en grens

Een geldige bestelling krijgt één blijvend order-ID, een controleerbare leverbelofte en een herleidbaar Order Received-event. Eén uitvoering accepteert één order; betaling, bedrukking, vervoer en latere klantcommunicatie vallen buiten deze uitvoering. Dit is één use-case-specificatie voor de Webshop, geen claim dat alle webshopdoelen zijn geïmplementeerd.

Bronnen: FR-WEB-01/02/03/04/05/06, NFR-02/03/04/07; stories #90–#98 en #167. [Organisatie-UCD](../ucd/webshop.md), [organisatieproces](../activity/webshop.md), [DFD](../dfd/webshop.md), [API](../api/webshop.openapi.json).

## Trigger en voorwaarden

- Trigger: klant dient de bestelling in met dezelfde aanvraag-ID bij een technische retry.
- Vooraf: de klant heeft regels, ontwerpversie, afleveradres en gewenste leverdatum ingevuld. Het systeem controleert deze gegevens tijdens de uitvoering.
- Succes: order en uitgaand event zijn duurzaam opgeslagen; Control Tower heeft ontvangst bevestigd, of de nog niet bevestigde synchronisatie is zichtbaar.
- Minimale garantie: ongeldige invoer wordt niet geaccepteerd; een onzekere API-uitkomst leidt niet tot een tweede order. De originele order-ID en leverbelofte worden niet stilzwijgend gewijzigd.

## Gegevens

Klanttype B2B/B2C; één of meer regels met SKU en positief geheel aantal; goedgekeurde ontwerpversie als referentie; straat, huisnummer, postcode, plaats en land; beloofde leverdatum. De server bepaalt order-ID, event-ID, bron, registratietijd en synchronisatiestatus. De idempotentiesleutel is een unieke clientaanvraag-ID, geen order-ID. Een B2B-prioriteit mag bestaande reserveringen niet wijzigen zonder expliciet besluit.

## Hoofdscenario

| Stap | Actor/systeem | Gedrag |
| --- | --- | --- |
| H1 | Klant | Dient de bestelling en aanvraag-ID in. |
| H2 | Webshop | Valideert adres, regels, klanttype en ontwerpverwijzing; controleert hergebruik van aanvraag-ID. |
| H3 | Webshop → Magazijn | Vraagt actuele beschikbaarheid per SKU en reserveert de gevraagde aantallen atomair. |
| H4 | Webshop | Bepaalt en bevestigt de leverbelofte op basis van bevestigde beschikbaarheid en planning. |
| H5 | Webshop | Slaat order en uitgaand Order Received-event in één transactie op. |
| H6 | Webshop → Control Tower | Stuurt event-ID, order-ID, klanttype, regels, leverbelofte, bron en gebeurtenistijd; geen adres of klantfoto. |
| H7 | Control Tower | Valideert bron/bericht, verwerkt het event idempotent en bevestigt ontvangst. |
| H8 | Webshop | Legt de synchronisatiebevestiging vast en toont order-ID, leverbelofte en synchronisatiestatus. |

## Alternatieven en fouten

| Situatie | Afhandeling |
| --- | --- |
| Exacte herhaling van H1 | Geef dezelfde order terug; maak geen tweede event. Controleer een bekende aanvraag vóór een nieuwe voorraadcheck. |
| Zelfde aanvraag-ID, andere gegevens | 409 conflict; bestaande order blijft intact. |
| Adres/regel/ontwerpverwijzing ongeldig | 422 met begrijpelijke fout; geen order of uitgaand event. Ontwerpinzage vereist apart toegangsrecht. |
| Voorraad onvoldoende | Geen onbevestigde beschikbaarheid of leverbelofte tonen; geef tekort en mogelijke vervolgstap. |
| Magazijn onbereikbaar/onbekende voorraad | Meld onbekende beschikbaarheid, blokkeer bevestiging en bied later opnieuw proberen. |
| Gelijktijdige reservering verliest laatste voorraad | Magazijn wijst af; maak geen order met een ongedekte belofte. |
| Opslag mislukt | Order en uitgaand event worden samen teruggedraaid. Een reeds toegekende reservering moet worden vrijgegeven/gecompenseerd; dit protocol is nog te bevestigen. |
| Control Tower onbereikbaar of antwoord verloren | Order blijft lokaal geldig; outbox blijft pending. Toon synchronisatieprobleem en retry met dezelfde event-ID. |
| Adreswijziging/annulering na plaatsing | Weiger volgens FR-WEB-06; leg een expliciet afwijkingsproces apart vast indien opdrachtgever dit later toestaat. |

## Acceptatiecriteria

1. Een geldige B2B- of B2C-order heeft precies één order-ID, minimaal één geldige regel en een leverbelofte; dezelfde ID verschijnt in Control Tower.
2. Ontbrekende postcode/huisnummer en niet-positieve of niet-gehele aantallen geven geen order/event.
3. Onvoldoende of onbekende voorraad leidt niet tot een bevestigde beschikbaarheidsclaim.
4. Identieke retries, ook gelijktijdig, geven dezelfde order en één tijdlijnitem; andere inhoud onder dezelfde sleutel geeft een conflict.
5. Na herstart blijven order, event en pending uitwisseling beschikbaar; retry herstelt synchronisatie zonder duplicaat.
6. Control Tower toont bron en gebeurtenistijd; geen adres of ontwerpbestand wordt in dit event gedeeld.
7. Echte reserveringen voorkomen overselling en blijven bij fouten consistent; dit vereist integratietests met de magazijnservice.

## Implementatiegrens en open keuzes

De [PoC](../../../code/supply-chain-poc/README.md) implementeert lokale validatie, duurzame order/outbox, HTTP-overdracht, idempotentie en een Control Tower-projectie. **Voorraad is een expliciete vaste teststub**, geen reserveringsservice. Ontwerpgoedkeuring, capaciteitsplanning, betaling, echte klantauthenticatie en compensatie zijn nog niet gerealiseerd. Een ingevoerde leverdatum in de demo is testdata, geen berekende echte leverbelofte. Criteria 3 en 7 zijn daarom nog niet als volledige magazijnintegratie behaald.

Te reviewen: reservering/compensatie, autorisatie, prioriteitsbeleid en leverdatumberekening. Geen fictieve peer review of urenregistratie.
