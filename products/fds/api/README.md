# API-contracten en berichten

Concept voor review · #190 / #180. [Stroomcatalogus](flows.md) verbindt DFD-F-ID's met contracten. [Logisch datamodel](../erd/README.md) beschrijft de eigenaars en relaties. Endpointnamen zijn ontwerpkeuzes, geen bestaande partnerafspraken.

| Organisatie | Contract | Status |
| --- | --- | --- |
| Webshop | [OpenAPI](webshop.openapi.json) | POST /webshop/orders en GET /webshop/orders/{orderId} in lokale PoC; overige routes ontwerp |
| Import | [OpenAPI](import.openapi.json) | Ontwerp |
| Magazijn | [OpenAPI](warehouse.openapi.json) | Ontwerp; PoC gebruikt vaste voorraadstub |
| Printz | [OpenAPI](printz.openapi.json) | Ontwerp; bestaande GET /printz is nog een lege stub |
| DHL | [OpenAPI](dhl.openapi.json) | Ontwerp; geen echte DHL-verbinding |
| Control Tower | [OpenAPI](control-tower.openapi.json) | POST /control-tower/events en GET /control-tower/orders in lokale PoC; overige routes ontwerp |

De specificaties gebruiken OpenAPI 3.0.3 met gedeelde [schemas.json](schemas.json). Regenereer ze met `node products/fds/api/build-contracts.mjs`. `x-implementation` maakt voorgestelde en uitgevoerde routes onderscheidbaar. Er zijn geen echte externe serveradressen of credentials opgenomen.

## Uitgevoerde slice

Een order gaat met `Idempotency-Key` naar de Webshop. Order en Order Received-event worden samen opgeslagen. De webshop verstuurt het event met `X-Service-Key` naar de Control Tower, die bron, schema en identiteit controleert. Na succesvolle ontvangst wordt de uitgaande update delivered. Bij timeout/uitval blijft hij pending en wordt hij met dezelfde inhoud opnieuw aangeboden.

De Control Tower slaat ontvangen event en orderprojectie atomair op. Exact dezelfde eventinhoud geeft 200 en duplicate=true; nieuwe ontvangst geeft 201; een bestaande sleutel met gewijzigde inhoud geeft 409. De projectie bevat geen adres of klantfoto. Bron en gebeurtenistijd zijn zichtbaar; ETA is onbekend en exceptions zijn nog niet geïmplementeerd.

[Ordervoorbeeld](examples/order-request.json) · [Eventvoorbeeld](examples/order-received.json) · [Starten en tests](../../../code/supply-chain-poc/README.md)

## Fouten en gedragsregels

| Code | Betekenis |
| --- | --- |
| 400 | Ongeldige JSON of ontbrekende/ongeldige aanvraag-ID |
| 401 / 403 | Geen geldige identiteit / geen rechten |
| 404 | Onbekende resource |
| 409 | Inhoudelijk idempotentieconflict, voorraadtekort of ongeldige statusovergang |
| 413 / 415 | Bericht te groot / onjuist contenttype |
| 422 | Ongeldige inhoud, zoals ontbrekend adres of ongeldige aantallen |
| 503 | Afhankelijkheid of opslag niet beschikbaar |

Gebruik voor voorgestelde mutaties de resource/event-ID als idempotentiesleutel; de eerste orderaanvraag heeft een aparte Idempotency-Key omdat het order-ID nog niet bestaat. Identiteiten komen uit de toegangscontrole, niet uitsluitend uit een door de cliënt opgegeven source-veld. Een schema valideert structuur; bevoegdheid, bewijs en toegestane statusovergang vereisen aanvullende serverregels.

De voorraadstub toont geen echte reservering en voorkomt geen overselling tussen echte orders. De lokale services zijn een prototype en worden niet automatisch aangesloten op de bestaande gateway/frontend of op externe organisaties. De volgende integratietaken moeten echte reservering, service-authenticatie, alle partner-events en besluiten realiseren.

## Reviewkeuzes

Bevestig vóór productie de endpointnamen, organisatie-/service-identiteiten, gebruikersautorisatie, correctie van late events, bewijsvalidatie, retentie, retry/escalatie en transactionele reservering/compensatie. Dit blokkeert lokaal prototypen niet.
