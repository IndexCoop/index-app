import Image from 'next/image'

import { ChainData } from '@/constants/chains'
import { useNetwork } from '@/lib/hooks/use-network'
import { cn } from '@/lib/utils/tailwind'

type Props = {
  chain: ChainData
  imagePath: { light: `/assets/${string}`; dark: `/assets/${string}` }
  onClick: (chainId: number) => void
}

export function NetworkSelectorButton({ chain, imagePath, onClick }: Props) {
  const { chainId } = useNetwork()
  const isActive = chainId === chain.chainId

  return (
    <div
      className={cn(
        'h-11 w-11 cursor-pointer rounded-full border p-2 sm:h-14 sm:w-14 sm:p-3.5',
        isActive
          ? 'border-ic-gray-800 dark:border-ic-gray-50 dark:bg-ic-gray-700 bg-[#D1EAEA]'
          : 'border-ic-gray-500 bg-ic-gray-50 dark:border-ic-gray-600 dark:bg-zinc-900',
      )}
      onClick={() => onClick(chain.chainId)}
    >
      <Image
        src={imagePath.light}
        alt={`${chain.name} logo`}
        height={56}
        width={56}
        className={cn('block dark:hidden', !isActive && 'opacity-60')}
      />
      <Image
        src={imagePath.dark}
        alt={`${chain.name} logo`}
        height={56}
        width={56}
        className={cn('hidden dark:block', !isActive && 'opacity-60')}
      />
    </div>
  )
}
