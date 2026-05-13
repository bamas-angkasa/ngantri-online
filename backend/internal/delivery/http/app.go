package http

import (
	"context"
	"encoding/json"
	"fmt"
	"math"
	"net/http"
	"regexp"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"ngantri/backend/internal/config"
	"ngantri/backend/internal/domain"
	"ngantri/backend/internal/service"
)

type AppHandler struct {
	cfg config.Config
	db  *pgxpool.Pool
}

type businessResponse struct {
	ID                 string                    `json:"id"`
	OwnerID            string                    `json:"ownerId"`
	Name               string                    `json:"name"`
	Slug               string                    `json:"slug"`
	LogoURL            *string                   `json:"logoUrl,omitempty"`
	Description        *string                   `json:"description,omitempty"`
	SubscriptionPlan   domain.SubscriptionPlan   `json:"subscriptionPlan"`
	SubscriptionStatus domain.SubscriptionStatus `json:"subscriptionStatus"`
}

type branchResponse struct {
	ID         string  `json:"id"`
	BusinessID string  `json:"businessId"`
	Name       string  `json:"name"`
	Slug       string  `json:"slug"`
	Address    *string `json:"address,omitempty"`
	Phone      *string `json:"phone,omitempty"`
	Timezone   string  `json:"timezone"`
	IsActive   bool    `json:"isActive"`
}

type staffResponse struct {
	ID          string  `json:"id"`
	BranchID    string  `json:"branchId"`
	UserID      *string `json:"userId,omitempty"`
	Name        string  `json:"name"`
	RoleLabel   string  `json:"roleLabel"`
	AvatarURL   *string `json:"avatarUrl,omitempty"`
	IsAvailable bool    `json:"isAvailable"`
}

type serviceResponse struct {
	ID              string  `json:"id"`
	BusinessID      string  `json:"businessId"`
	BranchID        *string `json:"branchId,omitempty"`
	Name            string  `json:"name"`
	Description     *string `json:"description,omitempty"`
	DurationMinutes int     `json:"durationMinutes"`
	Price           *int64  `json:"price,omitempty"`
	IsActive        bool    `json:"isActive"`
}

type queueResponse struct {
	ID                   string             `json:"id"`
	BusinessID           string             `json:"businessId"`
	BranchID             string             `json:"branchId"`
	CustomerID           string             `json:"customerId"`
	ServiceID            string             `json:"serviceId"`
	StaffID              *string            `json:"staffId,omitempty"`
	QueueNumber          string             `json:"queueNumber"`
	Source               domain.QueueSource `json:"source"`
	Status               domain.QueueStatus `json:"status"`
	EstimatedWaitMinutes int                `json:"estimatedWaitMinutes"`
	CreatedAt            time.Time          `json:"createdAt"`
}

type bookingResponse struct {
	ID          string               `json:"id"`
	BusinessID  string               `json:"businessId"`
	BranchID    string               `json:"branchId"`
	CustomerID  string               `json:"customerId"`
	ServiceID   string               `json:"serviceId"`
	StaffID     *string              `json:"staffId,omitempty"`
	BookingCode string               `json:"bookingCode"`
	BookingDate time.Time            `json:"bookingDate"`
	StartTime   time.Time            `json:"startTime"`
	EndTime     time.Time            `json:"endTime"`
	Status      domain.BookingStatus `json:"status"`
	Notes       *string              `json:"notes,omitempty"`
}

type analyticsResponse struct {
	TotalQueuesToday   int    `json:"totalQueuesToday"`
	CurrentlyWaiting   int    `json:"currentlyWaiting"`
	CurrentlyServing   int    `json:"currentlyServing"`
	CompletedToday     int    `json:"completedToday"`
	NoShowToday        int    `json:"noShowToday"`
	AverageWaitMinutes int    `json:"averageWaitMinutes"`
	BusiestHour        string `json:"busiestHour"`
	TopService         string `json:"topService"`
}

type publicBusinessResponse struct {
	Business  businessResponse  `json:"business"`
	Branches  []branchResponse  `json:"branches"`
	Staff     []staffResponse   `json:"staff"`
	Services  []serviceResponse `json:"services"`
	Queues    []queueResponse   `json:"queues"`
	Analytics analyticsResponse `json:"analytics"`
}

func NewAppHandler(cfg config.Config, db *pgxpool.Pool) AppHandler {
	return AppHandler{cfg: cfg, db: db}
}

func (handler AppHandler) ListBusinesses(w http.ResponseWriter, r *http.Request) {
	rows, err := handler.db.Query(r.Context(), `
		SELECT id, owner_id, name, slug, logo_url, description, subscription_plan, subscription_status
		FROM businesses
		ORDER BY created_at DESC
	`)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "database_error", "Gagal mengambil bisnis.")
		return
	}
	defer rows.Close()

	businesses, err := scanBusinesses(rows)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "database_error", "Gagal membaca bisnis.")
		return
	}
	respondData(w, http.StatusOK, businesses)
}

func (handler AppHandler) CreateBusiness(w http.ResponseWriter, r *http.Request) {
	var request struct {
		OwnerID     string  `json:"ownerId"`
		Name        string  `json:"name"`
		Slug        string  `json:"slug"`
		Description *string `json:"description"`
	}
	if !decodeJSON(w, r, &request) {
		return
	}
	name := strings.TrimSpace(request.Name)
	slug := strings.TrimSpace(request.Slug)
	if slug == "" {
		slug = slugify(name)
	}
	if request.OwnerID == "" || name == "" || slug == "" {
		respondError(w, http.StatusBadRequest, "invalid_request", "Owner, nama bisnis, dan slug wajib diisi.")
		return
	}

	var business businessResponse
	err := handler.db.QueryRow(r.Context(), `
		INSERT INTO businesses (owner_id, name, slug, description)
		VALUES ($1, $2, $3, $4)
		RETURNING id, owner_id, name, slug, logo_url, description, subscription_plan, subscription_status
	`, request.OwnerID, name, slug, request.Description).Scan(
		&business.ID, &business.OwnerID, &business.Name, &business.Slug, &business.LogoURL, &business.Description, &business.SubscriptionPlan, &business.SubscriptionStatus,
	)
	if err != nil {
		respondError(w, http.StatusConflict, "business_create_failed", "Gagal membuat bisnis.")
		return
	}
	respondData(w, http.StatusCreated, business)
}

func (handler AppHandler) GetBusiness(w http.ResponseWriter, r *http.Request) {
	business, err := handler.findBusiness(r.Context(), chi.URLParam(r, "id"))
	if err != nil {
		respondError(w, http.StatusNotFound, "not_found", "Bisnis tidak ditemukan.")
		return
	}
	respondData(w, http.StatusOK, business)
}

