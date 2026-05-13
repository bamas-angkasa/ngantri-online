package service

import "ngantri/backend/internal/domain"

type TenantAccessPolicy struct{}

func NewTenantAccessPolicy() TenantAccessPolicy {
	return TenantAccessPolicy{}
}

func (TenantAccessPolicy) CanReadBusiness(principalGlobalRole domain.GlobalRole, membership *domain.TenantMembership) bool {
	if principalGlobalRole == domain.GlobalRoleSuperAdmin {
		return true
	}
	return membership != nil
}

func (TenantAccessPolicy) CanManageBusiness(principalGlobalRole domain.GlobalRole, membership *domain.TenantMembership) bool {
	if principalGlobalRole == domain.GlobalRoleSuperAdmin {
		return true
	}
	if membership == nil {
		return false
	}
	return membership.Role.CanManageTenant()
}
