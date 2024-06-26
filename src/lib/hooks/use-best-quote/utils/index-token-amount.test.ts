import { formatWei, parseUnits } from '@/lib/utils'

import { getIndexTokenAmount } from './index-token-amount'

describe('getIndexTokenAmount - redeeming', () => {
  it('returns input token amount directly', async () => {
    const isMinting = false
    const expectedIndexTokenAmount = parseUnits('1', 18)
    const indexTokenAmount = getIndexTokenAmount(isMinting, '1', 18, 18, 0, 0)
    expect(indexTokenAmount).toEqual(expectedIndexTokenAmount)
  })
})

describe('getIndexTokenAmount - minting', () => {
  it('returns approx. index token amount', async () => {
    const isMinting = true
    const inputTokenAmount = '1'
    const inputTokenPrice = 2
    const outputTokenPrice = 3
    const indexTokenAmount = getIndexTokenAmount(
      isMinting,
      inputTokenAmount,
      18,
      18,
      inputTokenPrice,
      outputTokenPrice,
    )
    const inputTokenAmountUsd = parseFloat(inputTokenAmount) * inputTokenPrice
    const approxOutputAmount = inputTokenAmountUsd / outputTokenPrice
    const expectedAmount = parseUnits(approxOutputAmount.toString(), 18)
    const indexTokenPriceTotal =
      Number(formatWei(BigInt(indexTokenAmount.toString()), 18)) *
      outputTokenPrice
    expect(indexTokenAmount).toEqual(expectedAmount)
    expect(indexTokenPriceTotal).toBeCloseTo(inputTokenAmountUsd, 1)
  })

  it('returns index token amount with correct decimals for usdc input', async () => {
    const isMinting = true
    const inputTokenAmount = '1'
    const inputTokenPrice = 2
    const outputTokenPrice = 3
    const indexTokenAmount = getIndexTokenAmount(
      isMinting,
      inputTokenAmount,
      6,
      18,
      inputTokenPrice,
      outputTokenPrice,
    )
    const inputTokenTotal = parseFloat(inputTokenAmount) * inputTokenPrice
    const approxOutputAmount = inputTokenTotal / outputTokenPrice
    const expectedAmount = parseUnits(approxOutputAmount.toString(), 18)
    const indexTokenPriceTotal =
      Number(formatWei(BigInt(indexTokenAmount.toString()), 18)) *
      outputTokenPrice
    expect(indexTokenAmount).toEqual(expectedAmount)
    expect(indexTokenPriceTotal).toBeCloseTo(inputTokenTotal, 1)
  })
})
