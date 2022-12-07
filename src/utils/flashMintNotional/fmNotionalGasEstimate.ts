import { ethers } from 'ethers'

import { BigNumber } from '@ethersproject/bignumber'
import { JsonRpcProvider } from '@ethersproject/providers'
import { SwapData } from '@indexcoop/flash-mint-sdk'

import { DefaultGasLimitFlashMintNotional } from 'constants/gas'
import { Token } from 'constants/tokens'
import { getAddressForToken } from 'utils/tokens'

import {
  DebtIssuanceModuleV2,
  getFlashMintNotionalContract,
} from './fmNotionalContract'

const defaultGasEstimate = BigNumber.from(DefaultGasLimitFlashMintNotional)
// Default gas margin to add on top of estimate
const defaultGasMargin = 20

export class FlashMintNotionalGasEstimateFailedError extends Error {
  statusCode = 1003
  constructor() {
    super('Failed to estimate gas for FlashMintNotional.')
    // 👇️ because we are extending a built-in class
    Object.setPrototypeOf(
      this,
      FlashMintNotionalGasEstimateFailedError.prototype
    )
  }
}

export async function getFlashMintNotionalGasEstimate(
  isMinting: boolean,
  inputToken: Token,
  outputToken: Token,
  indexTokenAmount: BigNumber,
  inputOutputTokenAmount: BigNumber,
  swapData: SwapData[],
  slippagePercent: number,
  chainId: number,
  provider: JsonRpcProvider,
  canFail: boolean = true
): Promise<BigNumber> {
  // Return default - as we can't fetch an estimate without a provider
  if (!provider) return defaultGasEstimate

  let gasEstimate = defaultGasEstimate

  const inputTokenAddress = getAddressForToken(inputToken, chainId)
  const outputTokenAddress = getAddressForToken(outputToken, chainId)
  if (!inputTokenAddress || !outputTokenAddress) return gasEstimate

  const fixedTokenAddress = isMinting ? outputTokenAddress : inputTokenAddress

  const isDebtIssuance = true
  const issuanceModule = DebtIssuanceModuleV2
  const redeemMaturedPositions = false
  const slippage = ethers.utils.parseEther(slippagePercent.toString())

  try {
    const block = await provider.getBlock('latest')
    const gasLimitLastBlock = block.gasLimit
    const contract = getFlashMintNotionalContract(provider)
    if (isMinting) {
      const maxAmountInputToken = inputOutputTokenAmount
      gasEstimate = await contract.estimateGas.issueExactSetFromToken(
        fixedTokenAddress,
        inputToken.address,
        indexTokenAmount,
        maxAmountInputToken,
        swapData,
        issuanceModule,
        isDebtIssuance,
        slippage,
        redeemMaturedPositions,
        { gasLimit: gasLimitLastBlock }
      )
    } else {
      const minAmountOutputToken = inputOutputTokenAmount
      gasEstimate = await contract.estimateGas.redeemExactSetForToken(
        fixedTokenAddress,
        outputToken.address,
        indexTokenAmount,
        minAmountOutputToken,
        swapData,
        issuanceModule,
        isDebtIssuance,
        slippage,
        redeemMaturedPositions,
        { gasLimit: gasLimitLastBlock }
      )
    }
  } catch (error: any) {
    console.log('Error estimating gas for FlashMintNotional:', error)
    if (canFail) {
      throw new FlashMintNotionalGasEstimateFailedError()
    }
    return defaultGasEstimate
  }

  // Add safety margin on top of estimate
  gasEstimate = gasEstimate.mul(100 + defaultGasMargin).div(100)

  return gasEstimate
}
