import clsx from 'clsx'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
}

export function FaqList({ children, className }: Props) {
  return (
    <div
      className={clsx(
        'dark:border-ic-gray-950 max-w-5xl rounded-xl p-8 dark:border-[0.5px] dark:bg-zinc-950 dark:bg-opacity-5 dark:backdrop-blur-2xl',
        className,
      )}
    >
      <h2 className='text-ic-gray-800  dark:text-ic-gray-200 text-xl font-semibold leading-10 tracking-tight'>
        FAQs
      </h2>
      <dl className='mt-6 space-y-6'>{children}</dl>
    </div>
  )
}
