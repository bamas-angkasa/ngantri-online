package domain

import "errors"

var (
	ErrUnauthorized           = errors.New("unauthorized")
	ErrForbidden              = errors.New("forbidden")
	ErrNotFound               = errors.New("not found")
	ErrSubscriptionLimit      = errors.New("subscription limit reached")
	ErrInvalidQueueTransition = errors.New("invalid queue status transition")
)
