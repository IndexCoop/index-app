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
  claimableRewards: number | null
  cumulativeRevenue: number | null
  lifetimeRewards: number | null
  poolStakedBalance: number | null
  tokenData: TokenData | null
  tvl: number | null
  userStakedBalance: number | null
}

const PrtStakingContext = createContext<Context>({
  claimableRewards: null,
  cumulativeRevenue: null,
  lifetimeRewards: null,
  poolStakedBalance: null,
  tokenData: null,
  tvl: null,
  userStakedBalance: null,
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
  const [claimableRewards, setClaimableRewards] = useState<number | null>(null)
  const [lifetimeRewards, setLifetimeRewards] = useState<number | null>(null)
  const [userStakedBalance, setUserStakedBalance] = useState<number | null>(
    null,
  )
  const [poolStakedBalance, setPoolStakedBalance] = useState<number | null>(
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
      setClaimableRewards(0.02)
      setLifetimeRewards(1.2)
      setUserStakedBalance(3.64)
      setPoolStakedBalance(967)
    }
    fetchTokenData()
  }, [tokenData.address, tokenData.symbol])

  return (
    <PrtStakingContext.Provider
      value={{
        claimableRewards,
        cumulativeRevenue,
        lifetimeRewards,
        poolStakedBalance,
        tokenData,
        tvl,
        userStakedBalance,
      }}
    >
      {children}
    </PrtStakingContext.Provider>
  )
}

export const usePrtStakingContext = () => useContext(PrtStakingContext)
