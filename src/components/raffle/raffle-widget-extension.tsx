import { TicketChip } from '@/components/raffle/ticket-chip'

export interface WidgetExtensionProps {
  isLoading: boolean
  usdAmount: number
  epochTicketPerUsd: number
}

export const RaffleWidgetExtension = ({
  isLoading,
  usdAmount,
  epochTicketPerUsd,
}: WidgetExtensionProps) => {
  if (usdAmount === 0 || epochTicketPerUsd === 0) {
    return null
  }

  const tickets = Math.floor(usdAmount / epochTicketPerUsd)
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
    </div>
  )
}
