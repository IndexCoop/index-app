import { BigNumber } from '@ethersproject/bignumber'
import {
  getFlashMintZeroExContract,
  getIssuanceModule,
} from '@indexcoop/flash-mint-sdk'

import { DefaultGasLimitFlashMintZeroEx } from 'constants/gas'
import { Token } from 'constants/tokens'
import { getAddressForToken, isNativeCurrency } from 'utils/tokens'

const defaultGasEstimate = BigNumber.from(DefaultGasLimitFlashMintZeroEx)
// Default gas margin to add on top of estimate
const defaultGasMargin = 20

export class FlashMintZeroExGasEstimateFailedError extends Error {
  statusCode = 1001
  constructor() {
    super('Failed to estimate gas for FlashMintZeroEx.')
    // 👇️ because we are extending a built-in class
    Object.setPrototypeOf(this, FlashMintZeroExGasEstimateFailedError.prototype)
  }
}

/**
 * Returns a gas estimate for FlashMintZeroEx.
 *
 * If the tx would fail an estimate is returned.
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
 * @param canFail                 If the function should fail on error (default: true)
 */
export async function getFlashMintZeroExGasEstimate(
  isMinting: boolean,
  inputToken: Token,
  outputToken: Token,
  indexTokenAmount: BigNumber,
  inputOutputTokenAmount: BigNumber,
  inputTokenBalance: BigNumber,
  componentQuotes: string[],
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

  const setTokenSymbol = isMinting ? outputToken.symbol : inputToken.symbol
  const issuanceModule = getIssuanceModule(setTokenSymbol, chainId)

  const outputTokenAddress = getAddressForToken(outputToken, chainId)
  const inputTokenAddress = getAddressForToken(inputToken, chainId)
  if (!outputTokenAddress || !inputTokenAddress) return gasEstimate

  try {
    const block = await provider.getBlock()
    const gasLimitLastBlock = block.gasLimit
    const contract = getFlashMintZeroExContract(signer, chainId ?? 1)
    if (isMinting) {
      const isSellingNativeChainToken = isNativeCurrency(inputToken, chainId)
      if (isSellingNativeChainToken) {
        gasEstimate = await contract.estimateGas.issueExactSetFromETH(
          outputTokenAddress,
          indexTokenAmount,
          componentQuotes,
          issuanceModule.address,
          issuanceModule.isDebtIssuance,
          { value: inputOutputTokenAmount, gasLimit: gasLimitLastBlock }
        )
      } else {
        const maxAmountInputToken = inputOutputTokenAmount
        gasEstimate = await contract.estimateGas.issueExactSetFromToken(
          outputTokenAddress,
          inputTokenAddress,
          indexTokenAmount,
          maxAmountInputToken,
          componentQuotes,
          issuanceModule.address,
          issuanceModule.isDebtIssuance,
          { gasLimit: gasLimitLastBlock }
        )
      }
    } else {
      const isRedeemingNativeChainToken = isNativeCurrency(outputToken, chainId)
      const minOutputReceive = inputOutputTokenAmount

      if (isRedeemingNativeChainToken) {
        gasEstimate = await contract.estimateGas.redeemExactSetForETH(
          inputTokenAddress,
          indexTokenAmount,
          minOutputReceive,
          componentQuotes,
          issuanceModule.address,
          issuanceModule.isDebtIssuance,
          { gasLimit: gasLimitLastBlock }
        )
      } else {
        gasEstimate = await contract.estimateGas.redeemExactSetForToken(
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
      }
    }
  } catch (error: any) {
    console.log('Error estimating gas for FlashMintZeroEx:', error)
    if (canFail) {
      throw new FlashMintZeroExGasEstimateFailedError()
    }
    return defaultGasEstimate
  }

  // Add safety margin on top of estimate
  gasEstimate = gasEstimate.mul(100 + defaultGasMargin).div(100)

  return gasEstimate
}
