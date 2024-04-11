import { BigNumber } from 'ethers'
import { Address, encodeFunctionData, formatUnits, PublicClient } from 'viem'

import { DebtIssuanceModuleAddress } from '@/constants/contracts'
import { Token } from '@/constants/tokens'
import { getGasCostsInUsd } from '@/lib/utils/costs'
import { getFlashMintGasDefault } from '@/lib/utils/gas-defaults'
import { GasEstimatooor } from '@/lib/utils/gas-estimatooor'
import { getFullCostsInUsd } from '@/lib/utils/costs'
import { isSameAddress } from '@/lib/utils'
import { isAvailableForRedemption } from '@/lib/utils/tokens'

import { Quote, QuoteTransaction, QuoteType } from '../../types'
import { DebtIssuanceProvider } from './provider'
import { DebtIssuanceModuleV2Abi } from './debt-issuance-module-v2-abi'

interface RedemptionQuoteRequest {
  account: string
  inputToken: Token
  outputToken: Token
  indexTokenAmount: bigint // input for redemption
  inputTokenPrice: number
  outputTokenPrice: number
  nativeTokenPrice: number
  gasPrice: bigint
  slippage: number
}

const contract = DebtIssuanceModuleAddress

export async function getEnhancedRedemptionQuote(
  request: RedemptionQuoteRequest,
  publicClient: PublicClient,
): Promise<Quote | null> {
  const {
    account,
    indexTokenAmount,
    inputToken,
    inputTokenPrice,
    gasPrice,
    nativeTokenPrice,
    outputToken,
    outputTokenPrice,
  } = request
  if (!isAvailableForRedemption(inputToken, outputToken)) return null
  try {
    const redemptionProvider = new DebtIssuanceProvider(contract, publicClient)
    const [addresses, units] =
      await redemptionProvider.getComponentRedemptionUnits(
        inputToken.address! as Address,
        indexTokenAmount,
      )

    if (!isSameAddress(addresses[0], outputToken.address!)) return null

    const outputTokenAmount = units[0]

    const callData = encodeFunctionData({
      abi: DebtIssuanceModuleV2Abi,
      functionName: 'redeem',
      args: [
        inputToken.address! as Address,
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

    const defaultGas = getFlashMintGasDefault(inputToken.symbol)
    const defaultGasEstimate = BigInt(defaultGas)
    const gasEstimatooor = new GasEstimatooor(publicClient, defaultGasEstimate)
    const canFail = false
    const gasEstimate = await gasEstimatooor.estimate(transaction, canFail)
    const gasCosts = gasEstimate * gasPrice
    const gasCostsInUsd = getGasCostsInUsd(gasCosts, nativeTokenPrice)
    transaction.gasLimit = BigNumber.from(gasEstimate.toString())

    const inputTokenAmountUsd =
      parseFloat(formatUnits(indexTokenAmount, inputToken.decimals)) *
      inputTokenPrice
    const outputTokenAmountUsd =
      parseFloat(formatUnits(outputTokenAmount, outputToken.decimals)) *
      outputTokenPrice
    const outputTokenAmountUsdAfterFees = outputTokenAmountUsd - gasCostsInUsd

    const fullCostsInUsd = getFullCostsInUsd(
      indexTokenAmount,
      gasEstimate * gasPrice,
      inputToken.decimals,
      inputTokenPrice,
      nativeTokenPrice,
    )

    return {
      type: QuoteType.redemption,
      chainId: 1,
      contract,
      isMinting: false,
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
      inputTokenAmount: BigNumber.from(indexTokenAmount.toString()),
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
    console.warn('Error fetching redemption quote', e)
    return null
  }
}
