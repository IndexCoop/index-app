'use client'

import { useDisclosure } from '@chakra-ui/react'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { Suspense, useState } from 'react'
import { useWalletClient } from 'wagmi'

import { ChartTabs } from '@/app/leverage/components/chart-tabs'
import TradingViewWidget from '@/app/leverage/components/trading-view-widget'
import { useLeverageToken } from '@/app/leverage/provider'
import { ChartTab } from '@/app/leverage/types'
import { PriceChart } from '@/components/charts/price-chart'
import { SelectTokenModal } from '@/components/swap/components/select-token-modal'
import { BTC, ETH } from '@/constants/tokens'
import { useWallet } from '@/lib/hooks/use-wallet'

import { FaqSection } from './components/faq-section'
import { LeverageWidget } from './components/leverage-widget'
import { BaseAssetSelector } from './components/selectors/base-asset-selector'
import { NetworkSelector } from './components/selectors/network-selector'
import { Stats } from './components/stats'
import { Title } from './components/title'
import { YourTokens } from './components/your-tokens'

export default function Page() {
  const { open } = useWeb3Modal()
  const { data: walletClient } = useWalletClient()
  const { address } = useWallet()
  const {
    isOpen: isSelectBaseTokenOpen,
    onOpen: onOpenSelectBaseToken,
    onClose: onCloseSelectBaseToken,
  } = useDisclosure()
  const { baseToken, baseTokens, indexToken, onSelectBaseToken } =
    useLeverageToken()
  const [currentTab, setCurrentTab] = useState<ChartTab>('indexcoop-chart')

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
              <NetworkSelector
                onSelectNetwork={(chainId) => {
                  if (!walletClient) {
                    open({ view: 'Connect' })
                  }
                  walletClient?.switchChain({ id: chainId })
                }}
              />
            </div>
          </div>
          <div className='flex flex-col gap-6 lg:flex-row'>
            <div className='flex w-full flex-col gap-6 lg:min-w-[67%] lg:max-w-[67%]'>
              <Stats />
              <div className='flex h-full min-h-[360px] flex-col'>
                {currentTab === 'indexcoop-chart' ? (
                  <PriceChart indexToken={indexToken} />
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
