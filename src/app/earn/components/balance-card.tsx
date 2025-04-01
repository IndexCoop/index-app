import {
  getTokenByChainAndAddress,
  isAddressEqual,
} from '@indexcoop/tokenlists'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useMemo } from 'react'
import { formatUnits } from 'viem'

import { GetApiV2ProductsEarn200 } from '@/gen'
import { TokenBalance } from '@/lib/hooks/use-balance'
import { formatAmount } from '@/lib/utils'

const BoxedData = ({ label, value }: { label: string; value: string }) => (
  <div className='flex items-center justify-end gap-2'>
    <p className='text-xs font-medium text-neutral-400'>{label}</p>
    <div className='w-20 rounded-[4px] bg-neutral-600 px-3 py-1'>
      <p className='text-center text-xs font-bold text-neutral-50'>{value}</p>
    </div>
  </div>
)

const Position = ({
  balance,
  product,
}: {
  balance: TokenBalance
  product?: GetApiV2ProductsEarn200[number]
}) => {
  const token = useMemo(
    () => getTokenByChainAndAddress(product?.chainId, product?.tokenAddress),
    [product],
  )

  return product && token ? (
    <Link prefetch href={`/earn/product/${product.tokenAddress}`}>
      <motion.div
        whileHover={{
          scale: 1.01,
        }}
        className='flex cursor-pointer items-center justify-between rounded-[4px] bg-zinc-800 p-4 hover:bg-zinc-700 hover:text-neutral-900'
      >
        <p className='text-xs font-medium text-neutral-200'>{product.name}</p>
        <p className='text-xs font-medium text-neutral-200'>
          $
          {formatAmount(
            Number(formatUnits(balance.value, token.decimals)) *
              product.metrics.nav,
          )}
        </p>
      </motion.div>
    </Link>
  ) : (
    <></>
  )
}

const calculateEffectiveAPY = (
  products: GetApiV2ProductsEarn200,
  balances: TokenBalance[],
) => {
  let totalValue = 0
  let weightedAPYsum = 0

  balances.forEach((balance) => {
    const product = products.find((p) =>
      isAddressEqual(p.tokenAddress, balance.token),
    )
    const token = getTokenByChainAndAddress(
      product?.chainId,
      product?.tokenAddress,
    )

    if (product && token) {
      const positionValue =
        Number(formatUnits(balance.value, token.decimals)) * product.metrics.nav
      totalValue += positionValue
      weightedAPYsum += positionValue * product.metrics.apy
    }
  })

  if (totalValue === 0) return 0

  return weightedAPYsum / totalValue
}

export type BalanceCardProps = {
  products: GetApiV2ProductsEarn200
  balances: TokenBalance[]
}

export const BalanceCard = ({ products, balances }: BalanceCardProps) => {
  const deposits = useMemo(
    () =>
      balances.reduce((acc, curr) => {
        const product = products.find((p) =>
          isAddressEqual(p.tokenAddress, curr.token),
        )

        const token = getTokenByChainAndAddress(
          product?.chainId,
          product?.tokenAddress,
        )

        if (product && token) {
          return (
            acc +
            Number(formatUnits(curr.value, token.decimals)) *
              product.metrics.nav
          )
        }
        return acc
      }, 0),
    [products, balances],
  )

  return (
    <motion.div className='flex w-full flex-wrap gap-6 rounded-3xl border border-gray-600 border-opacity-[0.8] bg-zinc-900 p-6 sm:flex-nowrap'>
      <div className='w-full'>
        <h3 className='text-lg font-medium text-neutral-50'>My Earn</h3>
        <div className='mt-6'>
          <h4 className='ml-4 text-xs font-medium text-neutral-400'>
            My positions
          </h4>

          <div className='mt-2 flex w-full flex-col gap-2'>
            {balances.map((balance) => (
              <div key={balance.token}>
                <Position
                  product={products.find((p) =>
                    isAddressEqual(p.tokenAddress, balance.token),
                  )}
                  balance={balance}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className='flex w-full min-w-52 flex-col justify-between gap-6 md:w-52'>
        <div className='space-y-4 text-right'>
          <p className='text-xs font-medium text-neutral-200'>Total Deposits</p>
          <p className='text-5xl font-bold text-neutral-50'>
            ${formatAmount(deposits)}
          </p>
        </div>
        <div className='flex flex-col gap-1 '>
          <BoxedData
            label='Net APY'
            value={`${formatAmount(calculateEffectiveAPY(products, balances))}%`}
          />
          {/* <BoxedData label='Lifetime Earnings' value='$420.69' /> */}
        </div>
      </div>
    </motion.div>
  )
}
