'use client'

import { EIP712TypedData } from '@safe-global/safe-core-sdk-types'
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { Address, isAddress } from 'viem'
import {
  useAccount,
  usePublicClient,
  useReadContract,
  useWalletClient,
} from 'wagmi'

import { PrtStakingAbi } from '@/app/prt-staking/abis/prt-staking-abi'
import { ProductRevenueToken } from '@/app/prt-staking/types'
import { useSafeClient } from '@/lib/hooks/use-safe-client'
import { formatWeiAsNumber } from '@/lib/utils'
import { fetchCumulativeRevenue, fetchTvl } from '@/lib/utils/fetch'

interface Context {
  accountAddress: `0x${string}` | undefined
  canStake: boolean
  claimPrts: () => void
  claimableRewardsFormatted: number
  cumulativeRevenue: number | null
  lifetimeRewardsFormatted: number
  poolStakedBalance: bigint | undefined
  poolStakedBalanceFormatted: number
  refetchClaimableRewards: () => void
  refetchUserStakedBalance: () => void
  stakePrts: (amount: bigint) => void
  timeUntilNextSnapshotSeconds: number
  testSignature: () => void
  token: ProductRevenueToken | null
  tvl: number | null
  typedData: EIP712TypedData | null
  unstakePrts: (amount: bigint) => void
  userStakedBalance: bigint | undefined
  userStakedBalanceFormatted: number
}

const PrtStakingContext = createContext<Context>({
  accountAddress: undefined,
  canStake: false,
  claimPrts: () => {},
  claimableRewardsFormatted: 0,
  cumulativeRevenue: null,
  lifetimeRewardsFormatted: 0,
  poolStakedBalance: undefined,
  poolStakedBalanceFormatted: 0,
  refetchClaimableRewards: () => {},
  refetchUserStakedBalance: () => {},
  testSignature: () => {},
  stakePrts: () => {},
  timeUntilNextSnapshotSeconds: 0,
  token: null,
  tvl: null,
  typedData: null,
  unstakePrts: () => {},
  userStakedBalance: undefined,
  userStakedBalanceFormatted: 0,
})

interface Props {
  children: ReactNode
  token: ProductRevenueToken
}

