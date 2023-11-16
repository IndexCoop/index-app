import { useEffect, useState } from 'react'

import { useColorStyles } from '@/lib/styles/colors'

import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons'
import {
  Box,
  Flex,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
} from '@chakra-ui/react'

import { useFlashMintTrade } from '@/lib/hooks/useFlashMintTrade'
import { useSimulateQuote } from '@/lib/hooks/useSimulateQuote'
import { displayFromWei } from '@/lib/utils'
import { getBlockExplorerContractUrl } from '@/lib/utils/blockExplorer'

import { TradeButton } from '@/components/trade-button'

import { FromTo } from './components/from-to'
import { Override } from './components/override'
import { NetworkBadge } from './components/network-badge'
import {
  TransactionReviewSimulation,
  TransactionReviewSimulationState,
} from './components/simulation'
import { TransactionReview } from './types'

enum TransactionReviewModalState {
  failed,
  submit,
  success,
}

type TransactionReviewModalProps = {
  isOpen: boolean
  tx: TransactionReview
  onClose: () => void
}

const useTrade = (tx: TransactionReview) => {
  const { executeFlashMintTrade, isTransacting, txWouldFail } =
    useFlashMintTrade()

  /**
   * Returns boolean indicating success or null for config error
   */
  const executeTrade = async (override: boolean) => {
    const { quoteResult, slippage } = tx
    const { quotes } = quoteResult
    if (!quotes) return null
    if (quotes.flashMint) {
      try {
        await executeFlashMintTrade(quotes.flashMint, slippage, override)
        return true
      } catch {
        return false
      }
    }
    return null
  }

  return { executeTrade, isTransacting, txWouldFail }
}

