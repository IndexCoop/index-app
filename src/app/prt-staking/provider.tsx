'use client'

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

import { ProductRevenueToken } from '@/app/prt-staking/types'
import { fetchCumulativeRevenue, fetchTvl } from '@/lib/utils/fetch'

interface Context {
  claimableRewards: number | null
  cumulativeRevenue: number | null
  lifetimeRewards: number | null
  poolStakedBalance: number | null
  token: ProductRevenueToken | null
  tvl: number | null
  userStakedBalance: number | null
}

const PrtStakingContext = createContext<Context>({
  claimableRewards: null,
  cumulativeRevenue: null,
  lifetimeRewards: null,
  poolStakedBalance: null,
  token: null,
  tvl: null,
  userStakedBalance: null,
})

interface Props {
  children: ReactNode
  token: ProductRevenueToken
}

export const PrtStakingContextProvider = ({ children, token }: Props) => {
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
        fetchTvl(token.tokenData.symbol),
        fetchCumulativeRevenue(token.tokenData.address),
      ])
      setTvl(tvl)
      setCumulativeRevenue(cumulativeRevenue)
      setClaimableRewards(0.02)
      setLifetimeRewards(1.2)
      setUserStakedBalance(3.64)
      setPoolStakedBalance(967)
    }
    fetchTokenData()
  }, [token.tokenData.address, token.tokenData.symbol])

  return (
    <PrtStakingContext.Provider
      value={{
        claimableRewards,
        cumulativeRevenue,
        lifetimeRewards,
        poolStakedBalance,
        token,
        tvl,
        userStakedBalance,
      }}
    >
      {children}
    </PrtStakingContext.Provider>
  )
}

export const usePrtStakingContext = () => useContext(PrtStakingContext)
