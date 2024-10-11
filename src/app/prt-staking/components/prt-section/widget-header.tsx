import { XMarkIcon } from '@heroicons/react/16/solid'
import Image from 'next/image'

type Props = {
  tokenData: { logoURI: string; symbol: string }
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
