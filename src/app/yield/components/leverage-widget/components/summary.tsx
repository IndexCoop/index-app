import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid'

import { useLeverageToken } from '@/app/leverage/provider'
import { GasFees } from '@/components/gas-fees'
import { StyledSkeleton } from '@/components/skeleton'

import { useFormattedLeverageData } from '../../../use-formatted-data'

type SummaryQuoteProps = {
  label: string
  value: string
  valueUsd: string
}

function SummaryQuote(props: SummaryQuoteProps) {
  return (
    <div className='text-ic-gray-300 flex flex-row items-center justify-between text-xs'>
      <div className='font-medium'>{props.label}</div>
      <div className='flex flex-row gap-1'>
        <div className='text-ic-white font-bold'>{props.value}</div>
        <div className='font-normal'>{props.valueUsd}</div>
      </div>
    </div>
  )
}

export function Summary() {
  const { stats } = useLeverageToken()
  const {
    gasFeesEth,
    gasFeesUsd,
    inputAmount,
    inputAmoutUsd,
    isFetchingQuote,
    ouputAmount,
    outputAmountUsd,
    shouldShowSummaryDetails,
  } = useFormattedLeverageData(stats)
  if (!shouldShowSummaryDetails && !isFetchingQuote) return null
  return (
    <Disclosure as='div' className='rounded-xl border border-[#3A6060]'>
      {({ open }) => (
        <div className='p-4'>
          <dt>
            <Disclosure.Button className='text-ic-gray-300 flex w-full items-center justify-between text-left'>
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
                    styles={{ valueUsdTextColor: 'text-ic-gray-300' }}
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
                <div className='text-ic-gray-300 flex flex-row items-center justify-between text-xs'>
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
