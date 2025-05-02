import { Input } from '@headlessui/react'

import { Settings } from '@/components/settings'
import { Caption } from '@/components/swap/components/caption'
import { SelectorButton } from '@/components/swap/components/selector-button'
import { useSlippage } from '@/lib/providers/slippage'
import { cn } from '@/lib/utils/tailwind'

export type InputSelectorToken = {
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

  const {
    auto: autoSlippage,
    isAuto: isAutoSlippage,
    set: setSlippage,
    slippage,
  } = useSlippage()

  const onChangeInput = (amount: string) => {
    if (props.onChangeInput === undefined) return
    props.onChangeInput(selectedToken, amount)
  }

  return (
    <div className='bg-ic-white border-ic-gray-100 flex flex-col rounded-lg border px-4 py-4 dark:border-[#D4D4D4] dark:bg-zinc-800'>
      <div className='flex justify-between'>
        <Caption caption={props.caption} />
        <Settings
          isAuto={isAutoSlippage}
          isDarkMode={true}
          slippage={slippage}
          onChangeSlippage={setSlippage}
          onClickAuto={autoSlippage}
        />
      </div>
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
      <div className='mt-3 flex items-start justify-between'>
        <PriceUsd
          fiat={Number(props.selectedTokenAmount) > 0 ? formattedFiat : ''}
          priceImpact={props.priceImpact}
        />
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
      <div className='text-ic-gray-400 text-xs font-medium dark:text-neutral-400'>
        Balance: {balance}
      </div>
      {showMaxLabel && (
        <div className='bg-ic-blue-500 dark:bg-ic-blue-300 align-center justify-center rounded-xl px-2 py-[2px]'>
          <div className='text-ic-white text-[9px] font-medium dark:text-zinc-900'>
            Max
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
    <p className='text-xs font-medium text-neutral-400'>{props.fiat}</p>
    {props.priceImpact && (
      <p className={cn('text-xs', props.priceImpact.colorCoding)}>
        &nbsp;{props.priceImpact.value}
      </p>
    )}
  </div>
)
