package main

import (
	"log"
	"net/http"

	"ngantri/backend/internal/config"
	httpdelivery "ngantri/backend/internal/delivery/http"
)

func main() {
	cfg := config.Load()
	router := httpdelivery.NewRouter(cfg)

	log.Printf("ngantri api listening on %s", cfg.HTTPAddr)
	if err := http.ListenAndServe(cfg.HTTPAddr, router); err != nil {
		log.Fatal(err)
	}
}
