package main

import (
	"database/sql"
	"log"
	"os"

	_ "github.com/jackc/pgx/v5/stdlib"

	"ngantri/backend/internal/config"
)

const defaultSeedFile = "seeds/demo.sql"

func main() {
	seedFile := defaultSeedFile
	if len(os.Args) > 1 {
		seedFile = os.Args[1]
	}

	content, err := os.ReadFile(seedFile)
	if err != nil {
		log.Fatal(err)
	}

	cfg := config.Load()
	db, err := sql.Open("pgx", cfg.DatabaseURL)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	if _, err := db.Exec(string(content)); err != nil {
		log.Fatal(err)
	}

	log.Printf("seed executed: %s", seedFile)
}
