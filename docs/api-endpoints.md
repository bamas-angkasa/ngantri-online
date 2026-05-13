# Ngantri REST API Surface

All protected routes require JWT auth. Business-scoped routes also require tenant membership unless the user is a SaaS super admin.

## Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/google`
- `GET /api/auth/google/callback`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/me`

## Businesses

- `POST /api/businesses`
- `GET /api/businesses`
- `GET /api/businesses/:id`
- `PUT /api/businesses/:id`
- `DELETE /api/businesses/:id`

## Branches

- `POST /api/businesses/:businessId/branches`
- `GET /api/businesses/:businessId/branches`
- `PUT /api/branches/:id`
- `DELETE /api/branches/:id`

## Staff

- `POST /api/branches/:branchId/staff`
- `GET /api/branches/:branchId/staff`
- `PUT /api/staff/:id`
- `DELETE /api/staff/:id`

## Services

- `POST /api/businesses/:businessId/services`
- `GET /api/businesses/:businessId/services`
- `PUT /api/services/:id`
- `DELETE /api/services/:id`

## Public

- `GET /api/public/:businessSlug`
- `GET /api/public/:businessSlug/:branchSlug`
- `GET /api/public/:businessSlug/:branchSlug/live-queue`

## Queues

- `POST /api/branches/:branchId/queues`
- `GET /api/branches/:branchId/queues`
- `GET /api/queues/:id`
- `PUT /api/queues/:id/status`
- `POST /api/branches/:branchId/queues/call-next`

## Bookings

- `POST /api/branches/:branchId/bookings`
- `GET /api/branches/:branchId/bookings`
- `PUT /api/bookings/:id/status`
- `POST /api/bookings/:id/check-in`

## Themes

- `GET /api/businesses/:businessId/theme`
- `PUT /api/businesses/:businessId/theme`

## QR

- `GET /api/branches/:branchId/qr`

## Analytics

- `GET /api/businesses/:businessId/analytics/overview`
- `GET /api/branches/:branchId/analytics/overview`

## Super Admin

- `GET /api/admin/businesses`
- `GET /api/admin/users`
- `PUT /api/admin/businesses/:id/subscription`
- `PUT /api/admin/businesses/:id/status`
