'use client'

import { ArrowPathIcon } from '@heroicons/react/20/solid'
import { AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'

import { BalanceCard } from './components/balance-card'
import { ProductCard } from './components/product-card'
import { useEarnContext } from './provider'

export default function Page() {
  const { products, balances } = useEarnContext()

  useEffect(() => {
    document.body.classList.add('dark', 'bg-ic-black')
    return () => {
      document.body.classList.remove('dark', 'bg-ic-black')
    }
  }, [])

  return (
    <div className='mt-8 flex w-full flex-col items-center p-4'>
      <div className='mx-auto flex max-w-7xl flex-col gap-4'>
        <AnimatePresence>
          {balances.length > 0 && (
            <BalanceCard products={products} balances={balances} />
          )}
        </AnimatePresence>

        <div>
          <h3 className='my-5 hidden w-full text-lg font-medium text-neutral-50 md:block'>
            Strategies
          </h3>
          <div className='flex flex-wrap justify-start gap-4 pb-12 xl:justify-center'>
            {products.map((p) => (
              <ProductCard
                key={`product-item-${p.tokenAddress}`}
                product={p}
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
