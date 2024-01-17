import { shouldReturnQuote } from './should-return-quote'

describe('getIndexTokenAmount - redeeming', () => {
  it('returns false when quote amount is too big', async () => {
    const inputTokenAmount = BigInt(1000)
    const inputTokenAmountQuote = BigInt(1010)
    const { shouldReturn, diff } = shouldReturnQuote(
      inputTokenAmount,
      inputTokenAmountQuote
    )
    expect(shouldReturn).toBe(false)
    expect(diff).toBe(1)
  })

  it('returns true when quote amount is too lower than input token amount', async () => {
    const inputTokenAmount = BigInt(1000)
    const inputTokenAmountQuote = BigInt(999)
    const { shouldReturn, diff } = shouldReturnQuote(
      inputTokenAmount,
      inputTokenAmountQuote
    )
    expect(shouldReturn).toBe(true)
    expect(diff).toBe(-0.1)
  })

  it('returns false when quote amount is above threshold (1.5%)', async () => {
    const inputTokenAmount = BigInt(1000)
    const inputTokenAmountQuote = BigInt(900)
    const { shouldReturn, diff } = shouldReturnQuote(
      inputTokenAmount,
      inputTokenAmountQuote
    )
    expect(shouldReturn).toBe(false)
    expect(diff).toBe(-10)
  })
})
