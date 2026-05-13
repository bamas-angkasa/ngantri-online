package service

import "ngantri/backend/internal/domain"

type SubscriptionPolicy struct{}

func NewSubscriptionPolicy() SubscriptionPolicy {
	return SubscriptionPolicy{}
}

func (SubscriptionPolicy) CanCreateBranch(plan domain.SubscriptionPlan, currentActiveBranches int) bool {
	if plan == domain.PlanFree {
		return currentActiveBranches < 1
	}
	return true
}

func (SubscriptionPolicy) CanCreateQueue(plan domain.SubscriptionPlan, monthlyQueueCount int) bool {
	if plan == domain.PlanFree {
		return monthlyQueueCount < 10
	}
	return true
}

func (SubscriptionPolicy) QueueLimit(plan domain.SubscriptionPlan) int {
	switch plan {
	case domain.PlanFree:
		return 10
	case domain.PlanPro:
		return 1000
	case domain.PlanBusiness:
		return 10000
	default:
		return 0
	}
}
