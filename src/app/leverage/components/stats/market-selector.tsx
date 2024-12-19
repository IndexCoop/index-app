import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import {
  getDefaultPathForMarket,
  getMarketsForChain,
} from '@/app/leverage/constants'
import { useLeverageToken } from '@/app/leverage/provider'
import { Market } from '@/app/leverage/types'
import { useNetwork } from '@/lib/hooks/use-network'

function MarketSelectorItem({
  item,
  onClick,
}: {
  item: Market
  onClick: () => void
}) {
  // const debtIcon = getTokenByChainAndSymbol(1, 'USDC').logoURI
  return (
    <div
      className='border-ic-gray-600 text-ic-white flex cursor-pointer items-center justify-between border-t px-4 py-3 text-xs font-medium first:border-t-0'
      onClick={onClick}
    >
      <div className='flex items-center gap-2'>
        <Image src={item.icon} alt={item.market} height={20} width={20} />
        <span>{item.market}</span>
      </div>
      {/* <span className='text-right'>{item.priceRatio}</span>
      <Image src={debtIcon} alt={'USDC'} height={14} width={14} />
      <Image src={debtIcon} alt={'USDC'} height={14} width={14} /> */}
    </div>
  )
}

export function MarketSelector() {
  const router = useRouter()
  const { chainId } = useNetwork()
  const { market } = useLeverageToken()
  const markets = getMarketsForChain(chainId ?? 1)
  return (
    <Popover className='flex'>
      <PopoverButton className='data-[active]:text-ic-gray-950 data-[active]:dark:text-ic-white data-[hover]:text-ic-gray-700 data-[hover]:dark:text-ic-gray-100 text-ic-gray-500 dark:text-ic-gray-300 flex items-center gap-1 focus:outline-none data-[focus]:outline-1'>
        <div className='text-ic-white text-sm font-bold sm:text-base'>
          {market}
        </div>
        <ChevronDownIcon className='dark:text-ic-white text-ic-black size-5' />
      </PopoverButton>
      <PopoverPanel
        transition
        anchor='bottom'
        className='z-10 mt-4 rounded-lg transition duration-200 ease-in-out data-[closed]:-translate-y-1 data-[closed]:opacity-0'
      >
        {({ close }) => (
          <div className='w-full min-w-36 max-w-xl'>
            {/* <div className='text-ic-gray-400 space-between flex gap-5 px-5 py-1 text-[11px]'>
            <span>Market</span>
            <span>Price / Ratio</span>
            <span>Collateral</span>
            <span>Debt</span>
          </div> */}
            <div className='w-full rounded-lg bg-[#1A2A2B]'>
              {markets.map((item, index) => (
                <MarketSelectorItem
                  key={index}
                  item={item}
                  onClick={() => {
                    const path = getDefaultPathForMarket(
                      item.market,
                      chainId ?? 1,
                    )
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
