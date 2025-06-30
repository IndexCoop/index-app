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

const WIDGET_INTERVAL = '1H' as ResolutionString

export const TradingViewChartContainer = () => {
  const { market } = useLeverageToken()
  const chartContainerRef =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>
  const [tvWidget, setTvWidget] = useState<IChartingLibraryWidget | null>(null)

  useEffect(() => {
    const widgetOptions: ChartingLibraryWidgetOptions = {
      datafeed,
      debug: false,
      symbol: 'ETHUSD',
      interval: WIDGET_INTERVAL,
      container: chartContainerRef.current,
      library_path: '/tradingview-chart/charting_library/',
      locale: 'en',
      disabled_features: [
        'left_toolbar',
        'header_saveload',
        'header_symbol_search',
      ],
      enabled_features: ['iframe_loading_compatibility_mode'],
      client_id: 'indexcoop',
      fullscreen: false,
      autosize: true,
      theme: 'dark',
      timezone: 'Etc/UTC',
      overrides: {
        // TODO: background overrides not working
        'paneProperties.background': '#181A1B',
        'paneProperties.backgroundType': 'solid',
      },
    }

    const tvWidget = new widget(widgetOptions)
    tvWidget.applyOverrides({
      // TODO: background applyOverrides not working
      'paneProperties.background': '#181A1B',
      'paneProperties.backgroundType': 'solid',
    })
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
      case 'XRP / USD':
        symbol = 'XRPUSD'
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
