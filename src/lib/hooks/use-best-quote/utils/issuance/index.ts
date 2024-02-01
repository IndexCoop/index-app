import { BigNumber, providers } from 'ethers'
import { Address, encodeFunctionData, formatUnits, PublicClient } from 'viem'

import { DebtIssuanceModuleAddress } from '@/constants/contracts'
import { Ethereum2xFlexibleLeverageIndex, Token } from '@/constants/tokens'
import { getGasCostsInUsd } from '@/lib/utils/costs'
import { getFlashMintGasDefault } from '@/lib/utils/gas-defaults'
import { GasEstimatooor } from '@/lib/utils/gas-estimatooor'

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
  signer: providers.JsonRpcSigner
): Promise<Quote | null> {
  const {
    indexTokenAmount,
    inputToken,
    inputTokenPrice,
    gasPrice,
    outputToken,
    outputTokenPrice,
  } = request
  if (inputToken.symbol !== Ethereum2xFlexibleLeverageIndex.symbol) return null
  // FIXME: use new 2x token
  if (outputToken.symbol !== Ethereum2xFlexibleLeverageIndex.symbol) return null
  try {
    const redemptionProvider = new RedemptionProvider(publicClient)
    const componentsUnits =
      await redemptionProvider.getComponentRedemptionUnits(
        inputToken.address! as Address,
        indexTokenAmount
      )
    console.log('componentsUnits:', componentsUnits)
    // TODO:
    const outputTokenAmount = BigInt(0)

    const sender = await signer.getAddress()

    const callData = encodeFunctionData({
      abi: DebtIssuanceModuleV2Abi,
      functionName: 'redeem',
      args: [
        Ethereum2xFlexibleLeverageIndex.address! as Address,
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
    const gasCostsInUsd = getGasCostsInUsd(gasCosts, request.nativeTokenPrice)
    transaction.gasLimit = gasEstimate
    console.log('gasLimit', transaction.gasLimit.toString())

    const inputTokenAmountUsd =
      parseFloat(formatUnits(indexTokenAmount, inputToken.decimals)) *
      inputTokenPrice
    const outputTokenAmountUsd =
      parseFloat(formatUnits(indexTokenAmount, inputToken.decimals)) *
      inputTokenPrice

    // TODO: full costs

    return {
      type: QuoteType.redemption,
      chainId: 1,
      contract,
      isMinting: false,
      inputToken: Ethereum2xFlexibleLeverageIndex,
      outputToken: Ethereum2xFlexibleLeverageIndex, // FIXME: use new 2x token
      gas: gasEstimate,
      gasPrice: BigNumber.from(gasPrice.toString()),
      gasCosts,
      gasCostsInUsd,
      // TODO:
      fullCostsInUsd: 0,
      // TODO:
      priceImpact: 0,
      indexTokenAmount: BigNumber.from(indexTokenAmount.toString()),
      inputOutputTokenAmount: BigNumber.from(outputTokenAmount.toString()),
      inputTokenAmount: BigNumber.from(indexTokenAmount.toString()),
      inputTokenAmountUsd,
      outputTokenAmount: BigNumber.from(outputTokenAmount.toString()),
      outputTokenAmountUsd,
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
