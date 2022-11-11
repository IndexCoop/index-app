import { BigNumber } from '@ethersproject/bignumber'
import { JsonRpcProvider } from '@ethersproject/providers'

import { DAI, FIXED_DAI, FIXED_USDC, Token, USDC } from 'constants/tokens'
import { getFullCostsInUsd, getGasCostsInUsd } from 'utils/costs'
import { getFlashMintNotionalGasEstimate } from 'utils/flashMintNotional/fmNotionalGasEstimate'
import { getFlashMintNotionalQuote } from 'utils/flashMintNotional/fmNotionalQuote'

import { FlashMintNotionalQuote, QuoteType } from './'

export async function getEnhancedFlashMintNotionalQuote(
  isMinting: boolean,
  inputToken: Token,
  outputToken: Token,
  indexTokenAmount: BigNumber,
  gasPrice: BigNumber,
  inputTokenPrice: number,
  nativeTokenPrice: number,
  slippage: number,
  chainId: number,
  provider: JsonRpcProvider,
  signer: any
): Promise<FlashMintNotionalQuote | null> {
  const isTradablePair = isTradableForFlashMintNotional(inputToken, outputToken)
  if (!isTradablePair) return null

  const fixedTokenAddress = isMinting ? outputToken.address : inputToken.address
  const inputOutputTokenAddress = isMinting
    ? inputToken.address
    : outputToken.address

  try {
    const quote = await getFlashMintNotionalQuote(
      isMinting,
      fixedTokenAddress!,
      inputOutputTokenAddress!,
      indexTokenAmount,
      slippage,
      provider
    )
    if (quote) {
      const gasEstimate = await getFlashMintNotionalGasEstimate(
        isMinting,
        inputToken,
        outputToken,
        indexTokenAmount,
        quote.inputOutputTokenAmount,
        slippage,
        chainId,
        signer
      )
      const gasCosts = gasEstimate.mul(gasPrice)
      const gasCostsInUsd = getGasCostsInUsd(gasCosts, nativeTokenPrice)
      return {
        type: QuoteType.flashMintNotional,
        isMinting,
        inputToken,
        outputToken,
        gas: gasEstimate,
        gasPrice,
        gasCosts,
        gasCostsInUsd,
        fullCostsInUsd: getFullCostsInUsd(
          quote.inputOutputTokenAmount,
          gasEstimate.mul(gasPrice),
          inputToken.decimals,
          inputTokenPrice,
          nativeTokenPrice
        ),
        priceImpact: 0,
        indexTokenAmount,
        inputOutputTokenAmount: quote.inputOutputTokenAmount,
        // type specific properties
        swapData: quote.swapData,
      }
    }
  } catch (e) {
    console.warn('Error generating quote from FlashMintNotional', e)
  }
  return null
}

const isTradableForFlashMintNotional = (input: Token, output: Token) => {
  if (input.symbol === FIXED_DAI.symbol && output.symbol === DAI.symbol)
    return true
  if (input.symbol === DAI.symbol && output.symbol === FIXED_DAI.symbol)
    return true
  if (input.symbol === FIXED_USDC.symbol && output.symbol === USDC.symbol)
    return true
  if (input.symbol === USDC.symbol && output.symbol === FIXED_USDC.symbol)
    return true
  return false
}
