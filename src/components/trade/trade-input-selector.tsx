import { Flex, Input, Text } from '@chakra-ui/react'

import { colors } from '@/lib/styles/colors'

interface TradeInputSelectorProps {
  caption: string
  balance: string
  formattedFiat: string
  priceImpact?: { colorCoding: string; value: string }
  onClickBalance?: () => void
}

export const TradeInputSelector = (props: TradeInputSelectorProps) => {
  const { balance, caption, formattedFiat, onClickBalance, priceImpact } = props
  return (
    <Flex
      bg={colors.icWhite}
      border={'1px solid'}
      borderColor={colors.icGray1}
      borderRadius={12}
      direction={'column'}
      p={'16px'}
    >
      <Caption caption={caption} />
      <Flex align='flex-start' direction='row' justify='space-between' mt='8px'>
        <PriceUsd fiat={formattedFiat} priceImpact={priceImpact} />
        <Balance balance={balance} onClick={onClickBalance} />
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
          bg={colors.icBlue1}
          borderRadius='12px'
          justify='center'
          py='2px'
          px='8px'
        >
          <Text color={colors.icWhite} fontSize='9px' fontWeight={500}>
            MAX
          </Text>
        </Flex>
      )}
    </Flex>
  )
}

const Caption = ({ caption }: { caption: string }) => (
  <Text fontSize={'12px'} fontWeight={500} textColor={colors.icGray2}>
    {caption}
  </Text>
)

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
      <Text fontSize='14px' textColor={props.priceImpact.colorCoding}>
        &nbsp;{props.priceImpact.value}
      </Text>
    )}
  </Flex>
)
