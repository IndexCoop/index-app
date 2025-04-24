import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react'
import { useAtom } from 'jotai'

import { tradeMachineAtom } from '@/app/store/trade-machine'
import { cn } from '@/lib/utils/tailwind'

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
    <Dialog
      onClose={onCloseModal}
      open={tradeState.context.isModalOpen}
      className='relative z-50'
    >
      <DialogBackdrop className='fixed inset-0 bg-black/30' />
      <div className='fixed inset-0 flex w-screen items-center justify-center p-4'>
        <DialogPanel
          className={cn(
            'bg-ic-white mx-4 my-0 rounded-3xl border border-zinc-700 dark:bg-[#18181b]',
            isDarkMode ? 'review' : '',
          )}
        >
          {modalTitle && (
            <DialogTitle className={cn(isDarkMode ? 'dark' : '')}>
              <span className='text-ic-black dark:text-neutral-50'>
                {modalTitle}
              </span>
            </DialogTitle>
          )}

          <div className={cn('px-4 pb-4', isDarkMode ? 'dark' : '')}>
            <SubmissionResult onClose={onCloseModal} />

            {tradeState.context.transactionReview &&
              tradeState.matches('review') && (
                <Review
                  transactionReview={tradeState.context.transactionReview}
                  onSubmitWithSuccess={() => sendTradeEvent({ type: 'SUBMIT' })}
                />
              )}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
