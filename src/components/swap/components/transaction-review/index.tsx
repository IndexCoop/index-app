import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'
import clsx from 'clsx'
import { useAtom } from 'jotai'

import { tradeMachineAtom } from '@/app/store/trade-machine'
import { colors } from '@/lib/styles/colors'

import { Review } from './components/review'
import { SubmissionResult } from './components/submission-result'

type TransactionReviewModalProps = {
  isDarkMode?: boolean
  onClose: () => void
}

export const TransactionReviewModal = (props: TransactionReviewModalProps) => {
  const { onClose } = props
  const isDarkMode = props.isDarkMode === true
  const [tradeState, sendTradeEvent] = useAtom(tradeMachineAtom)

  const onCloseModal = () => {
    sendTradeEvent({ type: 'CLOSE' })
    onClose()
  }

  const modalTitle = tradeState.matches('review') ? 'Review Transaction' : ''

  return (
    <Modal
      onClose={onCloseModal}
      isOpen={tradeState.context.isModalOpen}
      isCentered
    >
      <ModalOverlay className='bg-ic-black bg-opacity-60 backdrop-blur' />
      <ModalContent
        borderRadius={24}
        backgroundColor={isDarkMode ? '#18181b' : '#FCFFFF'}
        className={clsx(
          'mx-4 my-0 border border-zinc-700',
          isDarkMode ? 'review' : '',
        )}
      >
        {modalTitle && (
          <ModalHeader className={clsx(isDarkMode ? 'dark' : '')}>
            <span className='text-ic-black dark:text-neutral-50'>
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
          <SubmissionResult onClose={onCloseModal} />

          {tradeState.context.transactionReview &&
            tradeState.matches('review') && (
              <Review
                transactionReview={tradeState.context.transactionReview}
                onSubmitWithSuccess={() => sendTradeEvent({ type: 'SUBMIT' })}
              />
            )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
