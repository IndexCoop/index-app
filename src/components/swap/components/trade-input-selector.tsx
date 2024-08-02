import { Flex, Input, Text } from '@chakra-ui/react'

import { Token } from '@/constants/tokens'
import { colors } from '@/lib/styles/colors'

import { Caption } from './caption'
import { SelectorButton } from './selector-button'

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
  selectedToken: Token
  selectedTokenAmount: string
  priceImpact?: { colorCoding: string; value: string }
  showSelectorButtonChevron?: boolean
  showSelectorButton?: boolean
  onSelectToken: () => void
  onChangeInput?: (token: Token, amount: string) => void
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
    <div className='bg-ic-white dark:bg-ic-blue-950 border-ic-gray-100 dark:border-ic-gray-200 flex flex-col rounded-xl border px-4 py-5'>
      <Caption caption={props.caption} />
      <Flex align='center' direction='row' justify='space-between' mt='6px'>
        {config.isReadOnly ? (
          <Text
            color={
              props.selectedTokenAmount === '0'
                ? colors.ic.gray[400]
                : colors.ic.black
            }
            fontSize='25px'
            fontWeight={500}
            pr='4px'
            textOverflow='ellipsis'
            whiteSpace='nowrap'
          >
            {props.selectedTokenAmount}
          </Text>
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
  <Flex>
    <Text fontSize='12px' fontWeight={500} textColor={colors.ic.gray[400]}>
      {props.fiat}
    </Text>
    {props.priceImpact && (
      <Text fontSize='12px' textColor={props.priceImpact.colorCoding}>
        &nbsp;{props.priceImpact.value}
      </Text>
    )}
  </Flex>
)
