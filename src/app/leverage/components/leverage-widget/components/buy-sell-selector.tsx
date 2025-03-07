import { BuySellSelectorButton } from '@/components/selectors/buy-sell-selector-button'
import { useCallback, useRef } from 'react'

type BuySellSelectorProps = {
  isMinting: boolean
  onClick: () => void
}

export function BuySellSelector({ isMinting, onClick }: BuySellSelectorProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)

  const onClickBuySell = useCallback(() => {
    if (wrapperRef.current) {
      wrapperRef.current.scrollIntoView({ behavior: 'smooth' })
    }
    onClick()
  }, [onClick])

  return (
    <div
      ref={wrapperRef}
      className='bg-ic-gray-50 dark:bg-ic-gray-975 flex flex-row rounded-lg'
    >
      <BuySellSelectorButton
        isSelected={isMinting}
        label='Buy'
        roundedLeft={true}
        onClick={onClickBuySell}
      />
      <BuySellSelectorButton
        isSelected={!isMinting}
        label='Sell'
        roundedLeft={false}
        onClick={onClickBuySell}
      />
    </div>
  )
}
