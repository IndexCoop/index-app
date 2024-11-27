'use client'

import { Suspense, useState } from 'react'

import { ChartTabs } from '@/app/earn/components/chart-tabs'
import { FaqSection } from '@/app/earn/components/faq-section'
import { useEarnContext } from '@/app/earn/provider'
import { ChartTab } from '@/app/earn/types'
import { PriceChart } from '@/components/charts/price-chart'
import { TvlChart } from '@/components/charts/tvl-chart'

import { EarnWidget } from './components/earn-widget'
import { QuickStats } from './components/quick-stats'
import { Title } from './components/title'

export default function Page() {
  const { indexToken, isFetchingStats, nav, tvl } = useEarnContext()
  const [currentTab, setCurrentTab] = useState<ChartTab>('price')

  return (
    <div className='mx-auto flex max-w-screen-2xl justify-center'>
      <div className='flex w-full flex-col items-center'>
        <div className='mx-auto flex w-full flex-col gap-8 px-4 py-4 sm:py-12'>
          <div className='flex flex-col gap-5 md:flex-row md:gap-10'>
            <Title />
          </div>
          <div className='flex flex-col-reverse gap-6 lg:flex-row'>
            <div className='flex w-full flex-col gap-6 lg:min-w-[67%] lg:max-w-[67%]'>
              <QuickStats />
              <div className='flex h-[300px] flex-col md:h-[320px] lg:h-[422px]'>
                {currentTab === 'price' && (
                  <PriceChart
                    indexToken={indexToken}
                    isFetchingStats={isFetchingStats}
                    nav={nav}
                  />
                )}
                {currentTab === 'tvl' && (
                  <TvlChart
                    indexToken={indexToken}
                    isFetchingStats={isFetchingStats}
                    tvl={tvl}
                  />
                )}
                <ChartTabs
                  currentTab={currentTab}
                  setCurrentTab={setCurrentTab}
                />
              </div>
            </div>
            <Suspense>
              <EarnWidget />
            </Suspense>
          </div>
        </div>
        <FaqSection />
      </div>
    </div>
  )
}
