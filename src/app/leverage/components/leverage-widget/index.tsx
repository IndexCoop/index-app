'use client'

import { TradeInputSelector } from '@/components/swap/components/trade-input-selector'
import { BuySellSelector } from './components/buy-sell-selector'
import { LeverageSelector } from './components/leverage-selector'
import { TradeButton } from '@/components/trade-button'
import { ETH, Token } from '@/constants/tokens'

import './styles.css'

export function LeverageWidget() {
  const onChangeInput = (token: Token, amount: string) => {}
  const onClickBalance = () => {}
  const onClickButton = () => {}
  const onSelectToken = () => {}

  return (
    <div className='widget flex flex-col gap-3 rounded-3xl p-6'>
      <div>ETH</div>
      <BuySellSelector />
      <LeverageSelector />
      <TradeInputSelector
        config={{ isReadOnly: false }}
        balance={''}
        caption='You pay'
        formattedFiat={''}
        selectedToken={ETH}
        selectedTokenAmount={''}
        onChangeInput={onChangeInput}
        onClickBalance={onClickBalance}
        onSelectToken={onSelectToken}
      />
      <div>Summary</div>
      <TradeButton
        label={'Connect wallet'}
        isDisabled={false}
        isLoading={false}
        onClick={onClickButton}
      />
    </div>
  )
}
