package middleware

import (
	"context"
	"net/http"
	"strings"

	"ngantri/backend/internal/domain"
)

type contextKey string

const userContextKey contextKey = "user"

type Principal struct {
	UserID     string
	GlobalRole domain.GlobalRole
}

func WithPrincipal(ctx context.Context, principal Principal) context.Context {
	return context.WithValue(ctx, userContextKey, principal)
}

func PrincipalFromContext(ctx context.Context) (Principal, bool) {
	principal, ok := ctx.Value(userContextKey).(Principal)
	return principal, ok
}

func RequireAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		header := r.Header.Get("Authorization")
		token := strings.TrimPrefix(header, "Bearer ")
		if token == "" || token == header {
			http.Error(w, domain.ErrUnauthorized.Error(), http.StatusUnauthorized)
			return
		}

		// JWT validation is wired here in the implementation phase.
		principal := Principal{UserID: "dev-user", GlobalRole: domain.GlobalRoleCustomer}
		next.ServeHTTP(w, r.WithContext(WithPrincipal(r.Context(), principal)))
	})
}
