import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/20/solid'

import { TradeButton } from '@/components/trade-button'

interface SubmissionSuccessfulProps {
  success: boolean
  onClick: () => void
}

export function SubmissionResult({
  onClick,
  success,
}: SubmissionSuccessfulProps) {
  return (
    <div className='flex flex-col items-center'>
      <div className='flex flex-col items-center p-4'>
        {success ? (
          <CheckCircleIcon className='dark:text-ic-white text-ic-black size-6' />
        ) : (
          <ExclamationCircleIcon className='dark:text-ic-white text-ic-black size-6' />
        )}
        <div className='text-ic-black dark:text-ic-white p-4 text-center text-xl'>
          {success
            ? 'You successfully submitted the transaction.'
            : 'Submitting the transaction was cancelled or failed.'}
        </div>
      </div>
      <TradeButton
        isDisabled={false}
        isLoading={false}
        label={'Done'}
        onClick={onClick}
      />
    </div>
  )
}
