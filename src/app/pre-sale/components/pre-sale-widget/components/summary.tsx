import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid'

export function Summary() {
  return (
    <Disclosure as='div' className='rounded-xl border border-[#3A6060]'>
      {({ open }) => (
        <div className='p-4'>
          <dt>
            <Disclosure.Button className='text-ic-gray-300 flex w-full items-center justify-between text-left'>
              <span className='text-xs font-medium'>
                {open ? 'Summary' : ''}
              </span>
              <span className='ml-6 flex h-7 items-center'>
                {open ? (
                  <ChevronUpIcon className='h-6 w-6' aria-hidden='true' />
                ) : (
                  <ChevronDownIcon className='h-6 w-6' aria-hidden='true' />
                )}
              </span>
            </Disclosure.Button>
          </dt>
          <Disclosure.Panel as='dd' className='mt-2 pr-12'>
            <p className='text-ic-gray-600 text-sm font-medium leading-6'>
              {''}
            </p>
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  )
}
