import { Button } from '@headlessui/react'
import Image from 'next/image'

interface TicketChipProps {
  isLoading: boolean
  tickets?: number
  maturing?: number
}

const LoadingDots = () => (
  <span className='inline-flex gap-[1px]'>
    <span className='animate-[pulse_1.4s_ease-in-out_infinite]'>.</span>
    <span className='animate-[pulse_1.4s_ease-in-out_0.2s_infinite]'>.</span>
    <span className='animate-[pulse_1.4s_ease-in-out_0.4s_infinite]'>.</span>
  </span>
)

export const TicketChip = ({
  isLoading,
  tickets = 0,
  maturing = 0,
}: TicketChipProps) => {
  return (
    <Button
      as='a'
      href='https://indexcoop.com/trading-raffle'
      target='_blank'
      className='flex cursor-pointer items-center gap-1 rounded-2xl border border-[#496C72] bg-[#1A2B2F] px-2 py-1 shadow-[0_0_8.4px_0_rgba(255,255,255,0.29)] sm:px-3 sm:py-1.5'
    >
      <Image
        src='/assets/ticket-icon.png'
        alt='Ticket'
        width={20}
        height={16}
        className='h-4 w-5'
      />
      <span className='text-ic-blue-100 text-xs font-bold'>
        {isLoading ? <LoadingDots /> : tickets}
        <span className='hidden sm:inline'> Tickets</span>
      </span>
      {maturing !== undefined && maturing > 0 && (
        <span className='text-ic-gray-500 hidden text-xs sm:inline'>
          • {maturing} Maturing
        </span>
      )}
    </Button>
  )
}
