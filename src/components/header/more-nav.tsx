import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { EllipsisHorizontalIcon } from '@heroicons/react/20/solid'

import { HeaderLink } from '@/components/header/link'
import { Path } from '@/constants/paths'

type Props = {
  navigation: {
    name: string
    href: Path
    isMoreNavLink?: boolean
  }[]
}

export function MoreNav({ navigation }: Props) {
  return (
    <Popover className='flex'>
      <PopoverButton className='data-[active]:text-ic-gray-950 data-[hover]:text-ic-gray-700 data-[hover]:dark:text-netural-50 text-ic-gray-500 dark:text-ic-gray-300 focus:outline-none data-[focus]:outline-1 data-[active]:dark:text-neutral-400'>
        <EllipsisHorizontalIcon aria-hidden='true' className='h-5 w-5' />
      </PopoverButton>
      <PopoverPanel
        transition
        anchor='bottom'
        className='bg-ic-white ring-ic-gray-950/10 dark:ring-ic-gray-50/10 z-10 mt-4 rounded-lg shadow-md ring-1 transition duration-200 ease-in-out data-[closed]:-translate-y-1 data-[closed]:opacity-0 dark:bg-zinc-900'
      >
        <div className='flex flex-col gap-6 p-6'>
          {navigation
            .filter((item) => item.isMoreNavLink)
            .map((item) => (
              <HeaderLink key={item.name} label={item.name} href={item.href} />
            ))}
        </div>
      </PopoverPanel>
    </Popover>
  )
}
