import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { MarketNetworkImage } from '@/app/leverage/components/stats/market-network-image'
import { formatStatsAmount } from '@/app/leverage/components/stats/use-quick-stats'
import { getPathForMarket } from '@/app/leverage/constants'
import { useLeverageToken } from '@/app/leverage/provider'
import { Market } from '@/app/leverage/types'
import { formatPercentage } from '@/app/products/utils/formatters'
import { useAnalytics } from '@/lib/hooks/use-analytics'
import { useNetwork } from '@/lib/hooks/use-network'
import { cn } from '@/lib/utils/tailwind'

function MarketSelectorItem({
  item,
  onClick,
}: {
  item: Market
  onClick: () => void
}) {
  return (
    <div
      className='border-ic-gray-600 text-ic-white hover:bg-ic-gray-900 hover:text-ic-blue-200 flex cursor-pointer items-center justify-between border-t px-4 py-3 text-xs font-medium transition duration-150 first:border-t-0'
      onClick={onClick}
    >
      <div className='flex'>
        <div className='flex w-28 items-center space-x-2'>
          <Image
            src={item.icon}
            alt={item.market}
            height={20}
            width={20}
            priority
            className='flex-none'
          />
          <span>{item.market}</span>
        </div>
        <span className='flex w-24 space-x-1'>
          {item.networks.map((chain) => (
            <MarketNetworkImage key={chain.id} chain={chain} />
          ))}
        </span>
        <span className='text-ic-white w-20 text-right'>
          {formatStatsAmount(item.price, item.currency)}
        </span>
        <span
          className={cn(
            'hidden w-20 text-right md:block',
            item.change24h >= 0 ? 'text-[#65D993]' : 'text-[#F36060]',
          )}
        >
          {formatPercentage(item.change24h / 100)}
        </span>
      </div>
    </div>
  )
}

export function MarketSelector({ marketData }: { marketData: Market[] }) {
  const router = useRouter()
  const { chainId } = useNetwork()
  const { market } = useLeverageToken()
  const { logEvent } = useAnalytics()

  return (
    <Popover className='flex'>
      <PopoverButton className='data-[active]:text-ic-gray-950 data-[active]:dark:text-ic-blue-200 data-[hover]:text-ic-gray-700 data-[hover]:dark:text-ic-blue-200 text-ic-gray-500 dark:text-ic-white flex items-center gap-1 transition duration-150 focus:outline-none data-[focus]:outline-1'>
        <div className='flex flex-col gap-y-1'>
          <p className='pl-1 text-left text-xs text-neutral-400'>
            Select Market
          </p>
          <div className='flex items-center gap-1 rounded-3xl bg-zinc-700 py-2 pl-4 pr-3 text-white'>
            <div className='text-sm font-semibold'>{market}</div>
            <ChevronDownIcon className='size-5' />
          </div>
        </div>
      </PopoverButton>
      <PopoverPanel
        transition
        anchor='bottom'
        className='bg-ic-gray-950 z-10 ml-4 mt-4 rounded-lg shadow-[4px_4px_8px_0px_rgba(0,_0,_0,_0.60)] transition duration-200 ease-in-out data-[closed]:-translate-y-1 data-[closed]:opacity-0'
      >
        {({ close }) => (
          <div className='w-full min-w-36 max-w-xl'>
            <div className='text-ic-gray-400 space-between mt-2 flex px-4 py-1 text-[11px]'>
              <span className='w-28'>Market</span>
              <span className='w-24'>Networks</span>
              <span className='w-20 text-right'>Price</span>
              <span className='hidden w-20 text-right md:block'>24h</span>
            </div>
            <div className='w-full bg-[#1A2A2B]'>
              {marketData.map((item) => (
                <MarketSelectorItem
                  key={item.market}
                  item={item}
                  onClick={() => {
                    const path = getPathForMarket(item.market, chainId)
                    close()
                    if (!path) return

                    logEvent('Market Selected', {
                      market: item.market,
                    })

                    router.replace(path)
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </PopoverPanel>
    </Popover>
  )
}
