import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'
import { useState } from 'react'

import { StyledSkeleton } from '@/components/skeleton'
import { Tag } from '@/components/swap/components/trade-details/tag'
import { QuoteType } from '@/lib/hooks/use-best-quote/types'
import { useColorStyles } from '@/lib/styles/colors'
import { cn } from '@/lib/utils/tailwind'

import { TradeInfoItem } from '../../types'

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react'
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
  const { styles } = useColorStyles()

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
    <div className='mb-[6px] flex'>
      <Disclosure>
        {({ open }) => (
          <>
            <DisclosureButton className='py-2'>
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
                <div className={cn('flex gap-4', open && 'hidden')}>
                  {!isLoading &&
                    props.selectedQuoteType === QuoteType.index && (
                      <Tag label={'LI.FI'} />
                    )}
                  {!isLoading &&
                    props.selectedQuoteType === QuoteType.flashmint && (
                      <FlashMintTag />
                    )}
                  {isLoading && <StyledSkeleton width={70} />}
                </div>
              </div>
            </DisclosureButton>
            <DisclosurePanel>
              <TradeInfoItemsContainer items={data} isLoading={isLoading} />
            </DisclosurePanel>
          </>
        )}
      </Disclosure>
    </div>
  )
}
