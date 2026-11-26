# Gegevensstromen en API-koppeling

Concept voor review · #190 / #180. F-ID's komen terug op de zes Level 0 DFD's.

De vijf ketenorganisaties zijn Webshop, Leverancier/Import, Magazijn, Printz en DHL; de Control Tower vormt de zesde context. Dit volgt de FR-WEB/IMP/MAG/PRT/DHL/CT-groepen. Klantcommunicatie is een cross-servicefunctie (operationeel onder Webshop in dit voorstel); auth en gateway zijn infrastructuur. Juridische namen, eigenaars en reviewers moeten het team nog bevestigen.

| ID | Zender | Ontvanger | Gegevens | Interfacevoorstel | Schema |
| --- | --- | --- | --- | --- | --- |
| F01 | Klant / ontvanger | Webshop / Orders | Bestelling, adres, regels en ontwerpverwijzing | `POST /webshop/orders` | OrderRequest |
| F02 | Webshop / Orders | Klant / ontvanger | Order-ID, synchronisatie en acceptatieresultaat | `response POST /webshop/orders` | OrderResult |
| F03 | Webshop / Orders | Magazijn / Voorraad | SKU voor beschikbaarheidscontrole | `GET /warehouse/stock/{sku}` | StockQuery |
| F04 | Magazijn / Voorraad | Webshop / Orders | Fysieke, gereserveerde en beschikbare voorraad | `response GET /warehouse/stock/{sku}` | Stock |
| F05 | Webshop / Orders | Magazijn / Voorraad | Reserveringsverzoek met order-ID en regels | `POST /warehouse/reservations` | Reservation |
| F06 | Magazijn / Voorraad | Webshop / Orders | Reservering of tekort met ontbrekend aantal | `response POST /warehouse/reservations` | ReservationResult |
| F07 | Webshop / Orders | Printz / Bedrukking | Orderregels en goedgekeurde ontwerpversie | `POST /printz/jobs` | PrintJob |
| F08 | Leverancier- en transportbron | Leverancier Hongkong / Import | Partij, zendingreferentie en transportinformatie | `POST /import/shipments` | ImportShipment |
| F09 | Leverancier Hongkong / Import | Magazijn / Voorraad | Bevestigde ontvangst: receipt-ID, SKU en werkelijk aantal | `POST /warehouse/receipts` | Receipt |
| F10 | Magazijn / Voorraad | Leverancier Hongkong / Import | Verwerkte ontvangst of registratiefout | `response POST /warehouse/receipts` | ReceiptResult |
| F11 | Magazijn / Voorraad | Printz / Bedrukking | Bevestigde overdracht en gereserveerde aantallen | `POST /printz/jobs/{jobId}/handover` | Handover |
| F12 | Printz / Bedrukking | DHL / Transport | Verzendklare opdracht, order-ID en aantallen | `POST /dhl/shipments` | ShipmentRequest |
| F13 | Webshop / Orders | DHL / Transport | Minimale aflevergegevens van de order | `response GET /webshop/orders/{orderId}/delivery` | Address |
| F14 | DHL / Transport | Webshop / Orders | Order-ID voor aflevergegevens | `GET /webshop/orders/{orderId}/delivery` | DeliveryQuery |
| F15 | Webshop / Orders | Control Tower | Order Received met order-ID, bron en tijdstip | `POST /control-tower/events` | OrderReceived |
| F16 | Leverancier Hongkong / Import | Control Tower | Partij-event, ETA of importuitzondering | `POST /control-tower/partner-events` | PartnerEvent |
| F17 | Magazijn / Voorraad | Control Tower | Voorraadsnapshot, Stock Received of Sent to Print | `POST /control-tower/partner-events` | PartnerEvent |
| F18 | Printz / Bedrukking | Control Tower | Printing, Ready to Ship of printuitzondering | `POST /control-tower/partner-events` | PartnerEvent |
| F19 | DHL / Transport | Control Tower | Ophaling, aflevering, ETA of transportuitzondering | `POST /control-tower/partner-events` | PartnerEvent |
| F20 | Control Tower | Webshop / Orders | Goedgekeurde klantupdate met eventreferentie | `POST /webshop/customer-updates` | CustomerUpdate |
| F21 | Webshop / Orders | Control Tower | Communicatielog: resultaat en verzendstatus | `POST /control-tower/partner-events` | PartnerEvent |
| F22 | Control Tower-beheerder | Control Tower | Filter, beoordeling en bevoegd genomen besluit | `POST /control-tower/decisions` | Decision |
| F23 | Control Tower | Control Tower-beheerder | Orderoverzicht, historie, ETA en uitzonderingen | `response GET /control-tower/orders` | OrderList |
| F24 | Control Tower | Leverancier Hongkong / Import | Impactoverzicht van orders afhankelijk van partij | `response GET /control-tower/impact/{lotId}` | Impact |
| F25 | Control Tower | Magazijn / Voorraad | Vastgelegde voorraadactie en eigenaar | `response GET /control-tower/actions?owner=warehouse` | ActionList |
| F26 | Control Tower | Printz / Bedrukking | Vastgelegde productieactie en eigenaar | `response GET /control-tower/actions?owner=printz` | ActionList |
| F27 | Control Tower | DHL / Transport | Vastgelegde transportactie en eigenaar | `response GET /control-tower/actions?owner=dhl` | ActionList |
| F28 | Klant / ontvanger | Webshop / Orders | Klacht en orderreferentie | `POST /webshop/complaints` | Complaint |
| F29 | Webshop / Orders | Klant / ontvanger | Klantupdate of klachtbevestiging | `response / klantcommunicatie` | CustomerUpdate |
| F30 | Leverancier Hongkong / Import | Control Tower | Partij-ID voor impactbepaling | `GET /control-tower/impact/{lotId}` | ImpactQuery |
| F31 | Magazijn / Voorraad | Control Tower | Eigenaarfilter voor voorraadacties | `GET /control-tower/actions?owner=warehouse` | ActionQuery |
| F32 | Printz / Bedrukking | Control Tower | Eigenaarfilter voor productieacties | `GET /control-tower/actions?owner=printz` | ActionQuery |
| F33 | DHL / Transport | Control Tower | Eigenaarfilter voor transportacties | `GET /control-tower/actions?owner=dhl` | ActionQuery |

