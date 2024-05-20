import { BigNumber } from 'ethers'
import Image from 'next/image'
import { useMemo } from 'react'
import { useAccount } from 'wagmi'

import {
  IndexCoopBitcoin2xIndex,
  IndexCoopBitcoin3xIndex,
  IndexCoopEthereum2xIndex,
  IndexCoopEthereum3xIndex,
  IndexCoopInverseBitcoinIndex,
  IndexCoopInverseEthereumIndex,
  Token,
} from '@/constants/tokens'
import { useBalances } from '@/lib/hooks/use-balance'
import { displayFromWei } from '@/lib/utils'

const leverageTokens = [
  IndexCoopBitcoin2xIndex,
  IndexCoopBitcoin3xIndex,
  IndexCoopEthereum2xIndex,
  IndexCoopEthereum3xIndex,
  IndexCoopInverseBitcoinIndex,
  IndexCoopInverseEthereumIndex,
]

type TokenBalance = Token & { balance: string | null }

const leverageTokenAddresses = leverageTokens
  .map((token) => token.arbitrumAddress ?? '')
  .filter((address) => address.length > 0)

export function OpenPositions() {
  const { address } = useAccount()
  const balances = useBalances(address, leverageTokenAddresses)
  const tokens = useMemo(() => {
    if (balances.length === 0) return []

    return balances.reduce((acc, current) => {
      const token = leverageTokens.find(
        (leverageToken) => current.token === leverageToken.arbitrumAddress,
      )
      return token
        ? [
            ...acc,
            {
              ...token,
              balance: displayFromWei(
                BigNumber.from(current.value.toString()),
                3,
                token.decimals,
              ),
            },
          ]
        : acc
    }, [] as TokenBalance[])
  }, [balances])

  if (tokens.length === 0) return null

  return (
    <div className='border-ic-gray-600 w-full rounded-3xl border bg-[#1C2C2E] lg:max-w-[67%]'>
      <h3 className='text-ic-white p-6 font-bold'>Open Positions</h3>
      <div className='border-ic-gray-600 flex w-full border-b px-6 pb-3'>
        <div className='text-ic-gray-400 w-1/2'>Position</div>
        <div className='text-ic-gray-400 w-1/2'>Balance</div>
      </div>
      <div className='divide-ic-gray-900/20 divide-y-4 py-2'>
        {tokens.map((token) => (
          <div
            key={token.symbol}
            className='text-ic-white flex h-14 w-full px-6'
          >
            <div className='flex w-1/2'>
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
            <div className='flex w-1/2 items-center'>{token.balance}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
