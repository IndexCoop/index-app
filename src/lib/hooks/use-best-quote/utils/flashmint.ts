import { BigNumber } from '@ethersproject/bignumber'
import { toHex } from 'viem'

import { IndexQuoteRequest as ApiIndexQuoteRequest } from '@/app/api/quote/route'
import { Token } from '@/constants/tokens'
import { IndexRpcProvider } from '@/lib/hooks/use-wallet'
import { formatWei } from '@/lib/utils'
import { getFullCostsInUsd, getGasCostsInUsd } from '@/lib/utils/costs'
import { getFlashMintGasDefault } from '@/lib/utils/gas-defaults'
import { GasEstimatooor } from '@/lib/utils/gas-estimatooor'
import {
  getAddressForToken,
  getCurrencyTokensForIndex,
} from '@/lib/utils/tokens'

import { IndexQuoteRequest, Quote, QuoteTransaction, QuoteType } from '../types'

import { getIndexTokenAmount } from './index-token-amount'
import { getPriceImpact } from './price-impact'

async function getEnhancedFlashMintQuote(
  account: string,
  isMinting: boolean,
  inputToken: Token,
  outputToken: Token,
  indexTokenAmount: bigint,
  inputTokenPrice: number,
  outputTokenPrice: number,
  nativeTokenPrice: number,
  gasPrice: bigint,
  slippage: number,
  chainId: number,
  provider: IndexRpcProvider,
): Promise<Quote | null> {
  const inputTokenAddress = getAddressForToken(inputToken, chainId)
  const outputTokenAddress = getAddressForToken(outputToken, chainId)

  if (!inputTokenAddress || !outputTokenAddress) {
    console.warn('Error unkown input/output token')
    return null
  }

  const indexToken = isMinting ? outputToken : inputToken
  const inputOutputToken = isMinting ? inputToken : outputToken

  const currencies = getCurrencyTokensForIndex(indexToken, chainId)
  // Allow only supported currencies
  const isAllowedCurrency =
    currencies.filter((curr) => curr.symbol === inputOutputToken.symbol)
      .length > 0
  if (!isAllowedCurrency) {
    console.warn('Currency not allowed')
    return null
  }

  try {
    const request: ApiIndexQuoteRequest = {
      chainId,
      account,
      inputToken: inputTokenAddress,
      outputToken: outputTokenAddress,
      slippage,
    }

    if (isMinting) {
      request.outputAmount = indexTokenAmount.toString()
    } else {
      request.inputAmount = indexTokenAmount.toString()
    }

    const response = await fetch('/api/quote', {
      method: 'POST',
      body: JSON.stringify(request),
    })
    const quoteFM = await response.json()
    console.log(quoteFM)
    if (quoteFM) {
      const { inputAmount, outputAmount, transaction: tx } = quoteFM
      const inputOutputAmount = isMinting
        ? BigInt(inputAmount)
        : BigInt(outputAmount)
      const transaction: QuoteTransaction = {
        account,
        chainId,
        from: account,
        to: tx.to,
        data: toHex(tx.data),
        value: tx.value ? BigNumber.from(tx.value) : undefined,
      }
      const defaultGas = getFlashMintGasDefault(indexToken.symbol)
      const defaultGasEstimate = BigInt(defaultGas)
      const gasEstimatooor = new GasEstimatooor(provider, defaultGasEstimate)
      // We don't want this function to fail for estimates here.
      // A default will be returned if the tx would fail.
      const canFail = false
      const gasEstimate = await gasEstimatooor.estimate(transaction, canFail)
      const gasCosts = gasEstimate * gasPrice
      const gasCostsInUsd = getGasCostsInUsd(gasCosts, nativeTokenPrice)
      transaction.gasLimit = BigNumber.from(gasEstimate.toString())

      const inputTokenAmountUsd =
        parseFloat(formatWei(inputAmount, inputToken.decimals)) *
        inputTokenPrice
      const outputTokenAmountUsd =
        parseFloat(formatWei(outputAmount, outputToken.decimals)) *
        outputTokenPrice
      const priceImpact = getPriceImpact(
        inputTokenAmountUsd,
        outputTokenAmountUsd,
      )

      const outputTokenAmountUsdAfterFees = outputTokenAmountUsd - gasCostsInUsd

      const fullCostsInUsd = getFullCostsInUsd(
        inputAmount,
        gasEstimate * gasPrice,
        inputToken.decimals,
        inputTokenPrice,
        nativeTokenPrice,
      )

      return {
        type: QuoteType.flashmint,
        chainId,
        contract: quoteFM.contract,
        isMinting,
        inputToken,
        outputToken,
        gas: gasEstimate,
        gasPrice,
        gasCosts,
        gasCostsInUsd,
        fullCostsInUsd,
        priceImpact,
        indexTokenAmount,
        inputOutputTokenAmount: inputOutputAmount,
        inputTokenAmount: inputAmount,
        inputTokenAmountUsd,
        outputTokenAmount: outputAmount,
        outputTokenAmountUsd,
        outputTokenAmountUsdAfterFees,
        inputTokenPrice,
        outputTokenPrice,
        slippage,
        tx: transaction,
      }
    }
  } catch (e) {
    console.warn('Error fetching FlashMintQuote', e)
  }
  return null
}

interface FlashMintQuoteRequest extends IndexQuoteRequest {
  account: string
  chainId: number
  inputTokenAmountWei: bigint
  nativeTokenPrice: number
}

export async function getFlashMintQuote(
  request: FlashMintQuoteRequest,
  provider: IndexRpcProvider,
) {
  const {
    chainId,
    account,
    inputToken,
    inputTokenAmount,
    inputTokenAmountWei,
    inputTokenPrice,
    isMinting,
    nativeTokenPrice,
    outputToken,
    outputTokenPrice,
    slippage,
  } = request

  /* Determine initial index token amount based on different factors */
  let indexTokenAmount = getIndexTokenAmount(
    isMinting,
    inputTokenAmount,
    inputToken.decimals,
    outputToken.decimals,
    inputTokenPrice,
    outputTokenPrice,
  )

  const gasPrice = await provider.getGasPrice()

  let savedQuote: Quote | null = null

  for (let t = 2; t > 0; t--) {
    const flashMintQuote = await getEnhancedFlashMintQuote(
      account,
      isMinting,
      inputToken,
      outputToken,
      indexTokenAmount,
      inputTokenPrice,
      outputTokenPrice,
      nativeTokenPrice,
      gasPrice,
      slippage,
      chainId,
      provider,
    )
    // If there is no FlashMint quote, return immediately
    if (flashMintQuote === null) return savedQuote
    // For redeeming return quote immdediately
    if (!isMinting) return flashMintQuote
    savedQuote = flashMintQuote

    const diff = inputTokenAmountWei - flashMintQuote.inputTokenAmount
    const factor = determineFactor(diff, inputTokenAmountWei)

    indexTokenAmount = (indexTokenAmount * factor) / BigInt(10000)

    if (diff < 0 && t === 1) {
      t++ // loop one more time to stay under the input amount
    }
  }

  return savedQuote
}

const determineFactor = (diff: bigint, inputTokenAmount: bigint): bigint => {
  let ratio = Number(diff.toString()) / Number(inputTokenAmount.toString())
  if (Math.abs(ratio) < 0.0001) {
    // This is currently needed to avoid infinite loops
    ratio = diff < 0 ? -0.0001 : 0.0001
  }
  return BigInt(Math.round((1 + ratio) * 10000))
}
