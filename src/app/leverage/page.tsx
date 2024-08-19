'use client'

import { useDisclosure } from '@chakra-ui/react'
import { PopupButton } from '@typeform/embed-react'

import { useLeverageToken } from '@/app/leverage/provider'
import { SelectTokenModal } from '@/components/swap/components/select-token-modal'
import { BTC, ETH } from '@/constants/tokens'
import { useWallet } from '@/lib/hooks/use-wallet'

import { FaqSection } from './components/faq-section'
import { LeverageWidget } from './components/leverage-widget'
import { BaseAssetSelector } from './components/selectors/base-asset-selector'
import { Stats } from './components/stats'
import { Title } from './components/title'
import TradingViewWidget from './components/trading-view-widget'
import { YourTokens } from './components/your-tokens'

const surveyTracking = { utm_source: 'app' }

export default function Page() {
  // const { openConnectModal } = useConnectModal()
  // const { data: walletClient } = useWalletClient()
  const { address } = useWallet()
  const {
    isOpen: isSelectBaseTokenOpen,
    onOpen: onOpenSelectBaseToken,
    onClose: onCloseSelectBaseToken,
  } = useDisclosure()
  const { baseToken, baseTokens, onSelectBaseToken } = useLeverageToken()
  return (
    <div className='mx-auto flex max-w-screen-2xl justify-center'>
      <div className='flex w-full flex-col items-center'>
        <div className='mx-auto flex w-full flex-col gap-8 px-4 py-12'>
          <div className='flex flex-col gap-10 md:flex-row'>
            <Title />
            <div className='flex flex-row gap-10 '>
              <BaseAssetSelector
                onSelectBaseAsset={(symbol) => onSelectBaseToken(symbol)}
              />
              {/* <NetworkSelector
                onSelectNetwork={(chainId) => {
                  console.log(walletClient)
                  if (!walletClient && openConnectModal) {
                    openConnectModal()
                  }
                  walletClient?.switchChain({ id: chainId })
                }}
              /> */}
            </div>
          </div>
          <div className='flex flex-col gap-6 lg:flex-row'>
            <div className='flex w-full flex-col gap-6 lg:min-w-[67%] lg:max-w-[67%]'>
              <Stats />
              <div className='h-full min-h-[360px]'>
                <TradingViewWidget baseToken={baseToken} symbol={ETH.symbol} />
                <TradingViewWidget baseToken={baseToken} symbol={BTC.symbol} />
              </div>
            </div>
            <LeverageWidget onClickBaseTokenSelector={onOpenSelectBaseToken} />
          </div>
          <div className='flex flex-col gap-6 lg:flex-row'>
            <div className='h-full w-full lg:min-w-[67%] lg:max-w-[67%]'>
              <YourTokens />
            </div>
            <PopupButton
              id='ywmAsQxf'
              className='text-ic-white bg-ic-black h-12 w-full rounded-lg py-2.5 font-bold'
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
