'use client'

import { Connect } from './connect'
import { HeaderLink } from './link'
import { Logo } from './logo'

export enum Path {
  HOMEPAGE = 'https://indexcoop.com/',
  PRODUCTS = '/products',
  TRADE = '/swap',
}

export function Header() {
  return (
    <header className='bg-ic-white shadow-ic-black/15 sticky top-0 z-50 flex justify-between px-9 py-4 opacity-[.96] shadow-md backdrop-blur'>
      <div className='flex flex-row items-center space-x-6'>
        <Logo />
        <HeaderLink href={Path.TRADE} label='Trade' />
        <HeaderLink href={Path.PRODUCTS} label='Products' />
      </div>
      <div className='hidden h-10 max-h-10 flex-row sm:flex'>
        <Connect />
      </div>
    </header>
  )
}
