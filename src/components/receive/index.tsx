import { StyledSkeleton } from '@/components/skeleton'
import { Caption } from '@/components/swap/components/caption'
import { SelectorButton } from '@/components/swap/components/selector-button'
import { Token } from '@/constants/tokens'

type ReceiveProps = {
  isLoading: boolean
  outputAmount: string
  selectedOutputToken: Token
  showSelectorButtonChevron?: boolean
  onSelectToken: () => void
}

export function Receive(props: ReceiveProps) {
  const { isLoading, outputAmount, selectedOutputToken } = props
  return (
    <div className='border-ic-gray-100 flex flex-row justify-between rounded-xl border p-4 dark:border-[#3A6060]'>
      <div className='flex flex-col'>
        <Caption caption='Receive' />
        {isLoading && <StyledSkeleton width={120} />}
        {!isLoading && (
          <span className='dark:text-ic-white text-ic-gray-600'>
            {outputAmount}
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
