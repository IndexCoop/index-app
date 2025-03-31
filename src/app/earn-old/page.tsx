'use client'

import { Suspense, useState } from 'react'

import { useEarnContext } from '@/app/earn/provider'
import { ApyChart } from '@/components/charts/apy-chart'
import { PriceChart } from '@/components/charts/price-chart'
import { TvlChart } from '@/components/charts/tvl-chart'

import { EarnWidget } from './components/earn-widget'
import { QuickStats } from './components/quick-stats'

import { ChartTabs } from '@/app/earn/components/chart-tabs'
import { FaqSection } from '@/app/earn/components/faq-section'
import { ChartTab } from '@/app/earn/types'

export default function Page() {
  const { indexToken, isFetchingStats, apy, nav, tvl } = useEarnContext()
  const [currentTab, setCurrentTab] = useState<ChartTab>('apy')

  return (
    <div className='mx-auto flex max-w-screen-2xl justify-center'>
      <div className='flex w-full flex-col items-center'>
        <div className='mx-auto flex w-full flex-col gap-4 px-1 py-4 sm:gap-5 sm:px-4'>
          <QuickStats />
          <div className='flex flex-col-reverse gap-4 lg:flex-row'>
            <div className='flex w-full flex-col gap-4 lg:min-w-[67%] lg:max-w-[67%] lg:gap-5'>
              <div className='flex h-[350px]'>
                {currentTab === 'price' && (
                  <PriceChart
                    indexTokenAddress={indexToken.address ?? ''}
                    isFetchingStats={isFetchingStats}
                    nav={nav}
                  />
                )}
                {currentTab === 'apy' && (
                  <ApyChart
                    indexTokenAddress={indexToken.address ?? ''}
                    isFetchingStats={isFetchingStats}
                    apy={apy}
                  />
                )}
                {currentTab === 'tvl' && (
                  <TvlChart
                    indexTokenAddress={indexToken.address ?? ''}
                    isFetchingStats={isFetchingStats}
                    tvl={tvl}
                  />
                )}
              </div>
              <ChartTabs
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
              />
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
