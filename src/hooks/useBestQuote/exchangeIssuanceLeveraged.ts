import { BigNumber } from '@ethersproject/bignumber'
import { JsonRpcProvider } from '@ethersproject/providers'
import {
  getFlashMintLeveragedQuote,
  ZeroExApi,
} from '@indexcoop/flash-mint-sdk'

import {
  eligibleLeveragedExchangeIssuanceTokens,
  ETH,
  icETHIndex,
  STETH,
  Token,
} from 'constants/tokens'
import { getFullCostsInUsd } from 'utils/exchangeIssuanceQuotes'

import { ExchangeIssuanceLeveragedQuote, QuoteType } from './'

/* Determines if the token is eligible for Leveraged Exchange Issuance */
const isEligibleLeveragedToken = (token: Token) =>
  eligibleLeveragedExchangeIssuanceTokens.includes(token)

/* Determines if the token pair is eligible for Leveraged Exchange Issuance */
export const isEligibleTradePair = (
  inputToken: Token,
  outputToken: Token,
  isIssuance: boolean
) => {
  const tokenEligible = isIssuance
    ? isEligibleLeveragedToken(outputToken)
    : isEligibleLeveragedToken(inputToken)

  const isIcEth =
    inputToken.symbol === icETHIndex.symbol ||
    outputToken.symbol === icETHIndex.symbol

  if (tokenEligible && isIcEth && isIssuance) {
    // Only ETH or stETH is allowed as input for icETH issuance at the moment
    return (
      inputToken.symbol === ETH.symbol || inputToken.symbol === STETH.symbol
    )
  }

  if (tokenEligible && isIcEth && !isIssuance) {
    // Only ETH is allowed as output for icETH redeeming at the moment
    return outputToken.symbol === ETH.symbol
  }

  return tokenEligible
}

export async function getEILeveragedQuote(
  isIssuance: boolean,
  inputTokenAddress: string,
  outputTokenAddress: string,
  sellToken: Token,
  buyToken: Token,
  setTokenAmount: BigNumber,
  sellTokenPrice: number,
  nativeTokenPrice: number,
  gasPrice: BigNumber,
  slippage: number,
  chainId: number,
  provider: JsonRpcProvider,
  zeroExApi: ZeroExApi
): Promise<ExchangeIssuanceLeveragedQuote | null> {
  const tokenEligibleForLeveragedEI = isEligibleTradePair(
    sellToken,
    buyToken,
    isIssuance
  )
  if (!tokenEligibleForLeveragedEI) return null

  const inputToken = {
    symbol: sellToken.symbol,
    decimals: sellToken.decimals,
    address: inputTokenAddress,
  }
  const outputToken = {
    symbol: buyToken.symbol,
    decimals: buyToken.decimals,
    address: outputTokenAddress,
  }

  try {
    const quoteLeveraged = await getFlashMintLeveragedQuote(
      inputToken,
      outputToken,
      setTokenAmount,
      isIssuance,
      slippage,
      zeroExApi,
      provider,
      chainId ?? 1
    )
    if (quoteLeveraged) {
      const gasLimit = BigNumber.from(1800000)
      return {
        type: QuoteType.exchangeIssuanceLeveraged,
        isIssuance,
        inputToken: sellToken,
        outputToken: buyToken,
        gas: gasLimit,
        gasPrice,
        gasCosts: gasLimit.mul(gasPrice),
        fullCostsInUsd: getFullCostsInUsd(
          quoteLeveraged.inputOutputTokenAmount,
          gasLimit.mul(gasPrice),
          sellToken.decimals,
          sellTokenPrice,
          nativeTokenPrice
        ),
        priceImpact: 0,
        setTokenAmount,
        inputOutputTokenAmount: quoteLeveraged.inputOutputTokenAmount,
        // type specific properties
        swapDataDebtCollateral: quoteLeveraged.swapDataDebtCollateral,
        swapDataPaymentToken: quoteLeveraged.swapDataPaymentToken,
      }
    }
  } catch (e) {
    console.warn('Error generating quote from EILeveraged', e)
  }
  return null
}
