import { useColorStyles } from '@/lib/styles/colors'

import { Button } from '@chakra-ui/react'

interface TradeButtonProps {
  label: string
  isDisabled: boolean
  isLoading: boolean
  onClick: () => void
}

export const TradeButton = (props: TradeButtonProps) => {
  const { styles } = useColorStyles()
  return (
    <Button
      background={styles.backgroundInverted}
      border='0'
      borderRadius='12px'
      color={styles.textInverted}
      disabled={props.isDisabled}
      fontSize='24px'
      fontWeight='600'
      isLoading={props.isLoading}
      height='54px'
      w='100%'
      onClick={props.onClick}
    >
      {props.label}
    </Button>
  )
}
