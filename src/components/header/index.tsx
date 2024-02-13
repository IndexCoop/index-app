'use client'

import { Connect } from './connect'
import { HeaderLink } from './link'
import { Logo } from './logo'

export enum Path {
  HOMEPAGE = 'https://indexcoop.com/',
  PRODUCTS = '/produc',
  TRADE = '/swap',
}

export function Header() {
  return (
    <header className='bg-ic-white sticky top-0 flex justify-between px-9 py-4 shadow-md backdrop-blur shadow-ic-black/15 z-50 opacity-[.97]'>
      <div className='flex flex-row items-center space-x-6'>
        <Logo />
        <HeaderLink href={Path.TRADE} label='Trade' />
        <HeaderLink href={Path.PRODUCTS} label='Products' />
      </div>
      <div className='hidden sm:flex flex-row h-10 max-h-10'>
        <Connect />
      </div>
    </header>
  )
}
