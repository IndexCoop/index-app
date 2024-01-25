import { formatUnits, parseUnits } from 'viem'

import { getBestQuote } from './best-quote'
import { QuoteType } from '../types'

describe('getBestQuote', () => {
  it('returns 0x when it is the only quote', async () => {
    const expectedQuote = QuoteType.zeroex
    const bestQuote = getBestQuote(1, null, 1, null)
    expect(bestQuote).toEqual(expectedQuote)
  })

  it('returns flashmint when it is the only quote', async () => {
    const expectedQuote = QuoteType.flashmint
    const bestQuote = getBestQuote(null, 1, null, 1)
    expect(bestQuote).toEqual(expectedQuote)
  })

  it('returns best quote - when 0x is the best quote', async () => {
    const expectedQuote = QuoteType.zeroex
    const bestQuote = getBestQuote(10, 10, 9.8, 9.7)
    expect(bestQuote).toEqual(expectedQuote)
  })

  it('returns best quote - when flashmint is the best quote', async () => {
    const expectedQuote = QuoteType.flashmint
    const bestQuote = getBestQuote(10, 9.9, 5, 9.7)
    expect(bestQuote).toEqual(expectedQuote)
  })
})
