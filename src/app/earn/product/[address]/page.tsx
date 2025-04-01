'use client'

import { ArrowPathIcon } from '@heroicons/react/20/solid'
import { getTokenByChainAndAddress } from '@indexcoop/tokenlists'
import { AnimatePresence, motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'

import { EarnWidget } from '@/app/earn/components/earn-widget'
import { ProductTitlePill } from '@/app/earn/components/product-pill'
import { ProductTag } from '@/app/earn/components/product-tag'
import { StatBox } from '@/app/earn/components/stat-box'
import { useEarnContext } from '@/app/earn/provider'
import { formatAmount, formatDollarAmount } from '@/lib/utils'

export default function Page() {
  const { address: queryProductAddress } = useParams()
  const { products, onSelectIndexToken } = useEarnContext()

  const selectedProduct = products.find(
    (p) => p.tokenAddress === queryProductAddress,
  )

  useEffect(() => {
    const indexToken = getTokenByChainAndAddress(
      selectedProduct?.chainId,
      selectedProduct?.tokenAddress,
    )

    if (indexToken) {
      onSelectIndexToken(indexToken.symbol, indexToken.chainId)
    }
  }, [selectedProduct, onSelectIndexToken])

  useEffect(() => {
    document.body.classList.add('dark', 'bg-ic-black')
    return () => {
      document.body.classList.remove('dark', 'bg-ic-black')
    }
  }, [])

  return (
    <AnimatePresence>
      {selectedProduct && (
        <motion.div className='mt-8 flex w-full flex-col items-center'>
          <div className='flex w-full max-w-7xl flex-col gap-4'>
            <motion.div className='flex w-full flex-wrap gap-6 rounded-3xl border border-gray-600 border-opacity-[0.8] bg-zinc-900 p-6 md:flex-nowrap'>
              <div className='flex w-full flex-col gap-8'>
                <div className='flex flex-col gap-6'>
                  <h3 className='text-xl font-semibold'>
                    {selectedProduct.name}
                  </h3>
                  <p className='text-xs text-neutral-400'>
                    {selectedProduct.description}
                  </p>
                  <div className='flex gap-2'>
                    {['wsteth15x', 'iceth'].includes(selectedProduct.id) && (
                      <ProductTitlePill
                        text='Smart Loop'
                        icon={
                          <ArrowPathIcon className='h-2.5 w-2.5 fill-zinc-900' />
                        }
                      />
                    )}

                    {selectedProduct.tags.map((tag) => (
                      <ProductTag
                        key={`tag-item-${tag.text}`}
                        text={tag.text}
                        className={tag.className}
                      />
                    ))}
                  </div>
                </div>
                <div className='mt-auto'>
                  <h5 className='text-xs text-neutral-400'>Stats</h5>
                  <div className='flex flex-wrap gap-2 pt-2'>
                    <StatBox
                      label='Current APY'
                      value={`${formatAmount(selectedProduct.metrics.apy)}%`}
                    />
                    <StatBox
                      label='TVL'
                      value={`${formatDollarAmount(
                        selectedProduct.metrics.tvl,
                        true,
                        2,
                        {
                          style: 'currency',
                          currency: 'USD',
                          notation: 'compact',
                          compactDisplay: 'short',
                        },
                      )}`}
                    />
                    <StatBox
                      label='7D APY'
                      value={`${formatAmount(selectedProduct.metrics.apy7d)}%`}
                    />
                    <StatBox
                      label='30D APY'
                      value={`${formatAmount(selectedProduct.metrics.apy30d)}%`}
                    />
                  </div>
                </div>
              </div>
              <div className='min-w-[320px] max-w-[460px]'>
                <EarnWidget />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
