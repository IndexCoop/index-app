import { BigNumber } from '@ethersproject/bignumber'

import { IndexRpcProvider } from '@/lib/hooks/use-wallet'
import { formatAmountFromWei, parseUnits } from '@/lib/utils'
import { IndexApi } from '@/lib/utils/api/index-api'
import { getFullCostsInUsd, getGasCostsInUsd } from '@/lib/utils/costs'
import { GasEstimatooor } from '@/lib/utils/gas-estimatooor'
import { getAddressForToken } from '@/lib/utils/tokens'

import { IndexQuoteRequest, QuoteType, ZeroExQuote } from '../types'

import { getPriceImpact } from './price-impact'

interface ExtendedIndexQuoteRequest extends IndexQuoteRequest {
  chainId: number
  address: string
  gasPrice: bigint
  nativeTokenPrice: number
  provider: IndexRpcProvider
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
    provider,
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
      data: res.transaction.data,
      from: address,
      gasLimit: BigNumber.from(res.transaction.gasLimit ?? '0'),
      gasPrice: BigNumber.from(res.transaction.gasPrice ?? '0'),
      to: res.transaction.to,
      value: BigNumber.from(res.transaction.value),
    }

    let gasCosts = BigNumber.from('0')
    let gasLimit = BigNumber.from('0')
    let gasPrice = BigNumber.from(request.gasPrice.toString())
    const estimate = res.rawResponse.estimate
    const isLifiQuote = res.type === 'lifi'
    if (isLifiQuote) {
      gasLimit = BigNumber.from(estimate?.gasCosts[0].limit ?? '0')
      gasPrice = BigNumber.from(estimate?.gasCosts[0].price ?? '0')
    } else {
      // Right now this should only be ic21
      const defaultGas = 120_000
      const defaultGasEstimate = BigInt(defaultGas)
      const gasEstimatooor = new GasEstimatooor(provider, defaultGasEstimate)
      // We don't want this function to fail for estimates here.
      // A default will be returned if the tx would fail.
      const canFail = false
      const gasEstimate = await gasEstimatooor.estimate(tx, canFail)
      console.log(gasEstimate.toString(), 'gasLimit')
      gasLimit = BigNumber.from(gasEstimate.toString())
    }
    gasCosts = gasPrice.mul(gasLimit)
    const gasCostsInUsd = getGasCostsInUsd(
      gasCosts.toBigInt(),
      nativeTokenPrice,
    )

    const inputTokenAmountBn = BigNumber.from(
      parseUnits(inputTokenAmount, inputToken.decimals).toString(),
    )
    const outputTokenAmount = BigNumber.from(res.outputAmount)

    const inputTokenAmountUsd = parseFloat(inputTokenAmount) * inputTokenPrice
    const outputTokenAmountUsd =
      parseFloat(
        formatAmountFromWei(
          outputTokenAmount.toBigInt(),
          outputToken.decimals,
          10,
        ),
      ) * outputTokenPrice
    const priceImpact = getPriceImpact(
      inputTokenAmountUsd,
      outputTokenAmountUsd,
    )

    const outputTokenAmountUsdAfterFees = outputTokenAmountUsd - gasCostsInUsd

    const fullCostsInUsd = getFullCostsInUsd(
      inputTokenAmountBn.toBigInt(),
      gasCosts.toBigInt(),
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
      minOutput: isLifiQuote
        ? BigNumber.from(estimate.toAmountMin)
        : outputTokenAmount,
      sources: isLifiQuote
        ? [{ name: estimate.tool, proportion: '1' }]
        : [{ name: 'RFQ', proportion: '1' }],
    }
  } catch (err) {
    console.log('Error fetching Index quote', err)
    return null
  }
}
