import { useEffect, useState } from 'react'

import { ETH, type Token } from '@/constants/tokens'
import { useNetwork } from '@/lib/hooks/use-network'
import { getTokenPrice } from '@/lib/utils/token-price'
import { getNativeToken } from '@/lib/utils/tokens'

export function useNativeTokenPrice(chainId?: number): number {
  const [nativeToken, setNativeToken] = useState(ETH)
  const nativeTokenPrice = useTokenPrice(nativeToken)

  useEffect(() => {
    const nativeToken = getNativeToken(chainId)
    setNativeToken(nativeToken ?? ETH)
  }, [chainId])

  return nativeTokenPrice
}

export function useTokenPrice(token: Token): number {
  const { chainId, isSupportedNetwork } = useNetwork()
  const [tokenPrice, setTokenPrice] = useState<number>(0)

  useEffect(() => {
    if (chainId === undefined || !isSupportedNetwork) {
      setTokenPrice(0)
      return
    }
    const fetchTokenPrice = async () => {
      const tokenPrice = await getTokenPrice(token, chainId)
      setTokenPrice(tokenPrice)
    }
    fetchTokenPrice()
  }, [chainId, isSupportedNetwork, token])

  return tokenPrice
}
