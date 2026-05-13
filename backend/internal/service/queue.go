package service

import "ngantri/backend/internal/domain"

type QueueEstimator struct{}

func NewQueueEstimator() QueueEstimator {
	return QueueEstimator{}
}

func (QueueEstimator) EstimateWaitMinutes(waitingBeforeCustomer int, serviceDurationMinutes int) int {
	if waitingBeforeCustomer < 0 {
		waitingBeforeCustomer = 0
	}
	if serviceDurationMinutes <= 0 {
		serviceDurationMinutes = 20
	}
	return waitingBeforeCustomer * serviceDurationMinutes
}

func CanTransitionQueueStatus(from domain.QueueStatus, to domain.QueueStatus) bool {
	allowed := map[domain.QueueStatus][]domain.QueueStatus{
		domain.QueueWaiting:   {domain.QueueCalled, domain.QueueCancelled, domain.QueueSkipped, domain.QueueNoShow},
		domain.QueueCalled:    {domain.QueueServing, domain.QueueSkipped, domain.QueueCancelled, domain.QueueNoShow},
		domain.QueueServing:   {domain.QueueCompleted, domain.QueueSkipped, domain.QueueCancelled},
		domain.QueueCompleted: {},
		domain.QueueSkipped:   {},
		domain.QueueCancelled: {},
		domain.QueueNoShow:    {},
	}

	for _, candidate := range allowed[from] {
		if candidate == to {
			return true
		}
	}
	return false
}
