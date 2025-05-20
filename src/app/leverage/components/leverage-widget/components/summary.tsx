import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid'

import { GasFees } from '@/components/gas-fees'
import { StyledSkeleton } from '@/components/skeleton'
import { cn } from '@/lib/utils/tailwind'

import { useLeverageToken } from '../../../provider'
import { useFormattedLeverageData } from '../../../use-formatted-data'

type SummaryQuoteProps = {
  label: string
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
                    label={'Max amount paid'}
                    value={inputAmount}
                    valueUsd={`(${inputAmoutUsd})`}
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
                    label={'Min amount received'}
                    value={outputAmount}
                    valueUsd={`(${outputAmountUsd})`}
                    italic
                  />
                )}
                <div className='my-1 border-t border-neutral-700' />
                <SummaryQuote
                  label='Swap Execution'
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
                  label='Order Fee'
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
