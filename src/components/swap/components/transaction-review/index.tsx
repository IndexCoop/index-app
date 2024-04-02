import { useState } from 'react'

import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react'

import { useColorStyles } from '@/lib/styles/colors'

import { Review } from './components/review'
import { SubmissionResult } from './components/submission-result'
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
