package domain

import "time"

type GlobalRole string
type BusinessRole string
type SubscriptionPlan string
type SubscriptionStatus string
type QueueSource string
type QueueStatus string
type BookingStatus string
type NotificationEvent string

const (
	GlobalRoleCustomer   GlobalRole = "customer"
	GlobalRoleSuperAdmin GlobalRole = "super_admin"

	BusinessRoleOwner BusinessRole = "owner"
	BusinessRoleAdmin BusinessRole = "admin"

	PlanFree     SubscriptionPlan = "free"
	PlanPro      SubscriptionPlan = "pro"
	PlanBusiness SubscriptionPlan = "business"

	SubscriptionActive    SubscriptionStatus = "active"
	SubscriptionPastDue   SubscriptionStatus = "past_due"
	SubscriptionCancelled SubscriptionStatus = "cancelled"

	QueueSourceWalkIn QueueSource = "walk_in"
	QueueSourceOnline QueueSource = "online"

	QueueWaiting   QueueStatus = "waiting"
	QueueCalled    QueueStatus = "called"
	QueueServing   QueueStatus = "serving"
	QueueCompleted QueueStatus = "completed"
	QueueSkipped   QueueStatus = "skipped"
	QueueCancelled QueueStatus = "cancelled"
	QueueNoShow    QueueStatus = "no_show"

	BookingPending   BookingStatus = "pending"
	BookingConfirmed BookingStatus = "confirmed"
	BookingCheckedIn BookingStatus = "checked_in"
	BookingServing   BookingStatus = "serving"
	BookingCompleted BookingStatus = "completed"
	BookingCancelled BookingStatus = "cancelled"
	BookingNoShow    BookingStatus = "no_show"

	NotificationQueueCreated     NotificationEvent = "queue_created"
	NotificationQueueAlmostReady NotificationEvent = "queue_almost_ready"
	NotificationQueueCalled      NotificationEvent = "queue_called"
	NotificationBookingConfirmed NotificationEvent = "booking_confirmed"
	NotificationBookingCancelled NotificationEvent = "booking_cancelled"
)

type User struct {
	ID           string
	Name         string
	Email        string
	PasswordHash *string
	GoogleID     *string
	AvatarURL    *string
	RoleGlobal   GlobalRole
	CreatedAt    time.Time
	UpdatedAt    time.Time
}

type Business struct {
	ID                 string
	OwnerID            string
	Name               string
	Slug               string
	LogoURL            *string
	Description        *string
	SubscriptionPlan   SubscriptionPlan
	SubscriptionStatus SubscriptionStatus
	CreatedAt          time.Time
	UpdatedAt          time.Time
}

type Branch struct {
	ID            string
	BusinessID    string
	Name          string
	Slug          string
	Address       *string
	Phone         *string
	Timezone      string
	OpenHoursJSON []byte
	IsActive      bool
	CreatedAt     time.Time
}

type BranchStaff struct {
	ID          string
	BranchID    string
	UserID      *string
	Name        string
	RoleLabel   string
	AvatarURL   *string
	IsAvailable bool
	CreatedAt   time.Time
}

type Service struct {
	ID              string
	BusinessID      string
	BranchID        *string
	Name            string
	Description     *string
	DurationMinutes int
	Price           *int64
	IsActive        bool
	CreatedAt       time.Time
}

type QueueItem struct {
	ID                   string
	BusinessID           string
	BranchID             string
	CustomerID           string
	ServiceID            string
	StaffID              *string
	QueueNumber          string
	Source               QueueSource
	Status               QueueStatus
	EstimatedWaitMinutes int
	CalledAt             *time.Time
	StartedAt            *time.Time
	CompletedAt          *time.Time
	CancelledAt          *time.Time
	CreatedAt            time.Time
}

type Booking struct {
	ID          string
	BusinessID  string
	BranchID    string
	CustomerID  string
	ServiceID   string
	StaffID     *string
	BookingCode string
	BookingDate time.Time
	StartTime   time.Time
	EndTime     time.Time
	Status      BookingStatus
	Notes       *string
	CreatedAt   time.Time
}

type Subscription struct {
	ID                 string
	BusinessID         string
	Plan               SubscriptionPlan
	MonthlyQueueLimit  int
	BranchLimit        int
	CurrentPeriodStart time.Time
	CurrentPeriodEnd   time.Time
	Status             SubscriptionStatus
}
