package main

import (
	"calculator/calculator"
	"encoding/json"
	"fmt"
	"net/http"
)

type calculateRequest struct {
	Operation string   `json:"operation"`
	A         *float64 `json:"a"`
	B         *float64 `json:"b"`
}

type calculateResponse struct {
	Result float64 `json:"result"`
}

type errorResponse struct {
	Error string `json:"error"`
}

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("POST /api/calculate", calculate)

	fmt.Println("listening on port 8080")
	http.ListenAndServe(":8080", mux)
}

func writeJSON(w http.ResponseWriter, status int, data any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

func calculate(w http.ResponseWriter, r *http.Request) {
	var req calculateRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		errRes := errorResponse{Error: "invalid JSON"}
		writeJSON(w, http.StatusBadRequest, errRes)
		return
	}

	if req.A == nil {
		writeJSON(w, http.StatusBadRequest, errorResponse{Error: "a is required"})
		return
	}

	if req.Operation != "sqrt" && req.B == nil {
		writeJSON(w, http.StatusBadRequest, errorResponse{Error: "b is required"})
		return
	}

	var result float64

	switch req.Operation {
	case "add":
		result = calculator.Add(*req.A, *req.B)
	case "subtract":
		result = calculator.Subtract(*req.A, *req.B)
	case "multiply":
		result = calculator.Multiply(*req.A, *req.B)
	case "divide":
		result, err = calculator.Divide(*req.A, *req.B)

		if err != nil {
			writeJSON(w, http.StatusBadRequest, errorResponse{Error: err.Error()})
			return
		}
	case "power":
		result, err = calculator.Power(*req.A, *req.B)

		if err != nil {
			writeJSON(w, http.StatusBadRequest, errorResponse{Error: err.Error()})
			return
		}
	case "sqrt":
		result, err = calculator.Sqrt(*req.A)

		if err != nil {
			writeJSON(w, http.StatusBadRequest, errorResponse{Error: err.Error()})
			return
		}
	case "percent":
		result = calculator.Percent(*req.A, *req.B)
	default:
		writeJSON(w, http.StatusBadRequest, errorResponse{Error: "unknown operation"})
		return
	}

	res := calculateResponse{Result: result}
	writeJSON(w, http.StatusOK, res)
}
