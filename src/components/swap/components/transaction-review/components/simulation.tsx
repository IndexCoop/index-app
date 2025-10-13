import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/20/solid'
import clsx from 'clsx'

import { Spinner } from '@/components/spinner'

export enum TransactionReviewSimulationState {
  default,
  loading,
  failure,
  success,
}

type TransactionReviewSimulationProps = {
  state: TransactionReviewSimulationState
}

export const TransactionReviewSimulation = ({
  state,
}: TransactionReviewSimulationProps) => {
  const isLoading = state === TransactionReviewSimulationState.loading
  const isSuccess = state === TransactionReviewSimulationState.success
  const showDefault =
    state === TransactionReviewSimulationState.default ||
    state === TransactionReviewSimulationState.loading
  return showDefault ? (
    <SimulationDefaultView isLoading={isLoading} />
  ) : (
    <SimulationStateView success={isSuccess} />
  )
}

const SimulationDefaultView = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <div className='border-ic-gray-100 text-ic-black dark:text-ic-gray-300 flex w-full flex-row  justify-between rounded-2xl border p-4 dark:border-[#3A6060]'>
      <span className='text-lg font-medium'>Transaction simulation</span>
      {isLoading ? <Spinner /> : <span>Auto</span>}
    </div>
  )
}

const SimulationStateView = ({ success }: { success: boolean }) => {
  const title = success ? 'Success' : 'Failed'
  const text = success
    ? 'The transaction was successfully simulated.'
    : 'The transaction simulation failed.'
  return (
    <div
      className={clsx(
        'text-ic-black dark:text-ic-white w-full rounded-2xl border p-4',
        success ? 'border-ic-green' : 'border-ic-red',
      )}
    >
      <div className='flex flex-row'>
        <div className='mr-3 flex p-1'>
          {success ? (
            <CheckCircleIcon className='text-ic-green size-4' />
          ) : (
            <ExclamationCircleIcon className='text-ic-red size-4' />
          )}
        </div>
        <div className='flex flex-col'>
          <span className='font-bold'>{title}</span>
          <p>{text}</p>
        </div>
      </div>
    </div>
  )
}
