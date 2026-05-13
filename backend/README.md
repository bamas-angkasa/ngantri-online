# Ngantri Backend

Go REST API scaffold for the Ngantri MVP.

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

## Run

```bash
go run ./cmd/api
```

Health check:

```bash
curl http://localhost:8080/healthz
```

## Test

```bash
go test ./...
```

## Migration Order

1. `migrations/000001_init.sql`
2. `migrations/000002_seed_demo.sql`

The seed creates the Barber Adi demo tenant, branches, capsters, services, theme, and Free subscription.