func (handler AppHandler) UpdateBusiness(w http.ResponseWriter, r *http.Request) {
	var request struct {
		Name        string  `json:"name"`
		Slug        string  `json:"slug"`
		LogoURL     *string `json:"logoUrl"`
		Description *string `json:"description"`
	}
	if !decodeJSON(w, r, &request) {
		return
	}
	id := chi.URLParam(r, "id")
	if strings.TrimSpace(request.Name) == "" {
		respondError(w, http.StatusBadRequest, "invalid_request", "Nama bisnis wajib diisi.")
		return
	}
	slug := request.Slug
	if slug == "" {
		slug = slugify(request.Name)
	}

	var business businessResponse
	err := handler.db.QueryRow(r.Context(), `
		UPDATE businesses
		SET name = $2, slug = $3, logo_url = $4, description = $5, updated_at = now()
		WHERE id = $1
		RETURNING id, owner_id, name, slug, logo_url, description, subscription_plan, subscription_status
	`, id, strings.TrimSpace(request.Name), slug, request.LogoURL, request.Description).Scan(
		&business.ID, &business.OwnerID, &business.Name, &business.Slug, &business.LogoURL, &business.Description, &business.SubscriptionPlan, &business.SubscriptionStatus,
	)
	if err != nil {
		respondError(w, http.StatusNotFound, "not_found", "Bisnis tidak ditemukan.")
		return
	}
	respondData(w, http.StatusOK, business)
}

func (handler AppHandler) DeleteBusiness(w http.ResponseWriter, r *http.Request) {
	respondDelete(w, r, handler.db, "DELETE FROM businesses WHERE id = $1", chi.URLParam(r, "id"))
}

func (handler AppHandler) ListBranches(w http.ResponseWriter, r *http.Request) {
	businessID := chi.URLParam(r, "businessId")
	branches, err := handler.listBranches(r.Context(), businessID)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "database_error", "Gagal mengambil cabang.")
		return
	}
	respondData(w, http.StatusOK, branches)
}

func (handler AppHandler) CreateBranch(w http.ResponseWriter, r *http.Request) {
	var request struct {
		Name     string  `json:"name"`
		Slug     string  `json:"slug"`
		Address  *string `json:"address"`
		Phone    *string `json:"phone"`
		Timezone string  `json:"timezone"`
	}
	if !decodeJSON(w, r, &request) {
		return
	}
	businessID := chi.URLParam(r, "businessId")
	name := strings.TrimSpace(request.Name)
	slug := strings.TrimSpace(request.Slug)
	if slug == "" {
		slug = slugify(name)
	}
	if request.Timezone == "" {
		request.Timezone = "Asia/Jakarta"
	}
	if name == "" || slug == "" {
		respondError(w, http.StatusBadRequest, "invalid_request", "Nama cabang wajib diisi.")
		return
	}

	if ok, err := handler.canCreateBranch(r.Context(), businessID); err != nil || !ok {
		respondError(w, http.StatusForbidden, "subscription_limit", "Paket Free hanya mendukung 1 cabang aktif.")
		return
	}

	var branch branchResponse
	err := handler.db.QueryRow(r.Context(), `
		INSERT INTO branches (business_id, name, slug, address, phone, timezone)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, business_id, name, slug, address, phone, timezone, is_active
	`, businessID, name, slug, request.Address, request.Phone, request.Timezone).Scan(
		&branch.ID, &branch.BusinessID, &branch.Name, &branch.Slug, &branch.Address, &branch.Phone, &branch.Timezone, &branch.IsActive,
	)
	if err != nil {
		respondError(w, http.StatusConflict, "branch_create_failed", "Gagal membuat cabang.")
		return
	}
	respondData(w, http.StatusCreated, branch)
}

func (handler AppHandler) UpdateBranch(w http.ResponseWriter, r *http.Request) {
	var request struct {
		Name     string  `json:"name"`
		Slug     string  `json:"slug"`
		Address  *string `json:"address"`
		Phone    *string `json:"phone"`
		Timezone string  `json:"timezone"`
		IsActive bool    `json:"isActive"`
	}
	if !decodeJSON(w, r, &request) {
		return
	}
	id := chi.URLParam(r, "id")
	name := strings.TrimSpace(request.Name)
	if request.Timezone == "" {
		request.Timezone = "Asia/Jakarta"
	}
	slug := strings.TrimSpace(request.Slug)
	if slug == "" {
		slug = slugify(name)
	}
	var branch branchResponse
	err := handler.db.QueryRow(r.Context(), `
		UPDATE branches
		SET name = $2, slug = $3, address = $4, phone = $5, timezone = $6, is_active = $7
		WHERE id = $1
		RETURNING id, business_id, name, slug, address, phone, timezone, is_active
	`, id, name, slug, request.Address, request.Phone, request.Timezone, request.IsActive).Scan(
		&branch.ID, &branch.BusinessID, &branch.Name, &branch.Slug, &branch.Address, &branch.Phone, &branch.Timezone, &branch.IsActive,
	)
	if err != nil {
		respondError(w, http.StatusNotFound, "not_found", "Cabang tidak ditemukan.")
		return
	}
	respondData(w, http.StatusOK, branch)
}

func (handler AppHandler) DeleteBranch(w http.ResponseWriter, r *http.Request) {
	respondDelete(w, r, handler.db, "DELETE FROM branches WHERE id = $1", chi.URLParam(r, "id"))
}

func (handler AppHandler) ListStaff(w http.ResponseWriter, r *http.Request) {
	staff, err := handler.listStaff(r.Context(), chi.URLParam(r, "branchId"))
	if err != nil {
		respondError(w, http.StatusInternalServerError, "database_error", "Gagal mengambil staff.")
		return
	}
	respondData(w, http.StatusOK, staff)
}

func (handler AppHandler) CreateStaff(w http.ResponseWriter, r *http.Request) {
	var request struct {
		Name        string  `json:"name"`
		RoleLabel   string  `json:"roleLabel"`
		AvatarURL   *string `json:"avatarUrl"`
		IsAvailable *bool   `json:"isAvailable"`
	}
	if !decodeJSON(w, r, &request) {
		return
	}
	available := true
	if request.IsAvailable != nil {
		available = *request.IsAvailable
	}
	if request.RoleLabel == "" {
		request.RoleLabel = "Staff"
	}
	var staff staffResponse
	err := handler.db.QueryRow(r.Context(), `
		INSERT INTO branch_staff (branch_id, name, role_label, avatar_url, is_available)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, branch_id, user_id, name, role_label, avatar_url, is_available
	`, chi.URLParam(r, "branchId"), strings.TrimSpace(request.Name), request.RoleLabel, request.AvatarURL, available).Scan(
		&staff.ID, &staff.BranchID, &staff.UserID, &staff.Name, &staff.RoleLabel, &staff.AvatarURL, &staff.IsAvailable,
	)
	if err != nil {
		respondError(w, http.StatusBadRequest, "staff_create_failed", "Gagal membuat staff.")
		return
	}
	respondData(w, http.StatusCreated, staff)
}

