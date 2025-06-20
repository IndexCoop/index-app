import { Button } from '@headlessui/react'
import {
  getTokenByChainAndAddress,
  isAddressEqual,
} from '@indexcoop/tokenlists'
import Image from 'next/image'
import Link from 'next/link'
import { FC, useMemo, useState } from 'react'
import { formatUnits } from 'viem'

import { GetApiV2ProductsEarn200, GetApiV2UserAddressPositions200 } from '@/gen'
import { TokenBalance } from '@/lib/hooks/use-balance'
import { formatAmount } from '@/lib/utils'
import { SkeletonLoader } from '@/lib/utils/skeleton-loader'
import { cn } from '@/lib/utils/tailwind'

const DenominatorSwitch: FC<{
  selected: 'fiat' | 'eth'
  onSelect: (denominator: 'fiat' | 'eth') => void
}> = ({ selected, onSelect }) => {
  return (
    <Button
      className='relative flex items-center gap-1 rounded-2xl bg-zinc-800 px-1 py-0.5'
      onClick={() => onSelect(selected === 'fiat' ? 'eth' : 'fiat')}
    >
      <div
        className={cn(
          'absolute inset-0 z-10 h-5 w-6 translate-x-1 translate-y-0.5 rounded-2xl bg-zinc-600 transition-all duration-300 ease-in-out',
          selected === 'eth' && 'translate-x-8',
        )}
      />
      <div className='z-20 cursor-pointer rounded-2xl px-2 py-0.5 '>
        <Image src='/assets/fiat.svg' width={8} height={8} alt='' />
      </div>
      <div className='z-20 cursor-pointer rounded-2xl px-2 py-0.5'>
        <Image
          src='/assets/ethereum-network-logo.svg'
          width={8}
          height={8}
          alt=''
        />
      </div>
    </Button>
  )
}

