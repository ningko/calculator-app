package calculator

import (
	"math"
	"testing"
)

// used for cases where the expected value can't be represented exactly in floating point
// e.g. "Add", test case "decimals"
func almostEqual(a, b float64) bool {
	return math.Abs(a-b) < 1e-9
}

func TestAdd(t *testing.T) {
	tests := []struct {
		name string
		a, b float64
		want float64
	}{
		{"positives", 10, 2, 12},
		{"zero", 0, 5, 5},
		{"negatives", -3, -4, -7},
		{"decimals", 0.1, 0.2, 0.3},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			got := Add(tc.a, tc.b)

			if !almostEqual(got, tc.want) {
				t.Errorf("Add(%v, %v) = %v, want %v", tc.a, tc.b, got, tc.want)
			}
		})
	}
}

func TestSubtract(t *testing.T) {
	tests := []struct {
		name string
		a, b float64
		want float64
	}{
		{"positives", 10, 2, 8},
		{"zero", 0, 5, -5},
		{"negatives", -3, -4, 1},
		{"decimals", 0.3, 0.1, 0.2},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			got := Subtract(tc.a, tc.b)

			if !almostEqual(got, tc.want) {
				t.Errorf("Subtract(%v, %v) = %v, want %v", tc.a, tc.b, got, tc.want)
			}
		})
	}
}

func TestMultiply(t *testing.T) {
	tests := []struct {
		name string
		a, b float64
		want float64
	}{
		{"positives", 10, 2, 20},
		{"zero", 0, 5, 0},
		{"negatives", -3, -4, 12},
		{"decimals", 0.1, 3, 0.3},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			got := Multiply(tc.a, tc.b)

			if !almostEqual(got, tc.want) {
				t.Errorf("Multiply(%v, %v) = %v, want %v", tc.a, tc.b, got, tc.want)
			}
		})
	}
}

func TestDivide(t *testing.T) {
	tests := []struct {
		name    string
		a, b    float64
		want    float64
		wantErr error
	}{
		{"positives", 10, 2, 5, nil},
		{"negatives", -3, -4, 0.75, nil},
		{"decimals", 7, 2, 3.5, nil},
		{"negative divisor", 0, 5, 0, nil},
		{"by zero", 10, 0, 0, ErrDivisionByZero},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			got, err := Divide(tc.a, tc.b)

			if err != tc.wantErr {
				t.Fatalf("Divide(%v, %v) = error %v, want error %v", tc.a, tc.b, err, tc.wantErr)
			}

			if !almostEqual(got, tc.want) {
				t.Errorf("Divide(%v, %v) = %v, want %v", tc.a, tc.b, got, tc.want)
			}
		})
	}
}

func TestPower(t *testing.T) {
	tests := []struct {
		name    string
		a, b    float64
		want    float64
		wantErr error
	}{
		{"positive exponent", 2, 3, 8, nil},
		{"zero exponent", 5, 0, 1, nil},
		{"negative exponent", 2, -1, 0.5, nil},
		{"fractional exponent", 9, 0.5, 3, nil},
		{"zero and negative", 0, -1, 0, ErrInvalidInput},
		{"negative base and fractional exponent", -8, 0.5, 0, ErrInvalidInput},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			got, err := Power(tc.a, tc.b)

			if err != tc.wantErr {
				t.Fatalf("Power(%v, %v) error %v, want error %v", tc.a, tc.b, err, tc.wantErr)
			}

			if !almostEqual(got, tc.want) {
				t.Errorf("Power(%v, %v) = %v, want %v", tc.a, tc.b, got, tc.want)
			}
		})
	}
}

func TestSqrt(t *testing.T) {
	tests := []struct {
		name    string
		a       float64
		want    float64
		wantErr error
	}{
		{"perfect square", 9, 3, nil},
		{"zero", 0, 0, nil},
		{"nonperfect", 2, 1.4142135623730951, nil},
		{"negative", -4, 0, ErrInvalidInput},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			got, err := Sqrt(tc.a)

			if err != tc.wantErr {
				t.Fatalf("Sqrt(%v) error %v, want error %v", tc.a, err, tc.wantErr)
			}

			if !almostEqual(got, tc.want) {
				t.Errorf("Sqrt(%v) = %v, want %v", tc.a, got, tc.want)
			}
		})
	}
}

func TestPercent(t *testing.T) {
	tests := []struct {
		name string
		a, b float64
		want float64
	}{
		{"positives", 10, 2, 0.2},
		{"zero", 0, 5, 0},
		{"negatives", -3, -4, 0.12},
		{"decimals", 0.1, 0.2, 0.0002},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			got := Percent(tc.a, tc.b)

			if !almostEqual(got, tc.want) {
				t.Errorf("Percent(%v, %v) = %v, want %v", tc.a, tc.b, got, tc.want)
			}
		})
	}
}
