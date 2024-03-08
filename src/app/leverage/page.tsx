'use client'

import { useLeverageToken } from '@/app/leverage/provider'

import { LeverageChart } from './components/leverage-chart'
import { LeverageWidget } from './components/leverage-widget'
import { Stats } from './components/stats'
import { Title } from './components/title'

export default function Page() {
  const { stats } = useLeverageToken()
  return (
    <div className='flex'>
      <div className='mx-auto flex flex-col gap-6 p-12'>
        <div className='flex flex-row gap-36'>
          <Title />
          <Stats data={stats} />
        </div>
        <div className='flex flex-row gap-6'>
          <div className='flex-none flex-grow'>
            <LeverageChart price={stats.price.toFixed(2)} />
          </div>
          <LeverageWidget />
        </div>
      </div>
    </div>
  )
}
