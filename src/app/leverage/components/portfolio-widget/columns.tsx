import { Button } from '@headlessui/react'
import ExternalLinkIcon from '@heroicons/react/24/outline/ArrowTopRightOnSquareIcon'
import {
  getTokenByChainAndAddress,
  isLeverageToken,
  LeverageType,
} from '@indexcoop/tokenlists'
import { createColumnHelper } from '@tanstack/react-table'
import Image from 'next/image'
import { checksumAddress } from 'viem'
import * as chains from 'viem/chains'

import {
  GetApiV2UserAddressPositions200,
  GetApiV2UserAddressPositionsQueryResponse,
} from '@/gen'
import { useNetwork } from '@/lib/hooks/use-network'
import { cn } from '@/lib/utils/tailwind'

const columnsHelper =
  createColumnHelper<GetApiV2UserAddressPositionsQueryResponse[number]>()

const map: Record<LeverageType, string> = {
  Short1x: '-1x',
  Long2x: '2x',
  Long3x: '3x',
}

const currencyConfig: Record<
  string,
  { symbol: string; options: Intl.NumberFormatOptions }
> = {
  ETH: {
    symbol: 'Ξ',
    options: {
      maximumFractionDigits: 4,
      minimumFractionDigits: 4,
      currencyDisplay: 'symbol',
      currency: 'ETH',
      style: 'currency',
    },
  },
  BTC: {
    symbol: '₿',
    options: {
      maximumFractionDigits: 4,
      minimumFractionDigits: 4,
      currencyDisplay: 'symbol',
      currency: 'BTC',
      style: 'currency',
    },
  },
  USD: {
    symbol: '$',
    options: {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
      currencyDisplay: 'symbol',
      currency: 'USD',
      style: 'currency',
    },
  },
}

const formatAmount = (amount: number = 0, denominator?: unknown) => {
  if (!denominator || typeof denominator !== 'string') {
    return amount.toLocaleString(navigator.language, currencyConfig.USD.options)
  }

  const config = currencyConfig[denominator] ?? currencyConfig.USD

  return amount
    .toLocaleString(navigator.language, config.options)
    .replace(config.options.currency!, config.symbol)
}

const getTransferedTotal = (
  user?: string,
  unitPriceUsd: number = 0,
  transfers: Omit<GetApiV2UserAddressPositions200, 'trade' | 'metrics'> = [],
) => {
  return (
    transfers.reduce((acc, curr) => {
      if (curr.from.toLowerCase() === user?.toLowerCase()) {
        return acc - (curr.value ?? 0)
      } else if (curr.to?.toLowerCase === user) {
        return acc + (curr.value ?? 0)
      }

      return acc
    }, 0) * unitPriceUsd
  )
}

const getAction = (data: GetApiV2UserAddressPositionsQueryResponse[number]) => {
  if (!data.trade || !data.metrics) return 'Transfer'

  if (data.trade.transactionType === 'buy') {
    if (data.metrics.beginningUnits === 0) {
      return 'Open'
    } else {
      return 'Increase'
    }
  }

  if (
    data.trade.transactionType === 'sell' &&
    (data.metrics.endingUnits ?? 0) <= 0
  ) {
    return 'Close'
  }

  return 'Decrease'
}

const getLastBuy = (
  data: GetApiV2UserAddressPositionsQueryResponse[number],
  history: GetApiV2UserAddressPositionsQueryResponse = [],
) => {
  const txIndex = history.findIndex((h) => h.hash === data.hash)

  const lastBuy = history.slice(txIndex, history.length).find((h) => {
    const action = getAction(h)

    return (
      h.rawContract.address === data.rawContract?.address &&
      (action === 'Open' || action === 'Increase')
    )
  })

  return lastBuy
}

