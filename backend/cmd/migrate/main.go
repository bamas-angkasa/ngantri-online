package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/pressly/goose/v3"

	"ngantri/backend/internal/config"
)

const migrationsDir = "migrations"

func main() {
	if len(os.Args) < 2 {
		log.Fatalf("usage: go run ./cmd/migrate <up|down|status|redo|reset>")
	}

	cfg := config.Load()

	db, err := sql.Open("pgx", cfg.DatabaseURL)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	if err := goose.SetDialect("postgres"); err != nil {
		log.Fatal(err)
	}

	command := os.Args[1]
	switch command {
	case "up":
		err = goose.Up(db, migrationsDir)
	case "down":
		err = goose.Down(db, migrationsDir)
	case "status":
		err = goose.Status(db, migrationsDir)
	case "redo":
		err = goose.Redo(db, migrationsDir)
	case "reset":
		err = goose.Reset(db, migrationsDir)
	default:
		err = fmt.Errorf("unknown migration command %q", command)
	}
	if err != nil {
		log.Fatal(err)
	}
}
