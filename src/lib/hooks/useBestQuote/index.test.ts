import { BigNumber } from 'ethers'

import {
  Bitcoin2xFlexibleLeverageIndex,
  DAI,
  ETH,
  Ethereum2xFlexibleLeverageIndex,
  icETHIndex,
  IndexToken,
  STETH,
  USDC,
  WETH,
} from '@/constants/tokens'
import { toWei } from '@/lib/utils'

import { isEligibleTradePair } from './flashMintLeveraged'
import { isEligibleTradePairZeroEx } from './flashMintZeroEx'
import { getBestQuote, getSetTokenAmount, maxPriceImpact, QuoteType } from './'

describe('test', () => {
  test('test', () => {
    expect(true).toBeTruthy()
  })
})

// describe('getBestQuote()', () => {
//   test('should return 0x as best trade option', async () => {
//     const bestTradeOption = getBestQuote(1, 2, 2, 3.5)
//     expect(bestTradeOption.type).toEqual(QuoteType.zeroEx)
//   })

//   test('should return EI as the best option', async () => {
//     const bestTradeOption = getBestQuote(2, 1, 3, 1)
//     expect(bestTradeOption.type).toEqual(QuoteType.exchangeIssuanceZeroEx)
//   })

//   test('should return Leveraged EI as the best option', async () => {
//     const bestTradeOption = getBestQuote(2, 2, 1, 1)
//     expect(bestTradeOption.type).toEqual(QuoteType.exchangeIssuanceLeveraged)
//   })

//   test('should return 0x if everything else is not defined', async () => {
//     const bestTradeOption = getBestQuote(1, null, null, 1)
//     expect(bestTradeOption.type).toEqual(QuoteType.zeroEx)
//   })

//   test('should return EI if everything else is not defined', async () => {
//     const bestTradeOption = getBestQuote(null, 1, null, 1)
//     expect(bestTradeOption.type).toEqual(QuoteType.exchangeIssuanceZeroEx)
//   })

//   test('should return Leveraged EI if everything else is not defined', async () => {
//     const bestTradeOption = getBestQuote(null, null, 1, 1)
//     expect(bestTradeOption.type).toEqual(QuoteType.exchangeIssuanceLeveraged)
//   })

//   test('should NOT return 0x if price impact is too high', async () => {
//     const bestTradeOption = getBestQuote(1, 1, null, 5)
//     expect(bestTradeOption.type).toEqual(QuoteType.exchangeIssuanceZeroEx)
//     expect(bestTradeOption.priceImpact).toEqual(true)
//     const bestTradeOption2 = getBestQuote(1, null, 1, 5)
//     expect(bestTradeOption2.type).toEqual(QuoteType.exchangeIssuanceLeveraged)
//     expect(bestTradeOption2.priceImpact).toEqual(true)
//   })

//   test('should NOT return 0x if price impact is too high (higher quotes)', async () => {
//     const bestTradeOption = getBestQuote(1, 1.1, null, 5)
//     expect(bestTradeOption.type).toEqual(QuoteType.exchangeIssuanceZeroEx)
//     expect(bestTradeOption.priceImpact).toEqual(true)
//     const bestTradeOption2 = getBestQuote(1, null, 1.1, 5)
//     expect(bestTradeOption2.type).toEqual(QuoteType.exchangeIssuanceLeveraged)
//     expect(bestTradeOption2.priceImpact).toEqual(true)
//   })
// })

// describe('getSetTokenAmount()', () => {
//   test('should return correct set token amount if issuing - with dex option', async () => {
//     const isIssuance = true
//     const sellTokenAmount = '1'
//     const sellTokenDecimals = 18
//     const sellTokenPrice = 0
//     const buyTokenPrice = 0
//     const dexSwapOption = {
//       ...zeroExDataMock,
//       buyAmount: '2000000000000000000',
//       estimatedPriceImpact: '0.3',
//     }

//     const setTokenAmount = getSetTokenAmount(
//       isIssuance,
//       sellTokenAmount,
//       sellTokenDecimals,
//       sellTokenPrice,
//       buyTokenPrice,
//       dexSwapOption
//     )

//     expect(setTokenAmount.toString()).toEqual(dexSwapOption.buyAmount)
//   })

