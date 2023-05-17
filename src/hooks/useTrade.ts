import { useCallback, useEffect, useState } from 'react'

import { PopulatedTransaction } from 'ethers'
import { useSendTransaction } from 'wagmi'

import { TransactionRequest } from '@ethersproject/abstract-provider'
import { BigNumber } from '@ethersproject/bignumber'

import { OPTIMISM } from 'constants/chains'
import {
  zeroExRouterAddress,
  zeroExRouterOptimismAddress,
} from 'constants/contractAddresses'
import { ZeroExQuote } from 'hooks/useBestQuote'
import { useNetwork } from 'hooks/useNetwork'
import { useWallet } from 'hooks/useWallet'
import { useBalanceData } from 'providers/Balances'
import { fromWei } from 'utils'
import { logTransaction } from 'utils/api/analytics'
import { TxSimulator } from 'utils/simulator'

export const useTrade = () => {
  const { address } = useWallet()
  const { chainId } = useNetwork()
  const [zeroExQuote, setZeroExQuote] = useState<ZeroExQuote | null>(null)

  const txRequest: TransactionRequest = {
    chainId: Number(zeroExQuote?.chainId) ?? undefined,
    from: address ?? undefined,
    to: zeroExQuote?.to,
    data: zeroExQuote?.data,
    value: BigNumber.from(zeroExQuote?.value ?? 0),
    // gas: undefined, use metamask estimated gas limit
  }
  const { sendTransaction, status, data } = useSendTransaction({
    mode: 'recklesslyUnprepared',
    chainId: chainId,
    from: address,
    to:
      chainId === OPTIMISM.chainId
        ? zeroExRouterOptimismAddress
        : zeroExRouterAddress,
    value: BigNumber.from(0),
  })
  const { getTokenBalance } = useBalanceData()

  const [isTransacting, setIsTransacting] = useState(false)

  const executeTrade = useCallback(
    async (quote: ZeroExQuote | null) => {
        console.log("executeTrade - ", quote)
          console.log("executeTrade - chainId", chainId)
      if (!address || !quote) return
        console.log("executeTrade - address and quote are not null")
      setZeroExQuote(quote)
        console.log("executeTrade - setZeroExQuote returned")

      const inputToken = quote.inputToken
      const inputTokenAmount = quote.isMinting
        ? quote.inputOutputTokenAmount
        : quote.indexTokenAmount

        console.log("executeTrade - getting RequiredBalance")
      let requiredBalance = fromWei(
        BigNumber.from(inputTokenAmount),
        inputToken.decimals
      )
        console.log("executeTrade - requiredBalance", requiredBalance.toString());
      const spendingTokenBalance =
        getTokenBalance(inputToken.symbol, chainId) || BigNumber.from(0)
        console.log("executeTrade - spendingTokenBalance", spendingTokenBalance.toString())
      if (spendingTokenBalance.lt(requiredBalance)) return
        console.log("executeTrade - spendingTokenBalance sufficient")

      const req: TransactionRequest = {
        chainId: Number(quote.chainId),
        from: address,
        to: quote.to,
        data: quote.data,
        value: BigNumber.from(quote.value ?? 0),
      }
        console.log("executeTrade - req: ", req)

      const req2: PopulatedTransaction = {
        chainId: Number(quote.chainId),
        from: address,
        to: quote.to,
        data: quote.data,
        value: BigNumber.from(quote.value ?? 0),
      }
        console.log("executeTrade - req2: ", req2)
      try {
        // const accessKey = process.env.REACT_APP_TENDERLY_ACCESS_KEY ?? ''
        // const simulator = new TxSimulator(accessKey)
        // await simulator.simulate(req2)
        setIsTransacting(true)
          console.log("executeTrade - chainId", chainId)
          console.log("executeTrade - quote.chainId", quote.chainId)
          console.log("executeTrade - sendTransaction: ", sendTransaction)
        sendTransaction?.({
          recklesslySetUnpreparedRequest: req,
        })
        console.log("executeTrade - sentTransaction")
      } catch (error) {
        setIsTransacting(false)
        console.log('Error sending transaction', error)
      }
    },
    [address, chainId, getTokenBalance]
  )

  useEffect(() => {
    if (!data) return
    logTransaction(chainId ?? -1, 'SWAP', '', JSON.stringify(data))
  }, [data])

  useEffect(() => {
    if (status !== 'idle' && status) setIsTransacting(false)
  }, [status])

  return { executeTrade, isTransacting }
}
