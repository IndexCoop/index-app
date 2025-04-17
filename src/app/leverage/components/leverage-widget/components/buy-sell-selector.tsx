import { useCallback, useRef, useState } from 'react'
import { isMobile } from 'react-device-detect'

import { BuySellSelectorButton } from '@/components/selectors/buy-sell-selector-button'
import { cn } from '@/lib/utils/tailwind'

type BuySellSelectorProps = {
  isMinting: boolean
  onClick: (args?: any) => void
  animateBuy?: boolean
}

export function BuySellSelector({
  isMinting,
  animateBuy,
  onClick,
}: BuySellSelectorProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [scrollingDone, setScrollingDone] = useState(false)

  const scrollToWidget = useCallback(() => {
    if (wrapperRef.current && isMobile) {
      const y =
        wrapperRef.current.getBoundingClientRect().top + window.scrollY + -28

      window.scrollTo({
        top: y,
        behavior: 'smooth',
      })

      setScrollingDone(true)
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
        className={cn(
          animateBuy && !scrollingDone && 'animate-grow md:animate-none',
        )}
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
