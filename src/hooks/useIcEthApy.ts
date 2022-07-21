import { useCallback, useEffect, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'

import { getApiKey, IndexApiBaseUrl } from 'constants/server'

export const useIcEthApy = (): { apy: BigNumber } => {
  const [apy, setApy] = useState(BigNumber.from(0))

  const fetchApy = useCallback(async () => {
    try {
      const key = getApiKey()
      const resp = await fetch(`${IndexApiBaseUrl}/iceth/apy`, {
        headers: {
          'X-INDEXCOOP-API-KEY': key,
        },
      })
      const { apy } = await resp.json()
      setApy(BigNumber.from(apy))
      console.log(apy)
    } catch (err) {
      console.log(err)
    }
  }, [])

  useEffect(() => {
    fetchApy()
  }, [fetchApy])

  return { apy }
}
