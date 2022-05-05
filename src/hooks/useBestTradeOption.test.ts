import { BigNumber } from 'ethers'

import { toWei } from 'utils'

import { getSetTokenAmount, maxPriceImpact } from './useBestTradeOption'

describe('getSetTokenAmount()', () => {
  test('should return correct set token amount if issuing - with dex option', async () => {
    const isIssuance = true
    const sellTokenAmount = '1'
    const sellTokenDecimals = 18
    const sellTokenPrice = 0
    const buyTokenPrice = 0
    const dexSwapOption = {
      ...zeroExDataMock,
      buyAmount: '2000000000000000000',
      estimatedPriceImpact: '0.3',
    }

    const setTokenAmount = getSetTokenAmount(
      isIssuance,
      sellTokenAmount,
      sellTokenDecimals,
      sellTokenPrice,
      buyTokenPrice,
      dexSwapOption
    )

    expect(setTokenAmount.toString()).toEqual(dexSwapOption.buyAmount)
  })

  test('should return correct set token amount if issuing - with dex option - which price impact is higher than max allowed', async () => {
    const isIssuance = true
    const sellTokenAmount = '1'
    const sellTokenDecimals = 18
    const sellTokenPrice = 1.5
    const buyTokenPrice = 5
    const priceImpact = maxPriceImpact + 1
    const dexSwapOption = {
      ...zeroExDataMock,
      buyAmount: '2000000000000000000',
      estimatedPriceImpact: priceImpact.toString(),
    }

    const sellTokenTotal = parseFloat(sellTokenAmount) * sellTokenPrice
    const approxOutputAmount = Math.floor(sellTokenTotal / buyTokenPrice)
    const expectedSetTokenAmount = toWei(approxOutputAmount, sellTokenDecimals)

    const setTokenAmount = getSetTokenAmount(
      isIssuance,
      sellTokenAmount,
      sellTokenDecimals,
      sellTokenPrice,
      buyTokenPrice,
      dexSwapOption
    )

    expect(setTokenAmount.toString()).toEqual(expectedSetTokenAmount.toString())
  })

  test('should return correct set token amount if issuing - without a dex option', async () => {
    const isIssuance = true
    const sellTokenAmount = '1'
    const sellTokenDecimals = 18
    const sellTokenPrice = 1.5
    const buyTokenPrice = 5
    const dexSwapOption = null

    const sellTokenTotal = parseFloat(sellTokenAmount) * sellTokenPrice
    const approxOutputAmount = Math.floor(sellTokenTotal / buyTokenPrice)
    const expectedSetTokenAmount = toWei(approxOutputAmount, sellTokenDecimals)

    const setTokenAmount = getSetTokenAmount(
      isIssuance,
      sellTokenAmount,
      sellTokenDecimals,
      sellTokenPrice,
      buyTokenPrice,
      dexSwapOption
    )

    expect(setTokenAmount.toString()).toEqual(expectedSetTokenAmount.toString())
  })

  test('should return correct set token amount if redeeming - with dex option', async () => {
    const isIssuance = false
    const sellTokenAmount = '1'
    const sellTokenDecimals = 18
    const sellTokenPrice = 0
    const buyTokenPrice = 0
    const dexSwapOption = {
      ...zeroExDataMock,
      buyAmount: '2000000000000000000',
    }

    const expectedSetTokenAmount = toWei(sellTokenAmount, sellTokenDecimals)

    const setTokenAmount = getSetTokenAmount(
      isIssuance,
      sellTokenAmount,
      sellTokenDecimals,
      sellTokenPrice,
      buyTokenPrice,
      dexSwapOption
    )

    expect(setTokenAmount.toString()).toEqual(expectedSetTokenAmount.toString())
  })

  test('should return correct set token amount if redeeming - without a dex option', async () => {
    const isIssuance = false
    const sellTokenAmount = '1'
    const sellTokenDecimals = 18
    const sellTokenPrice = 0
    const buyTokenPrice = 0
    const dexSwapOption = null

    const expectedSetTokenAmount = toWei(sellTokenAmount, sellTokenDecimals)

    const setTokenAmount = getSetTokenAmount(
      isIssuance,
      sellTokenAmount,
      sellTokenDecimals,
      sellTokenPrice,
      buyTokenPrice,
      dexSwapOption
    )

    expect(setTokenAmount.toString()).toEqual(expectedSetTokenAmount.toString())
  })
})

const zeroExDataMock = {
  chainId: '1',
  data: '',
  estimatedPriceImpact: '',
  price: '',
  guaranteedPrice: '',
  buyTokenAddress: '',
  sellTokenAddress: '',
  buyAmount: '',
  sellAmount: '',
  to: '',
  from: '',
  sources: [],
  displayBuyAmount: 0,
  displaySellAmount: 0,
  minOutput: BigNumber.from(0),
  maxInput: BigNumber.from(0),
  gas: undefined,
  gasPrice: '',
  formattedSources: '',
  buyTokenCost: '',
  sellTokenCost: '',
  value: '',
}
