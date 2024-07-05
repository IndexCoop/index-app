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
  claimPrts: () => void
  claimableRewards: number | null
  cumulativeRevenue: number | null
  lifetimeRewards: number | null
  poolStakedBalance: number | null
  stakePrts: (amount: bigint) => void
  token: ProductRevenueToken | null
  tvl: number | null
  unstakePrts: (amount: bigint) => void
  userStakedBalance: number | null
}

const PrtStakingContext = createContext<Context>({
  claimPrts: () => {},
  claimableRewards: null,
  cumulativeRevenue: null,
  lifetimeRewards: null,
  poolStakedBalance: null,
  stakePrts: () => {},
  token: null,
  tvl: null,
  unstakePrts: () => {},
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

  // TODO
  const readClaimableRewards = async () => {
    // https://github.com/IndexCoop/periphery/blob/main/src/interfaces/staking/ISnapshotStakingPool.sol#L71
    return 0.02
  }

  // TODO
  const readLifetimeRewards = async () => {
    // https://github.com/IndexCoop/periphery/blob/main/src/interfaces/staking/ISnapshotStakingPool.sol#L94
    return 1.2
  }

  // TODO
  const readUserStakedBalance = async () => {
    // https://github.com/IndexCoop/periphery/blob/main/src/interfaces/staking/ISnapshotStakingPool.sol#L84
    return 3.64
  }

  // TODO
  const readPoolStakedBalance = async () => {
    // https://github.com/IndexCoop/periphery/blob/main/src/interfaces/staking/ISnapshotStakingPool.sol#L89
    return 967
  }

  useEffect(() => {
    async function fetchTokenData() {
      const [
        tvl,
        cumulativeRevenue,
        claimableRewards,
        lifetimeRewards,
        userStakedBalance,
        poolStakedBalance,
      ] = await Promise.all([
        fetchTvl(token.tokenData.symbol),
        fetchCumulativeRevenue(token.tokenData.address),
        readClaimableRewards(),
        readLifetimeRewards(),
        readUserStakedBalance(),
        readPoolStakedBalance(),
      ])
      setTvl(tvl)
      setCumulativeRevenue(cumulativeRevenue)
      setClaimableRewards(claimableRewards)
      setLifetimeRewards(lifetimeRewards)
      setUserStakedBalance(userStakedBalance)
      setPoolStakedBalance(poolStakedBalance)
    }
    fetchTokenData()
  }, [token.tokenData.address, token.tokenData.symbol])

  // TODO
  const claimPrts = () => {
    //  https://github.com/IndexCoop/periphery/blob/main/src/interfaces/staking/ISnapshotStakingPool.sol#L45
  }

  // TODO
  const stakePrts = () => {
    // https://github.com/IndexCoop/periphery/blob/main/src/interfaces/staking/ISnapshotStakingPool.sol#L34
  }

  // TODO
  const unstakePrts = () => {
    // https://github.com/IndexCoop/periphery/blob/main/src/interfaces/staking/ISnapshotStakingPool.sol#L38
  }

  return (
    <PrtStakingContext.Provider
      value={{
        claimPrts,
        claimableRewards,
        cumulativeRevenue,
        lifetimeRewards,
        poolStakedBalance,
        stakePrts,
        token,
        tvl,
        unstakePrts,
        userStakedBalance,
      }}
    >
      {children}
    </PrtStakingContext.Provider>
  )
}

export const usePrtStakingContext = () => useContext(PrtStakingContext)
