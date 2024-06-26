import { Button, Spinner } from '@chakra-ui/react'
import clsx from 'clsx'

import { colors } from '@/lib/styles/colors'

interface TradeButtonProps {
  label: string
  isDarkMode?: boolean
  isDisabled: boolean
  isLoading: boolean
  onClick: () => void
}

export const TradeButton = (props: TradeButtonProps) => {
  const { isDisabled } = props
  const background = isDisabled ? 'bg-ic-gray-500' : 'bg-ic-blue-600'
  const boxShadow = isDisabled
    ? 'none'
    : '0.5px 1px 2px 0px rgba(0, 0, 0, 0.30)'
  return (
    <Button
      border='0'
      borderRadius='10px'
      boxShadow={boxShadow}
      color={colors.ic.white}
      disabled={props.isDisabled}
      fontSize='16px'
      fontWeight='700'
      isLoading={props.isLoading}
      spinner={
        <Spinner color={props.isDarkMode ? colors.ic.gray[100] : '#555555'} />
      }
      height='54px'
      w='100%'
      onClick={props.onClick}
      className={clsx(background)}
    >
      {props.label}
    </Button>
  )
}
