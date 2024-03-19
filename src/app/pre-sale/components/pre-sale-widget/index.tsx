'use client'

import { TradeInputSelector } from '@/components/swap/components/trade-input-selector'
import { TradeButton } from '@/components/trade-button'
import { ETH, Token } from '@/constants/tokens'

// TODO: rework into deposit|withdraw
import { BuySellSelector } from './components/buy-sell-selector'

import './styles.css'

export function PreSaleWidget() {
  const onChangeInput = (token: Token, amount: string) => {
    console.log(token.symbol, amount)
  }
  const onClickBalance = () => {}
  const onClickButton = () => {}
  const onSelectToken = () => {}

  return (
    <div className='widget min-w-80 flex-1 flex-col gap-3 rounded-3xl p-6'>
      <div>hyETH</div>
      <BuySellSelector isMinting={true} onClick={() => {}} />
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
