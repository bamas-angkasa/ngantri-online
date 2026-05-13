package config

import (
	"bufio"
	"os"
	"strings"
)

type Config struct {
	HTTPAddr         string
	DatabaseURL      string
	JWTSecret        string
	GoogleClientID   string
	GoogleSecret     string
	GoogleCallback   string
	PublicWebBaseURL string
	PublicAPIBaseURL string
	Environment      string
}

func Load() Config {
	loadDotEnv(".env")
	loadDotEnv("../.env")

	return Config{
		HTTPAddr:         getEnv("HTTP_ADDR", ":8080"),
		DatabaseURL:      getEnv("DATABASE_URL", "postgres://postgres:postgres@localhost:5432/ngantri?sslmode=disable"),
		JWTSecret:        getEnv("JWT_SECRET", "dev-secret-change-me"),
		GoogleClientID:   getEnv("GOOGLE_CLIENT_ID", ""),
		GoogleSecret:     getEnv("GOOGLE_CLIENT_SECRET", ""),
		GoogleCallback:   getEnv("GOOGLE_CALLBACK_URL", "http://localhost:8080/api/auth/google/callback"),
		PublicWebBaseURL: getEnv("PUBLIC_WEB_BASE_URL", "http://localhost:3000"),
		PublicAPIBaseURL: getEnv("PUBLIC_API_BASE_URL", "http://localhost:8080"),
		Environment:      getEnv("APP_ENV", "development"),
	}
}

func getEnv(key string, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}

func loadDotEnv(path string) {
	file, err := os.Open(path)
	if err != nil {
		return
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}

		key, value, ok := strings.Cut(line, "=")
		if !ok {
			continue
		}

		key = strings.TrimSpace(key)
		if key == "" || os.Getenv(key) != "" {
			continue
		}

		value = strings.TrimSpace(value)
		value = strings.Trim(value, `"'`)
		_ = os.Setenv(key, value)
	}
}
