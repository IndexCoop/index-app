import { BigNumber } from '@ethersproject/bignumber'
import { JsonRpcProvider } from '@ethersproject/providers'
import {
  getFlashMintLeveragedQuote,
  ZeroExApi,
} from '@indexcoop/flash-mint-sdk'

import { DefaultGasLimitFlashMintLeveraged } from 'constants/gas'
import {
  eligibleLeveragedExchangeIssuanceTokens,
  Token,
} from 'constants/tokens'
import { getFullCostsInUsd, getGasCostsInUsd } from 'utils/costs'
import { getFlashMintLeveragedTransaction } from 'utils/flashMint/flashMintLeveragedTransaction'
import { GasEstimatooor } from 'utils/gasEstimatooor'
import { TxSimulator } from 'utils/simulator'
import { getCurrencyTokensForIndex } from 'utils/tokens'

import { ExchangeIssuanceLeveragedQuote, QuoteType } from './'

/* Determines if the token is eligible for Leveraged Exchange Issuance */
const isEligibleLeveragedToken = (token: Token) =>
  eligibleLeveragedExchangeIssuanceTokens.includes(token)

/* Determines if the token pair is eligible for Leveraged Exchange Issuance */
export const isEligibleTradePair = (
  inputToken: Token,
  outputToken: Token,
  chainId: number,
  isIssuance: boolean
) => {
  const indexToken = isIssuance ? outputToken : inputToken
  const inputOutputToken = isIssuance ? inputToken : outputToken
  const indexIsEligibleLeveragedToken = isEligibleLeveragedToken(indexToken)
  const supportedTokens = getCurrencyTokensForIndex(
    indexToken,
    chainId,
    isIssuance
  )
  const inputOutputTokenIsSupported =
    supportedTokens.filter((token) => token.symbol === inputOutputToken.symbol)
      .length > 0
  return indexIsEligibleLeveragedToken && inputOutputTokenIsSupported
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
    chainId,
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
      const { inputOutputTokenAmount } = quoteLeveraged
      let adjustedQuoteAmount = inputOutputTokenAmount
      if (inputToken.symbol === 'icETH' || outputToken.symbol === 'icETH') {
        adjustedQuoteAmount = isMinting
          ? inputOutputTokenAmount.mul(10001).div(10000)
          : inputOutputTokenAmount.mul(1000).div(1005)
      }
      const tx = await getFlashMintLeveragedTransaction(
        isMinting,
        sellToken,
        buyToken,
        indexTokenAmount,
        adjustedQuoteAmount,
        quoteLeveraged.swapDataDebtCollateral,
        quoteLeveraged.swapDataPaymentToken,
        provider,
        signer,
        chainId
      )

      if (!tx) throw new Error('No transaction object')

      // if (req) {
      //   const accessKey = process.env.REACT_APP_TENDERLY_ACCESS_KEY ?? ''
      //   const simulator = new TxSimulator(accessKey)
      //   await simulator.simulate(req)
      // }

      const defaultGasEstimate = BigNumber.from(
        DefaultGasLimitFlashMintLeveraged
      )
      const gasEstimatooor = new GasEstimatooor(signer, defaultGasEstimate)
      // We don't want this function to fail for estimates here.
      // A default will be returned if the tx would fail.
      const canFail = false
      const gasEstimate = await gasEstimatooor.estimate(tx, canFail)
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
