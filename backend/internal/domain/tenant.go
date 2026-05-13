package domain

import "time"

type Tenant struct {
	BusinessID string
}

type TenantMembership struct {
	BusinessID string
	UserID     string
	Role       BusinessRole
	CreatedAt  time.Time
}

func (role BusinessRole) CanManageTenant() bool {
	return role == BusinessRoleOwner || role == BusinessRoleAdmin
}
