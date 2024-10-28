import clsx from 'clsx'
import { Dispatch, SetStateAction } from 'react'

import { ChartTab } from '@/app/leverage/types'
import { useAnalytics } from '@/lib/hooks/use-analytics'

type Tab = { name: ChartTab; label: string }

const tabs: Tab[] = [
  { name: 'indexcoop-chart', label: 'Index Chart' },
  { name: 'tradingview-chart', label: 'TradingView Chart' },
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
      className='divide-ic-blue-700 mt-2 flex divide-x rounded-t-lg'
      aria-label='Tabs'
    >
      {tabs.map((tab, tabIdx) => (
        <button
          key={tab.name}
          className={clsx(
            tab.name === currentTab
              ? 'text-ic-white'
              : 'text-ic-gray-300 hover:text-ic-gray-100',
            tabIdx === 0 ? 'rounded-l-lg' : '',
            tabIdx === tabs.length - 1 ? 'rounded-r-lg' : '',
            'bg-ic-blue-900 hover:bg-ic-blue-700 group group relative min-w-0 flex-1 overflow-hidden px-4 py-4 text-center text-sm font-bold focus:z-10',
          )}
          onClick={() => handleClick(tab)}
        >
          <span>{tab.label}</span>
          <span
            aria-hidden='true'
            className={clsx(
              tab.name === currentTab
                ? 'bg-ic-blue-500'
                : 'bg-ic-blue-900 group-hover:bg-ic-blue-700',
              'absolute inset-x-0 bottom-0 h-1',
            )}
          />
        </button>
      ))}
    </nav>
  )
}
