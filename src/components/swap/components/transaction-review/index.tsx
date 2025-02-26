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

import { TradeButton } from '@/components/trade-button'
import { ExclamationCircleIcon } from '@heroicons/react/20/solid'
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
  onClose: () => void
}

export const TransactionReviewModal = (props: TransactionReviewModalProps) => {
  const { isOpen, onClose, transactionReview } = props
  const isDarkMode = props.isDarkMode === true

  const [state, setState] = useState<TransactionReviewModalState>(
    TransactionReviewModalState.submit,
  )

  const onCloseModal = () => {
    // Make sure to reset state, so that reopening popup doesn't show wrong state
    setState(TransactionReviewModalState.submit)
    onClose()
  }

  const onSubmitWithSuccess = (success: boolean) => {
    const modalState = success
      ? TransactionReviewModalState.success
      : TransactionReviewModalState.failed
    setState(modalState)
  }

  const modalTitle =
    state === TransactionReviewModalState.submit ? 'Review Transaction' : ''

  console.log(modalTitle, state)

  return (
    <Modal onClose={onCloseModal} isOpen={isOpen} isCentered>
      <ModalOverlay className='bg-ic-black bg-opacity-60 backdrop-blur' />
      <ModalContent
        backgroundColor={isDarkMode ? '#1C2C2E' : '#FCFFFF'}
        className={clsx(
          'border-ic-gray-100  mx-4 my-0 rounded-xl',
          isDarkMode ? 'review' : '',
        )}
      >
        {modalTitle && (
          <ModalHeader className={clsx(isDarkMode ? 'dark' : '')}>
            <span className='text-ic-black dark:text-ic-white'>
              {modalTitle}
            </span>
          </ModalHeader>
        )}

        <ModalCloseButton
          color={isDarkMode ? colors.ic.white : colors.ic.black}
        />
        <ModalBody
          className={clsx(isDarkMode ? 'dark' : '')}
          p='0 16px 16px 16px'
        >
          {state === TransactionReviewModalState.success && (
            <SubmissionResult onClose={onCloseModal} />
          )}

          {state === TransactionReviewModalState.failed && (
            <div className='flex flex-col items-center'>
              <div className='flex flex-col items-center p-4'>
                <ExclamationCircleIcon className='dark:text-ic-white text-ic-black size-7' />
                <div className='text-ic-black dark:text-ic-white p-4 text-center text-xl'>
                  'Submitting the transaction was cancelled or failed.'
                </div>
              </div>
              <TradeButton
                isDisabled={false}
                isLoading={false}
                label={'Done'}
                onClick={onClose}
              />
            </div>
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
