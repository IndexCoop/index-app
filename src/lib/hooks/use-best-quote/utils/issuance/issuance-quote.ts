import {
  getIssuanceModule,
  IndexDebtIssuanceModuleV2Address_v2,
} from '@indexcoop/flash-mint-sdk'
import { Address, encodeFunctionData, PublicClient } from 'viem'

import {
  BedIndex,
  LeveragedRethStakingYield,
  RealWorldAssetIndex,
  Token,
} from '@/constants/tokens'
import { isAvailableForIssuance } from '@/lib/hooks/use-best-quote/utils/available'
import { formatWei } from '@/lib/utils'
import { getFullCostsInUsd, getGasCostsInUsd } from '@/lib/utils/costs'
import { GasEstimatooor } from '@/lib/utils/gas-estimatooor'

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
  nativeTokenPrice: number
  gasPrice: bigint
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
    gasPrice,
    nativeTokenPrice,
    outputToken,
    outputTokenPrice,
  } = request

  const chainId = 1
  let contract = getIssuanceModule(inputToken.symbol, chainId)
    .address as Address
  if (
    BedIndex.symbol === inputToken.symbol ||
    LeveragedRethStakingYield.symbol === inputToken.symbol ||
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

    const defaultGas = 200_000
    const defaultGasEstimate = BigInt(defaultGas)
    const gasEstimatooor = new GasEstimatooor(publicClient, defaultGasEstimate)
    const canFail = false
    const gasEstimate = await gasEstimatooor.estimate(transaction, canFail)
    const gasCosts = gasEstimate * gasPrice
    const gasCostsInUsd = getGasCostsInUsd(gasCosts, nativeTokenPrice)
    transaction.gas = gasEstimate

    const inputTokenAmountUsd =
      parseFloat(formatWei(inputTokenAmount, inputToken.decimals)) *
      inputTokenPrice
    const outputTokenAmountUsd =
      parseFloat(formatWei(outputTokenAmount, outputToken.decimals)) *
      outputTokenPrice
    const outputTokenAmountUsdAfterFees = outputTokenAmountUsd - gasCostsInUsd

    const fullCostsInUsd = getFullCostsInUsd(
      inputTokenAmount,
      gasEstimate * gasPrice,
      inputToken.decimals,
      inputTokenPrice,
      nativeTokenPrice,
    )

    return {
      type: QuoteType.issuance,
      chainId: 1,
      contract,
      isMinting: isIssuance,
      inputToken,
      outputToken,
      gas: gasEstimate,
      gasPrice,
      gasCosts,
      gasCostsInUsd,
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
      tx: transaction,
    }
  } catch (e) {
    console.warn('Error fetching issuance quote', e)
    return null
  }
}
