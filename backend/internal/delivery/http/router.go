package http

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"ngantri/backend/internal/config"
	"ngantri/backend/internal/middleware"
)

func NewRouter(cfg config.Config, db *pgxpool.Pool) http.Handler {
	router := chi.NewRouter()
	router.Use(cors(cfg))

	authHandler := NewAuthHandler(cfg, db)
	appHandler := NewAppHandler(cfg, db)

	router.Get("/healthz", func(w http.ResponseWriter, r *http.Request) {
		respondJSON(w, http.StatusOK, map[string]string{
			"status":      "ok",
			"environment": cfg.Environment,
		})
	})

	router.Route("/api", func(api chi.Router) {
		api.Get("/me", authHandler.Me)
		api.Post("/auth/register", authHandler.Register)
		api.Post("/auth/login", authHandler.Login)
		api.Get("/auth/google", placeholder("auth.google"))
		api.Get("/auth/google/callback", placeholder("auth.google.callback"))
		api.Post("/auth/refresh", authHandler.Refresh)
		api.Post("/auth/logout", authHandler.Logout)

		api.Route("/businesses", func(businesses chi.Router) {
			businesses.Get("/", appHandler.ListBusinesses)
			businesses.Post("/", appHandler.CreateBusiness)
			businesses.With(middleware.RequireTenantParam("id")).Get("/{id}", appHandler.GetBusiness)
			businesses.With(middleware.RequireTenantParam("id")).Put("/{id}", appHandler.UpdateBusiness)
			businesses.With(middleware.RequireTenantParam("id")).Delete("/{id}", appHandler.DeleteBusiness)
			businesses.With(middleware.RequireTenantParam("businessId")).Get("/{businessId}/services", appHandler.ListServices)
			businesses.With(middleware.RequireTenantParam("businessId")).Post("/{businessId}/services", appHandler.CreateService)
			businesses.With(middleware.RequireTenantParam("businessId")).Get("/{businessId}/theme", appHandler.GetTheme)
			businesses.With(middleware.RequireTenantParam("businessId")).Put("/{businessId}/theme", appHandler.UpdateTheme)
			businesses.With(middleware.RequireTenantParam("businessId")).Get("/{businessId}/analytics/overview", appHandler.BusinessAnalytics)
			businesses.With(middleware.RequireTenantParam("businessId")).Get("/{businessId}/branches", appHandler.ListBranches)
			businesses.With(middleware.RequireTenantParam("businessId")).Post("/{businessId}/branches", appHandler.CreateBranch)
		})

		api.Route("/branches", func(branches chi.Router) {
			branches.Put("/{id}", appHandler.UpdateBranch)
			branches.Delete("/{id}", appHandler.DeleteBranch)
			branches.Get("/{branchId}/staff", appHandler.ListStaff)
			branches.Post("/{branchId}/staff", appHandler.CreateStaff)
			branches.Get("/{branchId}/queues", appHandler.ListQueues)
			branches.Post("/{branchId}/queues", appHandler.CreateQueue)
			branches.Post("/{branchId}/queues/call-next", appHandler.CallNextQueue)
			branches.Get("/{branchId}/bookings", appHandler.ListBookings)
			branches.Post("/{branchId}/bookings", appHandler.CreateBooking)
			branches.Get("/{branchId}/qr", appHandler.BranchQR)
			branches.Get("/{branchId}/analytics/overview", appHandler.BranchAnalytics)
		})

		api.Route("/public", func(public chi.Router) {
			public.Get("/{businessSlug}", appHandler.PublicBusiness)
			public.Get("/{businessSlug}/{branchSlug}", appHandler.PublicBranch)
			public.Get("/{businessSlug}/{branchSlug}/live-queue", appHandler.PublicLiveQueue)
		})

		api.Put("/services/{id}", appHandler.UpdateService)
		api.Delete("/services/{id}", appHandler.DeleteService)
		api.Put("/staff/{id}", appHandler.UpdateStaff)
		api.Delete("/staff/{id}", appHandler.DeleteStaff)
		api.Get("/queues/{id}", appHandler.GetQueue)
		api.Put("/queues/{id}/status", appHandler.UpdateQueueStatus)
		api.Put("/bookings/{id}/status", appHandler.UpdateBookingStatus)
		api.Post("/bookings/{id}/check-in", appHandler.CheckInBooking)

		api.Route("/admin", func(admin chi.Router) {
			admin.Get("/businesses", appHandler.AdminBusinesses)
			admin.Get("/users", appHandler.AdminUsers)
			admin.Put("/businesses/{id}/subscription", appHandler.AdminUpdateSubscription)
			admin.Put("/businesses/{id}/status", appHandler.AdminUpdateBusinessStatus)
		})
	})

	return router
}

func cors(cfg config.Config) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			origin := r.Header.Get("Origin")
			if origin == cfg.PublicWebBaseURL || origin == "http://localhost:3000" {
				w.Header().Set("Access-Control-Allow-Origin", origin)
				w.Header().Set("Vary", "Origin")
				w.Header().Set("Access-Control-Allow-Credentials", "true")
				w.Header().Set("Access-Control-Allow-Headers", "Authorization, Content-Type")
				w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			}
			if r.Method == http.MethodOptions {
				w.WriteHeader(http.StatusNoContent)
				return
			}
			next.ServeHTTP(w, r)
		})
	}
}

func placeholder(name string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		respondJSON(w, http.StatusNotImplemented, map[string]string{
			"code":    "not_implemented",
			"handler": name,
		})
	}
}

func respondJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(payload)
}

func respondData(w http.ResponseWriter, status int, data any) {
	respondJSON(w, status, map[string]any{"data": data})
}

func respondError(w http.ResponseWriter, status int, code string, message string) {
	respondJSON(w, status, map[string]string{
		"code":    code,
		"message": message,
	})
}
