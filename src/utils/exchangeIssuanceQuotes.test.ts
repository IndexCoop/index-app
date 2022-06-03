import { BigNumber, providers } from 'ethers'

import {
  debtCollateralSwapData,
  inputSwapData,
  outputSwapData,
} from 'constants/exchangeIssuanceLeveragedData'
import {
  ETH,
  GmiIndex,
  icETHIndex,
  IEthereumFLIP,
  MATIC,
  STETH,
} from 'constants/tokens'
import { displayFromWei, toWei } from 'utils'

import {
  Exchange,
  ExchangeIssuanceQuote,
  getFullCostsInUsd,
  getIncludedSources,
  getLevEIPaymentTokenAddress,
  getLeveragedExchangeIssuanceQuotes,
  getRequiredComponents,
  getSlippageAdjustedTokenAmount,
  getSwapDataAndPaymentTokenAmount,
  SwapData,
} from './exchangeIssuanceQuotes'

const provider = new providers.JsonRpcProvider(
  process.env.REACT_APP_MAINNET_ALCHEMY_API,
  1
)

describe('getFullCostsInUsd()', () => {
  test('should return null if undefined', async () => {
    const fullCostsNull = getFullCostsInUsd(null, BigNumber.from(0), 18, 1, 1)
    expect(fullCostsNull).toBeNull()
  })

  test('should return input/ouput token amount + gas', async () => {
    const gasLimit = toWei(0.01)
    const gasPrice = BigNumber.from(2)
    const gas = gasPrice.mul(gasLimit)
    const quote: ExchangeIssuanceQuote = {
      tradeData: [],
      inputTokenAmount: toWei(1),
      setTokenAmount: BigNumber.from(1),
      gas: gasLimit,
      gasPrice,
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
    const quote: ExchangeIssuanceQuote = {
      tradeData: [],
      inputTokenAmount: toWei(1000, 6),
      setTokenAmount: BigNumber.from(1),
      gas: gasLimit,
      gasPrice,
    }
    const fullCosts = getFullCostsInUsd(quote.inputTokenAmount, gas, 6, 1, 2000)
    const expectedCosts = 1040
    expect(fullCosts).toBeDefined()
    expect(fullCosts).toEqual(expectedCosts)
  })
})

describe('getIncludedSources()', () => {
  test('should return Curve only for icETH', async () => {
    const isIcEth = true
    const includedSources = getIncludedSources(isIcEth)
    expect(includedSources).toBeDefined()
    expect(includedSources).toEqual('Curve')
  })

  test('should return all valid exchanges for any other token', async () => {
    const isIcEth = false
    const includedSources = getIncludedSources(isIcEth)
    expect(includedSources).toBeDefined()
    // These are the only supported exchanges for the leveraged exchange issuance
    expect(includedSources).toEqual('QuickSwap,SushiSwap,Uniswap_V3')
  })
})

describe('getLevEIPaymentTokenAddress()', () => {
  test('should return ETH for ETH', async () => {
    const paymentTokenAddress = getLevEIPaymentTokenAddress(ETH, true, 1)
    const paymentTokenAddress2 = getLevEIPaymentTokenAddress(ETH, false, 1)
    expect(paymentTokenAddress).toEqual('ETH')
    expect(paymentTokenAddress2).toEqual('ETH')
  })

  test('should return icETH address for issuing icETH', async () => {
    const paymentTokenAddress = getLevEIPaymentTokenAddress(icETHIndex, true, 1)
    expect(paymentTokenAddress).toEqual(icETHIndex.address)
  })

  test('should return stETH address for redeeming icETH', async () => {
    const paymentTokenAddress = getLevEIPaymentTokenAddress(
      icETHIndex,
      false,
      1
    )
    const stETH = '0xae7ab96520de3a18e5e111b5eaab095312d7fe84'
    expect(paymentTokenAddress).toEqual(stETH)
  })

  test('should return WMATIC address for MATIC on polygon', async () => {
    const paymentTokenAddress = getLevEIPaymentTokenAddress(MATIC, true, 137)
    const WMATIC = '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270'
    expect(paymentTokenAddress).toEqual(WMATIC)
  })

  test('should return token address based on chain id', async () => {
    const paymentTokenAddressEth = getLevEIPaymentTokenAddress(
      GmiIndex,
      true,
      1
    )
    const paymentTokenAddressPolygon = getLevEIPaymentTokenAddress(
      GmiIndex,
      true,
      137
    )
    expect(paymentTokenAddressEth).toEqual(GmiIndex.address)
    expect(paymentTokenAddressPolygon).toEqual(GmiIndex.polygonAddress)
  })
})

describe('getLeveragedExchangeIssuanceQuotes()', () => {
  test('should return static swap data for 🧊ETH - issuing', async () => {
    const setTokenAmount = BigNumber.from('100')
    const quote = await getLeveragedExchangeIssuanceQuotes(
      icETHIndex,
      setTokenAmount,
      ETH,
      icETHIndex,
      true,
      1,
      provider as providers.Web3Provider
    )
    expect(quote).toBeDefined()
    expect(quote?.setTokenAmount).toEqual(setTokenAmount)
    expect(quote?.swapDataDebtCollateral).toStrictEqual(
      debtCollateralSwapData[icETHIndex.symbol]
    )
  })
})

describe('getRequiredComponents()', () => {
  test('should return components and positions for issuance', async () => {
    const isIssuance = true
    const setToken = GmiIndex.address
    const setTokenSymbol = GmiIndex.symbol
    const setTokenAmount = BigNumber.from(1)
    const chainId = 1

    const { positions, components } = await getRequiredComponents(
      isIssuance,
      setToken,
      setTokenSymbol,
      setTokenAmount,
      chainId,
      provider as providers.Web3Provider
    )

    expect(positions.length).toBeGreaterThan(0)
    expect(components.length).toBeGreaterThan(0)
    expect(positions.length).toEqual(components.length)
  })

  test('should return components and positions for redeeming', async () => {
    const isIssuance = false
    const setToken = GmiIndex.address
    const setTokenSymbol = GmiIndex.symbol
    const setTokenAmount = BigNumber.from(1)
    const chainId = 1

    const { positions, components } = await getRequiredComponents(
      isIssuance,
      setToken,
      setTokenSymbol,
      setTokenAmount,
      chainId,
      provider as providers.Web3Provider
    )

    expect(positions.length).toBeGreaterThan(0)
    expect(components.length).toBeGreaterThan(0)
    expect(positions.length).toEqual(components.length)
  })
})

describe('getSwapDataAndPaymentTokenAmount()', () => {
  test('should return default swap data when collateral token is payment token - and collateral shortfall as payment token amount when issuing', async () => {
    const defaultSwapData: SwapData = {
      exchange: Exchange.None,
      path: [],
      fees: [],
      pool: '0x0000000000000000000000000000000000000000',
    }
    const collateralShortfall = BigNumber.from(1)

    const { swapDataPaymentToken, paymentTokenAmount } =
      await getSwapDataAndPaymentTokenAmount(
        IEthereumFLIP,
        MATIC.polygonAddress!,
        collateralShortfall,
        BigNumber.from(0),
        MATIC.polygonAddress!,
        '',
        true,
        137
      )
    expect(swapDataPaymentToken).toStrictEqual(defaultSwapData)
    expect(paymentTokenAmount.toString()).toEqual(
      collateralShortfall.toString()
    )
  })

  test('should return default swap data when collateral token is payment token - and left over collateral as payment token amount when redeemig', async () => {
    const defaultSwapData: SwapData = {
      exchange: Exchange.None,
      path: [],
      fees: [],
      pool: '0x0000000000000000000000000000000000000000',
    }
    const leftoverCollateral = BigNumber.from(1)

    const { swapDataPaymentToken, paymentTokenAmount } =
      await getSwapDataAndPaymentTokenAmount(
        IEthereumFLIP,
        MATIC.polygonAddress!,
        BigNumber.from(0),
        leftoverCollateral,
        MATIC.polygonAddress!,
        '',
        false,
        137
      )
    expect(swapDataPaymentToken).toStrictEqual(defaultSwapData)
    expect(paymentTokenAmount.toString()).toStrictEqual(
      leftoverCollateral.toString()
    )
  })

  test('should return static swap data for 🧊ETH - issuing', async () => {
    const swapData: SwapData = inputSwapData[icETHIndex.symbol][ETH.symbol]

    const collateralShortfall = BigNumber.from(1)

    const { swapDataPaymentToken, paymentTokenAmount } =
      await getSwapDataAndPaymentTokenAmount(
        icETHIndex,
        ETH.address!,
        collateralShortfall,
        BigNumber.from(0),
        ETH.address!,
        '',
        true,
        1
      )
    expect(swapDataPaymentToken).toStrictEqual(swapData)
    expect(paymentTokenAmount.toString()).toStrictEqual(
      collateralShortfall.toString()
    )
  })

  test('should return static swap data for 🧊ETH - issuing (stETH)', async () => {
    const swapData: SwapData = inputSwapData[icETHIndex.symbol][STETH.symbol]

    const collateralShortfall = BigNumber.from(1)

    const { swapDataPaymentToken, paymentTokenAmount } =
      await getSwapDataAndPaymentTokenAmount(
        icETHIndex,
        STETH.address!,
        collateralShortfall,
        BigNumber.from(0),
        STETH.address!,
        '',
        true,
        1
      )
    expect(swapDataPaymentToken).toStrictEqual(swapData)
    expect(paymentTokenAmount.toString()).toStrictEqual(
      collateralShortfall.toString()
    )
  })

  test('should return static swap data for 🧊ETH - redeeming', async () => {
    const swapData: SwapData = outputSwapData[icETHIndex.symbol][ETH.symbol]

    const leftoverCollateral = BigNumber.from(1)

    const { swapDataPaymentToken, paymentTokenAmount } =
      await getSwapDataAndPaymentTokenAmount(
        icETHIndex,
        ETH.address!,
        BigNumber.from(0),
        leftoverCollateral,
        ETH.address!,
        '',
        false,
        1
      )
    expect(swapDataPaymentToken).toStrictEqual(swapData)
    expect(paymentTokenAmount.toString()).toStrictEqual(
      leftoverCollateral.toString()
    )
  })
})

describe('getSlippageAdjustedTokenAmount()', () => {
  test('should return correctly adjusted value for issuing', async () => {
    const isIssuance = true
    const slippagePercentage = 0.5
    const adjustedAmount = getSlippageAdjustedTokenAmount(
      toWei(100),
      18,
      slippagePercentage,
      isIssuance
    )
    expect(displayFromWei(adjustedAmount, 1)).toEqual('100.5')
  })

  test('should return correctly adjusted value for redeeming', async () => {
    const isIssuance = false
    const slippagePercentage = 0.5
    const adjustedAmount = getSlippageAdjustedTokenAmount(
      toWei(100),
      18,
      slippagePercentage,
      isIssuance
    )
    expect(displayFromWei(adjustedAmount, 1)).toEqual('99.5')
  })
})
