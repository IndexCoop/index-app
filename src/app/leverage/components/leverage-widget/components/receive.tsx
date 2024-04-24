import { Caption } from '@/components/swap/components/caption'
import { SelectorButton } from '@/components/swap/components/selector-button'
import { Token } from '@/constants/tokens'

type ReceiveProps = {
  outputAmount: string
  selectedOutputToken: Token
  showSelectorButtonChevron?: boolean
  onSelectToken: () => void
}

export function Receive(props: ReceiveProps) {
  const { outputAmount, selectedOutputToken } = props
  return (
    <div className='flex flex-row justify-between rounded-xl border border-[#3A6060] p-4'>
      <div className='flex flex-col'>
        <Caption caption='Receive' />
        <span>{outputAmount}</span>
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
