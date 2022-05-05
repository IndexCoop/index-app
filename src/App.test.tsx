import { render, screen } from '@testing-library/react'

import App from './App'

test('renders Connect link', () => {
  render(<App />)
  const linkElement = screen.getAllByText(/Wrong Network/i)
  expect(linkElement.length).toBe(2)
})
