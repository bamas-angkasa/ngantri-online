package http

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"ngantri/backend/internal/config"
	"ngantri/backend/internal/domain"
	authpkg "ngantri/backend/internal/pkg/auth"
)

type AuthHandler struct {
	cfg config.Config
	db  *pgxpool.Pool
}

type authUserResponse struct {
	ID         string            `json:"id"`
	Name       string            `json:"name"`
	Email      string            `json:"email"`
	AvatarURL  *string           `json:"avatarUrl,omitempty"`
	RoleGlobal domain.GlobalRole `json:"roleGlobal"`
}

type loginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type registerRequest struct {
	Name         string `json:"name"`
	Email        string `json:"email"`
	Password     string `json:"password"`
	BusinessName string `json:"businessName"`
}

type loginResponse struct {
	Token     string           `json:"token"`
	ExpiresAt time.Time        `json:"expiresAt"`
	User      authUserResponse `json:"user"`
}

func NewAuthHandler(cfg config.Config, db *pgxpool.Pool) AuthHandler {
	return AuthHandler{cfg: cfg, db: db}
}

func (handler AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
	var request registerRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		respondError(w, http.StatusBadRequest, "invalid_request", "Request registrasi tidak valid.")
		return
	}

	name := strings.TrimSpace(request.Name)
	email := strings.TrimSpace(strings.ToLower(request.Email))
	businessName := strings.TrimSpace(request.BusinessName)
	if businessName == "" {
		businessName = name
	}
	if name == "" || email == "" || request.Password == "" || businessName == "" {
		respondError(w, http.StatusBadRequest, "invalid_request", "Nama, email, password, dan nama bisnis wajib diisi.")
		return
	}

	passwordHash, err := authpkg.HashPassword(request.Password)
	if err != nil {
		respondError(w, http.StatusBadRequest, "weak_password", "Password minimal 8 karakter.")
		return
	}

	tx, err := handler.db.Begin(r.Context())
	if err != nil {
		respondError(w, http.StatusInternalServerError, "database_error", "Gagal memulai registrasi.")
		return
	}
	defer tx.Rollback(r.Context())

	var user authUserResponse
	err = tx.QueryRow(r.Context(), `
		INSERT INTO users (name, email, password_hash)
		VALUES ($1, $2, $3)
		RETURNING id, name, email, avatar_url, role_global
	`, name, email, passwordHash).Scan(&user.ID, &user.Name, &user.Email, &user.AvatarURL, &user.RoleGlobal)
	if err != nil {
		respondError(w, http.StatusConflict, "email_taken", "Email sudah terdaftar.")
		return
	}

	slug := slugify(businessName)
	var businessID string
	err = tx.QueryRow(r.Context(), `
		INSERT INTO businesses (owner_id, name, slug)
		VALUES ($1, $2, $3)
		RETURNING id
	`, user.ID, businessName, slug).Scan(&businessID)
	if err != nil {
		respondError(w, http.StatusConflict, "business_slug_taken", "Nama bisnis sudah dipakai.")
		return
	}

	_, err = tx.Exec(r.Context(), `
		INSERT INTO business_members (business_id, user_id, role)
		VALUES ($1, $2, 'owner')
	`, businessID, user.ID)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "database_error", "Gagal membuat membership bisnis.")
		return
	}

	_, err = tx.Exec(r.Context(), `
		INSERT INTO subscriptions (business_id, plan, monthly_queue_limit, branch_limit, current_period_start, current_period_end, status)
		VALUES ($1, 'free', 10, 1, date_trunc('month', now())::date, (date_trunc('month', now()) + interval '1 month - 1 day')::date, 'active')
	`, businessID)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "database_error", "Gagal membuat subscription awal.")
		return
	}

	if err := tx.Commit(r.Context()); err != nil {
		respondError(w, http.StatusInternalServerError, "database_error", "Gagal menyimpan registrasi.")
		return
	}

	session, err := handler.issueSession(user)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "token_error", "Gagal membuat sesi login.")
		return
	}
	respondData(w, http.StatusCreated, session)
}

