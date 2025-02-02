import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { LeverageRatio } from '@/app/leverage/components/stats/leverage-selector-container'
import { MarketNetworkImage } from '@/app/leverage/components/stats/market-network-image'
import { cn } from '@/lib/utils/tailwind'

type Props = {
  item: LeverageRatio
  ratio?: number
  path: string | null
}

export function LeverageRatioItem({ item, path }: Props) {
  const router = useRouter()

  const handleClick = () => {
    if (!path) return
    close()
    router.replace(path)
  }

  return (
    <div
      className={cn(
        'border-ic-gray-600 text-ic-white flex items-center justify-between border-t px-4 py-3 first:border-t-0',
        path ? 'hover:bg-ic-gray-900 cursor-pointer' : 'cursor-auto opacity-50',
      )}
      onClick={handleClick}
    >
      <div className='flex w-24 items-center gap-2'>
        <Image
          src={item.icon}
          alt={`${item.strategy} leverage`}
          height={16}
          width={16}
        />
        <span className='text-ic-white text-xs font-medium'>
          {item.strategy}
        </span>
      </div>
      <span className='flex w-24 space-x-1'>
        {item.networks.map((chain) => (
          <MarketNetworkImage key={chain.id} chain={chain} />
        ))}
      </span>
      <span className='text-ic-white w-24 text-right text-xs font-medium'>
        {item.ratio ? `${item.ratio.toFixed(2)}x` : ''}
      </span>
    </div>
  )
}
