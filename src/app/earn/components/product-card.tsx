import { GetApiV2ProductsEarn200 } from '@/gen'
import { formatAmount } from '@/lib/utils'
import { cn } from '@/lib/utils/tailwind'
import { ArrowRightIcon } from '@heroicons/react/20/solid'
import { FC, ReactNode } from 'react'

const ProductTitlePill = ({
  text,
  icon,
}: {
  text: string
  icon: ReactNode
}) => (
  <div className='bg-ic-pill-teal flex items-center rounded-[4px] border-[0.5px] border-black border-opacity-20 px-2'>
    {icon}
    <p className='ml-2 w-full text-[8px] uppercase tracking-tight text-white'>
      {text}
    </p>
  </div>
)

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
    <div className='flex w-full max-w-[360px] flex-col gap-6 rounded-3xl border border-gray-600 border-opacity-[0.8] bg-zinc-900 p-6'>
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
          <div
            className={cn('rounded-[4px] bg-neutral-700 px-2 py-1', className)}
          >
            <p className='text-[8px]'>{text}</p>
          </div>
        ))}
      </div>
      <div className='flex items-center justify-between'>
        <div className='flex h-12 w-12 items-center justify-center rounded-full bg-neutral-600'>
          <ArrowRightIcon className='h-8 w-8' />
        </div>
        <div className='flex flex-col items-end'>
          <p className='text-3xl font-semibold tracking-tight text-neutral-50'>
            {metrics ? `${formatAmount(metrics.apy)}%` : '--'}
          </p>
          <p className='text-xs text-neutral-400'>APY</p>
        </div>
      </div>
    </div>
  )
}
