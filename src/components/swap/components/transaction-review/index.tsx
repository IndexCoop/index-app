import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'
import clsx from 'clsx'
import { useState } from 'react'

import { colors } from '@/lib/styles/colors'

import { Review } from './components/review'
import { SubmissionResult } from './components/submission-result'
import { TransactionReview } from './types'

import './styles.css'

enum TransactionReviewModalState {
  failed,
  submit,
  success,
}

type TransactionReviewModalProps = {
  isDarkMode?: boolean
  isOpen: boolean
  transactionReview: TransactionReview
  showConfirmation?: boolean
  onClose: () => void
}

export const TransactionReviewModal = (props: TransactionReviewModalProps) => {
  const { isOpen, onClose, transactionReview, showConfirmation = true } = props
  const isDarkMode = props.isDarkMode === true

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
      isOpen={
        state === TransactionReviewModalState.submit
          ? isOpen
          : showConfirmation && isOpen
      }
      isCentered
    >
      <ModalOverlay className='bg-ic-black bg-opacity-60 backdrop-blur' />
      <ModalContent
        backgroundColor={isDarkMode ? '#1C2C2E' : '#FCFFFF'}
        className={clsx(
          'border-ic-gray-100  mx-4 my-0 rounded-xl border-[2px]',
          isDarkMode ? 'review' : '',
        )}
      >
        <ModalHeader className={clsx(isDarkMode ? 'dark' : '')}>
          <span className='text-ic-black dark:text-ic-white'>{modalTitle}</span>
        </ModalHeader>
        <ModalCloseButton
          color={isDarkMode ? colors.ic.white : colors.ic.black}
        />
        <ModalBody
          className={clsx(isDarkMode ? 'dark' : '')}
          p='0 16px 16px 16px'
        >
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