func (handler AppHandler) UpdateStaff(w http.ResponseWriter, r *http.Request) {
	var request struct {
		Name        string  `json:"name"`
		RoleLabel   string  `json:"roleLabel"`
		AvatarURL   *string `json:"avatarUrl"`
		IsAvailable bool    `json:"isAvailable"`
	}
	if !decodeJSON(w, r, &request) {
		return
	}
	var staff staffResponse
	err := handler.db.QueryRow(r.Context(), `
		UPDATE branch_staff
		SET name = $2, role_label = $3, avatar_url = $4, is_available = $5
		WHERE id = $1
		RETURNING id, branch_id, user_id, name, role_label, avatar_url, is_available
	`, chi.URLParam(r, "id"), request.Name, request.RoleLabel, request.AvatarURL, request.IsAvailable).Scan(
		&staff.ID, &staff.BranchID, &staff.UserID, &staff.Name, &staff.RoleLabel, &staff.AvatarURL, &staff.IsAvailable,
	)
	if err != nil {
		respondError(w, http.StatusNotFound, "not_found", "Staff tidak ditemukan.")
		return
	}
	respondData(w, http.StatusOK, staff)
}

func (handler AppHandler) DeleteStaff(w http.ResponseWriter, r *http.Request) {
	respondDelete(w, r, handler.db, "DELETE FROM branch_staff WHERE id = $1", chi.URLParam(r, "id"))
}

func (handler AppHandler) ListServices(w http.ResponseWriter, r *http.Request) {
	services, err := handler.listServices(r.Context(), chi.URLParam(r, "businessId"))
	if err != nil {
		respondError(w, http.StatusInternalServerError, "database_error", "Gagal mengambil layanan.")
		return
	}
	respondData(w, http.StatusOK, services)
}

func (handler AppHandler) CreateService(w http.ResponseWriter, r *http.Request) {
	var request struct {
		BranchID        *string `json:"branchId"`
		Name            string  `json:"name"`
		Description     *string `json:"description"`
		DurationMinutes int     `json:"durationMinutes"`
		Price           *int64  `json:"price"`
	}
	if !decodeJSON(w, r, &request) {
		return
	}
	if request.DurationMinutes <= 0 {
		request.DurationMinutes = 20
	}
	var service serviceResponse
	err := handler.db.QueryRow(r.Context(), `
		INSERT INTO services (business_id, branch_id, name, description, duration_minutes, price)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, business_id, branch_id, name, description, duration_minutes, price, is_active
	`, chi.URLParam(r, "businessId"), request.BranchID, request.Name, request.Description, request.DurationMinutes, request.Price).Scan(
		&service.ID, &service.BusinessID, &service.BranchID, &service.Name, &service.Description, &service.DurationMinutes, &service.Price, &service.IsActive,
	)
	if err != nil {
		respondError(w, http.StatusBadRequest, "service_create_failed", "Gagal membuat layanan.")
		return
	}
	respondData(w, http.StatusCreated, service)
}

func (handler AppHandler) UpdateService(w http.ResponseWriter, r *http.Request) {
	var request struct {
		BranchID        *string `json:"branchId"`
		Name            string  `json:"name"`
		Description     *string `json:"description"`
		DurationMinutes int     `json:"durationMinutes"`
		Price           *int64  `json:"price"`
		IsActive        bool    `json:"isActive"`
	}
	if !decodeJSON(w, r, &request) {
		return
	}
	var service serviceResponse
	err := handler.db.QueryRow(r.Context(), `
		UPDATE services
		SET branch_id = $2, name = $3, description = $4, duration_minutes = $5, price = $6, is_active = $7
		WHERE id = $1
		RETURNING id, business_id, branch_id, name, description, duration_minutes, price, is_active
	`, chi.URLParam(r, "id"), request.BranchID, request.Name, request.Description, request.DurationMinutes, request.Price, request.IsActive).Scan(
		&service.ID, &service.BusinessID, &service.BranchID, &service.Name, &service.Description, &service.DurationMinutes, &service.Price, &service.IsActive,
	)
	if err != nil {
		respondError(w, http.StatusNotFound, "not_found", "Layanan tidak ditemukan.")
		return
	}
	respondData(w, http.StatusOK, service)
}

func (handler AppHandler) DeleteService(w http.ResponseWriter, r *http.Request) {
	respondDelete(w, r, handler.db, "DELETE FROM services WHERE id = $1", chi.URLParam(r, "id"))
}

func (handler AppHandler) ListQueues(w http.ResponseWriter, r *http.Request) {
	queues, err := handler.listQueues(r.Context(), chi.URLParam(r, "branchId"))
	if err != nil {
		respondError(w, http.StatusInternalServerError, "database_error", "Gagal mengambil antrean.")
		return
	}
	respondData(w, http.StatusOK, queues)
}

func (handler AppHandler) CreateQueue(w http.ResponseWriter, r *http.Request) {
	var request struct {
		CustomerName  string  `json:"customerName"`
		CustomerEmail string  `json:"customerEmail"`
		CustomerID    *string `json:"customerId"`
		ServiceID     string  `json:"serviceId"`
		StaffID       *string `json:"staffId"`
		Source        string  `json:"source"`
	}
	if !decodeJSON(w, r, &request) {
		return
	}
	branchID := chi.URLParam(r, "branchId")
	if request.ServiceID == "" {
		respondError(w, http.StatusBadRequest, "invalid_request", "Layanan wajib dipilih.")
		return
	}

	tx, err := handler.db.Begin(r.Context())
	if err != nil {
		respondError(w, http.StatusInternalServerError, "database_error", "Gagal memulai transaksi antrean.")
		return
	}
	defer tx.Rollback(r.Context())

	businessID, err := businessIDByBranch(r.Context(), tx, branchID)
	if err != nil {
		respondError(w, http.StatusNotFound, "not_found", "Cabang tidak ditemukan.")
		return
	}
	if ok, err := handler.canCreateQueueTx(r.Context(), tx, businessID); err != nil || !ok {
		respondError(w, http.StatusForbidden, "subscription_limit", "Kuota antrean bulan ini sudah habis.")
		return
	}
	customerID := ""
	if request.CustomerID != nil {
		customerID = *request.CustomerID
	}
	if customerID == "" {
		customerID, err = ensureCustomer(r.Context(), tx, request.CustomerName, request.CustomerEmail)
		if err != nil {
			respondError(w, http.StatusInternalServerError, "customer_error", "Gagal membuat data customer.")
			return
		}
	}
	duration, waitingBefore, err := queueEstimateInputs(r.Context(), tx, branchID, request.ServiceID, request.StaffID)
	if err != nil {
		respondError(w, http.StatusBadRequest, "queue_create_failed", "Layanan atau staff tidak valid.")
		return
	}
	queueNumber, err := nextQueueNumber(r.Context(), tx, branchID)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "queue_number_error", "Gagal membuat nomor antrean.")
		return
	}
	source := domain.QueueSourceOnline
	if request.Source == string(domain.QueueSourceWalkIn) {
		source = domain.QueueSourceWalkIn
	}
	estimate := service.NewQueueEstimator().EstimateWaitMinutes(waitingBefore, duration)

	var queue queueResponse
	err = tx.QueryRow(r.Context(), `
		INSERT INTO queues (business_id, branch_id, customer_id, service_id, staff_id, queue_number, source, estimated_wait_minutes)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id, business_id, branch_id, customer_id, service_id, staff_id, queue_number, source, status, estimated_wait_minutes, created_at
	`, businessID, branchID, customerID, request.ServiceID, request.StaffID, queueNumber, source, estimate).Scan(
		&queue.ID, &queue.BusinessID, &queue.BranchID, &queue.CustomerID, &queue.ServiceID, &queue.StaffID, &queue.QueueNumber, &queue.Source, &queue.Status, &queue.EstimatedWaitMinutes, &queue.CreatedAt,
	)
	if err != nil {
		respondError(w, http.StatusBadRequest, "queue_create_failed", "Gagal membuat antrean.")
		return
	}
	if _, err := tx.Exec(r.Context(), `
		INSERT INTO usage_counters (business_id, period_month, queue_count)
		VALUES ($1, to_char(now(), 'YYYY-MM'), 1)
		ON CONFLICT (business_id, period_month)
		DO UPDATE SET queue_count = usage_counters.queue_count + 1
	`, businessID); err != nil {
		respondError(w, http.StatusInternalServerError, "usage_error", "Gagal memperbarui kuota.")
		return
	}
	if err := tx.Commit(r.Context()); err != nil {
		respondError(w, http.StatusInternalServerError, "database_error", "Gagal menyimpan antrean.")
		return
	}
	recipient := strings.TrimSpace(request.CustomerEmail)
	if recipient == "" {
		recipient = "customer@ngantri.local"
	}
	_, _ = handler.db.Exec(r.Context(), `
		INSERT INTO notification_logs (business_id, customer_id, type, channel, recipient, payload_json)
		VALUES ($1, $2, 'queue_created', 'mock', $3, jsonb_build_object('queueNumber', $4))
	`, businessID, customerID, recipient, queueNumber)
	respondData(w, http.StatusCreated, queue)
}

