import { colors, useColorStyles } from '@/lib/styles/colors'

import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons'
import { Flex, Spacer, Spinner, Text } from '@chakra-ui/react'

export enum TransactionReviewSimulationState {
  default,
  loading,
  failure,
  success,
}

type TransactionReviewSimulationProps = {
  state: TransactionReviewSimulationState
}

export const TransactionReviewSimulation = ({
  state,
}: TransactionReviewSimulationProps) => {
  const isLoading = state === TransactionReviewSimulationState.loading
  const isSuccess = state === TransactionReviewSimulationState.success
  const showDefault =
    state === TransactionReviewSimulationState.default ||
    state === TransactionReviewSimulationState.loading
  return showDefault ? (
    <SimulationDefaultView isLoading={isLoading} />
  ) : (
    <SimulationStateView success={isSuccess} />
  )
}

const SimulationDefaultView = ({ isLoading }: { isLoading: boolean }) => {
  const { styles } = useColorStyles()
  return (
    <Flex
      border='1px solid'
      borderColor={styles.border}
      borderRadius='16px'
      p='16px'
      w='100%'
    >
      <Text fontSize='lg' fontWeight='500'>
        Transaction simulation
      </Text>
      <Spacer />
      {isLoading ? (
        <Spinner color={styles.backgroundInverted} />
      ) : (
        <Text>Auto</Text>
      )}
    </Flex>
  )
}

const SimulationStateView = ({ success }: { success: boolean }) => {
  const color = success ? colors.icMalachite : colors.icRed
  const title = success ? 'Success' : 'Failed'
  const text = success
    ? 'The transaction was successfully simulated.'
    : 'The transaction simulation failed.'
  return (
    <Flex
      border='1px solid'
      borderColor={color}
      borderRadius='16px'
      p='16px'
      w='100%'
    >
      <Flex>
        <Flex p='4px' mr='12px'>
          {success ? (
            <CheckCircleIcon boxSize='4' color={color} />
          ) : (
            <WarningIcon boxSize='4' color={color} />
          )}
        </Flex>
        <Flex direction={'column'}>
          <Text fontWeight='700'>{title}</Text>
          <Text>{text}</Text>
        </Flex>
      </Flex>
    </Flex>
  )
}
