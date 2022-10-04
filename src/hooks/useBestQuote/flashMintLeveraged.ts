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
import { getFullCostsInUsd, getGasCostsInUsd } from 'utils/costs'
import { getFlashMintLeveragedGasEstimate } from 'utils/flashMintLeveragedGasEstimate'

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

export async function getEnhancedFlashMintLeveragedQuote(
  isMinting: boolean,
  inputTokenAddress: string,
  outputTokenAddress: string,
  inputTokenBalance: BigNumber,
  sellToken: Token,
  buyToken: Token,
  indexTokenAmount: BigNumber,
  sellTokenPrice: number,
  nativeTokenPrice: number,
  gasPrice: BigNumber,
  slippage: number,
  chainId: number,
  provider: JsonRpcProvider,
  zeroExApi: ZeroExApi,
  signer: any
): Promise<ExchangeIssuanceLeveragedQuote | null> {
  const tokenEligibleForLeveragedEI = isEligibleTradePair(
    sellToken,
    buyToken,
    isMinting
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
      indexTokenAmount,
      isMinting,
      slippage,
      zeroExApi,
      provider,
      chainId ?? 1
    )
    if (quoteLeveraged) {
      // We don't want this function to fail for estimates here.
      // A default will be returned if the tx would fail.
      const canFail = false
      const gasEstimate = await getFlashMintLeveragedGasEstimate(
        isMinting,
        sellToken,
        buyToken,
        indexTokenAmount,
        quoteLeveraged.inputOutputTokenAmount,
        inputTokenBalance,
        quoteLeveraged.swapDataDebtCollateral,
        quoteLeveraged.swapDataPaymentToken,
        provider,
        signer,
        chainId,
        canFail
      )
      const gasCosts = gasEstimate.mul(gasPrice)
      const gasCostsInUsd = getGasCostsInUsd(gasCosts, nativeTokenPrice)
      return {
        type: QuoteType.exchangeIssuanceLeveraged,
        isMinting,
        inputToken: sellToken,
        outputToken: buyToken,
        gas: gasEstimate,
        gasPrice,
        gasCosts,
        gasCostsInUsd,
        fullCostsInUsd: getFullCostsInUsd(
          quoteLeveraged.inputOutputTokenAmount,
          gasEstimate.mul(gasPrice),
          sellToken.decimals,
          sellTokenPrice,
          nativeTokenPrice
        ),
        priceImpact: 0,
        indexTokenAmount,
        inputOutputTokenAmount: quoteLeveraged.inputOutputTokenAmount,
        // type specific properties
        swapDataDebtCollateral: quoteLeveraged.swapDataDebtCollateral,
        swapDataPaymentToken: quoteLeveraged.swapDataPaymentToken,
      }
    }
  } catch (e) {
    console.warn('Error generating quote from FlashMintLeveraged', e)
  }
  return null
}
