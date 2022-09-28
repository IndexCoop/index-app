import { useCallback, useEffect, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'

export const useTokenSupply = (
  indexTokenAddress: string,
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
  }, [chainId, indexTokenAddress])

  useEffect(() => {
    fetchSupply()
  }, [fetchSupply])

  return tokenSupply
}
