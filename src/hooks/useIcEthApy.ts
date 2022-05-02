import { useCallback, useEffect, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'

import { toWei } from 'utils'

export const useIcEthApy = (): { apy: BigNumber } => {
  const [apy, setApy] = useState(BigNumber.from(0))

  const fetchApy = useCallback(async () => {
    try {
      const resp = await fetch('https://api.indexcoop.com/iceth/apy')
      const { apy } = await resp.json()
      setApy(toWei(apy))
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
