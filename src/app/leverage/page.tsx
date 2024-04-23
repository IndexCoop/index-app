'use client'

import { LeverageWidget } from './components/leverage-widget'
import { Stats } from './components/stats'
import { Title } from './components/title'
import TradingViewWidget from './components/trading-view-widget'

export default function Page() {
  return (
    <div className='flex'>
      <div className='mx-auto flex flex-col gap-6 p-12'>
        <div className='flex flex-row gap-36'>
          <Title />
          <Stats />
        </div>
        <div className='flex flex-row gap-6'>
          <div className='h-4/5 w-7/12 flex-none flex-grow'>
            <TradingViewWidget />
          </div>
          <LeverageWidget />
        </div>
      </div>
    </div>
  )
}
