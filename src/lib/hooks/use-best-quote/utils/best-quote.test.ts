import { QuoteType } from '../types'

import { getBestQuote } from './best-quote'

describe('getBestQuote', () => {
  it('returns Index when it is the only quote', async () => {
    const expectedQuote = QuoteType.index
    const bestQuote = getBestQuote(1, null, 1, null)
    expect(bestQuote).toEqual(expectedQuote)
  })

  it('returns flashmint when it is the only quote', async () => {
    const expectedQuote = QuoteType.flashmint
    const bestQuote = getBestQuote(null, 1, null, 1)
    expect(bestQuote).toEqual(expectedQuote)
  })

  it('returns best quote - when Index API is the best quote', async () => {
    const expectedQuote = QuoteType.index
    const bestQuote = getBestQuote(10, 10, 9.8, 9.7)
    expect(bestQuote).toEqual(expectedQuote)
  })

  it('returns best quote - when flashmint is the best quote', async () => {
    const expectedQuote = QuoteType.flashmint
    const bestQuote = getBestQuote(10, 9.9, 5, 9.7)
    expect(bestQuote).toEqual(expectedQuote)
  })
})
