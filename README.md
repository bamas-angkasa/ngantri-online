# Ngantri Online

Ngantri is a queue management and online reservation SaaS for Indonesian UMKM service businesses.

Tagline: **Datang pas giliranmu.**

## What Is Prepared

- Polished Next.js landing page for Ngantri
- Frontend MVP route skeleton:
  - public business pages
  - auth pages
  - customer pages
  - business dashboard pages
  - SaaS admin pages
- TanStack Query provider and demo query layer
- React Hook Form and Zod auth validation foundation
- Indonesian and English message dictionaries
- Go REST API skeleton using layered architecture
- PostgreSQL migrations and Barber Adi seed data
- Subscription and queue domain policies
- Notification provider abstraction
- OpenAPI starter

## Tech Stack

- Frontend: Next.js App Router, TypeScript, Tailwind CSS, shadcn-style UI primitives, lucide-react, Framer Motion, TanStack Query, React Hook Form, Zod
- Backend: Go, PostgreSQL, REST API first
- Architecture: multi-tenant SaaS, RBAC-ready, clean/layered backend

## Local Development

Install frontend dependencies:

```bash
npm run frontend:install
```

Run frontend:

```bash
npm run dev
```

Run backend:

```bash
npm run api:dev
```

Frontend runs on `http://localhost:3000`.
Backend runs on `http://localhost:8080`.

## Verification

```bash
npm run lint
npm run typecheck
npm run build
npm run api:test
```

## Environment

The repo is organized as:

- `frontend/` for the Next.js app
- `backend/` for the Go API
- `docs/` for planning and API notes

Copy `frontend/.env.example` to `frontend/.env.local` for frontend values.
Copy `.env.example` to `.env` for backend shell usage.

Key variables:

- `NEXT_PUBLIC_API_BASE_URL`
- `DATABASE_URL`
- `JWT_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

## MVP Implementation Order

1. Auth, JWT, Google OAuth, RBAC middleware
2. Business, branch, staff, and service CRUD
3. Queue creation, status flow, and call-next transaction logic
4. Public branch page connected to API
5. Booking and booking check-in flow
6. QR generation
7. Theme/template and subscription limit enforcement
8. Analytics and super admin implementation
9. Mock notification logs

See `docs/mvp-roadmap.md` and `docs/api-endpoints.md` for the detailed plan.
