package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type OpenStatesClient struct {
	apiKey     string
	httpClient *http.Client
}

func NewOpenStatesClient(apiKey string) *OpenStatesClient {
	return &OpenStatesClient{
		apiKey:     apiKey,
		httpClient: &http.Client{Timeout: 10 * time.Second},
	}
}

type billsResponse struct {
	Results []Bill `json:"results"`
}

func (c *OpenStatesClient) GetBills(ctx context.Context) ([]Bill, error) {
	req, err := http.NewRequestWithContext(
		ctx,
		http.MethodGet,
		"https://v3.openstates.org/bills?jurisdiction=California&per_page=10",
		nil,
	)
	if err != nil {
		return nil, fmt.Errorf("creating request: %w", err)
	}
	req.Header.Set("X-API-KEY", c.apiKey)

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("requesting OpenStates: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("OpenStates returned status %d", resp.StatusCode)
	}

	data := billsResponse{Results: []Bill{}}
	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		return nil, fmt.Errorf("decoding OpenStates response: %w", err)
	}

	return data.Results, nil
}
