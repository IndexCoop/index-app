import { BigNumber, PopulatedTransaction } from 'ethers'

// Default gas margin to add on top of estimate
const defaultGasMargin = 10

export class GasEstimatooorFailedError extends Error {
  statusCode = 1001
  constructor() {
    super('Failed to estimate gas.')
    // 👇️ because we are extending a built-in class
    Object.setPrototypeOf(this, GasEstimatooorFailedError.prototype)
  }
}

export class GasEstimatooor {
  constructor(readonly signer: any, readonly defaultGasEstimate: BigNumber) {}

  async estimate(
    tx?: PopulatedTransaction,
    canFail: boolean = true
  ): Promise<BigNumber> {
    const { defaultGasEstimate, signer } = this

    let gasEstimate = defaultGasEstimate
    if (!tx) return gasEstimate

    try {
      gasEstimate = await signer.estimateGas(tx)
    } catch (error: any) {
      console.log('Error estimating gas:', error)
      if (canFail) {
        throw new GasEstimatooorFailedError()
      }
      return defaultGasEstimate
    }

    // Add safety margin on top of estimate
    gasEstimate = gasEstimate.mul(100 + defaultGasMargin).div(100)

    return gasEstimate
  }
}
