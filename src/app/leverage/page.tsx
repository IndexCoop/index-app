'use client'

import { useColorMode } from '@chakra-ui/react'
import { PopupButton } from '@typeform/embed-react'
import { Suspense, useEffect, useState } from 'react'

import { ChartTabs } from '@/app/leverage/components/chart-tabs'
import { QuickStats } from '@/app/leverage/components/stats/index'
import TradingViewWidget from '@/app/leverage/components/trading-view-widget'
import { useLeverageToken } from '@/app/leverage/provider'
import { ChartTab } from '@/app/leverage/types'
import { PriceChart } from '@/components/charts/price-chart'

import { FaqSection } from './components/faq-section'
import { LeverageWidget } from './components/leverage-widget'
import { YourTokens } from './components/your-tokens'

const surveyTracking = { utm_source: 'app' }

export default function Page() {
  const { indexToken, nav } = useLeverageToken()
  const [currentTab, setCurrentTab] = useState<ChartTab>('indexcoop-chart')
  const { colorMode, toggleColorMode } = useColorMode()

  useEffect(() => {
    if (colorMode === 'light') {
      toggleColorMode()
    }

    return () => {
      if (colorMode === 'dark') {
        toggleColorMode()
      }
    }
  }, [colorMode, toggleColorMode])

  useEffect(() => {
    document.body.classList.add('dark', 'bg-ic-black')
    return () => {
      document.body.classList.remove('dark', 'bg-ic-black')
    }
  })

  return (
    <div className='mx-auto flex max-w-screen-2xl justify-center'>
      <div className='flex w-full flex-col items-center'>
        <div className='mx-auto flex w-full flex-col gap-8 px-4 py-4 sm:py-12'>
          <QuickStats />
          <div className='flex flex-col gap-6 lg:flex-row'>
            <div className='flex w-full flex-col gap-6 lg:min-w-[67%] lg:max-w-[67%]'>
              <div className='flex h-[320px] flex-col md:h-[390px] lg:h-[514px]'>
                {currentTab === 'indexcoop-chart' ? (
                  <PriceChart
                    indexTokenAddress={indexToken.address ?? ''}
                    nav={nav}
                  />
                ) : (
                  <>
                    {/* TODO: Refactor to use single component */}
                    <TradingViewWidget
                      chartSymbol='INDEX:ETHUSD'
                      indexToken={indexToken}
                    />
                    <TradingViewWidget
                      chartSymbol='INDEX:BTCUSD'
                      indexToken={indexToken}
                    />
                    <TradingViewWidget
                      chartSymbol='BINANCE:ETHBTC'
                      indexToken={indexToken}
                    />
                    <TradingViewWidget
                      chartSymbol='BINANCE:BTCETH'
                      indexToken={indexToken}
                    />
                  </>
                )}
                <ChartTabs
                  currentTab={currentTab}
                  setCurrentTab={setCurrentTab}
                />
              </div>
            </div>
            <Suspense>
              <LeverageWidget />
            </Suspense>
          </div>
          <div className='flex flex-col gap-6 lg:flex-row'>
            <div className='h-full w-full lg:min-w-[67%] lg:max-w-[67%]'>
              <YourTokens />
            </div>
            <PopupButton
              id='Ns10DhMF'
              className='text-ic-white bg-ic-blue-900 h-12 w-full rounded-lg py-2.5 font-bold'
              tracking={surveyTracking}
            >
              Give us your feedback!
            </PopupButton>
          </div>
        </div>
        <FaqSection />
      </div>
    </div>
  )
}
