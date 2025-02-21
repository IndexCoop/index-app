import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid'

import { useEarnContext } from '@/app/earn/provider'
import { GasFees } from '@/components/gas-fees'
import { StyledSkeleton } from '@/components/skeleton'

import { useFormattedEarnData } from '../../../use-formatted-data'

type SummaryQuoteProps = {
  label: string
  value: string
  valueUsd: string
}

function SummaryQuote(props: SummaryQuoteProps) {
  return (
    <div className='text-ic-gray-600 dark:text-ic-gray-300 flex flex-row items-center justify-between text-xs'>
      <div className='font-medium'>{props.label}</div>
      <div className='flex flex-row gap-1'>
        <div className='text-ic-black dark:text-ic-white font-bold'>
          {props.value}
        </div>
        <div className='font-normal'>{props.valueUsd}</div>
      </div>
    </div>
  )
}

export function Summary() {
  const { quoteResult } = useEarnContext()
  const {
    gasFeesEth,
    gasFeesUsd,
    inputAmount,
    inputAmoutUsd,
    isFetchingQuote,
    ouputAmount,
    outputAmountUsd,
    shouldShowSummaryDetails,
  } = useFormattedEarnData()

  if (!shouldShowSummaryDetails && !isFetchingQuote) return null

  const quote = quoteResult?.quote

  const orderFee =
    !quote || quote.fees === null
      ? ''
      : (quote.isMinting ? quote.fees.mintUsd : quote.fees.redeemUsd).toFixed(2)
  const orderFeePercent =
    !quote || quote.fees === null
      ? ''
      : (
          (quote.isMinting ? quote.fees.mint : quote.fees.redeem) * 100
        ).toString()

  console.log(orderFee, orderFeePercent, 'orderFee')

  return (
    <Disclosure
      as='div'
      className='border-ic-gray-100 rounded-lg border dark:border-[#3A6060]'
    >
      {({ open }) => (
        <div className='p-4'>
          <dt>
            <Disclosure.Button className='text-ic-gray-600 dark:text-ic-gray-300 flex w-full items-center justify-between text-left'>
              <span className='text-xs font-medium'>
                {open && 'Summary'}
                {!open && isFetchingQuote && <StyledSkeleton width={120} />}
                {!open &&
                  !isFetchingQuote &&
                  shouldShowSummaryDetails &&
                  `Receive ${ouputAmount}`}
              </span>
              <div className='flex flex-row items-center gap-1'>
                {!open && !isFetchingQuote ? (
                  <GasFees
                    valueUsd={gasFeesUsd}
                    styles={{
                      valueUsdTextColor:
                        'text-ic-gray-600 dark:text-ic-gray-300',
                    }}
                  />
                ) : null}
                {!open && isFetchingQuote && <StyledSkeleton width={70} />}
                <span className='flex items-center'>
                  {open ? (
                    <ChevronUpIcon className='h-6 w-6' aria-hidden='true' />
                  ) : (
                    <ChevronDownIcon className='h-6 w-6' aria-hidden='true' />
                  )}
                </span>
              </div>
            </Disclosure.Button>
          </dt>
          <Disclosure.Panel as='dd' className='mt-2 flex flex-col gap-2'>
            {shouldShowSummaryDetails && (
              <>
                <SummaryQuote
                  label='Pay'
                  value={inputAmount}
                  valueUsd={`(${inputAmoutUsd})`}
                />
                <SummaryQuote
                  label='Receive'
                  value={ouputAmount}
                  valueUsd={`(${outputAmountUsd})`}
                />
                <SummaryQuote
                  label='Swap Execution Cost'
                  value={`$${quote?.priceImpactUsd?.toFixed(2) ?? ''}`}
                  valueUsd={`(${quote?.priceImpactPercent?.toFixed(2) ?? ''}%)`}
                />
                <SummaryQuote
                  label='Order Fee'
                  value={orderFee}
                  valueUsd={`(${orderFeePercent}%)`}
                />
                <div className='text-ic-gray-600 dark:text-ic-gray-300 flex flex-row items-center justify-between text-xs'>
                  <div className='font-normal'>Network Fee</div>
                  <div>
                    <GasFees valueUsd={gasFeesUsd} value={gasFeesEth} />
                  </div>
                </div>
              </>
            )}
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  )
}