func (handler AppHandler) GetQueue(w http.ResponseWriter, r *http.Request) {
	queue, err := handler.findQueue(r.Context(), chi.URLParam(r, "id"))
	if err != nil {
		respondError(w, http.StatusNotFound, "not_found", "Antrean tidak ditemukan.")
		return
	}
	respondData(w, http.StatusOK, queue)
}

func (handler AppHandler) UpdateQueueStatus(w http.ResponseWriter, r *http.Request) {
	var request struct {
		Status domain.QueueStatus `json:"status"`
	}
	if !decodeJSON(w, r, &request) {
		return
	}
	queueID := chi.URLParam(r, "id")
	current, err := handler.findQueue(r.Context(), queueID)
	if err != nil {
		respondError(w, http.StatusNotFound, "not_found", "Antrean tidak ditemukan.")
		return
	}
	if !service.CanTransitionQueueStatus(current.Status, request.Status) {
		respondError(w, http.StatusBadRequest, "invalid_transition", "Perubahan status antrean tidak valid.")
		return
	}
	queue, err := handler.updateQueueStatus(r.Context(), queueID, request.Status)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "queue_update_failed", "Gagal mengubah status antrean.")
		return
	}
	respondData(w, http.StatusOK, queue)
}

func (handler AppHandler) CallNextQueue(w http.ResponseWriter, r *http.Request) {
	var request struct {
		StaffID *string `json:"staffId"`
	}
	_ = json.NewDecoder(r.Body).Decode(&request)
	branchID := chi.URLParam(r, "branchId")
	query := `
		SELECT id
		FROM queues
		WHERE branch_id = $1
		  AND status = 'waiting'
		  AND ($2::uuid IS NULL OR staff_id = $2::uuid)
		ORDER BY created_at ASC
		LIMIT 1
	`
	var queueID string
	if err := handler.db.QueryRow(r.Context(), query, branchID, request.StaffID).Scan(&queueID); err != nil {
		respondError(w, http.StatusNotFound, "not_found", "Tidak ada antrean menunggu.")
		return
	}
	queue, err := handler.updateQueueStatus(r.Context(), queueID, domain.QueueCalled)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "queue_update_failed", "Gagal memanggil antrean.")
		return
	}
	respondData(w, http.StatusOK, queue)
}

func (handler AppHandler) ListBookings(w http.ResponseWriter, r *http.Request) {
	rows, err := handler.db.Query(r.Context(), `
		SELECT id, business_id, branch_id, customer_id, service_id, staff_id, booking_code, booking_date, start_time, end_time, status, notes
		FROM bookings
		WHERE branch_id = $1
		ORDER BY start_time ASC
	`, chi.URLParam(r, "branchId"))
	if err != nil {
		respondError(w, http.StatusInternalServerError, "database_error", "Gagal mengambil booking.")
		return
	}
	defer rows.Close()
	bookings, err := scanBookings(rows)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "database_error", "Gagal membaca booking.")
		return
	}
	respondData(w, http.StatusOK, bookings)
}

func (handler AppHandler) CreateBooking(w http.ResponseWriter, r *http.Request) {
	var request struct {
		CustomerName  string  `json:"customerName"`
		CustomerEmail string  `json:"customerEmail"`
		CustomerID    *string `json:"customerId"`
		ServiceID     string  `json:"serviceId"`
		StaffID       *string `json:"staffId"`
		StartTime     string  `json:"startTime"`
		Notes         *string `json:"notes"`
	}
	if !decodeJSON(w, r, &request) {
		return
	}
	startTime, err := time.Parse(time.RFC3339, request.StartTime)
	if err != nil {
		respondError(w, http.StatusBadRequest, "invalid_request", "Format startTime harus RFC3339.")
		return
	}
	branchID := chi.URLParam(r, "branchId")
	tx, err := handler.db.Begin(r.Context())
	if err != nil {
		respondError(w, http.StatusInternalServerError, "database_error", "Gagal memulai transaksi booking.")
		return
	}
	defer tx.Rollback(r.Context())
	businessID, err := businessIDByBranch(r.Context(), tx, branchID)
	if err != nil {
		respondError(w, http.StatusNotFound, "not_found", "Cabang tidak ditemukan.")
		return
	}
	customerID := ""
	if request.CustomerID != nil {
		customerID = *request.CustomerID
	}
	if customerID == "" {
		customerID, err = ensureCustomer(r.Context(), tx, request.CustomerName, request.CustomerEmail)
		if err != nil {
			respondError(w, http.StatusInternalServerError, "customer_error", "Gagal membuat data customer.")
			return
		}
	}
	duration := 20
	if err := tx.QueryRow(r.Context(), `SELECT duration_minutes FROM services WHERE id = $1 AND business_id = $2`, request.ServiceID, businessID).Scan(&duration); err != nil {
		respondError(w, http.StatusBadRequest, "invalid_service", "Layanan tidak valid.")
		return
	}
	code := fmt.Sprintf("BK-%d", time.Now().UnixNano()%1000000)
	var booking bookingResponse
	err = tx.QueryRow(r.Context(), `
		INSERT INTO bookings (business_id, branch_id, customer_id, service_id, staff_id, booking_code, booking_date, start_time, end_time, status, notes)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'confirmed', $10)
		RETURNING id, business_id, branch_id, customer_id, service_id, staff_id, booking_code, booking_date, start_time, end_time, status, notes
	`, businessID, branchID, customerID, request.ServiceID, request.StaffID, code, startTime.Format("2006-01-02"), startTime, startTime.Add(time.Duration(duration)*time.Minute), request.Notes).Scan(
		&booking.ID, &booking.BusinessID, &booking.BranchID, &booking.CustomerID, &booking.ServiceID, &booking.StaffID, &booking.BookingCode, &booking.BookingDate, &booking.StartTime, &booking.EndTime, &booking.Status, &booking.Notes,
	)
	if err != nil {
		respondError(w, http.StatusBadRequest, "booking_create_failed", "Gagal membuat booking.")
		return
	}
	if err := tx.Commit(r.Context()); err != nil {
		respondError(w, http.StatusInternalServerError, "database_error", "Gagal menyimpan booking.")
		return
	}
	recipient := strings.TrimSpace(request.CustomerEmail)
	if recipient == "" {
		recipient = "customer@ngantri.local"
	}
	_, _ = handler.db.Exec(r.Context(), `
		INSERT INTO notification_logs (business_id, customer_id, type, channel, recipient, payload_json)
		VALUES ($1, $2, 'booking_confirmed', 'mock', $3, jsonb_build_object('bookingCode', $4))
	`, businessID, customerID, recipient, code)
	respondData(w, http.StatusCreated, booking)
}

