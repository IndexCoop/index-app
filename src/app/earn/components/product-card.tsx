import { ArrowRightIcon } from '@heroicons/react/20/solid'
import { motion } from 'framer-motion'
import { FC, ReactNode } from 'react'

import { ProductTitlePill } from '@/app/earn/components/product-pill'
import { ProductTag } from '@/app/earn/components/product-tag'
import { GetApiV2ProductsEarn200 } from '@/gen'
import { formatAmount } from '@/lib/utils'

export type ProductCardProps = {
  pill?: {
    text: string
    icon: ReactNode
  }
  product: GetApiV2ProductsEarn200[number]
}

export const ProductCard: FC<ProductCardProps> = ({ product, pill }) => {
  const { name, description, tags, tokenAddress, metrics } = product
  return (
    <motion.a
      href={`/earn/product/${tokenAddress}`}
      whileHover={{
        scale: 1.05,
      }}
      className='group flex w-full min-w-[360px] cursor-pointer flex-col gap-6 rounded-3xl border border-gray-600 border-opacity-[0.8] bg-zinc-900 p-6 md:max-w-[360px]'
    >
      <div className='flex items-start justify-between gap-2'>
        <p className='text-xl font-semibold capitalize text-neutral-50'>
          {name}
        </p>
        {pill && <ProductTitlePill text={pill.text} icon={pill.icon} />}
      </div>
      <div className='flex items-center justify-between gap-2'>
        <p className='text-xs text-neutral-400'>{description}</p>
      </div>
      <div className='flex gap-2'>
        {tags.map(({ text, className }) => (
          <ProductTag
            key={`tag-card-${text}`}
            text={text}
            className={className}
          />
        ))}
      </div>
      <div className='flex items-center justify-between'>
        <div className='relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-neutral-600 transition-all group-hover:bg-neutral-50 group-hover:text-neutral-900'>
          <ArrowRightIcon className='absolute h-8 w-8 transition-transform duration-300 group-hover:translate-x-12' />
          <ArrowRightIcon className='absolute h-8 w-8 -translate-x-12 transition-transform duration-300 group-hover:translate-x-0' />
        </div>
        <div className='flex flex-col items-end'>
          <p className='text-3xl font-semibold tracking-tight text-neutral-50'>
            {metrics ? `${formatAmount(metrics.apy)}%` : '--'}
          </p>
          <p className='text-xs text-neutral-400'>APY</p>
        </div>
      </div>
    </motion.a>
  )
}
