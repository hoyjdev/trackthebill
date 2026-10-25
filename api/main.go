package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
)

func main() {
	apiKey := os.Getenv("OPENSTATES_API_KEY")
	if apiKey == "" {
		log.Fatal("OPENSTATES_API_KEY is required")
	}

	openStatesClient := NewOpenStatesClient(apiKey)
	mux := http.NewServeMux()
	mux.HandleFunc("GET /bills", handleGetBills(openStatesClient))

	fmt.Println("Server starting on :8080...")
	http.ListenAndServe(":8080", mux)
}
