'use client'

import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { base } from 'viem/chains'

import { getLabelForLeverageType } from '@/app/leverage/components/leverage-widget/components/leverage-selector'
import { LeverageRatioItem } from '@/app/leverage/components/stats/leverage-ratio-item'
import { useQuickStats } from '@/app/leverage/components/stats/use-quick-stats'
import { getPathForRatio, ratios } from '@/app/leverage/constants'
import { useLeverageToken } from '@/app/leverage/provider'
import { type LeverageRatio, LeverageType } from '@/app/leverage/types'
import { formatPercentage } from '@/app/products/utils/formatters'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/tooltip'
import { useNetwork } from '@/lib/hooks/use-network'
import { useWallet } from '@/lib/hooks/use-wallet'

import { StatsMetric } from './stats-metric'

type LeverageRatioResponse = {
  ratio: number
  strategy: string
}

const formatCostOfCarry = (token: { costOfCarry: number }) =>
  (-1 * token.costOfCarry) / 100

export function LeverageSelectorContainer() {
  const { chainId } = useNetwork()
  const { isConnected } = useWallet()
  const { indexToken, leverageType, market } = useLeverageToken()
  const {
    data: { token },
    isFetchingQuickStats,
  } = useQuickStats(market, { ...indexToken, chainId: chainId ?? 1 })

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

  const netRate = useMemo(() => {
    return (formatCostOfCarry(token) + token.streamingFee) / 365
  }, [token])

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
    <div className='border-ic-black xs:justify-start flex h-full items-center gap-8 border-l px-6 py-0 xl:w-1/2'>
      <Popover className='flex w-32'>
        <PopoverButton className='data-[active]:text-ic-gray-950 data-[active]:dark:text-ic-blue-200 data-[hover]:text-ic-gray-700 data-[hover]:dark:text-ic-blue-200 text-ic-gray-500 dark:text-ic-white flex items-center gap-1 transition duration-150 focus:outline-none data-[focus]:outline-1'>
          <div className='flex flex-col gap-y-1'>
            <p className='pl-1 text-left text-xs text-neutral-400'>
              Select Leverage
            </p>
            <div className='flex items-center gap-1 rounded-3xl bg-zinc-700 py-2 pl-4 pr-3 text-white'>
              <div className='text-sm font-semibold'>{`${getLabelForLeverageType(leverageType)} ${leverageType === LeverageType.Short ? 'Short' : 'Long'}`}</div>
              <ChevronDownIcon className='size-5' />
            </div>
          </div>
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
                    (d: LeverageRatioResponse) => d.strategy === item.strategy,
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
      <Tooltip placement='bottom'>
        <TooltipTrigger>
          <StatsMetric
            className='hidden w-24 md:flex'
            isLoading={isFetchingQuickStats}
            overrideValueClassName={
              netRate && !isFetchingQuickStats
                ? 'border-b border-ic-gray-200 border-dashed w-fit cursor-default mx-auto'
                : undefined
            }
            label='Net Rate Daily'
            value={formatPercentage(netRate, true, 3)}
          />
        </TooltipTrigger>
        <TooltipContent className='bg-ic-white mt-2 w-60 rounded px-5 py-2 text-xs font-medium drop-shadow'>
          {
            <div className='flex flex-col'>
              <div className='flex border-b border-[#CDDFDF] py-2'>
                <div className='text-ic-gray-600'>Net Rate Daily</div>
                <div className='text-ic-gray-900 ml-auto'>
                  {`${formatPercentage(netRate, true, 3)} / day`}
                </div>
              </div>
              <div className='flex py-2'>
                <div className='text-ic-gray-600'>Streaming Fee</div>
                <div className='text-ic-gray-900 ml-auto'>
                  {`${formatPercentage(token.streamingFee / 365, true, 3)} / day`}
                </div>
              </div>
              <div className='flex py-2'>
                <div className='text-ic-gray-600'>Cost of Carry</div>
                <div className='text-ic-gray-900 ml-auto'>
                  {`${formatPercentage(formatCostOfCarry(token) / 365, true, 3)} / day`}
                </div>
              </div>
              <p className='text-ic-gray-700 text-left text-[10px] font-normal leading-tight'>
                This is a dynamic cost incurred from borrowing on a lending
                market, which can be positive or negative.
              </p>
            </div>
          }
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
