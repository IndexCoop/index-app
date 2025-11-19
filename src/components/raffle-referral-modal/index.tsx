'use client'

import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { CheckIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'

import { useRaffleReferral } from '@/lib/hooks/use-raffle-referral'

type RaffleReferralModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function RaffleReferralModal({
  isOpen,
  onClose,
}: RaffleReferralModalProps) {
  const { hasReferralCode, referralLink, copied, handleCopy, handleShare } =
    useRaffleReferral()

  if (!hasReferralCode) return null

  return (
    <Dialog onClose={onClose} open={isOpen} className='relative z-50'>
      <DialogBackdrop className='bg-ic-black fixed inset-0 bg-opacity-60 backdrop-blur' />
      <div className='fixed inset-0 w-screen overflow-y-auto p-4'>
        <div className='flex min-h-full items-center justify-center'>
          <DialogPanel className='border-ic-gray-500 bg-ic-gray-950 mx-0 my-4 w-full max-w-md overflow-hidden rounded-xl border p-6'>
            <div className='flex flex-col gap-6'>
              <div className='text-center'>
                <h2 className='text-ic-gray-50 mb-3 text-lg font-bold'>
                  Share your link to earn more tickets.
                </h2>
                <p className='text-ic-gray-400 text-xs'>
                  Every referral helps you{' '}
                  <Link
                    href='/leverage/raffle/leaderboard'
                    onClick={onClose}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-ic-gray-300 hover:text-ic-gray-200 underline decoration-dotted underline-offset-4'
                  >
                    climb the leaderboard
                  </Link>
                  .
                </p>
              </div>

              <div className='flex flex-col gap-3'>
                <button
                  onClick={handleCopy}
                  className='border-ic-gray-600 bg-ic-blue-950 flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-2xl border px-4 py-3 transition-opacity hover:opacity-80'
                >
                  <span className='text-ic-gray-400 truncate text-sm'>
                    {referralLink}
                  </span>
                  <div className='shrink-0'>
                    {copied ? (
                      <CheckIcon className='text-ic-gray-500 h-5 w-5' />
                    ) : (
                      <ClipboardDocumentIcon className='text-ic-gray-500 h-5 w-5' />
                    )}
                  </div>
                </button>

                <button
                  onClick={handleShare}
                  className='text-ic-gray-50 flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#09090B] px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-80'
                >
                  <span>Share</span>
                  <Image
                    src='/assets/x-logo.svg'
                    alt='X logo'
                    width={20}
                    height={20}
                  />
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}
