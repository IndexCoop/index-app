'use client'

import { ProductCard } from '@/app/earn/components/product-card'
import { useEarnContext } from '@/app/earnv2/provider'
import { useEffect } from 'react'

export default function Page() {
  const { indexToken, products } = useEarnContext()

  useEffect(() => {
    document.body.classList.add('dark', 'bg-ic-black')
    return () => {
      document.body.classList.remove('dark', 'bg-ic-black')
    }
  }, [])

  return (
    <div className='mt-40 w-full'>
      <div className='flex justify-center gap-4'>
        {products.map(({ name, description, tags, tokenAddress }) => (
          <ProductCard
            title={name}
            description={description}
            tags={tags}
            tokenAddress={tokenAddress}
            data={{ apy: 0 }}
          />
        ))}
      </div>
    </div>
  )
}
