import Script from 'next/script'
import { useState } from 'react'

import { TradingViewChartContainer } from '@/app/leverage/components/trading-view-chart-container'

import {
  ChartingLibraryWidgetOptions,
  ResolutionString,
} from '../../../../public/tradingview/charting_library'

const defaultWidgetProps: Partial<ChartingLibraryWidgetOptions> = {
  autosize: true,
  timezone: 'Etc/UTC',
  interval: '1D' as ResolutionString,
  library_path: '/tradingview/charting_library/',
  locale: 'en',
  symbol: 'ETHUSD',
  charts_storage_url: 'https://saveload.tradingview.com',
  charts_storage_api_version: '1.1',
  client_id: 'tradingview.com',
  user_id: 'public_user_id',
  fullscreen: false,
}

export function TradingViewChart() {
  const [isScriptReady, setIsScriptReady] = useState(false)
  return (
    <>
      <Script
        src='/tradingview/datafeeds/udf/dist/bundle.js'
        strategy='lazyOnload'
        onReady={() => {
          setIsScriptReady(true)
        }}
      />
      {isScriptReady && (
        <TradingViewChartContainer options={defaultWidgetProps} />
      )}
    </>
  )
}