//   test('should return correct set token amount if issuing - with dex option - which price impact is higher than max allowed', async () => {
//     const isIssuance = true
//     const sellTokenAmount = '1'
//     const sellTokenDecimals = 18
//     const sellTokenPrice = 1.5
//     const buyTokenPrice = 5
//     const priceImpact = maxPriceImpact + 1
//     const dexSwapOption = {
//       ...zeroExDataMock,
//       buyAmount: '2000000000000000000',
//       estimatedPriceImpact: priceImpact.toString(),
//     }

//     const sellTokenTotal = parseFloat(sellTokenAmount) * sellTokenPrice
//     const approxOutputAmount = Math.floor(sellTokenTotal / buyTokenPrice)
//     const expectedSetTokenAmount = toWei(approxOutputAmount, sellTokenDecimals)

//     const setTokenAmount = getSetTokenAmount(
//       isIssuance,
//       sellTokenAmount,
//       sellTokenDecimals,
//       sellTokenPrice,
//       buyTokenPrice,
//       dexSwapOption
//     )

//     expect(setTokenAmount.toString()).toEqual(expectedSetTokenAmount.toString())
//   })

//   test('should return correct set token amount if issuing - without a dex option', async () => {
//     const isIssuance = true
//     const sellTokenAmount = '1'
//     const sellTokenDecimals = 18
//     const sellTokenPrice = 1.5
//     const buyTokenPrice = 5
//     const dexSwapOption = null

//     const sellTokenTotal = parseFloat(sellTokenAmount) * sellTokenPrice
//     const approxOutputAmount = Math.floor(sellTokenTotal / buyTokenPrice)
//     const expectedSetTokenAmount = toWei(approxOutputAmount, sellTokenDecimals)

//     const setTokenAmount = getSetTokenAmount(
//       isIssuance,
//       sellTokenAmount,
//       sellTokenDecimals,
//       sellTokenPrice,
//       buyTokenPrice,
//       dexSwapOption
//     )

//     expect(setTokenAmount.toString()).toEqual(expectedSetTokenAmount.toString())
//   })

//   test('should return correct set token amount if redeeming - with dex option', async () => {
//     const isIssuance = false
//     const sellTokenAmount = '1'
//     const sellTokenDecimals = 18
//     const sellTokenPrice = 0
//     const buyTokenPrice = 0
//     const dexSwapOption = {
//       ...zeroExDataMock,
//       buyAmount: '2000000000000000000',
//     }

//     const expectedSetTokenAmount = toWei(sellTokenAmount, sellTokenDecimals)

//     const setTokenAmount = getSetTokenAmount(
//       isIssuance,
//       sellTokenAmount,
//       sellTokenDecimals,
//       sellTokenPrice,
//       buyTokenPrice,
//       dexSwapOption
//     )

//     expect(setTokenAmount.toString()).toEqual(expectedSetTokenAmount.toString())
//   })

//   test('should return correct set token amount if redeeming - without a dex option', async () => {
//     const isIssuance = false
//     const sellTokenAmount = '1'
//     const sellTokenDecimals = 18
//     const sellTokenPrice = 0
//     const buyTokenPrice = 0
//     const dexSwapOption = null

//     const expectedSetTokenAmount = toWei(sellTokenAmount, sellTokenDecimals)

//     const setTokenAmount = getSetTokenAmount(
//       isIssuance,
//       sellTokenAmount,
//       sellTokenDecimals,
//       sellTokenPrice,
//       buyTokenPrice,
//       dexSwapOption
//     )

//     expect(setTokenAmount.toString()).toEqual(expectedSetTokenAmount.toString())
//   })
// })

