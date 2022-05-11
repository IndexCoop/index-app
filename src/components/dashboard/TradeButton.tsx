import { Button } from '@chakra-ui/react'

interface TradeButtonProps {
  label: string
  background: string
  isDisabled: boolean
  isLoading: boolean
  onClick: () => void
}

export const TradeButton = (props: TradeButtonProps) => (
  <Button
    background={props.background}
    border='0'
    borderRadius='12px'
    color='#000'
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
