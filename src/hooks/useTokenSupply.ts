import { useCallback, useEffect, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { JsonRpcProvider } from '@ethersproject/providers'

import { getTokenSupply } from 'utils/setjsApi'

export const useTokenSupply = (
  setTokenAddress: string,
  provider: JsonRpcProvider,
  chainId: number
): BigNumber => {
  const [tokenSupply, setTokenSupply] = useState(BigNumber.from(0))

  const fetchSupply = useCallback(async () => {
    try {
      const tokenSupply = await getTokenSupply(
        setTokenAddress,
        provider,
        chainId
      )
      setTokenSupply(tokenSupply)
    } catch (error) {
      console.log('Error fetching current supply', error)
    }
  }, [chainId, provider, setTokenAddress])

  useEffect(() => {
    fetchSupply()
  }, [fetchSupply])

  return tokenSupply
}
