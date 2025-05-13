import { useNetwork } from '@/lib/hooks/use-network'
import { useWallet } from '@/lib/hooks/use-wallet'
import { TxSimulator } from '@/lib/utils/simulator'

import { QuoteTransaction } from './use-best-quote/types'

export const useSimulateQuote = (tx: QuoteTransaction | null) => {
  const { chainId } = useNetwork()
  const { provider } = useWallet()

  async function simulateTrade(): Promise<boolean> {
    if (!chainId) return false
    if (!provider) return false
    if (!tx) return false
    const accessKey = process.env.NEXT_PUBLIC_TENDERLY_ACCESS_KEY ?? ''
    const project = process.env.NEXT_PUBLIC_TENDERLY_PROJECT ?? ''
    const user = process.env.NEXT_PUBLIC_TENDERLY_USER ?? ''
    let success = false
    try {
      const simulator = new TxSimulator(accessKey, user, project)
      success = await simulator.simulate(tx)
    } catch {
      // fallback: make a gas estimate
      const gasEstimate: bigint = await provider.estimateGas(tx)
      success = gasEstimate > 0
    }
    return success
  }

  return { simulateTrade }
}
