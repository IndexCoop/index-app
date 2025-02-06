'use client'

import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { arbitrum, Chain } from 'viem/chains'

import { getLabelForLeverageType } from '@/app/leverage/components/leverage-widget/components/leverage-selector'
import { LeverageRatioItem } from '@/app/leverage/components/stats/leverage-ratio-item'
import { LeverageSelector } from '@/app/leverage/components/stats/leverage-selector'
import { useQuickStats } from '@/app/leverage/components/stats/use-quick-stats'
import { getPathForRatio, ratios } from '@/app/leverage/constants'
import { useLeverageToken } from '@/app/leverage/provider'
import { LeverageType } from '@/app/leverage/types'
import { formatPercentage } from '@/app/products/utils/formatters'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/tooltip'
import { useNetwork } from '@/lib/hooks/use-network'
import { useWallet } from '@/lib/hooks/use-wallet'

import { StatsMetric } from './stats-metric'

export type LeverageRatio = {
  icon: string
  strategy: string
  markets: string[]
  networks: Chain[]
  ratio?: number
}

type LeverageRatioResponse = {
  ratio: number
  strategy: string
}

export function LeverageSelectorContainer() {
  const { chainId } = useNetwork()
  const { isConnected } = useWallet()
  const { indexToken, leverageType, market } = useLeverageToken()
  const {
    data: { token },
    isFetchingQuickStats,
  } = useQuickStats(market, indexToken)

  const { data } = useQuery({
    enabled: typeof chainId === 'number',
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    queryKey: ['leverage-ratio', market, chainId],
    queryFn: async () => {
      const res = await fetch(
        `/api/leverage/ratios?${new URLSearchParams({ chainId: isConnected ? chainId!.toString() : arbitrum.id.toString(), market })}`,
      )
      const json = await res.json()
      return json
    },
  })

  const netRate = useMemo(() => {
    return (token.costOfCarry + token.streamingFee) / 365
  }, [token])

  const currentRatio = useMemo(() => {
    const strategyLabel = getLabelForLeverageType(leverageType)
    const item = data?.find(
      (item: LeverageRatioResponse) => item.strategy === strategyLabel,
    )
    return item?.ratio
  }, [data, leverageType])

  const filteredRatios = useMemo(() => {
    return ratios.filter((ratio) => {
      return ratio.markets.some((ratioMarket) => ratioMarket === market)
    })
  }, [market])

  return (
    <div className='border-ic-black xs:justify-start flex h-full items-center gap-8 border-l px-6 py-0 xl:w-1/2'>
      <Popover className='flex'>
        <PopoverButton className='data-[active]:text-ic-gray-950 data-[active]:dark:text-ic-white data-[hover]:text-ic-gray-700 data-[hover]:dark:text-ic-gray-100 text-ic-gray-500 dark:text-ic-gray-300 focus:outline-none data-[focus]:outline-1'>
          <LeverageSelector
            leverage={getLabelForLeverageType(leverageType)}
            leverageType={
              leverageType === LeverageType.Short ? 'Short' : 'Long'
            }
            ratio={currentRatio}
          />
        </PopoverButton>
        <PopoverPanel
          transition
          anchor='bottom'
          className='bg-ic-gray-950 z-10 ml-4 mt-4 rounded-lg shadow-[4px_4px_8px_0px_rgba(0,_0,_0,_0.60)] transition duration-200 ease-in-out data-[closed]:-translate-y-1 data-[closed]:opacity-0'
        >
          {({ close }) => (
            <div className='w-full min-w-36 max-w-xl'>
              <div className='text-ic-gray-400 space-between mt-2 flex px-4 py-1 text-[11px]'>
                <span className='w-24'>Strategy</span>
                <span className='w-24'>Networks</span>
                <span className='w-24 text-right'>Current Leverage</span>
              </div>
              <div className='w-full bg-[#1A2A2B]'>
                {filteredRatios.map((item) => {
                  const path = getPathForRatio(
                    item.strategy,
                    isConnected,
                    chainId,
                  )

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
            className='hidden w-16 md:flex'
            isLoading={isFetchingQuickStats}
            overrideValueClassName={
              netRate && !isFetchingQuickStats
                ? 'border-b border-ic-gray-200 border-dashed w-fit cursor-default mx-auto'
                : undefined
            }
            label='Net Rate'
            value={formatPercentage(netRate, true, 3)}
          />
        </TooltipTrigger>
        <TooltipContent className='bg-ic-white mt-2 w-60 rounded px-5 py-2 text-xs font-medium drop-shadow'>
          {
            <div className='flex flex-col'>
              <div className='flex border-b border-[#CDDFDF] py-2'>
                <div className='text-ic-gray-600'>Net Rate</div>
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
                  {`${formatPercentage(token.costOfCarry / 365, true, 3)} / day`}
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
