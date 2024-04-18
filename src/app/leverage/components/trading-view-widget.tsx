import { memo, useEffect, useRef } from 'react'

function TradingViewWidget() {
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
    script.innerHTML = `
        {
          "autosize": true,
          "symbol": "COINBASE:ETHBTC",
          "interval": "60",
          "timezone": "Etc/UTC",
          "theme": "dark",
          "style": "2",
          "locale": "en",
          "enable_publishing": false,
          "hide_legend": true,
          "withdateranges": true,
          "allow_symbol_change": true,
          "save_image": false,
          "calendar": false,
          "support_host": "https://www.tradingview.com"
        }`

    container.current?.appendChild(script)
  }, [])

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