## Contractafspraken

- Het oorspronkelijke order-ID blijft gelijk; SKU, lot-ID, shipment-ID en event-ID hebben een eigen betekenis. Een partij-event heeft niet noodzakelijk een order-ID.
- Tijdstippen bevatten een tijdzone. occurredAt is gebeurtenistijd; receivedAt is ontvangsttijd; ETA blijft een schatting.
- Event-ID + bron identificeren één onveranderlijk bericht. Exacte retries geven hetzelfde resultaat; gewijzigde inhoud met dezelfde sleutel is een conflict (409).
- Schrijf lokale wijziging en uitgaande update atomair; retry gebruikt dezelfde inhoud en ID. Een timeout bewijst niet dat de ontvanger niets heeft opgeslagen.
- Bronsystemen bezitten hun gegevens; Control Tower bewaart een projectie en auditspoor. Een exception verandert de bevestigde status niet.
- Endpointpaden, eigenaarschap van klantcommunicatie en polling van toegewezen acties zijn ontwerpvoorstellen voor teamreview.
- Alleen de expliciet gemarkeerde PoC-endpoints zijn in deze oplevering uitvoerbaar; bestaande Printz GET-route is een lege stub. Andere contracten zijn nog te implementeren.
- Productie vereist brongebonden service-identiteiten en rolgebaseerde autorisatie. De lokale PoC gebruikt een aparte gedeelde servicesleutel voor de webshop → Control Tower-verbinding en luistert alleen op loopback.

## Data minimaliseren

DHL ontvangt bestemming en logistieke identifiers, geen klantfoto of ontwerpbestand. Control Tower-events gebruiken metadata en verwijzingen; geen wachtwoorden, bestanden of complete adresgegevens. Een ontwerpverwijzing geeft op zichzelf geen leesrecht. Persoonsgegevens en bewijs worden alleen via geautoriseerde detailinterfaces opgehaald.
