import { getIssuanceModule } from '@indexcoop/flash-mint-sdk'
import { BigNumber } from 'ethers'
import { Address, encodeFunctionData, PublicClient } from 'viem'

import {
  BedIndex,
  LeveragedRethStakingYield,
  RealWorldAssetIndex,
  Token,
} from '@/constants/tokens'
import { formatWei } from '@/lib/utils'
import { getFullCostsInUsd, getGasCostsInUsd } from '@/lib/utils/costs'
import { GasEstimatooor } from '@/lib/utils/gas-estimatooor'
import { isAvailableForIssuance } from '@/lib/utils/tokens'

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
    contract = '0x04b59F9F09750C044D7CfbC177561E409085f0f3'
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
    transaction.gasLimit = BigNumber.from(gasEstimate.toString())

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
      gas: BigNumber.from(gasEstimate.toString()),
      gasPrice: BigNumber.from(gasPrice.toString()),
      gasCosts: BigNumber.from(gasCosts.toString()),
      gasCostsInUsd,
      fullCostsInUsd,
      priceImpact: 0,
      indexTokenAmount: BigNumber.from(indexTokenAmount.toString()),
      inputOutputTokenAmount: BigNumber.from(outputTokenAmount.toString()),
      inputTokenAmount: BigNumber.from(inputTokenAmount.toString()),
      inputTokenAmountUsd,
      outputTokenAmount: BigNumber.from(outputTokenAmount.toString()),
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
