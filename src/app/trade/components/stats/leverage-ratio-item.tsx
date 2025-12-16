import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'

import { MarketNetworkImage } from '@/app/trade/components/stats/market-network-image'
import { ratios } from '@/app/trade/constants'
import { LeverageRatio } from '@/app/trade/types'
import { useAnalytics } from '@/lib/hooks/use-analytics'
import { cn } from '@/lib/utils/tailwind'

type Props = {
  closePopover: () => void
  item: LeverageRatio
  ratio?: number
  path: string | null
}

export function LeverageRatioItem({ closePopover, item, path, ratio }: Props) {
  const router = useRouter()
  const { logEvent } = useAnalytics()

  const handleClick = () => {
    if (!path) return

    logEvent('Leverage Ratio Selected', {
      context: 'dropdown',
      strategy: item.strategy,
    })

    router.replace(path)
    closePopover()
  }

  const networks = useMemo(() => {
    const filteredRatios = ratios.filter(
      (r) => r.strategy === item.strategy && r.market === item.market,
    )
    return filteredRatios.map(({ chain }) => chain)
  }, [item.market, item.strategy])

  return (
    <div
      className={cn(
        'border-ic-gray-600 text-ic-white hover:bg-ic-gray-900 flex cursor-pointer items-center justify-between border-t px-4 py-3 transition duration-150 first:border-t-0',
        ratio ? 'hover:text-ic-blue-200' : 'opacity-50',
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
        <span className='text-xs font-medium'>{item.strategy}</span>
      </div>
      <div className='hidden w-24 space-x-1 md:flex'>
        {networks.map((chain) => (
          <MarketNetworkImage key={chain.id} chain={chain} />
        ))}
      </div>
      <span className='text-ic-white w-24 text-right text-xs font-medium'>
        {ratio ? `${ratio.toFixed(2)}x` : ''}
      </span>
    </div>
  )
}
