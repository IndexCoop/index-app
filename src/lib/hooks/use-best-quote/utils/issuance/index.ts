import { BigNumber, providers } from 'ethers'
import {
  Address,
  encodeFunctionData,
  formatUnits,
  parseUnits,
  PublicClient,
} from 'viem'

import { DebtIssuanceModuleAddress } from '@/constants/contracts'
import { Token } from '@/constants/tokens'
import { getGasCostsInUsd } from '@/lib/utils/costs'
import { getFlashMintGasDefault } from '@/lib/utils/gas-defaults'
import { GasEstimatooor } from '@/lib/utils/gas-estimatooor'
import { getFullCostsInUsd } from '@/lib/utils/costs'
import { isAvailableForRedemption } from '@/lib/utils/tokens'

import { Quote, QuoteTransaction, QuoteType } from '../../types'
import { RedemptionProvider } from './redemption'
import { DebtIssuanceModuleV2Abi } from './debt-issuance-module-v2-abi'

interface RedemptionQuoteRequest {
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
  // Using ethers signer for now but will refactor gas estimator to use viem soon
  signer: providers.JsonRpcSigner,
): Promise<Quote | null> {
  const {
    indexTokenAmount,
    inputToken,
    inputTokenPrice,
    gasPrice,
    nativeTokenPrice,
    outputToken,
    outputTokenPrice,
  } = request
  console.log(isAvailableForRedemption(inputToken, outputToken), 'isavailable')
  if (!isAvailableForRedemption(inputToken, outputToken)) return null
  try {
    console.log('redemption')

    const redemptionProvider = new RedemptionProvider(publicClient)
    const [addresses, units, _] =
      await redemptionProvider.getComponentRedemptionUnits(
        inputToken.address! as Address,
        indexTokenAmount,
      )
    // TODO:
    // if (!isSameAddress(addresses[0], outputToken.address!)) return null
    console.log('componentsUnits:', units, units[0])
    const outputTokenAmount = parseUnits(units[0].toString(), 8)

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
      inputTokenPrice
    const outputTokenAmountUsdAfterFees = outputTokenAmountUsd - gasCostsInUsd

    const fullCostsInUsd = getFullCostsInUsd(
      indexTokenAmount,
      gasEstimate.toBigInt() * gasPrice,
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
