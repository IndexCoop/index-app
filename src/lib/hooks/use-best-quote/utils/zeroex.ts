import { BigNumber } from '@ethersproject/bignumber'

import { ic21 } from '@/constants/tokens'
import { getZeroExTradeData } from '@/lib/utils/api/zeroex-utils'
import { getZeroExRouterAddress } from '@/lib/utils/contracts'
import {
  getFullCostsInUsd,
  getOutputValueInUsdAfterGas,
  getGasCostsInUsd,
} from '@/lib/utils/costs'
import { displayFromWei, toWei } from '@/lib/utils'

import { IndexQuoteRequest, QuoteType, ZeroExQuote } from '../types'
import { getPriceImpact } from './price-impact'

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
    outputTokenPrice,
    slippage,
  } = request
  let rfq: boolean = false

  if (outputToken.symbol === ic21.symbol || inputToken.symbol === ic21.symbol) {
    rfq = true
  }

  const zeroExResult = await getZeroExTradeData(
    {
      chainId,
      // for now we only allow selling
      isMinting: true,
      sellToken: inputToken,
      buyToken: outputToken,
      // for now we only allow specifing selling amount,
      // so sell token amount will always be correct
      amount: inputTokenAmount,
      slippagePercentage: slippage / 100,
      takerAddress: address!,
    },
    false,
    rfq
  )
  const dexSwapOption = zeroExResult.success ? zeroExResult.value : null
  // const dexSwapError = zeroExResult.success
  //   ? null
  //   : new Error('Not enough liqiuidity available for trade.')
  const gasLimit0x = BigNumber.from(dexSwapOption?.gas ?? '0')
  const gasPrice0x = BigNumber.from(dexSwapOption?.gasPrice ?? '0')
  const gas0x = gasPrice0x.mul(gasLimit0x)
  const inputTokenAmountBn = toWei(inputTokenAmount, inputToken.decimals)
  const outputTokenAmount =
    BigNumber.from(dexSwapOption?.buyAmount) ?? BigNumber.from(0)
  const gasCostsInUsd = getGasCostsInUsd(gas0x, nativeTokenPrice)

  const inputTokenAmountUsd = parseFloat(inputTokenAmount) * inputTokenPrice
  const outputTokenAmountUsd =
    parseFloat(
      displayFromWei(outputTokenAmount, 10, outputToken.decimals) ?? '0'
    ) * outputTokenPrice
  const priceImpact = getPriceImpact(inputTokenAmountUsd, outputTokenAmountUsd)

  const zeroExQuote: ZeroExQuote | null = dexSwapOption
    ? {
        type: QuoteType.zeroex,
        chainId,
        contract: getZeroExRouterAddress(chainId),
        isMinting,
        inputToken,
        outputToken,
        gas: gasLimit0x,
        gasPrice: gasPrice0x,
        gasCosts: gas0x,
        gasCostsInUsd,
        fullCostsInUsd: getFullCostsInUsd(
          inputTokenAmountBn,
          gas0x,
          inputToken.decimals,
          inputTokenPrice,
          nativeTokenPrice
        ),
        outputValueInUsdAfterGas: getOutputValueInUsdAfterGas(
          outputTokenAmount,
          gas0x,
          outputToken.decimals,
          outputTokenPrice,
          nativeTokenPrice
        ),
        priceImpact,
        indexTokenAmount: isMinting ? outputTokenAmount : inputTokenAmountBn,
        inputOutputTokenAmount: isMinting
          ? inputTokenAmountBn
          : outputTokenAmount,
        inputTokenAmount: inputTokenAmountBn,
        inputTokenAmountUsd,
        outputTokenAmount,
        outputTokenAmountUsd,
        inputTokenPrice,
        outputTokenPrice,
        slippage,
        tx: {
          data: dexSwapOption.data,
          from: address, // define for simulations which otherwise might fail
          to: dexSwapOption.to,
          value: BigNumber.from(dexSwapOption.value),
        },
        // type specific properties
        minOutput: dexSwapOption.minOutput,
        sources: dexSwapOption.sources,
      }
    : null
  return zeroExQuote
}
