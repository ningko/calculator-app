# calculator-app

Calculator with a React + TypeScript frontend and a Go REST API.

## Project structure
```
calculator-app/
├── backend/
│   ├── main.go
│   ├── main_test.go                  
│   └── calculator/
│       ├── calculator.go
│       └── calculator_test.go        
└── frontend/src/
    ├── api/
    │   ├── calculate.ts              
    │   └── calculate.test.ts         
    └── components/
        ├── Calculator.tsx            
        └── Calculator.test.tsx       
```
## Setup
#### Prerequisites:
- go1.25.6
- Node v22.23.3
- OPTIONAL: Docker

#### Running the project
- **Backend:** `cd backend && go run main.go`
    - listens on port `8080`
- **Frontend:** `cd frontend && npm install && npm run dev`
    - Vite proxies `/api` to port 8080
- **Docker:** 
    - `docker build -t calculator-app .`
    - `docker run --rm -p 8080:8080 calculator-app`
    - might need `sudo` on Linux

## Documentation
#### POST /api/calculate
| Operation | Request Fields | Meaning |
| --- | --- | --- |
| `add`, `subtract`, `multiply`, `divide` | `a, b` | `a ∘ b` |
| `power` | `a, b` | `a` to the power `b` |
| `sqrt` | `a` | square root of `a` |
| `percent` | `a, b` | `a` percent of `b` |

#### Error messages
The handler can return error messages such as:
- `a is required` | `b is required` for missing fields
- `unknown operation` for operations not matching the expected in calls to the API
- `division by zero` when `b == 0`
- `invalid input` for `sqrt` of a negative or overflowing/undefined `power` result

## Examples
```
curl -X POST localhost:8080/api/calculate -d '{"operation":"add","a":2,"b":3}'
# 200 {"result":5}

curl -X POST localhost:8080/api/calculate -d '{"operation":"divide","a":4,"b":0}'
# 400 {"error":"division by zero"}

curl -X POST localhost:8080/api/calculate -d '{"operation":"sqrt","a":16}'
# 200 {"result":4}
```

## Tests and coverage
- **backend:** `cd backend && go test -cover ./...`
```
calculator-app/backend$ go test -cover ./...
ok      calculator      (cached)        coverage: 88.1% of statements
ok      calculator/calculator   (cached)        coverage: 100.0% of statements
```
- **frontend:** `cd frontend && npm test` and `npm run coverage`
```
calculator-app/frontend$ npm test

> frontend@0.0.0 test
> vitest run


 RUN  v5.0.5 /calculator-app/frontend

 ✓ src/api/calculate.test.ts (3 tests) 5ms
 ✓ src/components/Calculator.test.tsx (10 tests) 467ms

 Test Files  2 passed (2)
      Tests  13 passed (13)
   Start at  18:02:47
   Duration  1.02s (environment 51%, tests 34%, setup 6%, transform 5%, import 3%, worker 1%)

calculator-app/frontend$ npm run coverage

> frontend@0.0.0 coverage
> vitest run --coverage


 RUN  v5.0.5 /calculator-app/frontend
      Coverage enabled with v8

 ✓ src/api/calculate.test.ts (3 tests) 5ms
 ✓ src/components/Calculator.test.tsx (10 tests) 564ms

 Test Files  2 passed (2)
      Tests  13 passed (13)
   Start at  18:02:43
   Duration  1.21s (environment 46%, tests 36%, setup 7%, transform 4%, import 3%, worker 3%)

 % Coverage report from v8
-----------------|---------|----------|---------|---------|-------------------
File             | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-----------------|---------|----------|---------|---------|-------------------
All files        |     100 |    96.66 |     100 |     100 |                   
 api             |     100 |      100 |     100 |     100 |                   
  calculate.ts   |     100 |      100 |     100 |     100 |                   
 components      |     100 |    96.42 |     100 |     100 |                   
  Calculator.tsx |     100 |    96.42 |     100 |     100 | 50                
-----------------|---------|----------|---------|---------|-------------------
```

## Design decisions and assumptions
- One binary operation per request (unary for `sqrt`)
- Calculator logic is separate from the HTTP handler so the math is testable with plain function calls
- There are pointer fields in the request (`*float64`) so a missing `b` is distinguishable from `b:0`
- Sentinel errors (`ErrDivisionByZero`, `ErrInvalidInput`) returned from the `calculator` package, which the handler turns into `400` responses
- `power` rejects `Inf` and `NaN` results because they can't be interpreted by JSON

## AI usage
AI was used as a tutor/reviewer, specifically to map previous JavaScript/Express API knowledge onto Go (handlers vs. Express routes, JSON decoding, pointers, error handling, table-driven tests) and to explain test errors.