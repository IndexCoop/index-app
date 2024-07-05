'use client'

import { TokenData } from '@indexcoop/tokenlists'
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

import { fetchCumulativeRevenue, fetchTvl } from '@/lib/utils/fetch'

interface Context {
  cumulativeRevenue: number | null
  tvl: number | null
}

const PrtStakingContext = createContext<Context>({
  cumulativeRevenue: null,
  tvl: null,
})

interface Props {
  children: ReactNode
  tokenData: TokenData
}

export const PrtStakingContextProvider = ({ children, tokenData }: Props) => {
  const [tvl, setTvl] = useState<number | null>(null)
  const [cumulativeRevenue, setCumulativeRevenue] = useState<number | null>(
    null,
  )
  useEffect(() => {
    async function fetchTokenData() {
      const [tvl, cumulativeRevenue] = await Promise.all([
        fetchTvl(tokenData.symbol),
        fetchCumulativeRevenue(tokenData.address),
      ])
      setTvl(tvl)
      setCumulativeRevenue(cumulativeRevenue)
    }
    fetchTokenData()
  }, [tokenData.address, tokenData.symbol])

  return (
    <PrtStakingContext.Provider
      value={{
        cumulativeRevenue,
        tvl,
      }}
    >
      {children}
    </PrtStakingContext.Provider>
  )
}

export const usePrtStakingContext = () => useContext(PrtStakingContext)