func (handler AppHandler) UpdateBookingStatus(w http.ResponseWriter, r *http.Request) {
	var request struct {
		Status domain.BookingStatus `json:"status"`
	}
	if !decodeJSON(w, r, &request) {
		return
	}
	var booking bookingResponse
	err := handler.db.QueryRow(r.Context(), `
		UPDATE bookings
		SET status = $2
		WHERE id = $1
		RETURNING id, business_id, branch_id, customer_id, service_id, staff_id, booking_code, booking_date, start_time, end_time, status, notes
	`, chi.URLParam(r, "id"), request.Status).Scan(
		&booking.ID, &booking.BusinessID, &booking.BranchID, &booking.CustomerID, &booking.ServiceID, &booking.StaffID, &booking.BookingCode, &booking.BookingDate, &booking.StartTime, &booking.EndTime, &booking.Status, &booking.Notes,
	)
	if err != nil {
		respondError(w, http.StatusNotFound, "not_found", "Booking tidak ditemukan.")
		return
	}
	respondData(w, http.StatusOK, booking)
}

func (handler AppHandler) CheckInBooking(w http.ResponseWriter, r *http.Request) {
	var booking bookingResponse
	err := handler.db.QueryRow(r.Context(), `
		SELECT id, business_id, branch_id, customer_id, service_id, staff_id, booking_code, booking_date, start_time, end_time, status, notes
		FROM bookings
		WHERE id = $1
	`, chi.URLParam(r, "id")).Scan(
		&booking.ID, &booking.BusinessID, &booking.BranchID, &booking.CustomerID, &booking.ServiceID, &booking.StaffID, &booking.BookingCode, &booking.BookingDate, &booking.StartTime, &booking.EndTime, &booking.Status, &booking.Notes,
	)
	if err != nil {
		respondError(w, http.StatusNotFound, "not_found", "Booking tidak ditemukan.")
		return
	}
	body := map[string]any{
		"customerId": booking.CustomerID,
		"serviceId":  booking.ServiceID,
		"staffId":    booking.StaffID,
		"source":     string(domain.QueueSourceOnline),
	}
	raw, _ := json.Marshal(body)
	r.Body = http.NoBody
	r.Body = readCloser{strings.NewReader(string(raw))}
	chi.RouteContext(r.Context()).URLParams.Add("branchId", booking.BranchID)
	handler.CreateQueue(w, r)
	_, _ = handler.db.Exec(context.Background(), `UPDATE bookings SET status = 'checked_in' WHERE id = $1`, booking.ID)
}

func (handler AppHandler) GetTheme(w http.ResponseWriter, r *http.Request) {
	var theme struct {
		BusinessID      string          `json:"businessId"`
		TemplateName    string          `json:"templateName"`
		PrimaryColor    string          `json:"primaryColor"`
		SecondaryColor  string          `json:"secondaryColor"`
		LogoURL         *string         `json:"logoUrl,omitempty"`
		CustomCSSConfig json.RawMessage `json:"customCssJson"`
	}
	err := handler.db.QueryRow(r.Context(), `
		SELECT business_id, template_name, primary_color, secondary_color, logo_url, custom_css_json
		FROM themes WHERE business_id = $1
	`, chi.URLParam(r, "businessId")).Scan(&theme.BusinessID, &theme.TemplateName, &theme.PrimaryColor, &theme.SecondaryColor, &theme.LogoURL, &theme.CustomCSSConfig)
	if err != nil {
		respondError(w, http.StatusNotFound, "not_found", "Tema tidak ditemukan.")
		return
	}
	respondData(w, http.StatusOK, theme)
}

func (handler AppHandler) UpdateTheme(w http.ResponseWriter, r *http.Request) {
	var request struct {
		TemplateName   string          `json:"templateName"`
		PrimaryColor   string          `json:"primaryColor"`
		SecondaryColor string          `json:"secondaryColor"`
		LogoURL        *string         `json:"logoUrl"`
		CustomCSSJSON  json.RawMessage `json:"customCssJson"`
	}
	if !decodeJSON(w, r, &request) {
		return
	}
	if request.TemplateName == "" {
		request.TemplateName = "Masculine"
	}
	if request.PrimaryColor == "" {
		request.PrimaryColor = "#2563EB"
	}
	if request.SecondaryColor == "" {
		request.SecondaryColor = "#F59E0B"
	}
	if len(request.CustomCSSJSON) == 0 {
		request.CustomCSSJSON = json.RawMessage(`{}`)
	}
	_, err := handler.db.Exec(r.Context(), `
		INSERT INTO themes (business_id, template_name, primary_color, secondary_color, logo_url, custom_css_json)
		VALUES ($1, $2, $3, $4, $5, $6)
		ON CONFLICT (business_id)
		DO UPDATE SET template_name = $2, primary_color = $3, secondary_color = $4, logo_url = $5, custom_css_json = $6
	`, chi.URLParam(r, "businessId"), request.TemplateName, request.PrimaryColor, request.SecondaryColor, request.LogoURL, request.CustomCSSJSON)
	if err != nil {
		respondError(w, http.StatusBadRequest, "theme_update_failed", "Gagal menyimpan tema.")
		return
	}
	handler.GetTheme(w, r)
}

func (handler AppHandler) BranchQR(w http.ResponseWriter, r *http.Request) {
	branch, err := handler.findBranch(r.Context(), chi.URLParam(r, "branchId"))
	if err != nil {
		respondError(w, http.StatusNotFound, "not_found", "Cabang tidak ditemukan.")
		return
	}
	business, err := handler.findBusiness(r.Context(), branch.BusinessID)
	if err != nil {
		respondError(w, http.StatusNotFound, "not_found", "Bisnis tidak ditemukan.")
		return
	}
	url := fmt.Sprintf("%s/%s/%s", strings.TrimRight(handler.cfg.PublicWebBaseURL, "/"), business.Slug, branch.Slug)
	respondData(w, http.StatusOK, map[string]string{"url": url})
}

