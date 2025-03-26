import Script from 'next/script'
import { useState } from 'react'

import { TradingViewChartContainer } from '@/app/leverage/components/trading-view-chart-container'

export function TradingViewChart() {
  const [isScriptReady, setIsScriptReady] = useState(false)
  return (
    <div className='xs:h-[422px] relative aspect-square w-full lg:aspect-auto'>
      <Script
        src='/tradingview-chart/datafeeds/udf/dist/bundle.js'
        onReady={() => {
          setIsScriptReady(true)
        }}
      />
      {isScriptReady ? <TradingViewChartContainer /> : null}
    </div>
  )
}
