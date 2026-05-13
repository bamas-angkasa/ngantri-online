package service

import (
	"testing"

	"ngantri/backend/internal/domain"
)

func TestTenantAccessPolicy(t *testing.T) {
	policy := NewTenantAccessPolicy()
	ownerMembership := &domain.TenantMembership{Role: domain.BusinessRoleOwner}

	if !policy.CanManageBusiness(domain.GlobalRoleCustomer, ownerMembership) {
		t.Fatal("owner membership should manage business")
	}

	if policy.CanManageBusiness(domain.GlobalRoleCustomer, nil) {
		t.Fatal("customer without membership should not manage business")
	}

	if !policy.CanManageBusiness(domain.GlobalRoleSuperAdmin, nil) {
		t.Fatal("super admin should manage any business")
	}
}
