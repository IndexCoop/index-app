import { BigNumber } from 'ethers'

import { toWei } from 'utils'

import { getFullCostsInUsd, getGasCostsInUsd } from './costs'

describe('getFullCostsInUsd()', () => {
  test('should return null if undefined', async () => {
    const fullCostsNull = getFullCostsInUsd(null, BigNumber.from(0), 18, 1, 1)
    expect(fullCostsNull).toBeNull()
  })

  test('should return input/ouput token amount + gas', async () => {
    const gasLimit = toWei(0.01)
    const gasPrice = BigNumber.from(2)
    const gas = gasPrice.mul(gasLimit)
    const quote = {
      tradeData: [],
      inputTokenAmount: toWei(1),
      setTokenAmount: BigNumber.from(1),
      gas: gasLimit,
    }
    const fullCosts = getFullCostsInUsd(
      quote.inputTokenAmount,
      gas,
      18,
      10,
      2000
    )
    const expectedCosts = 50
    expect(fullCosts).toBeDefined()
    expect(fullCosts).toEqual(expectedCosts)
  })

  test('should return correct full costs with USDC', async () => {
    const gasLimit = toWei(0.01)
    const gasPrice = BigNumber.from(2)
    const gas = gasPrice.mul(gasLimit)
    const quote = {
      tradeData: [],
      inputTokenAmount: toWei(1000, 6),
      setTokenAmount: BigNumber.from(1),
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
    const gasLimit = toWei(0.01)
    const gasPrice = BigNumber.from(2)
    const gas = gasPrice.mul(gasLimit)
    const gasCostsInUsd = getGasCostsInUsd(gas, 2000)
    const expectedCosts = 40
    expect(gasCostsInUsd).toEqual(expectedCosts)
  })
})
