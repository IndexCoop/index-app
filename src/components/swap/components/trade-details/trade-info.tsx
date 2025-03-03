import { StyledSkeleton } from '@/components/skeleton'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/tooltip'
import { shortenAddress } from '@/lib/utils'
import { cn } from '@/lib/utils/tailwind'

import { TradeInfoItem } from '../../types'

type TradeInfoItemRowProps = {
  item: TradeInfoItem
  isLoading: boolean
}

const TradeInfoItemRow = ({ isLoading, item }: TradeInfoItemRowProps) => {
  const { title, values, tooltip, isLink } = item
  return (
    <Tooltip placement='bottom-end'>
      <TooltipTrigger
        className={cn(
          'text-ic-gray-600 flex justify-between px-4 py-3 text-[11px] font-medium',
          tooltip && tooltip.length > 0 ? 'cursor-pointer' : 'cursor-default',
        )}
      >
        <div className='flex'>
          <div className='flex flex-1 items-center'>
            <p className='text-ic-gray-400 text-xs font-medium'>{title}</p>
          </div>
          {isLoading && <StyledSkeleton width={60} />}
          {!isLoading && isLink === true && (
            <a target='_blank' href={values[1]}>
              <p className='text-ic-gray-600 text-xs font-bold'>
                {shortenAddress(values[0])}
              </p>
            </a>
          )}
          {!isLoading && (isLink === undefined || isLink === false) && (
            <div className='flex'>
              {values.map((value, index) => (
                <div className='flex' key={index}>
                  <p className='text-ic-gray-600 text-xs font-bold'>{value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </TooltipTrigger>
      {tooltip && (
        <TooltipContent
          className={cn(
            'bg-ic-white text-ic-gray-600 flex justify-between rounded-md px-4 py-3 text-[11px] font-medium',
            tooltip && tooltip.length > 0 ? 'cursor-pointer' : 'cursor-default',
          )}
        >
          {tooltip}
        </TooltipContent>
      )}
    </Tooltip>
  )
}

type TradeInfoItemsContainerProps = {
  items: TradeInfoItem[]
  isLoading: boolean
}

export const TradeInfoItemsContainer = ({
  isLoading,
  items,
}: TradeInfoItemsContainerProps) => {
  return (
    <div className='flex flex-col'>
      {items.map((item, index) => (
        <div key={index} className={cn('mb-0', index !== 0 && 'pt-4')}>
          <TradeInfoItemRow item={item} isLoading={isLoading} />
        </div>
      ))}
    </div>
  )
}
