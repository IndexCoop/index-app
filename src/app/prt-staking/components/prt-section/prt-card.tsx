import { ArrowTopRightOnSquareIcon } from '@heroicons/react/16/solid'
import { useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo } from 'react'

import { usePrtStakingContext } from '@/app/prt-staking/provider'
import { ProductRevenueToken } from '@/app/prt-staking/types'
import { useMainnetOnly } from '@/lib/hooks/use-network'
import { formatAmount, formatDollarAmount } from '@/lib/utils'

dayjs.extend(relativeTime)

type Props = {
  onClick: (token: ProductRevenueToken) => void
}

export function PrtCard({ onClick }: Props) {
  const {
    accountAddress,
    claimableRewardsFormatted,
    cumulativeRevenue,
    lifetimeRewardsFormatted,
    timeUntilNextSnapshotSeconds,
    token,
    tvl,
    poolStakedBalanceFormatted,
    userStakedBalanceFormatted,
  } = usePrtStakingContext()
  const { openChainModal } = useChainModal()
  const { openConnectModal } = useConnectModal()
  const isSupportedNetwork = useMainnetOnly()

  const buttonLabel = useMemo(() => {
    if (!accountAddress) return 'Connect Wallet'
    if (!isSupportedNetwork) return 'Wrong Network'
    return 'Manage'
  }, [accountAddress, isSupportedNetwork])

  if (!token) return

  const handleClick = () => {
    if (!accountAddress) {
      openConnectModal?.()
      return
    }

    if (!isSupportedNetwork) {
      openChainModal?.()
      return
    }

    onClick(token)
  }

  // poolStakedBalance can be 0
  const userStakedBalancePercentage = !Number.isNaN(
    userStakedBalanceFormatted / poolStakedBalanceFormatted,
  )
    ? userStakedBalanceFormatted / poolStakedBalanceFormatted
    : 0

  return (
    <div className='border-ic-gray-100 bg-ic-white min-w-80 flex-1 flex-col rounded-3xl border px-4 py-5'>
      <div className='mb-4 flex font-bold tracking-wider'>
        <div className='flex flex-1 items-center'>
          <div className='my-auto mr-2 overflow-hidden rounded-full'>
            <Image
              src={token.rewardTokenData.logoURI}
              alt={`${token.rewardTokenData.symbol} logo`}
              height={28}
              width={28}
            />
          </div>
          {token.rewardTokenData.symbol}
          <Link
            href={`/swap/eth/${token.rewardTokenData.symbol.toLowerCase()}`}
          >
            <ArrowTopRightOnSquareIcon className='text-ic-gray-800 ml-1.5 size-4' />
          </Link>
        </div>
      </div>
      <div>
        <p className='text-ic-gray-800 mb-3 text-sm font-medium leading-6'>
          {token.description}{' '}
          <a
            className='text-ic-blue-500 whitespace-nowrap text-sm underline'
            href={token.moreInfoUrl}
            target='_blank'
          >
            More Info
          </a>
        </p>
      </div>
      <div className='bg-ic-gray-50 border-ic-gray-300 my-3 w-full rounded-xl border px-3 py-5 text-sm'>
        <div className='text-ic-gray-950 mb-2 flex font-bold'>
          <div className='flex-1'>Your Staked PRTs</div>
          <div>{`${formatAmount(userStakedBalanceFormatted)} PRTs`}</div>
        </div>
        <div className='text-ic-gray-600 flex font-medium'>
          <div className='flex-1'>Your share of Pool</div>
          <div className='font-bold'>
            {`${formatAmount(userStakedBalancePercentage * 100, 3)}%`}
          </div>
        </div>
      </div>
      <div className='bg-ic-gray-50 border-ic-gray-300 my-3 w-full rounded-xl border px-3 py-5 text-sm'>
        <div className='text-ic-gray-950 mb-2 flex font-bold'>
          Your Rewards&nbsp;
          {timeUntilNextSnapshotSeconds > 0 && (
            <span className='text-ic-gray-600 font-medium'>
              {`(next distribution in ${dayjs().add(timeUntilNextSnapshotSeconds, 'second').fromNow(true)})`}
            </span>
          )}
        </div>
        <div className='text-ic-gray-950 mb-2 flex font-bold'>
          <div className='flex-1'>Claimable</div>
          <div>{`${formatAmount(claimableRewardsFormatted)} ${token.rewardTokenData.symbol}`}</div>
        </div>
        <div className='text-ic-gray-600 flex font-medium'>
          <div className='flex-1'>Lifetime</div>
          <div className='font-bold'>
            {`${formatAmount(lifetimeRewardsFormatted)} ${token.rewardTokenData.symbol}`}
          </div>
        </div>
      </div>
      <div className='my-3 mt-4 w-full px-3 text-sm'>
        <div className='text-ic-gray-600 flex font-medium'>
          <div className='flex-1'>Product TVL</div>
          <div className='text-ic-gray-950 font-bold'>
            {formatDollarAmount(tvl)}
          </div>
        </div>
      </div>
      <div className='my-3 w-full px-3 text-sm'>
        <div className='text-ic-gray-600 flex font-medium'>
          <div className='flex-1'>Lifetime revenue</div>
          <div className='text-ic-gray-950 font-bold'>
            {formatDollarAmount(cumulativeRevenue)}
          </div>
        </div>
      </div>
      <button
        className='text-ic-white bg-ic-blue-600 mt-4 w-full rounded-lg py-2.5 font-bold disabled:cursor-not-allowed disabled:bg-[#CFD9D9]'
        onClick={handleClick}
      >
        {buttonLabel}
      </button>
    </div>
  )
}
