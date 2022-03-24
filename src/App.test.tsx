import { render, screen } from '@testing-library/react'

import App from './App'

test('renders Connect link', () => {
  render(<App />)
  const linkElement = screen.getAllByText(/Connect/i)
  expect(linkElement.length).toBe(2)
})
