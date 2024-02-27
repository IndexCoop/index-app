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
  onSelectToken: () => void
  onChangeInput?: (token: Token, amount: string) => void
  onClickBalance?: () => void
}

export const TradeInputSelector = (props: TradeInputSelectorProps) => {
  const { balance, config, formattedFiat, selectedToken } = props

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
    <Flex
      className='bg-ic-white'
      border={'1px solid'}
      borderColor={colors.icGray1}
      borderRadius={12}
      direction={'column'}
      p={'16px 20px'}
    >
      <Caption caption={props.caption} />
      <Flex align='center' direction='row' justify='space-between' mt='6px'>
        {config.isReadOnly ? (
          <Text
            color={
              props.selectedTokenAmount === '0'
                ? colors.icGray2
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
            color={colors.ic.black}
            fontSize='25px'
            fontWeight={500}
            overflow='hidden'
            placeholder='0'
            _placeholder={{ color: colors.icGray2 }}
            pr='4px'
            type='number'
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
        <Balance balance={balance} onClick={props.onClickBalance} />
      </Flex>
    </Flex>
  )
}

interface BalanceProps {
  balance: string
  onClick?: () => void
}

const Balance = ({ balance, onClick }: BalanceProps) => {
  const showMaxLabel = onClick !== undefined
  return (
    <Flex
      align='center'
      cursor='pointer'
      direction={'row'}
      gap='8px'
      onClick={onClick}
    >
      <Text color={colors.icGray2} fontSize='12px' fontWeight='500'>
        Balance: {balance}
      </Text>
      {showMaxLabel && (
        <Flex
          align='center'
          className='bg-ic-blue-500'
          borderRadius='12px'
          justify='center'
          py='2px'
          px='8px'
        >
          <Text color={colors.ic.white} fontSize='9px' fontWeight={500}>
            MAX
          </Text>
        </Flex>
      )}
    </Flex>
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
    <Text fontSize='12px' fontWeight={500} textColor={colors.icGray2}>
      {props.fiat}
    </Text>
    {props.priceImpact && (
      <Text fontSize='12px' textColor={props.priceImpact.colorCoding}>
        &nbsp;{props.priceImpact.value}
      </Text>
    )}
  </Flex>
)
