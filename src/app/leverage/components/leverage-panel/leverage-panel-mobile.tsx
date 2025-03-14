import { Suspense } from 'react'

import { LeverageWidget } from '@/app/leverage/components/leverage-widget'
import PortfolioWidget from '@/app/leverage/components/portfolio-widget/portfolio-widget'
// import { TradingViewChart } from '@/app/leverage/components/trading-view-chart'

export function LeveragePanelMobile() {
  return (
    <div className='flex flex-col gap-4 lg:hidden'>
      <div className='xs:aspect-auto xs:h-[442px] aspect-square w-full'>
        {/* <TradingViewChart /> */}
      </div>
      <div className='w-full'>
        <Suspense>
          <LeverageWidget />
        </Suspense>
      </div>
      <div className='w-full'>
        <PortfolioWidget />
      </div>
    </div>
  )
}
