import { XMarkIcon } from '@heroicons/react/16/solid'
import { ListedToken } from '@nsorcell/exp-tokenlist'
import Image from 'next/image'

export type WidgetHeaderTokenData = Pick<ListedToken, 'logoURI' | 'symbol'>

type Props = {
  tokenData: WidgetHeaderTokenData
  onClose: () => void
}

export function WidgetHeader({ tokenData, onClose }: Props) {
  return (
    <div className='flex flex-1 text-base font-bold'>
      <div className='my-auto mr-2 overflow-hidden rounded-full'>
        <Image
          src={tokenData.logoURI}
          alt={`${tokenData.symbol} logo`}
          height={28}
          width={28}
        />
      </div>
      <div className='flex-1 self-center'>{`${tokenData.symbol} PRTs`}</div>
      <button type='button' onClick={onClose}>
        <XMarkIcon className='text-ic-gray-600 size-4' aria-hidden='true' />
      </button>
    </div>
  )
}
