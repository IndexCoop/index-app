import { useCallback, useEffect, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { JsonRpcProvider } from '@ethersproject/providers'

export const useTokenSupply = (
  setTokenAddress: string,
  provider: JsonRpcProvider,
  chainId: number
): BigNumber => {
  const [tokenSupply, setTokenSupply] = useState(BigNumber.from(0))

  const fetchSupply = useCallback(async () => {
    try {
      const tokenSupply = BigNumber.from(0)
      // TODO: fetch from API
      setTokenSupply(tokenSupply)
    } catch (error) {
      console.log('Error fetching current supply', error)
      setTokenSupply(BigNumber.from(0))
    }
  }, [chainId, provider, setTokenAddress])

  useEffect(() => {
    fetchSupply()
  }, [fetchSupply])

  return tokenSupply
}
