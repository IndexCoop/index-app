'use client'

import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid'

const faqs = [
  {
    question: 'Why pre-sales?',
    answer:
      'The pre-sale process enables customers and early adopters to demonstrate tangible demand for a proposed product by depositing funds into the token before launch. This way, Index Coop will allocate development resources only to products that quantifiably serve a need for enough customers while supporting early adopters. Additionally, the pre-sales will bootstrap initial TVL and liquidity for our new products, giving them a better chance at being adopted by the market.',
  },
  {
    question: 'How does it work?',
    answer:
      'Each pre-sale will have a pre-defined deposit threshold that must be met within a specified amount of time to determine whether or not the product is formally launched. If the pre-sale threshold is met the token will be formally launched and depositors will get product revenue tokens via an airdrop. PRTs distribute an Index products’ revenue amongst all PRT holders by staking PRTs in the respective IC product revenue pool.* If the pre-sale threshold is not met within the timeframe, your deposits will be returned alongside an $INDEX reward.',
  },
  {
    question: 'How high are my rewards?',
    answer:
      'Depending on wether the deposit threshold has been met, you will either receive product revenue tokens or $INDEX rewards. The $INDEX rewards are specified in each presale on the list above. The amount of PRTs distributed will be set per day and PRT rewards will be calculated on a pro rate basis amongst all depositors. The amount of PRT tokens given out for each pre-sale can vary by product. For each product there will be a total of 10,000 PRTs which will share the respective token’s revenue.',
  },
  {
    question: 'Will my funds be locked up?',
    answer:
      'No. You can withdraw your deposit at any time. If you choose to keep your funds deposited after a successful pre-sale is completed, they will automatically convert into the new token, which will be tradable via our app.',
  },
]

export function FaqSection() {
  return (
    <div className='max-w-5xl divide-y divide-ic-gray-900/10'>
      <h2 className='text-xl font-semibold leading-10 tracking-tight text-ic-gray-800'>
        FAQ
      </h2>
      <dl className='mt-6 space-y-6 divide-y divide-ic-gray-900/10'>
        {faqs.map((faq) => (
          <Disclosure as='div' key={faq.question} className='pt-6'>
            {({ open }) => (
              <>
                <dt>
                  <Disclosure.Button className='flex w-full items-start justify-between text-left text-ic-gray-800'>
                    <span className='text-base font-semibold leading-7'>
                      {faq.question}
                    </span>
                    <span className='ml-6 flex h-7 items-center'>
                      {open ? (
                        <ChevronUpIcon className='h-6 w-6' aria-hidden='true' />
                      ) : (
                        <ChevronDownIcon
                          className='h-6 w-6'
                          aria-hidden='true'
                        />
                      )}
                    </span>
                  </Disclosure.Button>
                </dt>
                <Disclosure.Panel as='dd' className='mt-2 pr-12'>
                  <p className='text-sm leading-6 text-ic-gray-600 font-medium'>
                    {faq.answer}
                  </p>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        ))}
      </dl>
    </div>
  )
}
