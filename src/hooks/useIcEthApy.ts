import { useCallback, useEffect, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'

import { IndexApiBaseUrl } from 'constants/server'

export const useIcEthApy = (): { apy: BigNumber } => {
  const [apy, setApy] = useState(BigNumber.from(0))

  const fetchApy = useCallback(async () => {
    try {
      const resp = await fetch(`${IndexApiBaseUrl}/iceth/apy`, {
        headers: {
          Origin: 'https://app.indexcoop.com',
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
