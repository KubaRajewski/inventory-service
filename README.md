# Inventory Service (Warehouse / Retail Stock Management)

A simple full-stack demo system for managing product catalog, stock levels (shopfloor/backroom), inventory movements, and sales imports from CSV.  
The project consists of:
- **Backend**: Micronaut 4 + PostgreSQL + Flyway migrations + OpenAPI/Swagger
- **Frontend**: Vite + React + TypeScript + Tailwind + shadcn/ui

> Goal: deliver a clean, presentable UI for demo/video while keeping the backend logic correct and consistent.

---

## Features (high level)

### Backend
- Product catalog (SKU, name, unit, minTotal, active)
- Stock per location:
  - `BACKROOM` (zaplecze)
  - `SHOPFLOOR` (sala)
- Movements:
  - receipt (increase)
  - issue (decrease)
  - transfer (between locations)
  - sales import (CSV)
- Order suggestions:
  - calculates missing quantity to reach `minTotal`
  - exports low-stock suggestions to CSV

### Frontend
- Dashboard + navigation layout (AppShell)
- Products list + add/edit (UI)
- Stocks view with low-stock filter (UI)
- Order suggestions table + CSV export (UI)
- “Coming soon” placeholders for additional modules (reports, settings, etc.)

---

## Tech stack

### Backend
- Java 17+
- Micronaut 4
- Micronaut Data JDBC + HikariCP
- PostgreSQL
- Flyway (SQL migrations)
- Micronaut Serialization (Serde)
- OpenAPI + Swagger UI

### Frontend
- Node.js (LTS recommended)
- Vite + React + TypeScript
- Tailwind CSS
- shadcn/ui (components)
- lucide-react (icons)

---

## Project structure (typical)

```
Inventory-service/
  src/                      # backend sources
  build.gradle              # backend build
  docker-compose.yml        # optional (db)
  frontend/
    frontend/               # Vite app (important)
      src/
      package.json
```

Important:
- The **frontend** is located in `frontend/frontend`.
- If you have another `package.json` one level higher, ignore it and always run commands from `frontend/frontend`.

---

## Prerequisites

### Required
- **Java 17+**
- **Docker** (recommended for PostgreSQL) or a local PostgreSQL instance
- **Node.js (LTS)** + npm

### Optional / recommended tools
- IntelliJ IDEA
- Postman / Insomnia (for API testing)

---

## Quick start (recommended)

### 1) Start PostgreSQL
If you use Docker, start DB from the project root:

```bash
docker compose up -d
```

If you run PostgreSQL locally, make sure you have:
- database name, user, password, host/port set according to your `application.yml` (or environment variables).

### 2) Run backend (Micronaut)
From the project root:

```bash
./gradlew run
```

Backend should start on:
- `http://localhost:8080`

Flyway migrations will run automatically on startup.

### 3) Run frontend (Vite)
Go to the Vite project directory:

```bash
cd frontend/frontend
npm install
npm run dev
```

Frontend should start on:
- `http://localhost:5173`

---

## API documentation (Swagger UI)

After starting the backend, open:
- `http://localhost:8080/swagger-ui`

OpenAPI spec (depending on configuration):
- usually `http://localhost:8080/swagger/inventory-service-*.yml` or similar

---

## Frontend ↔ Backend connection (proxy)

The frontend is expected to call backend endpoints under `/api/...`.

Recommended approach:
- Vite dev server proxies `/api` → `http://localhost:8080`

In `frontend/frontend/vite.config.ts` ensure proxy is configured:

```ts
server: {
  proxy: {
    "/api": "http://localhost:8080",
  },
},
```

This avoids CORS issues in development.

---

## Typical demo data / workflow

### Product setup
Add a few products with different `minTotal` values, for example:
- Milk 1L (minTotal: 10)
- Rice 1kg (minTotal: 20)
- Pasta 500g (minTotal: 30)

### Stock setup (receipt)
Add stock to BACKROOM/SHOPFLOOR using movement endpoints or UI features:
- Receipt 20 pcs to BACKROOM
- Transfer 8 pcs to SHOPFLOOR

