import { headerButtonHover } from 'styles/button'
import { colors, colorStyles } from 'styles/colors'

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
      background={colorStyles(isDarkMode).background}
      borderColor={getBorderColor(state, isDarkMode)}
      borderRadius='32'
      color={colorStyles(isDarkMode).background}
      fontSize='md'
      fontWeight='700'
      padding='6px 16px'
      _hover={headerButtonHover}
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
            color={colorStyles(props.isDarkMode).text}
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
