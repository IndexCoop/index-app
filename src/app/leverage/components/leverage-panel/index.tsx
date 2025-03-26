import { Suspense } from 'react'

import { LeverageFeedbackButton } from '@/app/leverage/components/leverage-feedback-button'
import { LeverageWidget } from '@/app/leverage/components/leverage-widget'
import PortfolioWidget from '@/app/leverage/components/portfolio-widget/portfolio-widget'
import { TradingViewChart } from '@/app/leverage/components/trading-view-chart'

export function LeveragePanel() {
  return (
    <div className='flex flex-col gap-4 lg:flex-row'>
      <div className='w-full lg:flex lg:aspect-auto lg:basis-2/3 lg:flex-col lg:gap-4'>
        <TradingViewChart />
        <div className='hidden lg:block lg:pt-4'>
          <PortfolioWidget />
        </div>
      </div>
      <div className='flex w-full lg:w-auto lg:basis-1/3 lg:flex-col lg:gap-4'>
        <Suspense>
          <LeverageWidget />
        </Suspense>
        <LeverageFeedbackButton />
      </div>
      <div className='w-full lg:hidden'>
        <PortfolioWidget />
      </div>
    </div>
  )
}
