import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react'
import {
  ChevronDownIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/20/solid'
import Image from 'next/image'
import { useState } from 'react'

import { StyledSkeleton } from '@/components/skeleton'
import { Tag } from '@/components/swap/components/trade-details/tag'
import { QuoteType } from '@/lib/hooks/use-best-quote/types'
import { cn } from '@/lib/utils/tailwind'

import { TradeInfoItem } from '../../types'

import { FlashMintTag } from './tag-flashmint'
import { TradeInfoItemsContainer } from './trade-info'
import { TradePrice } from './trade-price'

export interface TradeDetailTokenPrices {
  inputTokenPrice: string
  inputTokenPriceUsd: string
  outputTokenPrice: string
  outputTokenPriceUsd: string
}

interface TradeDetailsProps {
  data: TradeInfoItem[]
  isLoading: boolean
  prices: TradeDetailTokenPrices
  showWarning?: boolean
  selectedQuoteType: QuoteType
}

export const TradeDetails = (props: TradeDetailsProps) => {
  const { data, isLoading, prices, showWarning } = props

  const [showInputTokenPrice, setShowInputTokenPrice] = useState(true)

  const onToggleTokenPrice = (event: any) => {
    event.preventDefault()
    event.stopPropagation()
    setShowInputTokenPrice(!showInputTokenPrice)
  }

  const comparisonLabel = showInputTokenPrice
    ? prices.inputTokenPrice
    : prices.outputTokenPrice
  const usdLabel = showInputTokenPrice
    ? prices.inputTokenPriceUsd
    : prices.outputTokenPriceUsd

  return (
    <div className='mb-1.5 flex flex-col'>
      <Disclosure>
        {({ open }) => (
          <>
            <DisclosureButton className='w-full px-5 py-4'>
              <div className='flex flex-1 items-center justify-between pr-1'>
                <div className='flex'>
                  {showWarning && (
                    <ExclamationTriangleIcon className='text-ic-gray-600 dark:text-ic-gray-400 mr-2 size-5' />
                  )}
                  {!showWarning && (
                    <Image
                      className='text-ic-gray-600 mr-1'
                      alt='Swap icon'
                      src='/assets/swap-icon.svg'
                      width={16}
                      height={16}
                    />
                  )}
                  <div onClick={onToggleTokenPrice}>
                    {isLoading ? (
                      <StyledSkeleton width={200} />
                    ) : (
                      <TradePrice
                        comparisonLabel={comparisonLabel}
                        usdLabel={usdLabel}
                      />
                    )}
                  </div>
                </div>
                <div className={cn('flex items-center', open && 'hidden')}>
                  {!isLoading &&
                    props.selectedQuoteType === QuoteType.index && (
                      <Tag label={'LI.FI'} />
                    )}
                  {!isLoading &&
                    props.selectedQuoteType === QuoteType.flashmint && (
                      <FlashMintTag />
                    )}
                  {!isLoading && (
                    <ChevronDownIcon
                      className={cn(
                        'size-5',
                        open && 'rotate-180 transform transition',
                      )}
                    />
                  )}
                  {isLoading && <StyledSkeleton width={70} />}
                </div>
              </div>
            </DisclosureButton>
            <DisclosurePanel className='px-5 pb-4 pt-1'>
              <TradeInfoItemsContainer items={data} isLoading={isLoading} />
            </DisclosurePanel>
          </>
        )}
      </Disclosure>
    </div>
  )
}
