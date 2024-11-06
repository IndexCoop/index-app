import { parseUnits } from '@/lib/utils'

import { getFullCostsInUsd, getGasCostsInUsd } from './costs'

describe('getFullCostsInUsd()', () => {
  test('should return null if undefined', async () => {
    const fullCostsNull = getFullCostsInUsd(null, BigInt(0), 18, 1, 1)
    expect(fullCostsNull).toBeNull()
  })

  test('should return input/ouput token amount + gas', async () => {
    const gasLimit = parseUnits('0.01', 18)
    const gasPrice = BigInt(2)
    const gas = gasPrice * gasLimit
    const quote = {
      tradeData: [],
      inputTokenAmount: parseUnits('1', 18),
      setTokenAmount: BigInt(1),
      gas: gasLimit,
    }
    const fullCosts = getFullCostsInUsd(
      quote.inputTokenAmount,
      gas,
      18,
      10,
      2000,
    )
    const expectedCosts = 50
    expect(fullCosts).toBeDefined()
    expect(fullCosts).toEqual(expectedCosts)
  })

  test('should return correct full costs with USDC', async () => {
    const gasLimit = parseUnits('0.01', 18)
    const gasPrice = BigInt(2)
    const gas = gasPrice * gasLimit
    const quote = {
      tradeData: [],
      inputTokenAmount: parseUnits('1000', 6),
      setTokenAmount: BigInt(1),
      gas: gasLimit,
    }
    const fullCosts = getFullCostsInUsd(quote.inputTokenAmount, gas, 6, 1, 2000)
    const expectedCosts = 1040
    expect(fullCosts).toBeDefined()
    expect(fullCosts).toEqual(expectedCosts)
  })
})

describe('getGasCostsInUsd()', () => {
  test('should return gas costs with USDC', async () => {
    const gasLimit = parseUnits('0.01', 18)
    const gasPrice = BigInt(2)
    const gas = gasPrice * gasLimit
    const gasCostsInUsd = getGasCostsInUsd(gas, 2000)
    const expectedCosts = 40
    expect(gasCostsInUsd).toEqual(expectedCosts)
  })
})
