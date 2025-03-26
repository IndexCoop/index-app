import { useEffect, useRef, useState } from 'react'

// eslint-disable-next-line import/order
import { useLeverageToken } from '@/app/leverage/provider'
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
      datafeed: new window.Datafeeds.UDFCompatibleDatafeed(
        'https://demo-feed-data.tradingview.com',
      ),
      debug: false,
      symbol: 'AAPL',
      interval: WIDGET_INTERVAL,
      container: chartContainerRef.current,
      library_path: '/tradingview-chart/charting_library/',
      locale: 'en',
      disabled_features: [
        'left_toolbar',
        'header_saveload',
        'header_symbol_search',
      ],
      client_id: 'indexcoop',
      fullscreen: false,
      autosize: true,
      theme: 'dark',
      timezone: 'Etc/UTC',
      overrides: {
        // TODO: background doesn't appear to work
        'paneProperties.background': '#0F1717',
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
        symbol = 'AAPL'
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
      // className='h-full w-full overflow-hidden rounded-lg'
      style={{
        height: '300px',
        width: '300px',
      }}
    />
  )
}
