import { useNetwork } from '@/lib/hooks/use-network'
import { useWallet } from '@/lib/hooks/use-wallet'
import { TxSimulator } from '@/lib/utils/simulator'

import type { QuoteTransaction } from '@/lib/hooks/use-best-quote/types'
import type { TxSimulationResult } from '@/lib/utils/simulator'

export const useSimulateQuote = (tx: QuoteTransaction | null) => {
  const { chainId } = useNetwork()
  const { provider } = useWallet()

  async function simulateTrade(): Promise<TxSimulationResult> {
    if (!chainId || !provider || !tx)
      return {
        success: false,
        simulation: {
          errorMessage: 'Configuration error',
        },
      }
    const accessKey = process.env.NEXT_PUBLIC_TENDERLY_ACCESS_KEY ?? ''
    const project = process.env.NEXT_PUBLIC_TENDERLY_PROJECT ?? ''
    const user = process.env.NEXT_PUBLIC_TENDERLY_USER ?? ''
    let success = false
    try {
      const simulator = new TxSimulator(accessKey, user, project)
      const result = await simulator.simulate(tx)
      return result
    } catch {
      // fallback: make a gas estimate
      const gasEstimate: bigint = await provider.estimateGas(tx)
      success = gasEstimate > 0
      return {
        success,
        simulation: {
          errorMessage: 'Gas estimate fallback',
        },
      }
    }
  }

  return { simulateTrade }
}
