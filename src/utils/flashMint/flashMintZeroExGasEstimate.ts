import { BigNumber } from '@ethersproject/bignumber'

import { DefaultGasLimitFlashMintZeroEx } from 'constants/gas'
import { Token } from 'constants/tokens'
import { getFlashMintZeroExTransaction } from 'utils/flashMint/flashMintZeroExTransaction'

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
  let gasEstimate = defaultGasEstimate

  const tx = getFlashMintZeroExTransaction(
    isMinting,
    inputToken,
    outputToken,
    indexTokenAmount,
    inputOutputTokenAmount,
    inputTokenBalance,
    componentQuotes,
    provider,
    signer,
    chainId
  )
  if (!tx) return gasEstimate

  try {
    gasEstimate = await signer.estimateGas(tx)
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
