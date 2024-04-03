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
      'There is a fixed supply of 10,000 PRTs for all products with PRTs. The presale will show how many PRTs will be distributed in the event of a success, meeting the threshold by the deadline. For example, if 3,000 PRTs are distributed in the presale, 30% are allocated for presale depositors.\nEach presale will have a distribution curve for PRTs, and the distribution curve determines your rewards. You can track your amount of PRTs earned in the staking widget. Typically, the more you deposit and the earlier you deposit, the higher your PRT allocation will be. Still, other factors exist, such as the total amount of capital deposited during the presale.',
  },
  {
    question: 'Will my funds be locked up?',
    answer:
      'No, you may withdraw at any time during and after a pre-sale. However, if you withdraw before a pre-sale is completed, you forfeit any accrued PRT rewards. Pre-sales may require participants to maintain deposits for a specified amount of time to be eligible for PRT staking also.\nIf a pre-sale is successful, your original deposit will be transformed into the ultimate product token, so no action will be required. At that point, the product token will be tradeable via the Index Coop app.',
  },
]

export function FaqSection() {
  return (
    <div className='divide-ic-gray-900/10 max-w-5xl divide-y'>
      <h2 className='text-ic-gray-800 text-xl font-semibold leading-10 tracking-tight'>
        FAQ
      </h2>
      <dl className='divide-ic-gray-900/10 mt-6 space-y-6 divide-y'>
        {faqs.map((faq) => {
          const answerParagraphs = faq.answer.split('\n')
          return (
            <Disclosure as='div' key={faq.question} className='pt-6'>
              {({ open }) => (
                <>
                  <dt>
                    <Disclosure.Button className='text-ic-gray-800 flex w-full items-start justify-between text-left'>
                      <span className='text-base font-semibold leading-7'>
                        {faq.question}
                      </span>
                      <span className='ml-6 flex h-7 items-center'>
                        {open ? (
                          <ChevronUpIcon
                            className='h-6 w-6'
                            aria-hidden='true'
                          />
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
                    <p className='text-ic-gray-600 text-sm font-medium leading-6'>
                      {answerParagraphs.map((paragraph, index) => (
                        <p className='mb-2' key={index}>
                          {paragraph}
                        </p>
                      ))}
                    </p>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          )
        })}
      </dl>
    </div>
  )
}
