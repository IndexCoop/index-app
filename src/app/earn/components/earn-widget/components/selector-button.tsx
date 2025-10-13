import { ChevronDownIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'

import { cn } from '@/lib/utils/tailwind'

type SelectorProps = {
  onClick: () => void
  image: string
  symbol: string
  showChevron?: boolean
  visible?: boolean
}

export const SelectorButton = ({
  image,
  symbol,
  onClick,
  showChevron,
  visible = true,
}: SelectorProps) => (
  <div
    className={cn(
      'bg-ic-gray-100 flex h-11 shrink-0 cursor-pointer items-center rounded-[32px] p-2.5',
      visible ? 'visible' : 'invisible',
    )}
    onClick={onClick}
  >
    <Image alt={`${symbol} logo`} src={image} width={20} height={20} />
    <p className='text-ic-black mx-2 text-sm font-medium'>{symbol}</p>
    {showChevron !== false && (
      <ChevronDownIcon className='text-ic-gray-900 size-6' />
    )}
  </div>
)
