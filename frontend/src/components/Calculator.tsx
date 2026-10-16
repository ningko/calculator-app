import { useState } from "react";
import { calculate } from "../api/calculate";
import type { Operation } from "../types";

function Calculator() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [operation, setOperation] = useState<Operation | null>(null);
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const operations: { value: Operation; label: string }[] = [
    { value: "add", label: "+" },
    { value: "subtract", label: "−" },
    { value: "multiply", label: "×" },
    { value: "divide", label: "÷" },
    { value: "power", label: "xʸ" },
    { value: "sqrt", label: "√" },
    { value: "percent", label: "%" },
  ];

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (a.trim() === "" || isNaN(Number(a))) {
      setError("A is an invalid number");
      return;
    }

    if (operation === null) {
      setError("Choose an operation");
      return;
    }

    if (operation !== "sqrt" && (b.trim() === "" || isNaN(Number(b)))) {
      setError("B is an invalid number");
      return;
    }

    try {
      const value = await calculate({
        operation,
        a: Number(a),
        b: operation === "sqrt" ? undefined : Number(b),
      });
      setResult(value);
    } catch (err) {
      setError(err instanceof Error ? err.message : "something went wrong");
    }
  }

  function handleClear() {
    setA("");
    setB("");
    setOperation("add");
    setResult(null);
    setError(null);
  }

  const displayResult = result === null ? null : Number(result.toFixed(10));

  const symbol = operations.find((op) => op.value === operation)?.label;

  return (
    <>
      <div className="calculator">
        <form className="calculator-form" onSubmit={handleSubmit}>
          <div className="display">
            {displayResult !== null ? (
              <div className="display-result">{displayResult}</div>
            ) : (
              <>
                <input
                  aria-label="A"
                  placeholder="0"
                  type="text"
                  inputMode="decimal"
                  style={{ width: `${Math.max(a.length, 1)}ch` }}
                  value={a}
                  onChange={(e) => setA(e.target.value)}
                />
                {operation !== null && (
                  <span className="display-op">{symbol}</span>
                )}
                {operation !== null && operation !== "sqrt" && (
                  <input
                    aria-label="B"
                    placeholder="0"
                    type="text"
                    inputMode="decimal"
                    style={{ width: `${Math.max(b.length, 1)}ch` }}
                    value={b}
                    onChange={(e) => setB(e.target.value)}
                  />
                )}
              </>
            )}
          </div>

          <div className="keypad">
            {operations.map((op) => (
              <button
                key={op.value}
                type="button"
                className={op.value === operation ? "op active" : "op"}
                aria-pressed={op.value === operation}
                disabled={a.trim() === ""}
                onClick={() => {
                  setOperation(op.value);
                  setResult(null);
                }}
              >
                {op.label}
              </button>
            ))}
            <button type="button" className="clear" onClick={handleClear}>
              C
            </button>
            <button type="submit" className="equals" aria-label="Calculate">
              =
            </button>
          </div>
        </form>

        {error && <p className="error">{error}</p>}
      </div>
    </>
  );
}

export default Calculator;
