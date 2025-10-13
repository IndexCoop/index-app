import { ExclamationCircleIcon } from '@heroicons/react/20/solid'

type WarningProps = {
  lowSlippage: boolean
}

function getTexts(lowSlippage: boolean) {
  if (lowSlippage)
    return 'Transactions below 0.05% slippage may result in a failed transaction.'
  return 'Transactions above 1% slippage may result in an unfavorable trade.'
}

export const Warning = (props: WarningProps) => (
  <div className='flex flex-col'>
    <div className='flex items-center'>
      <ExclamationCircleIcon className='text-ic-yellow size-4' />
      <p className='text-ic-gray-600 ml-1.5 text-base font-medium'>
        Slippage warning
      </p>
    </div>
    <p className='text-ic-gray-600 mt-0.5 text-sm font-normal'>
      {getTexts(props.lowSlippage)}
    </p>
  </div>
)
