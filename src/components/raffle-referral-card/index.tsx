'use client'

import { CheckIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { useState } from 'react'

import { QUERY_PARAM_REFERRAL } from '@/constants'
import { useWallet } from '@/lib/hooks/use-wallet'

export function RaffleReferralCard() {
  const { address } = useWallet()
  const [copied, setCopied] = useState(false)

  // Don't show component if user is not connected
  if (!address) return null

  const referralLink = `${window.location.origin}?${QUERY_PARAM_REFERRAL}=${address}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleShare = () => {
    // Twitter share functionality
    const linkWithoutProtocol = referralLink.replace(/^https?:\/\//, '')
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`I'm participating in @indexcoop Leverage RUSH\n\nJoin the campaign with my code:\n${linkWithoutProtocol}`)}`
    window.open(twitterUrl, '_blank')
  }

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
