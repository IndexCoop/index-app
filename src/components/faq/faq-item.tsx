'use client'

import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
  question: string
}

export function FaqItem({ children, question }: Props) {
  return (
    <Disclosure as='div' key={question} className='pt-6'>
      {({ open }) => (
        <>
          <dt>
            <Disclosure.Button className='text-ic-gray-800 dark:text-ic-gray-100 flex w-full items-start justify-between text-left'>
              <span className='text-base font-semibold leading-7'>
                {question}
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
          <Disclosure.Panel
            as='dd'
            className='text-ic-gray-600 dark:text-ic-gray-300 mt-2 space-y-2 pr-12 text-sm font-medium leading-6'
          >
            {children}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
