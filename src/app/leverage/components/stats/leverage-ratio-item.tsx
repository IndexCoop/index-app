import Image from 'next/image'

import { LeverageRatio } from '@/app/leverage/components/stats/leverage-selector-container'
import { MarketNetworkImage } from '@/app/leverage/components/stats/market-network-image'

type Props = {
  item: LeverageRatio
  ratio?: number
  onClick: () => void
}

export function LeverageRatioItem({ item, onClick }: Props) {
  return (
    <div
      className='border-ic-gray-600 hover:bg-ic-gray-900 text-ic-white flex cursor-pointer items-center justify-between border-t px-4 py-3 first:border-t-0'
      onClick={onClick}
    >
      <div className='flex w-24 items-center gap-2'>
        <Image
          src={item.icon}
          alt={`${item.strategy} leverage`}
          height={16}
          width={16}
        />
        <span className='text-ic-white text-xs font-medium'>{item.ratio}</span>
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
