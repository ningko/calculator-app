import { describe, it, expect, vi, afterEach } from 'vitest'
import { calculate } from './calculate'

afterEach(() => {
  vi.unstubAllGlobals()
})

function mockFetch(body: unknown, status = 200) {
  const fake = vi.fn().mockResolvedValue({
    ok: status < 400,
    status,
    json: async () => body,
  })
  vi.stubGlobal('fetch', fake)
  return fake
}

describe('calculate', () => {
  it('returns the result on success', async () => {
    mockFetch({ result: 5 })

    const result = await calculate({ operation: 'add', a: 2, b: 3 })

    expect(result).toBe(5)
  })

  it('sends a POST request with the JSON body', async () => {
    const fake = mockFetch({ result: 5 })
    const req = { operation: 'add' as const, a: 2, b: 3 }

    await calculate(req)

    expect(fake).toHaveBeenCalledWith('/api/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    })
  })

  it('throws the backend error message on failure', async () => {
    mockFetch({ error: 'division by zero' }, 400)

    await expect(calculate({ operation: 'divide', a: 4, b: 0 })).rejects.toThrow('division by zero')
  })
})