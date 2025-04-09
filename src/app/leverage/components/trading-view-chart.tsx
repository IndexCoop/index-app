import { Button } from '@headlessui/react'
import { useAppKit } from '@reown/appkit/react'
import Script from 'next/script'
import { useEffect, useState } from 'react'

import { TradingViewChartContainer } from '@/app/leverage/components/trading-view-chart-container'
import { useWallet } from '@/lib/hooks/use-wallet'

export function TradingViewChart() {
  const [isScriptReady, setIsScriptReady] = useState(false)
  const { isConnected } = useWallet()
  const { open } = useAppKit()

  useEffect(() => {
    const scriptAlreadyLoaded = document.querySelector(
      'script[src="/tradingview-chart/datafeeds/udf/dist/bundle.js"]',
    )

    if (scriptAlreadyLoaded) {
      setIsScriptReady(true)
    }
  }, [])

  return (
    <div className='xs:h-[422px] relative aspect-square w-full lg:aspect-auto'>
      <Script
        src='/tradingview-chart/datafeeds/udf/dist/bundle.js'
        onLoad={() => {
          setIsScriptReady(true)
        }}
      />
      {isScriptReady && <TradingViewChartContainer />}
      {!isConnected && (
        <div className='bg-ic-black/95 absolute inset-0 z-20 flex items-center justify-center'>
          <Button
            className='bg-ic-blue-500 dark:bg-ic-blue-300 dark:hover:bg-ic-blue-200 hover:bg-ic-blue-500/90 text-ic-gray-50 dark:text-ic-black block rounded-md px-8 py-1 text-sm font-medium shadow-sm transition-all duration-300 hover:scale-[1.04]'
            onClick={() => open({ view: 'Connect' })}
          >
            Start Trading
          </Button>
        </div>
      )}
    </div>
  )
}