export const PrtStakingContextProvider = ({ children, token }: Props) => {
  const { address: accountAddress } = useAccount()
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  const safeClient = useSafeClient()
  const [tvl, setTvl] = useState<number | null>(null)
  const [typedData, setTypedData] = useState<EIP712TypedData | null>(null)
  const [cumulativeRevenue, setCumulativeRevenue] = useState<number | null>(
    null,
  )
  const stakedTokenAddress = token.stakedTokenData.address as Address
  const stakedTokenDecimals = token.stakedTokenData.decimals

  const { data: stakeDomain } = useReadContract({
    abi: PrtStakingAbi,
    address: stakedTokenAddress,
    functionName: 'eip712Domain',
  })

  const { data: stakeMessage } = useReadContract({
    abi: PrtStakingAbi,
    address: stakedTokenAddress,
    functionName: 'message',
  })

  useEffect(() => {
    if (!stakeDomain || !stakeMessage) return
    const typedData = {
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
        StakeMessage: [
          {
            name: 'message',
            type: 'string',
          },
        ],
      },
      primaryType: 'StakeMessage',
      domain: {
        name: stakeDomain[1],
        version: stakeDomain[2],
        chainId: Number(stakeDomain[3]),
        verifyingContract: stakeDomain[4],
      },
      message: { message: stakeMessage },
    }
    setTypedData(typedData)
  }, [stakeDomain, stakeMessage])

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

  const { data: timeUntilNextSnapshotSeconds } = useReadContract({
    abi: PrtStakingAbi,
    address: stakedTokenAddress,
    functionName: 'getTimeUntilNextSnapshot',
  })

  const { data: isApprovedStaker, refetch: refetchIsApprovedStaker } =
    useReadContract({
      abi: PrtStakingAbi,
      address: stakedTokenAddress,
      functionName: 'isApprovedStaker',
      args: [accountAddress!],
      query: {
        enabled: isAddress(accountAddress ?? ''),
      },
    })

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

  const testSignature = async () => {
    if (!walletClient || !publicClient || !accountAddress) return
    if (!canStake || !stakeDomain || !stakeMessage) return

    // Check if smart contract wallet
    const bytecode = await publicClient.getCode({
      address: accountAddress,
    })

    console.log('bytecode value', bytecode)
    console.log('typedData', typedData)

    // An example of a typed data message
    const TYPED_MESSAGE = {
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
        Person: [
          { name: 'name', type: 'string' },
          { name: 'wallets', type: 'address[]' },
        ],
        Mail: [
          { name: 'from', type: 'Person' },
          { name: 'to', type: 'Person[]' },
          { name: 'contents', type: 'string' },
        ],
      },
      domain: {
        name: 'Ether Mail',
        version: '1',
        chainId: Number(1),
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
      },
      primaryType: 'Mail',
      message: {
        from: {
          name: 'Cow',
          wallets: [
            '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
            '0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF',
          ],
        },
        to: [
          {
            name: 'Bob',
            wallets: [
              '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
              '0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57',
              '0xB0B0b0b0b0b0B000000000000000000000000000',
            ],
          },
        ],
        contents: 'Hello, Foobar2!',
      },
    }

    // Logic for smart contract wallets
    await safeClient.signTypedData(TYPED_MESSAGE)
    // await safeClient.validSafeSignature(typedData)
    // console.log('validSafeSignature value', validSignature)
  }

  const stakePrts = useCallback(
    async (amount: bigint) => {
      if (!walletClient || !publicClient || !accountAddress) return
      if (!canStake || !typedData) return
      if (isApprovedStaker) {
        await walletClient.writeContract({
          abi: PrtStakingAbi,
          address: stakedTokenAddress,
          functionName: 'stake',
          args: [amount],
        })
        return
      }

      // Check if smart contract wallet
      const bytecode = await publicClient.getCode({
        address: accountAddress,
      })

      if (!bytecode) {
        // Logic for raw wallets
        const signature = await walletClient.signTypedData(typedData as any)
        await walletClient.writeContract({
          abi: PrtStakingAbi,
          address: stakedTokenAddress,
          functionName: 'stake',
          args: [amount, signature],
        })
        await refetchIsApprovedStaker()
      } else {
        // Logic for smart contract wallets
        const validSignature = await safeClient.signTypedData(typedData)
        if (validSignature) {
          await walletClient.writeContract({
            abi: PrtStakingAbi,
            address: stakedTokenAddress,
            functionName: 'stake',
            args: [amount, validSignature],
          })
          await refetchIsApprovedStaker()
        }
      }
    },
    [
      accountAddress,
      canStake,
      isApprovedStaker,
      publicClient,
      refetchIsApprovedStaker,
      safeClient,
      stakeDomain,
      stakeMessage,
      stakedTokenAddress,
      walletClient,
    ],
  )

  const unstakePrts = useCallback(
    async (amount: bigint) => {
      if (!walletClient) return
      await walletClient.writeContract({
        abi: PrtStakingAbi,
        address: stakedTokenAddress,
        functionName: 'unstake',
        args: [amount],
      })
    },
    [stakedTokenAddress, walletClient],
  )

  return (
    <PrtStakingContext.Provider
      value={{
        accountAddress: accountAddress as `0x${string}` | undefined,
        canStake: canStake ?? false,
        claimPrts,
        claimableRewardsFormatted: formatWeiAsNumber(
          claimableRewards,
          stakedTokenDecimals,
        ),
        cumulativeRevenue,
        lifetimeRewardsFormatted: formatWeiAsNumber(
          lifetimeRewards,
          stakedTokenDecimals,
        ),
        poolStakedBalance,
        poolStakedBalanceFormatted: formatWeiAsNumber(
          poolStakedBalance,
          stakedTokenDecimals,
        ),
        refetchClaimableRewards,
        refetchUserStakedBalance,
        stakePrts,
        timeUntilNextSnapshotSeconds: timeUntilNextSnapshotSeconds
          ? Number(timeUntilNextSnapshotSeconds)
          : 0,
        testSignature,
        token,
        tvl,
        typedData,
        unstakePrts,
        userStakedBalance,
        userStakedBalanceFormatted: formatWeiAsNumber(
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
