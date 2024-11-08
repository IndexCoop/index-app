import { Address, encodeFunctionData, PublicClient } from 'viem'

import { DebtIssuanceModuleAddress } from '@/constants/contracts'
import { Token } from '@/constants/tokens'
import { formatWei, isSameAddress } from '@/lib/utils'
import { getFullCostsInUsd } from '@/lib/utils/costs'
import { getGasLimit } from '@/lib/utils/gas'
import { getFlashMintGasDefault } from '@/lib/utils/gas-defaults'

import { Quote, QuoteTransaction, QuoteType } from '../../types'
import { isAvailableForRedemption } from '../available'

import { DebtIssuanceModuleV2Abi } from './debt-issuance-module-v2-abi'
import { DebtIssuanceProvider } from './provider'

interface RedemptionQuoteRequest {
  account: string
  inputToken: Token
  outputToken: Token
  indexTokenAmount: bigint // input for redemption
  inputTokenPrice: number
  outputTokenPrice: number
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
    const { ethPrice, gas } = await getGasLimit(transaction, defaultGasEstimate)
    transaction.gas = gas.limit

    const inputTokenAmountUsd =
      parseFloat(formatWei(indexTokenAmount, inputToken.decimals)) *
      inputTokenPrice
    const outputTokenAmountUsd =
      parseFloat(formatWei(outputTokenAmount, outputToken.decimals)) *
      outputTokenPrice
    const outputTokenAmountUsdAfterFees = outputTokenAmountUsd - gas.costsUsd

    const fullCostsInUsd = getFullCostsInUsd(
      indexTokenAmount,
      gas.limit * gas.price,
      inputToken.decimals,
      inputTokenPrice,
      ethPrice,
    )

    return {
      type: QuoteType.redemption,
      chainId: 1,
      contract,
      isMinting: false,
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
      inputTokenAmount: indexTokenAmount,
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
    console.warn('Error fetching redemption quote', e)
    return null
  }
}
