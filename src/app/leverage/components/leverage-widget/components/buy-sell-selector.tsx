import { useCallback, useRef } from 'react'
import { isMobile } from 'react-device-detect'

import { BuySellSelectorButton } from '@/components/selectors/buy-sell-selector-button'

type BuySellSelectorProps = {
  isMinting: boolean
  onClick: (args?: any) => void
}

export function BuySellSelector({ isMinting, onClick }: BuySellSelectorProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)

  const scrollToWidget = useCallback(() => {
    if (wrapperRef.current && isMobile) {
      const y =
        wrapperRef.current.getBoundingClientRect().top + window.scrollY + -28

      window.scrollTo({
        top: y,
        behavior: 'smooth',
      })
    }
  }, [])

  return (
    <div
      ref={wrapperRef}
      className='bg-ic-gray-50 dark:bg-ic-gray-975 flex flex-row rounded-lg'
    >
      <BuySellSelectorButton
        isSelected={isMinting}
        label='Buy'
        roundedLeft={true}
        onClick={() => {
          if (isMinting) return

          onClick(true)
          scrollToWidget()
        }}
      />
      <BuySellSelectorButton
        isSelected={!isMinting}
        label='Sell'
        roundedLeft={false}
        onClick={() => {
          if (!isMinting) return

          onClick()
          scrollToWidget()
        }}
      />
    </div>
  )
}
