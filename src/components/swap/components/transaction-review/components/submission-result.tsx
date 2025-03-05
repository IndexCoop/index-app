import { Button } from '@headlessui/react'
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/20/solid'
import {
  getTokenByChainAndAddress,
  isLeverageToken,
} from '@indexcoop/tokenlists'
import { useAtom } from 'jotai'
import Image from 'next/image'
import { useMemo, useState } from 'react'

import { formatAmount } from '@/app/leverage/utils/currency'
import { calculateAverageEntryPrice } from '@/app/leverage/utils/fetch-leverage-token-prices'
import { leverageShortTypeMap } from '@/app/leverage/utils/get-leverage-type'
import { positionsAtom } from '@/app/store/positions-atom'
import { tradeMachineAtom } from '@/app/store/trade-machine'
import { TradeButton } from '@/components/trade-button'
import { SkeletonLoader } from '@/lib/utils/skeleton-loader'
import { cn } from '@/lib/utils/tailwind'

const usePositionData = (transactionHash: string) => {
  const [{ history }] = useAtom(positionsAtom)

  const position = useMemo(
    () => history?.find((p) => p.hash === transactionHash),
    [history, transactionHash],
  )

  const positionData = useMemo(() => {
    if (!position) return null

    const _return = position.metrics?.totalReturnOfUnitsSold ?? 0
    const cost = position.metrics?.totalCostOfUnitsSold ?? 0

    if (cost <= 0 || _return === undefined) return null

    const value = _return - cost
    const percentage = (value / cost) * 100
    const sign = Math.sign(value)

    const avgEntryPrices = calculateAverageEntryPrice(
      history.filter(
        (p) => p.metrics?.positionId === position.metrics?.positionId,
      ),
    )

    const avgEntryPrice =
      avgEntryPrices[position.metrics?.tokenAddress ?? ''] ?? 0

    if (avgEntryPrice <= 0) return null

    return {
      pnl: {
        value,
        percentage,
        sign,
      },
      avgEntryPrice,
    }
  }, [position, history])

  return positionData
}

const WaitingForConfirmation = () => {
  return (
    <>
      <div className='border-ic-gray-700 border-b'>
        <div className='my-4 text-center'>
          <h1 className='text-ic-black dark:text-ic-white font-bold capitalize'>
            Tx Pending...
          </h1>
          <h3 className='text-ic-gray-600 dark:text-ic-gray-400 text-xs'>
            Waiting for onchain confirmation.
          </h3>
        </div>
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
  const [tradeState] = useAtom(tradeMachineAtom)
  const [isPrivacyOn, setIsPrivacyOn] = useState(false)

  const trade = useMemo(() => tradeState.context.trade, [tradeState])

  const token = useMemo(() => {
    if (!trade) return null

    return getTokenByChainAndAddress(
      trade.chainId,

      trade.transactionType === 'buy'
        ? trade.outputTokenAddress
        : trade.inputTokenAddress,
    )
  }, [trade])

  const positionCloseData = usePositionData(
    tradeState.context.trade?.transactionHash ?? '',
  )

  switch (tradeState.value) {
    case 'pending':
      return <WaitingForConfirmation />
    case 'success':
      return trade && isLeverageToken(token) ? (
        <>
          <div className='border-ic-gray-700 border-b'>
            <div className='my-4 text-center'>
              <h1 className='font-bold capitalize'>
                {tradeState.context.transactionStatus}
              </h1>
              <h3 className='text-ic-gray-400 text-xs'>
                {`Your transaction was ${tradeState.context.transactionStatus}${tradeState.context.transactionStatus === 'success' ? 'ful' : ''}.`}
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
                  >{`${formatAmount(positionCloseData.pnl.value, trade.underlyingAssetUnitPriceDenominator)} `}</span>
                  <span>{`(${positionCloseData.pnl.percentage.toFixed(2)}%)`}</span>
                  <span>{positionCloseData.pnl.sign > 0 ? '💯🔥' : ''}</span>
                </h1>
              )}
            </div>
            <p className='text-ic-gray-600 px-4 text-xs'>
              Your <span className='capitalize'>{trade.transactionType}</span>
            </p>
          </div>
          <div className='flex flex-col gap-4 p-4'>
            <div className='text-ic-gray-500 flex justify-between text-xs'>
              <p>Market</p>
              <div className='text-ic-white flex gap-1 text-right'>
                <Image src={token.logoURI} alt='' width={12} height={12} />
                <p className='text-ic-blue-300'>
                  {trade.underlyingAssetSymbol}
                </p>
                /<p>{trade.underlyingAssetUnitPriceDenominator}</p>
              </div>
            </div>
            <div className='text-ic-gray-500 flex justify-between text-xs'>
              <p>Leverage</p>
              <div
                className={cn(
                  'text-right',
                  ['Short1x'].includes(token.extensions.leverage.type)
                    ? 'text-red-400'
                    : 'text-ic-blue-300',
                )}
              >
                {leverageShortTypeMap[token.extensions.leverage.type]}
              </div>
            </div>

            <div className='text-ic-gray-500 flex justify-between text-xs'>
              {positionCloseData ? (
                <>
                  <p>Avg. Entry Price</p>
                  <p className='text-ic-gray-100 text-right'>
                    {formatAmount(
                      positionCloseData.avgEntryPrice ?? 0,
                      trade.underlyingAssetUnitPriceDenominator,
                    )}
                  </p>
                </>
              ) : (
                <>
                  <p>{trade.underlyingAssetSymbol} Price</p>
                  <p className='text-ic-gray-100 text-right'>
                    {formatAmount(
                      trade.underlyingAssetUnitPrice ?? 0,
                      trade.underlyingAssetUnitPriceDenominator,
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
                    trade.underlyingAssetUnitPrice ?? 0,
                    trade.underlyingAssetUnitPriceDenominator,
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
                    trade.transactionType === 'buy'
                      ? trade.inputTokenAmountUsd
                      : trade.outputTokenAmountUsd,
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
              onClick={onModalClose}
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
      ) : (
        <div className='flex flex-col items-center'>
          <div className='flex flex-col items-center p-4'>
            <CheckCircleIcon className='dark:text-ic-white text-ic-black size-7' />
            <div className='text-ic-black dark:text-ic-white p-4 text-center text-xl'>
              You successfully submitted the transaction.
            </div>
          </div>
          <TradeButton
            isDisabled={false}
            isLoading={false}
            label={'Done'}
            onClick={onModalClose}
          />
        </div>
      )

    case 'failed':
      return (
        <div className='flex flex-col items-center'>
          <div className='flex flex-col items-center p-4'>
            <ExclamationCircleIcon className='dark:text-ic-white text-ic-black size-7' />
            <div className='text-ic-black dark:text-ic-white p-4 text-center text-xl'>
              Submitting the transaction was cancelled or failed.
            </div>
          </div>
          <TradeButton
            isDisabled={false}
            isLoading={false}
            label={'Done'}
            onClick={onModalClose}
          />
        </div>
      )
    default:
      return null
  }
}
