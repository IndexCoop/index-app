import { Button } from '@chakra-ui/react'

import { colors } from '@/lib/styles/colors'

interface TradeButtonProps {
  label: string
  isDisabled: boolean
  isLoading: boolean
  onClick: () => void
}

export const TradeButton = (props: TradeButtonProps) => {
  const { isDisabled } = props
  const background = isDisabled ? colors.icGray5 : colors.icBlue6
  const boxShadow = isDisabled
    ? 'none'
    : '0.5px 1px 2px 0px rgba(0, 0, 0, 0.30)'
  return (
    <Button
      background={background}
      border='0'
      borderRadius='10px'
      boxShadow={boxShadow}
      color={colors.icWhite}
      disabled={props.isDisabled}
      fontSize='16px'
      fontWeight='700'
      isLoading={props.isLoading}
      height='54px'
      w='100%'
      onClick={props.onClick}
    >
      {props.label}
    </Button>
  )
}
