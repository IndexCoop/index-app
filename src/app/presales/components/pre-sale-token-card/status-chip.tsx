import { CheckIcon, XMarkIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'

import { presaleChipLabels } from '../../constants'
import { PreSaleStatus } from '../../types'

type Props = {
  status: PreSaleStatus
}

export function StatusChip({ status }: Props) {
  return (
    <div
      className={clsx('flex rounded-[19px] px-4 py-2 text-xs font-medium', {
        'bg-[#EBF2EE] text-[#0DA942]': status === PreSaleStatus.ACTIVE,
        'text-ic-gray-600 bg-ic-gray-200': status === PreSaleStatus.NOT_STARTED,
        'bg-[#EBF2F2] text-[#008F92]':
          status === PreSaleStatus.CLOSED_TARGET_MET ||
          status === PreSaleStatus.TOKEN_LAUNCHED,
        'text-ic-gray-400 bg-[#EEEEEE]':
          status === PreSaleStatus.CLOSED_TARGET_NOT_MET,
      })}
    >
      <div
        className={clsx(
          'mr-2 h-2.5 w-2.5 flex-shrink-0 self-center rounded-full',
          {
            'bg-[#04E55E]': status === PreSaleStatus.ACTIVE,
            'bg-ic-gray-400': status === PreSaleStatus.NOT_STARTED,
            'bg-[#00BDC0]':
              status === PreSaleStatus.CLOSED_TARGET_MET ||
              status === PreSaleStatus.TOKEN_LAUNCHED,
            'bg-[#A6B4B4]': status === PreSaleStatus.CLOSED_TARGET_NOT_MET,
          },
        )}
      >
        {(status === PreSaleStatus.CLOSED_TARGET_MET ||
          status === PreSaleStatus.TOKEN_LAUNCHED) && (
          <CheckIcon className='fill-ic-white h-2.5 w-2.5 p-[1px]' />
        )}
        {status === PreSaleStatus.CLOSED_TARGET_NOT_MET && (
          <XMarkIcon className='fill-ic-white h-2.5 w-2.5 p-[1px]' />
        )}
      </div>
      {presaleChipLabels[status]}
    </div>
  )
}
