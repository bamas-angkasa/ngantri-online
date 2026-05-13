package auth

import (
	"testing"
	"time"

	"ngantri/backend/internal/domain"
)

func TestIssueAndVerifyToken(t *testing.T) {
	now := time.Unix(100, 0)
	token, err := IssueToken("secret", Claims{
		UserID:     "user-1",
		GlobalRole: domain.GlobalRoleCustomer,
		ExpiresAt:  now.Add(time.Hour).Unix(),
	})
	if err != nil {
		t.Fatal(err)
	}

	claims, err := VerifyToken("secret", token, now)
	if err != nil {
		t.Fatal(err)
	}
	if claims.UserID != "user-1" {
		t.Fatalf("expected user-1, got %s", claims.UserID)
	}
}

func TestVerifyTokenRejectsExpiredToken(t *testing.T) {
	now := time.Unix(100, 0)
	token, err := IssueToken("secret", Claims{
		UserID:     "user-1",
		GlobalRole: domain.GlobalRoleCustomer,
		ExpiresAt:  now.Add(-time.Second).Unix(),
	})
	if err != nil {
		t.Fatal(err)
	}

	if _, err := VerifyToken("secret", token, now); err == nil {
		t.Fatal("expected expired token error")
	}
}
