package main

import (
	"context"
	"log"
	"net/http"

	"ngantri/backend/internal/config"
	httpdelivery "ngantri/backend/internal/delivery/http"
	"ngantri/backend/internal/pkg/database"
)

func main() {
	cfg := config.Load()

	db, err := database.Connect(context.Background(), cfg.DatabaseURL)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	router := httpdelivery.NewRouter(cfg, db)

	log.Printf("ngantri api listening on %s", cfg.HTTPAddr)
	if err := http.ListenAndServe(cfg.HTTPAddr, router); err != nil {
		log.Fatal(err)
	}
}
