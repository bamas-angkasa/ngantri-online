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
- `internal/service`: business rules such as queue estimation, subscription limits, and tenant access
- `internal/repository`: PostgreSQL repository contracts and tenant-scoped query guidance
- `internal/delivery/http`: REST router
- `internal/middleware`: auth, RBAC, and tenant context middleware hooks
- `internal/pkg/auth`: password hashing and future JWT helpers
- `internal/pkg/database`: PostgreSQL connection helper
- `internal/pkg/notification`: notification provider abstraction
- `migrations`: PostgreSQL schema and seed data
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
