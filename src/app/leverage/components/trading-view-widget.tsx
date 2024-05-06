import { memo, useEffect, useRef } from 'react'

import { Token } from '@/constants/tokens'

type Props = {
  baseToken: Token
}

const getScriptInnerHtml = (token: Token) => {
  const symbol = token.symbol === 'BTC' ? 'INDEX:BTCUSD' : 'INDEX:ETHUSD'

  return `
  {
    "autosize": true,
    "symbol": "${symbol}",
    "timezone": "Etc/UTC",
    "theme": "dark",
    "style": "1",
    "locale": "en",
    "enable_publishing": false,
    "backgroundColor": "rgba(28, 44, 46, 1)",
    "withdateranges": true,
    "range": "3M",
    "hide_side_toolbar": false,
    "allow_symbol_change": false,
    "calendar": false,
    "hide_volume": true,
    "support_host": "https://www.tradingview.com"
  }`
}

function TradingViewWidget({ baseToken }: Props) {
  const container = useRef<HTMLDivElement>(null)
  const initialized = useRef(false)

  useEffect(() => {
    // Prevent script from being mounted twice, e.g. Strict mode
    if (initialized.current) return
    initialized.current = true

    const script = document.createElement('script')
    script.id = 'tradingview-chart'
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
    script.type = 'text/javascript'
    script.async = true
    script.innerHTML = getScriptInnerHtml(baseToken)

    container.current?.appendChild(script)
  }, [baseToken])

  useEffect(() => {
    const scriptTag = document.getElementById('tradingview-chart')
    if (scriptTag) {
      scriptTag.remove()
      scriptTag.innerHTML = getScriptInnerHtml(baseToken)
      container.current?.appendChild(scriptTag)
    }
  }, [baseToken])

  return (
    <div
      className='tradingview-widget-container'
      ref={container}
      style={{ height: '100%', width: '100%' }}
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
