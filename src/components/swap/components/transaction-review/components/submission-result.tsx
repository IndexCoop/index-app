import { Button } from '@headlessui/react'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/20/solid'
import { getTokenByChainAndAddress, LeverageToken } from '@indexcoop/tokenlists'
import { useAtom } from 'jotai'
import Image from 'next/image'
import { useCallback, useMemo, useState } from 'react'

import { formatAmount } from '@/app/leverage/utils/currency'
import { calculateAverageEntryPrice } from '@/app/leverage/utils/fetch-leverage-token-prices'
import { leverageShortTypeMap } from '@/app/leverage/utils/get-leverage-type'
import { positionsAtom } from '@/app/store/positions-atom'
import { tradeAtom } from '@/app/store/trade-atom'
import { SkeletonLoader } from '@/lib/utils/skeleton-loader'
import { cn } from '@/lib/utils/tailwind'

const usePositionData = (transactionHash: string, onlyClose = true) => {
  const [{ history }] = useAtom(positionsAtom)

  const position = useMemo(
    () => history?.find((p) => p.hash === transactionHash),
    [history, transactionHash],
  )

  const positionData = useMemo(() => {
    if (!position || (onlyClose && position.trade?.transactionType === 'buy'))
      return null

    const _return = position.metrics?.totalReturnOfUnitsSold ?? 0
    const cost = position.metrics?.totalCostOfUnitsSold ?? 0

    const value = _return - cost
    const percentage = (value / cost) * 100
    const sign = Math.sign(value)

    const avgEntryPrices = calculateAverageEntryPrice(
      history.filter(
        (p) => p.metrics?.positionId === position.metrics?.positionId,
      ),
    )

    return {
      pnl: {
        value,
        percentage,
        sign,
      },
      avgEntryPrice: avgEntryPrices[position.metrics?.tokenAddress ?? ''] ?? 0,
    }
  }, [position, history, onlyClose])

  return positionData
}

const WaitingForConfirmation = ({ type }: { type: string }) => {
  return (
    <>
      <div className='border-ic-gray-700 border-b'>
        <div className='my-4 text-center'>
          <h1 className='font-bold capitalize'>Tx Pending...</h1>
          <h3 className='text-ic-gray-400 text-xs'>
            Waiting for onchain confirmation.
          </h3>
        </div>
        <p className='text-ic-gray-600 px-4 text-xs'>
          Your <span className='capitalize'>{type}</span>
        </p>
      </div>
      <div className='flex flex-col gap-4 p-4'>
        {[1, 2, 3, 4, 5].map((_, i) => (
          <SkeletonLoader
            key={`tx-confirm-skeleton-${i}`}
            className='h-6 w-full rounded-md'
          />
        ))}
      </div>
      <div className='m-4 space-y-2'>
        <Button
          disabled
          className={cn(
            'text-ic-black dark:text-ic-black w-full rounded-[10px] px-4 py-2 text-sm font-bold',
            'shadow-[0.5px_1px_2px_0_rgba(0,0,0,0.3)]',
            'bg-ic-gray-600 dark:bg-ic-gray-600',
          )}
        >
          Done
        </Button>
      </div>
    </>
  )
}

