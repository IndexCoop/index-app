import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { MarketNetworkImage } from '@/app/leverage/components/stats/market-network-image'
import { formatStatsAmount } from '@/app/leverage/components/stats/use-quick-stats'
import { getPathForMarket, markets } from '@/app/leverage/constants'
import { useLeverageToken } from '@/app/leverage/provider'
import { Market } from '@/app/leverage/types'
import { formatPercentage } from '@/app/products/utils/formatters'
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
      className='border-ic-gray-600 text-ic-white hover:bg-ic-gray-900 flex cursor-pointer items-center justify-between border-t px-4 py-3 text-xs font-medium first:border-t-0'
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
        <span className='w-20 text-right'>
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

  const marketMetadata = markets.find((item) => item.market === market)

  return (
    <Popover className='flex'>
      <PopoverButton className='data-[active]:text-ic-gray-950 data-[active]:dark:text-ic-white data-[hover]:text-ic-gray-700 data-[hover]:dark:text-ic-gray-100 text-ic-gray-500 dark:text-ic-gray-300 flex items-center gap-1 focus:outline-none data-[focus]:outline-1'>
        <div className='flex flex-col gap-y-1.5'>
          <div className='flex items-center gap-1'>
            {marketMetadata && (
              <Image
                src={marketMetadata.icon}
                alt={marketMetadata.market}
                height={24}
                width={24}
                priority
                className='hidden flex-none sm:flex'
              />
            )}
            <div className='text-ic-white text-sm font-bold sm:text-base'>
              {market}
            </div>
            <ChevronDownIcon className='dark:text-ic-white text-ic-black size-5' />
          </div>
          <div className='hidden sm:flex'>
            <span className='text-ic-gray-300 mr-1 text-xs'>Powered by</span>
            <Image
              src='/assets/powered-by-aave.svg'
              alt='Powered by AAVE'
              height={17}
              width={64}
              priority
              className='flex-none'
            />
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
