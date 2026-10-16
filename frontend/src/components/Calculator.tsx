import { useState } from "react"
import { calculate } from '../api/calculate'
import type { Operation } from "../types"

function Calculator() {
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  const [operation, setOperation] = useState<Operation>('add')
  const [result, setResult] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault()
    setError(null)
    setResult(null)

    if (a.trim() === '' || isNaN(Number(a))) {
        setError('A is an invalid number')
        return
    }

    if (operation !== 'sqrt' && (b.trim() === '' || isNaN(Number(b)))) {
        setError('B is an invalid number')
        return
    }

    try {
        const value = await calculate({
            operation,
            a: Number(a),
            b: operation === 'sqrt' ? undefined : Number(b)
        })
        setResult(value)
    } catch(err) {
        setError(err instanceof Error ? err.message : 'something went wrong')
    }
  }

const displayResult = result === null ? null : Number(result.toFixed(10))

  return (
    <>
      <h1>Calculator</h1>
      <form onSubmit={handleSubmit}>
        <div id="operation">
            <select value={operation} onChange={(e) => setOperation(e.target.value as Operation)}>
                <option value={"add"}>+</option>
                <option value={"subtract"}>-</option>
                <option value={"multiply"}>*</option>
                <option value={"divide"}>/</option>
                <option value={"power"}>xʸ</option>
                <option value={"sqrt"}>√n</option>
                <option value={"percent"}>%</option>
            </select>
         </div>
      <input value={a} type="text" inputMode="decimal" onChange={(e) => setA(e.target.value)}></input>
      {operation != 'sqrt' && (
        <input value={b} type="text" inputMode="decimal" onChange={(e) => setB(e.target.value)}></input>
      )}
      <button type="submit">Calculate</button>
      </form>

      {error && <p>{error}</p>}
      {displayResult !== null && <p>{result}</p>}
    </>
  )
}

export default Calculator
