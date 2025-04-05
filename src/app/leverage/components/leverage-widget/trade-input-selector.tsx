import { Flex, Input, Text } from '@chakra-ui/react'

import { Caption } from '@/components/swap/components/caption'
import { SelectorButton } from '@/components/swap/components/selector-button'
import { colors } from '@/lib/styles/colors'
import { cn } from '@/lib/utils/tailwind'

export type InputSelectorToken = {
  decimals: number
  image: string
  symbol: string
}

interface TradeInputSelectorConfig {
  isInputDisabled?: boolean
  isReadOnly?: boolean
  isSelectorDisabled?: boolean
}
interface TradeInputSelectorProps {
  config: TradeInputSelectorConfig
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
    config,
    formattedFiat,
    selectedToken,
    showSelectorButton = true,
  } = props

  const onChangeInput = (amount: string) => {
    if (
      props.onChangeInput === undefined ||
      config.isInputDisabled === true ||
      config.isSelectorDisabled === true ||
      config.isReadOnly === true
    )
      return
    props.onChangeInput(selectedToken, amount)
  }

  return (
    <div className='bg-ic-white border-ic-gray-100 flex flex-col rounded-lg border px-4 py-5 dark:border-[#D4D4D4] dark:bg-zinc-800'>
      <Caption caption={props.caption} />
      <Flex align='center' direction='row' justify='space-between' mt='6px'>
        {config.isReadOnly ? (
          <p
            className={cn(
              'text-ellipsis whitespace-nowrap pr-1 text-[25px] font-medium',
              props.selectedTokenAmount === '0'
                ? 'text-ic-gray-400'
                : 'text-ic-black',
            )}
          >
            {props.selectedTokenAmount}
          </p>
        ) : (
          <Input
            className='text-ic-black dark:text-ic-white bg-transparent pr-1 text-3xl'
            fontSize='25px'
            fontWeight={500}
            overflow='hidden'
            placeholder='0'
            _placeholder={{ color: colors.ic.gray[400] }}
            type='number'
            onWheel={(e) => e.target instanceof HTMLElement && e.target.blur()}
            step='any'
            textOverflow='ellipsis'
            variant='unstyled'
            whiteSpace='nowrap'
            disabled={config.isInputDisabled ?? false}
            isReadOnly={config.isReadOnly ?? false}
            value={props.selectedTokenAmount}
            onChange={(event) => {
              onChangeInput(event.target.value)
            }}
          />
        )}
        <SelectorButton
          image={selectedToken.image}
          symbol={selectedToken.symbol}
          showChevron={props.showSelectorButtonChevron}
          visible={showSelectorButton}
          onClick={props.onSelectToken}
        />
      </Flex>
      <Flex
        align='flex-start'
        direction='row'
        justify='space-between'
        mt='10px'
      >
        <PriceUsd fiat={formattedFiat} priceImpact={props.priceImpact} />
        {showSelectorButton ? (
          <Balance balance={balance} onClick={props.onClickBalance} />
        ) : null}
      </Flex>
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
  <Flex>
    <p className='text-xs font-medium text-neutral-400'>{props.fiat}</p>
    {props.priceImpact && (
      <Text fontSize='12px' textColor={props.priceImpact.colorCoding}>
        &nbsp;{props.priceImpact.value}
      </Text>
    )}
  </Flex>
)
