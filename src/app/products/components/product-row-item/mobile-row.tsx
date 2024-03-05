import { ReactNode } from 'react'

type Props = {
  label: string
  children: ReactNode
}

export function MobileRow({ label, children }: Props) {
  return (
    <div className='flex content-between w-full py-2 items-center'>
      <div className='text-ic-gray-600 text-sm font-medium flex-grow'>
        {label}
      </div>
      <div className='flex-grow'>{children}</div>
    </div>
  )
}
