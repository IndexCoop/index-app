'use client'

import { ProductCard } from '@/app/earn/components/product-card'
import { useEarnContext } from '@/app/earnv2/provider'
import { useEffect } from 'react'
import { useAccount } from 'wagmi'

export default function Page() {
  const { isConnected } = useAccount()
  const { indexToken, products } = useEarnContext()

  useEffect(() => {
    document.body.classList.add('dark', 'bg-ic-black')
    return () => {
      document.body.classList.remove('dark', 'bg-ic-black')
    }
  }, [])

  return (
    <div className='mt-40 flex w-full flex-col items-center'>
      <div className='mx-auto max-w-7xl '>
        <h3 className='my-5 hidden w-full text-lg font-semibold text-neutral-50 md:block'>
          Strategies
        </h3>
        <div className='flex flex-wrap gap-4'>
          {products.map((p) => (
            <ProductCard product={p} />
          ))}
        </div>
      </div>
    </div>
  )
}
