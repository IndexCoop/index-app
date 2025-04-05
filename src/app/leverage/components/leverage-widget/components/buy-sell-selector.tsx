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
      className='bg-ic-gray-50 flex flex-row rounded-full dark:bg-zinc-800'
    >
      <BuySellSelectorButton
        isSelected={isMinting}
        label='Buy'
        roundedLeft={true}
        onClick={() => {
          scrollToWidget()
          if (isMinting) return
          onClick(true)
        }}
      />
      <BuySellSelectorButton
        isSelected={!isMinting}
        label='Sell'
        roundedLeft={false}
        onClick={() => {
          scrollToWidget()
          if (!isMinting) return
          onClick()
        }}
      />
    </div>
  )
}
