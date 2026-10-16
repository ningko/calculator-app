package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestCalculate(t *testing.T) {
	tests := []struct {
		name       string
		body       string
		wantStatus int
		wantResult float64
		wantError  string
	}{
		{"add", `{"operation":"add","a":2,"b":3}`, http.StatusOK, 5, ""},
		{"subtract", `{"operation":"subtract","a":2,"b":3}`, http.StatusOK, -1, ""},
		{"multiply", `{"operation":"multiply","a":2,"b":3}`, http.StatusOK, 6, ""},
		{"divide", `{"operation":"divide","a":12,"b":3}`, http.StatusOK, 4, ""},
		{"power", `{"operation":"power","a":2,"b":3}`, http.StatusOK, 8, ""},
		{"sqrt without b", `{"operation":"sqrt","a":16}`, http.StatusOK, 4, ""},
		{"percent", `{"operation":"percent","a":50,"b":10}`, http.StatusOK, 5, ""},

		{"divide by zero", `{"operation":"divide","a":2,"b":0}`, http.StatusBadRequest, 0, "division by zero"},
		{"missing b", `{"operation":"add","a":2}`, http.StatusBadRequest, 0, "b is required"},
		{"missing a", `{"operation":"add","b":2}`, http.StatusBadRequest, 0, "a is required"},
		{"missing a on sqrt", `{"operation":"sqrt"}`, http.StatusBadRequest, 0, "a is required"},
		{"sqrt of negative", `{"operation":"sqrt","a":-4}`, http.StatusBadRequest, 0, "invalid input"},
		{"power zero to negative", `{"operation":"power","a":0,"b":-1}`, http.StatusBadRequest, 0, "invalid input"},
		{"unknown operation", `{"operation":"asdasd","a":2,"b":3}`, http.StatusBadRequest, 0, "unknown operation"},
		{"garbage json", `asdf`, http.StatusBadRequest, 0, "invalid JSON"},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			req := httptest.NewRequest("POST", "/api/calculate", strings.NewReader(tc.body))
			rr := httptest.NewRecorder()

			calculate(rr, req)

			if rr.Code != tc.wantStatus {
				t.Fatalf("status = %d, want %d", rr.Code, tc.wantStatus)
			}

			if tc.wantError != "" {
				var got errorResponse
				json.NewDecoder(rr.Body).Decode(&got)
				if got.Error != tc.wantError {
					t.Errorf("error = %q, want %q", got.Error, tc.wantError)
				}
				return
			}

			var got calculateResponse
			json.NewDecoder(rr.Body).Decode(&got)
			if got.Result != tc.wantResult {
				t.Errorf("result = %v, want %v", got.Result, tc.wantResult)
			}
		})
	}
}
