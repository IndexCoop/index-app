import clsx from 'clsx'
import Image from 'next/image'
import { useEffect, useState } from 'react'

import { LeverageType, useLeverageToken } from '../provider'
import { EnrichedToken } from '../types'
import { fetchLeverageTokenPrices } from '../utils/fetch-leverage-token-prices'
import { getLeverageBaseToken } from '../utils/get-leverage-base-token'
import { getLeverageType } from '../utils/get-leverage-type'

const leverageTypeLabels = {
  [LeverageType.Long2x]: '2x LONG',
  [LeverageType.Long3x]: '3x LONG',
  [LeverageType.Short]: '1x SHORT',
}

export function YourTokens() {
  const {
    balances,
    onSelectBaseToken,
    isMinting,
    toggleIsMinting,
    onSelectLeverageType,
  } = useLeverageToken()
  const [tokens, setTokens] = useState<EnrichedToken[]>([])

  useEffect(() => {
    if (balances.length === 0) return
    fetchLeverageTokenPrices(balances, setTokens)
  }, [balances])

  const handleCloseClick = (token: EnrichedToken) => {
    if (isMinting) toggleIsMinting()

    const leverageBaseToken = getLeverageBaseToken(token)
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

  return (
    <div className='border-ic-gray-600 w-full rounded-3xl border bg-[#1C2C2E]'>
      <h3 className='text-ic-white p-6 font-bold'>Your Tokens</h3>
      <div className='border-ic-gray-600 flex w-full border-b px-6 pb-3'>
        <div className='text-ic-gray-400 w-1/2 sm:w-1/3 md:w-3/12'>Token</div>
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
                className={clsx(
                  'hidden items-center font-medium md:flex md:w-3/12',
                  {
                    'text-ic-blue-700':
                      token.leverageType !== LeverageType.Short,
                    'text-ic-red': token.leverageType === LeverageType.Short,
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
    </div>
  )
}
