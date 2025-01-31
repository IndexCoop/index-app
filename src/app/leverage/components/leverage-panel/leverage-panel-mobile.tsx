import { Suspense } from 'react'

import { LeverageWidget } from '@/app/leverage/components/leverage-widget'
import PortfolioWidget from '@/app/leverage/components/portfolio-widget/portfolio-widget'
import { TradingViewChart } from '@/app/leverage/components/trading-view-chart'
import { Token } from '@/constants/tokens'

type Props = {
  indexToken: Token
}

export function LeveragePanelMobile({ indexToken }: Props) {
  return (
    <div className='flex flex-col gap-4 lg:hidden'>
      <div className='h-[400px] w-full'>
        <TradingViewChart indexToken={indexToken} />
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
