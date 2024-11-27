'use client'

import { useColorMode, useDisclosure } from '@chakra-ui/react'
import { PopupButton } from '@typeform/embed-react'
import { Suspense, useEffect, useState } from 'react'

import { ChartTabs } from '@/app/leverage/components/chart-tabs'
import TradingViewWidget from '@/app/leverage/components/trading-view-widget'
import { useLeverageToken } from '@/app/leverage/provider'
import { ChartTab } from '@/app/leverage/types'
import { PriceChart } from '@/components/charts/price-chart'
import { BaseAssetSelector } from '@/components/selectors/base-asset-selector'
import { NetworkSelector } from '@/components/selectors/network-selector'
import { SelectTokenModal } from '@/components/swap/components/select-token-modal'
import { BTC, ETH } from '@/constants/tokens'
import { useWallet } from '@/lib/hooks/use-wallet'

import { FaqSection } from './components/faq-section'
import { LeverageWidget } from './components/leverage-widget'
import { Stats } from './components/stats'
import { Title } from './components/title'
import { YourTokens } from './components/your-tokens'

const surveyTracking = { utm_source: 'app' }

export default function Page() {
  const { address } = useWallet()
  const {
    isOpen: isSelectBaseTokenOpen,
    onOpen: onOpenSelectBaseToken,
    onClose: onCloseSelectBaseToken,
  } = useDisclosure()
  const { baseToken, baseTokens, indexToken, nav, onSelectBaseToken } =
    useLeverageToken()
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
    document.body.classList.add('dark', 'bg-ic-dark')
    return () => {
      document.body.classList.remove('dark', 'bg-ic-dark')
    }
  })

  return (
    <div className='mx-auto flex max-w-screen-2xl justify-center'>
      <div className='flex w-full flex-col items-center'>
        <div className='mx-auto flex w-full flex-col gap-8 px-4 py-4 sm:py-12'>
          <div className='flex flex-col gap-5 md:flex-row md:gap-10'>
            <Title />
            <div className='flex flex-row gap-10 '>
              <BaseAssetSelector
                baseTokens={baseTokens}
                selectedBaseToken={baseToken}
                onSelectBaseAsset={(symbol) => onSelectBaseToken(symbol)}
              />
              <NetworkSelector />
            </div>
          </div>
          <div className='flex flex-col gap-6 lg:flex-row'>
            <div className='flex w-full flex-col gap-6 lg:min-w-[67%] lg:max-w-[67%]'>
              <Stats />
              <div className='flex h-[320px] flex-col md:h-[390px] lg:h-[514px]'>
                {currentTab === 'indexcoop-chart' ? (
                  <PriceChart
                    indexTokenAddress={indexToken.address ?? ''}
                    nav={nav}
                  />
                ) : (
                  <>
                    <TradingViewWidget
                      baseToken={baseToken}
                      symbol={ETH.symbol}
                    />
                    <TradingViewWidget
                      baseToken={baseToken}
                      symbol={BTC.symbol}
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
              <LeverageWidget
                onClickBaseTokenSelector={onOpenSelectBaseToken}
              />
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
      <SelectTokenModal
        isDarkMode={true}
        isOpen={isSelectBaseTokenOpen}
        showBalances={false}
        onClose={onCloseSelectBaseToken}
        onSelectedToken={(tokenSymbol) => {
          onSelectBaseToken(tokenSymbol)
          onCloseSelectBaseToken()
        }}
        address={address}
        tokens={baseTokens}
      />
    </div>
  )
}