### Low-stock
Set `minTotal` above the current total to force low-stock:
- If total=17 and minTotal=20 → product becomes low-stock

### Order suggestions
Open “Order suggestions” page:
- SuggestedQty = max(0, minTotal - totalQty)
Export CSV:
- downloads `order_suggestions.csv` with low-stock items

### Sales import (CSV)
Prepare CSV example:

```csv
sku,quantity
SKU-0001,2
SKU-0002,3
SKU-9999,1
```

- Unknown SKUs are skipped
- Quantities are taken from SHOPFLOOR first, then BACKROOM
- Movements are saved with type `SALE_IMPORT`

---

## Troubleshooting

### Frontend: `npm run dev` missing script
You are in the wrong directory.  
Run from:

```bash
cd frontend/frontend
npm run dev
```

### Frontend: blank page or missing imports
Check file names vs imports (case sensitive).  
Example: if you import `ComingSoonCard`, the file must be named exactly:
- `ComingSoonCard.tsx`

### Backend: JSON serialization error (Micronaut Serde)
If you see errors like:
> No serializable introspection present for type ...

Ensure DTO records returned by controllers are annotated with:
- `@io.micronaut.serde.annotation.Serdeable`

### Backend: stock table column mismatch (`id_product_id`)
If you use embedded IDs, ensure `@MappedProperty("product_id")` and correct mapping for `location`.

---

## Development notes

### Database migrations
Flyway migration scripts are located in the usual Micronaut Flyway location, e.g.:
- `src/main/resources/db/migration`

Run migrations automatically on backend startup.

### Building production artifacts
Backend:
```bash
./gradlew build
```

Frontend:
```bash
cd frontend/frontend
npm run build
```

---

## Micronaut 4.10.6 Documentation

- [User Guide](https://docs.micronaut.io/4.10.6/guide/index.html)
- [API Reference](https://docs.micronaut.io/4.10.6/api/index.html)
- [Configuration Reference](https://docs.micronaut.io/4.10.6/guide/configurationreference.html)
- [Micronaut Guides](https://guides.micronaut.io/index.html)

---

- [Shadow Gradle Plugin](https://gradleup.com/shadow/)
- [Micronaut Gradle Plugin documentation](https://micronaut-projects.github.io/micronaut-gradle-plugin/latest/)
- [GraalVM Gradle Plugin documentation](https://graalvm.github.io/native-build-tools/latest/gradle-plugin.html)

## Feature swagger-ui documentation

- [Micronaut Swagger UI documentation](https://micronaut-projects.github.io/micronaut-openapi/latest/guide/index.html)

- [https://swagger.io/tools/swagger-ui/](https://swagger.io/tools/swagger-ui/)

## Feature data-jdbc documentation

- [Micronaut Data JDBC documentation](https://micronaut-projects.github.io/micronaut-data/latest/guide/index.html#jdbc)

## Feature testcontainers documentation

- [https://www.testcontainers.org/](https://www.testcontainers.org/)

## Feature validation documentation

- [Micronaut Validation documentation](https://micronaut-projects.github.io/micronaut-validation/latest/guide/)

## Feature flyway documentation

- [Micronaut Flyway Database Migration documentation](https://micronaut-projects.github.io/micronaut-flyway/latest/guide/index.html)

- [https://flywaydb.org/](https://flywaydb.org/)

## Feature micronaut-aot documentation

- [Micronaut AOT documentation](https://micronaut-projects.github.io/micronaut-aot/latest/guide/)

## Feature jdbc-hikari documentation

- [Micronaut Hikari JDBC Connection Pool documentation](https://micronaut-projects.github.io/micronaut-sql/latest/guide/index.html#jdbc)

## Feature serialization-jackson documentation

- [Micronaut Serialization Jackson Core documentation](https://micronaut-projects.github.io/micronaut-serialization/latest/guide/)

## Feature openapi documentation

- [Micronaut OpenAPI Support documentation](https://micronaut-projects.github.io/micronaut-openapi/latest/guide/index.html)

- [https://www.openapis.org](https://www.openapis.org)
