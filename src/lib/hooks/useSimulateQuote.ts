import { BigNumber, PopulatedTransaction } from 'ethers'

import { JsonRpcProvider } from '@ethersproject/providers'

import { useNetwork } from '@/lib/hooks/useNetwork'
import { useWallet } from '@/lib/hooks/useWallet'
import { TxSimulator } from '@/lib/utils/simulator'

import { FlashMintQuoteResult } from './useFlashMintQuote'

export const useSimulateQuote = (quoteResult: FlashMintQuoteResult) => {
  const { chainId } = useNetwork()
  const { provider, signer } = useWallet()

  async function simulateTrade(): Promise<boolean> {
    if (!chainId) return false
    const builder = new TransactionRequestBuilder(provider, signer, chainId)
    const request = await builder.makeTransactionRequest(quoteResult)
    if (!request) return false
    const accessKey = process.env.NEXT_PUBLIC_TENDERLY_ACCESS_KEY ?? ''
    const project = 'project'
    const user = process.env.NEXT_PUBLIC_TENDERLY_USER ?? ''
    let success = false
    try {
      const simulator = new TxSimulator(accessKey, user, project)
      success = await simulator.simulate(request)
    } catch {
      // fallback: make a gas estimate
      let gasEstimate: BigNumber = await provider.estimateGas(request)
      success = gasEstimate.gt(0)
    }
    return success
  }

  return { simulateTrade }
}

class TransactionRequestBuilder {
  constructor(
    readonly provider: JsonRpcProvider,
    readonly signer: any,
    readonly chainId: number
  ) {}

  async makeTransactionRequest(
    quoteResult: FlashMintQuoteResult
  ): Promise<PopulatedTransaction | null> {
    const { quotes } = quoteResult
    const { flashMint } = quotes

    if (flashMint) {
      return flashMint.tx
    }

    return null
  }
}
