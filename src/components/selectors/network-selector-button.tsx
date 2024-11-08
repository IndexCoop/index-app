import { ChainData } from '@/constants/chains'
import { useNetwork } from '@/lib/hooks/use-network'
import { cn } from '@/lib/utils/tailwind'
import Image from 'next/image'

type Props = {
  chain: ChainData
  imagePath: { light: `/assets/${string}`; dark: `/assets/${string}` }
  isDark: boolean
  onClick: (chainId: number) => void
}

export function NetworkSelectorButton({
  chain,
  imagePath,
  isDark,
  onClick,
}: Props) {
  const { chainId } = useNetwork()

  const isActive = chainId === chain.chainId
  const path = isDark ? imagePath.dark : imagePath.light

  return (
    <div
      className={cn(
        'h-11 w-11 cursor-pointer rounded-full border p-2 sm:h-14 sm:w-14 sm:p-3.5',
        {
          'border-ic-gray-50 bg-ic-gray-700': isDark && isActive,
          'border-ic-gray-600 bg-ic-gray-950': isDark && !isActive,
          'border-ic-gray-800 bg-[#D1EAEA]': !isDark && isActive,
          'border-ic-gray-500 bg-ic-gray-50': !isDark && !isActive,
        },
      )}
      onClick={() => onClick(chain.chainId)}
    >
      <Image
        src={path}
        alt={`${chain.name} logo`}
        height={56}
        width={56}
        className={cn(!isActive && 'opacity-60')}
      />
    </div>
  )
}
