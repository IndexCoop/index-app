import { BigNumber, PopulatedTransaction } from 'ethers'

import {
  getFlashMintZeroExContract,
  getIssuanceModule,
} from '@indexcoop/flash-mint-sdk'

import { Token } from 'constants/tokens'
import { getAddressForToken, isNativeCurrency } from 'utils/tokens'

/**
 * Returns a populated tx for FlashMintZeroEx.
 * Returns null if there is an issue.
 *
 * @param isMinting               Minting or redeeming?
 * @param inputToken              The input token.
 * @param outputToken             The output token.
 * @param indexTokenAmount        The Index token amount.
 * @param inputOutputTokenAmount  The input/ouput token amount (depending on minting/redeeming).
 * @param inputTokenBalance       The input token's balance.
 * @param componentQuotes         The component quotes data (from the quote).
 * @param provider                A provider.
 * @param signer                  A signer.
 * @param chainId                 The current's chain ID.
 */
export async function getFlashMintZeroExTransaction(
  isMinting: boolean,
  inputToken: Token,
  outputToken: Token,
  indexTokenAmount: BigNumber,
  inputOutputTokenAmount: BigNumber,
  inputTokenBalance: BigNumber,
  componentQuotes: string[],
  provider: any,
  signer: any,
  chainId: number
): Promise<PopulatedTransaction | null> {
  // Return default - as we can't fetch an estimate without a provider or signer
  if (!provider || !signer) return null

  // Return default - as this would otherwise throw an error
  if (isMinting && inputOutputTokenAmount.gt(inputTokenBalance)) return null
  if (!isMinting && indexTokenAmount.gt(inputTokenBalance)) return null

  const setTokenSymbol = isMinting ? outputToken.symbol : inputToken.symbol
  const issuanceModule = getIssuanceModule(setTokenSymbol, chainId)

  const outputTokenAddress = getAddressForToken(outputToken, chainId)
  const inputTokenAddress = getAddressForToken(inputToken, chainId)
  if (!outputTokenAddress || !inputTokenAddress) return null

  try {
    const block = await provider.getBlock()
    const gasLimitLastBlock = block.gasLimit
    console.log(gasLimitLastBlock.toString(), 'gasLimitLastBlock')
    const contract = getFlashMintZeroExContract(signer, chainId ?? 1)
    if (isMinting) {
      const isSellingNativeChainToken = isNativeCurrency(inputToken, chainId)
      if (isSellingNativeChainToken) {
        const tx = await contract.populateTransaction.issueExactSetFromETH(
          outputTokenAddress,
          indexTokenAmount,
          componentQuotes,
          issuanceModule.address,
          issuanceModule.isDebtIssuance,
          { value: inputOutputTokenAmount, gasLimit: gasLimitLastBlock }
        )
        return tx
      } else {
        const maxAmountInputToken = inputOutputTokenAmount
        const tx = await contract.populateTransaction.issueExactSetFromToken(
          outputTokenAddress,
          inputTokenAddress,
          indexTokenAmount,
          maxAmountInputToken,
          componentQuotes,
          issuanceModule.address,
          issuanceModule.isDebtIssuance,
          { gasLimit: gasLimitLastBlock }
        )
        return tx
      }
    } else {
      const isRedeemingNativeChainToken = isNativeCurrency(outputToken, chainId)
      const minOutputReceive = inputOutputTokenAmount

      if (isRedeemingNativeChainToken) {
        const tx = await contract.populateTransaction.redeemExactSetForETH(
          inputTokenAddress,
          indexTokenAmount,
          minOutputReceive,
          componentQuotes,
          issuanceModule.address,
          issuanceModule.isDebtIssuance,
          { gasLimit: gasLimitLastBlock }
        )
        return tx
      } else {
        const tx = await contract.populateTransaction.redeemExactSetForToken(
          inputTokenAddress,
          outputTokenAddress,
          indexTokenAmount,
          minOutputReceive,
          componentQuotes,
          issuanceModule.address,
          issuanceModule.isDebtIssuance,
          {
            gasLimit: gasLimitLastBlock,
          }
        )
        return tx
      }
    }
  } catch (error: any) {
    console.log('Error getting tx for FlashMintZeroEx:', error)
  }

  return null
}