export const openPositionsColumns = [
  columnsHelper.accessor((row) => row, {
    id: 'portfolio-widget:open-positions.market',
    header: () => <div className='flex-[0.75] text-left'>Market</div>,
    cell: (row) => {
      const data = row.getValue()

      return (
        <div className='flex flex-[0.75] items-center gap-2 text-left'>
          <Image
            src={
              getTokenByChainAndAddress(
                data.metrics?.chainId,
                data.metrics?.tokenAddress,
              )?.logoURI ?? ''
            }
            width={16}
            height={16}
            alt=''
          />
          {`${data.trade?.underlyingAssetSymbol} / ${data.trade?.underlyingAssetUnitPriceDenominator}`}
        </div>
      )
    },
  }),
  columnsHelper.accessor((row) => row, {
    id: 'portfolio-widget:open-positions.strategy',
    header: () => <div className='flex-[0.5] text-center'>Strategy</div>,
    cell: (row) => {
      const data = row.getValue()

      const token =
        row.table.options.meta?.tokens[
          data.metrics?.tokenAddress ??
            checksumAddress(data.rawContract.address ?? '')
        ]

      if (isLeverageToken(token)) {
        const leverageType = token.extensions.leverage.type

        return (
          <div
            className={cn(
              'flex-[0.5] text-center',
              ['Short1x'].includes(leverageType)
                ? 'text-red-400'
                : 'text-ic-blue-300',
            )}
          >
            {map[leverageType]}
          </div>
        )
      }

      return <div className='flex-[0.5]' />
    },
  }),
  columnsHelper.accessor((row) => row, {
    id: 'portfolio-widget:open-positions.netBalance',
    header: () => <div className='flex-[0.75] text-right'>Net Balance</div>,
    cell: (row) => {
      const data = row.getValue()

      const token =
        row.table.options.meta?.tokens[data.metrics?.tokenAddress ?? '']

      if (!isLeverageToken(token)) return <></>

      return (
        <div className='flex-[0.75] text-right'>{formatAmount(token.usd)}</div>
      )
    },
  }),
  columnsHelper.accessor((row) => row, {
    id: 'portfolio-widget:open-positions.unrealisedPnL',
    header: () => <div className='flex-1 text-right'>Unrealised PnL</div>,
    cell: (row) => {
      const data = row.getValue()
      const user = row.table.options.meta?.user

      const token =
        row.table.options.meta?.tokens[data.metrics?.tokenAddress ?? '']

      if (!isLeverageToken(token) || !data.trade || !data.metrics)
        return <div className='flex-1 text-right'>-</div>

      const lastBuy = getLastBuy(data, row.table.options.meta?.history)

      const transferAmount = getTransferedTotal(
        user,
        lastBuy?.trade?.outputTokenPriceUsd,
        row.table.options.meta?.transfers,
      )

      const _return = token.usd ?? 0
      const cost =
        (data.metrics.endingAvgCostPerUnit ?? 0) *
        (data.metrics.endingUnits ?? 0)

      // Here we subtract the total transfer amount, because it has to be inversely corrected to exclude it from profit and loss
      const pnl = _return - transferAmount - cost
      const pnlPercentage = (pnl / cost) * 100
      const sign = Math.sign(pnl)

      return (
        <div
          className={cn(
            'flex-1 text-right',
            sign === 1 && 'text-ic-blue-300',
            sign === -1 && 'text-red-400',
            sign === 0 && 'text-ic-white',
          )}
        >
          {`${sign === 1 ? '+' : sign === -1 ? '-' : ''} ${formatAmount(Math.abs(pnl))} (${pnlPercentage.toFixed(2)}%)`}
        </div>
      )
    },
  }),
  columnsHelper.accessor((row) => row, {
    id: 'portfolio-widget:open-positions.entryPrice',
    header: () => <div className='flex-[0.75] text-right'>Entry Price</div>,
    cell: (row) => {
      const data = row.getValue()

      return (
        <div className='flex-[0.75] text-right'>
          {formatAmount(
            data.trade?.underlyingAssetUnitPrice ?? 0,
            data.trade?.underlyingAssetUnitPriceDenominator,
          )}
        </div>
      )
    },
  }),
  columnsHelper.accessor((row) => row, {
    id: 'portfolio-widget:open-positions.currentPrice',
    header: () => <div className='flex-[0.75] text-right'>Current Price</div>,
    cell: (row) => {
      const data = row.getValue()

      const token =
        row.table.options.meta?.tokens[data.metrics?.tokenAddress ?? '']

      if (isLeverageToken(token) && data.trade && data.metrics) {
        const price =
          (row.table.options.meta?.stats ?? []).find(
            ({ symbol }) => symbol === data.trade?.underlyingAssetSymbol,
          )?.price ?? 0

        return (
          <div className='flex-[0.75] text-right'>
            {formatAmount(
              price,
              data.trade.underlyingAssetUnitPriceDenominator,
            )}
          </div>
        )
      }

      return <div className='flex-[0.75] text-right'>-</div>
    },
  }),
  columnsHelper.accessor((row) => row, {
    id: 'portfolio-widget:open-positions.increase',
    header: () => (
      <div className='flex flex-1 items-center justify-end gap-4'>
        <div className='w-[50px] text-right'>Increase</div>
        <div className='w-[50px]'>Close</div>
      </div>
    ),
    cell: (row) => {
      const data = row.getValue()

      const token =
        row.table.options.meta?.tokens[data.metrics?.tokenAddress ?? '']

      if (!isLeverageToken(token)) return <></>

      return (
        <div className='flex flex-1 items-center justify-end gap-4'>
          <div className='flex w-[50px] justify-end'>
            <Button
              className='hover:bg-ic-dark flex size-[25px] items-center justify-center rounded-lg border border-white'
              onClick={() =>
                row.table.options.meta?.adjustPosition(true, token)
              }
            >
              +
            </Button>
          </div>
          <div className='w-[50px]'>
            <Button
              className='hover:bg-ic-dark flex size-[25px] items-center justify-center rounded-lg border border-white'
              onClick={() =>
                row.table.options.meta?.adjustPosition(false, token)
              }
            >
              -
            </Button>
          </div>
        </div>
      )
    },
  }),
]

