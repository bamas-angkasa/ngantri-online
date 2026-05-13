# Ngantri Backend

Go REST API scaffold for the Ngantri MVP. The backend exposes a REST API,
stores data in PostgreSQL, and includes Goose schema migrations plus optional
demo seed data for local development.

## Prerequisites

- Go 1.26 or newer
- PostgreSQL 14 or newer

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

Backend commands automatically load `.env` files when run from the `backend`
directory. Use `backend/.env` for backend-only local values, or keep shared
values in the repo-root `.env`. Shell environment variables still take
precedence over file values.

For local database commands, make sure `DATABASE_URL` matches your PostgreSQL
user, password, host, port, and database:

```powershell
$env:DATABASE_URL="postgres://postgres:postgres@localhost:5432/ngantri?sslmode=disable"
```

The default `postgres:postgres` value is only a development fallback. If your
local PostgreSQL password is different, update `DATABASE_URL` in `backend/.env`
or your shell before running migrations.

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

## Run Migrations

Migrations use Goose and are run through the backend migration command.

```powershell
New-Item -ItemType Directory -Force .bin
go build -o ./.bin/migrate.exe ./cmd/migrate
./.bin/migrate.exe up
```

Or from the repo root:

```powershell
npm run api:migrate
```

Check migration status:

```powershell
./.bin/migrate.exe status
```

Rollback the latest migration:

```powershell
./.bin/migrate.exe down
```

Current migrations:

1. `migrations/000001_init.sql`

## Run Demo Seed Data

Seed data is separate from migrations, so `migrate up` never inserts demo data.
Run the demo seed only when you want local sample data:

```powershell
New-Item -ItemType Directory -Force .bin
go build -o ./.bin/seed.exe ./cmd/seed
./.bin/seed.exe
```

Or from the repo root:

```powershell
npm run api:seed
```

The default seed file is `seeds/demo.sql`. You can pass another SQL file path:

```powershell
./.bin/seed.exe seeds/demo.sql
```

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
- `internal/service`: business rules such as queue estimation, subscription limits, and tenant access
- `internal/repository`: PostgreSQL repository contracts and tenant-scoped query guidance
- `internal/delivery/http`: REST router
- `internal/middleware`: auth, RBAC, and tenant context middleware hooks
- `internal/pkg/auth`: password hashing and future JWT helpers
- `internal/pkg/database`: PostgreSQL connection helper
- `internal/pkg/notification`: notification provider abstraction
- `migrations`: Goose PostgreSQL schema migrations
- `seeds`: optional local/demo seed SQL files
- `openapi.yaml`: API documentation starter

## Multi-Tenant Backend Plan

The tenant boundary is `businesses.id`. Every tenant-owned table stores
`business_id` directly, except branch staff where branch ownership is enforced
through the branch relationship.

Current foundation:

- Business routes with `{id}` or `{businessId}` populate `domain.Tenant` in the
  request context.
- `TenantAccessPolicy` centralizes super admin and owner/admin decisions.
- Repository contracts define membership lookup and branch-to-business
  resolution.
- SQL constraints prevent queues/bookings from mixing branches, services, or
  staff across tenants.

Recommended implementation order:

1. Auth: real JWT validation, refresh tokens, password login, Google OAuth.
2. Tenant gate: handler middleware that loads membership via `TenantRepository`
   and applies `TenantAccessPolicy`.
3. Repositories: implement business, branch, service, queue, booking, and
   subscription repositories with mandatory `business_id` filters.
4. Public reads: resolve `{businessSlug}/{branchSlug}` to tenant/branch IDs and
   return only active public data.
5. Queue writes: create queue in a transaction that checks subscription usage,
   inserts the queue item, increments `usage_counters`, and logs notification.
6. Admin: isolate super-admin routes from business owner routes.
