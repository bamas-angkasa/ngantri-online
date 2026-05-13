# Repository Layer

Database repositories live here. PostgreSQL repositories should use `pgx` and
keep tenant isolation in every query.

Tenant-scoped repositories should accept a `TenantScopedQuery` or explicit
`businessID` argument and include `business_id = $n` in reads, writes, updates,
and deletes. Branch-scoped routes must resolve `branch_id -> business_id` before
running branch queries, then authorize the resolved business membership.

Do not trust client-provided IDs alone for tenant isolation. Database constraints
also enforce that queues/bookings cannot point at services, branches, or staff
from another tenant.

Expected repositories:

- UserRepository
- BusinessRepository
- BranchRepository
- StaffRepository
- ServiceRepository
- QueueRepository
- BookingRepository
- SubscriptionRepository
- ThemeRepository
- AnalyticsRepository
- NotificationLogRepository

Tenant plumbing already available:

- `middleware.RequireTenantParam`: stores `domain.Tenant` in request context for
  `/businesses/{id}` and `/businesses/{businessId}` routes.
- `middleware.TenantFromContext`: reads tenant context in handlers.
- `TenantRepository`: resolves membership and branch ownership.
- `service.TenantAccessPolicy`: centralizes super admin and business member
  access decisions.
