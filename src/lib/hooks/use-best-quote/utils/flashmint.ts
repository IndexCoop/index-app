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

import { getPriceImpact } from './price-impact'

import type { IndexQuoteRequest as ApiIndexQuoteRequest } from '@/app/api/quote/route'
import type { Token } from '@/constants/tokens'
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

async function getEnhancedFlashMintQuote(
  account: string,
  isMinting: boolean,
  inputToken: Token,
  outputToken: Token,
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

  try {
    const request: ApiIndexQuoteRequest = {
      chainId,
      account,
      inputToken: inputTokenAddress,
      outputToken: outputTokenAddress,
      inputAmount: inputTokenAmount.toString(),
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
        indexTokenAmount: BigInt(quoteFM.indexTokenAmount),
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
    inputTokenPrice,
    isMinting,
    outputToken,
    outputTokenPrice,
    slippage,
  } = request

  const flashmintQuoteResult = await getEnhancedFlashMintQuote(
    account,
    isMinting,
    inputToken,
    outputToken,
    parseUnits(inputTokenAmount, inputToken.decimals),
    inputTokenPrice,
    outputTokenPrice,
    slippage,
    chainId,
    publicClient,
  )

  return flashmintQuoteResult
}
