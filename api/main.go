package main

import (
	"fmt"
	"net/http"
)

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "Hello World from TrackTheBill.com on Hetzner!")
	})

	fmt.Println("Server starting on :8080...")
	http.ListenAndServe(":8080", mux)
}
