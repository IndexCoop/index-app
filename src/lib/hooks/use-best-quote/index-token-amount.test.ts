import { ZeroExData } from '@/lib/utils/api/zeroex-utils'
import { toWei } from '@/lib/utils'

import { maxPriceImpact } from './config'
import { getIndexTokenAmount } from './index-token-amount'

describe('getIndexTokenAmount - redeeming', () => {
  it('returns input token amount directly', async () => {
    const isMinting = false
    const inputTokenAmount = toWei('1', 18)
    const indexTokenAmount = getIndexTokenAmount(isMinting, '1', 18, 0, 0, null)
    expect(indexTokenAmount.toString()).toEqual(inputTokenAmount.toString())
  })
})

describe('getIndexTokenAmount - minting', () => {
  it('returns buy amount (0x data)', async () => {
    const isMinting = true
    const dexData = {
      buyAmount: '2000000000000000000',
    } as ZeroExData
    const indexTokenAmount = getIndexTokenAmount(
      isMinting,
      '1',
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
      0,
      0,
      dexData
    )
    expect(indexTokenAmount.toString()).toEqual(dexData.buyAmount.toString())
  })

  it('returns approx amount if price impact is above max', async () => {
    const isMinting = true
    const inputTokenPrice = 2
    const outputTokenPrice = 3
    const dexData = {
      estimatedPriceImpact: maxPriceImpact.toString(),
      buyAmount: '2000000000000000000',
    } as ZeroExData
    const indexTokenAmount = getIndexTokenAmount(
      isMinting,
      '1',
      18,
      inputTokenPrice,
      outputTokenPrice,
      dexData
    )
    const sellTokenTotal = parseFloat('1') * inputTokenPrice
    const approxOutputAmount = Math.floor(sellTokenTotal / outputTokenPrice)
    const expectedAmount = toWei(approxOutputAmount, 18)
    expect(indexTokenAmount.toString()).toEqual(expectedAmount.toString())
  })

  it('returns approx amount if no 0x data', async () => {
    const isMinting = true
    const inputTokenPrice = 2
    const outputTokenPrice = 3
    const indexTokenAmount = getIndexTokenAmount(
      isMinting,
      '1',
      18,
      inputTokenPrice,
      outputTokenPrice,
      null
    )
    const sellTokenTotal = parseFloat('1') * inputTokenPrice
    const approxOutputAmount = Math.floor(sellTokenTotal / outputTokenPrice)
    const expectedAmount = toWei(approxOutputAmount, 18)
    expect(indexTokenAmount.toString()).toEqual(expectedAmount.toString())
  })
})
