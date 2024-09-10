import Image from 'next/image'
import { FC, useEffect, useMemo, useState } from 'react'

import { useTokenHistory } from '@/lib/hooks/use-token-history'
import { shortenAddress } from '@/lib/utils'
import { SkeletonLoader } from '@/lib/utils/skeleton-loader'
import { cn } from '@/lib/utils/tailwind'
import { mapChainIdToAddressProp } from '@/lib/utils/tokens'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import ExternalLinkIcon from '@heroicons/react/24/outline/ArrowTopRightOnSquareIcon'
import capitalize from 'lodash/capitalize'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { useLeverageToken } from '../provider'
import { EnrichedToken, LeverageType } from '../types'
import { fetchLeverageTokenPrices } from '../utils/fetch-leverage-token-prices'
import { getLeverageBaseToken } from '../utils/get-leverage-base-token'
import { getLeverageAction, getLeverageType } from '../utils/get-leverage-type'

const leverageTypeLabels = {
  [LeverageType.Long2x]: '2x LONG',
  [LeverageType.Long3x]: '3x LONG',
  [LeverageType.Short]: '1x SHORT',
}

export const YourTokens: FC = () => {
  const { chain } = useAccount()
  const {
    balances,
    indexTokens,
    onSelectBaseToken,
    isMinting,
    toggleIsMinting,
    onSelectLeverageType,
  } = useLeverageToken()
  const [tokens, setTokens] = useState<EnrichedToken[]>([])

  useEffect(() => {
    if (!chain || balances.length === 0) return
    fetchLeverageTokenPrices(balances, setTokens, chain.id)
  }, [balances])

  const { tokenHistory, isLoading } = useTokenHistory(
    ...indexTokens.map((token) => token[mapChainIdToAddressProp(chain?.id)]!),
  )

  const handleCloseClick = (token: EnrichedToken) => {
    if (isMinting) toggleIsMinting()

    const leverageBaseToken = getLeverageBaseToken(token.symbol)
    if (leverageBaseToken === null) return
    onSelectBaseToken(leverageBaseToken.symbol)

    const leverageType = getLeverageType(token.symbol)
    if (leverageType === null) return
    onSelectLeverageType(leverageType)

    const scrollDiv = document.getElementById('close-position-scroll')
    if (scrollDiv) {
      window.scrollTo({
        top: scrollDiv.getBoundingClientRect().top + window.scrollY - 90,
        behavior: 'smooth',
      })
    }
  }

  const indexTokensBySymbol = useMemo(
    () =>
      tokens.reduce<Record<string, EnrichedToken>>(
        (acc, token) => ({
          ...acc,
          [token.symbol]: token,
        }),
        {},
      ),
    [tokens],
  )

  return (
    <TabGroup
      as='div'
      className='border-ic-gray-600 w-full rounded-3xl border bg-[#1C2C2E]'
    >
      <TabList className='flex gap-8 px-6 py-8'>
        <Tab className='outline-none'>
          {({ hover, selected }) => (
            <div className='flex flex-col gap-[2px]'>
              <p
                className={cn(
                  'text-ic-gray-400 font-bold',
                  (selected || hover) && 'text-ic-white',
                )}
              >
                Open Positions
              </p>
              <div
                className={cn(
                  'bg-ic-white mt-1 h-[2px] w-0 transition-all duration-200',
                  selected && 'w-full',
                )}
              />
            </div>
          )}
        </Tab>
        <Tab className='outline-none'>
          {({ hover, selected }) => (
            <div className='flex flex-col gap-[2px]'>
              <p
                className={cn(
                  'text-ic-gray-400 font-bold',
                  (selected || hover) && 'text-ic-white',
                )}
              >
                History
              </p>
              <div
                className={cn(
                  'bg-ic-white mt-1 h-[2px] w-0 transition-all duration-200',
                  selected && 'w-full',
                )}
              />
            </div>
          )}
        </Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <div className='border-ic-gray-600 flex w-full border-b px-6 pb-3'>
            <div className='text-ic-gray-400 w-1/2 sm:w-1/3 md:w-3/12'>
              Token
            </div>
            <div className='text-ic-gray-400 w-1/2 sm:w-1/3 md:w-4/12'>
              USD Value
            </div>
            <div className='text-ic-gray-400 hidden md:block md:w-3/12'>
              Current Leverage
            </div>
            <div className='hidden sm:block sm:w-1/3 md:w-2/12'>
              <span className='sr-only'>Close column</span>
            </div>
          </div>
          <div className='divide-ic-gray-900/20 divide-y-4 py-2'>
            {tokens.length === 0 ? (
              <div className='text-ic-white px-2 py-4 text-center'>
                You are currently not holding any Leverage Suite tokens
              </div>
            ) : (
              tokens.map((token) => (
                <div
                  key={token.symbol}
                  className='text-ic-white flex h-14 w-full px-6'
                >
                  <div className='flex w-1/2 sm:w-1/3 md:w-3/12'>
                    <div className='my-auto mr-2 overflow-hidden rounded-full'>
                      <Image
                        src={token.image}
                        alt={`${token.symbol} logo`}
                        height={30}
                        width={30}
                      />
                    </div>
                    <div className='my-auto font-medium'>{token.symbol}</div>
                  </div>
                  <div className='flex w-1/2 items-center sm:w-1/3 md:w-4/12'>
                    {token.size}
                  </div>
                  <div
                    className={cn(
                      'hidden items-center font-medium md:flex md:w-3/12',
                      {
                        'text-ic-blue-700':
                          token.leverageType !== LeverageType.Short,
                        'text-ic-red':
                          token.leverageType === LeverageType.Short,
                      },
                    )}
                  >
                    {leverageTypeLabels[token.leverageType!]}
                  </div>
                  <div className='hidden sm:flex sm:w-1/3 md:w-2/12'>
                    <button
                      className='bg-ic-blue-500 active:bg-ic-blue-700 disabled:bg-ic-gray-300 hover:bg-ic-blue-400 text-ic-white mb-2 ml-auto mt-auto h-9 w-fit rounded-md px-[14px] py-[4px] align-bottom shadow-sm'
                      onClick={() => handleCloseClick(token)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabPanel>
        <TabPanel>
          <div className='border-ic-gray-600 flex w-full border-b px-6 pb-3'>
            <div className='text-ic-gray-400 w-1/3 md:w-2/12'>Date</div>
            <div className='text-ic-gray-400 w-1/3 text-center sm:text-left md:w-2/12'>
              Action
            </div>
            <div className='text-ic-gray-400 hidden md:block md:w-2/12'>
              Size
            </div>
            <div className='text-ic-gray-400 w-1/3 md:w-2/12'>Position</div>
            <div className='text-ic-gray-400 hidden md:block md:w-4/12'>Tx</div>
          </div>
          <div className='divide-ic-gray-900/20 divide-y-4 py-2'>
            {isLoading ? (
              <div className='flex w-full flex-col gap-3 px-4 py-2'>
                {[1, 2, 3].map((n) => (
                  <SkeletonLoader
                    className='h-8 w-full rounded-lg'
                    delay={n * 100}
                  />
                ))}
              </div>
            ) : (
              tokenHistory.map(({ metadata, from, hash, asset, value }) => {
                const token = indexTokensBySymbol[asset!]
                const at = new Date(metadata.blockTimestamp)

                if (!token) return null

                const action = getLeverageAction(from as Address)
                return (
                  <div
                    key={hash}
                    className='text-ic-white flex h-14 w-full px-6'
                  >
                    <div className='flex w-1/3 md:w-2/12'>
                      <div className='my-auto font-medium'>
                        {at.toLocaleDateString()}
                      </div>
                    </div>
                    <div className='flex w-1/3 justify-center sm:justify-normal md:w-2/12'>
                      <div
                        className={cn(
                          'my-auto font-medium',
                          action === 'open' ? 'text-green-500' : 'text-red-500',
                        )}
                      >
                        {capitalize(action)}
                      </div>
                    </div>
                    <div className='hidden w-1/3 items-center md:flex md:w-2/12'>
                      $
                      {(
                        Number(value) * (token.unitPriceUsd ?? 0)
                      ).toLocaleString()}
                    </div>
                    <div className='flex w-1/3 md:w-2/12'>
                      <div className='my-auto font-medium'>{token.symbol}</div>
                    </div>

                    <div className='hidden w-1/3 items-center md:flex md:w-4/12'>
                      <a
                        href={`${chain?.blockExplorers?.default.url}/tx/${hash}`}
                        className='hover:underline'
                        target='_blank'
                      >
                        <div className='my-auto flex gap-2 font-mono'>
                          {shortenAddress(hash)}
                          <ExternalLinkIcon className='h-5 w-5' />
                        </div>
                      </a>
                    </div>
                  </div>
                )
              })
            )}
            {tokenHistory.length === 0 && (
              <div className='text-ic-white px-2 py-4 text-center'>
                You have not executed any transactions with leverage tokens yet.
              </div>
            )}
          </div>
        </TabPanel>
      </TabPanels>
    </TabGroup>
  )
}
