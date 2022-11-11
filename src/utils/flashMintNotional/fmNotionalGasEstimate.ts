import { ethers } from 'ethers'

import { BigNumber } from '@ethersproject/bignumber'
import { SwapData } from '@indexcoop/flash-mint-sdk'

import { Token } from 'constants/tokens'
import { getAddressForToken } from 'utils/tokens'

import { getFlashMintNotionalContract } from './fmNotionalContract'

const defaultGasEstimate = BigNumber.from(1_000_000)
// Default gas margin to add on top of estimate
const defaultGasMargin = 20

export async function getFlashMintNotionalGasEstimate(
  isMinting: boolean,
  inputToken: Token,
  outputToken: Token,
  indexTokenAmount: BigNumber,
  inputOutputTokenAmount: BigNumber,
  slippagePercent: number,
  chainId: number,
  signer: any
): Promise<BigNumber> {
  // Return default - as we can't fetch an estimate without a provider or signer
  if (!signer) return defaultGasEstimate

  let gasEstimate = defaultGasEstimate

  const inputTokenAddress = getAddressForToken(inputToken, chainId)
  const outputTokenAddress = getAddressForToken(outputToken, chainId)
  if (!inputTokenAddress || !outputTokenAddress) return gasEstimate

  const fixedTokenAddress = isMinting ? outputTokenAddress : inputTokenAddress

  const isDebtIssuance = true
  const issuanceModule = '0xa0a98EB7Af028BE00d04e46e1316808A62a8fd59'
  const redeemMaturedPositions = false
  const slippage = ethers.utils.parseEther(slippagePercent.toString())
  // FIXME:
  const swapData: SwapData[] = []

  try {
    const block = await signer.getBlock()
    const gasLimitLastBlock = block.gasLimit
    const contract = getFlashMintNotionalContract(signer)
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
    console.log('Error estimating gas for FlashMintLeveraged:', error)
    // TODO:
    // if (canFail) {
    //   throw new FlashMintNotionalGasEstimateFailedError()
    // }
    return defaultGasEstimate
  }

  // Add safety margin on top of estimate
  gasEstimate = gasEstimate.mul(100 + defaultGasMargin).div(100)

  return gasEstimate
}
