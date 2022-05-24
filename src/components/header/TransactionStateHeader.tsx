import { colors } from 'styles/colors'

import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons'
import { Button, Flex, Spinner, Text } from '@chakra-ui/react'

export enum TransactionStateHeaderState {
  none,
  failed,
  pending,
  success,
}

type TransactionStateHeaderProps = {
  isDarkMode: boolean
  onClick: () => void
  state: TransactionStateHeaderState
}

const TransactionStateHeader = ({
  isDarkMode,
  onClick,
  state,
}: TransactionStateHeaderProps) => (
  <Flex>
    <Button
      onClick={onClick}
      background={isDarkMode ? colors.background : colors.white}
      borderColor={getBorderColor(state, isDarkMode)}
      borderRadius='32'
      color={isDarkMode ? colors.background : colors.white}
      fontSize='md'
      fontWeight='700'
      padding='6px 16px'
      _hover={{
        transform:
          'translate3d(0px, 2px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
        transformStyle: 'preserve-3d',
      }}
    >
      <TransactionStateView isDarkMode={isDarkMode} state={state} />
    </Button>
  </Flex>
)

type TransactionStateViewProps = {
  isDarkMode: boolean
  state: TransactionStateHeaderState
}

const TransactionStateView = (props: TransactionStateViewProps) => {
  switch (props.state) {
    case TransactionStateHeaderState.failed:
      return (
        <>
          <WarningIcon w={4} h={4} mr='1' color={colors.icRed} />
          <Text color={colors.icRed}> Failed</Text>
        </>
      )
    case TransactionStateHeaderState.pending:
      return (
        <>
          <Spinner
            size='sm'
            mr='16px'
            color={props.isDarkMode ? colors.white : colors.background}
          />
          <Text>1 Pending</Text>
        </>
      )
    case TransactionStateHeaderState.success:
      return (
        <>
          <CheckCircleIcon w={4} h={4} mr='1' color={colors.icMalachite} />
          <Text color={colors.icMalachite}>Success</Text>
        </>
      )
    default:
      return <></>
  }
}

const getBorderColor = (
  state: TransactionStateHeaderState,
  darkMode: boolean
) => {
  switch (state) {
    case TransactionStateHeaderState.failed:
      return colors.icRed
    case TransactionStateHeaderState.success:
      return colors.icMalachite
    default:
      return darkMode ? colors.white : colors.black
  }
}

export default TransactionStateHeader
