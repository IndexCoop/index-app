import { BigNumber, providers } from 'ethers'
import { Address, PublicClient } from 'viem'
import { Token } from '@indexcoop/flash-mint-sdk'

import { Ethereum2xFlexibleLeverageIndex } from '@/constants/tokens'
import { getGasCostsInUsd } from '@/lib/utils/costs'
import { getFlashMintGasDefault } from '@/lib/utils/gas-defaults'
import { GasEstimatooor } from '@/lib/utils/gas-estimatooor'

import { Quote, QuoteTransaction, QuoteType } from '../../types'
import { RedemptionProvider } from './redemption'

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

export async function getEnhancedRedemptionQuote(
  request: RedemptionQuoteRequest,
  publicClient: PublicClient,
  // Using ethers signer for now but will refactor gas estimator to use viem soon
  signer: providers.JsonRpcSigner
): Promise<Quote | null> {
  const { indexTokenAmount, inputToken, gasPrice, outputToken } = request
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

    // tODO: calc input in usd
    // TODO: calc quote return in usd

    const from = await signer.getAddress()
    // TODO: return transaction
    // https://viem.sh/docs/contract/encodeFunctionData#encodefunctiondata
    const transaction: QuoteTransaction = {
      chainId: 1,
      from,
      to: '0x04b59F9F09750C044D7CfbC177561E409085f0f3',
      data: '0x0', // TODO: encode function data
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

    // TODO: full costs

    return {
      type: QuoteType.redemption,
      chainId: 1,
      contract: '0x04b59F9F09750C044D7CfbC177561E409085f0f3',
      isMinting: false,
      inputToken: Ethereum2xFlexibleLeverageIndex,
      outputToken: Ethereum2xFlexibleLeverageIndex, // FIXME: use new 2x token
      gas: gasEstimate,
      gasPrice: BigNumber.from(gasPrice.toString()),
      gasCosts,
      gasCostsInUsd,
      // TODO:
      fullCostsInUsd: 0,
      priceImpact: 0,
      indexTokenAmount: BigNumber.from(indexTokenAmount.toString()),
      inputOutputTokenAmount: BigNumber.from(0),
      inputTokenAmount: BigNumber.from(0),
      inputTokenAmountUsd: 0,
      outputTokenAmount: BigNumber.from(0),
      outputTokenAmountUsd: 0,
      inputTokenPrice: 0,
      outputTokenPrice: 0,
      slippage: 0,
      tx: transaction,
    }
  } catch (e) {
    console.warn('Error fetching redemption quote', e)
    return null
  }
}
