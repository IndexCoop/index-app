import {
  getQuote,
  IndexQuoteRequest as ApiIndexQuoteRequest,
} from '@/lib/actions/quote'
import { parseUnits } from '@/lib/utils'
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

import type { GetApiV2QuoteQuery } from '@/gen'
import type { IndexRpcProvider } from '@/lib/hooks/use-wallet'
import type { Hex } from 'viem'

type QuoteError = {
  type?: string
  message: string
}

export const isQuoteError = (quote: unknown): quote is QuoteError => {
  return typeof quote === 'object' && quote !== null && 'message' in quote
}

interface FlashMintQuoteRequest extends IndexQuoteRequest {
  account: string
  chainId: number
  inputTokenAmountWei: bigint
}

export async function getFlashMintQuote(
  request: FlashMintQuoteRequest,
  publicClient: IndexRpcProvider,
): Promise<Quote | QuoteError> {
  const { chainId, account, inputToken, isMinting, outputToken, slippage } =
    request

  const inputTokenAddress = getAddressForToken(inputToken.symbol, chainId)
  const outputTokenAddress = getAddressForToken(outputToken.symbol, chainId)

  if (!inputTokenAddress || !outputTokenAddress) {
    return {
      type: 'UnknownToken',
      message: 'Unknown input/output token',
    }
  }

  const indexToken = isMinting ? outputToken : inputToken
  const inputTokenAmount = parseUnits(
    request.inputTokenAmount,
    inputToken.decimals,
  )

  try {
    const request: ApiIndexQuoteRequest = {
      chainId,
      account,
      inputToken: inputTokenAddress,
      outputToken: outputTokenAddress,
      inputAmount: inputTokenAmount.toString(),
      slippage,
    }

    const { data: result, status } = await getQuote(request)

    if (status === 200) {
      const quoteFM = result as GetApiV2QuoteQuery['Response']

      const {
        inputAmount: quoteInputAmount,
        outputAmount: quoteOutputAmount,
        quoteAmount: quoteQuoteAmount,
        transaction: tx,
      } = quoteFM

      const inputAmount = BigInt(quoteInputAmount)
      const outputAmount = BigInt(quoteOutputAmount)
      const quoteAmount = BigInt(quoteQuoteAmount)

      const transaction: QuoteTransaction = {
        account,
        chainId,
        from: account as `0x${string}`,
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

      const fullCostsInUsd = getFullCostsInUsd(
        inputAmount,
        gas.limit * gas.price,
        inputToken.decimals,
        quoteFM.inputTokenPrice,
        ethPrice,
      )

      const isHighPriceImpact = quoteFM.priceImpactPercent > 2

      const outputTokenAmountUsdAfterFees =
        quoteFM.outputAmountUsd - gas.costsUsd

      return {
        ...quoteFM,
        type: QuoteType.flashmint,
        inputToken,
        outputToken,
        gas: gas.limit,
        gasPrice: gas.price,
        gasCosts: gas.costs,
        gasCostsInUsd: gas.costsUsd,
        fullCostsInUsd,
        indexTokenAmount: BigInt(quoteFM.indexTokenAmount),
        inputOutputTokenAmount: isMinting ? inputAmount : outputAmount,
        quoteAmount,
        inputTokenAmount: inputAmount,
        inputTokenAmountUsd: quoteFM.inputAmountUsd,
        outputTokenAmount: outputAmount,
        outputTokenAmountUsd: quoteFM.outputAmountUsd,
        outputTokenAmountUsdAfterFees,
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
