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
  accountAddress: `0x${string}` | undefined
  canStake: boolean
  claimPrts: () => void
  claimableRewards: number
  cumulativeRevenue: number | null
  lifetimeRewards: number
  poolStakedBalance: number
  refetchClaimableRewards: () => void
  refetchUserStakedBalance: () => void
  stakePrts: (amount: bigint) => void
  token: ProductRevenueToken | null
  tvl: number | null
  unstakePrts: (amount: bigint) => void
  userStakedBalance: number
}

const PrtStakingContext = createContext<Context>({
  accountAddress: undefined,
  canStake: false,
  claimPrts: () => {},
  claimableRewards: 0,
  cumulativeRevenue: null,
  lifetimeRewards: 0,
  poolStakedBalance: 0,
  refetchClaimableRewards: () => {},
  refetchUserStakedBalance: () => {},
  stakePrts: () => {},
  token: null,
  tvl: null,
  unstakePrts: () => {},
  userStakedBalance: 0,
})

interface Props {
  children: ReactNode
  token: ProductRevenueToken
}

export const PrtStakingContextProvider = ({ children, token }: Props) => {
  const { address: accountAddress } = useAccount()
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
      args: [accountAddress!],
      query: {
        enabled: isAddress(accountAddress ?? ''),
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
      args: [accountAddress!],
      query: {
        enabled: isAddress(accountAddress ?? ''),
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
    args: [accountAddress!],
    query: {
      enabled: isAddress(accountAddress ?? ''),
    },
  })

  // const { data: stakeDomain } = useReadContract({
  //   abi: PrtStakingAbi,
  //   address: stakedTokenAddress,
  //   functionName: 'eip712Domain',
  // })
  // console.log('stakeDomain', stakeDomain)

  const { data: lifetimeRewards } = useReadContract({
    abi: PrtStakingAbi,
    address: stakedTokenAddress,
    functionName: 'getLifetimeRewards',
    args: [accountAddress!],
    query: {
      enabled: isAddress(accountAddress ?? ''),
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
      if (!canStake) return
      if (isApprovedStaker) {
        await walletClient.writeContract({
          abi: PrtStakingAbi,
          address: stakeTokenAddress,
          functionName: 'stake',
          args: [amount],
        })
      } else {
        // FIXME: Domain arg typing/format
        const signature = await walletClient.signTypedData({
          types: {
            Person: [
              { name: 'name', type: 'string' },
              { name: 'wallet', type: 'address' },
            ],
            Mail: [
              { name: 'from', type: 'Person' },
              { name: 'to', type: 'Person' },
              { name: 'contents', type: 'string' },
            ],
          },
          primaryType: 'Mail',
          domain: {
            version: '1',
            verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
          },
          message: {
            from: {
              name: 'Cow',
              wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
            },
            to: {
              name: 'Bob',
              wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
            },
            contents: 'I have read and accept the Terms of Service.',
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
    [canStake, isApprovedStaker, stakeTokenAddress, walletClient],
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
        accountAddress,
        canStake: canStake ?? false,
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
