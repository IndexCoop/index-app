import { useCallback, useState } from 'react'
import { Hex } from 'viem'

import { BigNumber } from '@ethersproject/bignumber'
import { prepareSendTransaction, sendTransaction } from '@wagmi/core'

import { ZeroExQuote } from './use-best-quote/types'
import { useNetwork } from '@/lib/hooks/useNetwork'
import { useWallet } from '@/lib/hooks/useWallet'
import { fromWei } from '@/lib/utils'

import { useBalance } from './use-balance'

export const useTrade = () => {
  const { address } = useWallet()
  const { chainId } = useNetwork()

  const inputTokenBalance = useBalance(address)

  const [isTransacting, setIsTransacting] = useState(false)

  const executeTrade = useCallback(
    async (quote: ZeroExQuote | null) => {
      if (!address || !quote) return

      const inputToken = quote.inputToken
      const inputTokenAmount = quote.isMinting
        ? quote.inputOutputTokenAmount
        : quote.indexTokenAmount

      const requiredBalance = fromWei(
        BigNumber.from(inputTokenAmount),
        inputToken.decimals
      )
      // TODO:
      const spendingTokenBalance = BigNumber.from(0)
      // TODO: getTokenBalance(inputToken.symbol, chainId) || BigNumber.from(0)
      if (spendingTokenBalance.lt(requiredBalance)) return

      try {
        setIsTransacting(true)
        const request = await prepareSendTransaction({
          account: address,
          chainId: Number(quote.chainId),
          to: quote.tx.to,
          data: quote.tx.data as Hex,
          value: BigInt(quote.tx.value?.toString() ?? '0'),
        })
        const { hash } = await sendTransaction(request)
        console.log(hash)
      } catch (error) {
        setIsTransacting(false)
        console.log('Error sending transaction', error)
      }
    },
    [address, chainId]
  )

  return { executeTrade, isTransacting }
}
