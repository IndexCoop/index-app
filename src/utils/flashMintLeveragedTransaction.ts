import { BigNumber, PopulatedTransaction } from 'ethers'

import {
  getFlashMintLeveragedContract,
  SwapData,
} from '@indexcoop/flash-mint-sdk'

import { Token } from 'constants/tokens'
import { getAddressForToken, isNativeCurrency } from 'utils/tokens'

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
 */
export async function getFlashMintLeveragedTransaction(
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
  chainId: number
): Promise<PopulatedTransaction | null> {
  // Return default - as we can't fetch an estimate without a provider or signer
  if (!provider || !signer) return null

  // Return default - as this would otherwise throw an error
  if (isMinting && inputOutputTokenAmount.gt(inputTokenBalance)) return null
  if (!isMinting && indexTokenAmount.gt(inputTokenBalance)) return null

  const outputTokenAddress = getAddressForToken(outputToken, chainId)
  const inputTokenAddress = getAddressForToken(inputToken, chainId)
  if (!outputTokenAddress || !inputTokenAddress) return null

  try {
    const block = await provider.getBlock()
    const gasLimitLastBlock = block.gasLimit
    const contract = getFlashMintLeveragedContract(signer, chainId)
    if (isMinting) {
      const isSellingNativeChainToken = isNativeCurrency(inputToken, chainId)
      if (isSellingNativeChainToken) {
        const tx = await contract.populateTransaction.issueExactSetFromETH(
          outputTokenAddress,
          indexTokenAmount,
          swapDataDebtCollateral,
          swapDataInputOutputToken,
          { value: inputOutputTokenAmount, gasLimit: gasLimitLastBlock }
        )
        return tx
      } else {
        const maxAmountInputToken = inputOutputTokenAmount
        const tx = await contract.populateTransaction.issueExactSetFromERC20(
          outputTokenAddress,
          indexTokenAmount,
          inputTokenAddress,
          maxAmountInputToken,
          swapDataDebtCollateral,
          swapDataInputOutputToken,
          { gasLimit: gasLimitLastBlock }
        )
        return tx
      }
    } else {
      const isRedeemingNativeChainToken = isNativeCurrency(outputToken, chainId)
      const minAmountOutputToken = inputOutputTokenAmount
      if (isRedeemingNativeChainToken) {
        const tx = await contract.populateTransaction.redeemExactSetForETH(
          inputTokenAddress,
          indexTokenAmount,
          minAmountOutputToken,
          swapDataDebtCollateral,
          swapDataInputOutputToken,
          { gasLimit: gasLimitLastBlock }
        )
        return tx
      } else {
        const tx = await contract.populateTransaction.redeemExactSetForERC20(
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
        return tx
      }
    }
  } catch (error: any) {
    console.log('Error getting tx for FlashMintLeveraged:', error)
  }
  return null
}
