'use client'

import { Dialog } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import { Path } from '@/constants/paths'

import { Connect } from './connect'
import { HeaderLink } from './link'
import { Logo } from './logo'

const navigation = [
  { name: 'Trade', href: Path.SWAP },
  { name: 'Products', href: Path.PRODUCTS },
  { name: 'Leverage', href: Path.LEVERAGE },
  { name: 'Presales', href: Path.PRESALES },
  { name: 'PRT Staking', href: Path.PRT_STAKING },
]

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className='bg-ic-white dark:bg-ic-blue-950 shadow-ic-black/15 opacity-[.96] shadow-md backdrop-blur'>
      <nav
        className='mx-auto flex items-center justify-between p-6 lg:px-8'
        aria-label='Global'
      >
        <div className='flex lg:pr-8'>
          <Logo />
        </div>
        <div className='hidden lg:flex lg:gap-x-8'>
          {navigation.map((item) => (
            <HeaderLink key={item.name} label={item.name} href={item.href} />
          ))}
        </div>
        <div className='flex md:mr-6 md:flex-grow md:justify-end lg:mr-0'>
          <Connect />
        </div>
        <div className='flex lg:hidden'>
          <button
            type='button'
            className='text-ic-gray-800 dark:text-ic-gray-200 -m-2.5 inline-flex items-center justify-center rounded-md p-2.5'
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className='sr-only'>Open main menu</span>
            <Bars3Icon className='h-6 w-6' aria-hidden='true' />
          </button>
        </div>
      </nav>
      <Dialog
        as='div'
        className={clsx('lg:hidden', pathname === Path.LEVERAGE && 'dark')}
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className='fixed inset-0 z-10' />
        <Dialog.Panel className='bg-ic-white dark:bg-ic-blue-950 fixed inset-y-0 right-0 z-10 w-full overflow-y-auto px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 dark:sm:ring-gray-100/10'>
          <div className='flex items-center justify-between'>
            <Logo />
            <button
              type='button'
              className='text-ic-gray-800 dark:text-ic-gray-200 -m-2.5 rounded-md p-2.5'
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className='sr-only'>Close menu</span>
              <XMarkIcon className='h-6 w-6' aria-hidden='true' />
            </button>
          </div>
          <div className='mt-6 flow-root'>
            <div className='-my-6 divide-y divide-gray-500/10'>
              <div className='space-y-2 py-6'>
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className='text-ic-gray-900 hover:bg-ic-gray-50 dark:text-ic-gray-50 dark:hover:bg-ic-blue-900 -mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7'
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  )
}
