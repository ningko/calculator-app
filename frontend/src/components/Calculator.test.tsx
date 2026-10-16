import { it, expect, vi } from 'vitest'
import { calculate } from '../api/calculate'
import Calculator from './Calculator'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'

vi.mock('../api/calculate')

it('shows result', async() => {
    vi.mocked(calculate).mockResolvedValue(5)
    render(<Calculator />)

    await userEvent.type(screen.getAllByRole('textbox')[0], '2')
    await userEvent.type(screen.getAllByRole('textbox')[1], '3')
    await userEvent.click(screen.getByRole('button', { name: /calculate/i }))

    expect(await screen.findByText(/5/)).toBeInTheDocument()
})