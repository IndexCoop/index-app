'use client'

import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { getTokenByChainAndSymbol } from '@indexcoop/tokenlists'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { arbitrum, base, Chain, mainnet } from 'viem/chains'

import { getLabelForLeverageType } from '@/app/leverage/components/leverage-widget/components/leverage-selector'
import { LeverageRatioItem } from '@/app/leverage/components/stats/leverage-ratio-item'
import { LeverageSelector } from '@/app/leverage/components/stats/leverage-selector'
import { useQuickStats } from '@/app/leverage/components/stats/use-quick-stats'
import { getPathForRatio } from '@/app/leverage/constants'
import { useLeverageToken } from '@/app/leverage/provider'
import { LeverageType } from '@/app/leverage/types'
import { formatPercentage } from '@/app/products/utils/formatters'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/tooltip'
import { useNetwork } from '@/lib/hooks/use-network'

import { StatsMetric } from './stats-metric'

export type LeverageRatio = {
  icon: string
  strategy: string
  networks: Chain[]
  ratio?: number
}

const ratios: LeverageRatio[] = [
  {
    icon: getTokenByChainAndSymbol(arbitrum.id, 'ETH2X').logoURI,
    strategy: '2x',
    networks: [arbitrum, base, mainnet],
  },
  {
    icon: getTokenByChainAndSymbol(arbitrum.id, 'ETH3X').logoURI,
    strategy: '3x',
    networks: [arbitrum, base],
  },
  {
    icon: getTokenByChainAndSymbol(arbitrum.id, 'iBTC1X').logoURI,
    strategy: '-1x',
    networks: [arbitrum],
  },
]

type LeverageRatioResponse = {
  ratio: number
  strategy: string
}

export function LeverageSelectorContainer() {
  const { chainId } = useNetwork()
  const { indexToken, leverageType, market } = useLeverageToken()
  const {
    data: { token },
    isFetchingQuickStats,
  } = useQuickStats(market, indexToken)

  const { data } = useQuery({
    enabled: typeof chainId === 'number',
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    initialData: [],
    queryKey: ['leverage-ratio', market, chainId],
    queryFn: async () => {
      const res = await fetch(
        `https://api-pr-41-vgqa.onrender.com/api/v2/leverage-ratios?${new URLSearchParams({ chainId: chainId!.toString(), market }).toString()}`,
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

  return (
    <div className='border-ic-black xs:justify-end flex h-full w-2/3 items-center gap-8 border-l px-8 py-0 md:px-16'>
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
          <div className='w-full min-w-36 max-w-xl'>
            <div className='text-ic-gray-400 space-between mt-2 flex px-4 py-1 text-[11px]'>
              <span className='w-24'>Strategy</span>
              <span className='w-24'>Networks</span>
              <span className='w-24 text-right'>Current Leverage</span>
            </div>
            <div className='w-full bg-[#1A2A2B]'>
              {ratios.map((item) => {
                const strategyLabel = getLabelForLeverageType(leverageType)
                const ratio = data?.find(
                  (item: LeverageRatioResponse) =>
                    item.strategy === strategyLabel,
                )?.ratio
                const path = getPathForRatio(item.strategy, chainId)

                return (
                  <LeverageRatioItem
                    key={item.strategy}
                    item={item}
                    path={path}
                    ratio={ratio}
                  />
                )
              })}
            </div>
          </div>
        </PopoverPanel>
      </Popover>
      <Tooltip placement='bottom'>
        <TooltipTrigger>
          <StatsMetric
            className='hidden w-16 md:flex'
            isLoading={isFetchingQuickStats}
            overrideValueClassName={
              netRate
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
              <p className='text-ic-gray-700 text-[10px] font-normal leading-tight'>
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
