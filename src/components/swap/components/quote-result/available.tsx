import Image from 'next/image'

import { StyledSkeleton } from '@/components/skeleton'
import { cn } from '@/lib/utils/tailwind'

import { QuoteDisplay } from './types'

type QuoteAvailableProps = {
  type: string
  isLoading: boolean
  isSelected: boolean
  quote: QuoteDisplay | null
  onClick: () => void
}

export const QuoteAvailable = (props: QuoteAvailableProps) => {
  const { type, isLoading, isSelected, onClick, quote } = props
  const isBestQuote = quote?.isBestQuote
  return (
    <div
      className={cn(
        'border-ic-gray-400 flex h-[110px] w-full cursor-pointer flex-col rounded-xl p-4',
        isSelected ? 'border' : 'border-0',
        {
          'bg-[#F0FEFF]': isBestQuote,
          'border-[#F178B6] bg-[#FFF5FA]': !isBestQuote && isSelected,
          'bg-ic-gray-50': !isBestQuote && !isSelected,
          'border-ic-blue-600': isBestQuote && isSelected,
          'border-[#CFF5F6]': isBestQuote && !isSelected,
        },
      )}
      onClick={onClick}
    >
      <div className='flex flex-col justify-start'>
        <div className='flex justify-between'>
          <p className='text-ic-gray-500 text-xs font-medium'>
            {isLoading && <StyledSkeleton width={50} />}
            {!isLoading && quote && quote.inputAmount}
          </p>
          <div className='flex gap-1'>
            {quote?.isBestQuote && (
              <div
                className={cn(
                  'flex',
                  isSelected ? 'opacity-100' : 'opacity-20',
                )}
              >
                <Image
                  src={'/assets/icon-trophy.svg'}
                  alt={'token icon'}
                  width={12}
                  height={12}
                />
              </div>
            )}
            <p
              className={cn('text-ic-gray-400 text-sm font-semibold', {
                'text-[#F178B6]': !isBestQuote && isSelected,
                'text-ic-blue-600': isBestQuote && isSelected,
                'text-[#CFF5F6]': isBestQuote && !isSelected,
              })}
            >
              {type.toUpperCase()}
            </p>
          </div>
        </div>
      </div>
      <p
        className={cn(
          'text-2xl font-medium',
          isSelected ? 'text-ic-gray-800' : 'text-ic-gray-500',
        )}
      >
        {isLoading && <StyledSkeleton width={200} />}
        {!isLoading && quote && quote.outputAmount}
      </p>
      <div className='xs:flex-row xs:justify-between flex flex-col justify-start'>
        <p className='text-ic-gray-500 text-xs font-medium'>
          {isLoading && <StyledSkeleton width={80} />}
          {!isLoading && quote && quote.feesTotal}
        </p>
        {quote && (
          <div className='flex flex-row gap-1.5'>
            <Image
              className='text-ic-gray-500'
              alt='Gas fees icon'
              src={'/assets/gas-icon.svg'}
              height={10}
              width={10}
            />
            <p className='text-ic-gray-500 text-xs font-medium'>
              {quote.feesGas}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
