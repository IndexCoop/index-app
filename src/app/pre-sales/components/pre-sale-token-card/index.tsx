import Image from 'next/image'

import { Tooltip } from '@chakra-ui/react'
import { usePresaleData } from '@/app/pre-sales/providers/presale-provider'

import { colors } from '@/lib/styles/colors'
import { PreSaleStatus, PreSaleToken } from '../../types'
import { StatusChip } from './status-chip'

type Props = {
  token: PreSaleToken
  onClick?: () => void
}
export function PreSaleTokenCard({ token, onClick }: Props) {
  const { data, formatted } = usePresaleData(token.symbol)
  return (
    <div className='border-ic-gray-100 bg-ic-white min-w-80 flex-1 flex-col rounded-3xl border px-4 py-5'>
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
      {token.infoLink && (
        <a
          className='text-ic-blue-500 mb-4 block text-sm underline'
          href={token.infoLink}
          target='_blank'
        >
          More Info
        </a>
      )}
      <p className='text-ic-gray-400 mb-6 text-xs font-medium'>
        Components from {token.componentsFrom.join(', ')}
      </p>
      <Tooltip
        className='bg-ic-white'
        borderRadius='6px'
        fontSize={'11px'}
        fontWeight={500}
        label='This shows the total number of PRTs distributed between pre-sale participants. Individual rewards will be shown in the deposit widget.'
        p='12px 16px'
        placement='bottom-start'
        textColor={colors.ic.gray[600]}
      >
        <div className='bg-ic-gray-50 border-ic-gray-300 text-ic-gray-500 w-full rounded-xl border px-3 py-5 text-xs font-medium'>
          <div className='flex'>
            <div className='flex-1'>Total PRT Rewards</div>
            <div className='text-ic-gray-800'>
              <span className='text-ic-gray-950 font-bold'>
                {token.prtRewards}
              </span>{' '}
              PRTs
            </div>
          </div>
        </div>
      </Tooltip>
      <div className='text-ic-gray-600 w-full px-3 py-5 text-xs font-medium'>
        <div className='mb-2 flex'>
          <div className='flex-1'>Target Threshold</div>
          <div className='text-ic-gray-800'>
            <span className='text-ic-gray-950 font-bold'>
              {token.targetFundraise}
            </span>{' '}
            wstETH
          </div>
        </div>
        <div className='mb-2 flex'>
          <div className='flex-1'>Total Deposits</div>
          <div className='text-ic-gray-800'>
            <span className='text-ic-gray-950 font-bold'>{data.tvl}</span>{' '}
            wstETH
          </div>
        </div>
        <div className='flex'>
          <div className='flex-1'>Time left in pre-sale</div>
          <div className='text-ic-gray-950 font-bold'>
            {formatted.daysLeft} / 30 days
          </div>
        </div>
      </div>
      <button
        className='text-ic-white bg-ic-blue-600 w-full rounded-lg py-2.5 font-bold disabled:cursor-not-allowed disabled:bg-[#CFD9D9]'
        disabled={
          token.status !== PreSaleStatus.ACTIVE || onClick === undefined
        }
        onClick={onClick}
      >
        {token.status === PreSaleStatus.ACTIVE
          ? 'Join Pre-sale'
          : 'Pre-sale not started'}
      </button>
    </div>
  )
}
