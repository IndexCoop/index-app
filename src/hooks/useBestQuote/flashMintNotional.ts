import { BigNumber } from '@ethersproject/bignumber'
import { JsonRpcProvider } from '@ethersproject/providers'

import { DefaultGasLimitFlashMintNotional } from 'constants/gas'
import { DAI, FIXED_DAI, FIXED_USDC, Token, USDC } from 'constants/tokens'
import { getFullCostsInUsd, getGasCostsInUsd } from 'utils/costs'
import { getFlashMintNotionalQuote } from 'utils/flashMintNotional/fmNotionalQuote'
import { getFlashMintNotionalTransaction } from 'utils/flashMintNotional/fmNotionalTransaction'
import { GasEstimatooor } from 'utils/gasEstimatooor'
import { TxSimulator } from 'utils/simulator'

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
      const tx = await getFlashMintNotionalTransaction(
        isMinting,
        inputToken,
        outputToken,
        quote.indexTokenAmount,
        quote.inputOutputTokenAmount,
        quote.swapData,
        slippage,
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
        DefaultGasLimitFlashMintNotional
      )
      const gasEstimatooor = new GasEstimatooor(signer, defaultGasEstimate)
      // We don't want this function to fail for estimates here.
      // A default will be returned if the tx would fail.
      const canFail = false
      const gasEstimate = await gasEstimatooor.estimate(tx, canFail)
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
