package http

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"

	"ngantri/backend/internal/config"
)

func NewRouter(cfg config.Config) http.Handler {
	router := chi.NewRouter()

	router.Get("/healthz", func(w http.ResponseWriter, r *http.Request) {
		respondJSON(w, http.StatusOK, map[string]string{
			"status":      "ok",
			"environment": cfg.Environment,
		})
	})

	router.Route("/api", func(api chi.Router) {
		api.Get("/me", placeholder("me"))
		api.Post("/auth/register", placeholder("auth.register"))
		api.Post("/auth/login", placeholder("auth.login"))
		api.Get("/auth/google", placeholder("auth.google"))
		api.Get("/auth/google/callback", placeholder("auth.google.callback"))
		api.Post("/auth/refresh", placeholder("auth.refresh"))
		api.Post("/auth/logout", placeholder("auth.logout"))

		api.Route("/businesses", func(businesses chi.Router) {
			businesses.Get("/", placeholder("businesses.list"))
			businesses.Post("/", placeholder("businesses.create"))
			businesses.Get("/{id}", placeholder("businesses.get"))
			businesses.Put("/{id}", placeholder("businesses.update"))
			businesses.Delete("/{id}", placeholder("businesses.delete"))
			businesses.Get("/{businessId}/services", placeholder("services.list"))
			businesses.Post("/{businessId}/services", placeholder("services.create"))
			businesses.Get("/{businessId}/theme", placeholder("theme.get"))
			businesses.Put("/{businessId}/theme", placeholder("theme.update"))
			businesses.Get("/{businessId}/analytics/overview", placeholder("analytics.business_overview"))
			businesses.Get("/{businessId}/branches", placeholder("branches.list"))
			businesses.Post("/{businessId}/branches", placeholder("branches.create"))
		})

		api.Route("/branches", func(branches chi.Router) {
			branches.Put("/{id}", placeholder("branches.update"))
			branches.Delete("/{id}", placeholder("branches.delete"))
			branches.Get("/{branchId}/staff", placeholder("staff.list"))
			branches.Post("/{branchId}/staff", placeholder("staff.create"))
			branches.Get("/{branchId}/queues", placeholder("queues.list"))
			branches.Post("/{branchId}/queues", placeholder("queues.create"))
			branches.Post("/{branchId}/queues/call-next", placeholder("queues.call_next"))
			branches.Get("/{branchId}/bookings", placeholder("bookings.list"))
			branches.Post("/{branchId}/bookings", placeholder("bookings.create"))
			branches.Get("/{branchId}/qr", placeholder("qr.branch"))
			branches.Get("/{branchId}/analytics/overview", placeholder("analytics.branch_overview"))
		})

		api.Route("/public", func(public chi.Router) {
			public.Get("/{businessSlug}", placeholder("public.business"))
			public.Get("/{businessSlug}/{branchSlug}", placeholder("public.branch"))
			public.Get("/{businessSlug}/{branchSlug}/live-queue", placeholder("public.live_queue"))
		})

		api.Put("/services/{id}", placeholder("services.update"))
		api.Delete("/services/{id}", placeholder("services.delete"))
		api.Put("/staff/{id}", placeholder("staff.update"))
		api.Delete("/staff/{id}", placeholder("staff.delete"))
		api.Get("/queues/{id}", placeholder("queues.get"))
		api.Put("/queues/{id}/status", placeholder("queues.status"))
		api.Put("/bookings/{id}/status", placeholder("bookings.status"))
		api.Post("/bookings/{id}/check-in", placeholder("bookings.check_in"))

		api.Route("/admin", func(admin chi.Router) {
			admin.Get("/businesses", placeholder("admin.businesses"))
			admin.Get("/users", placeholder("admin.users"))
			admin.Put("/businesses/{id}/subscription", placeholder("admin.subscription"))
			admin.Put("/businesses/{id}/status", placeholder("admin.business_status"))
		})
	})

	return router
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
