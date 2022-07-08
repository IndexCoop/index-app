import { BigNumber } from 'ethers'

import {
  DAI,
  ETH,
  Ethereum2xFLIP,
  icETHIndex,
  IMaticFLIP,
  IndexToken,
  JPGIndex,
  MATIC,
  MetaverseIndex,
  STETH,
  USDC,
  WETH,
} from 'constants/tokens'
import { toWei } from 'utils'

import {
  getBestQuote,
  getSetTokenAmount,
  isEligibleTradePair,
  isEligibleTradePairZeroEx,
  maxPriceImpact,
  QuoteType,
} from './useBestTradeOption'

describe('getBestQuote()', () => {
  test('should return 0x as best trade option', async () => {
    const bestTradeOption = getBestQuote(1, 2, 2, 3.5)
    expect(bestTradeOption).toEqual(QuoteType.zeroEx)
  })

  test('should return EI as the best option', async () => {
    const bestTradeOption = getBestQuote(2, 1, 3, 1)
    expect(bestTradeOption).toEqual(QuoteType.exchangeIssuanceZeroEx)
  })

  test('should return Leveraged EI as the best option', async () => {
    const bestTradeOption = getBestQuote(2, 2, 1, 1)
    expect(bestTradeOption).toEqual(QuoteType.exchangeIssuanceLeveraged)
  })

  test('should return 0x if everything else is not defined', async () => {
    const bestTradeOption = getBestQuote(1, null, null, 1)
    expect(bestTradeOption).toEqual(QuoteType.zeroEx)
  })

  test('should return EI if everything else is not defined', async () => {
    const bestTradeOption = getBestQuote(null, 1, null, 1)
    expect(bestTradeOption).toEqual(QuoteType.exchangeIssuanceZeroEx)
  })

  test('should return Leveraged EI if everything else is not defined', async () => {
    const bestTradeOption = getBestQuote(null, null, 1, 1)
    expect(bestTradeOption).toEqual(QuoteType.exchangeIssuanceLeveraged)
  })

  test('should NOT return 0x if price impact is too high', async () => {
    const bestTradeOption = getBestQuote(1, 1, null, 5)
    expect(bestTradeOption).toEqual(QuoteType.exchangeIssuanceZeroEx)
    const bestTradeOption2 = getBestQuote(1, null, 1, 5)
    expect(bestTradeOption2).toEqual(QuoteType.exchangeIssuanceLeveraged)
  })

  test('should NOT return 0x if price impact is too high (higher quotes)', async () => {
    const bestTradeOption = getBestQuote(1, 1.1, null, 5)
    expect(bestTradeOption).toEqual(QuoteType.exchangeIssuanceZeroEx)
    const bestTradeOption2 = getBestQuote(1, null, 1.1, 5)
    expect(bestTradeOption2).toEqual(QuoteType.exchangeIssuanceLeveraged)
  })
})

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

describe('isEligibleTradePairZeroEx()', () => {
  test('should return correct eligible status for zeroEx', async () => {
    const inputToken = ETH
    // icEth works with EILeveraged only
    const isEligible = isEligibleTradePairZeroEx(inputToken, icETHIndex)
    expect(isEligible).toEqual(false)
    // not eligible - as not approved in contract
    const isEligibleIndex = isEligibleTradePairZeroEx(inputToken, IndexToken)
    expect(isEligibleIndex).toEqual(false)
    // temporarily - disabled JPG for EI0x
    const isEligibleJpg = isEligibleTradePairZeroEx(inputToken, JPGIndex)
    expect(isEligibleJpg).toEqual(false)
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
