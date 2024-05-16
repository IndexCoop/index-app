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
    <div className='flex flex-row justify-between rounded-xl border border-[#3A6060] p-4'>
      <div className='flex flex-col'>
        <Caption caption='Receive' />
        {isLoading && <StyledSkeleton width={120} />}
        {!isLoading && <span className='text-ic-white'>{outputAmount}</span>}
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
