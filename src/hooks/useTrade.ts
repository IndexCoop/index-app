import { useCallback, useEffect, useState } from 'react'

import { useNetwork, useSendTransaction } from 'wagmi'

import { TransactionRequest } from '@ethersproject/abstract-provider'
import { BigNumber } from '@ethersproject/bignumber'

import { OPTIMISM } from 'constants/chains'
import {
  zeroExRouterAddress,
  zeroExRouterOptimismAddress,
} from 'constants/ethContractAddresses'
import { ZeroExQuote } from 'hooks/useBestQuote'
import { useWallet } from 'hooks/useWallet'
import { fromWei } from 'utils'

import { useBalances } from './useBalance'

export const useTrade = () => {
  const { address } = useWallet()
  const { chain } = useNetwork()
  const [zeroExQuote, setZeroExQuote] = useState<ZeroExQuote | null>(null)

  const txRequest: TransactionRequest = {
    chainId: Number(zeroExQuote?.chainId) ?? undefined,
    from: address ?? undefined,
    to: zeroExQuote?.to,
    data: zeroExQuote?.data,
    value: BigNumber.from(zeroExQuote?.value ?? 0),
    // gas: undefined, use metamask estimated gas limit
  }
  const { sendTransaction, status } = useSendTransaction({
    mode: 'recklesslyUnprepared',
    chainId: chain?.id,
    from: address,
    to:
      chain?.id === OPTIMISM.chainId
        ? zeroExRouterOptimismAddress
        : zeroExRouterAddress,
    value: BigNumber.from(0),
  })
  const { getBalance } = useBalances()

  const [isTransacting, setIsTransacting] = useState(false)

  const executeTrade = useCallback(
    async (quote: ZeroExQuote | null) => {
      if (!address || !quote) return
      setZeroExQuote(quote)

      const inputToken = quote.inputToken
      const inputTokenAmount = quote.isIssuance
        ? quote.inputOutputTokenAmount
        : quote.setTokenAmount

      let requiredBalance = fromWei(
        BigNumber.from(inputTokenAmount),
        inputToken.decimals
      )
      const spendingTokenBalance =
        getBalance(inputToken.symbol) || BigNumber.from(0)
      if (spendingTokenBalance.lt(requiredBalance)) return

      const req: TransactionRequest = {
        chainId: Number(quote.chainId),
        from: address,
        to: quote.to,
        data: quote.data,
        value: BigNumber.from(quote.value ?? 0),
      }
      try {
        setIsTransacting(true)
        sendTransaction?.({
          recklesslySetUnpreparedRequest: req,
        })
      } catch (error) {
        setIsTransacting(false)
        console.log('Error sending transaction', error)
      }
    },
    [address]
  )

  useEffect(() => {
    if (status !== 'idle' && status) setIsTransacting(false)
  }, [status])

  return { executeTrade, isTransacting }
}
