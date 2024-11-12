'use client'

import { useDisclosure } from '@chakra-ui/react'
import { Suspense, useState } from 'react'

import { ChartTabs } from '@/app/yield/components/chart-tabs'
import { useYieldContext } from '@/app/yield/provider'
import { ChartTab } from '@/app/yield/types'
import { PriceChart } from '@/components/charts/price-chart'
import { TvlChart } from '@/components/charts/tvl-chart'
import { NetworkSelector } from '@/components/selectors/network-selector'
import { SelectTokenModal } from '@/components/swap/components/select-token-modal'
import { useWallet } from '@/lib/hooks/use-wallet'

import { FaqSection } from './components/faq-section'
import { QuickStats } from './components/quick-stats'
import { Title } from './components/title'
import { YieldWidget } from './components/yield-widget'

export default function Page() {
  const { address } = useWallet()
  const { isOpen: isSelectBaseTokenOpen, onClose: onCloseSelectBaseToken } =
    useDisclosure()
  const { indexToken, nav, tvl } = useYieldContext()
  const [currentTab, setCurrentTab] = useState<ChartTab>('price')

  return (
    <div className='mx-auto flex max-w-screen-2xl justify-center'>
      <div className='flex w-full flex-col items-center'>
        <div className='mx-auto flex w-full flex-col gap-8 px-4 py-4 sm:py-12'>
          <div className='flex flex-col gap-5 md:flex-row md:gap-10'>
            <Title />
            <div className='flex flex-row gap-10 '>
              <NetworkSelector />
            </div>
          </div>
          <div className='flex flex-col gap-6 lg:flex-row'>
            <div className='flex w-full flex-col gap-6 lg:min-w-[67%] lg:max-w-[67%]'>
              <QuickStats />
              <div className='flex h-full min-h-[388px] flex-col'>
                {currentTab === 'price' && (
                  <PriceChart indexToken={indexToken} nav={nav} />
                )}
                {currentTab === 'tvl' && (
                  <TvlChart indexToken={indexToken} tvl={tvl} />
                )}
                <ChartTabs
                  currentTab={currentTab}
                  setCurrentTab={setCurrentTab}
                />
              </div>
            </div>
            <Suspense>
              <YieldWidget />
            </Suspense>
          </div>
        </div>
        <FaqSection />
      </div>
      <SelectTokenModal
        isDarkMode={true}
        isOpen={isSelectBaseTokenOpen}
        showBalances={false}
        onClose={onCloseSelectBaseToken}
        onSelectedToken={() => {}}
        address={address}
        tokens={[]}
      />
    </div>
  )
}
