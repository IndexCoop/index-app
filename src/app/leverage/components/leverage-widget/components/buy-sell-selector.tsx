import { BuySellSelectorButton } from '@/components/selectors/buy-sell-selector-button'

type BuySellSelectorProps = {
  isMinting: boolean
  onClick: () => void
}

export function BuySellSelector({ isMinting, onClick }: BuySellSelectorProps) {
  return (
    <div className='bg-ic-gray-50 dark:bg-ic-gray-975 flex flex-row rounded-lg'>
      <BuySellSelectorButton
        isSelected={isMinting}
        label='Buy'
        roundedLeft={true}
        onClick={onClick}
      />
      <BuySellSelectorButton
        isSelected={!isMinting}
        label='Sell'
        roundedLeft={false}
        onClick={onClick}
      />
    </div>
  )
}
