import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { getTokenByChainAndSymbol } from '@indexcoop/tokenlists'
import Image from 'next/image'
import { arbitrum } from 'viem/chains'

import { useLeverageToken } from '@/app/leverage/provider'

import { LeverageSelector } from './leverage-selector'
import { StatsMetric } from './stats-metric'

type LeverageRatio = {
  icon: string
  ratio: string
  networks: string[]
  leverage: string
  isPositive: boolean
}

const ratios: LeverageRatio[] = [
  {
    icon: getTokenByChainAndSymbol(arbitrum.id, 'ETH2X').logoURI,
    ratio: '2x',
    // TODO: merge other earn PR first or cherry-pick here?
    networks: [
      getTokenByChainAndSymbol(arbitrum.id, 'ETH2X').logoURI,
      getTokenByChainAndSymbol(arbitrum.id, 'ETH2X').logoURI,
      getTokenByChainAndSymbol(arbitrum.id, 'ETH2X').logoURI,
      // '/assets/ethereum-network-logo.svg',
      // '/assets/arbitrum-network-logo.svg',
      // '/assets/base-network-icon.svg',
    ],
    leverage: '1.94x',
    isPositive: true,
  },
  {
    icon: getTokenByChainAndSymbol(arbitrum.id, 'ETH3X').logoURI,
    ratio: '3x',
    networks: [
      getTokenByChainAndSymbol(arbitrum.id, 'ETH2X').logoURI,
      getTokenByChainAndSymbol(arbitrum.id, 'ETH2X').logoURI,
      // '/assets/ethereum-network-logo.svg',
      // '/assets/arbitrum-network-logo.svg',
    ],
    leverage: '2.96x',
    isPositive: true,
  },
  {
    icon: getTokenByChainAndSymbol(arbitrum.id, 'iETH1X').logoURI,
    ratio: '-1x',
    networks: [
      getTokenByChainAndSymbol(arbitrum.id, 'ETH2X').logoURI,
      // '/assets/ethereum-network-logo.svg'
    ],
    leverage: '-1.10x',
    isPositive: false,
  },
]

function LeverageRatioItem({ item }: { item: LeverageRatio }) {
  return (
    <div className='border-ic-gray-600 flex items-center justify-between border-t px-4 py-3 first:border-t-0'>
      <div className='flex items-center gap-2'>
        <Image
          src={item.icon}
          alt={`${item.ratio} leverage`}
          height={16}
          width={16}
        />
        <span className='text-ic-white text-xs font-medium'>{item.ratio}</span>
      </div>
      <div className='flex gap-1'>
        {item.networks.map((network, idx) => (
          <Image
            key={idx}
            src={network}
            alt={'Network Icon'}
            height={12}
            width={12}
          />
        ))}
      </div>
      <span className={'text-ic-white text-right text-xs font-medium'}>
        {item.leverage}
      </span>
    </div>
  )
}

export function LeverageSelectorContainer() {
  const { isFetchingStats } = useLeverageToken()
  return (
    <div className='border-ic-black flex h-full w-2/3 items-center gap-8 border-l px-16 py-0'>
      <Popover className='flex'>
        <PopoverButton className='data-[active]:text-ic-gray-950 data-[active]:dark:text-ic-white data-[hover]:text-ic-gray-700 data-[hover]:dark:text-ic-gray-100 text-ic-gray-500 dark:text-ic-gray-300 focus:outline-none data-[focus]:outline-1'>
          <LeverageSelector
            leverage={'2x'}
            leverageType={'Long'}
            onClick={() => console.log('select long')}
          />
        </PopoverButton>
        <PopoverPanel
          transition
          anchor='bottom'
          className='z-10 mt-4 rounded-lg transition duration-200 ease-in-out data-[closed]:-translate-y-1 data-[closed]:opacity-0'
        >
          <div className='w-full max-w-xl'>
            <div className='text-ic-gray-400 space-between flex gap-5 px-5 py-1 text-[11px]'>
              <span>Strategy</span>
              <span>Networks</span>
              <span>Current Leverage</span>
            </div>
            <div className='w-full rounded-lg bg-[#1A2A2B]'>
              {ratios.map((item, index) => (
                <LeverageRatioItem item={item} key={index} />
              ))}
            </div>
          </div>
        </PopoverPanel>
      </Popover>
      <StatsMetric
        className='hidden w-16 md:flex'
        isLoading={isFetchingStats}
        label='Net Rate'
        value={'0.03%'}
      />
    </div>
  )
}