const Position: FC<{
  balance: TokenBalance
  product?: GetApiV2ProductsEarn200[number]
  position?: GetApiV2UserAddressPositions200[number]
  isLoading?: boolean
  denominator: 'fiat' | 'eth'
}> = ({ balance, product, position, isLoading, denominator }) => {
  const token = useMemo(
    () => getTokenByChainAndAddress(product?.chainId, product?.tokenAddress),
    [product],
  )

  const accruedYield = useMemo(() => {
    if (!product || !token) return 0

    if (position && position.metrics) {
      return denominator === 'fiat'
        ? (position.metrics.endingUnits ?? 0) * product.metrics.nav -
            (position.metrics.endingPositionCost ?? 0)
        : ((position.metrics.endingUnits ?? 0) * product.metrics.nav -
            (position.metrics.endingPositionCost ?? 0)) /
            product.metrics.nav
    }
    return 0
  }, [product, token, position, denominator])

  return product && token ? (
    <Link prefetch={true} href={`/earn/product/${product.tokenAddress}`}>
      <div className='grid cursor-pointer grid-cols-[1fr_0.3fr_0.3fr] items-center gap-4 rounded-[4px] bg-zinc-800 p-4 hover:bg-zinc-700 hover:text-neutral-900'>
        <span className='text-left text-xs font-medium text-neutral-200'>
          {product.name}
        </span>
        <span className='text-right text-xs font-medium text-neutral-200'>
          {denominator === 'fiat' ? '$' : 'Ξ'}
          {formatAmount(
            denominator === 'fiat'
              ? Number(formatUnits(balance.value, token.decimals)) *
                  product.metrics.nav
              : (Number(formatUnits(balance.value, token.decimals)) *
                  product.metrics.nav) /
                  product.metrics.nav,
            denominator === 'fiat' ? 2 : 6,
          )}
        </span>
        {isLoading ? (
          <SkeletonLoader className='ml-auto h-4 w-12' />
        ) : (
          <span className='text-right text-xs font-medium text-neutral-400'>
            {denominator === 'fiat' ? '$' : 'Ξ'}
            {formatAmount(accruedYield, denominator === 'fiat' ? 2 : 6)}
          </span>
        )}
      </div>
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
  positions: GetApiV2UserAddressPositions200
  balances: TokenBalance[]
  isLoading: boolean
}

export const BalanceCard = ({
  products,
  positions,
  balances,
  isLoading,
}: BalanceCardProps) => {
  const [denominator, setDenominator] = useState<'fiat' | 'eth'>('fiat')
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
            (denominator === 'fiat'
              ? Number(formatUnits(curr.value, token.decimals)) *
                product.metrics.nav
              : (Number(formatUnits(curr.value, token.decimals)) *
                  product.metrics.nav) /
                product.metrics.nav)
          )
        }
        return acc
      }, 0),
    [products, balances, denominator],
  )

  const accruedYield = useMemo(
    () =>
      products.reduce((acc, curr) => {
        const position = positions.find((p) =>
          isAddressEqual(p.metrics?.tokenAddress, curr.tokenAddress),
        )
        if (position && position.metrics) {
          return (
            acc +
            (denominator === 'fiat'
              ? (position.metrics.endingUnits ?? 0) * curr.metrics.nav -
                (position.metrics.endingPositionCost ?? 0)
              : ((position.metrics.endingUnits ?? 0) * curr.metrics.nav -
                  (position.metrics.endingPositionCost ?? 0)) /
                curr.metrics.nav)
          )
        }

        return acc
      }, 0),
    [products, positions, denominator],
  )

  return (
    <div className='flex w-full flex-wrap gap-6 rounded-3xl border border-gray-600 border-opacity-[0.8] bg-zinc-900 p-6 md:flex-nowrap'>
      <div className='min-w-0 flex-1'>
        <h3 className='text-lg font-medium text-neutral-50'>My Earn</h3>
        <div className='mt-6'>
          <div className='grid grid-cols-[1fr_0.3fr_0.3fr] items-center gap-4 px-4'>
            <h4 className='text-left text-xs font-medium text-neutral-400'>
              My positions
            </h4>
            <p className='text-right text-xs font-medium text-neutral-200'>
              Total deposited
            </p>
            <p className='text-right text-xs font-medium text-neutral-400'>
              Accrued yield
            </p>
          </div>

          <div className='mt-2 flex w-full flex-col gap-2'>
            {balances.map((balance) => (
              <div key={balance.token}>
                <Position
                  product={products.find((p) =>
                    isAddressEqual(p.tokenAddress, balance.token),
                  )}
                  balance={balance}
                  position={positions.find((p) =>
                    isAddressEqual(p.metrics?.tokenAddress, balance.token),
                  )}
                  isLoading={isLoading}
                  denominator={denominator}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className='flex w-full min-w-[200px] flex-col justify-between gap-6 md:w-auto'>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <p className='text-xs font-medium text-neutral-400'>
              Total Deposits
            </p>
            <DenominatorSwitch
              selected={denominator}
              onSelect={setDenominator}
            />
          </div>
          <p className='break-all text-5xl font-bold text-neutral-50'>
            {denominator === 'fiat' ? '$' : 'Ξ'}
            {formatAmount(deposits, denominator === 'fiat' ? 2 : 6)}
          </p>
        </div>
        <div className='flex gap-2'>
          <div
            className={cn('flex w-full flex-1 flex-col justify-center gap-2')}
          >
            <p className='text-center text-xs font-medium text-neutral-400'>
              Net APY
            </p>
            <div className={cn('w-full rounded-[4px] bg-zinc-800 px-8 py-4')}>
              <p className='text-center text-xs font-bold text-neutral-50'>
                {formatAmount(calculateEffectiveAPY(products, balances))}%
              </p>
            </div>
          </div>
          <div
            className={cn(
              'flex w-full flex-col justify-center gap-2',
              `flex-2`,
            )}
          >
            <p className='text-center text-xs font-medium text-neutral-400 md:text-right'>
              Accrued Yield
            </p>

            {isLoading ? (
              <SkeletonLoader className='w-full rounded-[4px] px-8 py-6' />
            ) : (
              <div
                className={cn(
                  'w-full rounded-[4px] bg-[linear-gradient(89deg,_#27272A_6.94%,_#2C3A3D_78.56%,_#75ABB2_147.99%)] px-8 py-4',
                )}
              >
                <p className='text-center text-xs font-bold text-neutral-50'>
                  {denominator === 'fiat' ? '$' : 'Ξ'}
                  {formatAmount(accruedYield, denominator === 'fiat' ? 2 : 6)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
