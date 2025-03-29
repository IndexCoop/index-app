'use client'

import { AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'

import { useColorMode } from '@chakra-ui/react'
import { BalanceCard } from './components/balance-card'
import { ProductCard } from './components/product-card'
import { useEarnContext } from './provider'

export default function Page() {
  const { products, balances } = useEarnContext()

  const { colorMode, toggleColorMode } = useColorMode()

  useEffect(() => {
    if (colorMode === 'light') {
      toggleColorMode()
    }

    return () => {
      if (colorMode === 'dark') {
        toggleColorMode()
      }
    }
  }, [colorMode, toggleColorMode])

  useEffect(() => {
    document.body.classList.add('dark', 'bg-ic-black')
    return () => {
      document.body.classList.remove('dark', 'bg-ic-black')
    }
  }, [])

  return (
    <div className='mt-40 flex w-full flex-col items-center'>
      <div className='mx-auto flex max-w-7xl flex-col gap-4'>
        <AnimatePresence>
          {balances.length > 0 && (
            <BalanceCard products={products} balances={balances} />
          )}
        </AnimatePresence>

        <div>
          <h3 className='my-5 hidden w-full text-lg font-semibold text-neutral-50 md:block'>
            Strategies
          </h3>
          <div className='flex flex-wrap gap-4'>
            {products.map((p) => (
              <ProductCard key={`product-item-${p.tokenAddress}`} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
