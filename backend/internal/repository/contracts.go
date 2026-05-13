package repository

import (
	"context"

	"ngantri/backend/internal/domain"
)

type TenantRepository interface {
	FindMembership(ctx context.Context, businessID string, userID string) (*domain.TenantMembership, error)
	ResolveBusinessIDByBranch(ctx context.Context, branchID string) (string, error)
}

type TenantScopedQuery struct {
	BusinessID string
}

func NewTenantScopedQuery(tenant domain.Tenant) TenantScopedQuery {
	return TenantScopedQuery{BusinessID: tenant.BusinessID}
}
