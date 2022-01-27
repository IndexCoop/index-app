import { render, screen } from '@testing-library/react'

import App from './App'

test('renders Connect link', () => {
  render(<App />)
  const linkElement = screen.getByText(/Connect/i)
  expect(linkElement).toBeInTheDocument()
})
