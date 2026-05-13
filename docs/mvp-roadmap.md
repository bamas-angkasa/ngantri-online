# Ngantri MVP Roadmap

Ngantri is a multi-tenant queue management and online reservation SaaS for Indonesian UMKM service businesses. The first niche is barbershop, while the architecture remains flexible for clinics, bengkel, salons, dental clinics, and other appointment or queue-heavy services.

## Product Promise

**Datang pas giliranmu.**

The product should make waiting feel clear, realtime, and low-stress for customers while giving owners and staff an operational dashboard that is understandable in under three seconds.

## Phases

### Phase 1: Foundation

- Next.js App Router frontend shell
- Go REST API skeleton
- PostgreSQL schema and migrations
- Manual auth plus Google OAuth entry points
- JWT access token and refresh token structure
- Multi-tenant business, branch, and member model
- RBAC middleware

### Phase 2: Queue Core

- Services and staff management
- Walk-in queue creation
- Online queue creation from public page
- Queue status flow: waiting, called, serving, completed, skipped, cancelled, no_show
- Staff lane board for parallel capsters
- Simple wait estimation:
  `waiting_items_before_customer_for_same_staff_or_branch * service_duration_minutes`

### Phase 3: Booking

- Online booking flow
- Booking check-in into queue
- Customer queue and booking history
- QR code branch page support

### Phase 4: Monetization and Admin

- Free, Pro, and Business plans
- Free limit enforcement: 1 branch and 10 queues/month
- Theme/template gates
- Analytics MVP
- SaaS super admin dashboard

### Phase 5: Notifications and Polish

- NotificationService abstraction
- Mock notification provider and logs
- Future WhatsApp and email provider interface
- UI polish and test coverage

## Roles

- **Owner:** manages business, branches, staff, services, queue settings, themes, analytics, and subscription.
- **Admin/Staff:** manages queue, bookings, walk-ins, and assigned branch operations.
- **Customer:** books, joins queue, checks queue status, and views history.
- **Super Admin:** manages tenants, users, subscriptions, templates, usage limits, and system settings.

## Tenant Isolation Rules

- Every protected endpoint must resolve the authenticated user and tenant membership before touching business data.
- Business-scoped queries must filter by `business_id`.
- Branch-scoped queries must join or validate branch ownership under `business_id`.
- Super admin routes must require `role_global = super_admin`.
- Queue creation and queue status changes must run in database transactions.

## MVP Subscription Rules

- Free:
  - 1 active branch
  - 10 queues per month
  - 2 templates: Masculine and Feminine
  - Logo customization allowed
- Pro:
  - Multiple branches
  - Custom colors
  - More templates
  - Analytics
  - Higher queue quota
- Business:
  - Advanced analytics
  - Multi-admin
  - Priority support
  - Future WhatsApp integration

## Demo Seed

- Business: Barber Adi
- Branches: Barber Adi Sawojajar, Barber Adi Sulfat
- Staff: Adi, Raka, Bima
- Services: Potong Rambut, Cukur Jenggot, Hair Wash, Coloring
- Templates: Masculine, Feminine
