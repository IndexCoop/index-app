import { QuoteTransaction } from '@/lib/hooks/use-best-quote/types'
import { IndexRpcProvider } from '@/lib/hooks/use-wallet'

// Default gas margin to add on top of estimate
const defaultGasMargin = BigInt(10)

export class GasEstimatooorFailedError extends Error {
  statusCode = 1001
  constructor() {
    super('Failed to estimate gas.')
    // 👇️ because we are extending a built-in class
    Object.setPrototypeOf(this, GasEstimatooorFailedError.prototype)
  }
}

export class GasEstimatooor {
  constructor(
    readonly provider: IndexRpcProvider,
    readonly defaultGasEstimate: bigint,
  ) {}

  async estimate(
    tx?: QuoteTransaction,
    canFail: boolean = true,
  ): Promise<bigint> {
    const { defaultGasEstimate, provider } = this

    let gasEstimate = defaultGasEstimate
    if (!tx) return gasEstimate

    try {
      gasEstimate = await provider.estimateGas(tx)
    } catch (error: any) {
      if (canFail) {
        throw new GasEstimatooorFailedError()
      }
      return defaultGasEstimate
    }

    // Add safety margin on top of estimate
    gasEstimate = (gasEstimate * (BigInt(100) + defaultGasMargin)) / BigInt(100)
    return gasEstimate
  }
}
