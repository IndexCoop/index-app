import { BigNumber } from '@ethersproject/bignumber'
import {
  getFlashMintLeveragedContract,
  SwapData,
} from '@indexcoop/flash-mint-sdk'

import { DefaultGasLimitFlashMintLeveraged } from 'constants/gas'
import { Token } from 'constants/tokens'
import { getAddressForToken, isNativeCurrency } from 'utils/tokens'

const defaultGasEstimate = BigNumber.from(DefaultGasLimitFlashMintLeveraged)
// Default gas margin to add on top of estimate
const defaultGasMargin = 20

export class FlashMintLeveragedGasEstimateFailedError extends Error {
  statusCode = 1000
  constructor() {
    super('Failed to estimate gas for FlashMintLeveraged.')
    // 👇️ because we are extending a built-in class
    Object.setPrototypeOf(
      this,
      FlashMintLeveragedGasEstimateFailedError.prototype
    )
  }
}

/**
 * Returns a gas estimate for FlashMintLeveraged.
 *
 * If the tx would fail an estimate is returned.
 *
 * @param isMinting                   Minting or redeeming?
 * @param inputToken                  The input token.
 * @param outputToken                 The output token.
 * @param indexTokenAmount            The Index token amount.
 * @param inputOutputTokenAmount      The input/ouput token amount (depending on minting/redeeming).
 * @param inputTokenBalance           The input token's balance.
 * @param swapDataDebtCollateral      The debt collateral swap data (from the quote).
 * @param swapDataInputOutputToken    The input (minting) output (redeeming) token swap data (from the quote).
 * @param provider                    A provider.
 * @param signer                      A signer.
 * @param chainId                     The current's chain ID.
 * @param canFail                     If the function should fail on error (default: true)
 */
export async function getFlashMintLeveragedGasEstimate(
  isMinting: boolean,
  inputToken: Token,
  outputToken: Token,
  indexTokenAmount: BigNumber,
  inputOutputTokenAmount: BigNumber,
  inputTokenBalance: BigNumber,
  swapDataDebtCollateral: SwapData,
  swapDataInputOutputToken: SwapData,
  provider: any,
  signer: any,
  chainId: number,
  canFail: boolean = true
): Promise<BigNumber> {
  // Return default - as we can't fetch an estimate without a provider or signer
  if (!provider || !signer) return defaultGasEstimate

  // Return default - as this would otherwise throw an error
  if (isMinting && inputOutputTokenAmount.gt(inputTokenBalance))
    return defaultGasEstimate
  if (!isMinting && indexTokenAmount.gt(inputTokenBalance))
    return defaultGasEstimate

  let gasEstimate = defaultGasEstimate

  const outputTokenAddress = getAddressForToken(outputToken, chainId)
  const inputTokenAddress = getAddressForToken(inputToken, chainId)
  if (!outputTokenAddress || !inputTokenAddress) return gasEstimate

  try {
    const block = await provider.getBlock()
    const gasLimitLastBlock = block.gasLimit
    const contract = getFlashMintLeveragedContract(signer, chainId)
    if (isMinting) {
      const isSellingNativeChainToken = isNativeCurrency(inputToken, chainId)
      if (isSellingNativeChainToken) {
        gasEstimate = await contract.estimateGas.issueExactSetFromETH(
          outputTokenAddress,
          indexTokenAmount,
          swapDataDebtCollateral,
          swapDataInputOutputToken,
          { value: inputOutputTokenAmount, gasLimit: gasLimitLastBlock }
        )
      } else {
        const maxAmountInputToken = inputOutputTokenAmount
        gasEstimate = await contract.estimateGas.issueExactSetFromERC20(
          outputTokenAddress,
          indexTokenAmount,
          inputTokenAddress,
          maxAmountInputToken,
          swapDataDebtCollateral,
          swapDataInputOutputToken,
          { gasLimit: gasLimitLastBlock }
        )
      }
    } else {
      const isRedeemingNativeChainToken = isNativeCurrency(outputToken, chainId)
      const minAmountOutputToken = inputOutputTokenAmount
      if (isRedeemingNativeChainToken) {
        gasEstimate = await contract.estimateGas.redeemExactSetForETH(
          inputTokenAddress,
          indexTokenAmount,
          minAmountOutputToken,
          swapDataDebtCollateral,
          swapDataInputOutputToken,
          { gasLimit: gasLimitLastBlock }
        )
      } else {
        gasEstimate = await contract.estimateGas.redeemExactSetForERC20(
          inputTokenAddress,
          indexTokenAmount,
          outputTokenAddress,
          minAmountOutputToken,
          swapDataDebtCollateral,
          swapDataInputOutputToken,
          {
            gasLimit: gasLimitLastBlock,
          }
        )
      }
    }
  } catch (error: any) {
    console.log('Error estimating gas for FlashMintLeveraged:', error)
    if (canFail) {
      throw new FlashMintLeveragedGasEstimateFailedError()
    }
    return defaultGasEstimate
  }

  // Add safety margin on top of estimate
  gasEstimate = gasEstimate.mul(100 + defaultGasMargin).div(100)

  return gasEstimate
}
