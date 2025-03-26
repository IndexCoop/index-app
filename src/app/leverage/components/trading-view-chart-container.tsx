import { useEffect, useState } from 'react'

// eslint-disable-next-line import/order
import { useLeverageToken } from '@/app/leverage/provider'
import {
  type ChartingLibraryWidgetOptions,
  type IChartingLibraryWidget,
  type ResolutionString,
  widget,
} from '~/tradingview-chart/charting_library/'

const WIDGET_INTERVAL = '1D' as ResolutionString

export const TradingViewChartContainer = () => {
  const { market } = useLeverageToken()
  const [tvWidget, setTvWidget] = useState<IChartingLibraryWidget | null>(null)

  useEffect(() => {
    const widgetOptions: ChartingLibraryWidgetOptions = {
      datafeed: new (window as any).Datafeeds.UDFCompatibleDatafeed(
        'https://demo_feed.tradingview.com',
        undefined,
        {
          maxResponseLength: 1000,
          expectedOrder: 'latestFirst',
        },
      ),
      symbol: 'AAPL',
      interval: '1D' as ResolutionString,
      library_path: '/tradingview-chart/charting_library/',
      container: 'tv_chart_container',
      disabled_features: ['use_localstorage_for_settings'],
      enabled_features: ['study_templates'],
      locale: 'en',
      charts_storage_url: 'https://saveload.tradingview.com',
      charts_storage_api_version: '1.1',
      client_id: 'tradingview.com',
      user_id: 'public_user_id',
      fullscreen: false,
      autosize: true,
    }

    console.log('Creating widget')
    let tvWidget: IChartingLibraryWidget | null = null
    try {
      tvWidget = new widget(widgetOptions)
      console.log(
        'created widget, setting onChartReady',
        JSON.stringify(tvWidget, null, 2),
      )
      tvWidget.onChartReady(() => {
        console.log('onChartReady tvWidget')
        setTvWidget(tvWidget)
      })
      console.log('finished widget init')
    } catch (e) {
      console.log('Error creating widget', e)
    }

    return () => {
      tvWidget?.remove()
    }
  }, [])

  useEffect(() => {
    console.log('tvWidget: ' + !!tvWidget)
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
      console.log('Setting symbol:', symbol)
      tvWidget.setSymbol(symbol, WIDGET_INTERVAL, () => {})
    }
  }, [market, tvWidget])

  return (
    <div
      id='tv_chart_container'
      // className='h-full w-full overflow-hidden rounded-lg'
      style={{
        height: 'calc(100vh - 60px)',
        width: '100%',
      }}
    />
  )
}
