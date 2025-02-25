import { Hex } from 'viem'

import { formatWei, parseUnits } from '@/lib/utils'
import { getFullCostsInUsd, getGasCostsInUsd } from '@/lib/utils/costs'
import { getAddressForToken } from '@/lib/utils/tokens'

import { IndexQuoteRequest, QuoteType, ZeroExQuote } from '../types'

import { getPriceImpact } from './price-impact'

interface ExtendedIndexQuoteRequest extends IndexQuoteRequest {
  chainId: number
  address: string
  nativeTokenPrice: number
}

export async function getIndexQuote(
  request: ExtendedIndexQuoteRequest,
): Promise<ZeroExQuote | null> {
  const {
    chainId,
    address,
    inputToken,
    inputTokenAmount,
    inputTokenPrice,
    isMinting,
    nativeTokenPrice,
    outputToken,
    outputTokenPrice,
    slippage,
  } = request
  try {
    const inputAmount = parseUnits(inputTokenAmount, inputToken.decimals)
    const inputTokenAddress = getAddressForToken(inputToken.symbol, chainId)
    const outputTokenAddress = getAddressForToken(outputToken.symbol, chainId)
    const swapQuoteRequest = {
      chainId: chainId.toString(),
      account: address,
      inputToken: inputTokenAddress,
      outputToken: outputTokenAddress,
      inputAmount: inputAmount.toString(),
      slippage: slippage.toString(),
    }
    const response = await fetch('/api/quote/swap', {
      method: 'POST',
      body: JSON.stringify(swapQuoteRequest),
    })

    const swapQuote = await response.json()
    if (swapQuote) {
      const { contract, outputAmount, rawResponse, transaction } = swapQuote

      const tx = {
        ...transaction,
        account: address,
        chainId: transaction.chainId ?? 1,
        data: transaction.data as Hex,
        from: address,
        gas: BigInt(transaction.gasLimit ?? '0'),
        gasPrice: BigInt(transaction.gasPrice ?? '0'),
        to: transaction.to,
        value: BigInt(transaction.value),
      }

      let gasCosts = BigInt('0')
      let gasLimit = BigInt('0')
      let gasPrice = tx.gasPrice
      const estimate = rawResponse.estimate
      gasLimit = BigInt(estimate?.gasCosts[0].limit ?? '0')
      gasPrice = BigInt(estimate?.gasCosts[0].price ?? '0')
      gasCosts = gasPrice * gasLimit
      const gasCostsInUsd = getGasCostsInUsd(gasCosts, nativeTokenPrice)

      const inputTokenAmountBn = parseUnits(
        inputTokenAmount,
        inputToken.decimals,
      )
      const outputTokenAmount = BigInt(outputAmount)

      const inputTokenAmountUsd = parseFloat(inputTokenAmount) * inputTokenPrice
      const outputTokenAmountUsd =
        parseFloat(formatWei(outputTokenAmount, outputToken.decimals)) *
        outputTokenPrice
      const priceImpact = getPriceImpact(
        inputTokenAmountUsd,
        outputTokenAmountUsd,
      )

      const outputTokenAmountUsdAfterFees = outputTokenAmountUsd - gasCostsInUsd

      const fullCostsInUsd = getFullCostsInUsd(
        inputTokenAmountBn,
        gasCosts,
        inputToken.decimals,
        inputTokenPrice,
        nativeTokenPrice,
      )

      // includes swap fee (which we can't distinguish for now)
      const priceImpactUsd = inputTokenAmountUsd - outputTokenAmountUsd
      const priceImpactPercent = (priceImpactUsd / inputTokenAmountUsd) * 100

      return {
        type: QuoteType.index,
        chainId,
        contract,
        isMinting,
        inputToken,
        outputToken,
        gas: gasLimit,
        gasPrice,
        gasCosts,
        gasCostsInUsd,
        fullCostsInUsd,
        priceImpact,
        indexTokenAmount: isMinting ? outputTokenAmount : inputTokenAmountBn,
        inputOutputTokenAmount: isMinting
          ? inputTokenAmountBn
          : outputTokenAmount,
        inputTokenAmount: inputTokenAmountBn,
        inputTokenAmountUsd,
        outputTokenAmount,
        outputTokenAmountUsd,
        outputTokenAmountUsdAfterFees,
        inputTokenPrice,
        outputTokenPrice,
        priceImpactUsd,
        priceImpactPercent,
        slippage,
        tx,
        fees: {
          mint: 0,
          mintUsd: 0,
          redeem: 0,
          redeemUsd: 0,
          streaming: 0,
          streamingUsd: 0,
        },
        // 0x type specific properties (will change with interface changes to the quote API)
        minOutput: BigInt(estimate.toAmountMin),
        sources: [{ name: estimate.tool, proportion: '1' }],
      }
    }
  } catch (err) {
    console.warn('Error fetching Index quote', err)
  }
  return null
}
