import clsx from 'clsx'
import { Dispatch, SetStateAction } from 'react'

import { WidgetTab } from '@/app/prt-staking/types'

const tabs = [
  { name: WidgetTab.STAKE },
  { name: WidgetTab.UNSTAKE },
  { name: WidgetTab.CLAIM },
]

type Props = {
  currentTab: WidgetTab
  setCurrentTab: Dispatch<SetStateAction<WidgetTab>>
}

export function WidgetTabs({ currentTab, setCurrentTab }: Props) {
  return (
    <nav
      className='border-ic-gray-200 mt-8 flex divide-x divide-gray-100 rounded-t-lg border'
      aria-label='Tabs'
    >
      {tabs.map((tab, tabIdx) => (
        <button
          key={tab.name}
          className={clsx(
            tab.name === currentTab
              ? 'text-ic-gray-900'
              : 'text-ic-gray-500 hover:text-ic-gray-700',
            tabIdx === 0 ? 'rounded-tl-lg' : '',
            tabIdx === tabs.length - 1 ? 'rounded-tr-lg' : '',
            'bg-ic-white group relative min-w-0 flex-1 overflow-hidden px-4 py-4 text-center text-sm font-bold hover:bg-gray-50 focus:z-10',
          )}
          onClick={() => setCurrentTab(tab.name)}
        >
          <span>{tab.name}</span>
          <span
            aria-hidden='true'
            className={clsx(
              tab.name === currentTab ? 'bg-ic-blue-500' : 'bg-ic-gray-300',
              'absolute inset-x-0 bottom-0 h-1',
            )}
          />
        </button>
      ))}
    </nav>
  )
}
