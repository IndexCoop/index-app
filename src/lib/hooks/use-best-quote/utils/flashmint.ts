import { Hex } from 'viem'

import { IndexQuoteRequest as ApiIndexQuoteRequest } from '@/app/api/quote/route'
import { Token } from '@/constants/tokens'
import { formatWei } from '@/lib/utils'
import { getFullCostsInUsd } from '@/lib/utils/costs'
import { getGasLimit } from '@/lib/utils/gas'
import { getFlashMintGasDefault } from '@/lib/utils/gas-defaults'
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
  slippage: number,
  chainId: number,
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
    if (quoteFM) {
      const {
        inputAmount: quoteInputAmount,
        outputAmount: quoteOutputAmount,
        transaction: tx,
      } = quoteFM

      const inputAmount = BigInt(quoteInputAmount)
      const outputAmount = BigInt(quoteOutputAmount)
      const inputOutputAmount = isMinting ? inputAmount : outputAmount

      const transaction: QuoteTransaction = {
        account,
        chainId,
        from: account,
        to: tx.to,
        data: tx.data as Hex,
        value: tx.value ? BigInt(tx.value.hex) : undefined,
      }

      const defaultGas = getFlashMintGasDefault(indexToken.symbol)
      const defaultGasEstimate = BigInt(defaultGas)
      const res = await getGasLimit(transaction, defaultGasEstimate)
      if (!res?.gas) return null
      const { gas } = res
      transaction.gas = gas.limit

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

      const outputTokenAmountUsdAfterFees = outputTokenAmountUsd - gas.costsUsd

      const fullCostsInUsd = getFullCostsInUsd(
        inputAmount,
        gas.limit * gas.price,
        inputToken.decimals,
        inputTokenPrice,
        gas.priceEth,
      )

      return {
        type: QuoteType.flashmint,
        chainId,
        contract: quoteFM.contract,
        isMinting,
        inputToken,
        outputToken,
        gas: gas.limit,
        gasPrice: gas.price,
        gasCosts: gas.costs,
        gasCostsInUsd: gas.costsUsd,
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

export async function getFlashMintQuote(request: FlashMintQuoteRequest) {
  const {
    chainId,
    account,
    inputToken,
    inputTokenAmount,
    inputTokenAmountWei,
    inputTokenPrice,
    isMinting,
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
      slippage,
      chainId,
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
