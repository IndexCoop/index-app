'use client'

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { Address, isAddress } from 'viem'
import { useAccount, useReadContract, useWalletClient } from 'wagmi'

import { PrtStakingAbi } from '@/app/prt-staking/abis/prt-staking-abi'
import { ProductRevenueToken } from '@/app/prt-staking/types'
import { formatWeiAsNumber } from '@/lib/utils'
import { fetchCumulativeRevenue, fetchTvl } from '@/lib/utils/fetch'

interface Context {
  claimPrts: () => void
  claimableRewards: number | null
  cumulativeRevenue: number | null
  lifetimeRewards: number | null
  poolStakedBalance: number | null
  refetchClaimableRewards: () => void
  refetchUserStakedBalance: () => void
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
  refetchClaimableRewards: () => {},
  refetchUserStakedBalance: () => {},
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
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()
  const [tvl, setTvl] = useState<number | null>(null)
  const [cumulativeRevenue, setCumulativeRevenue] = useState<number | null>(
    null,
  )
  const stakeTokenAddress = token.stakeTokenData.address as Address
  const stakedTokenAddress = token.stakedTokenData.address as Address
  const stakedTokenDecimals = token.stakedTokenData.decimals

  const { data: userStakedBalance, refetch: refetchUserStakedBalance } =
    useReadContract({
      abi: PrtStakingAbi,
      address: stakedTokenAddress,
      functionName: 'balanceOf',
      args: [address!],
      query: {
        enabled: isAddress(address ?? ''),
      },
    })

  const { data: poolStakedBalance } = useReadContract({
    abi: PrtStakingAbi,
    address: stakedTokenAddress,
    functionName: 'totalSupply',
  })

  const { data: claimableRewards, refetch: refetchClaimableRewards } =
    useReadContract({
      abi: PrtStakingAbi,
      address: stakedTokenAddress,
      functionName: 'getPendingRewards',
      args: [address!],
      query: {
        enabled: isAddress(address ?? ''),
      },
    })

  const { data: canStake } = useReadContract({
    abi: PrtStakingAbi,
    address: stakedTokenAddress,
    functionName: 'canStake',
  })

  const { data: isApprovedStaker } = useReadContract({
    abi: PrtStakingAbi,
    address: stakedTokenAddress,
    functionName: 'isApprovedStaker',
    args: [address!],
    query: {
      enabled: isAddress(address ?? ''),
    },
  })

  const { data: stakeSignMessage } = useReadContract({
    abi: PrtStakingAbi,
    address: stakedTokenAddress,
    functionName: 'message',
  })

  const { data: stakeDomain } = useReadContract({
    abi: PrtStakingAbi,
    address: stakedTokenAddress,
    functionName: 'eip712Domain',
  })

  const { data: lifetimeRewards } = useReadContract({
    abi: PrtStakingAbi,
    address: stakedTokenAddress,
    functionName: 'getLifetimeRewards',
    args: [address!],
    query: {
      enabled: isAddress(address ?? ''),
    },
  })

  useEffect(() => {
    async function fetchTokenData() {
      const [tvl, cumulativeRevenue] = await Promise.all([
        fetchTvl(token.rewardTokenData.symbol),
        fetchCumulativeRevenue(token.rewardTokenData.address),
      ])
      setTvl(tvl)
      setCumulativeRevenue(cumulativeRevenue)
    }
    fetchTokenData()
  }, [token.rewardTokenData.address, token.rewardTokenData.symbol])

  const claimPrts = useCallback(async () => {
    if (!walletClient) return
    await walletClient.writeContract({
      abi: PrtStakingAbi,
      address: stakedTokenAddress,
      functionName: 'claim',
    })
  }, [stakedTokenAddress, walletClient])

  const stakePrts = useCallback(
    async (amount: bigint) => {
      if (!walletClient) return
      // FIXME: Need to add proper UX handling for case where staking is disabled
      if (!canStake) return
      if (isApprovedStaker) {
        await walletClient.writeContract({
          abi: PrtStakingAbi,
          address: stakeTokenAddress,
          functionName: 'stake',
          args: [amount],
        })
      } else {
        if (!stakeSignMessage) return
        if (!stakeDomain) return
        const signature = await walletClient.signTypedData({
          // FIXME: Domain arg typing/format
          domain: stakeDomain,
          message: {
            contents: stakeSignMessage,
          },
        })
        await walletClient.writeContract({
          abi: PrtStakingAbi,
          address: stakeTokenAddress,
          functionName: 'stake',
          args: [amount, signature],
        })
      }
    },
    [
      canStake,
      isApprovedStaker,
      stakeDomain,
      stakeSignMessage,
      stakeTokenAddress,
      walletClient,
    ],
  )

  const unstakePrts = useCallback(
    async (amount: bigint) => {
      if (!walletClient) return
      await walletClient.writeContract({
        abi: PrtStakingAbi,
        address: stakeTokenAddress,
        functionName: 'unstake',
        args: [amount],
      })
    },
    [stakeTokenAddress, walletClient],
  )

  return (
    <PrtStakingContext.Provider
      value={{
        claimPrts,
        claimableRewards: formatWeiAsNumber(
          claimableRewards,
          stakedTokenDecimals,
        ),
        cumulativeRevenue,
        lifetimeRewards: formatWeiAsNumber(
          lifetimeRewards,
          stakedTokenDecimals,
        ),
        poolStakedBalance: formatWeiAsNumber(
          poolStakedBalance,
          stakedTokenDecimals,
        ),
        refetchClaimableRewards,
        refetchUserStakedBalance,
        stakePrts,
        token,
        tvl,
        unstakePrts,
        userStakedBalance: formatWeiAsNumber(
          userStakedBalance,
          stakedTokenDecimals,
        ),
      }}
    >
      {children}
    </PrtStakingContext.Provider>
  )
}

export const usePrtStakingContext = () => useContext(PrtStakingContext)
