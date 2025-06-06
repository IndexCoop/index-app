import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid'

import { GasFees } from '@/components/gas-fees'
import { StyledSkeleton } from '@/components/skeleton'
import { cn } from '@/lib/utils/tailwind'

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/tooltip'
import type { ReactNode } from 'react'

import { useEarnContext } from '../../../provider'
import { useFormattedEarnData } from '../../../use-formatted-data'

type SummaryQuoteProps = {
  label: ReactNode
  value: string
  valueUsd: string
  percentageColor?: string
  italic?: boolean
}

function SummaryQuote(props: SummaryQuoteProps) {
  const { italic } = props
  return (
    <div
      className={cn(
        'flex flex-row items-center justify-between text-xs',
        italic ? 'italic text-neutral-500' : 'text-neutral-400',
      )}
    >
      <div className={cn(italic ? 'font-medium' : 'font-bold')}>
        {props.label}
      </div>
      <div className='flex flex-row gap-1'>
        <div className={cn(italic ? 'font-normal' : 'text-ic-white font-bold')}>
          {props.value}
        </div>
        <div className={cn('font-normal', props.percentageColor ?? '')}>
          {props.valueUsd}
        </div>
      </div>
    </div>
  )
}

export function Summary() {
  const { isMinting } = useEarnContext()
  const {
    gasFeesEth,
    gasFeesUsd,
    inputAmount,
    inputAmoutUsd,
    inputValueFormatted,
    inputValueFormattedUsd,
    isFetchingQuote,
    isFavourableQuote,
    outputAmount,
    outputAmountUsd,
    quoteAmount,
    quoteAmountUsd,
    orderFee,
    orderFeePercent,
    priceImpactPercent,
    priceImpactUsd,
    shouldShowSummaryDetails,
    shouldShowWarning,
  } = useFormattedEarnData()

  if (!shouldShowSummaryDetails && !isFetchingQuote) return null

  return (
    <Disclosure as='div' className='rounded-lg border border-neutral-700'>
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
                  `Receive ${isMinting ? outputAmount : quoteAmount}`}
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
                  label={isMinting ? 'Deposit' : 'Withdraw'}
                  value={inputValueFormatted}
                  valueUsd={`(${inputValueFormattedUsd})`}
                />
                {isMinting ? (
                  <SummaryQuote
                    label={
                      <Tooltip placement='top'>
                        <TooltipTrigger asChild>
                          <span className='border-ic-gray-400 cursor-default border-b border-dashed'>
                            Max amount spent
                          </span>
                        </TooltipTrigger>
                        <TooltipContent className='bg-ic-white text-ic-gray-600 flex justify-between rounded-md px-4 py-3 text-left text-[11px] font-medium'>
                          This is the maximum amount you are going to spend. If
                          the price slips any further, your transaction will
                          revert.
                        </TooltipContent>
                      </Tooltip>
                    }
                    value={inputAmount}
                    valueUsd={`(${inputAmoutUsd})`}
                    italic
                  />
                ) : (
                  <SummaryQuote
                    label={
                      <Tooltip placement='top'>
                        <TooltipTrigger asChild>
                          <span className='border-ic-gray-400 cursor-default border-b border-dashed'>
                            Min amount received
                          </span>
                        </TooltipTrigger>
                        <TooltipContent className='bg-ic-white text-ic-gray-600 flex justify-between rounded-md px-4 py-3 text-left text-[11px] font-medium'>
                          This is the minimum amount you are guaranteed to
                          receive. If the price slips any further, your
                          transaction will revert.
                        </TooltipContent>
                      </Tooltip>
                    }
                    value={outputAmount}
                    valueUsd={`(${outputAmountUsd})`}
                    italic
                  />
                )}
                <SummaryQuote
                  label='Receive'
                  value={isMinting ? outputAmount : quoteAmount}
                  valueUsd={`(${isMinting ? outputAmountUsd : quoteAmountUsd})`}
                />
                <div className='my-1 border-t border-neutral-700' />
                <SummaryQuote
                  label={
                    <Tooltip placement='top'>
                      <TooltipTrigger asChild>
                        <span className='cursor-default border-b border-dashed border-neutral-400'>
                          Swap Execution
                        </span>
                      </TooltipTrigger>
                      <TooltipContent
                        className={
                          'bg-ic-white text-ic-gray-600 flex justify-between rounded-md px-4 py-3 text-left text-[11px] font-medium'
                        }
                      >
                        Swap execution cost includes liquidity pool fees and
                        price impact. This value can be negative, resulting in a
                        more favorable trade.
                      </TooltipContent>
                    </Tooltip>
                  }
                  value={priceImpactUsd}
                  valueUsd={priceImpactPercent}
                  percentageColor={
                    shouldShowWarning
                      ? 'text-ic-yellow'
                      : isFavourableQuote
                        ? 'text-ic-green'
                        : undefined
                  }
                />
                <SummaryQuote
                  label={
                    <Tooltip placement='top'>
                      <TooltipTrigger asChild>
                        <span className='cursor-default border-b border-dashed border-neutral-400'>
                          Order Fee
                        </span>
                      </TooltipTrigger>
                      <TooltipContent
                        className={
                          'bg-ic-white text-ic-gray-600 flex justify-between rounded-md px-4 py-3 text-left text-[11px] font-medium'
                        }
                      >
                        The fee Index Coop is charging for your transaction.
                      </TooltipContent>
                    </Tooltip>
                  }
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
