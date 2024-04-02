import { useState } from 'react'

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

import { useColorStyles } from '@/lib/styles/colors'

import { TradeButton } from '@/components/trade-button'

import { formatQuoteAnalytics, useAnalytics } from '@/lib/hooks/use-analytics'
import { FromTo } from './components/from-to'
import { Override } from './components/override'
import { NetworkBadge } from './components/network-badge'
import { TransactionReviewSimulation } from './components/simulation'
import { SubmissionResult } from './components/submission-result'
import { useTransactionReview } from './provider'
import { TransactionReview } from './types'

enum TransactionReviewModalState {
  failed,
  submit,
  success,
}

type TransactionReviewModalProps = {
  isOpen: boolean
  transactionReview: TransactionReview
  onClose: () => void
}

export const TransactionReviewModal = (props: TransactionReviewModalProps) => {
  const { styles } = useColorStyles()
  const { isOpen, onClose, transactionReview } = props
  const backgroundColor = styles.background

  const [state, setState] = useState<TransactionReviewModalState>(
    TransactionReviewModalState.submit,
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
    state === TransactionReviewModalState.submit ? 'Review Transaction' : ''

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
            <SubmissionResult
              onClick={onDone}
              success={state === TransactionReviewModalState.success}
            />
          )}
          {state === TransactionReviewModalState.submit && (
            <Review
              onSubmitWithSuccess={onSubmitWithSuccess}
              transactionReview={transactionReview}
            />
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

export type ReviewProps = {
  onSubmitWithSuccess: (success: boolean) => void
  transactionReview: TransactionReview
}

const Review = (props: ReviewProps) => {
  const { transactionReview } = props
  const {
    contractBlockExplorerUrl,
    formattedInputTokenAmount,
    formattedOutputTokenAmount,
    isButtonDisabled,
    isLoading,
    shouldShowOverride,
    simulationState,
    onChangeOverride,
    onSubmit,
  } = useTransactionReview(props)
  return (
    <div className='flex h-full w-full flex-col'>
      <div className='flex w-full flex-col items-center'>
        <div className='my-1 flex'>
          <NetworkBadge />
        </div>
        <FromTo
          inputToken={transactionReview.inputToken.image}
          inputTokenAmount={formattedInputTokenAmount}
          inputTokenSymbol={transactionReview.inputToken.symbol}
          outputToken={transactionReview.outputToken.image}
          outputTokenAmount={formattedOutputTokenAmount}
          outputTokenSymbol={transactionReview.outputToken.symbol}
        />
      </div>
      <Box my='8px'>
        <Box mb='8px'>
          <ContractSection
            contractAddress={transactionReview.contractAddress}
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
    </div>
  )
}
