import { Hex } from 'viem'

import { formatWei, parseUnits } from '@/lib/utils'
import { IndexApi } from '@/lib/utils/api/index-api'
import { getFullCostsInUsd, getGasCostsInUsd } from '@/lib/utils/costs'
import { getAddressForToken } from '@/lib/utils/tokens'

import { IndexQuoteRequest, QuoteType, ZeroExQuote } from '../types'

import { getPriceImpact } from './price-impact'

interface ExtendedIndexQuoteRequest extends IndexQuoteRequest {
  chainId: number
  address: string
  nativeTokenPrice: number
}

interface QuoteResponseTransaction {
  data: string
  to: string
  value: string
  gasPrice?: string
  gasLimit?: string
  from?: string
  chainId?: number
}

interface QuoteResponse {
  type: string
  chainId: number
  contract: string
  takerAddress: string
  inputToken: string
  outputToken: string
  inputAmount: string // in wei
  outputAmount: string // in wei
  rawResponse: any
  transaction: QuoteResponseTransaction
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
    const inputTokenAddress = getAddressForToken(inputToken, chainId)
    const outputTokenAddress = getAddressForToken(outputToken, chainId)
    const path = `/quote?takerAddress=${address}&inputToken=${inputTokenAddress}&outputToken=${outputTokenAddress}&inputAmount=${inputAmount.toString()}&chainId=${chainId}`
    console.log(path)
    const indexApi = new IndexApi()
    const res: QuoteResponse = await indexApi.get(path)

    const tx = {
      ...res.transaction,
      account: address,
      chainId: res.transaction.chainId ?? 1,
      data: res.transaction.data as Hex,
      from: address,
      gas: BigInt(res.transaction.gasLimit ?? '0'),
      gasPrice: BigInt(res.transaction.gasPrice ?? '0'),
      to: res.transaction.to,
      value: BigInt(res.transaction.value),
    }

    let gasCosts = BigInt('0')
    let gasLimit = BigInt('0')
    let gasPrice = tx.gasPrice
    const estimate = res.rawResponse.estimate
    const isLifiQuote = res.type === 'lifi'
    gasLimit = BigInt(estimate?.gasCosts[0].limit ?? '0')
    gasPrice = BigInt(estimate?.gasCosts[0].price ?? '0')
    gasCosts = gasPrice * gasLimit
    const gasCostsInUsd = getGasCostsInUsd(gasCosts, nativeTokenPrice)

    const inputTokenAmountBn = parseUnits(inputTokenAmount, inputToken.decimals)
    const outputTokenAmount = BigInt(res.outputAmount)

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
    return {
      type: QuoteType.index,
      chainId,
      contract: res.contract,
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
      slippage,
      tx,
      // 0x type specific properties (will change with interface changes to the quote API)
      minOutput: isLifiQuote ? BigInt(estimate.toAmountMin) : outputTokenAmount,
      sources: isLifiQuote
        ? [{ name: estimate.tool, proportion: '1' }]
        : [{ name: 'RFQ', proportion: '1' }],
    }
  } catch (err) {
    console.log('Error fetching Index quote', err)
    return null
  }
}
