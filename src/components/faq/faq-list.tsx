import clsx from 'clsx'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
}

export function FaqList({ children, className }: Props) {
  return (
    <div className={clsx('divide-ic-gray-900/10 max-w-5xl divide-y', className)}>
      <h2 className='text-ic-gray-800 text-xl font-semibold leading-10 tracking-tight'>
        FAQs
      </h2>
      <dl className='divide-ic-gray-900/10 mt-6 space-y-6 divide-y'>
        {children}
      </dl>
    </div>
  )
}
