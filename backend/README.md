# Ngantri Backend

Go REST API scaffold for the Ngantri MVP. The backend exposes a REST API,
stores data in PostgreSQL, and includes schema + demo seed migrations for local
development.

## Prerequisites

- Go 1.26 or newer
- PostgreSQL 14 or newer
- `psql` CLI available in your terminal path

## Environment

The API reads configuration from environment variables. From the repo root, copy
the example file first:

```powershell
Copy-Item .env.example .env
```

Important backend variables:

```env
HTTP_ADDR=:8080
DATABASE_URL=postgres://postgres:postgres@localhost:5432/ngantri?sslmode=disable
JWT_SECRET=change-me
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:8080/api/auth/google/callback
PUBLIC_WEB_BASE_URL=http://localhost:3000
PUBLIC_API_BASE_URL=http://localhost:8080
APP_ENV=development
```

Go does not automatically load `.env` files. Either export the values in your
terminal, or set at least `DATABASE_URL` before running database commands:

```powershell
$env:DATABASE_URL="postgres://postgres:postgres@localhost:5432/ngantri?sslmode=disable"
```

If you keep the default values from `.env.example`, the API can also run without
manually setting variables because the code has development fallbacks.

## Install

From the backend directory:

```powershell
cd backend
go mod download
```

Or from the repo root:

```powershell
go -C backend mod download
```

## Database Setup

Create the local PostgreSQL database:

```powershell
createdb ngantri
```

If your PostgreSQL user or password is different from the default, update
`DATABASE_URL` in `.env` and in your current shell.

## Run Migrations and Seed Data

Run the schema migration first:

```powershell
psql $env:DATABASE_URL -f migrations/000001_init.sql
```

Then run the demo seed:

```powershell
psql $env:DATABASE_URL -f migrations/000002_seed_demo.sql
```

Migration order:

1. `migrations/000001_init.sql`
2. `migrations/000002_seed_demo.sql`

The seed creates:

- Demo owner: `owner@barberadi.test`
- Demo customer: `rina@customer.test`
- Business: `Barber Adi` with slug `barber-adi`
- Branches: `sawojajar` and `sulfat`
- Capsters: Adi, Raka, and Bima
- Services: Potong Rambut, Cukur Jenggot, Hair Wash, and Coloring
- Theme: `Masculine`
- Subscription: Free plan

The seed is safe to rerun because inserts use conflict handling.

## Run

From the backend directory:

```powershell
go run ./cmd/api
```

Or from the repo root:

```powershell
npm run api:dev
```

The API listens on `http://localhost:8080` by default.

Health check:

```powershell
curl http://localhost:8080/healthz
```

Expected response:

```json
{"environment":"development","status":"ok"}
```

Most API routes are currently scaffolded and return `501 Not Implemented` until
their handlers are implemented.

## Test

From the backend directory:

```powershell
go test ./...
```

Or from the repo root:

```powershell
npm run api:test
```

## Structure

- `cmd/api`: API entry point
- `internal/config`: environment configuration
- `internal/domain`: core entities, enums, and errors
- `internal/service`: business rules such as queue estimation and subscription limits
- `internal/repository`: PostgreSQL repository layer placeholder
- `internal/delivery/http`: REST router
- `internal/middleware`: auth and RBAC middleware hooks
- `internal/pkg/auth`: password hashing and future JWT helpers
- `internal/pkg/database`: PostgreSQL connection helper
- `internal/pkg/notification`: notification provider abstraction
- `migrations`: PostgreSQL schema and seed data
- `openapi.yaml`: API documentation starter
