'use client'

import { useLeverageToken } from '@/app/leverage/provider'
import { TradeInputSelector } from '@/components/swap/components/trade-input-selector'
import { TradeButton } from '@/components/trade-button'
import { Token } from '@/constants/tokens'

import { BuySellSelector } from './components/buy-sell-selector'
import { LeverageSelector } from './components/leverage-selector'

import './styles.css'

export function LeverageWidget() {
  const { inputToken, isMinting, outputToken, toggleIsMinting } =
    useLeverageToken()
  const onChangeInput = (token: Token, amount: string) => {
    console.log(token.symbol, amount)
  }
  const onClickBalance = () => {}
  const onClickButton = () => {}
  const onSelectToken = () => {}

  return (
    <div className='widget flex flex-col gap-3 rounded-3xl p-6'>
      <div>{outputToken.symbol}</div>
      <BuySellSelector isMinting={isMinting} onClick={toggleIsMinting} />
      <LeverageSelector />
      <TradeInputSelector
        config={{ isReadOnly: false }}
        balance={''}
        caption='You pay'
        formattedFiat={''}
        selectedToken={inputToken}
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
