import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Calculator from './Calculator'
import { calculate } from '../api/calculate'

vi.mock('../api/calculate')

beforeEach(() => {
  vi.clearAllMocks()
})

// types A, picks an operation, types B if given
async function fill(a: string, op: string, b?: string) {
  await userEvent.type(screen.getByLabelText('A'), a)
  await userEvent.click(screen.getByRole('button', { name: op }))
  if (b !== undefined) {
    await userEvent.type(screen.getByLabelText('B'), b)
  }
}

async function pressEquals() {
  await userEvent.click(screen.getByRole('button', { name: /calculate/i }))
}

describe('Calculator', () => {
  it('shows the result of a calculation', async () => {
    vi.mocked(calculate).mockResolvedValue(5)
    render(<Calculator />)

    await fill('2', '+', '3')
    await pressEquals()

    expect(await screen.findByText('5')).toBeInTheDocument()
    expect(calculate).toHaveBeenCalledWith({ operation: 'add', a: 2, b: 3 })
  })

  it('rounds floating-point noise in the display', async () => {
    vi.mocked(calculate).mockResolvedValue(0.30000000000000004)
    render(<Calculator />)

    await fill('0.1', '+', '0.2')
    await pressEquals()

    expect(await screen.findByText('0.3')).toBeInTheDocument()
  })

  it('disables operation buttons until A has a value', async () => {
    render(<Calculator />)

    expect(screen.getByRole('button', { name: '+' })).toBeDisabled()

    await userEvent.type(screen.getByLabelText('A'), '2')

    expect(screen.getByRole('button', { name: '+' })).toBeEnabled()
  })

  it('shows an error when A is empty and does not call the API', async () => {
    render(<Calculator />)

    await pressEquals()

    expect(screen.getByText('A is an invalid number')).toBeInTheDocument()
    expect(calculate).not.toHaveBeenCalled()
  })

  it('shows an error when A is not a number', async () => {
    render(<Calculator />)

    await userEvent.type(screen.getByLabelText('A'), 'abc')
    await pressEquals()

    expect(screen.getByText('A is an invalid number')).toBeInTheDocument()
    expect(calculate).not.toHaveBeenCalled()
  })

  it('shows an error when no operation is chosen', async () => {
    render(<Calculator />)

    await userEvent.type(screen.getByLabelText('A'), '2')
    await pressEquals()

    expect(screen.getByText('Choose an operation')).toBeInTheDocument()
    expect(calculate).not.toHaveBeenCalled()
  })

  it('shows an error when B is not a number', async () => {
    render(<Calculator />)

    await fill('2', '+', 'abc')
    await pressEquals()

    expect(screen.getByText('B is an invalid number')).toBeInTheDocument()
    expect(calculate).not.toHaveBeenCalled()
  })

  it('hides the B input for sqrt and sends no b', async () => {
    vi.mocked(calculate).mockResolvedValue(4)
    render(<Calculator />)

    await fill('16', '√')

    expect(screen.queryByLabelText('B')).toBeNull()

    await pressEquals()

    expect(await screen.findByText('4')).toBeInTheDocument()
    expect(calculate).toHaveBeenCalledWith({ operation: 'sqrt', a: 16, b: undefined })
  })

  it('shows the error message when the API rejects', async () => {
    vi.mocked(calculate).mockRejectedValue(new Error('division by zero'))
    render(<Calculator />)

    await fill('4', '÷', '0')
    await pressEquals()

    expect(await screen.findByText('division by zero')).toBeInTheDocument()
  })

  it('clears everything when C is pressed', async () => {
    vi.mocked(calculate).mockResolvedValue(5)
    render(<Calculator />)

    await fill('2', '+', '3')
    await pressEquals()
    await screen.findByText('5')

    await userEvent.click(screen.getByRole('button', { name: 'C' }))

    expect(screen.getByLabelText('A')).toHaveValue('')
    expect(screen.queryByText('5')).toBeNull()
  })
})