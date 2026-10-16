export type Operation =
| 'add'
| 'subtract'
| 'multiply'
| 'divide'
| 'power'
| 'sqrt'
| 'percent'

export interface CalculateRequest {
    operation: Operation
    a: number
    b?: number
}

export interface CalculateResponse {
    result: number
}

export interface ErrorResponse {
    error: string
}