import { PopulatedTransaction, Signer } from 'ethers'

import { BigNumber } from '@ethersproject/bignumber'
import { SwapData } from '@indexcoop/flash-mint-sdk'

import { Token } from '@/constants/tokens'
import { getAddressForToken } from '@/lib/utils/tokens'

import { getFlashMintNotionalContract } from './fmNotionalContract'

export async function getFlashMintNotionalTransaction(
  isMinting: boolean,
  inputToken: Token,
  outputToken: Token,
  indexTokenAmount: BigNumber,
  inputOutputTokenAmount: BigNumber,
  swapData: SwapData[],
  slippage: number,
  provider: any,
  signer: any,
  chainId: number
): Promise<PopulatedTransaction | null> {
  // Return default - as we can't construct a tx without a provider or signer
  if (!provider || !signer) return null

  const inputTokenAddress = getAddressForToken(inputToken, chainId)
  const outputTokenAddress = getAddressForToken(outputToken, chainId)
  if (!outputTokenAddress || !inputTokenAddress) return null

  const contract = getFlashMintNotionalContract(signer as Signer, chainId)
  const fixedTokenAddress = isMinting ? outputTokenAddress : inputTokenAddress
  const issuanceModule = '0xa0a98EB7Af028BE00d04e46e1316808A62a8fd59'
  const isDebtIssuance = true
  const redeemMaturedPositions = false

  try {
    const block = await provider.getBlock()
    const gasLimitLastBlock = block.gasLimit
    if (isMinting) {
      const maxAmountInputToken = inputOutputTokenAmount
      const mintTx = await contract.populateTransaction.issueExactSetFromToken(
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
      return mintTx
    } else {
      const minAmountOutputToken = inputOutputTokenAmount
      const redeemTx =
        await contract.populateTransaction.redeemExactSetForToken(
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
      return redeemTx
    }
  } catch (error) {
    console.log('Error sending FlashMintNotional tx', error)
    return null
  }
  return null
}
