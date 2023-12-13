import { useCallback, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'

import { EnhancedFlashMintQuote } from '@/lib/hooks/useBestQuote'
import { useNetwork } from '@/lib/hooks/useNetwork'
import { useWallet } from '@/lib/hooks/useWallet'
import { logTx } from '@/lib/utils/api/analytics'
import {
  GasEstimatooor,
  GasEstimatooorFailedError,
} from '@/lib/utils/gasEstimatooor'
import { getAddressForToken } from '@/lib/utils/tokens'

export const useFlashMintTrade = () => {
  const { address, signer } = useWallet()
  const { chainId } = useNetwork()

  const [isTransacting, setIsTransacting] = useState(false)
  const [txWouldFail, setTxWouldFail] = useState(false)

  const executeFlashMintTrade = useCallback(
    async (
      quote: EnhancedFlashMintQuote | null,
      slippage: number,
      override: boolean = false
    ) => {
      if (!address || !chainId || !quote) return
      const { indexTokenAmount, inputToken, isMinting, outputToken } = quote

      const inputTokenAddress = getAddressForToken(inputToken, chainId)
      const outputTokenAddress = getAddressForToken(outputToken, chainId)
      if (!outputTokenAddress || !inputTokenAddress) return

      const indexToken = isMinting ? outputTokenAddress : inputTokenAddress

      try {
        setIsTransacting(true)
        const { tx } = quote
        const defaultGasEstimate = BigNumber.from(6_000_000)
        const gasEstimatooor = new GasEstimatooor(signer, defaultGasEstimate)
        // `estimate` will throw error if tx would fail
        // If the user overrides, we use the `defaultGasEstimate`
        const canFail = !override
        const gasLimit = await gasEstimatooor.estimate(tx, canFail)
        tx.gasLimit = gasLimit
        const res = await signer.sendTransaction(tx)
        logTx(chainId ?? -1, 'Wrapped', res)
        setIsTransacting(false)
      } catch (error) {
        console.log('Error sending FlashMint tx', error)
        console.log('Override?', override)
        setIsTransacting(false)
        if (
          error instanceof GasEstimatooorFailedError &&
          error.statusCode === 1001
        ) {
          setTxWouldFail(true)
        }
        throw error
      }
    },
    [address, chainId, signer]
  )

  return { executeFlashMintTrade, isTransacting, txWouldFail }
}
