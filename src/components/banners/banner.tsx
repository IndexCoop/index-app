import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export function Banner({ children }: Props) {
  return (
    <div className='dark:bg-ic-blue-200 hidden justify-center bg-[#006A71] p-3 sm:flex'>
      <p className='text-ic-white dark:text-ic-blue-900 text-sm font-semibold'>
        {children}
      </p>
    </div>
  )
}
