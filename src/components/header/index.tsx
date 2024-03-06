import { Path } from '@/constants/paths'
import { Connect } from './connect'
import { HeaderLink } from './link'
import { Logo } from './logo'

const isDevEnv = process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production'

export function Header() {
  return (
    <header className='bg-ic-white dark:bg-ic-blue-950 shadow-ic-black/15 sticky top-0 z-50 flex justify-between px-9 py-4 opacity-[.96] shadow-md backdrop-blur'>
      <div className='flex flex-row items-center space-x-6'>
        <Logo />
        <HeaderLink href={Path.TRADE} label='Trade' />
        <HeaderLink href={Path.PRODUCTS} label='Products' />
        {isDevEnv && <HeaderLink href={Path.LEVERAGE} label='Leverage' />}
      </div>
      <div className='hidden h-10 max-h-10 flex-row sm:flex'>
        <Connect />
      </div>
    </header>
  )
}
