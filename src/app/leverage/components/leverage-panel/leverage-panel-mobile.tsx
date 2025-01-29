import { Suspense } from 'react'

import { LeverageFeedbackButton } from '@/app/leverage/components/leverage-feedback-button'
import { LeverageWidget } from '@/app/leverage/components/leverage-widget'
import { TradingViewChart } from '@/app/leverage/components/trading-view-chart'
import { YourTokens } from '@/app/leverage/components/your-tokents'
import { Token } from '@/constants/tokens'

type Props = {
  indexToken: Token
}

export function LeveragePanelMobile({ indexToken }: Props) {
  return (
    <div className='flex gap-4 lg:hidden'>
      <div className='h-[400px] w-full'>
        <TradingViewChart indexToken={indexToken} />
      </div>
      <div className='w-full'>
        <Suspense>
          <LeverageWidget />
        </Suspense>
      </div>
      <div className='w-full'>
        <YourTokens />
      </div>
      <div className='w-full'>
        <LeverageFeedbackButton />
      </div>
    </div>
  )
}
