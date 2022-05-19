import { BigNumber } from 'ethers'

import {
  DAI,
  ETH,
  Ethereum2xFLIP,
  icETHIndex,
  IMaticFLIP,
  MATIC,
  MetaverseIndex,
  STETH,
  USDC,
  WETH,
} from 'constants/tokens'
import { toWei } from 'utils'

import {
  getSetTokenAmount,
  isEligibleTradePair,
  maxPriceImpact,
} from './useBestTradeOption'

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

describe('isEligibleTradePair()', () => {
  test('should return correct eligible status for 🧊ETH - issuing', async () => {
    const inputToken = ETH
    const outputToken = icETHIndex
    const isIssuance = true
    const isEligible = isEligibleTradePair(inputToken, outputToken, isIssuance)
    expect(isEligible).toEqual(true)
    const isEligibleStEth = isEligibleTradePair(STETH, outputToken, isIssuance)
    expect(isEligibleStEth).toEqual(true)
    const isEligibleWeth = isEligibleTradePair(WETH, outputToken, isIssuance)
    expect(isEligibleWeth).toEqual(false)
    const isEligibleDai = isEligibleTradePair(DAI, outputToken, isIssuance)
    expect(isEligibleDai).toEqual(false)
    const isEligibleUSDC = isEligibleTradePair(USDC, outputToken, isIssuance)
    expect(isEligibleUSDC).toEqual(false)
  })

  test('should return correct eligible status for 🧊ETH - redeeming', async () => {
    const inputToken = icETHIndex
    const outputToken = ETH
    const isIssuance = false
    const isEligible = isEligibleTradePair(inputToken, outputToken, isIssuance)
    expect(isEligible).toEqual(true)
    const isEligibleStEth = isEligibleTradePair(inputToken, STETH, isIssuance)
    expect(isEligibleStEth).toEqual(false)
    const isEligibleWeth = isEligibleTradePair(inputToken, WETH, isIssuance)
    expect(isEligibleWeth).toEqual(false)
    const isEligibleDai = isEligibleTradePair(inputToken, DAI, isIssuance)
    expect(isEligibleDai).toEqual(false)
    const isEligibleUSDC = isEligibleTradePair(inputToken, USDC, isIssuance)
    expect(isEligibleUSDC).toEqual(false)
  })

  test('should return correct eligible status for leveraged exchange issuance - issuing', async () => {
    const inputToken = MATIC
    const outputToken = Ethereum2xFLIP
    const isIssuance = true
    const isEligible = isEligibleTradePair(inputToken, outputToken, isIssuance)
    expect(isEligible).toEqual(true)
    const isEligibleImatic = isEligibleTradePair(
      inputToken,
      IMaticFLIP,
      isIssuance
    )
    expect(isEligibleImatic).toEqual(true)
    const isNotEligible = isEligibleTradePair(
      inputToken,
      MetaverseIndex,
      isIssuance
    )
    expect(isNotEligible).toEqual(false)
  })

  test('should return correct eligible status for leveraged exchange issuance - redeeming', async () => {
    const inputToken = Ethereum2xFLIP
    const outputToken = MATIC
    const isIssuance = false
    const isEligible = isEligibleTradePair(inputToken, outputToken, isIssuance)
    expect(isEligible).toEqual(true)
    const isEligibleImatic = isEligibleTradePair(
      IMaticFLIP,
      outputToken,
      isIssuance
    )
    expect(isEligibleImatic).toEqual(true)
    const isNotEligible = isEligibleTradePair(
      MetaverseIndex,
      outputToken,
      isIssuance
    )
    expect(isNotEligible).toEqual(false)
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
