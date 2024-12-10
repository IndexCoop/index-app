import { ChevronDownIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'

type TokenSelectorProps = {
  selectedToken: { image: string; symbol: string }
  onClick: () => void
}

export function TokenSelector({ selectedToken, onClick }: TokenSelectorProps) {
  const { image, symbol } = selectedToken
  return (
    <div
      className='flex cursor-pointer flex-row items-center'
      onClick={onClick}
    >
      <Image
        alt={`${symbol} logo`}
        src={image}
        width={24}
        height={24}
        priority
      />
      <span className='text-ic-black dark:text-ic-white ml-2 text-base font-bold'>
        {symbol}
      </span>
      <ChevronDownIcon className='dark:text-ic-white text-ic-black size-5' />
    </div>
  )
}
