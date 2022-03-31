import { BigNumber, ethers } from 'ethers'

import { ChainId } from '@usedapp/core'

import { Token } from 'constants/tokens'
import {
  getExchangeIssuanceLeveragedContract,
  getLeveragedTokenData,
} from 'hooks/useExchangeIssuanceLeveraged'
import {
  getRequiredIssuanceComponents,
  getRequiredRedemptionComponents,
} from 'hooks/useExchangeIssuanceZeroEx'
import { displayFromWei, toWei } from 'utils'
import { getIssuanceModule } from 'utils/issuanceModule'
import { get0xQuote } from 'utils/zeroExUtils'

export interface ExchangeIssuanceQuote {
  tradeData: string[]
  inputTokenAmount: BigNumber
}

export interface LeveragedExchangeIssuanceQuote {
  swapDataDebtCollateral: SwapData
  swapDataPaymentToken: SwapData
  inputTokenAmount: BigNumber
}

export enum Exchange {
  None,
  Quickswap,
  Sushiswap,
  UniV3,
  Curve,
}
export interface SwapData {
  exchange: Exchange
  path: string[]
  fees: number[]
  pool: string
}

export interface LeveragedTokenData {
  collateralAToken: Token
  collateralToken: Token
  debtToken: Token
  collateralAmount: BigNumber
  debtAmount: BigNumber
}

/**
 * Returns exchange issuance quotes (incl. 0x trade data) or null
 *
 * @param buyToken            The token to buy
 * @param buyTokenAmount      The amount of buy token that should be acquired
 * @param sellToken           The sell token
 * @param chainId             ID for current chain
 * @param library             Web3Provider instance
 *
 * @return tradeData           Array of 0x trade data for the individual positions
 * @return inputTokenAmount    Needed input token amount for trade
 */
export const getExchangeIssuanceQuotes = async (
  buyToken: Token,
  buyTokenAmount: BigNumber,
  sellToken: Token,
  isIssuance: boolean,
  chainId: ChainId = ChainId.Mainnet,
  library: ethers.providers.Web3Provider | undefined
): Promise<ExchangeIssuanceQuote | null> => {
  const tokenSymbol = isIssuance ? buyToken.symbol : sellToken.symbol
  const issuanceModule = getIssuanceModule(tokenSymbol, chainId)
  console.log('Getting issuance quotes')
  console.log(
    'fetching...',
    buyTokenAmount.toString(),
    buyToken.symbol,
    buyToken.address,
    issuanceModule
  )

  const { components, positions } = isIssuance
    ? await getRequiredIssuanceComponents(
        library,
        issuanceModule.address,
        issuanceModule.isDebtIssuance,
        buyToken.address!,
        buyTokenAmount
      )
    : await getRequiredRedemptionComponents(
        library,
        issuanceModule.address,
        issuanceModule.isDebtIssuance,
        sellToken.address!,
        buyTokenAmount
      )

  let positionQuotes: string[] = []
  let inputTokenAmount = BigNumber.from(0)
  // Slippage hard coded to .5% (will be increased if there are revert issues)
  const slippagePercents = 0.5
  // 0xAPI expects percentage as value between 0-1 e.g. 5% -> 0.05
  const slippagePercentage = slippagePercents / 100

  const quotePromises: Promise<any>[] = []
  components.forEach((component, index) => {
    console.log('\n\n###################COMPONENT QUOTE##################')
    const buyAmount = positions[index]
    const buyTokenAddress = component
    const sellTokenAddress =
      sellToken.symbol === 'ETH' ? 'ETH' : sellToken.address
    console.log('buyToken:', buyTokenAddress, 'sellToken:', sellTokenAddress)
    console.log(
      'buyAmount:',
      buyAmount.toString(),
      buyAmount.div(BigNumber.from(10).pow(18)).toString()
    )
    if (buyTokenAddress === sellTokenAddress) {
      console.log('Component equal to input token skipping zero ex api call')
      inputTokenAmount = inputTokenAmount.add(buyAmount)
    } else {
      const quotePromise = get0xQuote(
        {
          buyToken: buyTokenAddress,
          sellToken: sellTokenAddress,
          buyAmount: buyAmount.toString(),
          slippagePercentage,
        },
        chainId ?? 1
      )
      quotePromises.push(quotePromise)
    }
  })

  const results = await Promise.all(quotePromises)
  if (results.length < 1) return null

  positionQuotes = results.map((result) => result.data)
  inputTokenAmount = results
    .map((result) => BigNumber.from(result.sellAmount))
    .reduce((prevValue, currValue) => {
      return currValue.add(prevValue)
    })

  console.log('//////////')
  console.log('quotes', positionQuotes)
  console.log(inputTokenAmount.toString())
  console.log(
    displayFromWei(inputTokenAmount, 2, sellToken.decimals),
    sellToken.decimals
  )

  // Christn: I assume that this is the correct math to make sure we have enough weth to cover the slippage
  // based on the fact that the slippagePercentage is limited between 0.0 and 1.0 on the 0xApi
  inputTokenAmount = inputTokenAmount
    .mul(toWei(100, sellToken.decimals))
    .div(toWei(100 - slippagePercents, sellToken.decimals))
  console.log(
    displayFromWei(inputTokenAmount, 2, sellToken.decimals),
    sellToken.decimals
  )

  return { tradeData: positionQuotes, inputTokenAmount }
}

