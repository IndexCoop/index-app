import { useEffect, useRef, useState } from 'react'

import { useLeverageToken } from '@/app/leverage/provider'
import datafeed from '@/app/leverage/utils/datafeed'

import {
  ChartingLibraryWidgetOptions,
  IChartingLibraryWidget,
  LanguageCode,
  ResolutionString,
  widget,
} from '../../../../public/tradingview/charting_library'

type Props = {
  options: Partial<ChartingLibraryWidgetOptions>
}

export const TradingViewChartContainer = ({ options }: Props) => {
  const { market } = useLeverageToken()
  const chartContainerRef =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>
  const [tvWidget, setTvWidget] = useState<IChartingLibraryWidget | null>(null)

  useEffect(() => {
    const widgetOptions: ChartingLibraryWidgetOptions = {
      symbol: options.symbol,
      // BEWARE: no trailing slash is expected in feed URL
      datafeed,
      interval: options.interval as ResolutionString,
      container: chartContainerRef.current,
      library_path: options.library_path,
      locale: options.locale as LanguageCode,
      disabled_features: ['use_localstorage_for_settings'],
      enabled_features: ['study_templates'],
      charts_storage_url: options.charts_storage_url,
      charts_storage_api_version: options.charts_storage_api_version,
      client_id: options.client_id,
      user_id: options.user_id,
      fullscreen: options.fullscreen,
      autosize: options.autosize,
      ////
      theme: 'dark',
      timezone: 'Etc/UTC',
    }

    const tvWidget = new widget(widgetOptions)
    tvWidget.onChartReady(() => {
      setTvWidget(tvWidget)
    })

    return () => {
      tvWidget.remove()
    }
  }, [options])

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
      tvWidget.setSymbol(symbol, options.interval as ResolutionString, () => {})
    }
  }, [market, options.interval, tvWidget])

  return <div ref={chartContainerRef} className='h-full w-full' />
}
