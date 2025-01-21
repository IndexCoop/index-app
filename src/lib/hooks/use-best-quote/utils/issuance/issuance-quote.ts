import {
  IndexDebtIssuanceModuleV2Address_v2,
  getIssuanceModule,
} from '@indexcoop/flash-mint-sdk'
import { Address, PublicClient, encodeFunctionData } from 'viem'

import { RealWorldAssetIndex, Token } from '@/constants/tokens'
import { isAvailableForIssuance } from '@/lib/hooks/use-best-quote/utils/available'
import { formatWei } from '@/lib/utils'
import { getFullCostsInUsd } from '@/lib/utils/costs'
import { getGasLimit } from '@/lib/utils/gas'

import { Quote, QuoteTransaction, QuoteType } from '../../types'

import { DebtIssuanceModuleV2Abi } from './debt-issuance-module-v2-abi'
import { DebtIssuanceProvider } from './provider'

interface IssuanceQuoteRequest {
  account: string
  isIssuance: boolean
  inputToken: Token
  outputToken: Token
  inputTokenAmount: bigint
  inputTokenPrice: number
  outputTokenPrice: number
  slippage: number
}

function getOutputTokenAmount(
  isIssuance: boolean,
  outputToken: Token,
  inputTokenAmount: bigint,
  units: bigint,
): bigint {
  if (!isIssuance) return units
  if (outputToken.symbol !== RealWorldAssetIndex.symbol) return units
  return (
    (inputTokenAmount * BigInt('1000000000000000000')) /
    BigInt('23800000000000000')
  )
}

export async function getEnhancedIssuanceQuote(
  request: IssuanceQuoteRequest,
  publicClient: PublicClient,
): Promise<Quote | null> {
  const {
    account,
    isIssuance,
    inputToken,
    inputTokenAmount,
    inputTokenPrice,
    outputToken,
    outputTokenPrice,
  } = request

  const chainId = 1
  let contract = getIssuanceModule(inputToken.symbol, chainId)
    .address as Address
  if (
    RealWorldAssetIndex.symbol === inputToken.symbol ||
    RealWorldAssetIndex.symbol === outputToken.symbol
  ) {
    contract = IndexDebtIssuanceModuleV2Address_v2
  }

  if (!isAvailableForIssuance(inputToken, outputToken)) return null
  if (inputTokenAmount <= 0) return null

  try {
    const debtIssuanceProvider = new DebtIssuanceProvider(
      contract,
      publicClient,
    )
    const [, units] = isIssuance
      ? await debtIssuanceProvider.getComponentIssuanceUnits(
          outputToken.address! as Address,
          inputTokenAmount,
        )
      : await debtIssuanceProvider.getComponentRedemptionUnits(
          inputToken.address! as Address,
          inputTokenAmount,
        )
    const outputTokenAmount = getOutputTokenAmount(
      isIssuance,
      outputToken,
      request.inputTokenAmount,
      units[0],
    )

    const indexToken = isIssuance ? outputToken : inputToken
    const indexTokenAmount = isIssuance ? outputTokenAmount : inputTokenAmount

    const callData = encodeFunctionData({
      abi: DebtIssuanceModuleV2Abi,
      functionName: isIssuance ? 'issue' : 'redeem',
      args: [
        indexToken.address! as Address,
        indexTokenAmount,
        account as Address,
      ],
    })

    const transaction: QuoteTransaction = {
      account,
      chainId: 1,
      from: account,
      to: contract,
      data: callData,
      value: undefined,
    }

    const defaultGasEstimate = BigInt(200_000)
    const { ethPrice, gas } = await getGasLimit(transaction, defaultGasEstimate)
    transaction.gas = gas.limit

    const inputTokenAmountUsd =
      parseFloat(formatWei(inputTokenAmount, inputToken.decimals)) *
      inputTokenPrice
    const outputTokenAmountUsd =
      parseFloat(formatWei(outputTokenAmount, outputToken.decimals)) *
      outputTokenPrice
    const outputTokenAmountUsdAfterFees = outputTokenAmountUsd - gas.costsUsd

    const fullCostsInUsd = getFullCostsInUsd(
      inputTokenAmount,
      gas.limit * gas.price,
      inputToken.decimals,
      inputTokenPrice,
      ethPrice,
    )

    return {
      type: QuoteType.issuance,
      chainId: 1,
      contract,
      isMinting: isIssuance,
      inputToken,
      outputToken,
      gas: gas.limit,
      gasPrice: gas.price,
      gasCosts: gas.costs,
      gasCostsInUsd: gas.costsUsd,
      fullCostsInUsd,
      priceImpact: 0,
      indexTokenAmount,
      inputOutputTokenAmount: outputTokenAmount,
      inputTokenAmount,
      inputTokenAmountUsd,
      outputTokenAmount,
      outputTokenAmountUsd,
      outputTokenAmountUsdAfterFees,
      inputTokenPrice,
      outputTokenPrice,
      slippage: request.slippage,
      fees: {
        mint: 0,
        mintUsd: 0,
        redeem: 0,
        redeemUsd: 0,
        streaming: 0,
        streamingUsd: 0,
      },
      tx: transaction,
    }
  } catch (e) {
    console.warn('Error fetching issuance quote', e)
    return null
  }
}