export const historyColumns = [
  columnsHelper.accessor((row) => row, {
    id: 'portfolio-widget:history.market',
    header: () => <div className='flex-[0.75] text-left'>Market</div>,
    cell: (row) => {
      const data = row.getValue()
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { chainId: currentChainId } = useNetwork()

      return (
        <div className='flex flex-[0.75] items-center gap-2 text-left'>
          <Image
            src={
              getTokenByChainAndAddress(
                data.metrics?.chainId ?? currentChainId,
                data.metrics?.tokenAddress ?? data.rawContract.address,
              )?.logoURI ?? ''
            }
            width={16}
            height={16}
            alt=''
          />
          {data.trade
            ? `${data.trade?.underlyingAssetSymbol} / ${data.trade?.underlyingAssetUnitPriceDenominator}`
            : data.asset}
        </div>
      )
    },
  }),
  columnsHelper.accessor((row) => row, {
    id: 'portfolio-widget:history.strategy',
    header: () => <div className='flex-[0.5] text-center'>Strategy</div>,
    cell: (row) => {
      const data = row.getValue()

      const token =
        row.table.options.meta?.tokens[
          data.metrics?.tokenAddress ??
            checksumAddress(data.rawContract.address ?? '')
        ]

      if (isLeverageToken(token)) {
        const leverageType = token.extensions.leverage.type

        return (
          <div
            className={cn(
              'flex-[0.5] text-center',
              ['Short1x'].includes(leverageType)
                ? 'text-red-400'
                : 'text-ic-blue-300',
            )}
          >
            {map[leverageType]}
          </div>
        )
      }

      return <div className='flex-[0.5]' />
    },
  }),
  columnsHelper.accessor((row) => row, {
    id: 'portfolio-widget:history.action',
    header: () => <div className='flex-[0.5] text-center'>Action</div>,
    cell: (row) => {
      const data = row.getValue()

      return <div className='flex-[0.5] text-center'>{getAction(data)}</div>
    },
  }),
  columnsHelper.accessor((row) => row, {
    id: 'portfolio-widget:history.value',
    header: () => <div className='flex-1 text-right'>Value</div>,
    cell: (row) => {
      const data = row.getValue()

      if (data.trade) {
        const value =
          data.trade.transactionType === 'buy'
            ? data.trade.inputTokenAmountUsd
            : data.trade.outputTokenAmountUsd

        return (
          <div className='text-ic-blue-300 flex-1 text-right'>
            {formatAmount(value)}
          </div>
        )
      }

      const lastBuy = getLastBuy(data, row.table.options.meta?.history)

      return (
        <div className='text-ic-blue-300 flex-1 text-right'>
          {formatAmount(
            (data.value ?? 0) * (lastBuy?.trade?.underlyingAssetUnitPrice ?? 0),
          )}
        </div>
      )
    },
  }),
  columnsHelper.accessor((row) => row, {
    id: 'portfolio-widget:history.price',
    header: () => <div className='flex-1 text-right'>Price</div>,
    cell: (row) => {
      const data = row.getValue()

      const lastBuy = getLastBuy(data, row.table.options.meta?.history)

      return (
        <div className='flex-1 text-right'>
          {formatAmount(
            (data ?? lastBuy).trade?.underlyingAssetUnitPrice ?? 0,
            (data ?? lastBuy).trade?.underlyingAssetUnitPriceDenominator,
          )}
        </div>
      )
    },
  }),
  columnsHelper.accessor((row) => row, {
    id: 'portfolio-widget:history.realisedPnL',
    header: () => <div className='flex-1 text-right'>Realised PnL</div>,
    cell: (row) => {
      const data = row.getValue()

      const token =
        row.table.options.meta?.tokens[data.metrics?.tokenAddress ?? '']

      if (
        isLeverageToken(token) &&
        data.metrics &&
        data.trade?.transactionType === 'sell'
      ) {
        const _return = data.metrics.totalReturnOfUnitsSold ?? 0
        const cost = data.metrics.totalCostOfUnitsSold ?? 0

        const pnl = _return - cost
        const pnlPercentage = (pnl / cost) * 100
        const sign = Math.sign(pnl)

        return (
          <div
            className={cn(
              'flex-1 text-right',
              sign === 1 && 'text-ic-blue-300',
              sign === -1 && 'text-red-400',
              sign === 0 && 'text-ic-white',
            )}
          >
            {`${sign === 1 ? '+' : sign === -1 ? '-' : ''} ${formatAmount(Math.abs(pnl))} (${pnlPercentage.toFixed(2)}%)`}
          </div>
        )
      }

      return <div className='flex-1 text-right'>-</div>
    },
  }),
  columnsHelper.accessor((row) => row, {
    id: 'portfolio-widget:history.time',
    header: () => <div className='ml-8 flex-[0.75] text-left'>Time</div>,
    cell: (row) => {
      const data = row.getValue()

      return (
        <div className='ml-8 flex-[0.75] text-left'>
          {new Date(
            data.trade?.createdAt ?? data.metadata.blockTimestamp,
          ).toLocaleDateString(navigator.language, {
            year: '2-digit',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      )
    },
  }),
  columnsHelper.accessor((row) => row, {
    id: 'portfolio-widget:history.blockExplorer',
    header: () => <div className='flex-[0.25]' />,
    cell: (row) => {
      const data = row.getValue()

      const chain = Object.values(chains).find(
        (chain) => chain.id === data.trade?.chainId,
      )

      return (
        <Button
          className='flex flex-[0.25] justify-end'
          as='a'
          target='_blank'
          href={`${chain?.blockExplorers?.default.url}/tx/${data.hash}`}
        >
          <ExternalLinkIcon className='h-6 w-6' />
        </Button>
      )
    },
  }),
]
