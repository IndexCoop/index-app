import Script from 'next/script'
import { useState } from 'react'

import { TradingViewChartContainer } from '@/app/leverage/components/trading-view-chart-container'

export function TradingViewChart() {
  const [isScriptReady, setIsScriptReady] = useState(false)
  return (
    <>
      <Script
        src='/tradingview/datafeeds/udf/dist/bundle.js'
        onReady={() => {
          setIsScriptReady(true)
        }}
      />
      {isScriptReady && <TradingViewChartContainer />}
    </>
  )
}
