import { StyledSkeleton } from '@/components/skeleton'
import { Caption } from '@/components/swap/components/caption'
import { SelectorButton } from '@/components/swap/components/selector-button'
import { cn } from '@/lib/utils/tailwind'

import type { Token } from '@/constants/tokens'

type ReceiveProps = {
  isLoading: boolean
  outputAmount: string
  outputAmountUsd?: string
  selectedOutputToken: Token
  showSelectorButtonChevron?: boolean
  onSelectToken: () => void
}

export function Receive(props: ReceiveProps) {
  const { isLoading, outputAmount, outputAmountUsd, selectedOutputToken } =
    props
  return (
    <div
      className={cn(
        'border-ic-gray-100 flex flex-row items-center justify-between rounded-lg border p-4 dark:border-neutral-700',
        typeof outputAmountUsd === 'string' && 'h-[98px]',
      )}
    >
      <div className='flex flex-col'>
        <Caption caption='Receive' />
        {isLoading && <StyledSkeleton width={120} />}
        {!isLoading && (
          <span className='dark:text-ic-white text-ic-gray-600 mt-1'>
            {outputAmount}
          </span>
        )}
        {isLoading && typeof outputAmountUsd === 'string' && (
          <StyledSkeleton width={80} />
        )}
        {!isLoading && outputAmountUsd && (
          <span className='dark:text-ic-gray-300 text-ic-gray-400 mt-1 text-xs'>
            {outputAmountUsd}
          </span>
        )}
      </div>
      <SelectorButton
        image={selectedOutputToken.image}
        symbol={selectedOutputToken.symbol}
        showChevron={props.showSelectorButtonChevron}
        onClick={props.onSelectToken}
      />
    </div>
  )
}
