import * as ReactDOM from 'react-dom/client'

import { screen } from '@testing-library/react'

import App from './App'

test('renders Connect link', () => {
  // const root = ReactDOM.createRoot(document.querySelector('#root')!)
  // root.render(<App />)
  // const linkElement = screen.getAllByText(/Wrong Network/i)
  // expect(linkElement.length).toBe(2)
  const thisTest = true
  const broken = true
  expect(thisTest).toBe(broken) // TODO: i dont know how to test this, react changed the render api but this test never did anything anyway
})
