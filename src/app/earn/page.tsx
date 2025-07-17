'use client'

import { ArrowPathIcon } from '@heroicons/react/20/solid'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useAccount } from 'wagmi'

import { EarnPositions } from '@/app/store/positions-atom'

import { BalanceCard } from './components/balance-card'
import { ProductCard } from './components/product-card'
import { useEarnContext } from './provider'

export default function Page() {
  const { products, balances } = useEarnContext()

  const { address: user } = useAccount()

  useEffect(() => {
    document.body.classList.add('dark', 'bg-ic-black')
    return () => {
      document.body.classList.remove('dark', 'bg-ic-black')
    }
  }, [])

  const {
    data: { open, prices },
    isFetching,
  } = useQuery({
    initialData: {
      open: [],
      history: [],
      prices: {},
    },
    enabled: Boolean(user),
    queryKey: ['earn-history', user],
    queryFn: async () => {
      const response = await fetch('/api/earn/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user,
        }),
      })
      return response.json() as Promise<EarnPositions>
    },
  })

  return (
    <div className='mt-8 flex w-full flex-col items-center p-4'>
      <div className='mx-auto flex max-w-7xl flex-col gap-4'>
        {balances.length > 0 && (
          <BalanceCard
            products={products}
            balances={balances}
            positions={open}
            prices={prices}
            isLoading={isFetching}
          />
        )}
        <div>
          <h3 className='my-5 hidden w-full text-lg font-medium text-neutral-50 md:block'>
            Strategies
          </h3>
          <div className='flex flex-wrap justify-start gap-4 pb-12 xl:justify-center'>
            {products.map((p) => (
              <ProductCard
                key={`product-item-${p.tokenAddress}`}
                product={p}
                position={open.find(
                  (position) =>
                    position.metrics?.tokenAddress === p.tokenAddress,
                )}
                pill={
                  ['wsteth15x', 'iceth'].includes(p.id)
                    ? {
                        text: 'Smart Loop',
                        icon: (
                          <ArrowPathIcon className='h-2 w-2 fill-zinc-900' />
                        ),
                      }
                    : undefined
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
