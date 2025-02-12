import { Suspense } from 'react'

import { LeverageFeedbackButton } from '@/app/leverage/components/leverage-feedback-button'
import { LeverageWidget } from '@/app/leverage/components/leverage-widget'
import PortfolioWidget from '@/app/leverage/components/portfolio-widget/portfolio-widget'
import { TradingViewChart } from '@/app/leverage/components/trading-view-chart'
import { Token } from '@/constants/tokens'

type Props = {
  indexToken: Token
}

export function LeveragePanelDesktop({ indexToken }: Props) {
  return (
    <div className='hidden gap-4 lg:flex'>
      <div className='flex basis-2/3 flex-col gap-4'>
        <div className='h-[480px]'>
          <TradingViewChart indexToken={indexToken} />
        </div>
        <PortfolioWidget />
      </div>
      <div className='flex basis-1/3 flex-col gap-4'>
        <Suspense>
          <LeverageWidget />
        </Suspense>
        <LeverageFeedbackButton />
      </div>
    </div>
  )
}
