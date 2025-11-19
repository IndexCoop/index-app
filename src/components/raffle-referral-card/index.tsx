'use client'

import { CheckIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

import { useRaffleReferral } from '@/lib/hooks/use-raffle-referral'

export function RaffleReferralCard() {
  const { hasReferralCode, referralLink, copied, handleCopy, handleShare } =
    useRaffleReferral()

  if (!hasReferralCode) return null

  return (
    <div className='border-ic-gray-500 bg-ic-gray-950 flex w-full flex-col gap-6 self-stretch rounded-lg border p-6'>
      <div>
        <h2 className='text-ic-gray-50 mb-3 text-sm font-bold'>
          Share your link to earn more tickets.
        </h2>
        <p className='text-ic-gray-400 text-xs'>
          Every referral helps you{' '}
          <span className='cursor-help underline decoration-dotted underline-offset-4'>
            climb the leaderboard
          </span>
          .
        </p>
      </div>

      <div className='flex gap-3'>
        <button
          onClick={handleCopy}
          className='border-ic-gray-600 bg-ic-blue-950 flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-2xl border px-3 py-2 transition-opacity hover:opacity-80'
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
          className='bg-ic-blue-950 flex shrink-0 items-center justify-center gap-2 rounded-2xl px-4 py-2 transition-opacity hover:opacity-80'
        >
          <span className='text-ic-gray-50 text-sm font-semibold'>Share</span>
          <Image src='/assets/x-logo.svg' alt='X logo' width={20} height={20} />
        </button>
      </div>
    </div>
  )
}
