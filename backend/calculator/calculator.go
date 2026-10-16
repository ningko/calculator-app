package calculator

import (
	"errors"
	"math"
)

var ErrDivisionByZero = errors.New("division by zero")
var ErrInvalidInput = errors.New("invalid input")

func Add(a, b float64) float64 {
	return a + b
}

func Subtract(a, b float64) float64 {
	return a - b
}

func Multiply(a, b float64) float64 {
	return a * b
}

func Divide(a, b float64) (float64, error) {
	if b == 0 {
		return 0, ErrDivisionByZero
	}
	return a / b, nil
}

func Power(a, b float64) (float64, error) {
	result := math.Pow(a, b)
	if math.IsInf(result, 0) || math.IsNaN(result) {
		return 0, ErrInvalidInput
	}
	return result, nil
}

func Sqrt(a float64) (float64, error) {
	if a < 0 {
		return 0, ErrInvalidInput
	}
	return math.Sqrt(a), nil
}

func Percent(a, b float64) float64 {
	return a / 100 * b
}
