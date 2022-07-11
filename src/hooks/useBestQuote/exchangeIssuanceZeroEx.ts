import { BigNumber } from '@ethersproject/bignumber'
import { JsonRpcProvider } from '@ethersproject/providers'
import {
  getExchangeIssuanceZeroExQuote,
  ZeroExApi,
} from '@indexcoop/index-exchange-issuance-sdk'

import { MAINNET } from 'constants/chains'
import { icETHIndex, IndexToken, JPGIndex, Token } from 'constants/tokens'
import { getExchangeIssuanceGasEstimate } from 'utils/exchangeIssuanceGasEstimate'
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

  if (
    inputToken.symbol === JPGIndex.symbol ||
    outputToken.symbol === JPGIndex.symbol
  )
    // temporarily - disabled JPG for EI0x
    return false

  return true
}

export async function getEIZeroExQuote(
  isIssuance: boolean,
  inputTokenAddress: string,
  outputTokenAddress: string,
  inputTokenBalance: BigNumber,
  sellToken: Token,
  buyToken: Token,
  setTokenAmount: BigNumber,
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
    const quote0x = await getExchangeIssuanceZeroExQuote(
      inputToken,
      outputToken,
      setTokenAmount,
      isIssuance,
      slippage,
      zeroExApi,
      provider,
      chainId
    )
    if (quote0x) {
      const gasEstimate = await getExchangeIssuanceGasEstimate(
        provider,
        chainId,
        isIssuance,
        sellToken,
        buyToken,
        setTokenAmount,
        quote0x.inputOutputTokenAmount,
        spendingTokenBalance,
        quote0x.componentQuotes, 
        signer
      )
      return {
        type: QuoteType.exchangeIssuanceZeroEx,
        isIssuance,
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
        setTokenAmount,
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
