import { useCallback, useState } from 'react'
import { Hex } from 'viem'
import { PublicClient, usePublicClient } from 'wagmi'
import { prepareSendTransaction, sendTransaction } from '@wagmi/core'

import { BigNumber } from '@ethersproject/bignumber'

import { Token } from '@/constants/tokens'
import { Quote } from '@/lib/hooks/use-best-quote/types'
import { useNetwork } from '@/lib/hooks/use-network'
import { useWallet } from '@/lib/hooks/use-wallet'
import { logTx } from '@/lib/utils/api/analytics'
import {
  GasEstimatooor,
  GasEstimatooorFailedError,
} from '@/lib/utils/gas-estimatooor'
import { getAddressForToken, isNativeCurrency } from '@/lib/utils/tokens'

import { BalanceProvider } from './use-balance'

async function getInputTokenBalance(
  inputToken: Token,
  address: string,
  publicClient: PublicClient
): Promise<bigint> {
  const balanceProvider = new BalanceProvider(publicClient)
  return isNativeCurrency(inputToken, publicClient.chain.id)
    ? await balanceProvider.getNativeBalance(address)
    : await balanceProvider.getErc20Balance(address, inputToken.address!)
}

export const useTrade = () => {
  const publicClient = usePublicClient()
  const { address, signer } = useWallet()
  const { chainId } = useNetwork()

  const [isTransacting, setIsTransacting] = useState(false)
  const [txWouldFail, setTxWouldFail] = useState(false)

  const executeTrade = useCallback(
    async (quote: Quote | null, override: boolean = false) => {
      if (!address || !chainId || !quote) return
      const { inputToken, inputTokenAmount, outputToken } = quote

      // Check that input/ouput token are known
      const inputTokenAddress = getAddressForToken(inputToken, chainId)
      const outputTokenAddress = getAddressForToken(outputToken, chainId)
      if (!outputTokenAddress || !inputTokenAddress) return

      // Check is user has sufficient funds
      const inputTokenBalance = await getInputTokenBalance(
        inputToken,
        address,
        publicClient
      )
      if (BigInt(inputTokenAmount.toString()) > inputTokenBalance) return

      try {
        setIsTransacting(true)
        const { tx } = quote
        // TODO: just for flash mint
        const defaultGasEstimate = BigNumber.from(6_000_000)
        const gasEstimatooor = new GasEstimatooor(signer, defaultGasEstimate)
        // Will throw error if tx would fail
        // If the user overrides, we take any gas estimate
        const canFail = override
        const gasLimit = await gasEstimatooor.estimate(tx, canFail)
        tx.gasLimit = gasLimit
        console.log(BigInt(gasLimit.toString()), gasLimit.toString())
        const request = await prepareSendTransaction({
          account: address,
          chainId: Number(quote.chainId),
          // TODO:
          gas: BigInt(gasLimit.toString()),
          to: quote.tx.to,
          data: quote.tx.data as Hex,
          value: BigInt(quote.tx.value?.toString() ?? '0'),
        })
        const { hash } = await sendTransaction(request)
        // TODO:
        // logTx(chainId ?? -1, 'Tx', hash)
        console.log(hash)
        setIsTransacting(false)
      } catch (error) {
        console.log('Override?', override)
        console.log('Error sending transaction', error)
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
    [address, chainId, publicClient, signer]
  )

  return { executeTrade, isTransacting, txWouldFail }
}