func (handler AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var request loginRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		respondError(w, http.StatusBadRequest, "invalid_request", "Request login tidak valid.")
		return
	}

	email := strings.TrimSpace(strings.ToLower(request.Email))
	if email == "" || request.Password == "" {
		respondError(w, http.StatusBadRequest, "invalid_credentials", "Email dan password wajib diisi.")
		return
	}

	user, passwordHash, err := handler.findUserByEmail(r.Context(), email)
	if err != nil || passwordHash == nil || !authpkg.VerifyPassword(request.Password, *passwordHash) {
		respondError(w, http.StatusUnauthorized, "invalid_credentials", "Email atau password salah.")
		return
	}

	session, err := handler.issueSession(user)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "token_error", "Gagal membuat sesi login.")
		return
	}

	respondData(w, http.StatusOK, session)
}

func (handler AuthHandler) Me(w http.ResponseWriter, r *http.Request) {
	token := bearerToken(r)
	if token == "" {
		respondError(w, http.StatusUnauthorized, "unauthorized", "Sesi login tidak ditemukan.")
		return
	}

	claims, err := authpkg.VerifyToken(handler.cfg.JWTSecret, token, time.Now())
	if err != nil {
		respondError(w, http.StatusUnauthorized, "unauthorized", "Sesi login tidak valid.")
		return
	}

	user, err := handler.findUserByID(r.Context(), claims.UserID)
	if err != nil {
		respondError(w, http.StatusUnauthorized, "unauthorized", "User tidak ditemukan.")
		return
	}

	respondData(w, http.StatusOK, user)
}

func (handler AuthHandler) Refresh(w http.ResponseWriter, r *http.Request) {
	token := bearerToken(r)
	if token == "" {
		respondError(w, http.StatusUnauthorized, "unauthorized", "Sesi login tidak ditemukan.")
		return
	}

	claims, err := authpkg.VerifyToken(handler.cfg.JWTSecret, token, time.Now())
	if err != nil {
		respondError(w, http.StatusUnauthorized, "unauthorized", "Sesi login tidak valid.")
		return
	}

	user, err := handler.findUserByID(r.Context(), claims.UserID)
	if err != nil {
		respondError(w, http.StatusUnauthorized, "unauthorized", "User tidak ditemukan.")
		return
	}

	session, err := handler.issueSession(user)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "token_error", "Gagal memperpanjang sesi.")
		return
	}
	respondData(w, http.StatusOK, session)
}

func (handler AuthHandler) Logout(w http.ResponseWriter, r *http.Request) {
	respondData(w, http.StatusOK, map[string]bool{"ok": true})
}

func (handler AuthHandler) issueSession(user authUserResponse) (loginResponse, error) {
	expiresAt := time.Now().Add(24 * time.Hour)
	token, err := authpkg.IssueToken(handler.cfg.JWTSecret, authpkg.Claims{
		UserID:     user.ID,
		GlobalRole: user.RoleGlobal,
		ExpiresAt:  expiresAt.Unix(),
	})
	if err != nil {
		return loginResponse{}, err
	}
	return loginResponse{Token: token, ExpiresAt: expiresAt, User: user}, nil
}

func (handler AuthHandler) findUserByEmail(ctx context.Context, email string) (authUserResponse, *string, error) {
	const query = `
		SELECT id, name, email, password_hash, avatar_url, role_global
		FROM users
		WHERE lower(email) = $1
	`

	var user authUserResponse
	var passwordHash *string
	err := handler.db.QueryRow(ctx, query, email).Scan(
		&user.ID,
		&user.Name,
		&user.Email,
		&passwordHash,
		&user.AvatarURL,
		&user.RoleGlobal,
	)
	if err != nil {
		return authUserResponse{}, nil, err
	}
	return user, passwordHash, nil
}

func (handler AuthHandler) findUserByID(ctx context.Context, userID string) (authUserResponse, error) {
	const query = `
		SELECT id, name, email, avatar_url, role_global
		FROM users
		WHERE id = $1
	`

	var user authUserResponse
	err := handler.db.QueryRow(ctx, query, userID).Scan(
		&user.ID,
		&user.Name,
		&user.Email,
		&user.AvatarURL,
		&user.RoleGlobal,
	)
	if err == pgx.ErrNoRows {
		return authUserResponse{}, err
	}
	if err != nil {
		return authUserResponse{}, err
	}
	return user, nil
}

func bearerToken(r *http.Request) string {
	header := r.Header.Get("Authorization")
	token := strings.TrimPrefix(header, "Bearer ")
	if token == header {
		return ""
	}
	return strings.TrimSpace(token)
}
