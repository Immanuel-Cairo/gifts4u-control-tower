# Webshop Service

REST API voor webshoporders in de GIFTS-4U Control Tower. Gebouwd met Node.js 24, TypeScript, Express, Prisma 7 en SQLite, op dezelfde manier als [printz-service](../printz-service).

> Zelfstandige microservice op poort 4002. De service wordt door de CI-workflow (`.github/workflows/ci.yml`) meegebouwd en getest. Deze basis hoort bij [#205](https://github.com/Immanuel-Cairo/gifts4u-control-tower/issues/205); orderacceptatie, leverbelofte en events blijven bij de bestaande webshop user stories.

## Endpoints

| Methode | Pad | Omschrijving |
| --- | --- | --- |
| `GET` | `/health` | Healthcheck met `service: 'webshop-service'` |
| `GET` | `/webshop/orders` | Orders als `{ data: [...], meta: { count } }` (voorlopig lege stub) |

## Quick start

### Vereisten

- Node.js 24
- npm

### Installatie

```bash
cp .env.example .env
npm install            # installeert dependencies en genereert de Prisma client (postinstall)
npm run prisma:migrate # maakt de SQLite-database en migraties aan
npm run prisma:seed    # twee voorbeeldorders
npm run dev
```

De API draait daarna op `http://localhost:4002`.

### Build en tests

```bash
npm run lint
npm run build
npm test
```

Met een draaiende server kan de API-smoketest worden uitgevoerd met `npm run test:api` (of `BASE_URL=http://... npm run test:api`).

### Docker

`.env` zit niet in het image (zie `.dockerignore`); geef omgevingsvariabelen door bij `docker run`:

```bash
docker build -t webshop-service .
docker run -p 4002:4002 \
  -e DATABASE_URL=file:/data/database.sqlite \
  -e SEED_DATABASE=true \
  -v $(pwd)/data:/data \
  webshop-service
```

`entrypoint.sh` voert `prisma migrate deploy` uit vóór de start. Met `SEED_DATABASE=true` worden bij elke start twee voorbeeldorders ingeladen; zonder die variabele blijft de bestaande database bewaard.

## Scope

Deze service levert de basis: eigen projectconfiguratie, database-model (`Order` + `OrderStatusHistory`), healthcheck, orderlijst, unit-test, API-smoketest en CI-dekking. De orderlijst is nog een stub; het vullen van orders en het versturen van `Order Received` naar de Control Tower volgt in de webshop user stories (#90–#98, #167).