func (handler AppHandler) BusinessAnalytics(w http.ResponseWriter, r *http.Request) {
	analytics, err := handler.analytics(r.Context(), chi.URLParam(r, "businessId"), nil)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "database_error", "Gagal mengambil analytics.")
		return
	}
	respondData(w, http.StatusOK, analytics)
}

func (handler AppHandler) BranchAnalytics(w http.ResponseWriter, r *http.Request) {
	branchID := chi.URLParam(r, "branchId")
	analytics, err := handler.analytics(r.Context(), "", &branchID)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "database_error", "Gagal mengambil analytics.")
		return
	}
	respondData(w, http.StatusOK, analytics)
}

func (handler AppHandler) PublicBusiness(w http.ResponseWriter, r *http.Request) {
	handler.publicPayload(w, r, chi.URLParam(r, "businessSlug"), "")
}

func (handler AppHandler) PublicBranch(w http.ResponseWriter, r *http.Request) {
	handler.publicPayload(w, r, chi.URLParam(r, "businessSlug"), chi.URLParam(r, "branchSlug"))
}

func (handler AppHandler) PublicLiveQueue(w http.ResponseWriter, r *http.Request) {
	business, branch, err := handler.resolvePublicBranch(r.Context(), chi.URLParam(r, "businessSlug"), chi.URLParam(r, "branchSlug"))
	if err != nil {
		respondError(w, http.StatusNotFound, "not_found", "Halaman antrean tidak ditemukan.")
		return
	}
	queues, err := handler.listQueues(r.Context(), branch.ID)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "database_error", "Gagal mengambil antrean.")
		return
	}
	respondData(w, http.StatusOK, map[string]any{"business": business, "branch": branch, "queues": queues})
}

func (handler AppHandler) AdminBusinesses(w http.ResponseWriter, r *http.Request) {
	handler.ListBusinesses(w, r)
}

func (handler AppHandler) AdminUsers(w http.ResponseWriter, r *http.Request) {
	rows, err := handler.db.Query(r.Context(), `SELECT id, name, email, avatar_url, role_global FROM users ORDER BY created_at DESC`)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "database_error", "Gagal mengambil user.")
		return
	}
	defer rows.Close()
	users := []authUserResponse{}
	for rows.Next() {
		var user authUserResponse
		if err := rows.Scan(&user.ID, &user.Name, &user.Email, &user.AvatarURL, &user.RoleGlobal); err != nil {
			respondError(w, http.StatusInternalServerError, "database_error", "Gagal membaca user.")
			return
		}
		users = append(users, user)
	}
	respondData(w, http.StatusOK, users)
}

func (handler AppHandler) AdminUpdateSubscription(w http.ResponseWriter, r *http.Request) {
	var request struct {
		Plan   domain.SubscriptionPlan   `json:"plan"`
		Status domain.SubscriptionStatus `json:"status"`
	}
	if !decodeJSON(w, r, &request) {
		return
	}
	limit := service.NewSubscriptionPolicy().QueueLimit(request.Plan)
	branchLimit := 999
	if request.Plan == domain.PlanFree {
		branchLimit = 1
	}
	_, err := handler.db.Exec(r.Context(), `
		UPDATE businesses SET subscription_plan = $2, subscription_status = $3 WHERE id = $1;
		INSERT INTO subscriptions (business_id, plan, monthly_queue_limit, branch_limit, current_period_start, current_period_end, status)
		VALUES ($1, $2, $4, $5, date_trunc('month', now())::date, (date_trunc('month', now()) + interval '1 month - 1 day')::date, $3)
		ON CONFLICT (business_id)
		DO UPDATE SET plan = $2, monthly_queue_limit = $4, branch_limit = $5, status = $3;
	`, chi.URLParam(r, "id"), request.Plan, request.Status, limit, branchLimit)
	if err != nil {
		respondError(w, http.StatusBadRequest, "subscription_update_failed", "Gagal memperbarui subscription.")
		return
	}
	handler.GetBusiness(w, r)
}

func (handler AppHandler) AdminUpdateBusinessStatus(w http.ResponseWriter, r *http.Request) {
	var request struct {
		Status domain.SubscriptionStatus `json:"status"`
	}
	if !decodeJSON(w, r, &request) {
		return
	}
	_, err := handler.db.Exec(r.Context(), `UPDATE businesses SET subscription_status = $2 WHERE id = $1`, chi.URLParam(r, "id"), request.Status)
	if err != nil {
		respondError(w, http.StatusBadRequest, "business_status_failed", "Gagal memperbarui status bisnis.")
		return
	}
	handler.GetBusiness(w, r)
}

func (handler AppHandler) publicPayload(w http.ResponseWriter, r *http.Request, businessSlug string, branchSlug string) {
	business, branch, err := handler.resolvePublicBranch(r.Context(), businessSlug, branchSlug)
	if err != nil {
		respondError(w, http.StatusNotFound, "not_found", "Halaman antrean tidak ditemukan.")
		return
	}
	branches, err := handler.listBranches(r.Context(), business.ID)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "database_error", "Gagal mengambil cabang.")
		return
	}
	staff, _ := handler.listStaff(r.Context(), branch.ID)
	services, _ := handler.listServices(r.Context(), business.ID)
	queues, _ := handler.listQueues(r.Context(), branch.ID)
	analytics, _ := handler.analytics(r.Context(), business.ID, &branch.ID)
	respondData(w, http.StatusOK, publicBusinessResponse{
		Business: business, Branches: branches, Staff: staff, Services: services, Queues: queues, Analytics: analytics,
	})
}

func (handler AppHandler) findBusiness(ctx context.Context, id string) (businessResponse, error) {
	var business businessResponse
	err := handler.db.QueryRow(ctx, `
		SELECT id, owner_id, name, slug, logo_url, description, subscription_plan, subscription_status
		FROM businesses WHERE id = $1
	`, id).Scan(&business.ID, &business.OwnerID, &business.Name, &business.Slug, &business.LogoURL, &business.Description, &business.SubscriptionPlan, &business.SubscriptionStatus)
	return business, err
}

func (handler AppHandler) findBranch(ctx context.Context, id string) (branchResponse, error) {
	var branch branchResponse
	err := handler.db.QueryRow(ctx, `
		SELECT id, business_id, name, slug, address, phone, timezone, is_active
		FROM branches WHERE id = $1
	`, id).Scan(&branch.ID, &branch.BusinessID, &branch.Name, &branch.Slug, &branch.Address, &branch.Phone, &branch.Timezone, &branch.IsActive)
	return branch, err
}