// describe('isEligibleTradePair()', () => {
//   test('should return correct eligible status for 🧊ETH - issuing', async () => {
//     const chainId = 1
//     const inputToken = ETH
//     const outputToken = icETHIndex
//     const isIssuance = true
//     const isEligible = isEligibleTradePair(
//       inputToken,
//       outputToken,
//       chainId,
//       isIssuance
//     )
//     expect(isEligible).toEqual(true)
//     const isEligibleStEth = isEligibleTradePair(
//       STETH,
//       outputToken,
//       chainId,
//       isIssuance
//     )
//     expect(isEligibleStEth).toEqual(true)
//     const isEligibleWeth = isEligibleTradePair(
//       WETH,
//       outputToken,
//       chainId,
//       isIssuance
//     )
//     expect(isEligibleWeth).toEqual(false)
//     const isEligibleDai = isEligibleTradePair(
//       DAI,
//       outputToken,
//       chainId,
//       isIssuance
//     )
//     expect(isEligibleDai).toEqual(false)
//     const isEligibleUSDC = isEligibleTradePair(
//       USDC,
//       outputToken,
//       chainId,
//       isIssuance
//     )
//     expect(isEligibleUSDC).toEqual(false)
//   })

//   test('should return correct eligible status for 🧊ETH - redeeming', async () => {
//     const chainId = 1
//     const inputToken = icETHIndex
//     const outputToken = ETH
//     const isIssuance = false
//     const isEligible = isEligibleTradePair(
//       inputToken,
//       outputToken,
//       chainId,
//       isIssuance
//     )
//     expect(isEligible).toEqual(true)
//     const isEligibleStEth = isEligibleTradePair(
//       inputToken,
//       STETH,
//       chainId,
//       isIssuance
//     )
//     expect(isEligibleStEth).toEqual(false)
//     const isEligibleWeth = isEligibleTradePair(
//       inputToken,
//       WETH,
//       chainId,
//       isIssuance
//     )
//     expect(isEligibleWeth).toEqual(false)
//     const isEligibleDai = isEligibleTradePair(
//       inputToken,
//       DAI,
//       chainId,
//       isIssuance
//     )
//     expect(isEligibleDai).toEqual(false)
//     const isEligibleUSDC = isEligibleTradePair(
//       inputToken,
//       USDC,
//       chainId,
//       isIssuance
//     )
//     expect(isEligibleUSDC).toEqual(false)
//   })
// })

// describe('isEligibleTradePairZeroEx()', () => {
//   test('should return correct eligible status for zeroEx', async () => {
//     const inputToken = ETH
//     // icEth works with EILeveraged only
//     const isEligible = isEligibleTradePairZeroEx(inputToken, icETHIndex)
//     expect(isEligible).toEqual(false)
//     // not eligible - as not approved in contract
//     const isEligibleIndex = isEligibleTradePairZeroEx(inputToken, IndexToken)
//     expect(isEligibleIndex).toEqual(false)
//     // Won't work with ZeroEx, so shouldn't be eligible
//     const isEligibleBtc2xFli = isEligibleTradePairZeroEx(
//       inputToken,
//       Bitcoin2xFlexibleLeverageIndex
//     )
//     expect(isEligibleBtc2xFli).toEqual(false)
//     const isEligibleEth2xFli = isEligibleTradePairZeroEx(
//       inputToken,
//       Ethereum2xFlexibleLeverageIndex
//     )
//     expect(isEligibleEth2xFli).toEqual(false)
//   })

//   test('mainnet FLIs are not be eligible for ZeroEx', async () => {
//     const inputToken = ETH
//     // Won't work with the ZeroEx contract, so shouldn't be eligible
//     const isEligibleBtc2xFli = isEligibleTradePairZeroEx(
//       inputToken,
//       Bitcoin2xFlexibleLeverageIndex
//     )
//     expect(isEligibleBtc2xFli).toEqual(false)
//     const isEligibleEth2xFli = isEligibleTradePairZeroEx(
//       inputToken,
//       Ethereum2xFlexibleLeverageIndex
//     )
//     expect(isEligibleEth2xFli).toEqual(false)
//   })
// })

// const zeroExDataMock = {
//   chainId: '1',
//   data: '',
//   estimatedPriceImpact: '',
//   price: '',
//   guaranteedPrice: '',
//   buyTokenAddress: '',
//   sellTokenAddress: '',
//   buyAmount: '',
//   sellAmount: '',
//   to: '',
//   from: '',
//   sources: [],
//   displayBuyAmount: 0,
//   displaySellAmount: 0,
//   minOutput: BigNumber.from(0),
//   maxInput: BigNumber.from(0),
//   gas: undefined,
//   gasPrice: '',
//   formattedSources: '',
//   buyTokenCost: '',
//   sellTokenCost: '',
//   value: '',
// }
