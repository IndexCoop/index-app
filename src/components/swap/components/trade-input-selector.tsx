import { Input } from '@headlessui/react'

import { cn } from '@/lib/utils/tailwind'

import { Caption } from './caption'
import { SelectorButton } from './selector-button'

type InputSelectorToken = {
  decimals: number
  image: string
  symbol: string
}

interface TradeInputSelectorProps {
  caption: string
  balance: string
  formattedFiat: string
  selectedToken: InputSelectorToken
  selectedTokenAmount: string
  priceImpact?: { colorCoding: string; value: string }
  showSelectorButtonChevron?: boolean
  showSelectorButton?: boolean
  onSelectToken: () => void
  onChangeInput?: (token: InputSelectorToken, amount: string) => void
  onClickBalance?: () => void
}

export const TradeInputSelector = (props: TradeInputSelectorProps) => {
  const {
    balance,
    formattedFiat,
    selectedToken,
    showSelectorButton = true,
  } = props

  const onChangeInput = (amount: string) => {
    if (props.onChangeInput === undefined) return
    props.onChangeInput(selectedToken, amount)
  }

  return (
    <div className='bg-ic-white dark:bg-ic-gray-975 border-ic-gray-100 dark:border-ic-gray-700 flex flex-col rounded-lg border px-4 py-5'>
      <Caption caption={props.caption} />
      <div className='mt-1.5 flex items-center justify-between'>
        <Input
          className='placeholder:text-ic-gray-400 text-ic-black dark:text-ic-white w-full overflow-hidden text-ellipsis whitespace-nowrap bg-transparent pr-1 text-[25px] font-medium outline-none'
          placeholder='0'
          type='number'
          onWheel={(e) => e.target instanceof HTMLElement && e.target.blur()}
          step='any'
          value={props.selectedTokenAmount}
          onChange={(event) => {
            onChangeInput(event.target.value)
          }}
        />
        <SelectorButton
          image={selectedToken.image}
          symbol={selectedToken.symbol}
          showChevron={props.showSelectorButtonChevron}
          visible={showSelectorButton}
          onClick={props.onSelectToken}
        />
      </div>
      <div className='mt-2.5 flex items-start justify-between'>
        <PriceUsd fiat={formattedFiat} priceImpact={props.priceImpact} />
        {showSelectorButton ? (
          <Balance balance={balance} onClick={props.onClickBalance} />
        ) : null}
      </div>
    </div>
  )
}

interface BalanceProps {
  balance: string
  onClick?: () => void
}

const Balance = ({ balance, onClick }: BalanceProps) => {
  const showMaxLabel = onClick !== undefined
  return (
    <div
      className='flex cursor-pointer flex-row items-center gap-2'
      onClick={onClick}
    >
      <div className='text-ic-gray-400 dark:text-ic-gray-300 text-xs font-medium'>
        Balance: {balance}
      </div>
      {showMaxLabel && (
        <div className='bg-ic-blue-500 dark:bg-ic-blue-600 align-center justify-center rounded-xl px-2 py-[2px]'>
          <div className='text-ic-white dark:text-ic-black text-[9px] font-medium'>
            MAX
          </div>
        </div>
      )}
    </div>
  )
}

interface PriceUsdProps {
  fiat: string
  priceImpact?: {
    colorCoding: string
    value: string
  }
}

const PriceUsd = (props: PriceUsdProps) => (
  <div className='flex'>
    <p className='text-ic-gray-400 text-xs font-medium'>{props.fiat}</p>
    {props.priceImpact && (
      <p className={cn('text-xs', props.priceImpact.colorCoding)}>
        &nbsp;{props.priceImpact.value}
      </p>
    )}
  </div>
)
