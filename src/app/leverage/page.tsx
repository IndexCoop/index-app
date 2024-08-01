'use client'

import { useDisclosure } from '@chakra-ui/react'
import { PopupButton } from '@typeform/embed-react'

import { useLeverageToken } from '@/app/leverage/provider'
import { SelectTokenModal } from '@/components/swap/components/select-token-modal'
import { BTC, ETH } from '@/constants/tokens'
import { useWallet } from '@/lib/hooks/use-wallet'

import { FaqSection } from './components/faq-section'
import { LeverageWidget } from './components/leverage-widget'
import { Stats } from './components/stats'
import { Title } from './components/title'
import TradingViewWidget from './components/trading-view-widget'
import { YourTokens } from './components/your-tokens'

export default function Page() {
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
          <div className='flex flex-col md:flex-row'>
            <Title />
            <Stats onClickBaseTokenSelector={onOpenSelectBaseToken} />
          </div>
          <div className='flex flex-col gap-6 lg:flex-row'>
            <div className='h-full min-h-[360px] w-full lg:min-w-[67%] lg:max-w-[67%]'>
              <TradingViewWidget baseToken={baseToken} symbol={ETH.symbol} />
              <TradingViewWidget baseToken={baseToken} symbol={BTC.symbol} />
            </div>
            <LeverageWidget onClickBaseTokenSelector={onOpenSelectBaseToken} />
          </div>
          <div className='flex flex-col gap-6 lg:flex-row'>
            <div className='h-full w-full lg:min-w-[67%] lg:max-w-[67%]'>
              <YourTokens />
            </div>
            <PopupButton
              id='01J3ZKSGN2BW1H069AXDS123DB'
              className='text-ic-white bg-ic-blue-600 h-12 w-full rounded-lg py-2.5 font-bold'
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
