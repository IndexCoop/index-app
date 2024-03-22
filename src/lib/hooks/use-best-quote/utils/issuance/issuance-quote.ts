import { BigNumber, providers } from 'ethers'
import { Address, encodeFunctionData, formatUnits, PublicClient } from 'viem'

import { Token } from '@/constants/tokens'
import { getGasCostsInUsd } from '@/lib/utils/costs'
import { getFlashMintGasDefault } from '@/lib/utils/gas-defaults'
import { GasEstimatooor } from '@/lib/utils/gas-estimatooor'
import { getFullCostsInUsd } from '@/lib/utils/costs'
import { isAvailableForIssuance } from '@/lib/utils/tokens'

import { Quote, QuoteTransaction, QuoteType } from '../../types'
import { DebtIssuanceModuleV2Abi } from './debt-issuance-module-v2-abi'
import { DebtIssuanceProvider } from './provider'

interface IssuanceQuoteRequest {
  isIssuance: boolean
  inputToken: Token
  outputToken: Token
  indexTokenAmount: bigint
  inputTokenPrice: number
  outputTokenPrice: number
  nativeTokenPrice: number
  gasPrice: bigint
  slippage: number
}

export async function getEnhancedIssuanceQuote(
  request: IssuanceQuoteRequest,
  publicClient: PublicClient,
  // Using ethers signer for now but will refactor gas estimator to use viem soon
  signer: providers.JsonRpcSigner,
): Promise<Quote | null> {
  const contract = '0x04b59F9F09750C044D7CfbC177561E409085f0f3'
  const {
    isIssuance,
    indexTokenAmount,
    inputToken,
    inputTokenPrice,
    gasPrice,
    nativeTokenPrice,
    outputToken,
    outputTokenPrice,
  } = request
  console.log(isAvailableForIssuance(inputToken, outputToken), 'isavailable')
  if (!isAvailableForIssuance(inputToken, outputToken)) return null
  try {
    console.log('isIssuance:', isIssuance)
    const debtIssuanceProvider = new DebtIssuanceProvider(
      contract,
      publicClient,
    )
    const [addresses, units] = isIssuance
      ? await debtIssuanceProvider.getComponentIssuanceUnits(
          outputToken.address! as Address,
          indexTokenAmount,
        )
      : await debtIssuanceProvider.getComponentRedemptionUnits(
          inputToken.address! as Address,
          indexTokenAmount,
        )
    console.log('componentsUnits:', addresses, units, units[0])
    const outputTokenAmount = units[0]

    const sender = await signer.getAddress()

    const callData = encodeFunctionData({
      abi: DebtIssuanceModuleV2Abi,
      functionName: 'redeem',
      args: [
        inputToken.address! as Address,
        indexTokenAmount,
        sender as Address,
      ],
    })

    const transaction: QuoteTransaction = {
      chainId: 1,
      from: sender,
      to: contract,
      data: callData,
      value: undefined,
    }

    const defaultGas = getFlashMintGasDefault(inputToken.symbol)
    const defaultGasEstimate = BigNumber.from(defaultGas)
    console.log('gas', defaultGas, defaultGasEstimate.toString())
    const gasEstimatooor = new GasEstimatooor(signer, defaultGasEstimate)
    const canFail = false
    const gasEstimate = await gasEstimatooor.estimate(transaction, canFail)
    const gasCosts = gasEstimate.mul(gasPrice)
    const gasCostsInUsd = getGasCostsInUsd(
      gasCosts.toBigInt(),
      nativeTokenPrice,
    )
    transaction.gasLimit = gasEstimate
    console.log('gasLimit', transaction.gasLimit.toString())

    const inputTokenAmountUsd =
      parseFloat(formatUnits(indexTokenAmount, inputToken.decimals)) *
      inputTokenPrice
    const outputTokenAmountUsd =
      parseFloat(formatUnits(outputTokenAmount, outputToken.decimals)) *
      outputTokenPrice
    console.log(outputTokenAmountUsd, gasCostsInUsd, 'after fees')
    const outputTokenAmountUsdAfterFees = outputTokenAmountUsd - gasCostsInUsd

    const fullCostsInUsd = getFullCostsInUsd(
      indexTokenAmount,
      gasEstimate.toBigInt() * gasPrice,
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
      gasPrice: BigNumber.from(gasPrice.toString()),
      gasCosts,
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
