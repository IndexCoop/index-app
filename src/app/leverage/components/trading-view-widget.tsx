import { memo, useEffect, useRef } from 'react'

import {
  btcLeverageTokenSymbols,
  ethLeverageTokenSymbols,
} from '@/app/leverage/constants'
import { Token } from '@/constants/tokens'

type Props = {
  chartSymbol: string
  indexToken: Token
}

const getScriptInnerHtml = (chartSymbol: string) => {
  return `
  {
    "autosize": true,
    "symbol": "${chartSymbol}",
    "timezone": "Etc/UTC",
    "theme": "dark",
    "style": "1",
    "locale": "en",
    "enable_publishing": false,
    "backgroundColor": "rgba(15, 23, 23, 1)",
    "withdateranges": true,
    "range": "1D",
    "allow_symbol_change": false,
    "calendar": false,
    "hide_volume": true,
    "support_host": "https://www.tradingview.com"
  }`
}

const getDisplayStyle = (
  chartSymbol: string,
  indexSymbol: string,
): 'block' | 'none' => {
  const lowercaseIndexSymbol = indexSymbol.toLowerCase()

  switch (chartSymbol) {
    case 'BINANCE:ETHBTC':
      return lowercaseIndexSymbol === 'eth2xbtc' ? 'block' : 'none'
    case 'BINANCE:BTCETH':
      return lowercaseIndexSymbol === 'btc2xeth' ? 'block' : 'none'
    case 'INDEX:ETHUSD':
      return lowercaseIndexSymbol !== 'eth2xbtc' &&
        ethLeverageTokenSymbols.some(
          (ethTokenSymbol) =>
            ethTokenSymbol.toLowerCase() === lowercaseIndexSymbol,
        )
        ? 'block'
        : 'none'
    case 'INDEX:BTCUSD':
      return lowercaseIndexSymbol !== 'eth2xbtc' &&
        btcLeverageTokenSymbols.some(
          (btcTokenSymbol) =>
            btcTokenSymbol.toLowerCase() === lowercaseIndexSymbol,
        )
        ? 'block'
        : 'none'
    default:
      return 'none'
  }
}

function TradingViewWidget({ chartSymbol, indexToken }: Props) {
  const container = useRef<HTMLDivElement>(null)
  const initialized = useRef(false)

  useEffect(() => {
    // Prevent script from being mounted twice, e.g. Strict mode
    if (initialized.current) return
    initialized.current = true

    const script = document.createElement('script')
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
    script.type = 'text/javascript'
    script.async = true
    script.innerHTML = getScriptInnerHtml(chartSymbol)

    container.current?.appendChild(script)
  }, [chartSymbol, indexToken])

  return (
    <div
      className='tradingview-widget-container'
      ref={container}
      style={{
        height: '100%',
        width: '100%',
        display: getDisplayStyle(chartSymbol, indexToken.symbol),
      }}
    >
      <div
        className='tradingview-widget-container__widget'
        style={{ height: 'calc(100% - 32px)', width: '100%' }}
      ></div>
      <div className='tradingview-widget-copyright'>
        <a
          href='https://www.tradingview.com/'
          rel='noopener nofollow'
          target='_blank'
        >
          <span className='blue-text'>Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  )
}

export default memo(TradingViewWidget)