func (handler AppHandler) resolvePublicBranch(ctx context.Context, businessSlug string, branchSlug string) (businessResponse, branchResponse, error) {
	var business businessResponse
	err := handler.db.QueryRow(ctx, `
		SELECT id, owner_id, name, slug, logo_url, description, subscription_plan, subscription_status
		FROM businesses
		WHERE slug = $1 AND subscription_status = 'active'
	`, businessSlug).Scan(&business.ID, &business.OwnerID, &business.Name, &business.Slug, &business.LogoURL, &business.Description, &business.SubscriptionPlan, &business.SubscriptionStatus)
	if err != nil {
		return businessResponse{}, branchResponse{}, err
	}
	var branch branchResponse
	query := `
		SELECT id, business_id, name, slug, address, phone, timezone, is_active
		FROM branches
		WHERE business_id = $1 AND is_active = true AND ($2 = '' OR slug = $2)
		ORDER BY created_at ASC
		LIMIT 1
	`
	err = handler.db.QueryRow(ctx, query, business.ID, branchSlug).Scan(&branch.ID, &branch.BusinessID, &branch.Name, &branch.Slug, &branch.Address, &branch.Phone, &branch.Timezone, &branch.IsActive)
	return business, branch, err
}

func (handler AppHandler) listBranches(ctx context.Context, businessID string) ([]branchResponse, error) {
	rows, err := handler.db.Query(ctx, `
		SELECT id, business_id, name, slug, address, phone, timezone, is_active
		FROM branches WHERE business_id = $1
		ORDER BY created_at ASC
	`, businessID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	branches := []branchResponse{}
	for rows.Next() {
		var branch branchResponse
		if err := rows.Scan(&branch.ID, &branch.BusinessID, &branch.Name, &branch.Slug, &branch.Address, &branch.Phone, &branch.Timezone, &branch.IsActive); err != nil {
			return nil, err
		}
		branches = append(branches, branch)
	}
	return branches, rows.Err()
}

func (handler AppHandler) listStaff(ctx context.Context, branchID string) ([]staffResponse, error) {
	rows, err := handler.db.Query(ctx, `
		SELECT id, branch_id, user_id, name, role_label, avatar_url, is_available
		FROM branch_staff WHERE branch_id = $1
		ORDER BY created_at ASC
	`, branchID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	staff := []staffResponse{}
	for rows.Next() {
		var item staffResponse
		if err := rows.Scan(&item.ID, &item.BranchID, &item.UserID, &item.Name, &item.RoleLabel, &item.AvatarURL, &item.IsAvailable); err != nil {
			return nil, err
		}
		staff = append(staff, item)
	}
	return staff, rows.Err()
}

func (handler AppHandler) listServices(ctx context.Context, businessID string) ([]serviceResponse, error) {
	rows, err := handler.db.Query(ctx, `
		SELECT id, business_id, branch_id, name, description, duration_minutes, price, is_active
		FROM services WHERE business_id = $1 AND is_active = true
		ORDER BY created_at ASC
	`, businessID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	services := []serviceResponse{}
	for rows.Next() {
		var item serviceResponse
		if err := rows.Scan(&item.ID, &item.BusinessID, &item.BranchID, &item.Name, &item.Description, &item.DurationMinutes, &item.Price, &item.IsActive); err != nil {
			return nil, err
		}
		services = append(services, item)
	}
	return services, rows.Err()
}

func (handler AppHandler) listQueues(ctx context.Context, branchID string) ([]queueResponse, error) {
	rows, err := handler.db.Query(ctx, `
		SELECT id, business_id, branch_id, customer_id, service_id, staff_id, queue_number, source, status, estimated_wait_minutes, created_at
		FROM queues
		WHERE branch_id = $1 AND created_at >= date_trunc('day', now())
		ORDER BY created_at ASC
	`, branchID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	return scanQueues(rows)
}

func (handler AppHandler) findQueue(ctx context.Context, id string) (queueResponse, error) {
	var queue queueResponse
	err := handler.db.QueryRow(ctx, `
		SELECT id, business_id, branch_id, customer_id, service_id, staff_id, queue_number, source, status, estimated_wait_minutes, created_at
		FROM queues WHERE id = $1
	`, id).Scan(&queue.ID, &queue.BusinessID, &queue.BranchID, &queue.CustomerID, &queue.ServiceID, &queue.StaffID, &queue.QueueNumber, &queue.Source, &queue.Status, &queue.EstimatedWaitMinutes, &queue.CreatedAt)
	return queue, err
}

func (handler AppHandler) updateQueueStatus(ctx context.Context, queueID string, status domain.QueueStatus) (queueResponse, error) {
	var queue queueResponse
	err := handler.db.QueryRow(ctx, `
		UPDATE queues
		SET status = $2,
		    called_at = CASE WHEN $2 = 'called' THEN now() ELSE called_at END,
		    started_at = CASE WHEN $2 = 'serving' THEN now() ELSE started_at END,
		    completed_at = CASE WHEN $2 = 'completed' THEN now() ELSE completed_at END,
		    cancelled_at = CASE WHEN $2 IN ('cancelled', 'no_show') THEN now() ELSE cancelled_at END
		WHERE id = $1
		RETURNING id, business_id, branch_id, customer_id, service_id, staff_id, queue_number, source, status, estimated_wait_minutes, created_at
	`, queueID, status).Scan(&queue.ID, &queue.BusinessID, &queue.BranchID, &queue.CustomerID, &queue.ServiceID, &queue.StaffID, &queue.QueueNumber, &queue.Source, &queue.Status, &queue.EstimatedWaitMinutes, &queue.CreatedAt)
	return queue, err
}

func (handler AppHandler) analytics(ctx context.Context, businessID string, branchID *string) (analyticsResponse, error) {
	var args []any
	filter := "business_id = $1"
	args = append(args, businessID)
	if branchID != nil {
		filter = "branch_id = $1"
		args[0] = *branchID
	}
	query := fmt.Sprintf(`
		SELECT
		  COUNT(*) FILTER (WHERE created_at >= date_trunc('day', now())),
		  COUNT(*) FILTER (WHERE status = 'waiting' AND created_at >= date_trunc('day', now())),
		  COUNT(*) FILTER (WHERE status = 'serving' AND created_at >= date_trunc('day', now())),
		  COUNT(*) FILTER (WHERE status = 'completed' AND created_at >= date_trunc('day', now())),
		  COUNT(*) FILTER (WHERE status = 'no_show' AND created_at >= date_trunc('day', now())),
		  COALESCE(ROUND(AVG(estimated_wait_minutes))::int, 0)
		FROM queues
		WHERE %s
	`, filter)
	var analytics analyticsResponse
	err := handler.db.QueryRow(ctx, query, args...).Scan(&analytics.TotalQueuesToday, &analytics.CurrentlyWaiting, &analytics.CurrentlyServing, &analytics.CompletedToday, &analytics.NoShowToday, &analytics.AverageWaitMinutes)
	if err != nil {
		return analyticsResponse{}, err
	}
	analytics.BusiestHour = "-"
	analytics.TopService = "-"
	_ = handler.db.QueryRow(ctx, fmt.Sprintf(`
		SELECT COALESCE(to_char(date_trunc('hour', q.created_at), 'HH24.00'), '-')
		FROM queues q WHERE q.%s = $1 AND q.created_at >= date_trunc('day', now())
		GROUP BY date_trunc('hour', q.created_at)
		ORDER BY COUNT(*) DESC LIMIT 1
	`, map[bool]string{true: "branch_id", false: "business_id"}[branchID != nil]), args[0]).Scan(&analytics.BusiestHour)
	_ = handler.db.QueryRow(ctx, fmt.Sprintf(`
		SELECT COALESCE(s.name, '-')
		FROM queues q JOIN services s ON s.id = q.service_id
		WHERE q.%s = $1 AND q.created_at >= date_trunc('day', now())
		GROUP BY s.name
		ORDER BY COUNT(*) DESC LIMIT 1
	`, map[bool]string{true: "branch_id", false: "business_id"}[branchID != nil]), args[0]).Scan(&analytics.TopService)
	return analytics, nil
}

func (handler AppHandler) canCreateBranch(ctx context.Context, businessID string) (bool, error) {
	var plan domain.SubscriptionPlan
	var count int
	if err := handler.db.QueryRow(ctx, `SELECT subscription_plan FROM businesses WHERE id = $1`, businessID).Scan(&plan); err != nil {
		return false, err
	}
	if err := handler.db.QueryRow(ctx, `SELECT COUNT(*) FROM branches WHERE business_id = $1 AND is_active = true`, businessID).Scan(&count); err != nil {
		return false, err
	}
	return service.NewSubscriptionPolicy().CanCreateBranch(plan, count), nil
}

func (handler AppHandler) canCreateQueueTx(ctx context.Context, tx pgx.Tx, businessID string) (bool, error) {
	var plan domain.SubscriptionPlan
	var count int
	if err := tx.QueryRow(ctx, `SELECT subscription_plan FROM businesses WHERE id = $1`, businessID).Scan(&plan); err != nil {
		return false, err
	}
	err := tx.QueryRow(ctx, `SELECT COALESCE(queue_count, 0) FROM usage_counters WHERE business_id = $1 AND period_month = to_char(now(), 'YYYY-MM')`, businessID).Scan(&count)
	if err == pgx.ErrNoRows {
		count = 0
	} else if err != nil {
		return false, err
	}
	return service.NewSubscriptionPolicy().CanCreateQueue(plan, count), nil
}

func businessIDByBranch(ctx context.Context, tx pgx.Tx, branchID string) (string, error) {
	var businessID string
	err := tx.QueryRow(ctx, `SELECT business_id FROM branches WHERE id = $1 AND is_active = true`, branchID).Scan(&businessID)
	return businessID, err
}

func ensureCustomer(ctx context.Context, tx pgx.Tx, name string, email string) (string, error) {
	name = strings.TrimSpace(name)
	email = strings.TrimSpace(strings.ToLower(email))
	if name == "" {
		name = "Customer"
	}
	var id string
	err := tx.QueryRow(ctx, `
		INSERT INTO users (name, email)
		VALUES ($1, COALESCE(NULLIF($2, ''), 'guest-' || gen_random_uuid()::text || '@ngantri.local'))
		ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
		RETURNING id
	`, name, email).Scan(&id)
	return id, err
}

func queueEstimateInputs(ctx context.Context, tx pgx.Tx, branchID string, serviceID string, staffID *string) (int, int, error) {
	var duration int
	if err := tx.QueryRow(ctx, `
		SELECT s.duration_minutes
		FROM services s
		JOIN branches b ON b.business_id = s.business_id
		WHERE b.id = $1 AND s.id = $2 AND s.is_active = true
	`, branchID, serviceID).Scan(&duration); err != nil {
		return 0, 0, err
	}
	query := `
		SELECT COUNT(*)
		FROM queues
		WHERE branch_id = $1
		  AND status IN ('waiting', 'called', 'serving')
		  AND ($2::uuid IS NULL OR staff_id = $2::uuid)
	`
	var waiting int
	if err := tx.QueryRow(ctx, query, branchID, staffID).Scan(&waiting); err != nil {
		return 0, 0, err
	}
	return duration, waiting, nil
}

func nextQueueNumber(ctx context.Context, tx pgx.Tx, branchID string) (string, error) {
	var next int
	err := tx.QueryRow(ctx, `
		SELECT COALESCE(MAX(NULLIF(regexp_replace(queue_number, '\D', '', 'g'), '')::int), 0) + 1
		FROM queues
		WHERE branch_id = $1
	`, branchID).Scan(&next)
	if err != nil {
		return "", err
	}
	width := int(math.Max(2, float64(len(fmt.Sprint(next)))))
	return fmt.Sprintf("A-%0*d", width, next), nil
}

func scanBusinesses(rows pgx.Rows) ([]businessResponse, error) {
	businesses := []businessResponse{}
	for rows.Next() {
		var business businessResponse
		if err := rows.Scan(&business.ID, &business.OwnerID, &business.Name, &business.Slug, &business.LogoURL, &business.Description, &business.SubscriptionPlan, &business.SubscriptionStatus); err != nil {
			return nil, err
		}
		businesses = append(businesses, business)
	}
	return businesses, rows.Err()
}

func scanQueues(rows pgx.Rows) ([]queueResponse, error) {
	queues := []queueResponse{}
	for rows.Next() {
		var queue queueResponse
		if err := rows.Scan(&queue.ID, &queue.BusinessID, &queue.BranchID, &queue.CustomerID, &queue.ServiceID, &queue.StaffID, &queue.QueueNumber, &queue.Source, &queue.Status, &queue.EstimatedWaitMinutes, &queue.CreatedAt); err != nil {
			return nil, err
		}
		queues = append(queues, queue)
	}
	return queues, rows.Err()
}

func scanBookings(rows pgx.Rows) ([]bookingResponse, error) {
	bookings := []bookingResponse{}
	for rows.Next() {
		var booking bookingResponse
		if err := rows.Scan(&booking.ID, &booking.BusinessID, &booking.BranchID, &booking.CustomerID, &booking.ServiceID, &booking.StaffID, &booking.BookingCode, &booking.BookingDate, &booking.StartTime, &booking.EndTime, &booking.Status, &booking.Notes); err != nil {
			return nil, err
		}
		bookings = append(bookings, booking)
	}
	return bookings, rows.Err()
}

func decodeJSON(w http.ResponseWriter, r *http.Request, dest any) bool {
	if err := json.NewDecoder(r.Body).Decode(dest); err != nil {
		respondError(w, http.StatusBadRequest, "invalid_request", "Request body tidak valid.")
		return false
	}
	return true
}

func respondDelete(w http.ResponseWriter, r *http.Request, db *pgxpool.Pool, query string, id string) {
	tag, err := db.Exec(r.Context(), query, id)
	if err != nil || tag.RowsAffected() == 0 {
		respondError(w, http.StatusNotFound, "not_found", "Data tidak ditemukan.")
		return
	}
	respondData(w, http.StatusOK, map[string]bool{"deleted": true})
}

var slugCleanup = regexp.MustCompile(`[^a-z0-9]+`)

func slugify(value string) string {
	slug := strings.ToLower(strings.TrimSpace(value))
	slug = slugCleanup.ReplaceAllString(slug, "-")
	slug = strings.Trim(slug, "-")
	if slug == "" {
		return "bisnis"
	}
	return slug
}

type readCloser struct {
	*strings.Reader
}

func (readCloser) Close() error {
	return nil
}
