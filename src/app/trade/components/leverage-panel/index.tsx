'use client'

import { Suspense } from 'react'

import { LeverageWidget } from '@/app/trade/components/leverage-widget'
import PortfolioWidget from '@/app/trade/components/portfolio-widget/portfolio-widget'
import { QuickStats } from '@/app/trade/components/stats'
import { TradingViewChart } from '@/app/trade/components/trading-view-chart'
import { RaffleBanner } from '@/components/raffle/raffle-banner'

export function LeveragePanel() {
  return (
    <div className='flex flex-col gap-4 lg:flex-row'>
      <div className='flex w-full flex-col gap-4 lg:w-2/3'>
        <RaffleBanner />
        <QuickStats />
        <TradingViewChart />
        <div className='hidden lg:block lg:pt-4'>
          <PortfolioWidget />
        </div>
      </div>
      <div className='w-full lg:w-1/3'>
        <Suspense>
          <LeverageWidget />
        </Suspense>
      </div>
      <div className='w-full lg:hidden'>
        <PortfolioWidget />
      </div>
    </div>
  )
}
