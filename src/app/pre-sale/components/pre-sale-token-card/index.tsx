import Image from 'next/image'
import { PreSaleStatus, PreSaleToken } from '../../types'
import { StatusChip } from './status-chip'

type Props = {
  token: PreSaleToken
  onClick: () => void
}
export function PreSaleTokenCard({ token, onClick }: Props) {
  return (
    <div className='border-ic-gray-100 bg-ic-white flex min-w-80 flex-col rounded-3xl border px-4 py-5'>
      <div className='mb-4 flex font-bold tracking-wider'>
        <div className='flex flex-1 self-center'>
          <div className='my-auto mr-2 overflow-hidden rounded-full'>
            <Image
              src={token.logo ?? '/assets/index-token.png'}
              alt={`${token.symbol} logo`}
              height={28}
              width={28}
            />
          </div>
          {token.symbol}
        </div>
        <StatusChip status={token.status} />
      </div>
      <p className='text-ic-gray-800 mb-3 text-sm font-medium leading-6'>
        {token.description}
      </p>
      <p className='text-ic-gray-400 mb-6 text-xs font-medium'>
        Components from {token.componentsFrom.join(', ')}
      </p>
      <div className='bg-ic-gray-50 border-ic-gray-300 text-ic-gray-500 w-full rounded-xl border px-3 py-5 text-xs font-medium'>
        <div className='mb-2 flex'>
          <div className='flex-1'>PRT Rewards</div>
          <div className='text-ic-gray-800'>
            <span className='text-ic-gray-950 font-bold'>
              ~{token.prtRewards}
            </span>{' '}
            PRTs per day
          </div>
        </div>
        <div className='flex'>
          <div className='flex-1'>$INDEX Rewards</div>
          <div className='text-ic-gray-800'>
            <span className='text-ic-gray-950 font-bold'>
              {token.indexRewards}
            </span>{' '}
            $INDEX per ETH
          </div>
        </div>
      </div>
      <div className='text-ic-gray-600 w-full px-3 py-5 text-xs font-medium'>
        <div className='mb-2 flex'>
          <div className='flex-1'>Target Fundraise</div>
          <div className='text-ic-gray-800'>
            <span className='text-ic-gray-950 font-bold'>
              {token.targetFundraise}
            </span>{' '}
            wstETH
          </div>
        </div>
        <div className='mb-2 flex'>
          <div className='flex-1'>Total Value Locked</div>
          <div className='text-ic-gray-800'>
            <span className='text-ic-gray-950 font-bold'>
              {token.totalValueLocked}
            </span>{' '}
            wstETH
          </div>
        </div>
        <div className='flex'>
          <div className='flex-1'>$INDEX Rewards</div>
          <div className='text-ic-gray-950 font-bold'>
            {token.timeLeftDays} / 30 days
          </div>
        </div>
      </div>
      <button
        className='text-ic-white bg-ic-blue-600 w-full rounded-lg py-2.5 font-bold disabled:cursor-not-allowed disabled:bg-[#CFD9D9]'
        disabled={token.status !== PreSaleStatus.ACTIVE}
        onClick={onClick}
      >
        {token.status === PreSaleStatus.ACTIVE
          ? 'Join Pre-sale'
          : 'Pre-sale not started'}
      </button>
    </div>
  )
}
