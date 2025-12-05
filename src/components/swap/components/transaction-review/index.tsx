import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'

import { RaffleReferralModal } from '@/components/raffle-referral-modal'
import { tradeMachineAtom } from '@/lib/store/trade-machine'
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
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const onCloseModal = () => {
    sendTradeEvent({ type: 'CLOSE' })
    onClose()
  }

  const onShareReferral = () => {
    setIsReferralModalOpen(true)
    onCloseModal()
  }

  const modalTitle = tradeState.matches('review') ? 'Review Transaction' : ''

  if (!mounted) return null

  return (
    <>
      <Dialog
        onClose={onCloseModal}
        open={tradeState.context.isModalOpen}
        className='relative z-50'
      >
        <DialogBackdrop className='bg-ic-black fixed inset-0 bg-opacity-60 backdrop-blur' />
        <div className='fixed inset-0 flex w-screen items-center justify-center p-4'>
          <DialogPanel
            className={cn(
              'bg-ic-white mx-4 my-0 w-full max-w-md rounded-3xl border border-zinc-700 dark:bg-[#18181b]',
              isDarkMode ? 'review' : '',
            )}
          >
            {modalTitle && (
              <DialogTitle
                className={cn(
                  'text-ic-black px-6 py-4 text-xl font-semibold dark:text-neutral-50',
                  isDarkMode ? 'dark' : '',
                )}
              >
                {modalTitle}
              </DialogTitle>
            )}

            <div className={cn('px-4 pb-4', isDarkMode ? 'dark' : '')}>
              <SubmissionResult
                onClose={onCloseModal}
                onShareReferral={onShareReferral}
              />

              {tradeState.context.transactionReview &&
                tradeState.matches('review') && (
                  <Review
                    transactionReview={tradeState.context.transactionReview}
                    onSubmitWithSuccess={() =>
                      sendTradeEvent({ type: 'SUBMIT' })
                    }
                  />
                )}
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      <RaffleReferralModal
        isOpen={isReferralModalOpen}
        onClose={() => setIsReferralModalOpen(false)}
      />
    </>
  )
}
