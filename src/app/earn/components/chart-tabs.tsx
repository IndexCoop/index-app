import { Dispatch, SetStateAction } from 'react'

import { ChartTab } from '@/app/earn/types'
import { useAnalytics } from '@/lib/hooks/use-analytics'
import { cn } from '@/lib/utils/tailwind'

type Tab = { name: ChartTab; label: string }

const tabs: Tab[] = [
  { name: 'price', label: 'Token Price' },
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
      className='border-ic-gray-200 bg-ic-gray-50 z-10 mt-2 flex rounded-lg border-2 sm:mt-3 md:mt-4'
      aria-label='Tabs'
    >
      {tabs.map((tab, tabIdx) => (
        <button
          key={tab.name}
          className={cn(
            'text-ic-gray-500 relative flex-1 px-4 py-3 text-center text-sm font-medium',
            {
              'border-ic-gray-200 border-r-2': tabIdx === 0,
              'border-ic-gray-200 border-l-2': tabIdx === tabs.length - 1,
            },
            tab.name === currentTab &&
              'outline-ic-gray-500 z-10 rounded-lg border-transparent bg-[#F0FEFF] outline',
          )}
          onClick={() => handleClick(tab)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