export function SubmissionResult({
  onClose: onModalClose,
}: {
  onClose: () => void
}) {
  const [recentTrade, setRecentTrade] = useAtom(tradeAtom)
  const [isPrivacyOn, setIsPrivacyOn] = useState(false)

  const onClose = useCallback(() => {
    if (recentTrade?.status === 'pending') {
      return
    }

    onModalClose()
    setRecentTrade(null)
  }, [recentTrade, setRecentTrade, onModalClose])

  const token = useMemo(() => {
    if (!recentTrade) return null

    return getTokenByChainAndAddress(
      recentTrade.chainId,

      recentTrade.transactionType === 'buy'
        ? recentTrade.outputTokenAddress
        : recentTrade.inputTokenAddress,
    ) as LeverageToken
  }, [recentTrade])

  const positionCloseData = usePositionData(recentTrade?.transactionHash ?? '')

  const isLoading = useMemo(() => {
    if (recentTrade) {
      return recentTrade.transactionType === 'buy'
        ? recentTrade.status === 'pending'
        : recentTrade.status === 'pending' || !positionCloseData
    }

    return false
  }, [recentTrade, positionCloseData])

  if (!recentTrade || !token) return null

  const leverageType = token.extensions.leverage.type

  return isLoading ? (
    <WaitingForConfirmation type={recentTrade.transactionType} />
  ) : (
    <>
      <div className='border-ic-gray-700 border-b'>
        <div className='my-4 text-center'>
          <h1 className='font-bold capitalize'>{recentTrade.status}</h1>
          <h3 className='text-ic-gray-400 text-xs'>
            {`Your transaction was ${recentTrade.status}${recentTrade.status === 'success' ? 'ful' : ''}.`}
          </h3>

          {positionCloseData && (
            <h1
              className={cn(
                'my-4 flex justify-center gap-1 font-bold',
                positionCloseData.pnl.sign === 1 && 'text-ic-blue-300',
                positionCloseData.pnl.sign === -1 && 'text-red-400',
                positionCloseData.pnl.sign === 0 && 'text-ic-white',
              )}
            >
              <span>{`You ${positionCloseData.pnl.sign > 0 ? 'made' : 'lost'}`}</span>
              <span
                className={cn(
                  'rounded-md transition-colors duration-300',
                  isPrivacyOn && 'bg-ic-gray-700 text-ic-gray-700',
                )}
              >{`${formatAmount(positionCloseData.pnl.value, recentTrade.underlyingAssetUnitPriceDenominator)} `}</span>
              <span>{`(${positionCloseData.pnl.percentage.toFixed(2)}%)`}</span>
              <span>{positionCloseData.pnl.sign > 0 ? '💯🔥' : '😅💀'}</span>
            </h1>
          )}
        </div>
        <p className='text-ic-gray-600 px-4 text-xs'>
          Your <span className='capitalize'>{recentTrade.transactionType}</span>
        </p>
      </div>
      <div className='flex flex-col gap-4 p-4'>
        <div className='text-ic-gray-500 flex justify-between text-xs'>
          <p>Market</p>
          <div className='text-ic-white flex gap-1 text-right'>
            <Image src={token.logoURI} alt='' width={12} height={12} />
            <p className='text-ic-blue-300'>
              {recentTrade.underlyingAssetSymbol}
            </p>
            /<p>{recentTrade.underlyingAssetUnitPriceDenominator}</p>
          </div>
        </div>
        <div className='text-ic-gray-500 flex justify-between text-xs'>
          <p>Leverage</p>
          <div
            className={cn(
              'text-right',
              ['Short1x'].includes(leverageType)
                ? 'text-red-400'
                : 'text-ic-blue-300',
            )}
          >
            {leverageShortTypeMap[leverageType]}
          </div>
        </div>

        <div className='text-ic-gray-500 flex justify-between text-xs'>
          {positionCloseData ? (
            <>
              <p>Avg. Entry Price</p>
              <p className='text-ic-gray-100 text-right'>
                {formatAmount(
                  positionCloseData.avgEntryPrice ?? 0,
                  recentTrade.underlyingAssetUnitPriceDenominator,
                )}
              </p>
            </>
          ) : (
            <>
              <p>{recentTrade.underlyingAssetSymbol} Price</p>
              <p className='text-ic-gray-100 text-right'>
                {formatAmount(
                  recentTrade.underlyingAssetUnitPrice ?? 0,
                  recentTrade.underlyingAssetUnitPriceDenominator,
                )}
              </p>
            </>
          )}
        </div>
        {positionCloseData && (
          <div className='text-ic-gray-500 flex justify-between text-xs'>
            <p> Exit Price</p>
            <p className='text-ic-gray-100 text-right'>
              {formatAmount(
                recentTrade.underlyingAssetUnitPrice ?? 0,
                recentTrade.underlyingAssetUnitPriceDenominator,
              )}
            </p>
          </div>
        )}

        {positionCloseData && (
          <div className='text-ic-gray-500 flex justify-between text-xs'>
            <p>rPnL</p>
            <div
              className={cn(
                'ml-4 flex flex-wrap justify-end gap-1 rounded-md transition-colors duration-300',
                positionCloseData.pnl.sign === 1 && 'text-ic-blue-300',
                positionCloseData.pnl.sign === -1 && 'text-red-400',
                positionCloseData.pnl.sign === 0 && 'text-ic-white',
                isPrivacyOn && 'bg-ic-gray-700 text-ic-gray-700',
              )}
            >
              <p>
                {`${positionCloseData.pnl.sign === 1 ? '+' : positionCloseData.pnl.sign === -1 ? '-' : ''} ${formatAmount(Math.abs(positionCloseData.pnl.value))}`}
              </p>
              <p className='hidden md:block'>{`(${positionCloseData.pnl.percentage.toFixed(2)}%)`}</p>
            </div>
          </div>
        )}

        <div className='text-ic-gray-500 flex justify-between text-xs'>
          <p>Size</p>
          <div className='text-ic-gray-100 flex gap-2 text-right'>
            <p
              className={cn(
                'rounded-md transition-colors duration-300',
                isPrivacyOn && 'bg-ic-gray-700 text-ic-gray-700',
              )}
            >
              {formatAmount(
                recentTrade.transactionType === 'buy'
                  ? recentTrade.inputTokenAmountUsd
                  : recentTrade.outputTokenAmountUsd,
              )}
            </p>
            <Button onClick={() => setIsPrivacyOn(!isPrivacyOn)}>
              {isPrivacyOn ? (
                <EyeIcon className='fill-ic-gray-500 w-4' />
              ) : (
                <EyeSlashIcon className='fill-ic-gray-500 w-4' />
              )}
            </Button>
          </div>
        </div>
      </div>
      <div className='m-4 space-y-2'>
        <Button
          onClick={onClose}
          className={cn(
            'text-ic-white dark:text-ic-black w-full rounded-[10px] px-4 py-2 text-sm font-bold',
            'shadow-[0.5px_1px_2px_0_rgba(0,0,0,0.3)]',
            'bg-ic-blue-600 dark:bg-ic-blue-300 hover:bg-ic-blue-700 dark:hover:bg-ic-blue-400',
          )}
        >
          Done
        </Button>
      </div>
    </>
  )
}
