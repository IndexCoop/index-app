'use client'

import { TradeInputSelector } from '@/components/swap/components/trade-input-selector'
import { TradeButton } from '@/components/trade-button'
import { ETH, Token } from '@/constants/tokens'

import { useDeposit } from '../../providers/deposit-provider'
import { PreSaleToken } from '../../types'

import { DepositWithdrawSelector } from './components/deposit-withdraw-selector'
import { DepositStats } from './components/deposit-stats'
import { TitleLogo } from './components/title-logo'
import { useFormattedData } from './use-formatted-data'

import './styles.css'

export function PreSaleWidget({ token }: { token: PreSaleToken }) {
  const {
    isDepositing,
    preSaleCurrencyToken,
    preSaleToken,
    toggleIsDepositing,
  } = useDeposit()
  const { currencyBalance, tvl, userBalance } = useFormattedData()

  const onChangeInput = (token: Token, amount: string) => {
    console.log(token.symbol, amount)
  }
  const onClickBalance = () => {}
  const onClickButton = () => {}
  const onSelectToken = () => {}

  return (
    <div className='widget w-full min-w-80 flex-1 flex-col space-y-4 rounded-3xl p-6'>
      <TitleLogo logo={token.logo ?? ''} symbol={token.symbol} />
      <DepositWithdrawSelector
        isDepositing={isDepositing}
        onClick={toggleIsDepositing}
      />
      <DepositStats tvl={tvl} userBalance={userBalance} />
      <TradeInputSelector
        config={{ isReadOnly: false }}
        balance={currencyBalance}
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
