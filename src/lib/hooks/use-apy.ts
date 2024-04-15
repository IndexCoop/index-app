import { BigNumber } from '@ethersproject/bignumber'
import { useCallback, useEffect, useState } from 'react'

import { IndexApi } from '@/lib/utils/api/index-api'

export const useApy = (symbol: string): { apy: BigNumber } => {
  const [apy, setApy] = useState(BigNumber.from(0))

  const fetchApy = useCallback(async () => {
    try {
      const indexApi = new IndexApi()
      const { apy } = await indexApi.get(`/${symbol.toLowerCase()}/apy`)
      setApy(BigNumber.from(apy))
    } catch (err) {
      console.log(err)
    }
  }, [symbol])

  useEffect(() => {
    fetchApy()
  }, [fetchApy])

  return { apy }
}
