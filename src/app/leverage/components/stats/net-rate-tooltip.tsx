'use client'

import { useMemo } from 'react'

import { QuickStats } from '@/app/leverage/components/stats/use-quick-stats'
import { formatPercentage } from '@/app/products/utils/formatters'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/tooltip'

import { StatsMetric } from './stats-metric'

const formatCostOfCarry = (token: { costOfCarry: number }) =>
  (-1 * token.costOfCarry) / 100

type Props = {
  isFetching: boolean
  token: QuickStats['token']
}

export function NetRateTooltip({ isFetching, token }: Props) {
  const netRate = useMemo(() => {
    if (!token) return 0
    return (formatCostOfCarry(token) + token.streamingFee) / 365
  }, [token])

  return (
    <Tooltip placement='bottom'>
      <TooltipTrigger>
        <StatsMetric
          className='hidden w-24 cursor-default sm:flex'
          isLoading={isFetching}
          overrideValueClassName={
            netRate && !isFetching
              ? 'border-b border-ic-gray-200 border-dashed w-fit cursor-default text-left'
              : 'h-[21px] w-20'
          }
          label='Net Rate Daily'
          value={formatPercentage(netRate, true, 3)}
        />
      </TooltipTrigger>
      {!isFetching && (
        <TooltipContent className='bg-ic-white mt-2 w-60 rounded px-5 py-2 text-xs font-medium drop-shadow'>
          <div className='flex flex-col'>
            <div className='flex border-b border-[#CDDFDF] py-2'>
              <div className='text-ic-gray-600'>Net Rate Daily</div>
              <div className='text-ic-gray-900 ml-auto'>
                {`${formatPercentage(netRate, true, 3)} / day`}
              </div>
            </div>
            <div className='flex py-2'>
              <div className='text-ic-gray-600'>Streaming Fee</div>
              <div className='text-ic-gray-900 ml-auto'>
                {`${formatPercentage(token.streamingFee / 365, true, 3)} / day`}
              </div>
            </div>
            <div className='flex py-2'>
              <div className='text-ic-gray-600'>Cost of Carry</div>
              <div className='text-ic-gray-900 ml-auto'>
                {`${formatPercentage(formatCostOfCarry(token) / 365, true, 3)} / day`}
              </div>
            </div>
            <p className='text-ic-gray-700 text-left text-[10px] font-normal leading-tight'>
              This is a dynamic cost incurred from borrowing on a lending
              market, which can be positive or negative.
            </p>
          </div>
        </TooltipContent>
      )}
    </Tooltip>
  )
}
