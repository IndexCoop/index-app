'use client'

import { useDisclosure } from '@chakra-ui/react'

import { useLeverageToken } from '@/app/leverage/provider'
import { SelectTokenModal } from '@/components/swap/components/select-token-modal'
import { useWallet } from '@/lib/hooks/use-wallet'

import { LeverageWidget } from './components/leverage-widget'
import { Stats } from './components/stats'
import { Title } from './components/title'
import TradingViewWidget from './components/trading-view-widget'

export default function Page() {
  const { address } = useWallet()
  const {
    isOpen: isSelectBaseTokenOpen,
    onOpen: onOpenSelectBaseToken,
    onClose: onCloseSelectBaseToken,
  } = useDisclosure()
  const { baseTokens, onSelectBaseToken } = useLeverageToken()
  return (
    <div className='flex'>
      <div className='mx-auto flex flex-col gap-6 p-12'>
        <div className='flex flex-row gap-36'>
          <Title />
          <Stats onClickBaseTokenSelector={onOpenSelectBaseToken} />
        </div>
        <div className='flex flex-row gap-6'>
          <div className='h-4/5 w-7/12 flex-none flex-grow'>
            <TradingViewWidget />
          </div>
          <LeverageWidget onClickBaseTokenSelector={onOpenSelectBaseToken} />
        </div>
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