export const getLeveragedExchangeIssuanceQuotes = async (
  setToken: Token,
  setTokenAmount: string,
  paymentToken: Token,
  isIssuance: boolean,
  chainId: ChainId = ChainId.Mainnet,
  library: ethers.providers.Web3Provider | undefined
): Promise<LeveragedExchangeIssuanceQuote | null> => {
  const tokenSymbol = setToken.symbol
  const issuanceModule = getIssuanceModule(tokenSymbol, chainId)
  const setTokenAmountWei = toWei(setTokenAmount, setToken.decimals)
  console.log('Getting issuance quotes')
  console.log(
    'fetching...',
    setTokenAmount.toString(),
    setToken.symbol,
    setToken.address,
    issuanceModule
  )

  const setTokenAddress =
    chainId === ChainId.Polygon ? setToken.polygonAddress : setToken.address
  const contract = await getExchangeIssuanceLeveragedContract(
    library?.getSigner(),
    chainId
  )
  const leveragedTokenData: LeveragedTokenData = await getLeveragedTokenData(
    contract,
    setTokenAddress ?? '',
    setTokenAmountWei,
    isIssuance
  )
  console.log('Leveraged Token Data', leveragedTokenData)

  const { swapDataDebtCollateral, collateralObtained } =
    await getSwapDataDebtCollateral(leveragedTokenData, chainId)

  const collateralShortfall =
    leveragedTokenData.collateralAmount.sub(collateralObtained)

  console.log('PAYMENT TOKEN', paymentToken)
  const WMATIC_ADDRESS = '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270'
  let paymentTokenAddress =
    chainId === ChainId.Polygon && paymentToken.symbol === 'MATIC'
      ? WMATIC_ADDRESS
      : chainId === ChainId.Polygon
      ? paymentToken.polygonAddress
      : paymentToken.address
  if (paymentToken.symbol === 'ETH') {
    paymentTokenAddress = 'ETH'
  }

  const { swapData: swapDataPaymentToken, zeroExQuote } = await getSwapData(
    {
      buyToken: leveragedTokenData.collateralToken,
      buyAmount: collateralShortfall.toString(),
      sellToken: paymentTokenAddress,
    },
    chainId
  )

  const inputTokenAmount = BigNumber.from(zeroExQuote.sellAmount)

  return { swapDataDebtCollateral, swapDataPaymentToken, inputTokenAmount }
}

const getSwapDataDebtCollateral = async (
  leveragedTokenData: LeveragedTokenData,
  chainId: ChainId = ChainId.Polygon
) => {
  const { swapData: swapDataDebtCollateral, zeroExQuote } = await getSwapData(
    {
      buyToken: leveragedTokenData.collateralToken,
      sellToken: leveragedTokenData.debtToken,
      sellAmount: leveragedTokenData.debtAmount.toString(),
    },
    chainId
  )
  const collateralObtained = BigNumber.from(zeroExQuote.buyAmount)
  return { swapDataDebtCollateral, collateralObtained }
}

const getSwapData = async (params: any, chainId: number = 137) => {
  // TODO: error handling (for INSUFFICIENT_ASSET_LIQUIDITY)
  const zeroExQuote = await get0xQuote(
    {
      ...params,
      slippagePercentage: 0.5,
      //TODO: Allow Quickswap and UniV3
      includedSources: 'SushiSwap',
    },
    chainId
  )
  // TODO: ?
  const swapData = {
    exchange: Exchange.Sushiswap,
    path: zeroExQuote.orders[0].fillData.tokenAddressPath,
    fees: [],
    pool: '0x0000000000000000000000000000000000000000',
  }
  return { swapData, zeroExQuote }
}
