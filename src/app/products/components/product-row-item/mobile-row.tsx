import { ReactNode } from 'react'

type Props = {
  label: string
  children: ReactNode
}

export function MobileRow({ label, children }: Props) {
  return (
    <div className='flex w-full content-between items-center py-2'>
      <div className='text-ic-gray-600 flex-grow text-sm font-medium'>
        {label}
      </div>
      <div className='flex-grow'>{children}</div>
    </div>
  )
}
