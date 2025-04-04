'use client'

import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { base } from 'viem/chains'

import { getLabelForLeverageType } from '@/app/leverage/components/leverage-widget/components/leverage-selector'
import { LeverageRatioItem } from '@/app/leverage/components/stats/leverage-ratio-item'
import { getPathForRatio, ratios } from '@/app/leverage/constants'
import { useLeverageToken } from '@/app/leverage/provider'
import { type LeverageRatio, LeverageType } from '@/app/leverage/types'
import { useNetwork } from '@/lib/hooks/use-network'
import { useWallet } from '@/lib/hooks/use-wallet'

type LeverageRatioResponse = {
  ratio: number
  strategy: string
}

export function LeverageSelectorContainer() {
  const { chainId } = useNetwork()
  const { isConnected } = useWallet()
  const { leverageType, market } = useLeverageToken()

  const { data } = useQuery({
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    queryKey: ['leverage-ratio', market, chainId],
    queryFn: async () => {
      const res = await fetch(
        `/api/leverage/ratios?${new URLSearchParams({ chainId: isConnected ? chainId!.toString() : base.id.toString(), market })}`,
      )
      const json = await res.json()
      return json
    },
  })

  const filteredRatios = useMemo(
    () =>
      ratios.reduce((acc, current) => {
        if (
          current.market === market &&
          !acc.some((item) => item.strategy === current.strategy)
        ) {
          acc.push(current)
        }
        return acc
      }, [] as LeverageRatio[]),
    [market],
  )

  return (
    <div className='xs:justify-start flex h-full items-center gap-8 border-l border-[#364746] px-6 py-0 xl:w-1/2'>
      <div className='flex flex-col'>
        <p className='mb-1 pl-1 text-left text-xs leading-[14px] text-neutral-400'>
          Select Leverage
        </p>
        <Popover className='flex min-w-32'>
          <PopoverButton className='flex items-center gap-1 rounded-3xl bg-zinc-700 py-2 pl-4 pr-3 text-white transition focus:outline-none data-[active]:bg-zinc-600 data-[hover]:bg-zinc-600 data-[focus]:outline-1'>
            <div className='text-sm font-semibold'>{`${getLabelForLeverageType(leverageType)} ${leverageType === LeverageType.Short ? 'Short' : 'Long'}`}</div>
            <ChevronDownIcon className='size-5' />
          </PopoverButton>
          <PopoverPanel
            transition
            anchor='bottom end'
            className='bg-ic-gray-950 z-10 ml-4 mt-4 rounded-lg shadow-[4px_4px_8px_0px_rgba(0,_0,_0,_0.60)] transition duration-200 ease-in-out data-[closed]:-translate-y-1 data-[closed]:opacity-0'
          >
            {({ close }) => (
              <div className='w-full min-w-36 max-w-xl'>
                <div className='text-ic-gray-400 space-between mt-2 flex px-4 py-1 text-[11px]'>
                  <span className='w-24'>Strategy</span>
                  <span className='hidden w-24 md:flex'>Networks</span>
                  <span className='w-24 text-right'>Current Leverage</span>
                </div>
                <div className='w-full bg-[#1A2A2B]'>
                  {filteredRatios.map((item) => {
                    const path = getPathForRatio(item, isConnected, chainId)

                    const ratio = data?.find(
                      (d: LeverageRatioResponse) =>
                        d.strategy === item.strategy,
                    )?.ratio

                    return (
                      <LeverageRatioItem
                        key={item.strategy}
                        closePopover={close}
                        item={item}
                        path={path}
                        ratio={ratio}
                      />
                    )
                  })}
                </div>
              </div>
            )}
          </PopoverPanel>
        </Popover>
      </div>
    </div>
  )
}
