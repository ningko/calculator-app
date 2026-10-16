import type { CalculateRequest, CalculateResponse, ErrorResponse } from "../types";

export async function calculate(req: CalculateRequest): Promise<number> {
    const res = await fetch('/api/calculate', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(req),
    })

    const data: CalculateResponse | ErrorResponse = await res.json()

    if ('error' in data) {
        throw new Error(data.error)
    }

    return data.result
}

