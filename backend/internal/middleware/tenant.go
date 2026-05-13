package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/go-chi/chi/v5"

	"ngantri/backend/internal/domain"
)

const tenantContextKey contextKey = "tenant"

func WithTenant(ctx context.Context, tenant domain.Tenant) context.Context {
	return context.WithValue(ctx, tenantContextKey, tenant)
}

func TenantFromContext(ctx context.Context) (domain.Tenant, bool) {
	tenant, ok := ctx.Value(tenantContextKey).(domain.Tenant)
	return tenant, ok
}

func RequireTenantParam(paramName string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			businessID := strings.TrimSpace(chi.URLParam(r, paramName))
			if businessID == "" {
				http.Error(w, domain.ErrNotFound.Error(), http.StatusNotFound)
				return
			}

			tenant := domain.Tenant{BusinessID: businessID}
			next.ServeHTTP(w, r.WithContext(WithTenant(r.Context(), tenant)))
		})
	}
}
