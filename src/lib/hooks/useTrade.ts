import { useCallback, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { prepareSendTransaction, sendTransaction } from '@wagmi/core'

import { ZeroExQuote } from '@/lib/hooks/useBestQuote'
import { useNetwork } from '@/lib/hooks/useNetwork'
import { useWallet } from '@/lib/hooks/useWallet'
import { useBalanceData } from '@/lib/providers/Balances'
import { fromWei } from '@/lib/utils'

export const useTrade = () => {
  const { address } = useWallet()
  const { chainId } = useNetwork()

  const { getTokenBalance } = useBalanceData()

  const [isTransacting, setIsTransacting] = useState(false)

  const executeTrade = useCallback(
    async (quote: ZeroExQuote | null) => {
      if (!address || !quote) return

      const inputToken = quote.inputToken
      const inputTokenAmount = quote.isMinting
        ? quote.inputOutputTokenAmount
        : quote.indexTokenAmount

      let requiredBalance = fromWei(
        BigNumber.from(inputTokenAmount),
        inputToken.decimals
      )
      const spendingTokenBalance =
        getTokenBalance(inputToken.symbol, chainId) || BigNumber.from(0)
      if (spendingTokenBalance.lt(requiredBalance)) return

      try {
        setIsTransacting(true)
        const request = await prepareSendTransaction({
          account: address,
          chainId: Number(quote.chainId),
          to: quote.to,
          data: quote.data,
          value: BigInt(quote.value ?? 0),
        })
        const { hash } = await sendTransaction(request)
        console.log(hash)
      } catch (error) {
        setIsTransacting(false)
        console.log('Error sending transaction', error)
      }
    },
    [address, chainId, getTokenBalance]
  )

  return { executeTrade, isTransacting }
}
