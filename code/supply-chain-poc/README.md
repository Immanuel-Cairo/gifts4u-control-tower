# Werkende verticale PoC: Webshop → Control Tower

Onderdeel van #191 / #180; ondersteunt een slice van #90, #91, #92, #94, #95, #96, #146, #148, #159 en #165. Deze stories zijn hiermee niet automatisch volledig af.

Twee HTTP-services en twee SQLite-databases tonen een geaccepteerde webshoporder in de Control Tower. De webshop slaat order en uitgaand event atomair op. De Control Tower bewaart event en projectie atomair, weigert inhoudelijke conflicten en dedupliceert retries. Onbevestigde uitwisseling blijft pending en wordt opnieuw geprobeerd.

## Starten

Vereist Node.js 24.x. Geen npm-installatie of externe database nodig; deze PoC gebruikt de [Node.js SQLite-API](https://nodejs.org/docs/latest-v24.x/api/sqlite.html). Deze API is in Node 24 nog experimenteel; de consolewaarschuwing is verwacht.

```sh
cd code/supply-chain-poc
npm start
```

- Webshopformulier: http://127.0.0.1:4010
- Control Tower: http://127.0.0.1:4011
- Stoppen: Ctrl+C. De gegevens blijven bewaard in `.data/`.

De services luisteren op 127.0.0.1. De launcher maakt een servicesleutel in `.data/service-key` voor de eventverbinding. De sleutel en databases zijn genegeerd door Git. Het formulier en de lees-API zijn een lokale demo zonder echte gebruikersauthenticatie: niet publiek hosten. Er worden geen echte klantberichten verstuurd.

## Demonstreren

1. Open het webshopformulier en gebruik de ingevulde fictieve gegevens.
2. Registreer een order. `synchronization: delivered` betekent dat de Control Tower de ontvangst heeft bevestigd; `pending` betekent dat de lokale order wel bestaat maar de uitwisseling nog onzeker is.
3. Open de Control Tower: dezelfde order-ID, regels, bron, gebeurtenistijd en test-leverbelofte verschijnen. Adres en klantfoto worden niet doorgestuurd.
4. Klik nogmaals op registreren met dezelfde aanvraag-ID: dezelfde order komt terug, geen dubbele tijdlijnrij.
5. Wijzig de inhoud zonder nieuwe aanvraag-ID: een conflict wordt getoond. Kies ‘Nieuwe aanvraag-ID’ voor een werkelijk nieuwe testorder.
6. Stop en herstart: de orders blijven beschikbaar. De automatische outboxretry verwerkt pending berichten opnieuw.

De integratietests voeren daarnaast echte HTTP-uitval/herstel, verloren bevestiging en herstart met bestanden uit.

## API

| Route | Gedrag |
| --- | --- |
| POST :4010/webshop/orders | JSON-order + Idempotency-Key; 201 nieuw / 200 exact duplicaat |
| GET :4010/webshop/orders/{orderId} | Order-ID, event-ID en synchronisatiestatus |
| POST :4011/control-tower/events | Order Received + X-Service-Key; 201 nieuw / 200 duplicaat / 409 conflict |
| GET :4011/control-tower/orders | Persistente orderprojecties voor de demo-UI |
| GET /health | Lokale servicestatus; webshop bevat het aantal pending updates |

[Contracten](../../products/fds/api/README.md) en [voorbeeldorder](../../products/fds/api/examples/order-request.json). De service accepteert maximaal 64 KiB JSON. SQL-waarden zijn geparametriseerd. Fouten bevatten geen stacktrace of credentials.

## Tests

```sh
npm run check
npm test
```

De tests gebruiken dynamische loopbackpoorten en tijdelijke databases; ze veranderen geen teamdatabases of externe services. Ze controleren observeerbaar API-gedrag, foutpaden, duurzame opslag en deduplicatie.

## Bewuste dekkingsgrenzen

- Voorraad is een **vaste teststub**: MUG-WHITE=100, TSHIRT-BLACK-M=200. Onbekende SKU geeft onbekende voorraad; te groot aantal geeft tekort. Aantallen worden niet gereserveerd of verminderd. Echte gelijktijdige voorraadreservering/compensatie is niet bewezen.
- De leverdatum en ontwerpversie zijn testinvoer, niet een berekende echte leverbelofte of geverifieerde ontwerpgoedkeuring.
- Alleen Order Received is aangesloten. Import, Magazijn, Printz, DHL, beslissingen en exceptions blijven vervolgwerk.
- De UI geeft ETA als onbekend en uitzonderingen als niet aangesloten weer; een lege lijst wordt niet gepresenteerd als bewijs dat er geen ketenproblemen zijn.
- De gedeelde servicesleutel vervangt geen productie-identiteiten, autorisatie, TLS, retentiebeleid of operationele monitoring.
- De outbox probeert pending berichten elke drie seconden opnieuw. Permanente 4xx-fouten blijven pending met `last_error` in de lokale database; productie vereist begrensde retries/escalatie.
- De bestaande gateway, Printz-service en Svelte-frontend blijven afzonderlijk. Dit is een uitvoerbare integratieproef, geen uitgerolde vervanging.

Er zijn geen wijzigingen aan release/master of deploymentinstellingen nodig om deze lokale proef uit te voeren. De ontwikkelroute blijft werkbranch → develop → release.
