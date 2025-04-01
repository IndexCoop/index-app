import { ReactNode } from 'react'

export const ProductTitlePill = ({
  text,
  icon,
}: {
  text: string
  icon: ReactNode
}) => (
  <div className='bg-ic-pill-teal flex items-center rounded-md border-[0.5px] border-black border-opacity-20 px-2 py-1 font-["Open_Sauce_Sans"] font-semibold'>
    <div className='rounded-full bg-neutral-50 p-0.5'>{icon}</div>

    <p className='ml-2 w-full text-[10px] uppercase tracking-tight text-white'>
      {text}
    </p>
  </div>
)
