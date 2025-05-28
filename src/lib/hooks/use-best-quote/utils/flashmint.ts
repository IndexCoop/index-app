import { formatWei, parseUnits } from '@/lib/utils'
import { getFullCostsInUsd } from '@/lib/utils/costs'
import { getGasLimit } from '@/lib/utils/gas'
import { getFlashMintGasDefault } from '@/lib/utils/gas-defaults'
import { getAddressForToken } from '@/lib/utils/tokens'

import {
  type IndexQuoteRequest,
  type Quote,
  type QuoteTransaction,
  QuoteType,
} from '../types'

import { getIndexTokenAmount } from './index-token-amount'
import { getPriceImpact } from './price-impact'

import type { IndexQuoteRequest as ApiIndexQuoteRequest } from '@/app/api/quote/route'
import type { Token } from '@/constants/tokens'
import type { GetApiV2QuoteQuery } from '@/gen'
import type { IndexRpcProvider } from '@/lib/hooks/use-wallet'
import type { Hex } from 'viem'

const MAX_ITERATIONS_FIXED_INPUT = 10
// Maximum deviation from target fixed input to allow
const MAX_DEVIATIION_FIXED_INPUT = BigInt(5)

type QuoteError = {
  type?: string
  message: string
}

export const isQuoteError = (quote: unknown): quote is QuoteError => {
  return typeof quote === 'object' && quote !== null && 'message' in quote
}

async function getEnhancedFlashMintQuote(
  account: string,
  isMinting: boolean,
  inputToken: Token,
  outputToken: Token,
  indexTokenAmount: bigint,
  inputTokenAmount: bigint,
  inputTokenPrice: number,
  outputTokenPrice: number,
  slippage: number,
  chainId: number,
  publicClient: IndexRpcProvider,
): Promise<Quote | QuoteError> {
  const inputTokenAddress = getAddressForToken(inputToken.symbol, chainId)
  const outputTokenAddress = getAddressForToken(outputToken.symbol, chainId)

  if (!inputTokenAddress || !outputTokenAddress) {
    return {
      type: 'UnknownToken',
      message: 'Unknown input/output token',
    }
  }

  const indexToken = isMinting ? outputToken : inputToken
  // const inputOutputToken = isMinting ? inputToken : outputToken

  // // Allow only supported currencies
  // const currencies = getCurrencyTokensForIndex(indexToken, chainId)
  // const isAllowedCurrency =
  //   currencies.filter((curr) => curr.symbol === inputOutputToken.symbol)
  //     .length > 0

  // if (!isAllowedCurrency) {
  //   return {
  //     type: 'CurrencyNotAllowed',
  //     message: 'Currency not allowed',
  //   }
  // }

  try {
    const request: ApiIndexQuoteRequest = {
      chainId,
      account,
      inputToken: inputTokenAddress,
      outputToken: outputTokenAddress,
      inputAmount: inputTokenAmount.toString(),
      // Since for redeeming input and index token amount are the same, this is
      // basically only relevant for minting.
      outputAmount: indexTokenAmount.toString(),
      slippage,
    }

    const response = await fetch('/api/quote', {
      method: 'POST',
      body: JSON.stringify(request),
    })

    const result = await response.json()

    if (response.status === 200) {
      const quoteFM = result as GetApiV2QuoteQuery['Response']

      const {
        inputAmount: quoteInputAmount,
        outputAmount: quoteOutputAmount,
        quoteAmount: quoteQuoteAmount,
        transaction: tx,
        fees,
      } = quoteFM

      const inputAmount = BigInt(quoteInputAmount)
      const outputAmount = BigInt(quoteOutputAmount)
      const quoteAmount = BigInt(quoteQuoteAmount)
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
      const { ethPrice, gas } = await getGasLimit(
        transaction,
        defaultGasEstimate,
        publicClient,
      )
      transaction.gas = gas.limit

      const inputTokenAmountUsd =
        Number.parseFloat(formatWei(inputAmount, inputToken.decimals)) *
        inputTokenPrice
      const outputTokenAmountUsd =
        Number.parseFloat(formatWei(outputAmount, outputToken.decimals)) *
        outputTokenPrice
      const quoteAmountUsd =
        Number.parseFloat(
          formatWei(
            quoteAmount,
            isMinting ? inputToken.decimals : outputToken.decimals,
          ),
        ) * (isMinting ? inputTokenPrice : outputTokenPrice)

      const priceImpact = getPriceImpact(
        isMinting ? quoteAmountUsd : outputTokenAmountUsd,
        isMinting ? outputTokenAmountUsd : quoteAmountUsd,
      )

      const outputTokenAmountUsdAfterFees = outputTokenAmountUsd - gas.costsUsd

      const fullCostsInUsd = getFullCostsInUsd(
        inputAmount,
        gas.limit * gas.price,
        inputToken.decimals,
        inputTokenPrice,
        ethPrice,
      )

      // includes swap fee (which we can't distinguish for now)
      const mintRedeemFees = isMinting ? fees.mint : fees.redeem
      const mintRedeemFeesUsd = inputTokenAmountUsd * mintRedeemFees
      const priceImpactUsd =
        (isMinting ? quoteAmountUsd : inputTokenAmountUsd) -
        (isMinting ? outputTokenAmountUsd : quoteAmountUsd) -
        mintRedeemFeesUsd
      const priceImpactPercent = (priceImpactUsd / inputTokenAmountUsd) * 100

      const isHighPriceImpact = priceImpactPercent > 2

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
        quoteAmount,
        quoteAmountUsd,
        inputTokenAmount: inputAmount,
        inputTokenAmountUsd,
        outputTokenAmount: outputAmount,
        outputTokenAmountUsd,
        outputTokenAmountUsdAfterFees,
        inputTokenPrice,
        outputTokenPrice,
        fees,
        priceImpactUsd,
        priceImpactPercent,
        slippage,
        warning: isHighPriceImpact ? 'Price impact is high.' : undefined,
        tx: transaction,
      }
    } else {
      return result as GetApiV2QuoteQuery['Errors']
    }
  } catch (e) {
    console.warn('Error fetching FlashMintQuote', e)
  }

  return {
    type: 'QuoteNotFound',
    message: 'Unknown error',
  }
}

