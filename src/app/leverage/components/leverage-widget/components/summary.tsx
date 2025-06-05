import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid'

import { GasFees } from '@/components/gas-fees'
import { StyledSkeleton } from '@/components/skeleton'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/tooltip'
import { cn } from '@/lib/utils/tailwind'

import { useLeverageToken } from '../../../provider'
import { useFormattedLeverageData } from '../../../use-formatted-data'

import type { ReactNode } from 'react'

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
  const { isMinting } = useLeverageToken()
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
  } = useFormattedLeverageData()

  if (!shouldShowSummaryDetails && !isFetchingQuote) return null
  return (
    <Disclosure as='div' className='rounded-lg border border-neutral-700'>
      {({ open }) => (
        <div className='p-4'>
          <dt>
            <Disclosure.Button className='flex w-full items-center justify-between text-left text-neutral-400'>
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
                    styles={{ valueUsdTextColor: 'text-neutral-400' }}
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
                  value={isMinting ? quoteAmount : inputAmount}
                  valueUsd={`(${isMinting ? quoteAmountUsd : inputAmoutUsd})`}
                />
                {isMinting && (
                  <SummaryQuote
                    label={
                      <Tooltip placement='top'>
                        <TooltipTrigger asChild>
                          <span className='cursor-default border-b border-dashed border-neutral-500'>
                            Max amount paid
                          </span>
                        </TooltipTrigger>
                        <TooltipContent
                          className={
                            'bg-ic-white text-ic-gray-600 flex justify-between rounded-md px-4 py-3 text-left text-[11px] font-medium'
                          }
                        >
                          This is the maximum amount you are going to spend. If
                          the price slips any further, your transaction will
                          revert.
                        </TooltipContent>
                      </Tooltip>
                    }
                    value={inputValueFormatted}
                    valueUsd={`(${inputValueFormattedUsd})`}
                    italic
                  />
                )}
                <SummaryQuote
                  label='Receive'
                  value={isMinting ? outputAmount : quoteAmount}
                  valueUsd={`(${isMinting ? outputAmountUsd : quoteAmountUsd})`}
                />
                {!isMinting && (
                  <SummaryQuote
                    label={
                      <Tooltip placement='top'>
                        <TooltipTrigger asChild>
                          <span className='cursor-default border-b border-dashed border-neutral-500'>
                            Min amount received
                          </span>
                        </TooltipTrigger>
                        <TooltipContent
                          className={
                            'bg-ic-white text-ic-gray-600 flex justify-between rounded-md px-4 py-3 text-left text-[11px] font-medium'
                          }
                        >
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
                <div className='flex flex-row items-center justify-between text-xs text-neutral-400'>
                  <div className='font-normal'>Network Fee</div>
                  <div>
                    <GasFees valueUsd={gasFeesUsd} value={gasFeesEth} />
                  </div>
                </div>
                {/* <div className='text-ic-gray-300 flex flex-row items-center justify-between text-xs'>
                  <Tooltip placement='bottom'>
                    <TooltipTrigger>
                      <div className='border-ic-gray-200 cursor-default border-b border-dashed font-normal'>
                        Fees
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className='bg-ic-white mt-2 w-60 rounded px-5 py-2 text-xs font-medium drop-shadow'>
                      {
                        <div className='flex flex-col'>
                          <div className='flex border-b border-[#CDDFDF] py-2'>
                            <div className='text-ic-gray-600'>Fees</div>
                          </div>
                          <div className='flex py-2'>
                            <div className='text-ic-gray-600'>
                              Open / close fee
                            </div>
                            <div className='text-ic-gray-900 ml-auto'>
                              {formatPercentage(0.001)}
                            </div>
                          </div>
                        </div>
                      }
                    </TooltipContent>
                  </Tooltip>
                  <div>
                    {inputTokenAmountUsd
                      ? formatDollarAmount(Number(inputTokenAmountUsd) * 0.001)
                      : ''}
                  </div>
                </div> */}
              </>
            )}
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  )
}
