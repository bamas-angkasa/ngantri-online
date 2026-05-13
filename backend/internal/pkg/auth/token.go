package auth

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"errors"
	"strings"
	"time"

	"ngantri/backend/internal/domain"
)

var ErrInvalidToken = errors.New("invalid token")

type Claims struct {
	UserID     string            `json:"userId"`
	GlobalRole domain.GlobalRole `json:"globalRole"`
	ExpiresAt  int64             `json:"expiresAt"`
}

func IssueToken(secret string, claims Claims) (string, error) {
	payload, err := json.Marshal(claims)
	if err != nil {
		return "", err
	}

	encodedPayload := base64.RawURLEncoding.EncodeToString(payload)
	signature := signTokenPart(secret, encodedPayload)
	return encodedPayload + "." + signature, nil
}

func VerifyToken(secret string, token string, now time.Time) (Claims, error) {
	payload, signature, ok := strings.Cut(token, ".")
	if !ok || payload == "" || signature == "" {
		return Claims{}, ErrInvalidToken
	}

	expectedSignature := signTokenPart(secret, payload)
	if !hmac.Equal([]byte(signature), []byte(expectedSignature)) {
		return Claims{}, ErrInvalidToken
	}

	rawPayload, err := base64.RawURLEncoding.DecodeString(payload)
	if err != nil {
		return Claims{}, ErrInvalidToken
	}

	var claims Claims
	if err := json.Unmarshal(rawPayload, &claims); err != nil {
		return Claims{}, ErrInvalidToken
	}
	if claims.UserID == "" || claims.ExpiresAt <= now.Unix() {
		return Claims{}, ErrInvalidToken
	}

	return claims, nil
}

func signTokenPart(secret string, payload string) string {
	mac := hmac.New(sha256.New, []byte(secret))
	_, _ = mac.Write([]byte(payload))
	return base64.RawURLEncoding.EncodeToString(mac.Sum(nil))
}
