import { useCallback, useEffect, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'

import { IndexApi } from 'utils/indexApi'

export const useIcEthApy = (): { apy: BigNumber } => {
  const [apy, setApy] = useState(BigNumber.from(0))

  const fetchApy = useCallback(async () => {
    try {
      const indexApi = new IndexApi()
      const { apy } = await indexApi.get('/iceth/apy')
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
