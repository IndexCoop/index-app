'use client'

import { CheckIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/tooltip'
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
          <Tooltip placement='bottom'>
            <TooltipTrigger asChild>
              <span className='cursor-help underline decoration-dotted underline-offset-4'>
                climb the leaderboard
              </span>
            </TooltipTrigger>
            <TooltipContent className='bg-ic-gray-900 border-ic-gray-700 max-w-xs rounded-lg border p-4 text-left shadow-lg'>
              <div className='space-y-4'>
                <div>
                  <h3 className='text-ic-gray-50 mb-2 text-sm font-bold'>
                    Referrer
                  </h3>
                  <ul className='text-ic-gray-300 space-y-1 text-xs'>
                    <li className='flex gap-2'>
                      <span className='mt-1 shrink-0'>•</span>
                      <span>
                        +1 extra ticket on every referee&apos;s first qualifying
                        trade
                      </span>
                    </li>
                    <li className='flex gap-2'>
                      <span className='mt-1 shrink-0'>•</span>
                      <span>
                        Earn 50% of tickets your referees generate, up to an
                        extra 25 tickets per epoch.
                      </span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className='text-ic-gray-50 mb-2 text-sm font-bold'>
                    Referee
                  </h3>
                  <ul className='text-ic-gray-300 space-y-1 text-xs'>
                    <li className='flex gap-2'>
                      <span className='mt-1 shrink-0'>•</span>
                      <span>
                        Gets double tickets on their first qualifying
                        transaction
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
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
