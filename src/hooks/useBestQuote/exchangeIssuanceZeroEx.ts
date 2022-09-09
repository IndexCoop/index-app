import { BigNumber } from '@ethersproject/bignumber'
import { JsonRpcProvider } from '@ethersproject/providers'
import { getFlashMintZeroExQuote, ZeroExApi } from '@indexcoop/flash-mint-sdk'

import { MAINNET } from 'constants/chains'
import { icETHIndex, IndexToken, Token } from 'constants/tokens'
import { getFlashMintZeroExGasEstimate } from 'utils/flashMintZeroExGasEstimate'
import { getFullCostsInUsd } from 'utils/exchangeIssuanceQuotes'

import { ExchangeIssuanceZeroExQuote, QuoteType } from './'

export function isEligibleTradePairZeroEx(
  inputToken: Token,
  outputToken: Token
): boolean {
  if (
    inputToken.symbol === icETHIndex.symbol ||
    outputToken.symbol === icETHIndex.symbol
  )
    return false

  if (
    inputToken.symbol === IndexToken.symbol ||
    outputToken.symbol === IndexToken.symbol
  )
    return false

  return true
}

export async function getEnhancedFlashMintZeroExQuote(
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
): Promise<ExchangeIssuanceZeroExQuote | null> {
  if (chainId !== MAINNET.chainId) return null
  // For now only allow trade on mainnet, some tokens are disabled
  const isEligibleTradePair = isEligibleTradePairZeroEx(sellToken, buyToken)
  if (!isEligibleTradePair) return null

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
    const spendingTokenBalance = inputTokenBalance
    const quote0x = await getFlashMintZeroExQuote(
      inputToken,
      outputToken,
      indexTokenAmount,
      isMinting,
      slippage,
      zeroExApi,
      provider,
      chainId
    )
    if (quote0x) {
      // We don't want this function to fail for estimates here.
      // A default will be returned if the tx would fail.
      const canFail = false
      const gasEstimate = await getFlashMintZeroExGasEstimate(
        isMinting,
        sellToken,
        buyToken,
        indexTokenAmount,
        quote0x.inputOutputTokenAmount,
        spendingTokenBalance,
        quote0x.componentQuotes,
        signer,
        chainId,
        canFail
      )
      console.log(
        'GAS',
        gasEstimate.toString(),
        gasPrice.toString(),
        gasEstimate.mul(gasPrice).toString()
      )
      return {
        type: QuoteType.exchangeIssuanceZeroEx,
        isMinting,
        inputToken: sellToken,
        outputToken: buyToken,
        gas: gasEstimate,
        gasPrice,
        gasCosts: gasEstimate.mul(gasPrice),
        fullCostsInUsd: getFullCostsInUsd(
          quote0x.inputOutputTokenAmount,
          gasEstimate.mul(gasPrice),
          sellToken.decimals,
          sellTokenPrice,
          nativeTokenPrice
        ),
        priceImpact: 0,
        indexTokenAmount,
        inputOutputTokenAmount: quote0x.inputOutputTokenAmount,
        // type specific properties
        componentQuotes: quote0x.componentQuotes,
      }
    }
  } catch (e) {
    console.warn('error when generating zeroexei option', e)
  }

  return null
}
