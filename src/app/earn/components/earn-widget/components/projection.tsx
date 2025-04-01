import { ArrowLongRightIcon } from '@heroicons/react/20/solid'
import { FC } from 'react'
import { formatUnits } from 'viem'

import { GetApiV2ProductsEarn200 } from '@/gen'
import { formatDollarAmount } from '@/lib/utils'
import { SkeletonLoader } from '@/lib/utils/skeleton-loader'
import { cn } from '@/lib/utils/tailwind'

export type ProjectionProps = {
  amount: string
  inputAmountUsd: number
  balance: bigint
  product?: GetApiV2ProductsEarn200[number]
  isQuoteLoading: boolean
  isMinting: boolean
}

const calculateProjection = (
  inputAmountUsd: number,
  balanceUsd: number,
  isMinting: boolean,
) => {
  if (!inputAmountUsd || inputAmountUsd === 0) return balanceUsd

  try {
    if (!isMinting && inputAmountUsd > balanceUsd) {
      return 0
    }

    return isMinting ? balanceUsd + inputAmountUsd : balanceUsd - inputAmountUsd
  } catch (error) {
    console.error('Error in calculation:', error)
    return balanceUsd
  }
}

const calculateYield = (balanceUsd: number, apy: number) => {
  const monthlyYield = Math.max(0, (balanceUsd * apy) / 12 / 100)
  const yearlyYield = Math.max(0, (balanceUsd * apy) / 100)
  return { monthlyYield, yearlyYield }
}

export const Projection: FC<ProjectionProps> = ({
  amount = '0',
  inputAmountUsd = 0,
  isMinting,
  balance,
  product,
  isQuoteLoading,
}) => {
  if (!product) return null

  const balanceUsd = Number(formatUnits(balance, 18)) * product.metrics.nav
  const hasZeroBalance = balanceUsd === 0

  const { monthlyYield, yearlyYield } = calculateYield(
    balanceUsd,
    product.metrics.apy30d,
  )

  const projectedBalanceUsd = calculateProjection(
    inputAmountUsd,
    balanceUsd,
    isMinting,
  )

  const showSameValue = !amount || amount === '0'

  const {
    monthlyYield: projectedMonthlyYield,
    yearlyYield: projectedYearlyYield,
  } = calculateYield(projectedBalanceUsd, product.metrics.apy30d)

  const formattedBalance = formatDollarAmount(balanceUsd, true, 2)
  const formattedProjectedBalance = formatDollarAmount(
    projectedBalanceUsd,
    true,
    2,
  )

  return (
    <div className='flex flex-col gap-3 rounded-lg bg-zinc-800 p-4'>
      <div className='flex items-center justify-between gap-2'>
        <p className='text-xs text-neutral-400'>My Position</p>
        <div className='flex items-center gap-2 text-xs font-semibold text-neutral-50'>
          <p
            className={cn(
              !amount || amount === '0'
                ? 'text-neutral-50'
                : 'text-neutral-400',
            )}
          >
            {hasZeroBalance ? '$0' : formattedBalance}
          </p>
          {amount && amount !== '0' && (
            <>
              <ArrowLongRightIcon className='w-3' />
              <p className='text-neutral-50'>
                {isQuoteLoading ? (
                  <SkeletonLoader className='h-4 w-8 rounded-sm' />
                ) : showSameValue ? (
                  hasZeroBalance ? (
                    '$0'
                  ) : (
                    formattedBalance
                  )
                ) : projectedBalanceUsd === 0 ? (
                  '$0'
                ) : (
                  formattedProjectedBalance
                )}
              </p>
            </>
          )}
        </div>
      </div>
      <div className='flex items-center justify-between gap-2'>
        <p className='text-xs text-neutral-400'>Projected Earnings / Month</p>
        <div className='flex items-center gap-2 text-xs font-semibold text-neutral-50'>
          <p
            className={cn(
              !amount || amount === '0'
                ? 'text-neutral-50'
                : 'text-neutral-400',
            )}
          >
            {hasZeroBalance ? '$0' : formatDollarAmount(monthlyYield, true, 2)}
          </p>
          {amount && amount !== '0' && (
            <>
              <ArrowLongRightIcon className='w-3' />
              <p className='text-neutral-50'>
                {isQuoteLoading ? (
                  <SkeletonLoader className='h-4 w-8 rounded-sm' />
                ) : showSameValue ? (
                  hasZeroBalance ? (
                    '$0'
                  ) : (
                    formatDollarAmount(monthlyYield, true, 2)
                  )
                ) : projectedMonthlyYield === 0 ? (
                  '$0'
                ) : (
                  formatDollarAmount(projectedMonthlyYield, true, 2)
                )}
              </p>
            </>
          )}
        </div>
      </div>
      <div className='flex items-center justify-between gap-2'>
        <p className='text-xs text-neutral-400'>Projected Earnings / Year</p>
        <div className='flex items-center gap-2 text-xs font-semibold text-neutral-50'>
          <p
            className={cn(
              !amount || amount === '0'
                ? 'text-neutral-50'
                : 'text-neutral-400',
            )}
          >
            {hasZeroBalance ? '0' : formatDollarAmount(yearlyYield, true, 2)}
          </p>
          {amount && amount !== '0' && (
            <>
              <ArrowLongRightIcon className='w-3' />
              <p className='text-neutral-50'>
                {isQuoteLoading ? (
                  <SkeletonLoader className='h-4 w-8 rounded-sm' />
                ) : showSameValue ? (
                  hasZeroBalance ? (
                    '$0'
                  ) : (
                    formatDollarAmount(yearlyYield, true, 2)
                  )
                ) : projectedYearlyYield === 0 ? (
                  '$0'
                ) : (
                  formatDollarAmount(projectedYearlyYield, true, 2)
                )}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
