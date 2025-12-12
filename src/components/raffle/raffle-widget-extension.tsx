import { useAtom } from 'jotai'

import { TicketChip } from '@/components/raffle/ticket-chip'
import { withEpoch } from '@/components/raffle/with-epoch'
import { userMetadataAtom } from '@/lib/store/user-metadata-atoms'

import { ReferralChip } from './referral-chip'

interface WidgetExtensionProps {
  isLoading: boolean
  usdAmount: number
  epochTicketPerUsd: number
  epochMaxTicketsPerUser: number
}

export const RaffleWidgetExtension = withEpoch(
  ({
    isLoading,
    usdAmount,
    epochTicketPerUsd,
    epochMaxTicketsPerUser,
  }: WidgetExtensionProps) => {
    const [userMetadata] = useAtom(userMetadataAtom)
    const referrerCode = userMetadata?.referrerCode

    if (usdAmount === 0 || epochTicketPerUsd === 0) {
      return null
    }

    const tickets = Math.min(
      Math.floor(usdAmount / epochTicketPerUsd),
      epochMaxTicketsPerUser,
    )
    return (
      <div className='flex flex-col gap-2 rounded-lg border border-[#496C72] bg-[#1A2B2F] px-4 py-3'>
        <div className='flex justify-between'>
          <p className='text-ic-gray-300 text-sm font-semibold'>Receive</p>
          <TicketChip isLoading={isLoading} tickets={tickets} />
        </div>
        <div>
          <p className='text-ic-gray-400 text-xs'>
            {'Tickets are awarded after holding your position for >24 hours.'}
          </p>
        </div>
        {referrerCode && (
          <div className='flex items-center gap-3'>
            <ReferralChip className='flex shrink-0 py-1' />
            <p className='text-ic-gray-400 text-xs'>
              Referees get double tickets on their first qualifying transaction.
            </p>
          </div>
        )}
      </div>
    )
  },
)
