'use client'

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { Address, isAddress } from 'viem'
import { useAccount, useReadContract } from 'wagmi'

import { PrtStakingAbi } from '@/app/prt-staking/abis/prt-staking-abi'
import { ProductRevenueToken } from '@/app/prt-staking/types'
import { formatWeiAsNumber } from '@/lib/utils'
import { fetchCumulativeRevenue, fetchTvl } from '@/lib/utils/fetch'

interface Context {
  claimPrts: () => void
  claimableRewards: number | undefined
  cumulativeRevenue: number | null
  lifetimeRewards: number | undefined
  poolStakedBalance: number | undefined
  stakePrts: (amount: bigint) => void
  token: ProductRevenueToken | null
  tvl: number | null
  unstakePrts: (amount: bigint) => void
  userStakedBalance: number | undefined
}

const PrtStakingContext = createContext<Context>({
  claimPrts: () => {},
  claimableRewards: undefined,
  cumulativeRevenue: null,
  lifetimeRewards: undefined,
  poolStakedBalance: undefined,
  stakePrts: () => {},
  token: null,
  tvl: null,
  unstakePrts: () => {},
  userStakedBalance: undefined,
})

interface Props {
  children: ReactNode
  token: ProductRevenueToken
}

export const PrtStakingContextProvider = ({ children, token }: Props) => {
  const { address } = useAccount()
  const [tvl, setTvl] = useState<number | null>(null)
  const [cumulativeRevenue, setCumulativeRevenue] = useState<number | null>(
    null,
  )
  const prtTokenAddress = token.prtTokenData.address as Address
  const prtTokenDecimals = token.prtTokenData.decimals

  const { data: userStakedBalance } = useReadContract({
    abi: PrtStakingAbi,
    address: prtTokenAddress,
    functionName: 'balanceOf',
    args: [address!],
    query: {
      enabled: isAddress(address ?? ''),
    },
  })

  const { data: poolStakedBalance } = useReadContract({
    abi: PrtStakingAbi,
    address: prtTokenAddress,
    functionName: 'totalSupply',
  })

  const { data: claimableRewards } = useReadContract({
    abi: PrtStakingAbi,
    address: prtTokenAddress,
    functionName: 'getPendingRewards',
    args: [address!],
    query: {
      enabled: isAddress(address ?? ''),
    },
  })

  const { data: lifetimeRewards } = useReadContract({
    abi: PrtStakingAbi,
    address: prtTokenAddress,
    functionName: 'getLifetimeRewards',
    args: [address!],
    query: {
      enabled: isAddress(address ?? ''),
    },
  })

  useEffect(() => {
    async function fetchTokenData() {
      const [tvl, cumulativeRevenue] = await Promise.all([
        fetchTvl(token.tokenData.symbol),
        fetchCumulativeRevenue(token.tokenData.address),
      ])
      setTvl(tvl)
      setCumulativeRevenue(cumulativeRevenue)
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
        claimableRewards: formatWeiAsNumber(claimableRewards, prtTokenDecimals),
        cumulativeRevenue,
        lifetimeRewards: formatWeiAsNumber(lifetimeRewards, prtTokenDecimals),
        poolStakedBalance: formatWeiAsNumber(
          poolStakedBalance,
          prtTokenDecimals,
        ),
        stakePrts,
        token,
        tvl,
        unstakePrts,
        userStakedBalance: formatWeiAsNumber(
          userStakedBalance,
          prtTokenDecimals,
        ),
      }}
    >
      {children}
    </PrtStakingContext.Provider>
  )
}

export const usePrtStakingContext = () => useContext(PrtStakingContext)
