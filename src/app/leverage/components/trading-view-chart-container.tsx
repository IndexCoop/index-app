import { useEffect, useRef, useState } from 'react'

import { useLeverageToken } from '@/app/leverage/provider'
// eslint-disable-next-line import/order
import datafeed from '@/app/leverage/utils/datafeed'
import {
  type ChartingLibraryWidgetOptions,
  type IChartingLibraryWidget,
  type ResolutionString,
  widget,
} from '~/tradingview-chart/charting_library'

const WIDGET_INTERVAL = '1D' as ResolutionString

export const TradingViewChartContainer = () => {
  const { market } = useLeverageToken()
  const chartContainerRef =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>
  const [tvWidget, setTvWidget] = useState<IChartingLibraryWidget | null>(null)

  useEffect(() => {
    const widgetOptions: ChartingLibraryWidgetOptions = {
      datafeed,
      symbol: 'ETHUSD',
      interval: WIDGET_INTERVAL,
      container: chartContainerRef.current,
      library_path: '/tradingview-chart/charting_library/',
      locale: 'en',
      disabled_features: ['left_toolbar', 'header_symbol_search'],
      charts_storage_url: 'https://saveload.tradingview.com',
      charts_storage_api_version: '1.1',
      client_id: 'tradingview.com',
      user_id: 'public_user_id',
      fullscreen: false,
      autosize: true,
      theme: 'dark',
      timezone: 'Etc/UTC',
      overrides: {
        // TODO: background doesn't appear to work
        'paneProperties.background': '#1c2929',
        'paneProperties.backgroundType': 'solid',
      },
    }

    const tvWidget = new widget(widgetOptions)
    tvWidget.onChartReady(() => {
      setTvWidget(tvWidget)
    })

    return () => {
      tvWidget.remove()
    }
  }, [])

  useEffect(() => {
    if (!tvWidget) return

    let symbol = null
    switch (market) {
      case 'BTC / USD':
        symbol = 'BTCUSD'
        break
      case 'ETH / USD':
        symbol = 'ETHUSD'
        break
      case 'SOL / USD':
        symbol = 'SOLUSD'
        break
      case 'SUI / USD':
        symbol = 'SUIUSD'
        break
      case 'BTC / ETH':
        symbol = 'BTCETH'
        break
      case 'ETH / BTC':
        symbol = 'ETHBTC'
        break
    }

    if (symbol && tvWidget) {
      tvWidget.setSymbol(symbol, WIDGET_INTERVAL, () => {})
    }
  }, [market, tvWidget])

  return (
    <div
      ref={chartContainerRef}
      className='h-full w-full overflow-hidden rounded-lg'
    />
  )
}
