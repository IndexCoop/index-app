import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'

import {
  BTC,
  ETH,
  IndexCoopBitcoin2xIndex,
  IndexCoopBitcoin3xIndex,
  IndexCoopEthereum2xIndex,
  IndexCoopEthereum3xIndex,
} from '@/constants/tokens'
import { useBalances } from '@/lib/hooks/use-balance'

import { ethLeverageTokens, leverageTokens } from '../constants'
import { LeverageType, useLeverageToken } from '../provider'
import { EnrichedToken } from '../types'
import { fetchPositionPrices } from '../utils/fetch-position-prices'

const leverageTokenAddresses = leverageTokens
  .map((token) => token.arbitrumAddress ?? '')
  .filter((address) => address.length > 0)

export function OpenPositions() {
  const { address } = useAccount()
  const {
    onSelectBaseToken,
    isMinting,
    toggleIsMinting,
    onSelectLeverageType,
  } = useLeverageToken()
  const balances = useBalances(address, leverageTokenAddresses)
  const [tokens, setTokens] = useState<EnrichedToken[]>([])

  useEffect(() => {
    if (balances.length === 0) return
    fetchPositionPrices(balances, setTokens)
  }, [balances])

  const handleCloseClick = (token: EnrichedToken) => {
    if (isMinting) toggleIsMinting()
    if (
      ethLeverageTokens.some(
        (ethToken) => ethToken.arbitrumAddress === token.arbitrumAddress,
      )
    ) {
      onSelectBaseToken(ETH.symbol)
    } else {
      onSelectBaseToken(BTC.symbol)
    }

    if (
      token.arbitrumAddress === IndexCoopEthereum2xIndex.arbitrumAddress ||
      token.arbitrumAddress === IndexCoopBitcoin2xIndex.arbitrumAddress
    ) {
      onSelectLeverageType(LeverageType.Long2x)
    } else if (
      token.arbitrumAddress === IndexCoopEthereum3xIndex.arbitrumAddress ||
      token.arbitrumAddress === IndexCoopBitcoin3xIndex.arbitrumAddress
    ) {
      onSelectLeverageType(LeverageType.Long3x)
    } else {
      onSelectLeverageType(LeverageType.Short)
    }

    const scrollDiv = document.getElementById('close-position-scroll')
    if (scrollDiv) {
      window.scrollTo({
        top: scrollDiv.getBoundingClientRect().top + window.scrollY - 90,
        behavior: 'smooth',
      })
    }
  }

  if (tokens.length === 0) return null

  return (
    <div className='border-ic-gray-600 w-full rounded-3xl border bg-[#1C2C2E] lg:max-w-[67%]'>
      <h3 className='text-ic-white p-6 font-bold'>Open Positions</h3>
      <div className='border-ic-gray-600 flex w-full border-b px-6 pb-3'>
        <div className='text-ic-gray-400 w-2/5'>Position</div>
        <div className='text-ic-gray-400 w-2/5'>Size</div>
        <div className='w-1/5'>
          <span className='sr-only'>Close Position</span>
        </div>
      </div>
      <div className='divide-ic-gray-900/20 divide-y-4 py-2'>
        {tokens.map((token) => (
          <div
            key={token.symbol}
            className='text-ic-white flex h-14 w-full px-6'
          >
            <div className='flex w-2/5'>
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
            <div className='mx-auto flex w-2/5 items-center'>
              {token.balance}
            </div>
            <div className='flex w-1/5'>
              <button
                className='bg-ic-blue-500 active:bg-ic-blue-700 disabled:bg-ic-gray-300 hover:bg-ic-blue-400 text-ic-white mb-2 ml-auto mt-auto h-9 w-fit rounded-md px-[14px] py-[4px] align-bottom shadow-sm'
                onClick={() => handleCloseClick(token)}
              >
                Close
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