export const TransactionReviewModal = (props: TransactionReviewModalProps) => {
  const { styles } = useColorStyles()
  const { isOpen, onClose, tx } = props
  const backgroundColor = styles.background

  const [state, setState] = useState<TransactionReviewModalState>(
    TransactionReviewModalState.submit
  )

  const onCloseModal = () => {
    // Make sure to reset state, so that reopening popup doesn't show wrong state
    setState(TransactionReviewModalState.submit)
    onClose()
  }

  const onDone = () => {
    onCloseModal()
  }

  const onSubmitWithSuccess = (success: boolean) => {
    const modalState = success
      ? TransactionReviewModalState.success
      : TransactionReviewModalState.failed
    setState(modalState)
  }

  const modalTitle =
    state === TransactionReviewModalState.submit
      ? 'FlashMint - Review transaction'
      : ''

  return (
    <Modal
      onClose={onCloseModal}
      isOpen={isOpen}
      isCentered
      scrollBehavior='inside'
    >
      <ModalOverlay
        bg='rgba(0, 0, 0, 0.6)'
        backdropFilter='auto'
        backdropBlur='8px'
      />
      <ModalContent
        backgroundColor={backgroundColor}
        borderColor={styles.border}
        borderRadius='10'
        borderStyle='solid'
        borderWidth='2px'
        m={['16px', 0]}
      >
        <ModalHeader>
          <Text>{modalTitle}</Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody p='0 16px 16px 16px'>
          {(state === TransactionReviewModalState.failed ||
            state === TransactionReviewModalState.success) && (
            <SubmissionSuccessful
              onClick={onDone}
              success={state === TransactionReviewModalState.success}
            />
          )}
          {state === TransactionReviewModalState.submit && (
            <Review onSubmitWithSuccess={onSubmitWithSuccess} tx={tx} />
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

const BottomMessage = () => {
  const { styles } = useColorStyles()
  return (
    <Text
      align='center'
      color={styles.text3}
      fontSize='sm'
      fontWeight='500'
      mt='8px'
      mb='16px'
    >
      Submitting will open your currently connected wallet to confirm and sign
      the transaction.
    </Text>
  )
}

const ContractSection = ({
  contractAddress,
  explorerUrl,
}: {
  contractAddress: string
  explorerUrl: string
}) => {
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
        Contract
      </Text>
      <Spacer />
      <Link
        href={explorerUrl}
        isExternal
        style={{ textDecoration: 'underline' }}
      >
        {`${contractAddress.substring(0, 8)}...`}
      </Link>
    </Flex>
  )
}

type ReviewProps = {
  onSubmitWithSuccess: (success: boolean) => void
  tx: TransactionReview
}

const Review = (props: ReviewProps) => {
  const { onSubmitWithSuccess, tx } = props
  const { simulateTrade } = useSimulateQuote(tx.quoteResult)
  const { executeTrade, isTransacting } = useTrade(tx)

  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [override, setOverride] = useState(false)
  const [simulationState, setSimulationState] =
    useState<TransactionReviewSimulationState>(
      TransactionReviewSimulationState.default
    )

  useEffect(() => {
    setSimulationState(TransactionReviewSimulationState.default)
  }, [props.tx])

  useEffect(() => {
    if (simulationState === TransactionReviewSimulationState.loading) {
      setIsButtonDisabled(true)
      return
    }

    if (
      !override &&
      simulationState === TransactionReviewSimulationState.failure
    ) {
      setIsButtonDisabled(true)
      return
    }

    setIsButtonDisabled(false)
  }, [override, simulationState])

  useEffect(() => {
    setIsLoading(isTransacting)
  }, [isTransacting])

  const onChangeOverride = (isChecked: boolean) => {
    setOverride(isChecked)
  }

  const onSubmit = async () => {
    setSimulationState(TransactionReviewSimulationState.loading)
    const isSuccess = await simulateTrade()
    const state = isSuccess
      ? TransactionReviewSimulationState.success
      : TransactionReviewSimulationState.failure
    setSimulationState(state)
    console.log('isSuccess', isSuccess)
    if (!isSuccess && !override) return
    const success = await executeTrade(override)
    if (success === null) return
    onSubmitWithSuccess(success)
  }

  const contractBlockExplorerUrl = getBlockExplorerContractUrl(
    tx.contractAddress,
    tx.chainId
  )

  const decimals = 10
  const formattedInputTokenAmount =
    displayFromWei(tx.inputTokenAmount, decimals, tx.inputToken.decimals) ?? ''
  const formattedOutputTokenAmount =
    displayFromWei(tx.outputTokenAmount, decimals, tx.outputToken.decimals) ??
    ''

  const shouldShowOverride =
    simulationState === TransactionReviewSimulationState.failure

  return (
    <Flex direction='column' h='100%' w='100%'>
      <Flex>
        <Flex align='center' direction='column' w='100%'>
          <Flex my='4px'>
            <NetworkBadge />
          </Flex>
          <FromTo
            inputToken={tx.inputToken.image}
            inputTokenAmount={formattedInputTokenAmount}
            inputTokenSymbol={tx.inputToken.symbol}
            outputToken={tx.outputToken.image}
            outputTokenAmount={formattedOutputTokenAmount}
            outputTokenSymbol={tx.outputToken.symbol}
          />
        </Flex>
      </Flex>
      <Box my='8px'>
        <Box mb='8px'>
          <ContractSection
            contractAddress={tx.contractAddress}
            explorerUrl={contractBlockExplorerUrl}
          />
        </Box>
        <TransactionReviewSimulation state={simulationState} />
      </Box>
      {shouldShowOverride ? (
        <Box my='8px'>
          <Override onChange={onChangeOverride} />
        </Box>
      ) : (
        <BottomMessage />
      )}
      <TradeButton
        isDisabled={isButtonDisabled}
        isLoading={isLoading}
        label={'Submit Transaction'}
        onClick={onSubmit}
      />
    </Flex>
  )
}

interface SubmissionSuccessfulProps {
  onClick: () => void
  success: boolean
}

const SubmissionSuccessful = ({
  onClick,
  success,
}: SubmissionSuccessfulProps) => {
  return (
    <Flex align='center' direction={'column'}>
      <Flex align='center' direction={'column'} p='16px'>
        {success ? (
          <CheckCircleIcon w='32px' h='32px' />
        ) : (
          <WarningIcon w='32px' h='32px' />
        )}
        <Text align='center' fontSize='3xl' p='16px'>
          {success
            ? 'You successfully submitted the transaction.'
            : 'Submitting the transaction was cancelled or failed.'}
        </Text>
      </Flex>
      <Spacer />
      <TradeButton
        isDisabled={false}
        isLoading={false}
        label={'Done'}
        onClick={onClick}
      />
    </Flex>
  )
}
