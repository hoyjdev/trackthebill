package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"
)

type Bill struct {
	ID                      string `json:"id"`
	Identifier              string `json:"identifier"`
	Title                   string `json:"title"`
	Session                 string `json:"session"`
	LatestActionDescription string `json:"latest_action_description"`
	LatestActionDate        string `json:"latest_action_date"`
	OpenStatesURL           string `json:"openstates_url"`
}

type openStatesResponse struct {
	Results []Bill `json:"results"`
}

func main() {
	apiKey := os.Getenv("OPENSTATES_API_KEY")
	client := &http.Client{Timeout: 10 * time.Second}

	mux := http.NewServeMux()
	mux.HandleFunc("GET /bills", func(w http.ResponseWriter, r *http.Request) {
		req, err := http.NewRequestWithContext(
			r.Context(),
			http.MethodGet,
			"https://v3.openstates.org/bills?jurisdiction=California&per_page=10",
			nil,
		)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		req.Header.Set("X-API-KEY", apiKey)

		resp, err := client.Do(req)
		if err != nil {
			http.Error(w, "failed to reach OpenStates: "+err.Error(), http.StatusBadGateway)
			return
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK {
			http.Error(w, fmt.Sprintf("OpenStates returned %d", resp.StatusCode), http.StatusBadGateway)
			return
		}

		var data openStatesResponse
		if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
			http.Error(w, "invalid JSON from OpenStates: "+err.Error(), http.StatusBadGateway)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(data.Results)
	})

	fmt.Println("Server starting on :8080...")
	http.ListenAndServe(":8080", mux)
}
