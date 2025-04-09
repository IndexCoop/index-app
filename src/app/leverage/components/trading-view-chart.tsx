import { Button } from '@headlessui/react'
import Script from 'next/script'
import { useEffect, useState } from 'react'

import { TradingViewChartContainer } from '@/app/leverage/components/trading-view-chart-container'
import { useCustomAppKit } from '@/lib/hooks/use-custom-app-kit'
import { useWallet } from '@/lib/hooks/use-wallet'

export function TradingViewChart() {
  const [isScriptReady, setIsScriptReady] = useState(false)
  const { isConnected } = useWallet()
  const { openConnectView } = useCustomAppKit()

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
        <div className='absolute inset-0 z-20 flex items-center justify-center bg-zinc-900/95'>
          <Button
            className='bg-ic-blue-500 hover:bg-ic-blue-500/90 text-ic-gray-50 dark:text-ic-black block rounded-full px-8 py-1 text-sm font-medium shadow-sm transition-all duration-300 hover:scale-[1.04] dark:bg-neutral-50 dark:hover:bg-neutral-200'
            onClick={() => openConnectView('TradingView Chart')}
          >
            Start Trading
          </Button>
        </div>
      )}
    </div>
  )
}