interface FlashMintQuoteRequest extends IndexQuoteRequest {
  account: string
  chainId: number
  inputTokenAmountWei: bigint
}

export async function getFlashMintQuote(
  request: FlashMintQuoteRequest,
  publicClient: IndexRpcProvider,
) {
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

  let remainingIterations = MAX_ITERATIONS_FIXED_INPUT
  let factor = BigInt(0)
  let currentInputAmount = inputTokenAmountWei
  const targetInputAmount = currentInputAmount

  while (
    remainingIterations > 0 &&
    factor != null &&
    currentInputAmount != null &&
    (Math.abs(Number(factor) - 10000) > MAX_DEVIATIION_FIXED_INPUT ||
      currentInputAmount > inputTokenAmountWei)
  ) {
    const flashmintQuoteResult = await getEnhancedFlashMintQuote(
      account,
      isMinting,
      inputToken,
      outputToken,
      indexTokenAmount,
      parseUnits(inputTokenAmount, inputToken.decimals),
      inputTokenPrice,
      outputTokenPrice,
      slippage,
      chainId,
      publicClient,
    )

    // If there is no FlashMint quote, return immediately
    if (isQuoteError(flashmintQuoteResult)) return flashmintQuoteResult
    // For redeeming return quote immdediately
    if (!isMinting) return flashmintQuoteResult
    savedQuote = flashmintQuoteResult
    currentInputAmount = flashmintQuoteResult.inputTokenAmount

    factor = (BigInt(10000) * targetInputAmount) / currentInputAmount

    if (factor < 1) {
      factor = BigInt(1)
    }

    indexTokenAmount = (indexTokenAmount * factor) / BigInt(10000)
    remainingIterations--
  }

  if (currentInputAmount > inputTokenAmountWei) {
    throw new Error(
      `Optimization result ${currentInputAmount} is higher than user input ${inputTokenAmountWei}`,
    )
  }

  if (Math.abs(Number(factor) - 10000) > MAX_DEVIATIION_FIXED_INPUT) {
    throw new Error(
      `Could not determine index amount to get within ${MAX_DEVIATIION_FIXED_INPUT} BP from given target input, final factor ${factor}`,
    )
  }

  return savedQuote
}
