import { ArrowLongRightIcon } from '@heroicons/react/20/solid'
import { FC } from 'react'
import { formatUnits } from 'viem'

import { GetApiV2ProductsEarn200 } from '@/gen'
import { formatDollarAmount } from '@/lib/utils'

export type ProjectionProps = {
  amount: string
  balance: bigint
  product?: GetApiV2ProductsEarn200[number]
  isMinting: boolean
}

const calculateProjection = (
  amount: string,
  balance: bigint,
  isMinting: boolean,
) => {
  if (!amount || amount === '0') return balance

  try {
    // Convert to ethers unit (handle decimal strings by parsing as float and scaling to wei)
    const amountFloat = parseFloat(amount)
    if (isNaN(amountFloat)) return balance

    const amountWei = BigInt(Math.floor(amountFloat * 10 ** 18))

    return isMinting ? balance + amountWei : balance - amountWei
  } catch (error) {
    console.error('Error converting amount to BigInt:', error)
    return balance
  }
}

const calculateYield = (balance: bigint, nav: number, apy: number) => {
  const balanceNum = Number(formatUnits(balance, 18))
  const valueUSD = balanceNum * nav
  const monthlyYield = (valueUSD * apy) / 12 / 100
  const yearlyYield = (valueUSD * apy) / 100
  return { monthlyYield, yearlyYield }
}

export const Projection: FC<ProjectionProps> = ({
  amount = '0',
  isMinting,
  balance,
  product,
}) => {
  if (!product) return null

  const hasZeroBalance = balance === BigInt(0)

  // Calculate yield based on current balance
  const { monthlyYield, yearlyYield } = calculateYield(
    balance,
    product.metrics.nav,
    product.metrics.apy30d,
  )

  const projectedBalance = calculateProjection(amount, balance, isMinting)
  const showSameValue = !amount || amount === '0'

  // Calculate yield based on projected balance
  const {
    monthlyYield: projectedMonthlyYield,
    yearlyYield: projectedYearlyYield,
  } = calculateYield(
    projectedBalance,
    product.metrics.nav,
    product.metrics.apy30d,
  )

  const formattedBalance = formatDollarAmount(
    Number(formatUnits(balance, 18)) * product.metrics.nav,
    true,
    2,
  )
  const formattedProjectedBalance = formatDollarAmount(
    Number(formatUnits(projectedBalance, 18)) * product.metrics.nav,
    true,
    2,
  )

  return (
    <div className='flex flex-col gap-3 rounded-lg bg-zinc-800 p-4'>
      <div className='flex items-center justify-between gap-2'>
        <p className='text-xs text-neutral-400'>My Position ({product.name})</p>
        <div className='flex items-center gap-2 text-xs font-semibold text-neutral-50'>
          <p className='text-neutral-400'>
            {hasZeroBalance ? '0' : formattedBalance}
          </p>
          <ArrowLongRightIcon className='w-3' />
          <p className='text-neutral-50'>
            {showSameValue
              ? hasZeroBalance
                ? '0'
                : formattedBalance
              : formattedProjectedBalance}
          </p>
        </div>
      </div>
      <div className='flex items-center justify-between gap-2'>
        <p className='text-xs text-neutral-400'>Projected Earnings / Month</p>
        <div className='flex items-center gap-2 text-xs font-semibold text-neutral-50'>
          <p className='text-neutral-400'>
            {hasZeroBalance ? '0' : formatDollarAmount(monthlyYield, true, 2)}
          </p>
          <ArrowLongRightIcon className='w-3' />
          <p className='text-neutral-50'>
            {showSameValue
              ? hasZeroBalance
                ? '0'
                : formatDollarAmount(monthlyYield, true, 2)
              : formatDollarAmount(projectedMonthlyYield, true, 2)}
          </p>
        </div>
      </div>
      <div className='flex items-center justify-between gap-2'>
        <p className='text-xs text-neutral-400'>
          Projected Earnings / Year (USD)
        </p>
        <div className='flex items-center gap-2 text-xs font-semibold text-neutral-50'>
          <p className='text-neutral-400'>
            {hasZeroBalance ? '0' : formatDollarAmount(yearlyYield, true, 2)}
          </p>
          <ArrowLongRightIcon className='w-3' />
          <p className='text-neutral-50'>
            {showSameValue
              ? hasZeroBalance
                ? '0'
                : formatDollarAmount(yearlyYield, true, 2)
              : formatDollarAmount(projectedYearlyYield, true, 2)}
          </p>
        </div>
      </div>
    </div>
  )
}
