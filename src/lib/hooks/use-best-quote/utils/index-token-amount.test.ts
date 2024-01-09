import { formatUnits } from 'viem'

import { ZeroExData } from '@/lib/utils/api/zeroex-utils'
import { toWei } from '@/lib/utils'

import { maxPriceImpact } from '../config'
import { getIndexTokenAmount } from './index-token-amount'

describe('getIndexTokenAmount - redeeming', () => {
  it('returns input token amount directly', async () => {
    const isMinting = false
    const expectedIndexTokenAmount = toWei('1', 18)
    const indexTokenAmount = getIndexTokenAmount(
      isMinting,
      '1',
      18,
      18,
      0,
      0,
      null
    )
    expect(indexTokenAmount.toString()).toEqual(
      expectedIndexTokenAmount.toString()
    )
  })
})

describe('getIndexTokenAmount - minting', () => {
  const outputAdjust = 0.99

  it('returns buy amount (0x data)', async () => {
    const isMinting = true
    const dexData = {
      buyAmount: '2000000000000000000',
    } as ZeroExData
    const indexTokenAmount = getIndexTokenAmount(
      isMinting,
      '1',
      18,
      18,
      0,
      0,
      dexData
    )
    expect(indexTokenAmount.toString()).toEqual(dexData.buyAmount.toString())
  })

  it('returns buy amount (0x data) if price impact is below max', async () => {
    const isMinting = true
    const dexData = {
      estimatedPriceImpact: '0.1',
      buyAmount: '2000000000000000000',
    } as ZeroExData
    const indexTokenAmount = getIndexTokenAmount(
      isMinting,
      '1',
      18,
      18,
      0,
      0,
      dexData
    )
    expect(indexTokenAmount.toString()).toEqual(dexData.buyAmount.toString())
  })

  it('returns approx amount if price impact is above max', async () => {
    const isMinting = true
    const inputTokenAmount = '1'
    const inputTokenPrice = 2
    const outputTokenPrice = 3
    const dexData = {
      estimatedPriceImpact: maxPriceImpact.toString(),
      buyAmount: '2000000000000000000',
    } as ZeroExData
    const indexTokenAmount = getIndexTokenAmount(
      isMinting,
      inputTokenAmount,
      18,
      18,
      inputTokenPrice,
      outputTokenPrice,
      dexData
    )
    const inputTokenTotal = parseFloat(inputTokenAmount) * inputTokenPrice
    const approxOutputAmount =
      (inputTokenTotal / outputTokenPrice) * outputAdjust
    const expectedAmount = toWei(approxOutputAmount, 18)
    const indexTokenPriceTotal =
      Number(formatUnits(BigInt(indexTokenAmount.toString()), 18)) *
      outputTokenPrice
    expect(indexTokenAmount.toString()).toEqual(expectedAmount.toString())
  })

  it('returns approx amount if no 0x data', async () => {
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
      null
    )
    const inputTokenTotal = parseFloat(inputTokenAmount) * inputTokenPrice
    const approxOutputAmount =
      (inputTokenTotal / outputTokenPrice) * outputAdjust
    const expectedAmount = toWei(approxOutputAmount, 18)
    const indexTokenPriceTotal =
      Number(formatUnits(BigInt(indexTokenAmount.toString()), 18)) *
      outputTokenPrice
    expect(indexTokenAmount.toString()).toEqual(expectedAmount.toString())
    expect(indexTokenPriceTotal).toBeCloseTo(inputTokenTotal, 1)
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
      null
    )
    const inputTokenTotal = parseFloat(inputTokenAmount) * inputTokenPrice
    const approxOutputAmount =
      (inputTokenTotal / outputTokenPrice) * outputAdjust
    const expectedAmount = toWei(approxOutputAmount, 18)
    const indexTokenPriceTotal =
      Number(formatUnits(BigInt(indexTokenAmount.toString()), 18)) *
      outputTokenPrice
    expect(indexTokenAmount.toString()).toEqual(expectedAmount.toString())
    expect(indexTokenPriceTotal).toBeCloseTo(inputTokenTotal, 1)
  })
})
