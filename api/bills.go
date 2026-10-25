package main

import (
	"context"
	"encoding/json"
	"log/slog"
	"net/http"
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

type BillGetter interface {
	GetBills(ctx context.Context) ([]Bill, error)
}

func handleGetBills(getter BillGetter) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		bills, err := getter.GetBills(r.Context())
		if err != nil {
			slog.Error("failed to get bills", "err", err)
			http.Error(w, "failed to fetch bills", http.StatusBadGateway)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(bills); err != nil {
			slog.Error("failed to encode bills response", "err", err)
		}
	}
}
