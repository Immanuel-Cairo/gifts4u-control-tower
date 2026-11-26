# FDS — Supply Chain

Werkpakket bij [#180](https://github.com/Immanuel-Cairo/gifts4u-control-tower/issues/180), gebaseerd op Mike's door de gebruiker aangeleverde verduidelijking. Status: opgeleverd voor inhoudelijke teamreview; geen docent- of teamgoedkeuring verondersteld.

## Omvang

| Product | Oplevering | Verwachting | Taak |
| --- | --- | --- | --- |
| DFD Level 0 | Zes organisatiecontexten | Zes; geen Level 1/2 | #182 |
| UCD | Zes organisatiediagrammen | Per organisatie gewenst, vooral Control Tower | #183 |
| Use-case-specificatie | Webshop, DHL, Control Tower | Minimaal drie; één per organisatie gewenst | #184–#186 |
| Activitydiagram | Zes organisatieprocessen | Per organisatie ideaal; niet per use case | #187 |
| ERD | Eén logisch systeemmodel | Minimaal één; organisatieverdeling is keuze | #188 |
| Componentdiagram | Eén ketendiagram met API's | Vijf organisaties + Control Tower | #189 |
| API-contracten | Zes contracten en stroomcatalogus | Data/berichten als basis voor coding | #190 |
| Werkende slice | Webshoporder → HTTP → Control Tower | Iteratief coderen naast ontwerpen | #191 |

## Organisatieoverzicht

| Organisatie | DFD | UCD | Activity | Use case | API | Eigenaar / reviewer |
| --- | --- | --- | --- | --- | --- | --- |
| Webshop / Orders | [Level 0](dfd/webshop.md) | [UCD](ucd/webshop.md) | [Proces](activity/webshop.md) | [Specificatie](use-cases/webshop.md) | [Contract](api/webshop.openapi.json) | Team wijst toe |
| Leverancier Hongkong / Import | [Level 0](dfd/import.md) | [UCD](ucd/import.md) | [Proces](activity/import.md) | Uitbreiding na de drie minimumspecificaties | [Contract](api/import.openapi.json) | Team wijst toe |
| Magazijn / Voorraad | [Level 0](dfd/warehouse.md) | [UCD](ucd/warehouse.md) | [Proces](activity/warehouse.md) | Uitbreiding na de drie minimumspecificaties | [Contract](api/warehouse.openapi.json) | Team wijst toe |
| Printz / Bedrukking | [Level 0](dfd/printz.md) | [UCD](ucd/printz.md) | [Proces](activity/printz.md) | Uitbreiding na de drie minimumspecificaties | [Contract](api/printz.openapi.json) | Team wijst toe |
| DHL / Transport | [Level 0](dfd/dhl.md) | [UCD](ucd/dhl.md) | [Proces](activity/dhl.md) | [Specificatie](use-cases/dhl.md) | [Contract](api/dhl.openapi.json) | Team wijst toe |
| Control Tower | [Level 0](dfd/control-tower.md) | [UCD](ucd/control-tower.md) | [Proces](activity/control-tower.md) | [Specificatie](use-cases/control-tower.md) | [Contract](api/control-tower.openapi.json) | Team wijst toe |

[Logisch ERD](erd/README.md) · [Componentdiagram](component/README.md) · [Stroomcatalogus](api/flows.md) · [API-status en voorbeelden](api/README.md) · [Werkende PoC](../../code/supply-chain-poc/README.md)

## Bestaand werk en hergebruik

- De bestaande requirements in [documents/Requirments/GIFTS4U_Requirements.md](../../documents/Requirments/GIFTS4U_Requirements.md) geven de zes functionele organisatiegroepen. Klantcommunicatie is geen zevende organisatie.
- [PR #74](https://github.com/Immanuel-Cairo/gifts4u-control-tower/pull/74) levert Control Tower-context. De nieuwe set gebruikt dezelfde grens met één beheerder en voegt de vijf andere organisaties en consistente stroom-ID's toe. Oude bronnen blijven behouden voor review.
- [PR #82](https://github.com/Immanuel-Cairo/gifts4u-control-tower/pull/82) levert de inhoudelijke basis voor de DHL-specificatie; oude verwijzingen naar verwijderde issues worden in dit pakket vervangen door actuele requirements en stories.
- [PR #83](https://github.com/Immanuel-Cairo/gifts4u-control-tower/pull/83) is een detailflow voor UC-DHL-02. Het nieuwe DHL-activitydiagram omvat ook planning, ETA, uitzonderingen en synchronisatie.
- Bestaand [ERD](../../documents/ERD/gifts4u-erd.svg): User, Order, Item, BlankProduct, ImportShipment(Line), Shipment, Exception en PrintJob zijn hergebruikt als concepten. De nieuwe logische variant maakt reservering, event-identiteit, bewijs en besluit/actie expliciet. Geen automatische databasemigratie.
- Bestaand componentdiagram onder documents/Componentdiagram blijft referentie; de nieuwe versie koppelt zes contexten aan benoemde endpoints.
- Printz-service heeft een lege GET-implementatie; de frontend bevat een welkomstpagina. Deze leveren nog geen werkende gegevensuitwisseling. De nieuwe PoC is afzonderlijk uitvoerbaar en wijzigt deze teamcode niet.

## Open reviewpunten

1. Bevestig functionele organisatiegrenzen, juridische namen, eigenaren en reviewers.
2. Bevestig dat klantcommunicatie onder Webshop valt en beslissingen door één Control Tower-beheerder worden geregistreerd namens de bevoegde beslisser.
3. Bevestig de logistieke overdracht magazijn → Printz: de probleemstelling noemt vervoer door DHL; het handovercontract registreert de bevestiging, niet een onbewezen directe fysieke levering.
4. Leg voorraad-/reserveringsbeleid vast: leverbelofte vereist een echte reservering; de PoC gebruikt nadrukkelijk een teststub en bewijst dit niet.
5. Bespreek met Mike of aanvullende specificaties voor Import, Magazijn en Printz gewenst zijn naast het minimum van drie, en laat de organisatiebrede activitydekking beoordelen.
6. Bevestig endpointnamen, service-identiteiten, retentie van bewijs en retry/escalatiebeleid.

Deze vragen verhinderen geen prototyping. Teamreview, afspraken en Mike's antwoorden blijven open; er zijn geen berichten namens het team verzonden.

## Werkwijze

Elke taak heeft een eigen PR naar develop. Gewone ontwikkeling volgt werkbranch → develop → release; master is uiteindelijke productie buiten dit werkpakket. Review en merge worden door het team gedaan. De parent #180 wordt niet gesloten door één gedeeltelijke PR.

## Diagrammen opnieuw renderen

PlantUML-bronnen staan naast de SVG's. Getest met PlantUML 1.2026.10: `java -jar plantuml.jar -charset UTF-8 -tsvg "products/fds/**/*.puml"`. Zie de [officiële CLI-documentatie](https://plantuml.com/command-line). De SVG's zijn zelfstandige, schaalbare reviewartefacten.
