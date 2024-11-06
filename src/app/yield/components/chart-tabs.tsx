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
      className='divide-ic-gray-200 border-ic-gray-200 mt-2 flex divide-x-2 rounded-xl border'
      aria-label='Tabs'
    >
      {tabs.map((tab) => (
        <button
          key={tab.name}
          className={cn(
            tab.name === currentTab ? 'bg-[#F0FEFF]' : 'bg-ic-gray-50',
            'text-ic-gray-500 relative min-w-0 flex-1 px-4 py-4 text-center text-sm font-bold',
          )}
          onClick={() => handleClick(tab)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
