import { Dispatch, SetStateAction } from 'react'

import { ChartTab } from '@/app/yield/types'
import { useAnalytics } from '@/lib/hooks/use-analytics'
import { cn } from '@/lib/utils/tailwind'

type Tab = { name: ChartTab; label: string }

const tabs: Tab[] = [
  { name: 'price', label: 'Token Price' },
  { name: 'apy', label: 'APY' },
  { name: 'tvl', label: 'TVL' },
]

type Props = {
  currentTab: ChartTab
  setCurrentTab: Dispatch<SetStateAction<ChartTab>>
}

export function ChartTabs({ currentTab, setCurrentTab }: Props) {
  const { logEvent } = useAnalytics()

  const handleClick = (tab: Tab) => {
    setCurrentTab(tab.name)
    logEvent('Chart Tab Selected', { tab: tab.name })
  }

  return (
    <nav
      className='border-ic-gray-200 bg-ic-gray-50 z-10 mt-2 flex rounded-xl border sm:mt-3 md:mt-4'
      aria-label='Tabs'
    >
      {tabs.map((tab, tabIdx) => (
        <button
          key={tab.name}
          className={cn(
            tab.name === currentTab
              ? 'border-ic-gray-500 rounded-lg bg-[#F0FEFF]'
              : 'hover:bg-ic-gray-100 border-transparent',
            tab.name !== currentTab && tabIdx === 0 && 'rounded-l-xl',
            tab.name !== currentTab &&
              tabIdx === tabs.length - 1 &&
              'rounded-r-xl',
            'text-ic-gray-500 relative min-w-0 flex-1 border-2 px-4 py-4 text-center text-sm font-bold',
          )}
          onClick={() => handleClick(tab)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
