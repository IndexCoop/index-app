import { BigNumber } from '@ethersproject/bignumber'

import { ic21 } from '@/constants/tokens'
import {
  getZeroExTradeData,
  RequestForQuote,
} from '@/lib/utils/api/zeroex-utils'
import { getFullCostsInUsd, getGasCostsInUsd } from '@/lib/utils/costs'
import { toWei } from '@/lib/utils'

import { IndexQuoteRequest, QuoteType, ZeroExQuote } from './types'

interface ZeroExQuoteRequest extends IndexQuoteRequest {
  chainId: number
  address: string
  nativeTokenPrice: number
}

export async function get0xQuote(request: ZeroExQuoteRequest) {
  const {
    chainId,
    address,
    inputToken,
    inputTokenAmount,
    inputTokenPrice,
    isMinting,
    nativeTokenPrice,
    outputToken,
    slippage,
  } = request
  let rfq: RequestForQuote | null = null

  if (outputToken.symbol === ic21.symbol || inputToken.symbol === ic21.symbol) {
    // FIXME: always add address
    // TODO: add skip validation true
    rfq = {
      takerAddress: address!,
    }
  }

  const slippagePercentage = slippage / 100
  /* Check 0x for DEX Swap option*/
  const zeroExResult = await getZeroExTradeData(
    // for now we only allow selling
    true,
    inputToken,
    outputToken,
    // for now we only allow specifing selling amount,
    // so sell token amount will always be correct
    inputTokenAmount,
    slippagePercentage,
    chainId,
    false,
    rfq
  )
  const dexSwapOption = zeroExResult.success ? zeroExResult.value : null
  const dexSwapError = zeroExResult.success
    ? null
    : new Error('Not enough liqiuidity available for trade.')
  const gasLimit0x = BigNumber.from(dexSwapOption?.gas ?? '0')
  const gasPrice0x = BigNumber.from(dexSwapOption?.gasPrice ?? '0')
  const gas0x = gasPrice0x.mul(gasLimit0x)
  const inputTokenAmountBn = toWei(inputTokenAmount, inputToken.decimals)
  const gasCostsInUsd = getGasCostsInUsd(gas0x, nativeTokenPrice)
  const zeroExQuote: ZeroExQuote | null = dexSwapOption
    ? {
        type: QuoteType.zeroEx,
        isMinting,
        inputToken,
        outputToken,
        gas: gasLimit0x,
        gasPrice: gasPrice0x,
        gasCosts: gas0x,
        gasCostsInUsd,
        estimatedPriceImpact: dexSwapOption.estimatedPriceImpact,
        fullCostsInUsd: getFullCostsInUsd(
          inputTokenAmountBn,
          gas0x,
          inputToken.decimals,
          inputTokenPrice,
          nativeTokenPrice
        ),
        priceImpact: parseFloat(dexSwapOption.estimatedPriceImpact ?? '5'),
        indexTokenAmount: isMinting
          ? BigNumber.from(dexSwapOption.buyAmount)
          : inputTokenAmountBn,
        inputOutputTokenAmount: isMinting
          ? inputTokenAmountBn
          : BigNumber.from(dexSwapOption.buyAmount),
        // type specific properties
        chainId: dexSwapOption.chainId,
        data: dexSwapOption.data,
        minOutput: dexSwapOption.minOutput,
        sources: dexSwapOption.sources,
        to: dexSwapOption.to,
        value: dexSwapOption.value,
      }
    : null
  return zeroExQuote
}
